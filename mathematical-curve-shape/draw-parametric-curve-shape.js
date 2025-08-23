/* {cavalry javascript shape} */

/*
  Parametric Curve
  Creates a graph of a parametric equation.

  Standard JavaScript mathematical constants and functions are available:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math

  Copyright 2009 Michel Chatelain
            2007 Tavmjong Bah, tavmjong@free.fr
            2006 Georg Wiora, xorx@quarkbox.de
            2006 Johan Engelen, johan@shouraizou.nl
            2005 Aaron Spike, aaron@ekips.org

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

  https://gitlab.com/inkscape/extensions/-/blob/master/funcplot.py
  https://gitlab.com/inkscape/extensions/-/blob/master/param_curves.py
*/

(function parametric() {
  var samples = 35;        /* number of samples */

  var fx = "cos(3*t)";     /* function for calculating x-value */
  var fy = "sin(5*t)";     /* function for calculating y-value */

  var tstart = 0.0;        /* start t-value */
  var tend = 1.0;          /* end t-value */
  var times2pi = true;     /* multiply t-range by 2 pi */

  var polar = false;       /* use polar coordinates */

  var width = 500.0;       /* graph rectangle width */
  var height = 500.0;      /* graph rectangle height */

  var xleft = -1.0;        /* x-value at rectangle's left */
  var xright = 1.0;        /* x-value at rectangle's right */
  var ybottom = -1.0;      /* y-value at rectangle's bottom */
  var ytop = 1.0;          /* y-value at rectangle's top */

  var isoscale = false;    /* isotropic scaling */

  var drawaxis = false;    /* draw axes */

  /* standard js math functions */
  const { abs, min, max, sqrt, pow, exp, cos, sin, tan } = Math;
  const pi = Math.PI;

  /* coords and scales based on the graph rectangle */
  let scalex = width / (xright - xleft);
  let xoff = - width / 2;
  let coordx = x => (x - xleft) * scalex + xoff; /* convert x-value to coordinate */

  let scaley = height / (ytop - ybottom);
  let yoff = - height / 2;
  let coordy = y => (y - ybottom) * scaley + yoff; /* convert y-value to coordinate */

  /* check for isotropic scaling and use smaller of the two scales */
  if (isoscale) {
    if (scaley < scalex) {
      let xzero = coordx(0); /* compute zero location */
      scalex = scaley; /* set scale */
      /* correct x-offset */
      xleft = (xoff - xzero) / scalex;
      xright = (xoff - xzero + width) / scalex;
    } else {
      let yzero = coordy(0); /* compute zero location */
      scaley = scalex; /* set scale */
      /* correct y-offset */
      ybottom = (yoff - yzero) / scaley;
      ytop = (yoff - yzero + height) / scaley;
    }
  }

  if (times2pi) {
    tstart *= 2 * Math.PI;
    tend *= 2 * Math.PI;
  }

  /* functions specified by the user */
  let f1 = t => eval(fx);
  let f2 = t => eval(fy);

  /* step is increment of t */
  let step = (tend - tstart) / (samples - 1);
  let third = step / 3.0;
  let ds = step * 0.001; /* step used in calculating derivatives */

  /* initialize functions and derivatives for 0 */
  /* they are carried over from one iteration to the next */
  let x0 = f1(tstart);
  let y0 = f2(tstart);

  /* numerical derivatives, using (0.001 * step) as the small differential */
  let t1 = tstart + ds; /* second point AFTER first point, good for first point */
  let x1 = f1(t1);
  let y1 = f2(t1);

  if (polar) {
    let xp0 = y0 * Math.cos(x0);
    let yp0 = y0 * Math.sin(x0);
    let xp1 = y1 * Math.cos(x1);
    let yp1 = y1 * Math.sin(x1);
    x0 = xp0;
    y0 = yp0;
    x1 = xp1;
    y1 = yp1;
  }

  let dx0 = (x1 - x0) / ds;
  let dy0 = (y1 - y0) / ds;

  /* start curve */
  let path = new cavalry.Path();
  path.moveTo(coordx(x0), coordy(y0)); /* initial moveto */

  for (let i = 0; i < samples - 1; i++) {
    let t2, x2, y2;

    t1 = (i + 1) * step + tstart;
    t2 = t1 - ds; /* second point BEFORE first point, good for last point */
    x1 = f1(t1);
    x2 = f1(t2);
    y1 = f2(t1);
    y2 = f2(t2);

    if (polar) {
      let xp1 = y1 * Math.cos(x1);
      let yp1 = y1 * Math.sin(x1);
      let xp2 = y2 * Math.cos(x2);
      let yp2 = y2 * Math.sin(x2);
      x1 = xp1;
      y1 = yp1;
      x2 = xp2;
      y2 = yp2;
    }

    /* numerical derivatives */
    let dx1 = (x1 - x2) / ds;
    let dy1 = (y1 - y2) / ds;

    /* create curve */
    path.cubicTo(
      coordx(x0 + dx0 * third),
      coordy(y0 + dy0 * third),
      coordx(x1 - dx1 * third),
      coordy(y1 - dy1 * third),
      coordx(x1),
      coordy(y1)
    );

    /* next segment's start is this segments end */
    x0 = x1;
    y0 = y1;
    /* assume the functions are smooth everywhere, so carry over the derivatives too */
    dx0 = dx1;
    dy0 = dy1;
  }

  /* add axis */
  if (drawaxis) {
    let yzero = coordy(0);
    let xzero = coordx(0);

    if (ybottom <= 0 && 0 <= ytop) { /* check for visibility of x-axis */
      path.moveTo(xoff, yzero);
      path.lineTo(-xoff, yzero);
    }

    if (xleft <= 0 && 0 <= xright) { /* check for visibility of y-axis */
      path.moveTo(xzero, -yoff);
      path.lineTo(xzero, yoff);
    }

    if (polar) {
      path.addEllipse(xzero, yzero, coordx(1) - xzero, coordy(1) - yzero);
    }
  }

  return path;
})();
