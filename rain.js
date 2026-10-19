
(function () {
    'use strict';

    const config = {
        rainDrops: 140,
        rainSpeed: 12,
        rainLength: 18,
        rainOpacity: 0.60,
        wind: 2,
        lightningEnabled: true,
        lightningMinDelay: 8000,
        lightningMaxDelay: 18000,
        lightningOpacity: 0.50,
        glassDropletsEnabled: true,
        glassDropletsMax: 25,
        glassDropletMinDelay: 200,
        glassDropletMaxDelay: 1200,
        glassDropletLife: 5500
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });

    if (!ctx) return;

    canvas.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
    `;

    document.body.appendChild(canvas);

    let width, height, drops = [];
    let lightning = 0;
    let lightningFlashes = [];
    let lightningFlashIndex = 0;
    let lightningEventStart = 0;
    let lightningFadeMs = 100;
    let glassDroplets = [];
    let nextGlassDroplet = 0;
    let nextLightning = 0;
    let lastTime = 0;
    let animationId = null;

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function makeDrop() {
        return {
            x: random(-100, width),
            y: random(-height, height),
            speed: random(0.6, 1.4),
            length: random(0.5, 1.5),
            opacity: random(0.4, 1)
        };
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        glassDroplets = [];
        drops = Array.from(
            { length: config.rainDrops },
            makeDrop
        );
    }

    function scheduleLightning(time) {
        nextLightning = time + random(
            config.lightningMinDelay,
            config.lightningMaxDelay
        );
    }

    // Build one irregular lightning event. Only one flash is active at a time.
    // The configured opacity is a ceiling, not a fixed brightness.
    function beginLightningEvent(time) {
        const roll = Math.random();
        const count = roll < 0.28 ? 1 : roll < 0.68 ? 2 : roll < 0.92 ? 3 : 4;
        const strength = random(0.30, 0.85);
        let offset = 0;

        lightningFlashes = [];
        for (let i = 0; i < count; i++) {
            if (i > 0) offset += random(85, 230);
            lightningFlashes.push({
                at: offset,
                opacity: config.lightningOpacity * Math.min(1, strength * random(0.55, 1.25)),
                fadeMs: random(65, 150)
            });
        }
        lightningEventStart = time;
        lightningFlashIndex = 0;
        scheduleLightning(time + offset);
    }

    function drawLightning(time) {
        if (!config.lightningEnabled) return;

        if (!lightningFlashes.length && time >= nextLightning) {
            beginLightningEvent(time);
        }

        const elapsed = time - lightningEventStart;
        while (lightningFlashIndex < lightningFlashes.length &&
               elapsed >= lightningFlashes[lightningFlashIndex].at) {
            const flash = lightningFlashes[lightningFlashIndex++];
            lightning = flash.opacity;
            lightningFadeMs = flash.fadeMs;
        }

        if (lightning > 0.002) {
            ctx.fillStyle = `rgba(220, 230, 255, ${Math.min(lightning, config.lightningOpacity)})`;
            ctx.fillRect(0, 0, width, height);
            const frameMs = Math.min(Math.max(time - lastTimeForLightning, 0), 100);
            lightning *= Math.exp(-frameMs / lightningFadeMs);
        } else {
            lightning = 0;
        }

        if (lightningFlashIndex >= lightningFlashes.length && lightning <= 0.002) {
            lightningFlashes = [];
        }
    }

    let lastTimeForLightning = 0;

    function drawGlassDroplets(time, delta) {
        if (!config.glassDropletsEnabled) return;

        if (time >= nextGlassDroplet) {
            if (glassDroplets.length < config.glassDropletsMax) {
                glassDroplets.push({
                    x: random(15, Math.max(16, width - 15)),
                    y: random(15, Math.max(16, height - 15)),
                    radius: random(3, 7),
                    born: time,
                    life: config.glassDropletLife * random(0.8, 1.25),
                    drift: Math.random() < 0.35 ? random(0.03, 0.12) : 0
                });
            }
            // Each droplet has its own randomized arrival time.
            // Spawn at most one per event; never spawn synchronized batches.
            nextGlassDroplet = time + random(
                config.glassDropletMinDelay,
                config.glassDropletMaxDelay
            );
        }

        glassDroplets = glassDroplets.filter(d => time - d.born < d.life);
        for (const d of glassDroplets) {
            const age = (time - d.born) / d.life;
            const fade = Math.min(1, age * 5, (1 - age) * 3);
            d.y += d.drift * delta;
            const r = d.radius;

            // Soft dark rim and small reflective highlight: no image assets.
            ctx.beginPath();
            ctx.ellipse(d.x, d.y, r * 0.8, r * 1.25, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(115, 145, 170, ${0.13 * fade})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(210, 230, 245, ${0.30 * fade})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(d.x - r * 0.22, d.y - r * 0.4,
                r * 0.17, r * 0.34, -0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 250, 255, ${0.58 * fade})`;
            ctx.fill();
        }
    }

    function animate(time) {
        if (!lastTime) lastTime = time;

        const delta = Math.min((time - lastTime) / 16.67, 2);
        lastTime = time;

        ctx.clearRect(0, 0, width, height);

        // Draw rain
        for (const drop of drops) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(190, 205, 230, ${
                config.rainOpacity * drop.opacity
            })`;

            ctx.lineWidth = 1;

            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(
                drop.x + config.wind,
                drop.y + config.rainLength * drop.length
            );

            ctx.stroke();

            drop.x += config.wind * delta;
            drop.y += config.rainSpeed * drop.speed * delta;

            if (drop.y > height + 30 || drop.x > width + 30) {
                drop.x = random(-100, width);
                drop.y = random(-100, -10);
            }
        }

        drawGlassDroplets(time, delta);

        // Irregular single/multiple flashes with independent intensities.
        drawLightning(time);
        lastTimeForLightning = time;

        animationId = requestAnimationFrame(animate);
    }

    function start() {
        if (animationId !== null) return;
        lastTime = 0;
        lastTimeForLightning = performance.now();
        lightning = 0;
        lightningFlashes = [];
        lightningFlashIndex = 0;
        scheduleLightning(performance.now());
        nextGlassDroplet = performance.now() + random(
            config.glassDropletMinDelay,
            config.glassDropletMaxDelay
        );
        animationId = requestAnimationFrame(animate);
    }

    function stop() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        ctx.clearRect(0, 0, width, height);
    }

    window.addEventListener('resize', resize);

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else start();
    });

    resize();
    if (!document.hidden) start();
})();
