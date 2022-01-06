<template>
  <div class="privacy">
    <div class="container">
      <h2 class='title'>隐私政策</h2>
      <div class='content'>
        <p>
          本系统非常重视用户的隐私保护，因此制定了本涵盖如何收集、使用、披露、分享以及存储用户的信息的《隐私条款》。用户在使用我们的服务时，我们可能会收集和使用您的相关信息。我们希望通过本《隐私条款》向您说明，在使用我们的服务时，我们如何收集、使用、储存和分享这些信息，以及我们为您提供的访问、更新、控制和保护这些信息的方式。本《隐私条款》适用于用户与本系统的交互行为以及用户使用本系统的服务，我们建议您仔细地阅读本政策，以帮助您了解维护自己隐私权的方式。
        </p>
        <p>
          您使用或继续使用我们的服务，即表示您同意我们按照本《隐私条款》收集、使用、储存和分享您的相关信息。如对本《隐私条款》或相关事宜有任何问题，请进行留言。
        </p>
        <br>
        <p class='h3'>
          一、我们可能收集的信息
        </p>
        <p>
          我们提供服务时，可能会收集、储存和使用下列与您有关的信息。
          <br>
          1.用户在采集商品时，我们会收集到用户采集商品的网址
          <br>
          2.设备或软件信息，例如您的移动设备、网页浏览器或用于接入我们服务的其他程序所提供的配置信息、您的IP地址和移动设备所用的版本和设备识别码
          <br>
          3.您通过我们的服务进行通讯的信息，例如曾通讯的账号，以及通讯时间、数据和时长
        </p>
        <br>
        <p class='h3'>
          二.我们如何使用您的信息
        </p>
        <p>
          1.向您提供服务。存档和备份用途，确保我们向您提供的产品和服务的安全性；
          <br>
          2.帮助我们设计新服务，改善我们现有服务；
        </p>
        <br>
        <p class='h3'>
          三、我们如何分享您的信息
        </p>
        <p>
        1.我们自觉维护用户隐私，严格遵守本协议内容
        <br>
        2.我们同意并承诺，对于所有用户隐私予以严格保密，在未得到用户事先许可的情况下不向任何个人或单位显露用户内容
        <br>
        3.我们不利用所掌握的商业秘密牟取私利
        </p>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'privacy',
  components: {
 
  },
  data () {
    return {

    }
  },
  created () {
  },
  methods: {

  }
}
</script>

<style scoped lang='less'>
  .privacy{
    background: #f0f2f5;
    height: 100%;
    width: 100%;
    .container{
      width: 1290px;
      height: 100%;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
      .title{
        text-align: center;
      }
      .content{
        font-size: 14px;
        .h3{
          font-size: 16px;
          font-weight: 800;
        }
      }
    }
  }
  

</style>
