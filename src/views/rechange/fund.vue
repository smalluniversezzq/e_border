<template>
  <div>
    <a-card>
      <a-row>
        <a-col
          :md='3'
          :lg="2"
          :xl='2'
          :xxl="1"
        >
          <div style='line-height:30px'>充值金额</div>
        </a-col>
        <a-col
          :md='7'
          :lg="7"
          :xl='6'
          :xxl="5"
        >
          <a-input-number
            :min="0.01"
            style="width:100%"
            v-model='money'
            placeholder='请输入金额'
          ></a-input-number>
        </a-col>
        <a-col
          :md='4'
          :lg="4"
          :xl='4'
          :xxl="4"
        >
          <a-button
           v-if='hasPerm(permsBtn.recharge_recharge)'
            class='ml'
            type='primary'
            @click='tofund(fundstate)'
          >充值</a-button>
          <a-modal
            class='showfund index-styles'
            title=""
            :visible="visible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCanceldel"
            width="360px"
          >
            <div class='alert-box'>
              <img
                :src="activity"
                alt=""
              >
            </div>
            <div class="QRcode-pic">
              <img
                style='width:100%; border-radius: 8px'
                :src="QRcode"
                alt=""
              />
            </div>
            <div class='tac fundtitle'>
              <p>您正在进行系统充值！！！</p>
            </div>
            <div class='tac fundmoney'>
              充值金额：<span class='txt-color'>{{money}} </span> 元
            </div>
          </a-modal>
        </a-col>
      </a-row>
    </a-card>
    <a-card
      v-if='hasPerm(permsBtn.recharge_history)'
      class='mt'
      :bordered="false"
    >
      <a-row type='flex' justify='start'>
        <a-col>
          <date-screen ref='dateScreen' @dataScreenInfo='dataScreenInfoFn($event)' />
        </a-col>
        <a-col class='ml'>
          <a-button @click='screen()'>筛选</a-button>
        </a-col>
      </a-row>
      <!-- tab -->
      <a-tabs
        defaultActiveKey="1"
        @change='callback'
        class='mt'
      >
        <a-tab-pane key="1">
          <span slot="tab">
            <!-- <a-icon type="android" /> -->
            充值历史
          </span>
          <a-table
            :loading="listLoading"
            :pagination="false "
            v-if='!orderList.length <= 0'
            :dataSource="orderList"
            rowKey="id">
            <a-table-column
              title="金额"
              dataIndex="number"
            />
            <a-table-column
              title="充值时间"
              dataIndex="created_at"
            />
            <a-table-column title="支付方式">
              <template slot-scope="text, record">
                <span v-if="record.type == 0">扫呗</span>
                <span v-if="record.type == 1">支付宝</span>
                <span v-if="record.type == 2">微信</span>
                <span v-if="record.type == 3">支付宝</span>
                <span v-if="record.type == 10">系统充值</span>
              </template>
            </a-table-column>
            <a-table-column title="支付状态">
              <template slot-scope="text, record">
                <span>
                  {{record.status == '0' ? '未支付':'已支付'}}
                </span>
              </template>
            </a-table-column>
            <a-table-column
              title="操作账号"
              dataIndex="username"
            >
            </a-table-column>
          </a-table>
          <a-row
            v-if='orderList'
            class='mt'
            type="flex"
            justify="end">
            <a-col>
              <a-pagination
                v-model="current"
                @change='pagechange'
                :pageSize='page.pageSize'
                :total='(page.pageSize*page.lastPage)'
              />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <!-- <a-icon type="android" /> -->
            消费历史
          </span>
          <a-table
            :loading="listLoading"
            :pagination="false "
            :dataSource="PostageData"
            rowKey="id"
          >
            <a-table-column
              title="名称"
              dataIndex="username"
            />
            <a-table-column
              title="描述"
              dataIndex="remark"
            />
            <a-table-column
              title="金额"
              dataIndex="amount"
            />
            <a-table-column
              title="时间"
              dataIndex="created_at"
            />
          </a-table>
          <a-row
            v-if='PostageData'
            class='mt'
            type="flex"
            justify="end"
          >
            <a-col>
              <a-pagination
                v-model="currentPostage"
                @change='pagechangePostage'
                :pageSize='pagePostage.pageSize'
                :total='(pagePostage.pageSize*pagePostage.lastPage)'
              />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-button type="primary" :loading="exportLodaing" @click="exportTable" slot="tabBarExtraContent">
          导出表格
        </a-button>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import { getRechange, orderCheck, getPayList, getLogisticsLog, exportConsume } from '@/api/rechange'
