/* {cavalry javascript utility} */

/*
  Classic Bouncing DVD Logo Screensaver
  Returns the position for the logo and the number of its bounces.
*/

(function bouncing() {
  var screen = {x: 640, y: 480};    /* screen dimensions */
  var logo = {x: 64, y: 48};        /* logo dimensions */
  var start = {x: 0, y: 0};         /* initial logo position */
  var time = 0.0;                   /* progress, offset in pixels */
  var layerId = "colorArray#1";     /* output bounce count when connected to this layer */

  let area = [
    screen.x - logo.x,
    screen.y - logo.y
  ];

  let offset = [
    Math.abs(start.x + area[0] / 2 + time),
    Math.abs(start.y + area[1] / 2 + time)
  ];

  let count = [
    Math.floor(offset[0] / area[0]),
    Math.floor(offset[1] / area[1])
  ];

  if (ctx.layerId == layerId) {
    return count[0] + count[1];
  }

  let position = [
    offset[0] % area[0],
    offset[1] % area[1]
  ];

  let x = (count[0] % 2 == 1) ? area[0] - position[0] : position[0];
  let y = (count[1] % 2 == 1) ? area[1] - position[1] : position[1];

  return [
    x - area[0] / 2,
    y - area[1] / 2
  ];

})();
