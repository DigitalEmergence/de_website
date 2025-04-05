import { registerDependencies$, registerServerDependencies$ } from './element.js';

registerDependencies$({
    'homepage': '/de_website/client/components/pages/home/home.js',
    'jspherepage': '/de_website/client/components/pages/jsphere/jsphere.js',
    'elementjspage': '/de_website/client/components/pages/elementjs/elementjs.js',
    'aboutpage': '/de_website/client/components/pages/about/about.js',
    'carousel': '/de_website/client/components/widgets/carousel/carousel.js',
    'accordion': '/de_website/client/components/widgets/accordion/accordion.js',
    'navbar': '/de_website/client/components/widgets/navbar/navbar.js',
    'weatherpage': '/de_website/client/components/pages/weather/weather.js',
    'colorbutton': '/de_website/client/components/widgets/colorbutton/colorbutton.js',
    'cursor-trail': '/de_website/client/components/controls/cursor-trail/cursor-trail.js'
})
    
registerServerDependencies$({
    'datetime-service': '/de_website/server/services/datetime-service.ts',
    'weather-service': '/de_website/server/services/weather-service.ts'
})
