import './bootstrap';
import '../css/app.css';
import 'flowbite';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF1cXmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEBjWn5ccnRUQmVfUUZwVw==');

//For the DocEditor
import '@syncfusion/ej2-base/styles/tailwind-lite.css';
import '@syncfusion/ej2-buttons/styles/tailwind-lite.css';
import '@syncfusion/ej2-inputs/styles/tailwind-lite.css';
import '@syncfusion/ej2-popups/styles/tailwind-lite.css';
import '@syncfusion/ej2-lists/styles/tailwind-lite.css';
import '@syncfusion/ej2-navigations/styles/tailwind-lite.css';
import '@syncfusion/ej2-splitbuttons/styles/tailwind-lite.css';
import '@syncfusion/ej2-dropdowns/styles/tailwind-lite.css';
import "@syncfusion/ej2-documenteditor/styles/tailwind-lite.css";

//For the Spreadsheet
import '@syncfusion/ej2-base/styles/tailwind-lite.css';
import '@syncfusion/ej2-inputs/styles/tailwind-lite.css';
import '@syncfusion/ej2-buttons/styles/tailwind-lite.css';
import '@syncfusion/ej2-splitbuttons/styles/tailwind-lite.css';
import '@syncfusion/ej2-lists/styles/tailwind-lite.css';
import '@syncfusion/ej2-navigations/styles/tailwind-lite.css';
import '@syncfusion/ej2-popups/styles/tailwind-lite.css';
import '@syncfusion/ej2-dropdowns/styles/tailwind-lite.css';
import '@syncfusion/ej2-grids/styles/tailwind-lite.css';
import '@syncfusion/ej2-react-spreadsheet/styles/tailwind-lite.css';


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        delay: 250,
        color: "#eee",
        showSpinner: true,
    },

});
