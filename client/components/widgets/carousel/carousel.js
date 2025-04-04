import { createComponent$ } from "../../../../shared/element.min.js";

createComponent$('carousel', (el) => {
    // Sample slides data
    const SLIDES = [
        {
            title: "Slide 1",
            content: "This is the first slide content",
            backgroundColor: "#4285F4",
            textColor: "white"
        },
        {
            title: "Slide 2",
            content: "This is the second slide content",
            backgroundColor: "#34A853",
            textColor: "white"
        },
        {
            title: "Slide 3",
            content: "This is the third slide content",
            backgroundColor: "#FBBC05",
            textColor: "white"
        }
    ];
    
    let currentIndex = 0;
    let autoplayInterval = null;
    
    el.define$({
        template$: () => /*html*/`
            <link rel="stylesheet" href="/de_website/client/components/widgets/carousel/carousel.css" />
            <div class="carousel">
                <div class="carousel__container">
                    <div el-id="slidesContainer" class="carousel__slides">
                        <!-- Pre-render slides in the template -->
                        <div el-id="slide0" class="carousel__slide active" style="background-color: #4285F4; color: white;">
                            <div class="carousel__slide-content">
                                <h2>Slide 1</h2>
                                <p>This is the first slide content</p>
                            </div>
                        </div>
                        <div el-id="slide1" class="carousel__slide" style="background-color: #34A853; color: white;">
                            <div class="carousel__slide-content">
                                <h2>Slide 2</h2>
                                <p>This is the second slide content</p>
                            </div>
                        </div>
                        <div el-id="slide2" class="carousel__slide" style="background-color: #FBBC05; color: white;">
                            <div class="carousel__slide-content">
                                <h2>Slide 3</h2>
                                <p>This is the third slide content</p>
                            </div>
                        </div>
                    </div>
                    <button el-id="prevButton" class="carousel__button carousel__button--prev">&lt;</button>
                    <button el-id="nextButton" class="carousel__button carousel__button--next">&gt;</button>
                </div>
                <div el-id="indicators" class="carousel__indicators">
                    <!-- Pre-render indicators in the template -->
                    <span el-id="indicator0" class="carousel__indicator active" data-index="0"></span>
                    <span el-id="indicator1" class="carousel__indicator" data-index="1"></span>
                    <span el-id="indicator2" class="carousel__indicator" data-index="2"></span>
                </div>
            </div>
        `,
        onRender$: async () => {
            // No DOM manipulation in onRender$
        },
        onHydrate$: async () => {
            const { prevButton, nextButton } = el.children$;
            
            // Set up event listeners
            prevButton.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
            
            nextButton.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
            
            // Set up indicator clicks
            for (let i = 0; i < SLIDES.length; i++) {
                const indicator = el.children$[`indicator${i}`];
                indicator.addEventListener('click', () => {
                    goToSlide(i);
                });
            }
            
            // Start autoplay
            startAutoplay();
            
            // Pause on hover
            const carousel = el.querySelector('.carousel');
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
        }
    });
    
    // ------------------------- HELPER FUNCTIONS -------------------------
    
    function goToSlide(index) {
        // Handle wrapping
        if (index < 0) {
            index = SLIDES.length - 1;
        } else if (index >= SLIDES.length) {
            index = 0;
        }
        
        // Get current slide and indicator
        const currentSlide = el.children$[`slide${currentIndex}`];
        const currentIndicator = el.children$[`indicator${currentIndex}`];
        
        // Get new slide and indicator
        const newSlide = el.children$[`slide${index}`];
        const newIndicator = el.children$[`indicator${index}`];
        
        // Update classes
        currentSlide.classList.remove('active');
        currentIndicator.classList.remove('active');
        newSlide.classList.add('active');
        newIndicator.classList.add('active');
        
        // Update transform
        el.children$.slidesContainer.style.transform = `translateX(-${index * 100 / SLIDES.length}%)`;
        
        // Update current index
        currentIndex = index;
    }
    
    function startAutoplay() {
        if (autoplayInterval) return;
        
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
});
