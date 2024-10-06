/* {cavalry javascript shape} */

/*
  Bending a Straight Line into a Circle
  Bends a line segment into a circle while maintaining the length.
*/

(function lineCircle() {
  var lineStart = {x: 0, y: 0};    /* line start point */
  var lineEnd = {x: 350, y: 0};    /* line end point */

  var bend = 0.2;     /* line bend ratio */
  var pivot = 0.0;    /* pivot point */

  const { min, max, sqrt, cos, sin, tan, atan2 } = Math;
  const pi = Math.PI, two_pi = 2 * Math.PI;
  const clamp = (number, min, max) => Math.max(min, Math.min(number, max));

  let path = new cavalry.Path();

  if (bend == 0) {
    path.moveTo(lineStart.x, lineStart.y);
    path.lineTo(lineEnd.x, lineEnd.y);
    return path;
  }

  bend = clamp(bend, -1, 1);
  pivot = clamp(pivot, 0, 1);

  let line = {x: lineEnd.x - lineStart.x, y: lineEnd.y - lineStart.y};
  let length = sqrt(line.x * line.x + line.y * line.y);
  let normal = {x: -line.y / length, y: line.x / length};

  let angle = bend * two_pi;
  let radius = length / angle;

  let cx = lineStart.x + line.x * pivot + normal.x * radius;
  let cy = lineStart.y + line.y * pivot + normal.y * radius;

  let startAngle = atan2(normal.y, normal.x) + pi - pivot * angle;
  let endAngle = angle + startAngle;

  /* draw elliptical arc */

  let direction = bend < 0 ? -1 : 1;
  let sweep = (endAngle - startAngle) * direction;

  if (sweep < 0) {
    sweep = two_pi + sweep % two_pi;
    startAngle = endAngle - sweep * direction;
  } else if (sweep > two_pi) {
    sweep = two_pi;
  }

  let transform = new cavalry.Matrix();
  transform.setScale(radius, radius);
  transform.setPosition(cx, cy);

  let start = {x: cos(startAngle), y: sin(startAngle)};
  let init = transform.mapPoint(start);
  path.moveTo(init.x, init.y);

  while (sweep > 0) {
    endAngle = startAngle + min(sweep, pi/2) * direction;

    let end = {x: cos(endAngle), y: sin(endAngle)};
    let bend = 4/3 * tan((endAngle - startAngle) / 4);

    let cp1 = {x: start.x - start.y * bend, y: start.y + start.x * bend};
    let cp2 = {x: end.x + end.y * bend, y: end.y - end.x * bend};

    sweep -= pi/2;
    startAngle = endAngle;
    start = end;

    cp1 = transform.mapPoint(cp1);
    cp2 = transform.mapPoint(cp2);
    end = transform.mapPoint(end);

    path.cubicTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
  }

  return path;
})();
