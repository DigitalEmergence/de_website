import { createComponent$ } from "../../../../shared/element.js";

createComponent$('homepage', (el) => {
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
                isActive: true
            };
            el.state$.overlay = {
                isActive: true
            };
            el.state$.mobileMenu = {
                isOpen: false
            };
            el.state$.contact = {
                isFormVisible: false
            };
        },
        onRender$: async () => {
            // Nothing to do for server-side rendering
        },
        onHydrate$: async () => {
            try {
                console.log('Initializing contact form...');
                // Initialize contact form
                const contactButton = el.querySelector('.contact_button');
                const contactContent = el.querySelector('.contact_content');
                const contactForm = el.querySelector('.contact_form');
                const closeFormButton = el.querySelector('.close_form');

                if (!contactButton || !contactContent || !contactForm || !closeFormButton) {
                    throw new Error('Contact form elements not found');
                }

                // Function to show form
                const showForm = () => {
                    console.log('Showing contact form');
                    el.state$.contact.isFormVisible = true;
                    contactContent.classList.add('hidden');
                    contactForm.classList.remove('hidden');
                };

                // Function to hide form
                const hideForm = () => {
                    console.log('Hiding contact form');
                    el.state$.contact.isFormVisible = false;
                    contactForm.classList.add('hidden');
                    contactContent.classList.remove('hidden');
                };

                // Contact button click handler
                contactButton.addEventListener('click', showForm);

                // Close button click handler
                closeFormButton.addEventListener('click', hideForm);

                // Form submission handler
                contactForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    console.log('Form submitted');
                    const formData = new FormData(contactForm);
                    
                    // Here you would typically send the form data to your backend
                    console.log('Form data:', {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        message: formData.get('message')
                    });

                    // Show success message
                    const submitButton = contactForm.querySelector('.submit_button');
                    const originalText = submitButton.textContent;
                    submitButton.textContent = 'Message Sent!';
                    submitButton.style.backgroundColor = '#4CAF50';
                    
                    setTimeout(() => {
                        // Reset form
                        contactForm.reset();
                        submitButton.textContent = originalText;
                        submitButton.style.backgroundColor = '';
                        hideForm();
                    }, 2000);
                });

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


                // Initialize cursor trail
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
