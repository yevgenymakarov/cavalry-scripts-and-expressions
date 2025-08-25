/* {cavalry javascript deformer} */

/*
  Barrel Distortion Deformer
  Applies a barrel distortion effect to the shape.

  Copyright 2019 Denis Ivanenko

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

  https://github.com/LilJohny/InkscapeDistortion/blob/master/distortion.py
*/

var strength = 5.0;           /* strength */
var center = {x: 0, y: 0};    /* center */

var { max, sqrt } = Math;

var points = def.getPoints();
var bbox = def.getBoundingBox();
var w = bbox.width, h = bbox.height, c = bbox.centre;

strength = -max(strength, 0.001);
center = { x: center.x + c.x, y: center.y + c.y };

for (let pt of points) {
  let u = (pt.x - center.x) / (w + h);
  let v = (pt.y - center.y) / (w + h);

  let a = 2 * strength * (v * v + u * u);
  let dx = u / a * (1 - sqrt(1 - 2 * a));
  let dy = v / a * (1 - sqrt(1 - 2 * a));

  pt.x = dx * (w + h) + center.x;
  pt.y = dy * (w + h) + center.y;
}

def.setPoints(points);
