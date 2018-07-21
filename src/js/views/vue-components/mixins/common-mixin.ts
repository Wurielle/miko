// mixin.js
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as _ from 'lodash';
import { EventBus, ElectronBus } from "@vue-components/event-buses/EventBuses";

@Component
export class CommonMixin extends Vue {
    created() {
        (this as any)._ = _;
        (this as any).EventBus = EventBus;
        (this as any).ElectronBus = ElectronBus;
        (this as any).ENV = process.env.NODE_ENV.trim();
    }
}