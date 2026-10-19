/* {cavalry javascript shape} */

/*
  Chladni Figures Shape
  A simple particle simulation that create Chladni patterns.
*/

(function chladniFigures() {
  var time = 0.0;                   // time, progress

  var M = 2;                        // number m defining the chladni pattern
  var N = 4;                        // number n defining the chladni pattern

  var canvasWidth = 1080;           // canvas width

  var numberOfParticles = 50000;    // number of particles
  var particleSize = 1.2;           // size of particles

  var minSpeed = 0.00015;           // minimum particle speed in nodes
  var maxSpeed = 0.005;             // maximum particle speed in antinodes

  var angleSpeed = 0.5;             // speed of angle change

  class Particle {
    constructor() {
      this.x = Math.random();
      this.y = Math.random();
      this.angle = 2 * Math.PI * Math.random();
    }

    chladni() {
      return Math.cos(N * Math.PI * this.x) * Math.cos(M * Math.PI * this.y) -
             Math.cos(M * Math.PI * this.x) * Math.cos(N * Math.PI * this.y);
    }

    falloff(edgeWidth) {
      let minDist = Math.min(this.x, 1 - this.x, this.y, 1 - this.y);

      if (minDist < 0) return 1;
      if (minDist > edgeWidth) return 0;

      return 1 - minDist / edgeWidth;
    }

    update() {
      let field = Math.abs(this.chladni()) + 0.3 * this.falloff(0.1);
      let speed = Math.max(minSpeed, maxSpeed * field);

      this.angle += (Math.random() - 0.5) * angleSpeed;
      this.x += Math.cos(this.angle) * speed;
      this.y += Math.sin(this.angle) * speed;

      if (this.x < 0 || this.x > 1 || this.y < 0 || this.y > 1) {
        this.x = Math.random();
        this.y = Math.random();
      }
    }

    addRect(path, radius) {
      let x = (this.x - 0.5) * canvasWidth;
      let y = (this.y - 0.5) * canvasWidth;
      path.addRect(x - radius, y - radius, x + radius, y + radius);
    }
  }

  let particles = [];

  if (time == 0 || ctx.hasObject("cache") == false) {
    for (let i = 0; i < numberOfParticles; i++) {
      particles[i] = new Particle();
    }
    ctx.saveObject("cache", { array: particles });
  } else {
    particles = ctx.loadObject("cache").array;
  }

  let path = new cavalry.Path();

  for (let particle of particles) {
    particle.addRect(path, particleSize);
    particle.update();
  }

  return path;
})();
