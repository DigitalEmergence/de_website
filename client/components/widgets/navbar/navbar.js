import { createComponent$ } from "../../../../shared/element.min.js";

createComponent$('navbar', (el) => {
    // Configuration options with defaults
    let config = {
        links: [
            { text: 'Home', url: '/' },
            { text: 'JSphere', url: '#jsphere' },
            { text: 'About Us', url: '#about' }
        ],
        themeColor: '#0a0a2a'
    };
    
    el.define$({
        template$: () => /*html*/`
            <link rel="stylesheet" href="/de_website/client/components/widgets/navbar/navbar.css" />
            <nav class="navbar">
                <div class="navbar__container">
                    <div class="navbar__logo">
                        <a href="/" class="logo-text">
                            <span class="logo-icon">DE</span>
                            <span class="logo-name">Digital Emergence</span>
                        </a>
                    </div>
                    <div el-id="navLinks" class="navbar__links">
                        ${config.links.map(link => `
                            <a href="${link.url}" class="navbar__link">${link.text}</a>
                        `).join('')}
                    </div>
                    <div el-id="mobileMenuBtn" class="navbar__mobile-menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        `,
        
        onRender$: async () => {
            // No DOM manipulation in onRender$
            if (el.props$ && el.props$.config) {
                config = { ...config, ...el.props$.config };
            }
        },
        
        onHydrate$: async () => {
            const { mobileMenuBtn, navLinks } = el.children$;
            
            // Mobile menu toggle
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.closest('.navbar') && navLinks.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
            
            // Add scroll effect
            window.addEventListener('scroll', () => {
                const navbar = el.querySelector('.navbar');
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    });
});
