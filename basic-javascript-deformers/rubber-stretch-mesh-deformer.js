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

var depth = def.highestDepthWithPath();
var meshes = def.getMeshesAtDepth(depth);
var bbox = def.getBoundingBox();
var w = bbox.width, h = bbox.height, c = bbox.centre;
var prev_point_x, prev_point_y, prev_sx, prev_sy, prev_x, prev_y, prev_dx_dy, prev_dy_dx;

ratio = 2 ** (ratio / -100);
curve = Math.min(curve / 100, 0.99);
center = {x: center.x + c.x, y: center.y + c.y};

for (let mesh of meshes) {
  for (let i = 0; i < mesh.count(); i++) {
    let pathData = mesh.getPathDataAtIndex(i);

    for (let verb of pathData) {
      if (verb.type == "close") {
        continue;
      }

      if (verb.type == "cubicTo") {
        verb.cp1.x -= prev_point_x;
        verb.cp1.y -= prev_point_y;

        verb.cp1.x = verb.cp1.x * prev_sy + prev_dx_dy * verb.cp1.y;
        verb.cp1.y = verb.cp1.y / prev_sx - prev_dy_dx * verb.cp1.x;

        verb.cp1.x += center.x + prev_x * prev_sy;
        verb.cp1.y += center.y + prev_y / prev_sx;
      }

      let x = prev_x = verb.point.x - center.x;
      let y = prev_y = verb.point.y - center.y;

      let u = x / (w / 2), v = y / (h / 2);
      let sx = prev_sx = (1 + curve * (u + 1) * (u - 1)) * ratio;
      let sy = prev_sy = (1 + curve * (v + 1) * (v - 1)) * ratio;

      prev_point_x = verb.point.x;
      prev_point_y = verb.point.y;

      verb.point.x = x * sy + center.x;
      verb.point.y = y / sx + center.y;

      let dx_dy = prev_dx_dy = x * 2 * curve * y / h / h * ratio;
      let dy_dx = prev_dy_dx = y * 2 * curve * x / w / w * ratio / sx / sx;

      if (verb.type == "cubicTo") {
        verb.cp2.x -= prev_point_x;
        verb.cp2.y -= prev_point_y;

        verb.cp2.x = verb.cp2.x * sy + dx_dy * verb.cp2.y;
        verb.cp2.y = verb.cp2.y / sx - dy_dx * verb.cp2.x;

        verb.cp2.x += verb.point.x;
        verb.cp2.y += verb.point.y;
      }
    }

    mesh.setPathDataAtIndex(i, pathData);
  }
}

def.setMeshesAtDepth(depth, meshes);
