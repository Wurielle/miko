// mixin.js
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as _ from 'lodash';

@Component
export class ElectronMixin extends Vue {
    created() {
        // BIG NOTE: https://github.com/vuejs/vue/issues/1988#issuecomment-163013818
        (this as any).electron = window.electron||null;
    }
    get electronAppPath(){
        let fn = _.get((this as any).electron, 'remote.app.getAppPath', 'electronAppPathPlaceholder');
        return typeof fn === 'function' ? fn().replace(/\\/g,"/") : fn;
    }
    get electronUserDataPath(){
        let fn = _.get((this as any).electron, 'remote.app.getPath', 'electronUserDataPathPlaceholder');
        return typeof fn === 'function' ? fn("userData").replace(/\\/g,"/") : fn;
    }
    get electronAppFilePath(){
        return 'file:///'+this.electronAppPath;
    }
}