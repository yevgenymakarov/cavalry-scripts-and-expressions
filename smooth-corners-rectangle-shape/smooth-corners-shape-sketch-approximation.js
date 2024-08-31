/* {cavalry javascript shape} */

/*
  Smooth Corners (Sketch Approximation)
  Draws a rectangle with smooth rounded corners.

  Copyright 2018 MartinRGB

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

  https://github.com/MartinRGB/sketch-smooth-corner-android/
  https://github.com/MartinRGB/sketch-smooth-corner-web/blob/master/js/rounded-corners.js
*/

(function sketchSmoothCorners() {
  var width = 500.0;         /* width */
  var height = 500.0;        /* height */

  var radius = 100.0;        /* radius */

  var topleft = true;        /* top left corner */
  var topright = true;       /* top right corner */
  var bottomleft = true;     /* bottom left corner */
  var bottomright = true;    /* bottom right corner */

  const { min, max } = Math;

  let path = new cavalry.Path();

  let r = radius;

  let w = width, h = height;
  let w2 = width/2, h2 = height/2;

  r = min(max(r, 0), min(w2, h2));
  r = r / 100;

  let r1 = r * 4.64;
  let r2 = r * 13.36;
  let r3 = r * 22.07;
  let r4 = r * 34.86;
  let r5 = r * 51.16;
  let r6 = r * 67.45;
  let r7 = r * 83.62;
  let r8 = r * 128.19;

  let wi = min(w2, r8);
  let wa = max(w2, w - r8);
  let hi = min(h2, r8);
  let ha = max(h2, h - r8);

  if (!bottomright) {
    path.moveTo(w2, -h2);
  }
  else {
    path.moveTo(-w2 + wa, -h2);
    path.cubicTo(w2 - r7, -h2, w2 - r6, -h2 + r1, w2 - r5, -h2 + r2);
    path.cubicTo(w2 - r4, -h2 + r3, w2 - r3, -h2 + r4, w2 - r2, -h2 + r5);
    path.cubicTo(w2 - r1, -h2 + r6, w2, -h2 + r7, w2, -h2 + hi);
  }

  if (!topright) {
    path.lineTo(w2, -h2 + h);
  }
  else {
    path.lineTo(w2, -h2 + ha);
    path.cubicTo(w2, -h2 + h - r7, w2 - r1, -h2 + h - r6, w2 - r2, -h2 + h - r5);
    path.cubicTo(w2 - r3, -h2 + h - r4, w2 - r4, -h2 + h - r3, w2 - r5, -h2 + h - r2);
    path.cubicTo(w2 - r6, -h2 + h - r1, w2 - r7, -h2 + h, -w2 + wa, -h2 + h);
  }

  if (!topleft) {
    path.lineTo(-w2, -h2 + h);
  }
  else {
    path.lineTo(-w2 + wi, -h2 + h);
    path.cubicTo(-w2 + r7, -h2 + h, -w2 + r6, -h2 + h - r1, -w2 + r5, -h2 + h - r2);
    path.cubicTo(-w2 + r4, -h2 + h - r3, -w2 + r3, -h2 + h - r4, -w2 + r2, -h2 + h - r5);
    path.cubicTo(-w2 + r1, -h2 + h - r6, -w2, -h2 + h - r7, -w2, -h2 + ha);
  }

  if (!bottomleft) {
    path.lineTo(-w2, -h2);
  }
  else {
    path.lineTo(-w2, -h2 + hi);
    path.cubicTo(-w2, -h2 + r7, -w2 + r1, -h2 + r6, -w2 + r2, -h2 + r5);
    path.cubicTo(-w2 + r3, -h2 + r4, -w2 + r4, -h2 + r3, -w2 + r5, -h2 + r2);
    path.cubicTo(-w2 + r6, -h2 + r1, -w2 + r7, -h2, -w2 + wi, -h2);
  }

  path.close();

  return path;
})();
