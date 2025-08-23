/* {cavalry javascript shape} */

/*
  Wireframe Sphere
  Draws a sphere constructed from lines of latitude and longitude.

  Copyright 2009 John Beard john.j.beard@gmail.com
  
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

  https://gitlab.com/inkscape/extensions/-/blob/master/wireframe_sphere.py
*/

(function wireframeSphere() {
  var num_lat = 19;        /* lines of latitude */
  var num_lon = 24;        /* lines of longitude */

  var radius = 200.0;      /* radius */

  var tilt = 35.0;         /* tilt -90 to 90 degrees */
  var rotate = 4.0;        /* rotation in degrees */

  var hide_back = true;    /* hide lines at the back of sphere */

  const { abs, min, max, cos, sin, tan, acos, atan, ceil } = Math;
  const pi = Math.PI;

  let path = new cavalry.Path();
  let transform = (tilt < 0);

  tilt = abs(min(max(tilt, -90), 90)) * (pi / 180);
  rotate = rotate * (pi / 180);

  num_lon = ceil(num_lon / 2);
  num_lat = num_lat + 1;

  for (let i = 0; i < num_lon; i++) {
    let long_angle = rotate + i * pi / num_lon;
    let inverse = abs(sin(long_angle)) * cos(tilt);
    let rotation = atan(tan(long_angle) * sin(tilt)) * (180 / pi);

    let ellipse = new cavalry.Path();
    ellipse.addEllipse(0, 0, radius * inverse, radius);
    ellipse.rotate(rotation);

    if (hide_back) {
      ellipse.trim(0, 0.5, 0, tan(long_angle) > 0);
    }

    path.append(ellipse);
  }

  for (let i = 1; i < num_lat; i++) {
    let lat_angle = i * pi / num_lat;
    let radx = radius * sin(lat_angle);
    let rady = radx * sin(tilt);
    let posy = radius * cos(lat_angle) * cos(tilt);

    if (hide_back) {
      if (lat_angle < pi - tilt) {
        if (lat_angle < tilt) {
          path.addEllipse(0, posy, radx, rady);
        } else {
          let proportion = acos(tan(tilt) / tan(lat_angle)) / (2 * pi);
          let ellipse = new cavalry.Path();
          ellipse.addEllipse(0, 0, radx, radx);
          ellipse.trim(proportion, 1 - proportion, 0, true);
          ellipse.scale(1, rady / radx);
          ellipse.translate(0, posy);
          path.append(ellipse);
        }
      }
    } else {
      path.addEllipse(0, posy, radx, rady);
    }
  }

  path.addEllipse(0, 0, radius, radius);

  if (transform) {
    path.scale(1, -1);
  }

  return path;
})();
