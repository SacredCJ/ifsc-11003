document.addEventListener("DOMContentLoaded", function () {
    /*--------Mouse Tracking--------*/
    const mouse = { x: 0, y: 0, active: false };
    const navy = { x: 0, y: 0, vx: 0, vy: 0 };
    const navyElement = document.getElementById('navy');

    document.addEventListener("mousemove", function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;
    });

    function animate() {
        // Add random movement to make it float around
        navy.vx += (Math.random() - 0.5) * 1.0;
        navy.vy += (Math.random() - 0.5) * 1.0;

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