/* {cavalry javascript shape} */

/*
  Catmull-Rom Curve
  Draws a Catmull-Rom curve.

  https://pomax.github.io/bezierinfo/
  https://github.com/Pomax/bezierjs
*/

(function drawCurve() {
  var n0 = {x: -530, y: -90},
      n1 = {x: -400, y: 60},
      n2 = {x: -180, y: -140},
      n3 = {x: -20, y: 150},
      n4 = {x: 210, y: -60},
      n5 = {x: 470, y: 140};

  var points = [n0, n1, n2, n3, n4, n5];    /* control points */
  var tension = 1.0;                        /* scaling factor for tangent vectors */
  var steps = 20;                           /* number of samples */

  const p = points, n = points.length;

  let path = new cavalry.Path();
  path.moveTo(p[0].x, p[0].y);
  path.lineTo(p[1].x, p[1].y);

  for (let i = 1, e = n - 2; i < e; i++) {
    let p0 = p[i-1], p1 = p[i+0], p2 = p[i+1], p3 = p[i+2];

    let s = 2 * tension,
        m1 = {x: (p2.x - p0.x) / s, y: (p2.y - p0.y) / s},
        m2 = {x: (p3.x - p1.x) / s, y: (p3.y - p1.y) / s};

    for (let i = 1; i <= steps; i++) {
      let t = i / steps;

      let c = 2*t**3 - 3*t**2,
          c0 = c + 1,
          c1 = t**3 - 2*t**2 + t,
          c2 = -c,
          c3 = t**3 - t**2;

      path.lineTo(
        c0 * p1.x + c1 * m1.x + c2 * p2.x + c3 * m2.x,
        c0 * p1.y + c1 * m1.y + c2 * p2.y + c3 * m2.y
      )
    }
  }

  path.lineTo(p[n-1].x, p[n-1].y);

  return path;
})();
