/* {cavalry script} */

/*
  Sphere Wireframe
  Creates a SVG vector-graphics file which depicts a wireframe sphere.

  Copyright 2008 Wikimedia Foundation

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

  https://en.wikipedia.org/wiki/File:Sphere_wireframe.svg
*/

var file_path = "";            /* svg file path to be written */

var num_lon = 18;              /* half number of meridians */
var num_lat = 18;              /* number of parallels */

var tilt = 52.5;               /* axial tilt */
var rotate = 2.5;              /* offset of the meridians */

var stripe_width = 0.5;        /* width of each line in degrees */

var color = "#305070";         /* color of lines */
var back_color = "#ccd3db";    /* color of the sphere's backside */

var image_size = 400;          /* width and height of the image in pixels */

const { abs, sqrt, cos, sin, asin, tan, atan2 } = Math;
const pi = Math.PI;
const radian = pi / 180.0;
const sqr = x => x * x;

let svg = `<?xml version="1.0" encoding="utf-8"?>\n`;
svg += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `;
svg += `width="${image_size}" height="${image_size}" viewBox="0 0 ${image_size} ${image_size}">\n`;

svg += `<g id="sphere" fill="${color}" fill-rule="evenodd" `;
svg += `transform="scale(${0.5 * image_size}, ${0.5 * image_size}) translate(1, 1)">\n`;
svg += `<g id="sphere_back" fill="${back_color}">\n`;

tilt *= radian;
rotate *= radian;

let d = 0.5 * stripe_width * radian;
let cost = cos(tilt), sint = sin(tilt);

/* meridians, lines of longitude */

svg += `<g id="meridians">\n`;

let a = abs(cos(d));

for (let i_lon = 0; i_lon < num_lon; i_lon++) {
  let longitude = rotate + (i_lon * 180.0 / num_lon) * radian;
  svg += `<path id="meridian-${i_lon}" d="`;

  let axis_rot = atan2(-1.0 / tan(longitude), cost);

  if (sint < 0) {
    axis_rot += pi;
  }

  let w = sin(longitude) * sint;
  let b = abs(w * cos(d));
  let sinw = sin(d) / sqrt(1.0 - sqr(sin(longitude) * sint));

  if (abs(sinw) >= 1.0) { /* stripe covers edge of the circle */
    let s = sqrt(1.0 - sqr(w)) * sin(d);
    /* circle */
    svg += `M -1 0 `;
    svg += `A 1 1 0 0 1 1 0 `;
    svg += `A 1 1 0 0 1 -1 0 `;
    svg += `Z`;
    /* ellipse */
    svg += `M ${sin(axis_rot) * s - cos(axis_rot) * a} ${-cos(axis_rot) * s - sin(axis_rot) * a} `;
    svg += `A ${a} ${b} ${axis_rot / radian} 0 0 `;
    svg += `${sin(axis_rot) * s + cos(axis_rot) * a} ${-cos(axis_rot) * s + sin(axis_rot) * a} `;
    svg += `A ${a} ${b} ${axis_rot / radian} 0 0 `;
    svg += `${sin(axis_rot) * s - cos(axis_rot) * a} ${-cos(axis_rot) * s - sin(axis_rot) * a} `;
    svg += `Z `;
  } else { /* draw a disrupted ellipse bow */
    let w1 = asin(sinw);
    svg += `M ${-cos(axis_rot + w1)} ${-sin(axis_rot + w1)} `;
    svg += `A ${a} ${b} ${axis_rot / radian} 1 0 ${cos(axis_rot - w1)} ${sin(axis_rot - w1)} `;
    svg += `A 1 1 0 0 1 ${cos(axis_rot + w1)} ${sin(axis_rot + w1)} `;
    svg += `A ${a} ${b} ${axis_rot / radian} 0 1 ${-cos(axis_rot - w1)} ${-sin(axis_rot - w1)} `;
    svg += `A 1 1 0 0 1 ${-cos(axis_rot + w1)} ${-sin(axis_rot + w1)} `;
    svg += `Z`;
  }

  svg += `" />\n`;
}

svg += `</g>\n`;

/* parallels, circles of latitude */

svg += `<g id="parallels">\n`;

