// // export default class {
// //   CONFIG: { particle_count: number, gravity: number, explosion_power: number, particle_size: number, destroy_target: boolean, fade: boolean }
// //   CTX?: CanvasRenderingContext2D | null
// //   delta_time?: number
// //   time: number

// //   bursts: { particles: number[] }[]
// //   constructor() {
// //     this.time = 0
// //     this.CONFIG = { particle_count: 75, gravity: 10, explosion_power: 25, particle_size: 1, destroy_target: !0, fade: !1 }
// //     this.bursts = []
// //   }
// //   setupCanvasContext() {

// //     if (!this.CTX) {
// //       var t = document.createElement("canvas");
// //       this.CTX = t.getContext("2d"),
// //         t.width = 2 * window.innerWidth,
// //         t.height = 2 * window.innerHeight,
// //         t.style.position = "fixed",
// //         t.style.top = "0",
// //         t.style.left = "0",
// //         t.style.width = "calc(100%)",
// //         t.style.height = "calc(100%)",
// //         t.style.margin = "0",
// //         t.style.padding = "0",
// //         t.style.zIndex = "999999999",
// //         t.style.pointerEvents = "none",
// //         document.body.appendChild(t),
// //         window.addEventListener("resize", () => {
// //           t.width = 2 * window.innerWidth
// //           t.height = 2 * window.innerHeight
// //         })
// //     }
// //   }
// //   // setupElement() {
// //   //   var n;
// //   //   r.element = document.getElementById(t)
// //   //   null === (n = r.element) || void 0 === n || n.addEventListener("click", function (t) {
// //   //     var n = new o(2 * t.clientX, 2 * t.clientY);
// //   //     r.bursts.push(new i(n))
// //   //     this.CONFIG.destroy_target && (r.element.style.visibility = "hidden")
// //   //   })
// //   // }
// //   update(t: number) {
// //     this.delta_time = (t - this.time) / 1e3,
// //       this.time = t;
// //     for (var e = this.bursts.length - 1; e >= 0; e--) this.bursts[e].update(this.delta_time),
// //       0 == this.bursts[e].particles.length && this.bursts.splice(e, 1);
// //     this.draw(),
// //       window.requestAnimationFrame(this.update)
// //   }

// //   //   !n) throw new Error("Missing id");
// //   // e.CONFIG || (e.CONFIG = new t),
// //   //   this.time = (new Date).getTime(),
// //   //   this.delta_time = 0,
// //   //   this.setupCanvasContext(),
// //   //   this.setupElement(n),
// //   //   window.requestAnimationFrame(this.update)
// //   //     }
// //   draw() {
// //     s.clearScreen();
// //     for (var t = 0,
// //       e = this.bursts; t < e.length; t++) {
// //       e[t].draw()
// //     }
// //   },
// //   e
// // } (),
// //   i = function () {
// //     function t(t) {
// //       this.particles = [];
// //       for (var i = 0; i < e.CONFIG.particle_count; i++) this.particles.push(new n(t))
// //     }
// //     return t.prototype.update = function (t) {
// //       for (var e = this.particles.length - 1; e >= 0; e--) this.particles[e].update(t),
// //         this.particles[e].checkBounds() && this.particles.splice(e, 1)
// //     },
// //       t.prototype.draw = function () {
// //         for (var t = this.particles.length - 1; t >= 0; t--) this.particles[t].draw()
// //       },
// //       t
// //   }(),
// //   n = function () {
// //     function t(t) {
// //       this.size = new o((16 * Math.random() + 4) * e.CONFIG.particle_size, (4 * Math.random() + 4) * e.CONFIG.particle_size),
// //         this.position = new o(t.x - this.size.x / 2, t.y - this.size.y / 2),
// //         this.velocity = r.generateVelocity(),
// //         this.rotation = 360 * Math.random(),
// //         this.rotation_speed = 10 * (Math.random() - .5),
// //         this.hue = 360 * Math.random(),
// //         this.opacity = 100,
// //         this.lifetime = Math.random() + .25
// //     }
// //     return t.prototype.update = function (t) {
// //       this.velocity.y += e.CONFIG.gravity * (this.size.y / (10 * e.CONFIG.particle_size)) * t,
// //         this.velocity.x += 25 * (Math.random() - .5) * t,
// //         this.velocity.y *= .98,
// //         this.velocity.x *= .98,
// //         this.position.x += this.velocity.x,
// //         this.position.y += this.velocity.y,
// //         this.rotation += this.rotation_speed,
// //         e.CONFIG.fade && (this.opacity -= this.lifetime)
// //     },
// //       t.prototype.checkBounds = function () {
// //         return this.position.y - 2 * this.size.x > 2 * window.innerHeight
// //       },
// //       t.prototype.draw = function () {
// //         s.drawRectangle(this.position, this.size, this.rotation, this.hue, this.opacity)
// //       },
// //       t
// //   }(),
// //   o = function () {
// //     return function (t, e) {
// //       this.x = t || 0,
// //         this.y = e || 0
// //     }
// //   }(),
// //   r = function () {
// //     function t() { }
// //     return t.generateVelocity = function () {
// //       var t = Math.random() - .5,
// //         i = Math.random() - .7,
// //         n = Math.sqrt(t * t + i * i);
// //       return i /= n,
// //         new o((t /= n) * (Math.random() * e.CONFIG.explosion_power), i * (Math.random() * e.CONFIG.explosion_power))
// //     },
// //       t
// //   }(),
// //   s = function () {
// //     function t() { }
// //     return t.clearScreen = function () {
// //       e.CTX && e.CTX.clearRect(0, 0, 2 * window.innerWidth, 2 * window.innerHeight)
// //     },
// //       t.drawRectangle = function (t, i, n, o, r) {
// //         e.CTX && (e.CTX.save(), e.CTX.beginPath(), e.CTX.translate(t.x + i.x / 2, t.y + i.y / 2), e.CTX.rotate(n * Math.PI / 180), e.CTX.rect(- i.x / 2, -i.y / 2, i.x, i.y), e.CTX.fillStyle = "hsla(" + o + "deg, 90%, 65%, " + r + "%)", e.CTX.fill(), e.CTX.restore())
// //       },
// //       t
// //   }();
// // return e
// // } ();






