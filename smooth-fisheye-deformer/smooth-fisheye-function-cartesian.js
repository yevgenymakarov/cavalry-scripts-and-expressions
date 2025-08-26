/* {cavalry javascript deformer} */

/*
  Smooth Cartesian Function
  A visually more appealing fisheye function.

  Copyright 2018 Benjamin F. Maier

  https://github.com/benmaier/fisheye
*/

var r = 600.0;    /* radius */
var d = 2.0;      /* magnification (d > 0) */
var xw = 0.4;     /* demagnification width (0 < xw < 1) */

var focus = {x: 0, y: 0};    /* focus point */

var continuous = true;    /* smooth mode */
var inverse = false;      /* inverse mode */
var use_range = true;     /* range mode */

var points = def.getPoints();
var bbox = def.getBoundingBox();

var range_x = [bbox.left, bbox.right];
var range_y = [bbox.bottom, bbox.top];

var { abs, sign, sqrt, pow } = Math;

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

function fisheye(x, focus, range) {
  if ((xw == 1 || d == 0) && continuous) {
    return x;
  }

  let dx = x - focus;

  if (abs(dx) > r || x == focus) {
    return x;
  }

  let dmax = r;

  if (use_range) {
    if ((dx > 0) && (range[1] - focus < r)) {
      dmax = range[1] - focus;
    } else if ((dx < 0) && (focus - range[0] < r)) {
      dmax = focus - range[0];
    }
  }

  let new_r, rescaled = abs(dx) / dmax;

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

  return focus + sign(dx) * dmax * new_r;
}

for (let pt of points) {
  pt.x = fisheye(pt.x, focus.x, range_x);
  pt.y = fisheye(pt.y, focus.y, range_y);
}

def.setPoints(points);
