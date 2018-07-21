<style lang="sass" scoped>
    @import '~@styles/_variables.sass'
    .searchbox
        background-color: rgba(0,0,0,0)
        transition: $animation2
        pointer-events: none
        .search
            transform: translateY(-10vh)
            transition: $animation3
        &.shown
            pointer-events: initial
            background-color: rgba(0,0,0,.5)
            .search
                transform: translateY(0)
    .google-logo
        background: url('~@images/google_g_logo.svg')
        background-size: 24px 24px
        background-repeat: no-repeat
        background-position: center
        height: $unit
        width: 26px
    .add
        padding: 10px
    .overlay
        z-index: 999999
</style>
<template>
    <div id="main" class="u-width-full u-height-full u-flex">
        <div class="u-flex u-flex-flow-column u-px:sm u-py:lg u-background-color-background">
            <div class="add u-mb">
                <button class="ui-button-square ui-button-small"
                        @click="states.searchBox.shown = true; $refs.search.focus()">+
                </button>
            </div>
            <tab v-if="!website.closed" @setActive="setActive($event)" :websites="states.websites" :website="website" :index="index" v-for="(website, index) in states.websites" :key="parseInt(index) + 1"></tab>
        </div>
        <div class="u-flex-1 u-position-relative">
            <div class="overlay u-position-absolute u-pin u-py:lg u-px:xlg searchbox" :class="{'shown': states.searchBox.shown}">
                <div class="search u-position-relative">
                    <div class="google-logo u-position-absolute u-ml"></div>
                    <input ref="search" type="text" placeholder="Search or Paste URL" class="u-width-full u-pl:xlg" @blur="states.searchBox.shown = false" v-model="states.searchBox.value" @keydown.enter="onSearch">
                </div>
            </div>
            <page v-if="!website.closed" v-for="(website, index) in states.websites" :website="website" class="u-width-full u-height-full" :key="parseInt(index)+1"></page>
        </div>
    </div>
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
    const Tab = require('@vue-components/ui/tab/tab.vue').default;
    const Page = require('@vue-components/pages/page/page.vue').default;

    @Component({
        components: {
            'tab': Tab,
            'page': Page
        }
    })
    export default class Main extends mixins(CommonMixin, ElectronMixin, PathsMixin) {
        @Prop() placeholder: string;
        states: any = {
            searchBox: {
                shown: false,
                value: ''
            },
            websites: (localStorage.getItem('websites') ? JSON.parse(localStorage.getItem('websites')) : [])
        };
        schema: any = {
            website: {
                title: null,
                url: null,
                active: false,
                thumbnail: null,
                closed: false,
            }
        };
        @Watch('placeholder')
        onPlaceholderChange() {

        }
        created(){

        }
        @Watch('states.websites', {deep: true})
        onWebsitesChange(){
            let validWebsites = [];
            _.each(this.states.websites, (website) => {
                if (!website.closed){
                    validWebsites.push(website);
                }
            });
            localStorage.setItem('websites', JSON.stringify(validWebsites));
        }
        createPage(url: string){
            let website = _.cloneDeep(this.schema.website);
            website.url = url;
            website.active = true;
            this.states.websites.push(website);
            this.$nextTick(() => {
                this.setActive(website);
            });
        }
        mounted() {
            this.bindListeners();
        }

        beforeDestroy() {

        }
        setActive(website: string){
            _.each(this.states.websites, (arrayWebsite)=>{
                arrayWebsite === website ? arrayWebsite.active = true :  arrayWebsite.active = false;
            });
        }
        onSearch(){
            let value = this.states.searchBox.value;
            this.validURL(value) ? this.createPage(value) : this.createPage(this.googleSearch(value));
            this.states.searchBox.shown = false;
            this.states.searchBox.value = '';
        }
        onDeleteTab(website: any){
            let index = _.findIndex(this.states.websites, (arrayWebsite) => arrayWebsite === website);
            let previousTabIndex = this.previousAvailableIndex(index);
            let nextTabIndex = this.nextAvailableIndex(index);
            if(website.active){
                if(nextTabIndex >= 0){
                    this.states.websites[nextTabIndex].active = true;
                } else if (previousTabIndex >= 0){
                    this.states.websites[previousTabIndex].active = true;
                }
            }
            website.closed = true;
        }
        googleSearch(string: string){
            return `https://www.google.com/search?q=${string}`;
        }
        nextAvailableIndex(index: number){
            return _.findIndex(this.states.websites, (arrayWebsite, arrayIndex) => arrayIndex > index && !(arrayWebsite as any).closed);
        }
        previousAvailableIndex(index: number){
            return _.findLastIndex(this.states.websites, (arrayWebsite, arrayIndex) => arrayIndex < index && !(arrayWebsite as any).closed);
        }
        validURL(str: string) {
            let pattern = new RegExp('^((https?:)?\\/\\/)?'+ // protocol
                '(?:\\S+(?::\\S*)?@)?' + // authentication
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locater
            return pattern.test(str);
        }
        get activeWebsiteUrl(){
            let activeWebsite = _.find(this.states.websites, (website) => {
                return website.active === true
            });
            return activeWebsite ? activeWebsite.url : 'https://www.google.com/';
        }
        destroyed() {

        }

        bindListeners() {
            (this as any).EventBus.$on('deleteTab', this.onDeleteTab);
        }
    }
    Vue.component('vue-main', Main);
</script>
