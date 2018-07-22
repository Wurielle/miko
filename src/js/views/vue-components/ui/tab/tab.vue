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
    .tab
        position: relative
        z-index: 0
        width: $unit
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
    <div class="tab">
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
    import { CommonMixin } from '@vue-components/mixins/common-mixin'
    import { ElectronMixin } from '@vue-components/mixins/electron-mixin'
    import { PathsMixin } from '@vue-components/mixins/paths-mixin'

    @Component
    export default class Tab extends mixins(CommonMixin, ElectronMixin, PathsMixin) {
        @Prop() websites: any;
        @Prop() website: any;
        @Prop() index: any;
        deleteShown: boolean = false;
        created(){

        }
        createPage(){

        }
        mounted() {
        }
        get icon(){
            return `http://www.google.com/s2/favicons?domain=${this.website.url}`;
        }
        beforeDestroy() {

        }
        destroyed() {

        }

        bindListeners() {

        }
    }
</script>