// var maxParticleCount = 150; //set max confetti count
// var particleSpeed = 2; //set the particle animation speed
// var startConfetti; //call to start confetti animation
// var stopConfetti; //call to stop adding confetti
// var toggleConfetti; //call to start or stop the confetti animation depending on whether it's already running
// var removeConfetti; //call to stop the confetti animation and remove all confetti immediately

// (function () {
//   startConfetti = startConfettiInner;
//   stopConfetti = stopConfettiInner;
//   toggleConfetti = toggleConfettiInner;
//   removeConfetti = removeConfettiInner;
//   var colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"]
//   var streamingConfetti = false;
//   var animationTimer: null | number = null;
//   var particles = [];
//   var waveAngle = 0;

//   function resetParticle(particle, width, height) {
//     particle.color = colors[(Math.random() * colors.length) | 0];
//     particle.x = Math.random() * width;
//     particle.y = Math.random() * height - height;
//     particle.diameter = Math.random() * 10 + 5;
//     particle.tilt = Math.random() * 10 - 10;
//     particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
//     particle.tiltAngle = 0;
//     return particle;
//   }

//   function startConfettiInner() {
//     var width = window.innerWidth;
//     var height = window.innerHeight;
//     window.requestAnimationFrame = (function () {
//       return window.requestAnimationFrame
//         function (callback) {
//           return window.setTimeout(callback, 16.6666667);
//         };
//     })();
//     var canvas = <HTMLCanvasElement>document.getElementById("confetti-canvas");
//     if (canvas === null) {
//       canvas = document.createElement("canvas");
//       canvas.setAttribute("id", "confetti-canvas");
//       canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none");
//       document.body.appendChild(canvas);
//       canvas.width = width;
//       canvas.height = height;
//       window.addEventListener("resize", function () {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//       }, true);
//     }
//     var context = canvas.getContext("2d");
//     while (particles.length < maxParticleCount)
//       particles.push(resetParticle({}, width, height));
//     streamingConfetti = true;
//     if (animationTimer === null) {
//       (function runAnimation() {
//         context.clearRect(0, 0, window.innerWidth, window.innerHeight);
//         if (particles.length === 0)
//           animationTimer = null;
//         else {
//           updateParticles();
//           drawParticles(context);
//           animationTimer = requestAnimationFrame(runAnimation);
//         }
//       })();
//     }
//   }

//   function stopConfettiInner() {
//     streamingConfetti = false;
//   }

//   function removeConfettiInner() {
//     stopConfetti();
//     particles = [];
//   }

//   function toggleConfettiInner() {
//     if (streamingConfetti)
//       stopConfettiInner();
//     else
//       startConfettiInner();
//   }

//   function drawParticles(context: CanvasRenderingContext2D) {
//     var particle;
//     var x;
//     for (var i = 0; i < particles.length; i++) {
//       particle = particles[i];
//       context.beginPath();
//       context.lineWidth = particle.diameter;
//       context.strokeStyle = particle.color;
//       x = particle.x + particle.tilt;
//       context.moveTo(x + particle.diameter / 2, particle.y);
//       context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
//       context.stroke();
//     }
//   }

//   function updateParticles() {
//     var width = window.innerWidth;
//     var height = window.innerHeight;
//     var particle;
//     waveAngle += 0.01;
//     for (var i = 0; i < particles.length; i++) {
//       particle = particles[i];
//       if (!streamingConfetti && particle.y < -15)
//         particle.y = height + 100;
//       else {
//         particle.tiltAngle += particle.tiltAngleIncrement;
//         particle.x += Math.sin(waveAngle);
//         particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
//         particle.tilt = Math.sin(particle.tiltAngle) * 15;
//       }
//       if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
//         if (streamingConfetti && particles.length <= maxParticleCount)
//           resetParticle(particle, width, height);
//         else {
//           particles.splice(i, 1);
//           i--;
//         }
//       }
//     }
//   }
// })();