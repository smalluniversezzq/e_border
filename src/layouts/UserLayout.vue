<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container " :style="{backgroundImage:'url(' + bgPic + ')'}">
      <div>
        <bg-animate />
      </div>
      <div class="top">
        <div class="login-logo" v-if="login_logo">
          <div class="login-logo-box">
            <img :src="login_logo" alt="">
          </div>
        </div>
      </div>
      <div class="login-txt">
        <div class="txt-top">
          <div class="top-title">{{ logoText }}ERP系统</div>
          <div class="subTitle">{{ EnLogoText }}</div>
          <div class="scribing"></div>
        </div>
        <div class="centers">&lt;{{ logoText }}{{ Explain }}&gt;</div>
        <div class="icone">
          <div class="dis-flex" v-for="(item,index) in icone" :key="index">
            <div class="icone-box">
              <div class="ico-img">
                <img :src="item.img" alt />
              </div>
              <div class="ico-txt">{{ item.title }}</div>
            </div>
            <div class="interval" v-if="index < 2">+</div>
          </div>
        </div>
      </div>
      <div class="card-flex card-login">
        <route-view class="login-card"></route-view>
      </div>
      <div class="footer">
        <div class="copyright links" v-if='address!=="none"'>公司地址：{{ address }}</div>
        <div class="copyright links">
          <span v-if='info!=="none"'>售后部：{{ info.tel }}</span> &nbsp;
          <span v-if='info!=="none"'>
            <span v-if='info.mail !== "none"'>邮箱：{{ info.mail }}</span>
          </span>&nbsp;
          <span v-if='info!=="none"' @click="openTo(info.webSite)" class="cursor">官网：{{ info.webSite }}</span>
        </div>
        <div class="copyright links">
          <span v-if='Copyright !== "none"' v-html="Copyright"></span>
          &nbsp;
          <span v-if='info!=="none"'><span v-if="info.recordNo"
                                           @click="openTo('https://beian.miit.gov.cn/#/Integrated/index')">{{ '备案号 : ' + info.recordNo }}</span></span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { BgAnimate } from '@/components'
import 'swiper/dist/css/swiper.min.css'
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import global from '@/config/global.js'

export default {
  name: 'UserLayout',
  components: {
    RouteView,
    BgAnimate
  },
  mixins: [mixinDevice],

  data () {
    return {
      // bgPic:require('@/assets/'+global.login_Bac),
      bgPic: global.picType ? require('@/assets/oem/' + global.picType + '/bg.png') : '',
      login_logo: global.login_logo ? require('@/assets/oem/' + global.picType + '/login_logo.png') : '',
      phone: require('@/assets/image/nav-phone.png'),
      icone: [
        {
          img: require('@/assets/iconeone.png'),
          title: '系统'
        },
        {
          img: require('@/assets/iconetow.png'),
          title: '服务'
        },
        {
          img: require('@/assets/iconethree.png'),
          title: '方案'
        }
      ],
      logoText: global.logoText,
      EnLogoText: global.EnLogoText,
      Explain: global.Explain,
      Copyright: global.Copyright,
      info: global.info,
      address: global.address
    }
  },
  methods: {
    onChange (a, b, c) {
    },
    openTo (webSite) {
      window.open(webSite, '_blank')
    }
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
/* For demo */
.mt {
  margin-top: 20px;
}

.swiper-box {
  width: 100%;
  position: relative;
}

.card-flex {
  position: absolute;
  top: 50%;
  margin-top: -225px;
  right: 8%;
  z-index: 100;
}

.card-login {
  width: 410px;
  height: 430px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
}

.logo-box {
  width: 200px;
  margin-bottom: 25px;

  img {
    width: 100%;
  }
}

#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    height: 100%;
    background-color: #f0f2f5;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    padding: 80px 0 144px;
    position: relative;
    overflow: hidden;

    .animate {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    a {
      text-decoration: none;
    }

    .top {
      text-align: left;
      margin-left: 350px;
      margin-right: 350px;

      .login-logo {
        .login-logo-box {
          width: 200px;
          height: 200px;
          // background: #fff;
          img {
            width: 100%;
          }
        }
      }

      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .login-txt {
      position: absolute;
      top: 50%;
      left: 8%;
      margin-top: -160px;
      width: 600px;
      height: 320px;

      .txt-top {
        text-align: center;

        .top-title {
          color: #fff;
          font-size: 40px;
        }

        .subTitle {
          font-size: 14px;
          color: #ffffff;
        }

        .scribing {
          width: 36px;
          border-bottom: 3px solid #fff;
          margin: 10px auto 0;
        }
      }

      .centers {
        text-align: center;
        color: #fff;
        margin-top: 10px;
        font-size: 24px;
      }

      .icone {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 35px;

        .dis-flex {
          display: flex;
          flex-wrap: wrap;

          .icone-box {
            width: 100px;

            .ico-img {
              text-align: center;

              img {
                width: 65px;
                height: 65px;
              }
            }

            .ico-txt {
              margin-top: 10px;
              color: #fff;
              font-size: 24px;
              text-align: center;
            }
          }

          .interval {
            text-align: center;
            width: 40px;
            color: #fff;
            font-size: 30px;
            margin-top: 25px;
            font-weight: 800;
          }
        }
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;

        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;

          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }

      .copyright {
        color: #fff;
        // color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
      }
    }
  }
}
</style>
<style scoped>
.cursor {
  cursor: pointer;
}

.bg-style {
  background-repeat: no-repeat;
}

/* For demo */
/* .ant-carousel >>> .slick-slide {
  text-align: center;
  height: 570px;
  overflow: hidden;
}

.ant-carousel >>> .slick-slide  h3 {
  color: #fff;
} */
</style>

