(
  /*
    Da Vinci Max-only configurator export.

    Source of truth:
      C:\Users\Admin\Desktop\Majestic-HQ\projects\majestic-3d\02_source\max\davinci\davinci collections.max

    This script intentionally classifies objects from the loaded .max scene
    by their original positions/material groups only. No FBX/Blend/proposal
    files are read.
  */

  local outRoot = @"C:\Users\Admin\Desktop\Majestic-HQ\tmp\davinci-max-only-site-export"
  local partsRoot = outRoot + @"\3d-parts\davinci"
  makeDir partsRoot all:true

  local logPath = partsRoot + @"\parts.tsv"
  local logFile = createFile logPath

  fn safeText v = (
    local s = v as string
    s = substituteString s "\t" " "
    s = substituteString s "\n" " "
    s = substituteString s "\r" " "
    s
  )

  fn matName obj = (
    if obj.material == undefined then "" else safeText obj.material.name
  )

  fn bboxWorld obj = (
    local b = nodeGetBoundingBox obj (matrix3 1)
    #(b[1], b[2])
  )

  fn centerOf obj = (
    local b = bboxWorld obj
    (b[1] + b[2]) / 2.0
  )

  fn dimsOf obj = (
    local b = bboxWorld obj
    b[2] - b[1]
  )

  fn validDims obj = (
    local d = dimsOf obj
    d.x > 0.05 and d.y > 0.05 and d.z >= 0 and d.x < 10000 and d.y < 10000 and d.z < 10000
  )

  fn inBox p xmin xmax ymin ymax zmin zmax = (
    p.x >= xmin and p.x <= xmax and p.y >= ymin and p.y <= ymax and p.z >= zmin and p.z <= zmax
  )

  fn roleSlug s = (
    local out = toLower (safeText s)
    out = substituteString out " " "-"
    out = substituteString out "(" ""
    out = substituteString out ")" ""
    out = substituteString out "/" "-"
    out
  )

  fn configSlug config = (
    case config of
    (
      "Executive": "executive"
      "L-Shape": "l-shape"
      "Meeting": "meeting"
      "Tall Credenza": "tall-credenza"
      "Workstation": "workstation"
      default: roleSlug config
    )
  )

  fn baseSizeFor config = (
    case config of
    (
      "Executive": "210x90"
      "L-Shape": "220x90"
      "Meeting": "220x120"
      "Tall Credenza": "166x46"
      "Workstation": "274x140"
      default: "CUSTOM"
    )
  )

  fn matIs obj m = ((matName obj) == m)

  fn isLTop obj = (
    local nm = toLower (safeText obj.name)
    local d = dimsOf obj
    local c = centerOf obj
    nm == "box181954" or
    nm == "box1619" or
    (findString nm "tapa superior001" != undefined) or
    (d.z <= 3.6 and d.x > 45 and d.y > 35 and c.z > 60)
  )

  fn executiveRole obj = (
    if not (validDims obj) then return undefined
    local c = centerOf obj
    if not (inBox c 4600 4905 -235 -35 -5 100) then return undefined

    if matIs obj "Material #986" or matIs obj "Material #987" then "feet"
    else if matIs obj "Material #990" or matIs obj "Material #991" or matIs obj "Global" then "frame_beam"
    else if (toLower (safeText obj.name)) == "box013" or matIs obj "Material #985" then "top"
    else if matIs obj "Material #988" or matIs obj "Material #989" then "body"
    else undefined
  )

  fn lShapeRole obj = (
    if not (validDims obj) then return undefined
    local c = centerOf obj
    if not (inBox c 3600 3960 -410 -130 -5 100) then return undefined

    if matIs obj "Material #1035" or matIs obj "Material #1038" then "frame_beam"
    else if matIs obj "Material #1040" or matIs obj "Material #1041" or matIs obj "Material #1042" or matIs obj "Material #1043" then (
      if c.z > 25 then "handle" else "feet"
    )
    else if isLTop obj then "top"
    else if matIs obj "Material #1036" or matIs obj "Material #1037" or matIs obj "Material #1039" or matIs obj "Material #43" then "body"
    else undefined
  )

  fn meetingRole obj = (
    if not (validDims obj) then return undefined
    local c = centerOf obj
    if not (inBox c 4200 4510 -335 -180 -5 100) then return undefined
    local nm = toLower (safeText obj.name)

    if nm == "box181926" or nm == "box181952" then "top"
    else if matIs obj "Material #1029" then "frame_beam"
    else if matIs obj "Material #1030" or matIs obj "Material #1031" then "grommet"
    else undefined
  )

  fn storageRole obj = (
    if not (validDims obj) then return undefined
    local c = centerOf obj
    if not (inBox c 4850 5060 0 80 -5 190) then return undefined
    local nm = toLower (safeText obj.name)

    if matIs obj "Material #1027" then "feet"
    else if nm == "box003" then "top"
    else if matIs obj "Material #985" or matIs obj "Material #988" or matIs obj "Material #989" or matIs obj "Material #1025" or matIs obj "Material #1026" then "base"
    else undefined
  )

  fn workstationRole obj = (
    if not (validDims obj) then return undefined
    local c = centerOf obj
    if not (inBox c 5100 5470 -830 -75 -5 120) then return undefined
    local nm = toLower (safeText obj.name)

    if findString nm "vitra_ad" == 1 then "top"
    else if nm == "box181955" or nm == "box181956" then "screen_front"
    else if matIs obj "Material #1044" or matIs obj "Material #1045" then "grommet"
    else if matIs obj "Material #1046" or matIs obj "Material #71" or matIs obj "Material #94" then "frame_beam"
    else undefined
  )

  fn roleFor config obj = (
    case config of
    (
      "Executive": executiveRole obj
      "L-Shape": lShapeRole obj
      "Meeting": meetingRole obj
      "Tall Credenza": storageRole obj
      "Workstation": workstationRole obj
      default: undefined
    )
  )

  fn addRoleObject role obj roleGroups = (
    local idx = 0
    for i = 1 to roleGroups.count where roleGroups[i][1] == role do idx = i
    if idx == 0 do (
      append roleGroups #(role, #())
      idx = roleGroups.count
    )
    append roleGroups[idx][2] obj
  )

  fn roleOrderIndex role = (
    case role of
    (
      "top": 10
      "base": 20
      "body": 30
      "frame_beam": 40
      "feet": 50
      "handle": 60
      "grommet": 70
      "screen_front": 80
      default: 999
    )
  )

  fn compareRoleGroup a b = (
    local aa = roleOrderIndex a[1]
    local bb = roleOrderIndex b[1]
    if aa < bb then -1 else if aa > bb then 1 else 0
  )

  fn groupBounds objs = (
    local mn = [1e9,1e9,1e9]
    local mx = [-1e9,-1e9,-1e9]
    for obj in objs do (
      local b = bboxWorld obj
      mn.x = amin mn.x b[1].x; mn.y = amin mn.y b[1].y; mn.z = amin mn.z b[1].z
      mx.x = amax mx.x b[2].x; mx.y = amax mx.y b[2].y; mx.z = amax mx.z b[2].z
    )
    #(mn, mx)
  )

  fn joinSourceNames objs = (
    local out = ""
    for i = 1 to objs.count do (
      out += safeText objs[i].name
      if i < objs.count do out += " | "
    )
    out
  )

  fn exportRole config role objs origin = (
    local slug = configSlug config
    local roleDir = partsRoot + "\\" + role
    makeDir roleDir all:true
    local outPath = roleDir + "\\" + slug + ".glb"
    local snaps = #()

    for obj in objs do (
      local snap = snapshot obj
      snap.name = role + "_" + ((snaps.count + 1) as string) + "_" + safeText obj.name
      snap.material = obj.material
      snap.pos = snap.pos - origin
      append snaps snap
    )

    clearSelection()
    select snaps
    try (
      exportFile outPath #noPrompt selectedOnly:true using:GLTF_Export
    ) catch (
      format "EXPORT_ERROR\t%\t%\t%\n" config role (getCurrentException()) to:logFile
    )
    for snap in snaps do delete snap
    clearSelection()

    local b = groupBounds objs
    local d = b[2] - b[1]
    local url = "/3d-parts/davinci/" + role + "/" + slug + ".glb"
    format "%\t%\t%\t%\t%\t%\t%\t%\t%\n" config slug (baseSizeFor config) role url (d.x / 100.0) (d.y / 100.0) (d.z / 100.0) (joinSourceNames objs) to:logFile
  )

  fn exportConfig config = (
    local roleGroups = #()
    local allObjs = #()

    for obj in geometry do (
      local role = roleFor config obj
      if role != undefined do (
        append allObjs obj
        addRoleObject role obj roleGroups
      )
    )

    if allObjs.count == 0 then (
      format "EMPTY\t%\n" config to:logFile
      return false
    )

    qsort roleGroups compareRoleGroup
    local b = groupBounds allObjs
    local origin = (b[1] + b[2]) / 2.0
    origin.z = 0

    for rg in roleGroups do exportRole config rg[1] rg[2] origin
    true
  )

  format "config\tslug\tbase_size\trole\turl\tbbox_x\tbbox_y\tbbox_z\tsource_objects\n" to:logFile

  exportConfig "Executive"
  exportConfig "L-Shape"
  exportConfig "Meeting"
  exportConfig "Tall Credenza"
  exportConfig "Workstation"

  close logFile
)
