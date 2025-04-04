import { createComponent$ } from "../../../../shared/element.min.js";

createComponent$('colorbutton', (el) => {


    el.define$({
        template$: () => /*html*/`
            <link rel="stylesheet" href="/de_website/client/components/widgets/colorbutton/colorbutton.css" />
            <div class="colorbutton-container">
                <button id="colorChangeBtn" class="colorbutton">Change Text Color</button>
                <div id="targetText" class="colorbutton-target">Bruh</div>
            </div>
        `,
        
        onInit$: async () => {
            console.log('Colorbutton component onInit$ called');
            // Initialize any data or state
        },
        
        onRender$: async () => {
            console.log('Colorbutton component onRender$ called');
            // Server-side rendering logic
        },
        
        onHydrate$: async () => {
            document.getElementById('colorChangeBtn').addEventListener('click', () => {
                // Generate a random color in hex format
                const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                document.getElementById('targetText').style.color = randomColor;
            });
            console.log('Colorbutton component onHydrate$ called');
            
        }
    });
})
