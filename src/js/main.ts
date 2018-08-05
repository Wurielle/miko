// Sass imports
import 'element-ui/lib/theme-chalk/index.css';
import '../sass/main.sass';
import 'ionicons/dist/css/ionicons.min.css';

// require styles
import 'codemirror/lib/codemirror.css';
// JS imports -- Allows you to see what I used for this project (Also check those from webpack.ProvidePlugin() in 'webpack.config.js')
import { AppRouter } from './routers/app_router'
import { EventBus, ElectronBus } from '@vue-components/event-buses/EventBuses';
import '@vue-components/pages/main/main.vue';
import Vue from 'vue';
Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        (el as any).clickOutsideEvent = function (event) {
            // here I check that click was outside the el and his childrens
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        window.addEventListener('click', (el as any).clickOutsideEvent);
        window.addEventListener('contextmenu', (el as any).clickOutsideEvent);
    },
    unbind: function (el) {
        window.removeEventListener('click', (el as any).clickOutsideEvent);
        window.removeEventListener('contextmenu', (el as any).clickOutsideEvent);
    },
});
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