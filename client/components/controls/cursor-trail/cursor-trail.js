import { createComponent$ } from "../../../../shared/element.js";

createComponent$('cursor-trail', (el) => {
    // State variables
    let particles = [];
    let cleanupTimer = null;
    let container = null;
    
    el.define$({
        template$: () => `
            <link rel="stylesheet" href="/de_website/client/components/controls/cursor-trail/cursor-trail.css"/>
            <div el-id="container" class="cursor-trail-container">BRUUUUHHHHH</div>
        `,
        use$: () => [],
        onInit$: async () => {
            // Initialize state
            el.state$.config = {
                particleCount: 15,         // Number of particles to create
                particleLifetime: 1000,    // Lifetime of particles in milliseconds
                minSize: 5,                // Minimum particle size in pixels
                maxSize: 20,               // Maximum particle size in pixels
                minOpacity: 0.2,           // Minimum particle opacity
                maxOpacity: 0.8,           // Maximum particle opacity
                cleanupInterval: 200       // Interval to clean up old particles
            };
            
            el.state$.mouseX = 0;
            el.state$.mouseY = 0;
            el.state$.prevMouseX = 0;
            el.state$.prevMouseY = 0;
            el.state$.mouseSpeed = 0;
            el.state$.mouseAngle = 0;
            el.state$.isActive = false;
        },
        onRender$: async () => {
            // Nothing to do for server-side rendering
        },
        onHydrate$: async () => {
            try {
                console.log("Cursor trail hydrating...");
                
                // Get container reference
                container = el.children$.container;
                if (!container) {
                    console.error("Cursor trail container not found");
                    return;
                }
                
                // Ensure container has proper dimensions
                container.style.width = '100%';
                container.style.height = '100%';
                
                console.log("Container found:", container);
                console.log("Container dimensions:", container.offsetWidth, "x", container.offsetHeight);
                
                // Setup event listeners
                document.addEventListener('mousemove', handleMouseMove);
                
                // Start animation loop
                requestAnimationFrame(updateParticles);
                
                // Setup cleanup timer with a fixed interval as fallback
                const cleanupInterval = el.state$.config ? el.state$.config.cleanupInterval : 200;
                cleanupTimer = setInterval(cleanupParticles, cleanupInterval);
                
                // Set active state
                el.state$.isActive = true;
                
                console.log("Cursor trail initialized successfully");
            } catch (error) {
                console.error("Error initializing cursor trail:", error);
            }
        },
        onDisconnect$: async () => {
            // Clean up event listeners and timers
            document.removeEventListener('mousemove', handleMouseMove);
            if (cleanupTimer) {
                clearInterval(cleanupTimer);
                cleanupTimer = null;
            }
            
            if (el.state$) {
                el.state$.isActive = false;
            }
            
            // Remove all particles
            if (container) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            }
            
            particles = [];
        }
    });

    // ------------------------ EVENT HANDLERS -------------------------
    
    function handleMouseMove(event) {
        if (!el.state$ || !el.state$.isActive) return;
        
        // Update mouse position
        el.state$.prevMouseX = el.state$.mouseX;
        el.state$.prevMouseY = el.state$.mouseY;
        el.state$.mouseX = event.clientX;
        el.state$.mouseY = event.clientY;
        
        // Calculate mouse speed and angle
        const dx = el.state$.mouseX - el.state$.prevMouseX;
        const dy = el.state$.mouseY - el.state$.prevMouseY;
        el.state$.mouseSpeed = Math.sqrt(dx * dx + dy * dy);
        el.state$.mouseAngle = Math.atan2(dy, dx);
        
        // Create particles based on mouse movement
        if (el.state$.mouseSpeed > 0) {
            createParticle();
        }
    }
    
    // ------------------------- PARTICLE FUNCTIONS -------------------------
    
    function createParticle() {
        // Don't create particles if not active or config not initialized
        if (!el.state$ || !el.state$.isActive || !container || !el.state$.config) return;
        
        try {
            // Calculate particle properties based on mouse speed
            const config = el.state$.config;
            const speedFactor = Math.min(el.state$.mouseSpeed / 20, 1);
            const size = config.minSize + speedFactor * (config.maxSize - config.minSize);
            const opacity = config.minOpacity + speedFactor * (config.maxOpacity - config.minOpacity);
            
            // Create particle element
            const particle = document.createElement('div');
            particle.className = 'cursor-trail-particle';
            
            // Set initial position - use fixed positioning relative to viewport
            particle.style.position = 'fixed';
            particle.style.left = `${el.state$.mouseX}px`;
            particle.style.top = `${el.state$.mouseY}px`;
            
            // Set size and opacity
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            
            // Set transform based on mouse direction
            const rotation = (el.state$.mouseAngle * 180 / Math.PI) + 90; // Convert to degrees and adjust
            particle.style.transform = `rotate(${rotation}deg)`;
            
            // Add to container
            container.appendChild(particle);
            
            // Store particle data
            const timestamp = Date.now();
            particles.push({
                element: particle,
                createdAt: timestamp,
                expiresAt: timestamp + config.particleLifetime
            });
        } catch (error) {
            console.error("Error creating particle:", error);
        }
    }
    
    function updateParticles() {
        // Skip if not active
        if (!el.state$ || !el.state$.isActive) return;
        
        try {
            // Update each particle's opacity based on its age
            const now = Date.now();
            
            // Skip if config not initialized
            if (!el.state$.config) {
                requestAnimationFrame(updateParticles);
                return;
            }
            
            const config = el.state$.config;
            
            particles.forEach(particle => {
                if (!particle || !particle.element) return;
                
                const age = now - particle.createdAt;
                const lifePercent = age / config.particleLifetime;
                
                if (lifePercent < 1) {
                    // Update opacity
                    particle.element.style.opacity = Math.max(0, config.maxOpacity * (1 - lifePercent));
                    
                    // Update scale
                    const scale = 1 + lifePercent; // Grow as it ages
                    particle.element.style.transform += ` scale(${scale})`;
                }
            });
            
            // Continue animation loop if active
            if (el.state$.isActive) {
                requestAnimationFrame(updateParticles);
            }
        } catch (error) {
            console.error("Error updating particles:", error);
            requestAnimationFrame(updateParticles);
        }
    }
    
    function cleanupParticles() {
        if (!el.state$ || !el.state$.isActive) return;
        
        try {
            // Remove expired particles
            const now = Date.now();
            
            // Skip if no particles
            if (particles.length === 0) return;
            
            // Filter out expired particles
            const expiredParticles = particles.filter(p => p && p.expiresAt <= now);
            
            // Remove expired particles from DOM
            expiredParticles.forEach(p => {
                if (p && p.element && p.element.parentNode) {
                    p.element.parentNode.removeChild(p.element);
                }
            });
            
            // Update particles array
            particles = particles.filter(p => p && p.expiresAt > now);
        } catch (error) {
            console.error("Error cleaning up particles:", error);
        }
    }
});
