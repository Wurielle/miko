// Sass imports
import '../sass/main.sass';
import 'ionicons/dist/css/ionicons.min.css'
// JS imports -- Allows you to see what I used for this project (Also check those from webpack.ProvidePlugin() in 'webpack.config.js')
import { AppRouter } from './routers/app_router'
import { EventBus, ElectronBus } from '@vue-components/event-buses/EventBuses';
import '@vue-components/pages/main/main.vue';
import Vue from 'vue'
// Set imports to the Global object
declare global {
    interface Window {
        app:      any;
        _:        any;
        electron: any;
    }
}
window.app = {
    EventBus: EventBus,
    ElectronBus: ElectronBus,
};
(function() {
    new Vue({
        el: '#app'
    });
})();