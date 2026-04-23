"""
Blender Parts Extractor — Cratos pilot.

Runs inside Blender 5.1 (paste into the Scripting tab and hit Run).

For each master.blend listed in JOBS, this script:
  1. Opens the .blend
  2. Classifies each mesh object into a canonical role (top, leg_l, leg_r,
     modesty, pedestal, cable_tray, cable_spine, grommet, feet, screen_front,
     screen_side, frame_beam, handle, unknown) using material + name + geometry
     heuristics
  3. Captures each object's world transform (location + rotation + scale)
  4. Exports each object alone to its own GLB under
     public/3d-parts/{family}/{role}/{config}.glb  (or for accessories,
     public/3d-parts/accessories/{role}-{hash}.glb keyed by geometry hash)
  5. Writes a per-family manifest.json mapping Config -> parts -> glb + anchor

Run once per family. Each new master landing in 04_assets/ = one re-run
appends new configs to the manifest without touching existing entries.

Backdrop/floor objects (materials in BACKDROP_MATS) are skipped entirely.
"""
import bpy
import hashlib
import json
import os

# ---------------------------------------------------------------------------
# CONFIG — what to extract. Add a (blend_path, family, config) tuple per master.
# ---------------------------------------------------------------------------
HQ_ROOT = r"C:\Users\Admin\Desktop\Majestic-HQ\projects\majestic-3d\04_assets"
NEXT_OUT = r"C:\Users\Admin\Desktop\Majestic-Next\public\3d-parts"

JOBS_ALL = [
    (rf"{HQ_ROOT}\cratos\DESK-CRATOS-EXEC-v2\master.blend", "cratos", "Executive"),
    (rf"{HQ_ROOT}\cratos\DESK-CRATOS-MGR\master.blend",     "cratos", "Manager"),
    (rf"{HQ_ROOT}\cratos\DESK-CRATOS-CONF\master.blend",    "cratos", "Conference"),
    (rf"{HQ_ROOT}\cratos\DESK-CRATOS-L\master.blend",       "cratos", "L-Shape"),
    # Simple family onboarding 2026-04-21 (protocol §4 flow)
    (rf"{HQ_ROOT}\simple\DESK-SIMPLE-L\master.blend",          "simple", "L-Shape"),
    (rf"{HQ_ROOT}\simple\DESK-SIMPLE-MGR\master.blend",        "simple", "Manager"),
    (rf"{HQ_ROOT}\simple\DESK-SIMPLE-OPR\master.blend",        "simple", "Operator"),
    (rf"{HQ_ROOT}\simple\MTG-SIMPLE-4P\master.blend",          "simple", "Meeting 4-Person"),
    (rf"{HQ_ROOT}\simple\MTG-SIMPLE-10P\master.blend",         "simple", "Meeting 10-Person"),
    (rf"{HQ_ROOT}\simple\SYS-SIMPLE-WS-4P\master.blend",       "simple", "Workstation 4-Person"),
    (rf"{HQ_ROOT}\simple\TBL-SIMPLE-COFFEE-1000\master.blend", "simple", "Coffee Table (1000)"),
    (rf"{HQ_ROOT}\simple\TBL-SIMPLE-COFFEE-500\master.blend",  "simple", "Coffee Table (500)"),
    # Newton family onboarding 2026-04-23 (fresh Max re-export after clean-slate reset)
    # HA is a 2P back-to-back workstation (Aziz-confirmed). Open-Frame is single-desk.
    (rf"{HQ_ROOT}\newton\SYS-NEWTON-HA\master.blend",          "newton", "Height-Adjustable"),
    (rf"{HQ_ROOT}\newton\newton-openframe\master.blend",       "newton", "Open-Frame"),
    # Beauty credenza onboarding 2026-04-23 — one base design, wood-on-wood two-tone
    # (top wood axis + new base wood axis). Objects renamed to canonical roles
    # in a Gate 2.5 pre-extraction pass.
    (rf"{HQ_ROOT}\beauty\CRED-BEAUTY-SHELF\master.blend",      "beauty", "Shelf Credenza"),
    # Tesla meeting-table onboarding 2026-04-23 — tulip 4-corner-leg 4-person
    # meeting table. One config. Vendor Chinese names renamed via Gate 2.5 script
    # (tesla_rename_roles.py).
    (rf"{HQ_ROOT}\tesla\MTG-TESLA-4P\master.blend",            "tesla", "Meeting 4-Person"),
]

