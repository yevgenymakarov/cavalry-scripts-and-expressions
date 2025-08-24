/* {cavalry javascript shape} */

/*
  Curve Through Three Points
  Draws a cubic Bézier curve passing through three given points.

  https://github.com/Pomax/bezierjs
  https://pomax.github.io/bezierinfo/
*/

(function drawCurve() {
  var n0 = {x: 160, y: 240};    /* start point */
  var n1 = {x: 450, y: 350};    /* middle point */
  var n2 = {x: 600, y: 100};    /* end point */

  function curveFromPoints(s, b, e) {
    let c1 = { x: 4/3 * b.x - 1/3 * e.x,
               y: 4/3 * b.y - 1/3 * e.y },
        c2 = { x: 4/3 * b.x - 1/3 * s.x,
               y: 4/3 * b.y - 1/3 * s.y };
    return [s, c1, c2, e];
  }

  let path = new cavalry.Path();
  let pts = curveFromPoints(n0, n1, n2);

  path.moveTo(pts[0].x, pts[0].y);
  path.cubicTo(pts[1].x, pts[1].y, pts[2].x, pts[2].y, pts[3].x, pts[3].y);

  return path;
})();
