/* {cavalry javascript shape} */

/*
  Wireframe 3D Sphere
  Draws a sphere composed of projected circles with back-face culling.
*/

(function wireframeSphere() {
  var radius = 200.0;      /* sphere radius */
  var sections = 8;        /* number of sections */

  var preset = "globe";    /* preset: "globe", "grid", "ball" or "stack" */

  var angle_x = 40.0;      /* rotation angles */
  var angle_y = 15.0;

  const { abs, min, max, sqrt, cos, sin, tan, atan2, acos } = Math;
  const pi = Math.PI, two_pi = 2 * Math.PI;

  let radians = Math.PI / 180;
  let ax = angle_x * radians, ay = angle_y * radians;

  let cx = cos(ax), cy = cos(ay), sx = sin(ax), sy = sin(ay);

  let path = new cavalry.Path();

  function ellipticalArc(x, y, rx, ry, rotation, startAngle, endAngle, anticlockwise) {
    let sweep = (endAngle - startAngle) * (anticlockwise ? -1 : 1);

    if (sweep < 0) {
      sweep = two_pi + sweep % two_pi;
    } else if (sweep > two_pi) {
      sweep = two_pi;
    }

    let start = 0, end = sweep / two_pi;
    let travel = (anticlockwise ? endAngle : startAngle) / two_pi - 0.25;

    let ellipse = new cavalry.Path();
    ellipse.addEllipse(0, 0, 1, 1);
    ellipse.trim(start, end, travel, false);
    ellipse.scale(rx, ry);
    ellipse.rotate(rotation / radians);
    ellipse.translate(x, y);

    path.append(ellipse);
  }

  function drawArc(x, y, z, h) {
    let s = sy * x - cy * z;
    [x, y, z] = [cy * x + sy * z, cx * y + sx * s, sx * y - cx * s];

    let ry = sqrt(1 - h * h);
    let rx = ry * abs(z);

    let rotation = atan2(y, x);

    let angle = acos(abs(z));
    let cosA = h / tan(angle) / ry;
    let startAngle = acos(max(-1, min(cosA, 1))) || 0;
    let endAngle = z > 0 ? two_pi - startAngle : - startAngle;

    x *= h * radius, y *= h * radius;
    rx *= radius, ry *= radius;

    ellipticalArc(x, y, rx, ry, rotation, startAngle, endAngle, z < 0);
  }

  switch (preset) {
    case "globe":
      drawArc(0, 0, 1, 0);
      for (let i = 1; i < sections; i++) {
        let a = i / sections * pi;
        let c = cos(a), s = sin(a);
        drawArc(s, 0, c, 0);
        drawArc(0, 1, 0, c);
      }
      break;
    case "grid":
      for (let i = 1; i < sections; i++) {
        let a = i / sections * pi;
        let h = cos(a);
        drawArc(1, 0, 0, h);
        drawArc(0, 1, 0, h);
        drawArc(0, 0, 1, h);
      }
      break;
    case "ball":
      for (let i = 1; i < sections; i++) {
        let a = i / sections * pi;
        let h = cos(a), s = sin(pi/4);
        drawArc(0, s, s, h);
        drawArc(0, s, -s, h);
        drawArc(s, 0, s, h);
        drawArc(s, 0, -s, h);
        drawArc(s, s, 0, h);
        drawArc(s, -s, 0, h);
      }
      break;
    case "stack":
      for (let i = 1; i < sections; i++) {
        let h = i / sections * 2 - 1;
        drawArc(0, 1, 0, h);
      }
      break;
    default:
      console.warn("Preset not found");
  }

  path.addEllipse(0, 0, radius, radius);

  return path;
})();
