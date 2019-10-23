<template>
    <div>
        <quill-editor v-model="content"
                      ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)">
        </quill-editor>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    // import 'quill/dist/quill.bubble.css'

    import { quillEditor } from 'vue-quill-editor'
    import '@/emoji/quill-emoji';


    const toolbarOptions = {
        container: [
            // ['bold', 'italic', 'underline', 'strike'],
            ['emoji'],
        ],
        handlers: {'emoji': function() {}}
    };

    export default {
        name: "vieweditor",
        data () {
            return {
                content: _.isNil(this.comments)?"":this.comments,
                editorOption: {
                    modules: {
                        toolbar: toolbarOptions,
                        "emoji-toolbar": true,
                        // "emoji-shortname": true,
                    },
                    handlers: {'emoji': function() {}}
                }
            }
        },
        props:["comments"],
        components: {
            quillEditor
        },
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },
        mounted() {
            console.log('this is current quill instance object', this.editor)
        },
        methods: {
            onEditorBlur(quill) {

                console.log('editor blur! text',this.editor.getText())
                this.$emit("update:comments", this.editor.getContents());
            },
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            onEditorReady(quill) {
                console.log('editor ready!', quill)
            },
        },
    }
</script>

<style scoped>

</style>