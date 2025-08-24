/* {cavalry javascript shape} */

/*
  Circle Shape
  Draws a circle with a specified number of control points.

  https://github.com/Pomax/bezierjs
  https://pomax.github.io/bezierinfo/
*/

(function circle() {
  var points = 5;        /* number of points */
  var radius = 100.0;    /* circle radius */

  var scale = 1.0;       /* oval scale */
  var rotate = 45.0;     /* oval rotation */

  const { cos, sin, tan } = Math;
  const pi = Math.PI;

  let theta = (2 * pi) / points;
  let handle_length = 4/3 * tan(theta / 4);

  let path = new cavalry.Path();
  path.moveTo(0, radius);

  for (let i = 0; i < points; i++) {
    let t = theta * i + pi/2;

    let x = radius * cos(t);
    let y = radius * sin(t);

    let x1 = x - y * handle_length;
    let y1 = y + x * handle_length;

    t += theta;

    x = radius * cos(t);
    y = radius * sin(t);

    let x2 = x + y * handle_length;
    let y2 = y - x * handle_length;

    path.cubicTo(x1, y1, x2, y2, x, y);
  }

  path.close();

  if (scale != 1) {
    path.scale(scale, 1);
    path.rotate(rotate);
  }

  return path;
})();