for (let i_lat = 1; i_lat < num_lat; i_lat++) {
  let latitude = (i_lat * 180.0 / num_lat - 90.0) * radian;
  let lat = [latitude + d, latitude - d];
  let x = [], yd = [], ym = [];

  for (let i = 0; i < 2; i++) {
    x[i] = abs(cos(lat[i]));
    yd[i] = abs(cost * cos(lat[i]));
    ym[i] = sint * sin(lat[i]);
  }

  /* height of each point above image plane */
  let h = [];
  h[0] = sin(lat[0] + tilt);
  h[1] = sin(lat[0] - tilt);
  h[2] = sin(lat[1] + tilt);
  h[3] = sin(lat[1] - tilt);

  if (h[0] > 0 || h[1] > 0 || h[2] > 0 || h[3] > 0) { /* at least any part visible */
    svg += `<path id="parallel-${i_lat}" d="`;

    for (let i = 0; i < 2; i++) {
      if ((h[2*i] >= 0 && h[2*i+1] >= 0) && (h[2*i] > 0 || h[2*i+1] > 0)) { /* complete ellipse */
        svg += `M ${-x[i]} ${ym[i]} `;

        for (let z = 1; z > -2; z -= 2) {
          svg += `A ${x[i]} ${yd[i]} 0 1 ${i} ${z * x[i]} ${ym[i]} `;
        }

        svg += `Z `;

        if (h[2-2*i] * h[3-2*i] < 0) { /* partly ellipse */
          let yp = sin(lat[1-i]) / sint;
          let xp = sqrt(1.0 - sqr(yp));

          if (sint < 0) {
            xp = -xp;
          }

          let large_arc = (sin(lat[1-i]) * cost > 0) ? 1 : 0;
          let sweep = (cost >= 0) ? 1 : 0;

          svg += `M ${-xp} ${yp} `;
          svg += `A ${x[1-i]} ${yd[1-i]} 0 ${large_arc} ${sweep} ${xp} ${yp} `;
          svg += `A 1 1 0 0 ${sweep} ${-xp} ${yp} `;
          svg += `Z `;
        } else if (h[2-2*i] <= 0 && h[3-2*i] <= 0) { /* stripe covers edge of the circle */
          /* circle */
          let clockwise = (cost < 0) ? 0 : 1
          svg += `M -1 0 `;
          svg += `A 1 1 0 0 ${clockwise} 1 0 `;
          svg += `A 1 1 0 0 ${clockwise} -1 0 `;
          svg += `Z `;
        }
      }
    }

    if ((h[0] * h[1] < 0 && h[2] <= 0 && h[3] <= 0) || (h[0] <= 0 && h[1] <= 0 && h[2] * h[3] < 0)) { /* one slice visible */
      let i = (h[0] <= 0 && h[1] <= 0) ? 1 : 0;
      let yp = sin(lat[i]) / sint;
      let xp = sqrt(1.0 - yp * yp);

      let large_arc = (sin(lat[i]) * cost > 0) ? 1 : 0;
      let sweep = (cost * sint >= 0) ? 1 : 0;

      svg += `M ${-xp} ${yp} `;
      svg += `A ${x[i]} ${yd[i]} 0 ${large_arc} ${sweep} ${xp} ${yp} `;

      sweep = (cost * sint < 0) ? 1 : 0;

      svg += `A 1 1 0 0 ${sweep} ${-xp} ${yp} `;
      svg += `Z `;

    } else if (h[0] * h[1] < 0 && h[2] * h[3] < 0) { /* disrupted ellipse bow */
      let xp = [], yp = [];

      for (let i = 0; i < 2; i++) {
        yp[i] = sin(lat[i]) / sint;
        xp[i] = sqrt(1.0 - sqr(yp[i]));
        if (sint < 0) {
          xp[i] = -xp[i]
        };
      }

      let large_arc = (sin(lat[0]) * cost > 0) ? 1 : 0;
      let sweep = (cost >= 0) ? 1 : 0;

      svg += `M ${-xp[0]} ${yp[0]} `;
      svg += `A ${x[0]} ${yd[0]} 0 ${large_arc} ${sweep} ${xp[0]} ${yp[0]} `;
      svg += `A 1 1 0 0 0 ${xp[1]} ${yp[1]} `;

      large_arc = (sin(lat[1]) * cost > 0) ? 1 : 0;
      sweep = (cost < 0) ? 1 : 0;

      svg += `A ${x[1]} ${yd[1]} 0 ${large_arc} ${sweep} ${-xp[1]} ${yp[1]} `;
      svg += `A 1 1 0 0 0 ${-xp[0]} ${yp[0]} `;
      svg += `Z `;
    }

    svg += `" />\n`;
  }
}

svg += `</g>\n</g>\n`;
svg += `<g id="sphere_front" transform="rotate(180)">\n`;
svg += `<use xlink:href="#meridians" />\n`;
svg += `<use xlink:href="#parallels" />\n`;
svg += `</g>\n</g>\n</svg>\n`;

/* write to a file with overwriting if it already exists */

if (api.writeToFile(file_path, svg, true)) {
  console.log(`Saved as: ${file_path}`);
}
