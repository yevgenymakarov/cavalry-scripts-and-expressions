/* {cavalry javascript shape} */

/*
  Smooth Corners (Figma Approximation)
  Draws a rectangle with smooth rounded corners.

  Copyright 2021 MartinRGB

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  https://github.com/MartinRGB/Figma_Squircles_Approximation/blob/master/js/rounded-corners.js
*/

(function figmaSmoothCorners() {
  var width = 500.0;         /* width */
  var height = 500.0;        /* height */

  var radius = 100.0;        /* radius */
  var smoothness = 50.0;     /* smoothness */

  var topleft = true;        /* top left corner */
  var topright = true;       /* top right corner */
  var bottomleft = true;     /* bottom left corner */
  var bottomright = true;    /* bottom right corner */

  const { min, max, cos, sin, tan, pow } = Math;
  const pi = Math.PI;

  let path = new cavalry.Path();

  let r = radius;
  let s = smoothness;

  let w = width, h = height;
  let w2 = width/2, h2 = height/2;

  r = min(max(r, 0), min(w2, h2));
  s = min(max(s, 0), 100);
  s = s / 100;

  const pi2 = pi/2, pi4 = pi/4;
  let shortest = min(w, h);

  let alpha, beta, theta;
  if (r > shortest/4) {
    let change = (r - shortest/4) / (shortest/4);
    alpha = pi4 * s * (1 - change);
    beta = pi2 * (1 - s * (1 - change));
  } else {
    alpha = pi4 * s;
    beta = pi2 * (1 - s);
  }
  theta = (pi2 - beta) / 2;

  let p = min(shortest/2, (1 + s) * r);
  let l = sin(beta / 2) * r * pow(2, 1/2);
  let c = r * tan(theta / 2) * cos(alpha);
  let d = c * tan(alpha);
  let b = ((p - l) - (1 + tan(alpha)) * c) / 3;
  let a = 2 * b;

  let pa = p - a;
  let pb = pa - b;
  let pc = pb - c;

  let wi = min(w2, p);
  let wa = max(w2, w - p);
  let hi = min(h2, p);
  let ha = max(h2, h - p);

  let f = r * 4/3 * tan(beta / 4);
  let fs = f * sin(theta);
  let fc = f * cos(theta);

  if (!bottomright) {
    path.moveTo(w2, -h2);
  }
  else {
    path.moveTo(-w2 + wa, -h2);
    path.cubicTo(w2 - pa, -h2, w2 - pb, -h2, w2 - pc, -h2 + d);
    path.cubicTo(w2 - pc + fc, -h2 + d + fs, w2 - d - fs, -h2 + d + l - fc, w2 - d, -h2 + d + l);
    path.cubicTo(w2, -h2 + pb, w2, -h2 + pa, w2, -h2 + hi);
  }

  if (!topright) {
    path.lineTo(w2, h2);
  }
  else {
    path.lineTo(w2, -h2 + ha);
    path.cubicTo(w2, h2 - pa, w2, h2 - pb, w2 - d, h2 - pc);
    path.cubicTo(w2 - d - fs, h2 - pc + fc, w2 - d - l + fc, h2 - d - fs, w2 - d - l, h2 - d);
    path.cubicTo(w2 - pb, h2, w2 - pa, h2, -w2 + wa, h2);
  }

  if (!topleft) {
    path.lineTo(-w2, h2);
  }
  else {
    path.lineTo(-w2 + wi, h2);
    path.cubicTo(-w2 + pa, h2, -w2 + pb, h2, -w2 + pc, h2 - d);
    path.cubicTo(-w2 + pc - fc, h2 - d - fs, -w2 + d + fs, h2 - d - l + fc, -w2 + d, h2 - d - l);
    path.cubicTo(-w2, h2 - pb, -w2, h2 - pa, -w2, -h2 + ha);
  }

  if (!bottomleft) {
    path.lineTo(-w2, -h2);
  }
  else {
    path.lineTo(-w2, -h2 + hi);
    path.cubicTo(-w2, -h2 + pa, -w2, -h2 + pb, -w2 + d, -h2 + pc);
    path.cubicTo(-w2 + d + fs, -h2 + pc - fc, -w2 + d + l - fc, -h2 + d + fs, -w2 + d + l, -h2 + d);
    path.cubicTo(-w2 + pb, -h2, -w2 + pa, -h2, -w2 + wi, -h2);
  }

  path.close();

  return path;
})();
