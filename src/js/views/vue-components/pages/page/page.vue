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
    <webview ref="webview" :class="{'shown': website.active}"></webview>
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
            (this.$refs.webview as any).setAttribute('src', this.website.url);
            this.bindListeners();
        }
        bindListeners(){
            (this.$refs.webview as any).addEventListener('did-navigate',this.onNavigation);
            (this.$refs.webview as any).addEventListener('page-title-updated',this.onTitleUpdate);
            (this as any).EventBus.$on('historyBack',this.onHistoryBack);
            (this as any).EventBus.$on('historyForward',this.onHistoryForward);
        }
        onHistoryBack(website: any){
            if(website === this.website && (this.$refs.webview as any).canGoBack()){
                console.log('onHistoryBack');
                (this.$refs.webview as any).goBack();
            }
        }
        onHistoryForward(website: any){
            if(website === this.website && (this.$refs.webview as any).canGoForward()){
                console.log('onHistoryForward');
                (this.$refs.webview as any).goForward();
            }
        }
        onNavigation(event: any){
            console.log(event, this.website);
            let url = event.url;
            this.website.url = url;
            this.website.canGoBack = (this.$refs.webview as any).canGoBack();
            this.website.canGoForward = (this.$refs.webview as any).canGoForward();
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

