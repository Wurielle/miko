<style lang="sass" scoped>
    @import '~@styles/_variables.sass'
    .delete
        position: absolute
        top: 0
        right: 0
        transform: translate(50%, -50%)
        padding: 0
        width: 14px
        height: 14px
        line-height: 10px
        background-color: $color--danger
        color: white
        text-align: center
    .popover
        position: absolute
        transform: translate(-100%, -50%)
        right: - sp(xs)

    .tab
        position: relative
        z-index: 0
        height: $unit
        transition: $animation2
        margin-bottom: sp(md)
        &:last-child
            margin-bottom: 0
        &::before
            content: ''
            display: inline-block
            width: 10px
            height: 10px
            border-radius: 9999px
            position: absolute
            top: 50%
            right: 0
            z-index: 0
            transform: translate(50%, -50%)
            background-color: transparent
            transition: $animation2
        &.active
            &::before
                background-color: $color--primary
        .navigation
            position: absolute
            bottom: 0
            left: 50%
            transform: translate(-50%, 50%)
            text-align: center
            white-space: nowrap
            button
                margin-bottom: 0
                height: 22px
                width: 22px
                line-height: 22px
                font-size: fs(sm)
                &:first-child
                    margin-right: 2px
</style>
<template>
    <div class="tab"
         @click.right="popoverVisible = true"
         tabindex="0"
    >
        <el-popover
            class="popover"
            popper-class="u-box-shadow u-border-width"
            placement="right"
            width="600"
            trigger="manual"
            :value="popoverVisible"
            @hide="onPopoverHide"
            v-click-outside="onClickOutsidePopover"
            @show="onPopoverShow"
            @after-enter="popoverTransitionFinished = true; EventBus.$emit('activateOverlay');"
            @after-leave="popoverTransitionFinished = false"
        >
            <div
                class="u-outline-none"
                ref="websiteBar"
            >
                <div class="u-flex u-flex-items-align-middle u-mb">
                    <button class="u-nm u-mr:xs ui-button-small ui-button-square" @click="EventBus.$emit('historyBack', website)" :class="{'ui-button-disabled': !website.canGoBack}"><i class="icon ion-ios-arrow-back"></i></button>
                    <button class="u-nm u-mr:xs ui-button-small ui-button-square" @click="EventBus.$emit('historyForward', website)" :class="{'ui-button-disabled': !website.canGoForward}"><i class="icon ion-ios-arrow-forward"></i></button>
                    <button class="u-nm u-mr:xs ui-button-small ui-button-square" @click="EventBus.$emit('reload', website)"><i class="icon ion-ios-refresh"></i></button>
                    <input ref="addressBar" class="u-flex-1 u-box-shadow-interactive ui-input-small u-px:xs" :value="website.url" type="text" @keyup.enter="search">
                </div>
                <div>
                    <button class="ui-button-small u-size:10" @click="EventBus.$emit('openDevTools', website)">Open DevTools</button>
                </div>
            </div>
        </el-popover>
        <button
                @click.middle="EventBus.$emit('deleteTab', website)"
                @mouseover="deleteShown = true"
                @mouseleave="deleteShown = false"
                :title="website.title"
                class="ui-button-square u-position-relative"
                :class="{active: website.active}"
                @click="$emit('setActive', website)"
        >
            <img :src="icon">
            <button v-if="deleteShown" class="delete" @click="EventBus.$emit('deleteTab', website)"><i class="icon ion-ios-close"></i></button>
        </button>
        <div class="navigation" v-if="website.active">
            <button class="ui-button-small ui-button-square" @click="EventBus.$emit('historyBack', website)" :class="{'ui-button-disabled': !website.canGoBack}"><i class="icon ion-ios-arrow-back"></i></button>
            <button class="ui-button-small ui-button-square" @click="EventBus.$emit('historyForward', website)" :class="{'ui-button-disabled': !website.canGoForward}"><i class="icon ion-ios-arrow-forward"></i></button>
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
    import { CommonMixin } from '@vue-components/mixins/common-mixin';
    import { ElectronMixin } from '@vue-components/mixins/electron-mixin';
    import { PathsMixin } from '@vue-components/mixins/paths-mixin';
    import { Popover } from 'element-ui';
    @Component({
        components: {
            'el-popover': Popover
        }
    })
    export default class Tab extends mixins(CommonMixin, ElectronMixin, PathsMixin) {
        @Prop() websites: any;
        @Prop() website: any;
        @Prop() index: any;
        deleteShown: boolean = false;
        popoverVisible: any = false;
        popoverTransitionFinished: any = false;
        created(){

        }
        createPage(){

        }
        mounted() {
        }
        get icon(){
            return `http://www.google.com/s2/favicons?domain=${this.website.url}`;
        }
        onClickOutsidePopover(){
            console.log('click outside');
            if(this.popoverTransitionFinished){
                this.popoverVisible = false;
            }
        }
        search(){
            console.log('searching');
            let value = (this.$refs as any).addressBar.value;
            this.validURL(value) ? this.website.url = value : this.website.url = this.googleSearch(value);
            this.popoverVisible = false;
        }
        googleSearch(string: string){
            return `https://www.google.com/search?q=${string}`;
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
        onPopoverHide(){
            if(this.website.url !== (this.$refs as any).addressBar.getAttribute('value')) (this.$refs as any).addressBar.setAttribute('value', this.website.url);
            (this as any).EventBus.$emit('deactivateOverlay');
        }
        onPopoverShow(){

        }
        beforeDestroy() {

        }
        destroyed() {

        }

        bindListeners() {

        }
    }
</script>
