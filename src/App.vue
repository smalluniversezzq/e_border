<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
      <a-modal
        :maskClosable="false"
        width="850px"
        :title="title"
        :visible="visiblePublic"
        onOk="handleOk"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
      >
        <div style="max-height: 500px;overflow: auto;background-color: #ffffff;" v-html="ModalText"></div>
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk">
            确认
          </a-button>
        </template>
      </a-modal>
      <a-modal
        :maskClosable="false"
        class="index-style"
        width="500px"
        title="温馨提示"
        :footer="null"
        :closable="false"
        :visible="fundvisible"
        :confirmLoading="fundLoading"
      >
        <p v-if="balance === '-99999'" style="text-indent: 46px;margin-top: 22px;">{{ balance_msg }}</p>
        <p v-else style="text-indent: 46px;margin-top: 22px;">
          您的账户金额不足，已欠费<span style="color:red">{{ balance }}</span
          >元，请充值后使用！
        </p>
        <a-form-item
          v-if="balance !== '-99999'"
          label="充值金额"
          :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
          :wrapperCol="{ lg: { span: 18 }, sm: { span: 18 } }"
        >
          <a-input v-model="fundValue" style="width:120px"></a-input>
          <a-button class="ml" type="primary" @click="tofund(fundstates)">
            充值
          </a-button>
        </a-form-item>
        <a-divider />
        <a-button class="ml" type="primary" style="margin-left:80%;margin-bottom: 20px;" @click="switchAccount()">
          切换账号
        </a-button>
        <div></div>
      </a-modal>
      <a-modal
        class="showfund"
        title=""
        :visible="visibleFund"
        @ok="handleFundOk"
        @cancel="handleFundCanceldel"
        width="360px"
      >
        <img style="width:100%" :src="activity" alt="" />
        <div class="QRcode-pics">
          <img style="width:100%; border-radius: 8px" :src="fundQRcode" alt="" />
        </div>
        <div class="tac fundtitle">
          <p>您正在进行系统充值！！</p>
        </div>
        <div class="tac fundmoney app-fundmoney">
          充值金额：<span class="txt-color">{{ fundValue }} </span> 元
        </div>
      </a-modal>
      <a-modal
        :maskClosable="false"
        class="showfund"
        title="到期提醒"
        :visible="expirevisible"
        @ok="TimeEndhandleOk"
        @cancel="handleExpire"
        :zIndex=1010
        width="520px"
      >
        <div v-if="expireType == 1">
          当前账号即将到期，请在 <span style="color:red;font-size:18px;">{{ expireTime }}</span> 之前联系客服续费。
        </div>
        <div v-else>
          当前账号已经到期，请联系客服续费。
        </div>
      </a-modal>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import global from '@/config/global.js'
