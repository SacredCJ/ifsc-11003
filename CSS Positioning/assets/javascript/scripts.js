document.addEventListener("DOMContentLoaded", function () {
    /*--------Mouse Tracking--------*/
  document.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  });
function animate() {
  if (mouse.active) {
    const dx = navy.x - mouse.x;
    const dy = navy.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 155;

            if (distance < repelRadius && distance > 0) {
                const force = (repelRadius - distance) / repelRadius;
                // Apply acceleration away from mouse
                navy.vx += (dx / distance) * force * 5;
                navy.vy += (dy / distance) * force * 5;
            }
        }

        // Apply friction
        navy.vx *= 0.95;
        navy.vy *= 0.95;

        // Update position
        navy.x += navy.vx;
        navy.y += navy.vy;

        // Apply transform
        navyElement.style.transform = `translate(${navy.x}px, ${navy.y}px)`;

        requestAnimationFrame(animate);
    }

    // Start animation
    animate();
});