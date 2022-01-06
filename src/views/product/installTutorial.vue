<template>
<div>
  <a-row type="flex" justify="center">
    <a-steps direction="vertical" status='process'>
      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第一步：
        </template>
        <template slot="description">首先我们在"产品采集"页面点击"安装插件";</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="one" slot="cover"/>
          </div>
        </a-card>
      </a-step>

      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第二步：
        </template>
        <template slot="description">接着我们把下载好的"安装包"在文件夹中打开;</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="two" slot="cover"/>
          </div>
        </a-card>
      </a-step>
      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第三步：
        </template>
        <template slot="description">将下载好的"安装包"(文件)解压到"桌面",如果是window系统上没有适配的解压软件,推荐使用"2345解压"或者"好压"进行压缩文件;</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="three" slot="cover"/>
          </div>
        </a-card>
      </a-step>

      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第四步：
        </template>
        <template slot="description">"安装包"压缩完成后,我们在Chrome(谷歌浏览器)右上角找到对应的图标或者是"红色的向上箭头"(如下图),再点击进入"更多工具"--"扩展程序";</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="four" slot="cover" style="width:200px;" />&nbsp;&nbsp;或者
              <img :src="five" slot="cover" style="width:50px;" />
              <img :src="six" slot="cover" style="width:400px;" />
          </div>
        </a-card>
      </a-step>

      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第五步：
        </template>
        <template slot="description">进入"扩展程序"然后点击打开右上角的"开发者模式";</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="seven" slot="cover" style="width:1000px;height: 100px"/>
          </div>
        </a-card>
      </a-step>
      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第六步：
        </template>
        <template slot="description">接着我们点击左上角的"加载已解压的扩展程序",选择我们刚才已下载好在"桌面"上的文件,点击"选择文件夹";</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="eight" slot="cover" />
          </div>
        </a-card>
      </a-step>

      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第七步：
        </template>
        <template slot="description">这时在"扩展工具"中就会出现已安装好的程序插件,接着把插件上的"ID"值复制下来;</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="nine" slot="cover" />
          </div>
        </a-card>
      </a-step>

      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第八步：
        </template>
        <template slot="description">点击进入"产品采集"页面,然后刷新一下页面,再激活插件框里"粘贴"之前复制的"ID"值,最后点击"激活插件"按钮;</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="ten" slot="cover" />
          </div>
        </a-card>
      </a-step>
    </a-steps>
  </a-row>
</div>
</template>

<script>
export default {
  data (){
    return {
      one:require('@/assets/image/installtutorial/buzhou1.png'),
      two:require('@/assets/image/installtutorial/buzhou2.png'),
      three:require('@/assets/image/installtutorial/buzhou3.png'),
      four:require('@/assets/image/installtutorial/buzhou4.png'),
      five:require('@/assets/image/installtutorial/buzhou5.png'),
      six:require('@/assets/image/installtutorial/buzhou6.png'),
      seven:require('@/assets/image/installtutorial/buzhou7.png'),
      eight:require('@/assets/image/installtutorial/buzhou8.png'),
      nine:require('@/assets/image/installtutorial/buzhou10.png'),
      ten:require('@/assets/image/installtutorial/buzhou11.png'),
    }
  }

}
</script>
<style lang="less" scoped>
.img-box{
  width: 800px;
  img{
    width: 100%;
  }
}
</style>