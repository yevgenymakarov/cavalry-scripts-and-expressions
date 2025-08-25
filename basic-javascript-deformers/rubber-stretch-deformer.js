/* {cavalry javascript deformer} */

/*
  Rubber Stretch Deformer
  Distorts the path by stretching it vertically while squeezing horizontally.

  Copyright 2006 Jean-Francois Barraud, barraud@math.univ-lille1.fr

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along
  with this program; if not, write to the Free Software Foundation, Inc.,
  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

  https://gitlab.com/inkscape/extensions/-/blob/master/rubberstretch.py
*/

var ratio = 25.0;             /* stretching */
var curve = 25.0;             /* bending effect */
var center = {x: 0, y: 0};    /* center */

var points = def.getPoints();
var bbox = def.getBoundingBox();
var w2 = bbox.width/2, h2 = bbox.height/2, c = bbox.centre;

ratio = 2 ** (ratio / -100);
curve = Math.min(curve / 100, 0.99);
center = { x: center.x + c.x, y: center.y + c.y };

for (let pt of points) {
  let x = pt.x - center.x;
  let y = pt.y - center.y;

  let u = x / w2, v = y / h2;
  let sx = (1 + curve * (u + 1) * (u - 1)) * ratio;
  let sy = (1 + curve * (v + 1) * (v - 1)) * ratio;

  pt.x = x * sy + center.x;
  pt.y = y / sx + center.y;
}

def.setPoints(points);
