/* {cavalry script} */

/*
  Square Star
  Creates a square star shape layer.
*/

let name = "Square Star";

let radius = 200.0;
let factor = 50.0;
let sides = 5;

let expression = `(function () {
  let s = Math.max(sides, 3),
      f = Math.min(Math.max(factor / 100, 0), 1),
      g = 2 * Math.PI / s,
      h = g / 2,
      l = radius * Math.cos(h) * (1 - f),
      n = radius * f,
      p = new cavalry.Path();
  for (let i = 0; i < s; i++) {
    let a = i * g - Math.PI / 2,
        x = n * Math.cos(a),
        y = n * Math.sin(a),
        u = x + l * Math.cos(a - h),
        v = y + l * Math.sin(a - h),
        j = x + l * Math.cos(a + h),
        k = y + l * Math.sin(a + h);
    if (i == 0) {
      p.moveTo(u, v);
    } else {
      p.lineTo(u, v);
    }
    p.lineTo(x, y);
    p.lineTo(j, k);
  }
  p.close();
  return p;
})();`;

let layer = api.create("javaScriptShape", name);

api.addDynamic(layer, "generator.array", "double");
api.addDynamic(layer, "generator.array", "int");

api.renameAttribute(layer, "generator.array.0", "radius");
api.renameAttribute(layer, "generator.array.1", "factor");
api.renameAttribute(layer, "generator.array.2", "sides");

api.set(layer, {
  "generator.expression": expression,
  "generator.array.0": radius,
  "generator.array.1": factor,
  "generator.array.2": sides
});
