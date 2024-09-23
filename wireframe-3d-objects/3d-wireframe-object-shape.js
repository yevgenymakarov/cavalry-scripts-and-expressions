/* {cavalry javascript shape} */

/*
  3D Wireframe Object
  Draws a three-dimensional geometry as a wireframe.

  https://en.wikipedia.org/wiki/3D_projection
  https://en.wikipedia.org/wiki/Rotation_matrix
*/

(function drawObject() {
  var angle_x = 10.0,         /* rotation angles */
      angle_y = 20.0,
      angle_z = 0.0;

  var offset_x = 0.0,         /* offset deltas */
      offset_y = 0.0,
      offset_z = 10.0;

  var zoom = 200.0;           /* field of view */
  var orthographic = true;    /* use orthographic projection */

  /* Define a list of vertices. */
  var points = [
    [1.0, 0.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, -1.0, 0.0],
    [0.0, 0.0, 1.0],
    [0.0, 0.0, -1.0]
  ];

  /* Define open paths with 2 or more vertex IDs. */
  var edges = [
    [0, 1],
    [2, 3],
    [4, 5]
  ];

  /* Define closed paths with 3 or more vertex IDs. */
  var faces = [
    [0, 2, 1, 3],
    [3, 5, 2, 4],
    [4, 1, 5, 0]
  ];

  let path = new cavalry.Path();

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
  let perspective = ([x, y, z]) => [x * zoom / z, y * zoom / z];

  /* Simple orthographic projection. */
  let parallel = ([x, y, z]) => [x * zoom, y * zoom];

  /* Get 2D point. */
  let project = (p) => orthographic ? parallel(p) : perspective(p);

  /* Get transformed 2D point. */
  let get2Dpoint = (p) => project(move(rotate(p)));

  let draw = (e, i, a) => {
    e.forEach((p, n) => {
      let point = get2Dpoint(points[p]);
      (n == 0) ? path.moveTo(...point) : path.lineTo(...point);
    });

    if (a == faces) path.close();
  }

  edges.forEach(draw);
  faces.forEach(draw);

  return path;
})();
