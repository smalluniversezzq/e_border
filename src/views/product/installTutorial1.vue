<template>
<div>
  <div>
    <h2>插件下载安装方法（更新时需要重新下载更新）</h2>
  </div>
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
        <template slot="description">下载完成后,我们在Chrome(谷歌浏览器)右上角找到对应的图标或者是"红色的向上箭头"(如下图),再点击进入"更多工具"--"扩展程序";</template>
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
          第四步：
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
          第五步：
        </template>
        <template slot="description">把下载好的“eborder-chrome.crx”文件拖入谷歌扩展程序空白页</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="ten1" slot="cover" />
          </div>
        </a-card>
      </a-step>
      <a-step class="ant-steps-item ant-steps-item-process">
          <template slot="title">
            第六步：
          </template>
          <template slot="description">点击确认添加扩展程序</template>
          <a-card  slot="description">
            <div class="img-box">
                <img :src="ten3" slot="cover" />
            </div>
          </a-card>
        </a-step>
      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第七步：
        </template>
        <template slot="description">安装完成</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="ten2" slot="cover" />
          </div>
        </a-card>
      </a-step>
    </a-steps>
  </a-row>
  <div>
    <h2>翻墙安装方法（更新时需要在chrome扩展程序页面点击更新）</h2>
  </div>
    <a-row type="flex" justify="center">
    <a-steps direction="vertical" status='process'>
      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第一步：
        </template>
        <!-- rgb(255 153 0); -->
        <template slot="description">访问谷歌chrome应用商店（需要翻墙）
          <span  v-if='chromeUrl!=="none"'>
           <a  v-if='chromeUrl.url!=="none"' :href="chromeUrl.url" target="_blank" >{{chromeUrl.url}}</a>
          </span>
        </template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="guide1" slot="cover"/>
          </div>
        </a-card>
      </a-step>
      <a-step class="ant-steps-item ant-steps-item-process">
        <template slot="title">
          第二步：
        </template>
        <!-- rgb(255 153 0); -->
        <template slot="description">点击添加至chrome,确认添加添加扩展程序</template>
        <a-card  slot="description">
          <div class="img-box">
              <img :src="guide2" slot="cover"/>
          </div>
        </a-card>
      </a-step>
      <a-step class="ant-steps-item ant-steps-item-process">
          <template slot="title">
            第三步：
          </template>
          <template slot="description">安装完成</template>
          <a-card  slot="description">
            <div class="img-box">
                <img :src="ten2" slot="cover" />
            </div>
          </a-card>
        </a-step>
    </a-steps>
  </a-row>
</div>
</template>

<script>
import global from '@/config/global.js'
let routers = global.chrome.routers
export default {
  data (){
    return {
      one:require(`@/assets/image/${routers}/buzhou1.png`),
      two:require(`@/assets/image/${routers}/buzhou2.png`),
      three:require(`@/assets/image/${routers}/buzhou3.png`),
      four:require(`@/assets/image/${routers}/buzhou4.png`),
      five:require(`@/assets/image/${routers}/buzhou5.png`),
      six:require(`@/assets/image/${routers}/buzhou6.png`),
      seven:require(`@/assets/image/${routers}/buzhou7.png`),
      eight:require(`@/assets/image/${routers}/buzhou8.png`),
      nine:require(`@/assets/image/${routers}/buzhou10.png`),
      ten:require(`@/assets/image/${routers}/buzhou11.png`),
      ten1:require(`@/assets/image/${routers}/buzhou12.png`),
      ten2:require(`@/assets/image/${routers}/buzhou13.png`),
      ten3:require(`@/assets/image/${routers}/buzhou14.png`),
      guide1:require(`@/assets/image/${routers}/guide1.png`),
      guide2:require(`@/assets/image/${routers}/guide2.png`),
      chromeUrl:global.chrome
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