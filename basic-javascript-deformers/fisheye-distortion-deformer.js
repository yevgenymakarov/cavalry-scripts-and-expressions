/* {cavalry javascript deformer} */

/*
  Fisheye Distortion Deformer
  Magnifies the local region around the focus center.

  Copyright 2012-2015 Michael Bostock

  Redistribution and use in source and binary forms, with or without modification,
  are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice, this
    list of conditions and the following disclaimer in the documentation and/or other
    materials provided with the distribution.

  * The name Michael Bostock may not be used to endorse or promote products derived
    from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
  IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
  BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
  SUCH DAMAGE.

  https://github.com/d3/d3-plugins/blob/master/fisheye/fisheye.js
*/

var radius = 200.0;           /* radius */
var strength = 2.0;           /* strength */
var center = {x: 0, y: 0};    /* center */

var points = def.getPoints();

for (var pt of points) {
  var dx = pt.x - center.x,
      dy = pt.y - center.y,
      dd = Math.sqrt(dx * dx + dy * dy);

  if (dd >= radius) continue;

  var k0 = Math.exp(strength);
      k0 = k0 / (k0 - 1) * radius;
  var k1 = strength / radius;
  var k = k0 * (1 - Math.exp(-dd * k1)) / dd * 0.75 + 0.25;

  pt.x = center.x + dx * k;
  pt.y = center.y + dy * k;
}

def.setPoints(points);