import { getRechange, orderCheck } from '@/api/rechange'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      locale: zhCN,
      visiblePublic: false,
      confirmLoading: false,
      ModalText: '',
      title: '',
      fundvisible: false,
      fundLoading: false,
      fundValue: '',
      fundstates: 0,
      fundRechange: '',
      fundId: '',
      fundQRcode: '',
      fundCheckstate: '',
      cleartimes: 0,
      activity: require('@/assets/image/guoqing_activity.png'),
      visibleFund: false,
      balance: '',
      expireTime: '',
      expirevisible: false,
      expireType: '',
      balance_msg: ''
    }
  },
  watch: {
    '$store.state.user.announce.status': function() {
      this.visiblePublic = true
      this.title = this.$store.state.user.announce.title
      this.ModalText = this.$store.state.user.announce.content
    },
    '$store.state.user.balance': function() {
      let fundStatus = this.$store.state.user.balance
      this.balance_msg = this.$store.state.user.balance_msg
      this.balance = this.$store.state.user.balance
      if (fundStatus < 0) {
        this.fundvisible = true
      } else {
        this.fundvisible = false
      }
    },
    '$store.state.user.expireinfo': function() {
      let expireStatus = this.$store.state.user.expireinfo.status
      this.expireTime = this.$store.state.user.expireinfo.time
      this.expireType = this.$store.state.user.expireinfo.type
      if (expireStatus) {
        this.expirevisible = true
      } else {
        this.expirevisible = false
      }
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleCancel(e) {
      this.visiblePublic = false
    },
    handleOk() {
      this.visiblePublic = false
    },
    tofund(val) {
      if (this.fundValue) {
        if (this.fundValue > 0) {
          this.fundRechange = val
          this.getRechangepics()
        } else {
          this.$notification.error({
            message: '提醒',
            description: '充值金额不能为负数'
          })
        }
      } else {
        this.$notification.error({
          message: '提醒',
          description: '请输入充值金额'
        })
      }
    },
    getRechangepics() {
      getRechange({
        type: this.fundRechange,
        number: this.fundValue
      }).then(res => {
        if (res.code === 0) {
          this.fundId = res.data.orderId
          if (this.fundstates == 3) {
            this.fundQRcode = window.atob(res.data.qrCode)
            var newwin = window.open('', '_blank')
            newwin.document.write(this.fundQRcode)
          } else {
            this.visibleFund = true
            this.fundQRcode = res.data.qrCode
          }
          this.judgeorderChecks(true)
        }
      })
    },
    judgeorderChecks(state) {
      this.fundCheckstate = state
      setTimeout(() => {
        if (this.fundCheckstate === true) {
          orderCheck({
            order_id: this.fundId
          }).then(res => {
            if (res.code === 0) {
              if (res.data.status === true) {
                this.fundCheckstate = false
                this.$notification.success({
                  message: '充值成功',
                  description: '充值成功'
                })
                this.visibleFund = false
                if (res.data.balance < 0) {
                  this.fundvisible = true
                } else {
                  this.fundvisible = false
                }
                this.balance = res.data.balance
                this.$store.commit('SET_BALANCE', this.balance) // payload 为参数
              } else if (res.data.status === false) {
                this.judgeorderChecks(true)
              }
            } else {
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      }, 1000)
    },
    handleFundOk(e) {
      setTimeout(() => {
        this.visibleFund = false
      }, 1000)
    },
    handleFundCanceldel(e) {
      this.visibleFund = false
    },
    switchAccount() {
      return this.Logout({})
        .then(() => {
          window.location.reload()
        })
        .catch(err => {
          that.$message.error({
            title: '错误',
            description: err.message
          })
        })
    },
    TimeEndhandleOk() {
      this.expirevisible = false
    },
    handleExpire() {
      if (this.expireType == 1) {
        this.expirevisible = false
      } else {
        this.$store.dispatch('Logout').then(() => {
          next({ path: '/user/login', query: { redirect: to.fullPath } })
        })
      }
    },
    followNotice() {
      // let that = this
      // followNotion().then((res) => {
      //   if (res.code === 0 && res.msg) {
      //     that.$notification.error({
      //       message: '提示',
      //       description: res.msg,
      //     })
      //   }
      // })
    }
  },
  created() {
    document.title = global.logoText
  },
  mounted() {
    const domain = window.location.host
    if (domain.indexOf('www.jindeng.top') != -1) {
      this.fundstates = 3
    } else if (domain.indexOf('erp319.czkjds.com') != -1) {
      this.fundstates = 3
    } else if (domain.indexOf('erp.liqikeji6.com') != -1) {
      this.fundstates = 3
    }
    //setInterval(this.followNotice, 10000)
  }
}
</script>
<style>
#app {
  height: 100%;
}

.mt {
  margin-top: 20px;
}

.mr {
  margin-right: 20px;
}

.mb {
  margin-bottom: 20px;
}

.ml {
  margin-left: 20px;
}

.cursor {
  cursor: pointer;
}

.showfund > .ant-modal-content > .ant-modal-footer {
  display: none !important;
}

.QRcode-pics {
  margin: 0 auto;
  width: 180px;
  height: 180px;
  position: absolute;
  top: 20%;
  left: 25%;
}

.tac {
  text-align: center;
}

.fundtitle {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 80%;
  color: white;
  font-size: 18px;
}

.fundmoney {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 85%;
  color: white;
  text-align: center;
  font-size: 20px;
}

.app-fundmoney .txt-color {
  color: #fbff00;
  font-size: 26px;
}

.index-style > .ant-modal-body {
  padding: 0;
}
</style>
