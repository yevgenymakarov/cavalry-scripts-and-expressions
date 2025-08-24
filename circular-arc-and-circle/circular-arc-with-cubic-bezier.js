/* {cavalry javascript shape} */

/*
  Arc with Cubic Bézier
  Draws a circular arc with a cubic Bézier curve.

  https://github.com/Pomax/bezierjs
  https://pomax.github.io/bezierinfo/
*/

(function drawArc() {
  var start = 45.0;      /* start angle in degrees */
  var end = 90.0;        /* end angle in degrees */
  var radius = 300.0;    /* radius */

  const radian = Math.PI / 180;

  function circularArc(r, a, b) {
    let angle = b - a;
    let f = 4/3 * Math.tan(angle / 4);

    let ca = r * Math.cos(a);
    let sa = r * Math.sin(a);
    let cb = r * Math.cos(b);
    let sb = r * Math.sin(b);

    let s = { x: ca, y: sa };
    let c1 = { x: ca - f * sa, y: sa + f * ca };
    let c2 = { x: cb + f * sb, y: sb - f * cb };
    let e = { x: cb, y: sb };

    return [s, c1, c2, e];
  }

  let path = new cavalry.Path();
  let pts = circularArc(radius, start * radian, end * radian);

  path.moveTo(pts[0].x, pts[0].y);
  path.cubicTo(pts[1].x, pts[1].y, pts[2].x, pts[2].y, pts[3].x, pts[3].y);

  return path;
})();
