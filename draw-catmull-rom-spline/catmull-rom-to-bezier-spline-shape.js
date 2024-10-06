/* {cavalry javascript shape} */

/*
  Catmull-Rom Spline
  Draws a Catmull-Rom spline using Bézier curves.
*/

function addCatmullRom(path, pts, close) {
  let len = pts.length;
  let length = close ? len : len - 1;

  path.moveTo(pts[0].x, pts[0].y);

  for (let i = 0; i < length; i++) {
    let p = [pts[i-1], pts[i], pts[i+1], pts[i+2]];

    if (i == 0) {
      p[0] = close ? pts[len-1] : pts[0];
    } else if (i == len - 2) {
      p[3] = close ? pts[0] : p[2];
    } else if (i == len - 1 && close) {
      p[2] = pts[0];
      p[3] = pts[1];
    }

    path.cubicTo(
      p[1].x + (p[2].x - p[0].x) / 6,
      p[1].y + (p[2].y - p[0].y) / 6,
      p[2].x + (p[1].x - p[3].x) / 6,
      p[2].y + (p[1].y - p[3].y) / 6,
      p[2].x,
      p[2].y
    );
  }
}

(function drawCatmullRomSpline() {
  let n0 = {x: -530, y: -90},
      n1 = {x: -400, y: 60},
      n2 = {x: -180, y: -140},
      n3 = {x: -20, y: 150},
      n4 = {x: 210, y: -60},
      n5 = {x: 470, y: 140};

  let points = [n0, n1, n2, n3, n4, n5];

  let path = new cavalry.Path();

  addCatmullRom(path, points, false);

  return path;
})();
