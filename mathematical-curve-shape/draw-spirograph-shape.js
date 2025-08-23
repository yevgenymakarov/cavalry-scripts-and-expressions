/* {cavalry javascript shape} */

/*
  Spirograph
  Draws a spirograph-like shape.

  Copyright 2007 Joel Holdsworth joel@airwebreathe.org.uk

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

  https://gitlab.com/inkscape/extensions/-/blob/master/spirograph.py
*/

(function spirograph() {
  var primaryr = 210.0;      /* the radius of the outer gear */
  var secondaryr = 150.0;    /* the radius of the inner gear */
  var penr = 30.0;           /* the distance of the pen from the inner gear */

  var gearplacement = 0;     /* selects whether the gear is inside (0) or outside (1) the ring */

  var quality = 14;          /* the quality of the calculated output */

  const { cos, sin } = Math;
  const pi = Math.PI;

  if (secondaryr == 0 || quality == 0) {
    return;
  }

  let a, flip;
  if (gearplacement == 1) {
    a = primaryr + secondaryr;
    flip = -1;
  } else {
    a = primaryr - secondaryr;
    flip = 1;
  }

  let ratio = a / secondaryr;
  if (ratio == 0) {
    return;
  }
  let scale = 2 * pi / (ratio * quality);

  let path = new cavalry.Path();
  let maxPointCount = 1000;
  let view_center = [0, 0];

  let store_x, store_y;

  for (let i = 0; i < maxPointCount; i += 1) {
    let theta = i * scale;
         
    let x = (
      a * cos(theta)
      + penr * cos(ratio * theta) * flip
      + view_center[0]
    )
    let y = (
      a * sin(theta)
      - penr * sin(ratio * theta)
      + view_center[1]
    )

    let dx = (
      (
        -a * sin(theta)
        - ratio
        * penr
        * sin(ratio * theta)
        * flip
      )
      * scale
      / 3
    );
    let dy = (
      (
        a * cos(theta)
        - ratio * penr * cos(ratio * theta)
      )
      * scale
      / 3
    );

    if (i == 0) {
      path.moveTo(x, y);

      store_x = (x + dx);
      store_y = (y + dy);
    } else {
      path.cubicTo(
        store_x, store_y,
        (x - dx), (y - dy),
        x, y
      );

      if (i / ratio % quality == 0 && i % quality == 0) {
        path.close();
        break;
      } else {
        if (i == maxPointCount - 1) {
          /* we reached the allowed maximum of points, stop here */
        } else {
          store_x = (x + dx);
          store_y = (y + dy);
        }
      }
    }
  }

  return path;
})();
