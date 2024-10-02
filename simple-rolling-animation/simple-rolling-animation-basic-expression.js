/* {cavalry javascript utility} */

/*
  Simple Rolling Animation
  Creates a basic rolling animation of an arbitrary shape.

  The expression returns the position for the shape based on its convex hull and rotation
  angle. The convex hull is assumed to be a polyline, closed and counterclockwise.
*/

(function rollShape() {
  var convex_hull = n0;    /* convex hull layer */
  var roll_angle = n1;     /* rotation angle value */

  let path = convex_hull.path.pathData();
  let rotation = -roll_angle;

  /* Set the lowest point as the first point of the path. */
  let first = 0, last = path.length - 2;

  for (let i = 1; i < last; i++) {
    if (path[first].point.y > path[i].point.y ||
        (path[first].point.y === path[i].point.y && path[first].point.x > path[i].point.x)) {
      first = i;
    }
  }

  let a = path.slice(0, first);
  let b = path.slice(first, last);

  path = b.concat(a);
  path.push(path[0]);

  /* Get the edge angles and cumulative edge lengths. */
  let edge_angles = [], sum_lengths = [0];

  for (let i = 0, sum = 0; i < last; i++) {
    let a = path[i].point;
    let b = path[i+1].point;
    let edge = new cavalry.Line(a.x, a.y, b.x, b.y);

    edge_angles[i] = edge.angle();
    sum_lengths[i+1] = sum += edge.length();
  }

  /* The number of whole rotations. */
  let full_circles = Math.floor(rotation / 360);

  /* Convert negative angle to positive. */
  rotation = ((rotation % 360) + 360) % 360;

  /* Find the point that will touch the ground at the current rotation. */
  let id = last;

  for (let i = 0; i < last; i++) {
    if (rotation < edge_angles[i]) {
      id = i;
      break;
    }
  }

  /* Get an offset to keep our current point in place of the initial touch point. */
  let t = rotation * Math.PI / 180;

  let x = path[0].point.x - path[id].point.y * Math.sin(t) - path[id].point.x * Math.cos(t);
  let y = path[0].point.y - path[id].point.y * Math.cos(t) + path[id].point.x * Math.sin(t);

  /* Horizontal travel distance. */
  let run = full_circles * sum_lengths[last] + sum_lengths[id];

  return {x: x + run, y: y};
})();
