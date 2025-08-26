/* {cavalry javascript deformer} */

/*
  Smooth Fisheye Function
  A visually more appealing fisheye function.

  Copyright 2018 Benjamin F. Maier

  https://github.com/benmaier/fisheye
*/

var r = 300.0;    /* radius */
var d = 3.0;      /* magnification (d > 0) */
var xw = 0.4;     /* demagnification width (0 < xw < 1) */

var focus = {x: 0, y: 0};    /* focus point */

var continuous = true;    /* smooth mode */
var inverse = false;      /* inverse mode */

var points = def.getPoints();

var { abs, sqrt, pow, sin, cos, atan2 } = Math;

var A1 = 0, A2 = 1;

if (xw > 0 && xw < 1) {
  let a = pow(xw, 2) / 2;
  let b = 1 - (d + 1) * xw / (d * xw + 1);
  let c = -(d + 1) / pow(d * xw + 1, 2);
  let v = 1 - xw;
  let det = a * c - b * xw;

  A1 = (c * v + b) / det;
  A2 = -(xw * v + a) / det;
}

for (let pt of points) {
  if ((xw == 1 || d == 0) && continuous) {
    continue;
  }

  let dx = pt.x - focus.x;
  let dy = pt.y - focus.y;

  let dr = sqrt(pow(dx, 2) + pow(dy, 2));

  if (abs(dr) > r || dr == 0) {
    continue;
  }

  let new_r, rescaled = dr / r;
  let theta = atan2(dy, dx);

  if (continuous) {
    if (inverse) {
      if (rescaled <= 1 - xw) {
        new_r = A2 * rescaled / (d * (1 - rescaled) + 1);
      } else {
        new_r = rescaled - A1 / 2 * pow(1 - rescaled, 2);
      }
    } else {
      var xc = 1 - (A1 / 2 * pow(xw, 2) + xw);
      if (rescaled <= xc) {
        new_r = (rescaled * (d + 1)) / (d * rescaled + A2);
      } else {
        new_r = 1 - (sqrt(1 / pow(A1, 2) + 2 * (1 - rescaled) / A1) - 1 / A1);
      }
    }
  } else {
    if (inverse) {
      new_r = 1 - (d + 1) * (1 - rescaled) / (d * (1 - rescaled) + 1);
    } else {
      new_r = (d + 1) * rescaled / (d * rescaled + 1);
    }
  }

  pt.x = focus.x + cos(theta) * r * new_r;
  pt.y = focus.y + sin(theta) * r * new_r;
}

def.setPoints(points);
