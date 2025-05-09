import { createComponent$ } from "../../../../shared/element.js";

createComponent$('jspherepage', (el) => {
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
                // Initialize state
                if (!el.state$.cursorTrail) {
                    el.state$.cursorTrail = { isActive: false };
                }
                if (!el.state$.mobileMenu) {
                    el.state$.mobileMenu = { isOpen: false };
                }

                // Initialize all components immediately
                initializeVideoOverlay();
                initializeMobileMenu();
                initializeExpandableSections();
                initializeCursorTrail();
            } catch (error) {
                console.error("Error in onHydrate:", error);
            }
        },
        onDisconnect$: async () => {
            try {
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
            } catch (error) {
                console.warn("Error during cleanup:", error);
            }
        }
    });

    // ------------------------ INITIALIZATION FUNCTIONS -------------------------

    function initializeVideoOverlay() {
        const overlay = document.getElementById('page-overlay');
        const video = document.getElementById('overlay-video');
        
        if (video && overlay) {
            video.play();
            overlayTimeout = setTimeout(() => {
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 1000);
            }, 6000);
        }
    }

    function initializeMobileMenu() {
        const hamburgerBtn = el.querySelector('.hamburger_menu');
        const closeBtn = el.querySelector('.close_menu');
        const mobileOverlay = el.querySelector('.mobile_menu_overlay');
        const mobileLinks = el.querySelectorAll('.mobile_nav_links .nav_link');

        if (!hamburgerBtn || !mobileOverlay) return;

        const toggleMobileMenu = (isOpen) => {
            el.state$.mobileMenu.isOpen = isOpen;
            if (isOpen) {
                hamburgerBtn.classList.add('active');
                mobileOverlay.classList.add('active');
            } else {
                hamburgerBtn.classList.remove('active');
                mobileOverlay.classList.remove('active');
            }
        };

        hamburgerBtn.addEventListener('click', () => {
            toggleMobileMenu(!el.state$.mobileMenu.isOpen);
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => toggleMobileMenu(false));
        }

        mobileOverlay.addEventListener('click', (e) => {
            if (e.target === mobileOverlay) toggleMobileMenu(false);
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });
    }

    function initializeExpandableSections() {
        const expandButtons = el.querySelectorAll('.expand-btn');
        if (!expandButtons.length) return;

        expandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                try {
                    const pointItem = e.target.closest('.point_item');
                    if (!pointItem) return;

                    const isExpanded = pointItem.classList.contains('expanded');
                    
                    // Close any other expanded items
                    el.querySelectorAll('.point_item.expanded').forEach(item => {
                        if (item !== pointItem) {
                            item.classList.remove('expanded');
                            const btn = item.querySelector('.expand-btn');
                            if (btn) btn.textContent = 'Show More';
                        }
                    });
                    
                    // Toggle current item
                    pointItem.classList.toggle('expanded');
                    e.target.textContent = isExpanded ? 'Show More' : 'Show Less';
                    
                    // Scroll expanded item into view
                    if (!isExpanded) {
                        setTimeout(() => {
                            pointItem.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }, 300);
                    }
                } catch (error) {
                    console.warn("Error handling expand button click:", error);
                }
            });
        });
    }

    function initializeCursorTrail() {
        try {
            const container = document.getElementById('cursor-trail-container');
            if (!container) {
                console.warn("Cursor trail container not found");
                return;
            }

            trailElement = document.createElement('div');
            trailElement.className = 'cursor-trail';
            container.appendChild(trailElement);

            window.addEventListener('mousemove', handleMouseMove);
            el.state$.cursorTrail.isActive = true;

            console.log("Cursor trail initialized successfully");
        } catch (error) {
            console.warn("Error initializing cursor trail:", error);
        }
    }

    // ------------------------ EVENT HANDLERS -------------------------
    
    function handleMouseMove(event) {
        if (!el.state$.cursorTrail?.isActive || !trailElement) return;
        
        // Update trail position immediately
        const x = event.clientX - 4;
        const y = event.clientY - 4;
        
        // Calculate speed for effects
        const dx = event.clientX - prevX;
        const dy = event.clientY - prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const normalizedSpeed = Math.min(speed / 20, 1); // Faster response
        
        // Calculate rotation based on movement direction
        const angle = Math.atan2(dy, dx);
        const rotation = (angle * 180 / Math.PI) + 90;
        
        // Scale based on speed with more immediate response
        const scale = 1 + normalizedSpeed;
        
        // Apply immediate transform
        trailElement.style.transform = `
            translate(${x}px, ${y}px)
            rotate(${rotation}deg)
            scale(${scale})
        `;
        
        // Update glow intensity based on speed
        const intensity = 15 + normalizedSpeed * 15;
        trailElement.style.filter = `
            drop-shadow(0 0 ${intensity}px var(--main-blue))
            drop-shadow(0 0 ${intensity}px var(--main-green))
            drop-shadow(0 0 ${intensity}px var(--main-red))
        `;
        
        // Store current position for next frame
        prevX = event.clientX;
        prevY = event.clientY;
    }
});
