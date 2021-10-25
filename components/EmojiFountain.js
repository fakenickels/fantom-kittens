import React from "react";

// inspired by rainbow's LP
export class Fountain {
  constructor() {
    this.limit = 35;
    this.particles = [];
    this.autoAddParticle = false;
    this.height = document.documentElement.clientHeight;
    this.sizes = [15, 20, 25, 35, 45];
    this.variants = [
      "🎉",
      "💰",
      "🐱",
      "😸",
      "🙀"
    ];
    this.addHandlers();
    this.loop();
  }

  updateAnchor(anchor) {
    this.mouseX = anchor.offsetLeft;
    this.mouseY = anchor.offsetTop;
  }

  loop() {
    if (this.autoAddParticle && this.particles.length < this.limit) {
      this.createParticle();
    }

    this.updateParticles();

    requestAnimationFrame(this.loop.bind(this));
  }

  start() {
    this.autoAddParticle = true;
  }

  stop() {
    this.autoAddParticle = false;
  }

  addHandlers() {
    const isTouchInteraction =
      "ontouchstart" in window || navigator.msMaxTouchPoints;

    const move = isTouchInteraction ? "touchmove" : "mousemove";

    // document.addEventListener(
    //   move,
    //   (e) => {
    //     this.mouseX = e.pageX || e.touches[0].pageX;
    //     this.mouseY = e.pageY || e.touches[0].pageY;
    //   },
    //   { passive: false }
    // );
  }

  createParticle() {
    const size = this.sizes[Math.floor(Math.random() * this.sizes.length)];
    const speedHorz = Math.random() * 10;
    const speedUp = Math.random() * 25;
    const spinVal = Math.random() * 360;
    const spinSpeed = Math.random() * 35 * (Math.random() <= 0.5 ? -1 : 1);
    const top = this.mouseY - size / 2;
    const left = this.mouseX - size / 2;
    const direction = Math.random() <= 0.5 ? -1 : 1;

    const particle = document.createElement("span");
    particle.innerHTML = this.variants[
      Math.floor(Math.random() * this.variants.length)
    ];
    particle.classList.add("particle");

    particle.setAttribute(
      "style",
      `
        font-size: ${size}px;
        top: ${top}px;
        left: ${left}px;
        transform: rotate(${spinVal}deg);
      `
    );

    document.body.appendChild(particle);

    this.particles.push({
      element: particle,
      size,
      speedHorz,
      speedUp,
      spinVal,
      spinSpeed,
      top,
      left,
      direction,
    });
  }

  updateParticles() {
    this.particles.forEach((p) => {
      p.left = p.left - p.speedHorz * p.direction;
      p.top = p.top - p.speedUp;
      p.speedUp = Math.min(p.size, p.speedUp - 1);
      p.spinVal = p.spinVal + p.spinSpeed;

      if (p.top >= this.height + p.size) {
        this.particles = this.particles.filter((o) => o !== p);
        p.element.remove();
      }

      p.element.setAttribute(
        "style",
        `
          top: ${p.top}px;
          left: ${p.left}px;
          font-size: ${p.size}px;
          transform:rotate(${p.spinVal}deg);
        `
      );
    });
  }
}

export const useFountain = () => {
  const [fountain, setFountain] = React.useState(null);

  const ref = React.useRef(null);

  React.useEffect(() => {
    setFountain(new Fountain());
  }, [])

  return {
    ref,
    start: () => {
      fountain.updateAnchor(ref.current)
      fountain.start();
    }
  }
}