# Filter via env var: ONLY_FAMILY=newton runs just that family's masters.
# Unset / empty = all families. Used during single-family iteration to avoid
# churning Draco compression of untouched GLBs (draco is non-deterministic).
_only = os.environ.get("ONLY_FAMILY", "").strip().lower()
JOBS = [j for j in JOBS_ALL if (not _only) or j[1].lower() == _only]
if _only:
    print(f"ONLY_FAMILY={_only!r} — running {len(JOBS)} / {len(JOBS_ALL)} jobs")

# ---------------------------------------------------------------------------
# Role classifier — maps (material_name, object_name, bbox, position) -> role.
# The order matters: first match wins. BACKDROP_MATS are filtered earlier.
# ---------------------------------------------------------------------------
BACKDROP_MATS = {
    "Floor_Gradient", "FloorMat", "Floor", "Backdrop", "Studio_Floor",
    "Ground", "floor", "backdrop", "studio_floor",
    "Cyc_GradientFloor", "Cyc_Floor",  # Simple family studio rigs
}

# Role inference rules. Each rule = (predicate fn, role name).
# Predicates receive (obj, mat_names_lower, name_lower, bbox).
def _has_kw(s, *kw):
    return any(k in s for k in kw)

def _classify(obj, mat_names_lower, name_lower, bbox):
    # Floor/backdrop already filtered upstream.
    # Base panel (credenza body: wood axis separate from top — check BEFORE top rule
    # because the material keyword "oak" matches both top and base on wood-on-wood
    # families like Beauty).
    if name_lower == "base" or name_lower.startswith("base_"):
        return "base"
    # Top: material mentions desktop/top/oak/walnut OR name; flat and wide + bbox Z thin
    if _has_kw(name_lower, "desktop", "top", "surface") or \
       any(_has_kw(m, "desktop", "oak", "walnut") for m in mat_names_lower):
        # additionally require flat-ish geometry (Z < 0.15m, X*Y area > 0.5m²)
        dx, dy, dz = bbox
        if dz < 0.15 and dx * dy > 0.3:
            return "top"
    # Leg — vertical and paired. Split left/right by X sign of origin.
    if _has_kw(name_lower, "leg", "box311", "box312", "box313") or \
       any(_has_kw(m, "leg", "frame_white", "frame_black", "chrome") for m in mat_names_lower):
        dx, dy, dz = bbox
        if dz > 0.3:  # tall
            return "leg_l" if obj.location.x < 0 else "leg_r"
    # Modesty — thin vertical panel usually behind the desk
    if _has_kw(name_lower, "modesty") or any(_has_kw(m, "modesty") for m in mat_names_lower):
        return "modesty"
    # Pedestal — drawer unit. Object or material mentions pedestal/drawer.
    if _has_kw(name_lower, "pedestal", "drawer", "ped_") or \
       any(_has_kw(m, "pedestal", "drawer") for m in mat_names_lower):
        if _has_kw(name_lower, "top"):
            return "pedestal_top"
        if _has_kw(name_lower, "handle"):
            return "pedestal_handle"
        return "pedestal"
    # Cable tray / spine
    if _has_kw(name_lower, "cable_tray", "cabletray", "tray"):
        return "cable_tray"
    if _has_kw(name_lower, "cable_spine", "spine", "vertebra"):
        return "cable_spine"
    if _has_kw(name_lower, "grommet") or any(_has_kw(m, "grommet") for m in mat_names_lower):
        return "grommet"
    # Screen divider (workstation dividers — includes Newton's back-to-back privacy screen)
    if _has_kw(name_lower, "screen_panel", "divider_front", "screen_front", "screen_divider"):
        return "screen_front"
    if _has_kw(name_lower, "screen_side", "divider_side"):
        return "screen_side"
    # Frame beam (horizontal crossbar between legs)
    if _has_kw(name_lower, "frame_beam", "beam", "crossbar"):
        return "frame_beam"
    # Leveling feet
    if _has_kw(name_lower, "foot", "leveling"):
        return "feet"
    # Handle
    if _has_kw(name_lower, "handle"):
        return "handle"

    # ------------------------------------------------------------------
    # GEOMETRY-BASED FALLBACK — for vendor-named objects (Line1320, Box3057, …)
    # Added 2026-04-21 to handle Simple family whose objects carry no keyword.
    # Tuned further same day after first triage pass.
    # Order matters: most-specific first.
    # ------------------------------------------------------------------
    dx, dy, dz = bbox
    wz = obj.matrix_world.translation.z
    # Leveling foot: small cube under the desk (loosened: dz<=0.06 to catch 50mm height)
    if dx < 0.08 and dy < 0.08 and dz <= 0.06:
        return "feet"
    # Grommet / cable port cover: flat (dz<0.02), smallish (area<0.05 m²)
    if dz < 0.02 and dx < 0.45 and dy < 0.45 and max(dx, dy) > 0.1:
        return "grommet"
    # Drawer handle: long thin bar, small cross-section
    if max(dx, dy) < 0.30 and min(dx, dy) < 0.05 and dz < 0.05 and wz > 0.05:
        return "handle"
    # Desktop: wide flat plank with thin Z (loosened: >= 0.25 m² area)
    if dz < 0.05 and dx * dy >= 0.25:
        # If attached to a wood material, it's clearly a top
        if any("oak" in m or "wood" in m or "veneer" in m or "vicenza" in m or "dakota" in m or "premium" in m for m in mat_names_lower):
            return "top"
        # Otherwise still treat as top (flat horizontal plank at desk height OR near origin for parametric builds)
        if wz > 0.35 or (0.4 < dz + 0.6 and wz >= 0.0):  # catches Coffee-500 Desktop at z~0.5
            return "top"
        if wz > 0.25:
            return "top"
    # Leg: tall upright, narrow cross-section
    if dz > 0.3 and max(dx, dy) < 0.15:
        return "leg_l" if obj.matrix_world.translation.x < 0 else "leg_r"
    # Leg frame (U-shape, H-shape): tall, one dim moderate, one dim thin
    # Widened max to 1.5m to catch Simple family's full-depth H-frames (1370mm wide)
    if dz > 0.3 and min(dx, dy) < 0.1 and max(dx, dy) < 1.5:
        return "leg_l" if obj.matrix_world.translation.x < 0 else "leg_r"
    # Full-chassis frame (Newton HA goalpost or Open-Frame T-frame — fused vendor mesh
    # that spans a full desk or 2P workstation). Tall + wide in both dims.
    # Distinct from U/H-frames by having min(dx,dy) > 0.3 (bulky, not thin tube).
    if dz > 0.4 and max(dx, dy) > 0.5 and min(dx, dy) > 0.3:
        return "leg_l" if obj.matrix_world.translation.x < 0 else "leg_r"
    # Pedestal wall (tall thin vertical panel — 500-600mm tall, <0.03m thick)
    if dz > 0.3 and dz < 0.7 and min(dx, dy) < 0.03 and max(dx, dy) > 0.4:
        return "pedestal"
    # Pedestal top / shelf (wide flat panel, 10-25mm thick, mid-size area 0.2-1.5 m²)
    if 0.01 < dz < 0.03 and 0.3 < dx < 2.0 and 0.3 < dy < 2.0 and 0.1 < dx * dy < 2.0:
        return "pedestal_top"
    # Frame beam (horizontal crossbar under the desktop) — dropped strict Z-height
    # window since parent transforms sometimes push world Z out of the frame zone.
    if dz < 0.08 and max(dx, dy) > 0.5 and min(dx, dy) < 0.12:
        return "frame_beam"
    # Modesty panel: thin vertical under-desk panel
    if dz > 0.15 and dz < 0.5 and min(dx, dy) < 0.04 and max(dx, dy) > 0.4:
        return "modesty"
    # Thin rectangular panel: likely drawer front or cabinet side
    if dz > 0.1 and dz < 0.25 and min(dx, dy) < 0.04:
        return "pedestal"
    # Support bracket: long horizontal element with moderate Z
    # (50x785x115 on L-Shape, 50x780x110 on Manager — L-desk return supports)
    if dz < 0.20 and max(dx, dy) > 0.5 and min(dx, dy) < 0.08:
        return "frame_beam"

    # Still nothing matched — genuine UNKNOWN.
    return "unknown"


