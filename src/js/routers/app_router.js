import Vue from 'vue'
import AppView from '../views/app/app_view'
export class AppRouter {
    constructor() {
        new AppView({el: '#app'});
    }
}
