import { createComponent$ } from "../../../../shared/element.js";

createComponent$('aboutpage', (el) => {
    // State variables
    let trailElement = null;
    let prevX = 0;
    let prevY = 0;
    let lastTime = 0;
    let overlayTimeout = null;

    el.define$({
        use$: () => [],
        onInit$: async () => {
            // Initialize state
            el.state$.cursorTrail = {
                isActive: false
            };
            el.state$.overlay = {
                isActive: true
            };
            el.state$.mobileMenu = {
                isOpen: false
            };
        },
        onRender$: async () => {
            // Nothing to do for server-side rendering
        },
        onHydrate$: async () => {
            try {
                // Initialize video overlay
                const overlay = document.getElementById('page-overlay');
                const video = document.getElementById('overlay-video');
                
                if (video && overlay) {
                    // Play video
                    video.play();
                    
                    // Set timeout to fade out overlay after 6 seconds
                    overlayTimeout = setTimeout(() => {
                        overlay.classList.add('fade-out');
                        // Remove overlay from DOM after fade animation
                        setTimeout(() => {
                            if (overlay.parentNode) {
                                overlay.parentNode.removeChild(overlay);
                            }
                        }, 1000); // Wait for fade animation to complete
                    }, 6000);
                }

                // Initialize mobile menu
                const hamburgerBtn = el.querySelector('.hamburger_menu');
                const closeBtn = el.querySelector('.close_menu');
                const mobileOverlay = el.querySelector('.mobile_menu_overlay');
                const mobileLinks = el.querySelectorAll('.mobile_nav_links .nav_link');

                // Function to handle mobile menu state changes
                const toggleMobileMenu = (isOpen) => {
                    if (!el.state$.mobileMenu) {
                        el.state$.mobileMenu = {};
                    }
                    Object.assign(el.state$.mobileMenu, { isOpen });
                    
                    if (hamburgerBtn && mobileOverlay) {
                        if (isOpen) {
                            hamburgerBtn.classList.add('active');
                            mobileOverlay.classList.add('active');
                        } else {
                            hamburgerBtn.classList.remove('active');
                            mobileOverlay.classList.remove('active');
                        }
                    }
                };

                if (hamburgerBtn && mobileOverlay) {
                    // Toggle menu on hamburger click
                    hamburgerBtn.addEventListener('click', () => {
                        const currentState = el.state$.mobileMenu?.isOpen || false;
                        toggleMobileMenu(!currentState);
                    });

                    // Close menu on close button click
                    closeBtn.addEventListener('click', () => {
                        toggleMobileMenu(false);
                    });

                    // Close menu when clicking outside
                    mobileOverlay.addEventListener('click', (e) => {
                        if (e.target === mobileOverlay) {
                            toggleMobileMenu(false);
                        }
                    });

                    // Close menu when clicking a link
                    mobileLinks.forEach(link => {
                        link.addEventListener('click', () => {
                            toggleMobileMenu(false);
                        });
                    });
                }

                // Initialize cursor trail after a small delay to ensure DOM is ready
                setTimeout(() => {
                    console.log("Initializing cursor trail...");

                    // Initialize state if not already done
                    if (!el.state$.cursorTrail) {
                        el.state$.cursorTrail = {
                            isActive: false
                        };
                    }
                    
                    // Get container reference
                    const container = document.getElementById('cursor-trail-container');
                    if (!container) {
                        console.error("Cursor trail container not found");
                        return;
                    }
                    
                    // Create trail element
                    trailElement = document.createElement('div');
                    trailElement.className = 'cursor-trail';
                    container.appendChild(trailElement);
                    
                    // Setup event listeners
                    window.addEventListener('mousemove', handleMouseMove);
                    
                    // Set active state
                    el.state$.cursorTrail.isActive = true;
                    
                    console.log("Cursor trail initialized successfully");
                }, 100);
            } catch (error) {
                console.error("Error initializing cursor trail:", error);
            }
        },
        onDisconnect$: async () => {
            // Clean up event listeners
            window.removeEventListener('mousemove', handleMouseMove);
            
            if (el.state$.cursorTrail) {
                el.state$.cursorTrail.isActive = false;
            }
            
            // Clear overlay timeout
            if (overlayTimeout) {
                clearTimeout(overlayTimeout);
            }
            
            // Remove trail element
            if (trailElement && trailElement.parentNode) {
                trailElement.parentNode.removeChild(trailElement);
            }
            trailElement = null;
        }
    });

    // ------------------------ EVENT HANDLERS -------------------------
    
    function handleMouseMove(event) {
        if (!el.state$.cursorTrail?.isActive || !trailElement) return;
        
        const currentTime = Date.now();
        const timeDelta = currentTime - lastTime;
        
        // Calculate speed and direction
        const dx = event.clientX - prevX;
        const dy = event.clientY - prevY;
        const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(1, timeDelta);
        const angle = Math.atan2(dy, dx);
        
        // Update trail
        if (speed > 0) {
            // Calculate scale based on speed (with min and max limits)
            const scale = Math.min(1 + speed * 3, 8);
            
            // Position trail at cursor (adjusted for center origin)
            const x = event.clientX - 4; // Half of dot width
            const y = event.clientY - 4; // Half of dot height
            
            // Calculate rotation for shadow direction
            const rotation = (angle * 180 / Math.PI) + 90;
            
            // Apply transform
            trailElement.style.transform = `
                translate(${x}px, ${y}px)
                rotate(${rotation}deg)
                scale(${scale})
            `;
        }
        
        // Store current position and time for next frame
        prevX = event.clientX;
        prevY = event.clientY;
        lastTime = currentTime;
    }
});
