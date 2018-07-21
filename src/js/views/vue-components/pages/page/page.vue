<style lang="sass" scoped>
    webview
        pointer-events: none
        opacity: 0
        position: absolute
        top: 0
        left: 0
        &.shown
            opacity: 1
            pointer-events: initial
</style>

<template>
    <webview ref="webview" :src="website.url" :class="{'shown': website.active}"></webview>
</template>

<script lang="ts">
    import * as _ from 'lodash'
    import { mixins } from 'vue-class-component';
    import {
        Vue,
        Component,
        Watch,
        Prop
    } from "vue-property-decorator";
    import { CommonMixin } from '@vue-components/mixins/common-mixin'
    import { ElectronMixin } from '@vue-components/mixins/electron-mixin'
    import { PathsMixin } from '@vue-components/mixins/paths-mixin'

    @Component
    export default class Page extends mixins(CommonMixin, ElectronMixin, PathsMixin) {
        @Prop() website: any;
        created(){

        }
        createPage(){

        }
        mounted() {
            this.bindListeners();
        }
        bindListeners(){
            (this.$refs.webview as any).addEventListener('did-navigate',this.onNavigation);
            (this.$refs.webview as any).addEventListener('page-title-updated',this.onTitleUpdate);
        }
        onNavigation(event: any){
            console.log(event);
            let url = event.url;
            this.website.url = url;
        }
        onTitleUpdate(event: any){
            let title = event.title;
            this.website.title = title;
        }
        beforeDestroy() {

        }
        destroyed() {

        }
    }
</script>

