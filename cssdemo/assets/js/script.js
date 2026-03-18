/*--------DOM Ready--------*/
document.addEventListener("DOMContentLoaded", function () {

  /*--------Sections Setup--------*/
  const sections = [
    {
      element: document.querySelector("header.primary"),
      maxStars: 15,
      startStars: 12,
      spawnEvery: 750
    },
    {
      element: document.querySelector(".lower-panel"),
      maxStars: 22,
      startStars: 14,
      spawnEvery: 700
    }
  ];

  /*--------State--------*/
  const stars = [];

  const mouse = {
    x: -9999,
    y: -9999,
    active: false
  };

  /*--------Helpers--------*/
  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function countStarsInSection(sectionElement) {
    return stars.filter(function (star) {
      return star.parent === sectionElement;
    }).length;
  }

  /*--------Create Star--------*/
  function createStar(section, initialSpawn = false) {

    if (!section.element) return null;
    if (countStarsInSection(section.element) >= section.maxStars) return null;

    const star = document.createElement("span");
    star.className = "particle";

    const rect = section.element.getBoundingClientRect();
    const size = randomBetween(2.5, 5.5);

    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.animationDelay = randomBetween(0, 3) + "s";
    star.style.animationDuration = randomBetween(1.8, 3.5) + "s";

    section.element.insertBefore(star, section.element.firstChild);

    let x = 10;
    let y = 10;
    let vx = 0;
    let vy = 0;

    /*--------Spawn Logic--------*/
    if (initialSpawn) {
      x = randomBetween(12, Math.max(20, rect.width - 12));
      y = randomBetween(12, Math.max(20, rect.height - 12));
      vx = randomBetween(-0.8, 0.8);
      vy = randomBetween(-0.8, 0.8);
    } else {
      const edge = Math.floor(randomBetween(0, 4));

      if (edge === 0) {
        x = randomBetween(10, Math.max(20, rect.width - 10));
        y = 6;
        vx = randomBetween(-0.65, 0.65);
        vy = randomBetween(0.2, 0.9);
      } else if (edge === 1) {
        x = rect.width - 6;
        y = randomBetween(10, Math.max(20, rect.height - 10));
        vx = randomBetween(-0.9, -0.2);
        vy = randomBetween(-0.65, 0.65);
      } else if (edge === 2) {
        x = randomBetween(10, Math.max(20, rect.width - 10));
        y = rect.height - 6;
        vx = randomBetween(-0.65, 0.65);
        vy = randomBetween(-0.9, -0.2);
      } else {
        x = 6;
        y = randomBetween(10, Math.max(20, rect.height - 10));
        vx = randomBetween(0.2, 0.9);
        vy = randomBetween(-0.65, 0.65);
      }
    }

    const newStar = {
      el: star,
      parent: section.element,
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      driftTimer: randomBetween(20, 80)
    };

    stars.push(newStar);
    return newStar;
  }

  /*--------Initial Spawn--------*/
  sections.forEach(function (section) {

    for (let i = 0; i < section.startStars; i++) {
      createStar(section, true);
    }

    setInterval(function () {
      createStar(section, false);
    }, section.spawnEvery);
  });

  /*--------Mouse Tracking--------*/
  document.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  });

  document.addEventListener("mouseleave", function () {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  /*--------Animation Loop--------*/
  function animate() {

    stars.forEach(function (star) {

      const rect = star.parent.getBoundingClientRect();

      const starScreenX = rect.left + star.x;
      const starScreenY = rect.top + star.y;

      /*--------Mouse Repel--------*/
      if (mouse.active) {
        const dx = starScreenX - mouse.x;
        const dy = starScreenY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 155;

        if (distance < repelRadius && distance > 0) {
          const force = (repelRadius - distance) / repelRadius;
          star.vx += (dx / distance) * force * 0.26;
          star.vy += (dy / distance) * force * 0.26;
        }
      }

      /*--------Drift Logic--------*/
      star.driftTimer -= 1;

      if (star.driftTimer <= 0) {
        star.vx += randomBetween(-0.2, 0.2);
        star.vy += randomBetween(-0.2, 0.2);
        star.driftTimer = randomBetween(20, 80);
      }

      /*--------Speed Clamp--------*/
      const maxSpeed = 1.45;

      if (star.vx > maxSpeed) star.vx = maxSpeed;
      if (star.vx < -maxSpeed) star.vx = -maxSpeed;
      if (star.vy > maxSpeed) star.vy = maxSpeed;
      if (star.vy < -maxSpeed) star.vy = -maxSpeed;

      /*--------Movement--------*/
      star.x += star.vx;
      star.y += star.vy;

      star.vx *= 0.996;
      star.vy *= 0.996;

      /*--------Bounds--------*/
      const padding = 8;

      if (star.x <= padding) {
        star.x = padding;
        star.vx *= -1;
      }

      if (star.x >= rect.width - padding) {
        star.x = rect.width - padding;
        star.vx *= -1;
      }

      if (star.y <= padding) {
        star.y = padding;
        star.vy *= -1;
      }

      if (star.y >= rect.height - padding) {
        star.y = rect.height - padding;
        star.vy *= -1;
      }

      star.el.style.transform = "translate(" + star.x + "px, " + star.y + "px)";
    });

    requestAnimationFrame(animate);
  }

  /*--------Resize Fix--------*/
  window.addEventListener("resize", function () {

    stars.forEach(function (star) {

      const rect = star.parent.getBoundingClientRect();

      if (star.x > rect.width - 10) {
        star.x = rect.width - 10;
      }

      if (star.y > rect.height - 10) {
        star.y = rect.height - 10;
      }
    });
  });

  /*--------Start Animation--------*/
  animate();
});