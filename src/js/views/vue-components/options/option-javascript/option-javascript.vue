<style lang="sass">
    @import '~@styles/_variables.sass'
    .vue-codemirror
        *
            font-family: $code-font-family !important
    .el-collapse-item
        overflow: hidden
        .el-collapse-item__wrap
            display: block!important
            position: absolute
            left: 0
            z-index: -9999
            visibility: hidden
            max-width: 100%
            pointer-events: none
        &.is-active
            .el-collapse-item__wrap
                display: block!important
                position: relative
                z-index: 0
                visibility: visible
                pointer-events: auto

</style>

<template>
    <el-collapse-item :title="script.name" :name="index">
        <div class="u-border-style-solid u-border-width u-border-left-width:md u-border-color-grey u-pl:sm">
            <div class="u-mb">
                <label>Name:</label>
                <input class="u-width-full u-box-shadow" v-model="script.name" type="text">
            </div>
            <div class="u-mb">
                <label>URL to match:</label>
                <input class="u-width-full u-box-shadow" v-model="script.pattern" type="text">
            </div>
            <div class="u-mb">
                <label>JavaScript Code:</label>
                <codemirror
                        :options="cmOptions"
                        class="u-width-full u-box-shadow"
                        v-model="script.code"
                >
                </codemirror>
            </div>
            <div>
                <button class="ui-button-small ui-button-danger u-size:10" @click="scripts.splice(index, 1)">Delete Custom Code</button>
            </div>
        </div>
    </el-collapse-item>
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
    import { CollapseItem } from 'element-ui';
    import { codemirror } from 'vue-codemirror';
    import 'codemirror/theme/monokai.css';

    @Component({
        components: {
            'el-collapse-item': CollapseItem,
            codemirror
        }
    })
    export default class optionJavascript extends mixins(CommonMixin, ElectronMixin, PathsMixin) {
        @Prop() scripts: any;
        @Prop() script: any;
        @Prop() index: any;
        cmOptions: any = {
            tabSize: 4,
            styleActiveLine: true,
            mode: {
                ext: 'js'
            },
            theme: 'monokai',
            lineNumbers: true,
            line: true,
        }
        beforeDestroy() {

        }
        destroyed() {

        }
    }
</script>

