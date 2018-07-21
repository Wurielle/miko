// mixin.js
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { toAssetsExport } from "@js/routers/paths";

@Component
export class PathsMixin extends Vue {
    created() {
        (this as any).pathToAssetsExport = toAssetsExport;
    }
}