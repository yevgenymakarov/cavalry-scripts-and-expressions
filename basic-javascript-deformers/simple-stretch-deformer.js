/* {cavalry javascript deformer} */

/*
  Simple Stretch Deformer
  Rubber-like stretching and squashing along the specified axis.

  Copyright 2005 Blender Authors

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

  https://github.com/blender/blender/blob/main/source/blender/modifiers/intern/MOD_simpledeform.cc
*/

var factor = 50.0;            /* strength */
var center = {x: 0, y: 0};    /* center */
var yaxis = true;             /* deform along y axis */

var points = def.getPoints();
var bbox = def.getBoundingBox();
var w = bbox.width, h = bbox.height, c = bbox.centre;
var size = (yaxis) ? w : h;

factor = factor / size;
center = { x: center.x + c.x, y: center.y + c.y };

for (let pt of points) {
  pt.x -= center.x;
  pt.y -= center.y;

  if (yaxis) {
    let y = pt.y / (size / 2);
    pt.x *= (y * y * factor - factor + 1);
    pt.y *= (1 + factor);

  } else {
    let x = pt.x / (size / 2);
    pt.x *= (1 + factor);
    pt.y *= (x * x * factor - factor + 1);
  }

  pt.x += center.x;
  pt.y += center.y;
}

def.setPoints(points);
