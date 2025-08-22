/* {cavalry javascript shape} */

/*
  Cubic Bézier Curve
  Draws a weighted cubic Bézier in the range.

  https://pomax.github.io/bezierinfo/
  https://github.com/Pomax/bezierjs
*/

(function drawCurve() {
  var n0 = {x: -500, y: -60},
      n1 = {x: -120, y: -230},
      n2 = {x: 10, y: 320},
      n3 = {x: 460, y: 60};
  var n4 = 1.0,
      n5 = 1.0,
      n6 = 1.0,
      n7 = 1.0;

  var points = [n0, n1, n2, n3];    /* control points */
  var ratios = [n4, n5, n6, n7];    /* weights of each point */
  var steps = 20;                   /* number of samples */
  var min = 0.0,                    /* draw curve in range */
      max = 1.0;

  function cubic(t, p, r) {
    let mt = 1 - t,
      mt2 = mt * mt,
      t2 = t * t,
      a = r[0] * mt2 * mt,
      b = r[1] * mt2 * t * 3,
      c = r[2] * mt * t2 * 3,
      d = r[3] * t * t2,
      basis = a + b + c + d;
    let ret = {
      x: (a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x) / basis,
      y: (a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y) / basis
    };
    return ret;
  }

  let path = new cavalry.Path();
  let s = cubic(min, points, ratios);
  path.moveTo(s.x, s.y);

  for (let i = 1; i <= steps; i++) {
    let t = (i / steps) * (max - min) + min;
    let pt = cubic(t, points, ratios);
    path.lineTo(pt.x, pt.y);
  }

  return path;
})();
