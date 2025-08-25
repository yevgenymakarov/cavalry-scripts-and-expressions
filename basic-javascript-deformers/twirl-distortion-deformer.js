/* {cavalry javascript deformer} */

/*
  Twirl Deformer
  Modifies a shape by twisting the points around a given center.

  Copyright 2005 Aaron Spike, aaron@ekips.org

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

  https://gitlab.com/inkscape/extensions/-/blob/master/twirl.py
*/

var strength = 5.0;           /* strength */
var center = {x: 0, y: 0};    /* center */

var { cos, sin, atan2, sqrt } = Math;

var points = def.getPoints();
var bbox = def.getBoundingBox();
var w = bbox.width, h = bbox.height, c = bbox.centre;

strength = strength / 1000;
center = { x: center.x + c.x, y: center.y + c.y };

for (let pt of points) {
  pt.x -= center.x;
  pt.y -= center.y;

  let dist = sqrt(pt.x * pt.x + pt.y * pt.y);
  let theta = atan2(pt.y, pt.x) + dist * strength;

  pt.x = dist * cos(theta);
  pt.y = dist * sin(theta);

  pt.x += center.x;
  pt.y += center.y;
}

def.setPoints(points);