# ---------------------------------------------------------------------------
# Utility — geometry hash for dedup across configs/families
# ---------------------------------------------------------------------------
def geometry_hash(obj):
    """Hash of vertex positions (rounded), so identical parts dedupe."""
    if obj.type != "MESH":
        return None
    me = obj.data
    h = hashlib.sha1()
    me.calc_loop_triangles()
    for v in me.vertices:
        h.update(f"{v.co.x:.4f},{v.co.y:.4f},{v.co.z:.4f};".encode())
    for p in me.polygons:
        for vi in p.vertices:
            h.update(f"{vi},".encode())
    return h.hexdigest()[:12]


def bbox_extents(obj):
    if obj.type != "MESH":
        return (0.0, 0.0, 0.0)
    coords = [obj.matrix_world @ v.co for v in obj.data.vertices]
    if not coords:
        return (0.0, 0.0, 0.0)
    xs = [c.x for c in coords]
    ys = [c.y for c in coords]
    zs = [c.z for c in coords]
    return (max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))


def find_view3d_area():
    for window in bpy.context.window_manager.windows:
        for area in window.screen.areas:
            if area.type == "VIEW_3D":
                return window, area
    return None, None


# ---------------------------------------------------------------------------
# Per-object GLB export
# ---------------------------------------------------------------------------
def export_object_glb(obj, out_path):
    """Export a single object to its own GLB. Transforms applied so anchor is origin."""
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    # Force Object Mode before select ops — otherwise select_all fails if a
    # prior operation left us in Edit / Sculpt / etc. (bpy.ops.object.select_all
    # requires OBJECT mode as the calling context).
    if bpy.context.mode != "OBJECT":
        try:
            bpy.ops.object.mode_set(mode="OBJECT")
        except RuntimeError:
            pass  # no active object yet — OK, select_all still works
    # Deselect all, select only this object, make it active
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    window, area = find_view3d_area()
    override = {
        "active_object": obj,
        "selected_objects": [obj],
        "view_layer": bpy.context.view_layer,
        "scene": bpy.context.scene,
    }
    if window and area:
        override.update({"window": window, "screen": window.screen, "area": area})

    with bpy.context.temp_override(**override):
        bpy.ops.export_scene.gltf(
            filepath=out_path,
            export_format="GLB",
            use_selection=True,
            export_draco_mesh_compression_enable=True,
            export_draco_mesh_compression_level=6,
            export_apply=True,
            export_yup=True,
            # Texture compression — keeps GLBs < 500KB even with embedded wood swatches
            export_image_format="JPEG",
            export_jpeg_quality=85,
        )
    return os.path.getsize(out_path)


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------
def process_master(blend_path, family, config, family_manifest):
    print(f"\n=== {family}/{config} — {os.path.basename(blend_path)} ===")
    bpy.ops.wm.open_mainfile(filepath=blend_path)

    # --- PREPROCESS (added 2026-04-21 per protocol §4 fix) ---
    # 1. Resize any embedded texture > 1024px so GLBs stay < 500 KB.
    for img in bpy.data.images:
        if img.size and (img.size[0] > 1024 or img.size[1] > 1024):
            print(f"  resize {img.name}: {img.size[0]}x{img.size[1]} -> 1024x1024")
            img.scale(1024, 1024)
    # 2. Apply transforms on every mesh so world coords are baked in and
    #    obj.matrix_world.translation == true anchor. Fixes Simple-family
    #    stale-matrix-world bug (top_1 reporting Z=28m, handles at X=25m).
    bpy.ops.object.select_all(action="DESELECT")
    for obj in list(bpy.context.view_layer.objects):
        if obj.type != "MESH":
            continue
        obj.select_set(True)
    if bpy.context.selected_objects:
        bpy.context.view_layer.objects.active = bpy.context.selected_objects[0]
        try:
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        except RuntimeError as e:
            print(f"  transform_apply skipped: {e}")
    bpy.context.view_layer.update()

    roles_found = {}  # role -> [(obj, anchor, bbox, geom_hash), ...]
    unknowns = []

    for obj in list(bpy.context.view_layer.objects):
        if obj.type != "MESH":
            continue

        mat_names = [
            (slot.material.name if slot.material else "")
            for slot in obj.material_slots
        ]
        # Skip backdrops (by material name)
        if any(m in BACKDROP_MATS for m in mat_names):
            continue
        # Skip studio-rig elements by NAME — Cyc floor, gradient, backdrop sphere.
        # Covers cases where the Gate 2 agent renamed the backdrop material and the
        # material-set filter above missed it. Any object named "Cyc..." is studio,
        # not product.
        if obj.name.lower().startswith("cyc") or obj.name.lower().startswith("backdrop"):
            continue

        mat_names_lower = [m.lower() for m in mat_names]
        name_lower = obj.name.lower()
        bbox = bbox_extents(obj)
        role = _classify(obj, mat_names_lower, name_lower, bbox)

        # World-space anchor (transforms applied so obj.location may now be zero
        # but matrix_world.translation still carries original positions for
        # parented meshes).
        w = obj.matrix_world.translation

        if role == "unknown":
            unknowns.append({
                "name": obj.name,
                "materials": mat_names,
                "bbox": [round(x, 3) for x in bbox],
                "location": [round(w.x, 3), round(w.y, 3), round(w.z, 3)],
            })
            continue

        # Anchor = (0,0,0). The GLB carries world-coord geometry because
        # export_apply=True in export_scene.gltf() bakes transforms. The viewer
        # places every part at origin and composes via the baked geometry — same
        # pattern Cratos uses. Keeping the anchor at zero avoids the
        # "pre-transform-applied object ends up shifted twice" class of bug.
        anchor = [0.0, 0.0, 0.0]
        gh = geometry_hash(obj)
        roles_found.setdefault(role, []).append((obj, anchor, bbox, gh))

    # Export each role's objects. For paired roles (leg_l/leg_r) keep separate.
    # For single-instance roles with multiple objects (e.g. 4 leveling feet), merge them.
    config_parts = {}
    for role, entries in roles_found.items():
        if len(entries) == 1:
            obj, anchor, bbox, gh = entries[0]
            # Accessories dedupe into a shared folder by geometry hash.
            if role in {"modesty", "pedestal", "cable_tray", "cable_spine", "screen_front", "screen_side", "grommet"}:
                rel = f"accessories/{role}-{gh}.glb"
            else:
                rel = f"{family}/{role}/{config.lower().replace(' ', '-')}.glb"
            out = os.path.join(NEXT_OUT, rel.replace("/", os.sep))
            size = export_object_glb(obj, out)
            config_parts[role] = {
                "glb": "/3d-parts/" + rel,
                "anchor": anchor,
                "bbox": [round(x, 3) for x in bbox],
                "bytes": size,
                "hash": gh,
            }
            print(f"  {role:<14s}  {size:>7,} bytes  anchor={anchor}")
        else:
            # Multiple objects for same role — export each with an index suffix
            for i, (obj, anchor, bbox, gh) in enumerate(entries):
                suffix_role = f"{role}_{i}"
                rel = f"{family}/{suffix_role}/{config.lower().replace(' ', '-')}.glb"
                out = os.path.join(NEXT_OUT, rel.replace("/", os.sep))
                size = export_object_glb(obj, out)
                config_parts[suffix_role] = {
                    "glb": "/3d-parts/" + rel,
                    "anchor": anchor,
                    "bbox": [round(x, 3) for x in bbox],
                    "bytes": size,
                    "hash": gh,
                }
                print(f"  {suffix_role:<14s}  {size:>7,} bytes  anchor={anchor}")

    # Heuristic default size from top's bbox (cm, rounded to 10)
    base_size = None
    if "top" in config_parts:
        bx = config_parts["top"]["bbox"]
        base_size = f"{int(round(bx[0] * 100, -1))}x{int(round(bx[1] * 100, -1))}"

    family_manifest["configs"][config] = {
        "parts": config_parts,
        "baseSize": base_size,
        "unknowns": unknowns,
    }

    if unknowns:
        print(f"  NOTE: {len(unknowns)} unclassified objects — review and extend the classifier rules:")
        for u in unknowns[:5]:
            print(f"    - {u['name']}  mats={u['materials']}  bbox={u['bbox']}")
        if len(unknowns) > 5:
            print(f"    ... and {len(unknowns) - 5} more")


# ---------------------------------------------------------------------------
# Drive
# ---------------------------------------------------------------------------
family_manifests = {}
for blend_path, family, config in JOBS:
    manifest = family_manifests.setdefault(family, {
        "family": family,
        "generated_at": "",
        "configs": {},
    })
    try:
        process_master(blend_path, family, config, manifest)
    except Exception as e:
        print(f"FAILED {family}/{config}: {e}")
        import traceback; traceback.print_exc()

# Write manifests
import datetime
for family, manifest in family_manifests.items():
    manifest["generated_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    out_path = os.path.join(NEXT_OUT, family, "manifest.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"\nMANIFEST: {out_path}")

print("\nDONE.")
