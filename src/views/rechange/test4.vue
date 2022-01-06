<template>
  <div class="table">
    <div id="editor">
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import E from "wangeditor"
  export default {
    data(){
      return {

      }
    },
    methods:{
    },
    created() {},
    mounted() {
      const editor = new E('#editor')
      console.log(editor,"_this.editor")
      editor.config.onchange = function (newHtml) {
        console.log('editor',newHtml)
      }
      editor.create()
      let content = `
              <p>
        ↵	<span style="font-size:18px;">1.新增“<span style="color:#E53333;">报关模板</span>”功能：用户可以提前编辑好相关报关内容，出单后直接引用该报关信息</span> 
        ↵</p>
        ↵<p>
        ↵	<span style="font-size:18px;"><br />
        ↵</span> 
        ↵</p>
        ↵<p>
        ↵	<span style="font-size:18px;">2.“<span style="color:#E53333;">瑞典站</span>”订单拉取功能：系统可以同步瑞典站订单，用户可以通过系统完成瑞典站订单处理</span> 
        ↵</p>
        ↵<p>
        ↵	<span style="font-size:18px;"><br />
        ↵</span>
        ↵</p>
        ↵<p>
        ↵	<span style="font-size:18px;"><span style="font-size:18px;">3.</span><span style="font-size:18px;background-color:#E53333;"><span style="background-color:#FFFFFF;color:#E53333;">订单管理-订单查询</span><span style="background-color:#FFFFFF;"></span></span><span style="font-size:18px;">栏新</span><span style="font-size:18px;"></span><span style="font-size:18px;">增</span><span style="font-size:18px;color:#E53333;">国内单号查询</span><span style="font-size:18px;">功能，方便单量大的客户统一处理该包裹中的所有订单</span><br />
        ↵</span>
        ↵</p>
      `
      setTimeout(()=>{
        console.log(1)
        editor.txt.html(content)
      },300)
    },
  }
</script>
<style lang="less" scpoed>

</style>