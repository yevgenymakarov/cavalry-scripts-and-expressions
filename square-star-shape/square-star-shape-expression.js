/* {cavalry javascript shape} */

/*
  Square Star
  Draws a star like shape with square points.
*/

(function squareStar() {
  var radius = 200.0;    /* radius of the shape */
  var factor = 50.0;     /* defines the width of the star points */
  var sides = 5;         /* number of squared points */

  const { max, min, cos, sin, PI } = Math;

  sides = max(sides, 3);
  factor = min(1, max(factor / 100, 0));

  let path = new cavalry.Path();

  let angle = 2 * PI / sides;
  let half = angle / 2;
  let length = radius * cos(half) * (1 - factor);
  let inner = radius * factor;

  for (let i = 0; i < sides; i++) {
    let a = i * angle - PI / 2;

    let cx = inner * cos(a);
    let cy = inner * sin(a);

    let prev_x = cx + length * cos(a - half);
    let prev_y = cy + length * sin(a - half);

    let next_x = cx + length * cos(a + half);
    let next_y = cy + length * sin(a + half);

    if (i == 0) {
      path.moveTo(prev_x, prev_y);
    } else {
      path.lineTo(prev_x, prev_y);
    }

    path.lineTo(cx, cy);
    path.lineTo(next_x, next_y);
  }

  path.close();

  return path;
})();
