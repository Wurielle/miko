<template>
    <img v-if="type === 'image' && resolvedPath" :src="resolvedPath" alt="">
    <video controls v-else="type === 'video' && resolvedPath" :src="resolvedPath" alt=""></video>
</template>

<script lang="ts">
    import {
        Vue,
        Component,
        Watch,
        Prop
    } from "vue-property-decorator";
    import axios from 'axios';
    import * as _ from 'lodash'
    @Component
    export default class FilePathing extends Vue {
        @Prop() try: string;
        @Prop() src: string;
        @Prop() type: any;
        tryIndex: number = 0;
        resolvedPath: string = '';
        isRequired(name: string){
            throw new Error('Property "'+name+'" is required in FileAlternative');
        }
        normalizePath(src: string){
            // src = src.replace(/\\/g,"/").replace(/^.+\.\//,'');
            return src;
        }
        get fileDetails(){
            let filename = this.src.replace(/^.*[\\\/]/, '').split("?")[0]
            let ext = filename.split('.').pop();
            let name = filename.split(".")[0];
            return {filename, ext, name}
        }
        created() {

        }
        fetch(src: any = this.isRequired('src'), paths: any = this.isRequired('try'), type: any = this.isRequired('type')){
            src = this.normalizePath(src);
            if (typeof paths === 'object' && Array.isArray(paths)){
                let path = paths[this.tryIndex];
                this.loadFile(path);
            } else if (typeof paths === 'string'){
                let path = paths;
                this.loadFile(path);
            }
        }
        loadFile(path: string){
            path = this.normalizePath(path + this.fileDetails.filename);
            console.log('Trying to load:', path);
            axios.get(path)
                .then((response)=>{
                    console.log('Image loaded.');
                    this.resolvedPath = path;
                }).catch(()=>{
                    if (typeof this.try === 'object' && Array.isArray(this.try) && this.tryIndex <= _.size(this.try) - 1 ){
                        console.log('Image failed to load, trying a new path.');
                        this.tryIndex++;
                        path = this.try[this.tryIndex];
                        this.loadFile(path);
                    } else {
                        console.log('Couldn\'t load the image.');
                        this.resolvedPath = this.src;
                    }
                })
        }
        mounted() {
            this.fetch(this.src, this.try, this.type);
        }

        beforeDestroy() {

        }

        destroyed() {

        }

        bindListeners() {

        }
    }
    Vue.component('file-pathing', FilePathing);
</script>

<style lang="sass" scoped>

</style>
