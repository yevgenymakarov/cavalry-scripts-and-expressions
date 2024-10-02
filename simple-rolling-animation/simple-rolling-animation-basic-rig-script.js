/* {cavalry script} */

/*
  Basic Rolling Animation Script
  Quickly setup a rig to roll selected shapes.
*/

let expression = `(function () {
  let p = convex_hull.path.pathData();
  let r = -roll_angle;
  let f = 0, t = p.length - 2;
  for (let i = 1; i < t; i++) {
    let w = p[f].point, u = p[i].point;
    if (w.y > u.y || (w.y === u.y && w.x > u.x)) {
      f = i;
    }
  }
  p = p.slice(f, t).concat(p.slice(0, f));
  p.push(p[0]);
  let g = [], l = [0];
  for (let i = 0, m = 0; i < t; i++) {
    let a = p[i].point, b = p[i+1].point,
        e = new cavalry.Line(a.x, a.y, b.x, b.y);
    g[i] = e.angle();
    l[i+1] = m += e.length();
  }
  let o = Math.floor(r / 360);
  r = ((r % 360) + 360) % 360;
  let n = t;
  for (let i = 0; i < t; i++) {
    if (r < g[i]) {
      n = i;
      break;
    }
  }
  r *= Math.PI / 180;
  let s = Math.sin(r), c = Math.cos(r),
      z = p[0].point, d = p[n].point;
  return {
    x: z.x - d.y * s - d.x * c + o * l[t] + l[n],
    y: z.y - d.y * c + d.x * s
  };
})();`;

let selection = api.getSelection(true);
let shapes = new Set();

let parents = selection.filter((layer) => {
  let parent = api.getParent(layer);
  return (parent === "" || !selection.includes(parent));
});

let getShapes = (layer) => {
  if (api.isShape(layer) && api.getLayerType(layer) !== "group") {
    shapes.add(layer);
  }

  api.getChildren(layer).forEach((child) => {
    getShapes(child);
  });
}

parents.forEach((layer) => {
  if (api.getLayerType(layer) !== "compNode") {
    getShapes(layer);
  }
});

if (shapes.size > 0) {
  let mainGroup = api.create("group", `Rolling ${api.getNiceName(parents[0])}`);

  let displayGroup = api.create("group", "Display Group");
  api.parent(displayGroup, mainGroup);
  api.set(displayGroup, {"hidden": true});

  let nullLayer = api.create("null", "Position & Ground Slope");
  api.parent(nullLayer, mainGroup);

  let customShape = api.create("customShape", "Rolling Shape [Display Group]");
  api.parent(customShape, nullLayer);

  let javaScript = api.create("javaScript", "Rolling Utility");
  api.parent(javaScript, customShape);

  api.removeArrayIndex(javaScript, "array.0");

  api.addDynamic(javaScript, "array", "layerId");
  api.renameAttribute(javaScript, "array.0", "convex_hull");

  api.addDynamic(javaScript, "array", "double");
  api.renameAttribute(javaScript, "array.1", "roll_angle");
  api.keyframe(javaScript, api.getFrame(), {"array.1": 0});

  api.set(javaScript, {"expression": expression});

  let sourceGroup = parents[0];

  if (parents.length !== 1 || api.getLayerType(parents[0]) !== "group") {
    sourceGroup = api.create("group", "Source Group");

    parents.reverse();

    parents.forEach((layer) => {
      api.parent(layer, sourceGroup);
    });
  }

  api.parent(sourceGroup, displayGroup);

  let convexHull = api.create("convexHull", `Convex Hull [${api.getNiceName(sourceGroup)}]`);
  api.parent(convexHull, displayGroup);

  api.setFill(convexHull, false);
  api.setStroke(convexHull, true);
  api.set(convexHull, {
    "stroke.dashPattern": "10",
    "stroke.strokeColor": "#7f7f7f",
    "hidden": true
  });

  shapes.forEach((layer) => {
    api.connect(layer, "id", convexHull, "shapes");
  });

  api.connect(convexHull, "id", javaScript, "array.0");
  api.connect(javaScript, "id", customShape, "position");
  api.connect(javaScript, "array.1", customShape, "rotation.z");
  api.connect(displayGroup, "id", customShape, "inputShape");

  api.select([nullLayer]);
} else {
  console.warn("No shape layer is selected.");
}
