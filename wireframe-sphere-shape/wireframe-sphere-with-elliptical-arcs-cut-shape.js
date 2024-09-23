/* {cavalry javascript shape} */

/*
  Wireframe 3D Sphere Cut
  Draws a sphere cut composed of projected circles with back-face culling.
*/

(function wireframeSphere() {
  var radius = 200.0;    /* sphere radius */
  var sections = 18;     /* number of sections */

  var percent = 70.0;    /* cut-off level */

  var angle_x = 40.0;    /* rotation angles */
  var angle_y = 35.0;

  var double = false;    /* cut two sides */

  const { abs, min, max, sqrt, cos, sin, tan, atan2, acos, asin } = Math;
  const pi = Math.PI, two_pi = 2 * Math.PI;

  let radians = Math.PI / 180;
  let ax = angle_x * radians, ay = angle_y * radians;

  let cx = cos(ax), cy = cos(ay), sx = sin(ax), sy = sin(ay);

  percent = max((double ? 0 : -100), min(percent, 100)) / 100;

  let path = new cavalry.Path();

  function ellipticalArc(x, y, rx, ry, rotation, startAngle, endAngle, anticlockwise) {
    let direction = anticlockwise ? -1 : 1;
    let sweep = (endAngle - startAngle) * direction;

    if (sweep == 0) return;

    if (sweep < 0) {
      sweep = two_pi + sweep % two_pi;
      startAngle = endAngle - sweep * direction;
    } else if (sweep > two_pi) {
      sweep = two_pi;
    }

    if (sweep == two_pi) {
      let ellipse = new cavalry.Path();
      ellipse.addEllipse(0, 0, rx, ry);
      ellipse.rotate(rotation / radians);
      ellipse.translate(x, y);

      return path.append(ellipse);
    }

    let transform = new cavalry.Matrix();
    transform.setScale(rx, ry);
    transform.setRotation(rotation / radians);
    transform.setPosition(x, y);

    let start = {x: cos(startAngle), y: sin(startAngle)};
    let init = transform.mapPoint(start);
    path.moveTo(init.x, init.y);

    while (sweep > 0) {
      endAngle = startAngle + min(sweep, pi/2) * direction;

      let end = {x: cos(endAngle), y: sin(endAngle)};
      let factor = 4/3 * tan((endAngle - startAngle) / 4);

      let cp1 = {x: start.x - start.y * factor, y: start.y + start.x * factor};
      let cp2 = {x: end.x + end.y * factor, y: end.y - end.x * factor};

      sweep -= pi/2;
      startAngle = endAngle;
      start = end;

      cp1 = transform.mapPoint(cp1);
      cp2 = transform.mapPoint(cp2);
      end = transform.mapPoint(end);

      path.cubicTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    }
  }

  function drawFaces(h) {
    let x = 0, y = cx, z = sx;

    let ry = sqrt(1 - h * h);
    let rx = ry * abs(z);

    let rotation = atan2(y, x);
    let angle = acos(abs(z));

    let cosA = h / sin(angle);
    let startAngle = acos(max(-1, min(cosA, 1))) || 0;
    let endAngle = (double ? pi : two_pi) - startAngle;

    ellipticalArc(0, 0, radius, radius, rotation, startAngle, endAngle, false);

    if (double) {
      ellipticalArc(0, 0, radius, radius, rotation, startAngle + pi, endAngle + pi, false);
    }

    cosA = h / tan(angle) / ry;
    x *= h * radius, y *= h * radius;
    rx *= radius, ry *= radius;

    startAngle = 0;
    endAngle = two_pi;

    if (z < 0) {
      startAngle = acos(max(-1, min(cosA, 1))) || 0;
      endAngle = -startAngle;
    }

    ellipticalArc(x, y, rx, ry, rotation, startAngle, endAngle, z < 0);

    if (double == false) return;

    startAngle = 0;
    endAngle = two_pi;

    if (z > 0) {
      startAngle = acos(max(-1, min(-cosA, 1))) || 0;
      endAngle = two_pi - startAngle;
    }

    ellipticalArc(-x, -y, rx, ry, rotation, startAngle, endAngle, z < 0);
  }

  function drawEdges(a) {
    let x = sin(a), y = 0, z = cos(a);

    let s = sy * x - cy * z;
    [x, y, z] = [cy * x + sy * z, sx * s, -cx * s];

    let u = z * cx - y * sx, v = x * sx, w = x * cx;
    let c = (y * u - x * v) / sqrt(y * y + x * x) / sqrt(u * u + v * v + w * w);
    let maxAngle = acos(c) || (sx > 0 ? pi : 0);

    let maxStartAngle = (w < 0) ? pi + maxAngle : pi - maxAngle;
    let maxEndAngle = (w < 0) ? maxAngle : two_pi - maxAngle;

    if (maxStartAngle > maxEndAngle) {
      if (sx > 0) {
        maxStartAngle -= two_pi;
      } else {
        maxEndAngle += two_pi;
      }
    }

    let h = asin(percent);

    let startAngle = max(pi - h, maxStartAngle);
    let endAngle = min(pi + (double ? h : pi/2), maxEndAngle);

    if (startAngle > endAngle) {
      return;
    }

    let ca = cos(ay + a), sa = sin(ay + a);

    let transform = new cavalry.Matrix();
    transform.setFromArray([ca * radius, 0, 0, sx * sa * radius, cx * radius, 0, 0, 0, 1]);

    let start = {x: cos(startAngle), y: sin(startAngle)};
    let init = transform.mapPoint(start);
    path.moveTo(init.x, init.y);

    let sweep = (endAngle - startAngle);

    while (sweep > 0) {
      endAngle = startAngle + min(sweep, pi/2);

      let end = {x: cos(endAngle), y: sin(endAngle)};
      let factor = 4/3 * tan((endAngle - startAngle) / 4);

      let cp1 = {x: start.x - start.y * factor, y: start.y + start.x * factor};
      let cp2 = {x: end.x + end.y * factor, y: end.y - end.x * factor};

      sweep -= pi/2;
      startAngle = endAngle;
      start = end;

      cp1 = transform.mapPoint(cp1);
      cp2 = transform.mapPoint(cp2);
      end = transform.mapPoint(end);

      path.cubicTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    }
  }

  function drawRings(h) {
    let x = 0, y = cx, z = sx;

    let rotation = atan2(y, x);
    let angle = acos(abs(z));

    let ry = sqrt(1 - h * h);
    let rx = ry * abs(z);

    let cosA = h / tan(angle) / ry;
    let startAngle = acos(max(-1, min(cosA, 1))) || 0;
    let endAngle = z > 0 ? two_pi - startAngle : - startAngle;

    x *= h * radius, y *= h * radius;
    rx *= radius, ry *= radius;

    ellipticalArc(x, y, rx, ry, rotation, startAngle, endAngle, z < 0);
  }

  for (let i = 0; i < sections; i++) {
    let a = i / sections;
    let h = cos(a * pi);
    let n = double ? abs(h) : h;

    drawEdges(a * two_pi);

    if (n < percent) {
      drawRings(h);
    }
  }

  drawFaces(percent);

  return path;
})();
