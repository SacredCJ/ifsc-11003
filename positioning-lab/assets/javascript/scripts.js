document.addEventListener("DOMContentLoaded", function () {
    const mouse = { x: 0, y: 0 };
    const duck = document.getElementById('duck');
    const winMessage = document.getElementById('win-message');
    const elements = ['navy', 'teal', 'blue', 'aqua'];
    const blocks = {};
    let caughtCount = 0;

    // Initialize blocks
    elements.forEach(id => {
        const el = document.getElementById(id);
        blocks[id] = {
            el: el,
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 50),
            vx: 0,
            vy: 0,
            caught: false
        };
        el.style.left = blocks[id].x + 'px';
        el.style.top = blocks[id].y + 'px';
    });

    // Mouse tracking
    document.addEventListener("mousemove", function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;

        // Update duck position
        duck.style.left = mouse.x - 25 + 'px';
        duck.style.top = mouse.y - 25 + 'px';

        // Leave footprint
        const footprint = document.createElement('div');
        footprint.className = 'footprint';
        footprint.style.left = mouse.x - 10 + 'px';
        footprint.style.top = mouse.y - 10 + 'px';
        document.body.appendChild(footprint);
        setTimeout(() => {
            footprint.remove();
        }, 2000);
    });

    function animate() {
        elements.forEach(id => {
            const block = blocks[id];
            if (block.caught) return;

            // Random movement
            block.vx += (Math.random() - 0.5) * 0.5;
            block.vy += (Math.random() - 0.5) * 0.5;

            // Repel from mouse
            const dx = block.x - mouse.x;
            const dy = block.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 150;

            if (distance < repelRadius && distance > 0) {
                const force = (repelRadius - distance) / repelRadius;
                block.vx += (dx / distance) * force * 3;
                block.vy += (dy / distance) * force * 3;
            }

            // Friction
            block.vx *= 0.98;
            block.vy *= 0.98;

            // Update position
            block.x += block.vx;
            block.y += block.vy;

            // Keep within bounds
            if (block.x < 0) block.x = 0;
            if (block.x > window.innerWidth - 100) block.x = window.innerWidth - 100;
            if (block.y < 0) block.y = 0;
            if (block.y > window.innerHeight - 50) block.y = window.innerHeight - 50;

            block.el.style.left = block.x + 'px';
            block.el.style.top = block.y + 'px';

            // Check for catch
            const rect = block.el.getBoundingClientRect();
            if (mouse.x >= rect.left && mouse.x <= rect.right && mouse.y >= rect.top && mouse.y <= rect.bottom) {
                catchBlock(block);
            }
        });

        requestAnimationFrame(animate);
    }

    function catchBlock(block) {
        block.caught = true;
        caughtCount++;

        // Animate to duck
        const targetX = mouse.x;
        const targetY = mouse.y;
        let steps = 20;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            block.el.style.left = block.x + (targetX - block.x) * progress + 'px';
            block.el.style.top = block.y + (targetY - block.y) * progress + 'px';
            if (step >= steps) {
                clearInterval(interval);
                block.el.remove();
                // Add crumbs
                for (let i = 0; i < 10; i++) {
                    const crumb = document.createElement('div');
                    crumb.className = 'crumb';
                    crumb.style.left = targetX + 'px';
                    crumb.style.top = targetY + 'px';
                    document.body.appendChild(crumb);
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 5 + 2;
                    let crumbX = targetX;
                    let crumbY = targetY;
                    const crumbAnim = setInterval(() => {
                        crumbX += Math.cos(angle) * speed;
                        crumbY += Math.sin(angle) * speed;
                        crumb.style.left = crumbX + 'px';
                        crumb.style.top = crumbY + 'px';
                        speed *= 0.95;
                        if (speed < 0.1) {
                            clearInterval(crumbAnim);
                            crumb.remove();
                        }
                    }, 16);
                }
                if (caughtCount === 4) {
                    winMessage.style.display = 'block';
                }
            }
        }, 16);
    }

    animate();
});