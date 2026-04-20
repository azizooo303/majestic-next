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

JOBS = [
    (rf"{HQ_ROOT}\cratos\DESK-CRATOS-EXEC-v2\master.blend", "cratos", "Executive"),
    (rf"{HQ_ROOT}\cratos\DESK-CRATOS-MGR\master.blend",     "cratos", "Manager"),
    (rf"{HQ_ROOT}\cratos\DESK-CRATOS-CONF\master.blend",    "cratos", "Conference"),
    (rf"{HQ_ROOT}\cratos\DESK-CRATOS-L\master.blend",       "cratos", "L-Shape"),
]

# ---------------------------------------------------------------------------
# Role classifier — maps (material_name, object_name, bbox, position) -> role.
# The order matters: first match wins. BACKDROP_MATS are filtered earlier.
# ---------------------------------------------------------------------------
BACKDROP_MATS = {
    "Floor_Gradient", "FloorMat", "Floor", "Backdrop", "Studio_Floor",
    "Ground", "floor", "backdrop", "studio_floor",
}

# Role inference rules. Each rule = (predicate fn, role name).
# Predicates receive (obj, mat_names_lower, name_lower, bbox).
def _has_kw(s, *kw):
    return any(k in s for k in kw)

def _classify(obj, mat_names_lower, name_lower, bbox):
    # Floor/backdrop already filtered upstream.
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
    # Screen divider (workstation dividers)
    if _has_kw(name_lower, "screen_panel", "divider_front", "screen_front"):
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
    # Fallback — couldn't classify, report as unknown so the human can add a rule
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
        )
    return os.path.getsize(out_path)


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------
def process_master(blend_path, family, config, family_manifest):
    print(f"\n=== {family}/{config} — {os.path.basename(blend_path)} ===")
    bpy.ops.wm.open_mainfile(filepath=blend_path)

    roles_found = {}  # role -> [(obj, anchor, bbox, geom_hash), ...]
    unknowns = []

    for obj in list(bpy.context.view_layer.objects):
        if obj.type != "MESH":
            continue

        mat_names = [
            (slot.material.name if slot.material else "")
            for slot in obj.material_slots
        ]
        # Skip backdrops
        if any(m in BACKDROP_MATS for m in mat_names):
            continue

        mat_names_lower = [m.lower() for m in mat_names]
        name_lower = obj.name.lower()
        bbox = bbox_extents(obj)
        role = _classify(obj, mat_names_lower, name_lower, bbox)

        if role == "unknown":
            unknowns.append({
                "name": obj.name,
                "materials": mat_names,
                "bbox": [round(x, 3) for x in bbox],
                "location": [round(obj.location.x, 3), round(obj.location.y, 3), round(obj.location.z, 3)],
            })
            continue

        anchor = [round(obj.location.x, 4), round(obj.location.y, 4), round(obj.location.z, 4)]
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
