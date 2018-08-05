<style lang="sass" scoped>
    @import '~@styles/_variables.sass'
    $nav-width: 64px
    nav
        width: $nav-width
        position: fixed
        top: 0
        left: 0
        bottom: 0
        z-index: 2

    .view
        margin-left: $nav-width

    .searchbox
        background-color: rgba(0,0,0,0)
        transition: $animation2
        pointer-events: none
        .search
            transform: translateY(-10vh)
            transition: $animation3
        &.active
            pointer-events: initial
            background-color: rgba(0,0,0,.5)
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
        z-index: 1
</style>
<style lang="sass">
    .el-dialog__headerbtn
        display: none
</style>
<template>
    <div id="main" class="u-width-full u-height-full u-flex">
        <nav ref="nav" class="u-flex u-text-center u-flex-flow-column u-py:lg u-background-color-background">
            <div class="add u-mb">
                <button class="ui-button-square ui-button-small"
                        @click="states.searchBox.shown = true; $refs.search.focus()">+
                </button>
            </div>
            <div class="tabs u-flex-1">
                <tab v-if="!website.closed" @setActive="setActive($event)" :websites="states.websites" :website="website" :index="index" v-for="(website, index) in states.websites" :key="parseInt(index) + 1"></tab>
            </div>
            <div>
                <button class="ui-button-square ui-button-small"
                        @click="states.options.shown = true">
                    <i class="icon ion-md-more"></i>
                </button>
            </div>
        </nav>
        <div ref="view" class="view u-flex-1 u-position-relative">
            <div class="overlay u-position-absolute u-pin u-py:lg u-px:xlg searchbox" :class="{'shown': states.searchBox.shown, 'active': states.searchBox.active}">
                <div class="search u-position-relative">
                    <div class="google-logo u-position-absolute u-ml"></div>
                    <input ref="search" type="text" placeholder="Search or Paste URL" class="u-width-full u-pl:xlg" @blur="states.searchBox.shown = false" v-model="states.searchBox.value" @keydown.enter="onSearch">
                </div>
            </div>
            <page v-if="!website.closed" v-for="(website, index) in states.websites" :scripts="states.options.sections.js.scripts" :website="website" class="u-width-full u-height-full" :key="parseInt(index)+1"></page>
        </div>
        <el-dialog
                :visible.sync="states.options.shown"
                width="50%"
                center>
            <div class="u-px:xs" slot="title">
                <span class="u-float-left u-text-uppercase u-text-small">Options</span>
                <button class="u-float-right ui-button-small" @click="states.options.shown = false"><i class="icon ion-ios-close"></i></button>
            </div>
            <div class="u-flex u-flex-flow-column">
                <div class="u-mb">
                    <span class="u-float-left u-text-uppercase u-text-small"><i class="icon ion-md-arrow-dropright"></i> Custom JavaScript</span>
                </div>
                <div class="u-pl:sm">
                    <div class="u-mb">
                        <button class="ui-button-small u-size:10" @click="states.options.sections.js.scripts.push(_.cloneDeep(schema.script))"><i class="icon ion-ios-add"></i> Add Custom Code</button>
                    </div>
                    <div class="">
                        <el-collapse accordion>
                            <option-javascript :scripts="states.options.sections.js.scripts" :script="script" :index="index" v-for="(script, index) in states.options.sections.js.scripts"></option-javascript>
                        </el-collapse>
                    </div>
                </div>
            </div>
        </el-dialog>
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
    const optionJavascript = require('@vue-components/options/option-javascript/option-javascript.vue').default;
    import { Dialog, Collapse } from 'element-ui';
    import 'codemirror/theme/monokai.css'

    @Component({
        components: {
            'tab': Tab,
            'page': Page,
            'el-dialog': Dialog,
            'el-collapse': Collapse,
            'option-javascript': optionJavascript
        }
    })
    export default class Main extends mixins(CommonMixin, ElectronMixin, PathsMixin) {
        @Prop() placeholder: string;
        states: any = {
            searchBox: {
                shown: false,
                active: false,
                value: ''
            },
            options: {
                shown: true,
                sections: {
                    js: {
                        name: '',
                        scripts: (localStorage.getItem('scripts') ? JSON.parse(localStorage.getItem('scripts')) : [])
                    }
                }
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
                canGoBack: false,
                canGoForward: false,
            },
            script: {
                name: '',
                pattern: '',
                code: ''
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
        @Watch('states.options.sections.js.scripts', {deep: true})
        onScriptsChange(){
            localStorage.setItem('scripts', JSON.stringify(this.states.options.sections.js.scripts));
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
            (this as any).EventBus.$on('activateOverlay', () => this.states.searchBox.active = true);
            (this as any).EventBus.$on('deactivateOverlay', () => this.states.searchBox.active = false);
        }
    }
    Vue.component('vue-main', Main);
</script>
