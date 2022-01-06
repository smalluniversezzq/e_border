<template>
  <div class="table">
    <div id="editor"></div>
  </div>
</template>
<script>
import Vue from 'vue'
import E from 'wangeditor'
export default {
  props: ['data',"language"],
  data() {
    return {
      newData:"",
      editor:"",
      replaceInfo:{
        de:"",
        nl:"",
        es:"",
        it:"",
        fr:"",
        en:"",
        ja:"",
        zh:"",
      },
    }
  },
  methods:{
    addText(){
      setTimeout(() => {
        if(this.data){
          this.editor.txt.text(this.data)
          // this.replaceInfo[this.language] = this.data
          console.log(this.replaceInfo,"replaceInfo")
        }else{
          this.addText()
        }
      }, 1000);
    },
  },
  created() {},
  mounted() {
    console.log("editcreated")
    let _this = this
    _this.editor = new E('#editor')
    console.log(_this.editor, '_this.editor')
    _this.editor.config.onchange = function (newHtml){
      console.log('editor',newHtml)
      // 渲染到父组件 this.data
      let info = {
        content:newHtml,
        language:_this.language
      }
      _this.$emit("toData",info)
      _this.replaceInfo[_this.language] = newHtml
      // 与amazonkeyworldInfo.vue  toEditorFn  对应
      .replace(/<p>/g,"_P")
      .replace(/<\/p>/g,"_p")
      .replace(/<br\s*\/?>/g,"_R")
      .replace(/&nbsp;/g,"_N")
      .replace(/<ul>/g,"_U")
      .replace(/<\/ul>/g,"_u")
      .replace(/<li>/g,"_L")
      .replace(/<\/li>/g,"_l")
      .replace(/<b>/g,"_B")
      .replace(/<\/b>/g,"_b")
      .replace(/<i>/g,"_I")
      .replace(/<\/i>/g,"_i")
      .replace(/<div>/g,"_D")
      .replace(/<\/div>/g,"_d")
      console.log(_this.replaceInfo,"replaceInfo")
    }
    _this.editor.config.menus = [
        'bold',
        'head',
        'link',
        'italic',
        'underline'
    ]
    _this.editor.create()
    if(_this.data){
        console.log("执行到了1",_this.data)
        _this.editor.txt.text(_this.data)
    }else{
      _this.addText()
    }

  },
}
</script>