import { FastBackwardFill } from '@ant-design/icons/lib/dist'
import { getInfo } from '../../api/login'
import { permsBtn } from '@/utils/static'
import DateScreen from '@/components/DateScreen/DateScreen'
import {handlerData} from '@/utils/util'
// import { setInterval } from 'timers';
export default {
  name: 'fund',
  components: {
    DateScreen
  },
  data() {
    return {
      permsBtn,
      activity: require('@/assets/image/guoqing_activity.png'),
      listLoading: false,
      group: '',
      orderList: '',
      visible: false,
      confirmLoading: false,
      delid: '',
      ModalText: '确定要删除吗',
      selectAll: '',
      selectkey: '',
      ids: '',
      money: '',
      stateRechange: '',
      orderId: '',
      QRcode: '',
      orderCheckstate: '',
      cleartime: 0,
      fundstate: 0,
      page: '',
      current: 1,
      currentPostage: 1,
      pagePostage: '',
      PostageData: '',
      exportLodaing:false,
      tabValue:1,
      start_time:"",
      end_time:"",
    }
  },
  mounted: function() {
    this.fundstate = this.GLOBAL.paymentInfo
    this.getPayLists()
  },
  methods: {
    //导出表格
    exportTable(){
      this.exportLodaing = true
      exportConsume({
        type:this.tabValue,
        start_time:this.start_time,
        end_time:this.end_time,
      }).then((res)=>{
        if(res.code===0){
          window.open(res.data.file,'_blank')
          this.exportLodaing = false
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
    //充值历史
    pagechange(page, pagesize) {
      console.log(page, pagesize)
      this.current = page
      this.getPayLists()
    },
    //消费历史
    pagechangePostage(page, pagesize) {
      console.log(page ,'消费历史')
      this.currentPostage = page
      this.getLogisticsLogs()
    },
    // 充值订单列表
    getPayLists() {
      this.listLoading = true
      getPayList({
        page: this.current,
        start_time:this.start_time,
        end_time:this.end_time
      }).then(res => {
        if (res.code === 0) {
          console.log('消费历史的数据')
          this.listLoading = false
          this.page = res.pages
          this.orderList = handlerData(res.data)
          console.log(this.orderList,'123')
          // this.$notification.success({
          //   message:'成功',
          //   description: res.msg,
          // });
        } else {
          this.listLoading = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
      getInfo({}).then(res => {
        if (res.code === 0) {
          this.$store.commit('SET_BALANCE', res.data.balance) // payload 为参数
        }
      })
    },
    tofund(val) {
      if (this.money) {
        if (this.money > 0) {
          this.stateRechange = val
          this.getRechangepic()
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
    getRechangepic() {
      console.log("getRechangepic")
      getRechange({
        type: this.GLOBAL.paymentInfo,
        number: this.money
      }).then(res => {
        if (res.code === 0) {
          // this.visible = true
          this.orderId = res.data.orderId
          console.log(this.fundstate,'this.fundstate')
          if(this.fundstate == 3){
            this.QRcode = window.atob(res.data.qrCode)
            var newwin=window.open('','_blank');
            newwin.document.write(this.QRcode); 
          }else{
            this.visible = true
            this.QRcode = res.data.qrCode
          }
          this.judgeorderCheck(true)
        }
      })
    },
    judgeorderCheck(state) {
      this.orderCheckstate = state
      setTimeout(() => {
        if (this.orderCheckstate === true) {
          orderCheck({
            order_id: this.orderId
          }).then(res => {
            if (res.code === 0) {
              if (res.data.status === true) {
                this.orderCheckstate = false
                this.$notification.success({
                  message: '充值成功',
                  description: '充值成功'
                })
                this.visible = false
                this.getPayLists()
              } else if (res.data.status === false) {
                this.cleartime++
                if (this.cleartime !== 120) {
                  this.judgeorderCheck(true)
                } else {
                  this.$notification.error({
                    message: '错误',
                    description: '付款超时'
                  })
                  this.visible = false
                }
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
    //  切换tab
    callback(key) {
      key == 1 ? this.tabValue=1 : this.tabValue=2
      if (key === '2') {
        this.getLogisticsLogs()
      }else if(key === '1'){
        this.getPayLists()
      }
    },
    // 获取费用历史
    getLogisticsLogs() {
      // this.listLoading = true
      getLogisticsLog({
        page_size: '10',
        page: this.currentPostage,
        start_time:this.start_time,
        end_time:this.end_time
      })
      .then(res => {
        if (res.code == 0) {
          this.listLoading = false
          // this.PostageData = handlerData(res.data)
          this.PostageData = res.data
          this.pagePostage = res.pages
          console.log(this.PostageData, 'over')
        } else {
          this.listLoading = false
        }
      })
      .catch(err => {
        this.listLoading = false
      })
    },
    toaddrole() {
      this.$router.push({
        path: '/power/addrole'
      })
    },
    handleOk(e) {
      this.del()
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 1000)
    },
    handleCanceldel(e) {
      this.visible = false
      this.orderCheckstate = false
      this.getPayLists()
    },
    //时间筛选
    screen(){
      this.start_time = this.$refs.dateScreen.start_time;
      this.end_time = this.$refs.dateScreen.end_time;
      console.log(this.start_time,this.end_time);
      this.tabValue == 1? this.getPayLists():this.getLogisticsLogs()
    },
    dataScreenInfoFn(info){
      console.log(info)
      this.start_time = info.start_time
      this.end_time = info.end_time
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.mt {
  margin-top: 20px;
}
.ml {
  margin-left: 20px;
}
.tac {
  text-align: center;
}
.alert-box{
  width: 360px;
  img{
    width:100%;
  }
}
.QRcode-pic {
  text-align: center;
  margin: 0 auto;
  width: 200px;
  height: 200px;
  position: absolute;
  top: 20%;
  left: 28%;
}
.txt-color {
  color: #fbff00;
  font-size: 26px;
}
.fundps {
  color: #ff6600;
}
</style>
<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.15) !important;
}
.showfund > .ant-modal-content > .ant-modal-footer {
  display: none !important;
}
.showfund > .ant-modal-content{
  background: rgba(0, 0, 0, 0);
  box-shadow:none;

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
.index-styles > .ant-modal-body {
  padding: 0px;
  position: relative;
}
.ant-modal-content {
  border-radius: 15px;
}
</style>
