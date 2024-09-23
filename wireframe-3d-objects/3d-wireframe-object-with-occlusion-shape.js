/* {cavalry javascript shape} */

/*
  3D Wireframe Object (Occlusion Culling)
  Draws a three-dimensional geometry as a wireframe with back-face culling.

  https://en.wikipedia.org/wiki/3D_projection
  https://en.wikipedia.org/wiki/Rotation_matrix
*/

(function drawObject() {
  var angle_x = -10.0,        /* rotation angles */
      angle_y = 30.0,
      angle_z = 0.0;

  var offset_x = 0.0,         /* offset deltas */
      offset_y = 0.0,
      offset_z = 10.0;

  var zoom = 200.0;           /* field of view */
  var orthographic = true;    /* use orthographic projection */

  var color = "eef2f2f2";     /* face fill color */

  /* Define a list of vertices. */
  var points = [
    [0.809, 0.263, 0.5],
    [0.809, 0.263, -0.5],
    [-0.809, 0.263, 0.5],
    [-0.809, 0.263, -0.5],
    [0.5, -0.688, 0.5],
    [0.5, -0.688, -0.5],
    [-0.5, -0.688, 0.5],
    [-0.5, -0.688, -0.5],
    [0.0, 0.851, 0.5],
    [0.0, 0.851, -0.5]
  ];

  /* Define faces with 3 or more vertex IDs. */
  var faces = [
    [0, 8, 2, 6, 4],
    [1, 5, 7, 3, 9],
    [0, 1, 9, 8],
    [8, 9, 3, 2],
    [2, 3, 7, 6],
    [6, 7, 5, 4],
    [4, 5, 1, 0]
  ];

  let mesh = new cavalry.Mesh();

  let material = new cavalry.Material();
  material.fillColor = color;

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
  let sortByDepth = (a, b) => {
    let j = 0, k = 0, l = a.length, n = b.length;
    for (let i = 0; i < l; i++) {
      j += points[a[i]][2];
    }
    for (let i = 0; i < n; i++) {
      k += points[b[i]][2];
    }
    return k / n - j / l;
  };

  let draw = (f) => {
    let path = new cavalry.Path();
    f.forEach((p, n) => {
      let [x, y, z] = points[p];
      (n == 0) ? path.moveTo(x, y) : path.lineTo(x, y);
    });
    path.close();
    mesh.addPath(path, material);
  }

  points = points.map(get2Dpoint);
  faces.sort(sortByDepth).forEach(draw);

  return mesh;
})();
