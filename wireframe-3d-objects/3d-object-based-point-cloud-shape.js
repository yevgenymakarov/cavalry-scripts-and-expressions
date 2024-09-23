/* {cavalry javascript shape} */

/*
  3D Object-Based Point Cloud
  Draws three-dimensional dots sized and colored depending on depth.

  https://en.wikipedia.org/wiki/3D_projection
  https://en.wikipedia.org/wiki/Rotation_matrix
*/

(function drawObject() {
  var angle_x = 20.0,          /* rotation angles */
      angle_y = -10.0,
      angle_z = 0.0;

  var offset_x = 0.0,          /* offset deltas */
      offset_y = 0.0,
      offset_z = 6.0;

  var zoom = 800.0;            /* field of view */
  var orthographic = false;    /* use orthographic projection */

  var radius = 20.0;           /* base point size */

  var depth_min = 8.6,         /* depth range remapping */
      depth_max = 4.2;

  /* Define a list of vertices. */
  var points = [
    [0.0, 1.0, 1.618],
    [0.0, 1.0, -1.618],
    [0.0, -1.0, -1.618],
    [0.0, -1.0, 1.618],
    [1.0, 1.618, 0.0],
    [-1.0, 1.618, 0.0],
    [-1.0, -1.618, 0.0],
    [1.0, -1.618, 0.0],
    [1.618, 0.0, 1.0],
    [1.618, 0.0, -1.0],
    [-1.618, 0.0, -1.0],
    [-1.618, 0.0, 1.0]
  ];

  let mesh = new cavalry.Mesh();

  let radians = Math.PI / 180;
  let ax = angle_x * radians, ay = angle_y * radians, az = angle_z * radians;

  let cx = Math.cos(ax), cy = Math.cos(ay), cz = Math.cos(az);
  let sx = Math.sin(ax), sy = Math.sin(ay), sz = Math.sin(az);

  /* Basic 3D rotations. */
  let rx = ([x, y, z]) => [x, cx * y - sx * z, sx * y + cx * z];
  let ry = ([x, y, z]) => [cy * x + sy * z, y, -sy * x + cy * z];
  let rz = ([x, y, z]) => [cz * x - sz * y, sz * x + cz * y, z];

  /* General 3D rotation. */
  let rotate = (v) => rx(ry(rz(v)));

  /* Offset in 3D space. */
  let move = ([x, y, z]) => [x + offset_x, y + offset_y, z + offset_z];

  /* Weak perspective projection. */
  let perspective = ([x, y, z]) => [x * zoom / z, y * zoom / z, z];

  /* Simple orthographic projection. */
  let parallel = ([x, y, z]) => [x * zoom, y * zoom, z];

  /* Get 2D point. */
  let project = (p) => orthographic ? parallel(p) : perspective(p);

  /* Get transformed 2D point. */
  let get2Dpoint = (p) => project(move(rotate(p)));

  /* Sorting by depth. */
  let sortByDepth = (a, b) => b[2] - a[2];

  /* Value remapping to a 0:1 range. */
  let normalize = (value, min, max) => (value - min) / (max - min);

  let draw = (point) => {
    let [x, y, z] = point;
    let factor = normalize(z, depth_min, depth_max);

    if (factor < 0) return;

    let color = cavalry.hsvToHex(0, 0, 1 - factor);
    let size = radius * factor;

    let material = new cavalry.Material();
    material.fillColor = color;

    let path = new cavalry.Path();
    path.addEllipse(x, y, size, size);

    mesh.addPath(path, material);
  }

  points.map(get2Dpoint).sort(sortByDepth).forEach(draw);

  return mesh;
})();
