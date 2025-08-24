/* {cavalry javascript shape} */

/*
  A Circle Through Three Points
  Draws a circle through three given points.
*/

(function threePointsCircle() {
  var pt1 = {x: 200, y: 100};    /* first point */
  var pt2 = {x: 250, y: 300};    /* second point */
  var pt3 = {x: 400, y: 150};    /* third point */

  let m1x = (pt1.x + pt2.x) / 2,
      m1y = (pt1.y + pt2.y) / 2,
      m2x = (pt3.x + pt2.x) / 2,
      m2y = (pt3.y + pt2.y) / 2;

  let v1x = pt1.x - pt2.x,
      v1y = pt1.y - pt2.y,
      v2x = pt2.x - pt3.x,
      v2y = pt2.y - pt3.y;

  let a = (v2x * (m2x - m1x) + v2y * (m2y - m1y))
        / (v1y * v2x - v1x * v2y);

  let cx = m1x + a * v1y,
      cy = m1y - a * v1x;

  let dx = cx - pt1.x,
      dy = cy - pt1.y;

  let rad = Math.sqrt(dx * dx + dy * dy);

  let path = new cavalry.Path();
  path.addEllipse(cx, cy, rad, rad);

  return path;
})();
