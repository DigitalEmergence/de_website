import { createComponent$ } from "../../../../shared/element.min.js";

createComponent$('accordion', (el) => {
    // Configuration options with defaults
    let config = {
        allowMultiple: false,
        animationDuration: 300,
        defaultOpenIndex: 0,
        enableSearch: true,
        enableMemory: true,
        enableExpandAll: true,
        themeColors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335']
    };
    
    // FAQ accordion items
    let items = [
        {
            title: "What is JSphere?",
            content: "JSphere is a powerful framework for building dynamic web applications with server-side and client-side rendering capabilities."
        },
        {
            title: "How do I create components?",
            content: "Components in JSphere are created using the createComponent$ function. Check out our documentation for detailed guides."
        },
        {
            title: "What are the lifecycle methods?",
            content: "JSphere components have three main lifecycle methods: onInit$, onRender$, and onHydrate$. Each serves a specific purpose in the component lifecycle."
        },
        {
            title: "How do components communicate?",
            content: "Components can communicate using the message system with emitMessage$ and subscribeTo$ methods."
        }
    ];
    
    // Component state
    let openSections = new Set();
    let searchTerm = '';
    
    el.define$({
        template$: () => /*html*/`
            <link rel="stylesheet" href="/de_website/client/components/widgets/accordion/accordion.css" />
            <div class="accordion">
                <!-- Optional search bar -->
                <div el-id="searchContainer" class="accordion__search-container" style="display: none;">
                    <input el-id="searchInput" type="text" class="accordion__search" placeholder="Search...">
                </div>
                
                <!-- Optional expand/collapse all -->
                <div el-id="controlsContainer" class="accordion__controls" style="display: none;">
                    <button el-id="expandAllBtn" class="accordion__control-btn">Expand All</button>
                    <button el-id="collapseAllBtn" class="accordion__control-btn">Collapse All</button>
                </div>
                
                <!-- Accordion items container -->
                <div el-id="itemsContainer" class="accordion__items">
                    <!-- Items will be pre-rendered here -->
                    <div el-id="section0" class="accordion__section">
                        <div el-id="header0" class="accordion__header" data-index="0">
                            <span el-id="icon0" class="accordion__icon"></span>
                            <h3 el-id="title0" class="accordion__title">What is JSphere?</h3>
                        </div>
                        <div el-id="content0" class="accordion__content">
                            <div el-id="inner0" class="accordion__inner">
                                JSphere is a powerful framework for building dynamic web applications with server-side and client-side rendering capabilities.
                            </div>
                        </div>
                    </div>
                    
                    <div el-id="section1" class="accordion__section">
                        <div el-id="header1" class="accordion__header" data-index="1">
                            <span el-id="icon1" class="accordion__icon"></span>
                            <h3 el-id="title1" class="accordion__title">How do I create components?</h3>
                        </div>
                        <div el-id="content1" class="accordion__content">
                            <div el-id="inner1" class="accordion__inner">
                                Components in JSphere are created using the createComponent$ function. Check out our documentation for detailed guides.
                            </div>
                        </div>
                    </div>
                    
                    <div el-id="section2" class="accordion__section">
                        <div el-id="header2" class="accordion__header" data-index="2">
                            <span el-id="icon2" class="accordion__icon"></span>
                            <h3 el-id="title2" class="accordion__title">What are the lifecycle methods?</h3>
                        </div>
                        <div el-id="content2" class="accordion__content">
                            <div el-id="inner2" class="accordion__inner">
                                JSphere components have three main lifecycle methods: onInit$, onRender$, and onHydrate$. Each serves a specific purpose in the component lifecycle.
                            </div>
                        </div>
                    </div>
                    
                    <div el-id="section3" class="accordion__section">
                        <div el-id="header3" class="accordion__header" data-index="3">
                            <span el-id="icon3" class="accordion__icon"></span>
                            <h3 el-id="title3" class="accordion__title">How do components communicate?</h3>
                        </div>
                        <div el-id="content3" class="accordion__content">
                            <div el-id="inner3" class="accordion__inner">
                                Components can communicate using the message system with emitMessage$ and subscribeTo$ methods.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        
        onRender$: async () => {
            // No DOM manipulation in onRender$
        },
        
        onHydrate$: async () => {
            // Initialize with configuration
            if (el.props$ && el.props$.config) {
                config = { ...config, ...el.props$.config };
            }
            
            if (el.props$ && el.props$.items) {
                items = el.props$.items;
                
                // Update DOM to reflect the new items
                for (let i = 0; i < items.length; i++) {
                    // Get or create elements for this item
                    let section, header, icon, title, content, inner;
                    
                    // If section already exists, use it
                    if (el.children$[`section${i}`]) {
                        section = el.children$[`section${i}`];
                        header = el.children$[`header${i}`];
                        icon = el.children$[`icon${i}`];
                        title = el.children$[`title${i}`];
                        content = el.children$[`content${i}`];
                        inner = el.children$[`inner${i}`];
                        
                        // Update content
                        title.textContent = items[i].title;
                        inner.textContent = items[i].content;
                    } else {
                        // Create new section for items beyond the template
                        const itemsContainer = el.children$.itemsContainer;
                        
                        // Create new section
                        section = document.createElement('div');
                        section.className = 'accordion__section';
                        section.setAttribute('el-id', `section${i}`);
                        
                        // Create header
                        header = document.createElement('div');
                        header.className = 'accordion__header';
                        header.setAttribute('el-id', `header${i}`);
                        header.setAttribute('data-index', i);
                        
                        // Create icon
                        icon = document.createElement('span');
                        icon.className = 'accordion__icon';
                        icon.setAttribute('el-id', `icon${i}`);
                        
                        // Create title
                        title = document.createElement('h3');
                        title.className = 'accordion__title';
                        title.setAttribute('el-id', `title${i}`);
                        title.textContent = items[i].title;
                        
                        // Create content container
                        content = document.createElement('div');
                        content.className = 'accordion__content';
                        content.setAttribute('el-id', `content${i}`);
                        
                        // Create inner content
                        inner = document.createElement('div');
                        inner.className = 'accordion__inner';
                        inner.setAttribute('el-id', `inner${i}`);
                        inner.textContent = items[i].content;
                        
                        // Assemble the elements
                        header.appendChild(icon);
                        header.appendChild(title);
                        content.appendChild(inner);
                        section.appendChild(header);
                        section.appendChild(content);
                        
                        // Add to the DOM
                        itemsContainer.appendChild(section);
                        
                        // Register with el.children$
                        el.children$[`section${i}`] = section;
                        el.children$[`header${i}`] = header;
                        el.children$[`icon${i}`] = icon;
                        el.children$[`title${i}`] = title;
                        el.children$[`content${i}`] = content;
                        el.children$[`inner${i}`] = inner;
                    }
                }
                
                // Hide any extra sections from the template
                let i = items.length;
                while (el.children$[`section${i}`]) {
                    el.children$[`section${i}`].style.display = 'none';
                    i++;
                }
            }
            
            // Set up search functionality if enabled
            if (config.enableSearch) {
                const { searchContainer, searchInput } = el.children$;
                searchContainer.style.display = 'block';
                searchInput.addEventListener('input', handleSearch);
            }
            
            // Set up expand/collapse all if enabled
            if (config.enableExpandAll) {
                const { controlsContainer, expandAllBtn, collapseAllBtn } = el.children$;
                controlsContainer.style.display = 'flex';
                expandAllBtn.addEventListener('click', expandAll);
                collapseAllBtn.addEventListener('click', collapseAll);
            }
            
            // Set up event listeners for each accordion section
            for (let i = 0; i < items.length; i++) {
                const header = el.children$[`header${i}`];
                header.addEventListener('click', () => toggleSection(i));
                
                // Apply theme color to section
                const section = el.children$[`section${i}`];
                const themeColor = config.themeColors[i % config.themeColors.length];
                section.style.setProperty('--section-theme-color', themeColor);
            }
            
            // Initialize with default open section or from memory
            if (config.enableMemory) {
                try {
                    const savedOpenSections = JSON.parse(localStorage.getItem('accordionOpenSections'));
                    if (savedOpenSections && Array.isArray(savedOpenSections)) {
                        savedOpenSections.forEach(index => openSection(parseInt(index)));
                    }
                } catch (e) {
                    // If memory fails, fall back to default
                    if (config.defaultOpenIndex !== null) {
                        openSection(config.defaultOpenIndex);
                    }
                }
            } else if (config.defaultOpenIndex !== null) {
                openSection(config.defaultOpenIndex);
            }
            
            // Set up keyboard navigation
            document.addEventListener('keydown', handleKeydown);
            
            // Set up touch gestures
            setupTouchGestures();
        }
    });
    
    // ------------------------- HELPER FUNCTIONS -------------------------
    
    function toggleSection(index) {
        if (openSections.has(index)) {
            closeSection(index);
        } else {
            openSection(index);
        }
    }
    
    function openSection(index) {
        // If not allowing multiple open sections, close all others
        if (!config.allowMultiple) {
            openSections.forEach(i => {
                if (i !== index) closeSection(i);
            });
        }
        
        const section = el.children$[`section${index}`];
        const content = el.children$[`content${index}`];
        const inner = el.children$[`inner${index}`];
        const icon = el.children$[`icon${index}`];
        
        // Get the height of the content
        const height = inner.offsetHeight;
        
        // Add active class and set height
        section.classList.add('active');
        content.style.height = `${height}px`;
        icon.classList.add('active');
        
        // Add to open sections
        openSections.add(index);
        
        // Animate content elements
        animateContentElements(inner);
        
        // Save state if memory is enabled
        if (config.enableMemory) {
            saveOpenSectionsToMemory();
        }
    }
    
    function closeSection(index) {
        const section = el.children$[`section${index}`];
        const content = el.children$[`content${index}`];
        const icon = el.children$[`icon${index}`];
        
        // Remove active class and set height to 0
        section.classList.remove('active');
        content.style.height = '0';
        icon.classList.remove('active');
        
        // Remove from open sections
        openSections.delete(index);
        
        // Save state if memory is enabled
        if (config.enableMemory) {
            saveOpenSectionsToMemory();
        }
    }
    
    function expandAll() {
        for (let i = 0; i < items.length; i++) {
            openSection(i);
        }
    }
    
    function collapseAll() {
        for (let i = 0; i < items.length; i++) {
            closeSection(i);
        }
    }
    
    function handleSearch(e) {
        searchTerm = e.target.value.toLowerCase();
        
        for (let i = 0; i < items.length; i++) {
            const section = el.children$[`section${i}`];
            const title = items[i].title.toLowerCase();
            const content = items[i].content.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                section.style.display = '';
                // Highlight matching text
                highlightMatches(i);
            } else {
                section.style.display = 'none';
            }
        }
    }
    
    function highlightMatches(index) {
        // Implementation for highlighting search matches
        const title = el.children$[`title${index}`];
        const inner = el.children$[`inner${index}`];
        
        // Reset previous highlights
        title.innerHTML = items[index].title;
        inner.innerHTML = items[index].content;
        
        if (!searchTerm) return;
        
        // Highlight title matches
        if (items[index].title.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            title.innerHTML = items[index].title.replace(regex, '<mark>$1</mark>');
        }
        
        // Highlight content matches
        if (items[index].content.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            inner.innerHTML = items[index].content.replace(regex, '<mark>$1</mark>');
        }
    }
    
    function animateContentElements(container) {
        // Get all direct children
        const elements = container.children;
        
        // Staggered animation for each element
        Array.from(elements).forEach((element, i) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 50 * i); // Stagger by 50ms
        });
    }
    
    function handleKeydown(e) {
        // Implementation for keyboard navigation
        if (!e.target.closest('.accordion')) return;
        
        const focusedElement = document.activeElement;
        const header = focusedElement.closest('.accordion__header');
        
        if (!header) return;
        
        const index = parseInt(header.dataset.index);
        
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                toggleSection(index);
                break;
            case 'ArrowDown':
                e.preventDefault();
                focusNextHeader(index);
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusPrevHeader(index);
                break;
            case 'Home':
                e.preventDefault();
                focusFirstHeader();
                break;
            case 'End':
                e.preventDefault();
                focusLastHeader();
                break;
        }
    }
    
    function focusNextHeader(currentIndex) {
        const nextIndex = (currentIndex + 1) % items.length;
        el.children$[`header${nextIndex}`].focus();
    }
    
    function focusPrevHeader(currentIndex) {
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        el.children$[`header${prevIndex}`].focus();
    }
    
    function focusFirstHeader() {
        el.children$[`header0`].focus();
    }
    
    function focusLastHeader() {
        el.children$[`header${items.length - 1}`].focus();
    }
    
    function setupTouchGestures() {
        // Implementation for touch gestures
        const headers = Array.from({ length: items.length }, (_, i) => el.children$[`header${i}`]);
        
        headers.forEach((header, index) => {
            let touchStartX = 0;
            let touchEndX = 0;
            
            header.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            header.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe(index, touchStartX, touchEndX);
            });
        });
    }
    
    function handleSwipe(index, startX, endX) {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const diff = endX - startX;
        
        if (Math.abs(diff) < swipeThreshold) return;
        
        if (diff > 0) {
            // Swipe right - open section
            openSection(index);
        } else {
            // Swipe left - close section
            closeSection(index);
        }
    }
    
    function saveOpenSectionsToMemory() {
        localStorage.setItem('accordionOpenSections', JSON.stringify(Array.from(openSections)));
    }
})
