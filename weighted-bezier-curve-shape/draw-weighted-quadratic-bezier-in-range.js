/* {cavalry javascript shape} */

/*
  Quadratic Bézier Curve
  Draws a weighted quadratic Bézier in the range.

  https://pomax.github.io/bezierinfo/
  https://github.com/Pomax/bezierjs
*/

(function drawCurve() {
  var n0 = {x: -320, y: -50},
      n1 = {x: -50, y: 300},
      n2 = {x: 250, y: -40};
  var n3 = 1.0,
      n4 = 1.0,
      n5 = 1.0;

  var points = [n0, n1, n2];    /* control points */
  var ratios = [n3, n4, n5];    /* weights of each point */
  var steps = 20;               /* number of samples */
  var min = 0.0,                /* draw curve in range */
      max = 1.0;

  function quadratic(t, p, r) {
    let mt = 1 - t,
      a = r[0] * mt * mt,
      b = r[1] * mt * t * 2,
      c = r[2] * t * t,
      basis = a + b + c;
    let ret = {
      x: (a * p[0].x + b * p[1].x + c * p[2].x) / basis,
      y: (a * p[0].y + b * p[1].y + c * p[2].y) / basis
    };
    return ret;
  }

  let path = new cavalry.Path();
  let s = quadratic(min, points, ratios);
  path.moveTo(s.x, s.y);

  for (let i = 1; i <= steps; i++) {
    let t = (i / steps) * (max - min) + min;
    let pt = quadratic(t, points, ratios);
    path.lineTo(pt.x, pt.y);
  }

  return path;
})();
