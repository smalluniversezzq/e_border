<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-row>
      <a-col>
        <a-tabs type="card" v-model="tab" @change="callback1">
          <a-tab-pane key="2" tab="全部消息"></a-tab-pane>
          <a-tab-pane key="0" tab="未读消息"></a-tab-pane>
          <a-tab-pane key="1" tab="已读消息"></a-tab-pane>
          <a-tab-pane key="3" tab="消息设置"></a-tab-pane>
        </a-tabs>
      </a-col>
      <!-- <a-col v-for="(item,index) in noticelist" :key="index">
        <a-collapse v-model="ids" :bordered="false">
          <a-collapse-panel :key="item.id">
            <template slot="header">
              <a-row>
                <a-col :span="6">
                  <span>{{item.title}}</span>
                </a-col>
                <a-col :offset="12" :span="6" class="tar">
                  <span>{{item.created_at}}</span>
                </a-col>
              </a-row>
            </template>
            <span class="title">{{item.remark}}</span>
            <div v-html="item.content"></div>
          </a-collapse-panel>
        </a-collapse>
      </a-col> -->
    </a-row>
    <a-row v-if="tab!=='3'">
      <a-col>
        <a-tabs v-model="type" @change="callback2">
          <a-tab-pane key="2" tab="运营消息"></a-tab-pane>
          <a-tab-pane key="1" tab="系统消息"></a-tab-pane>
          <a-tab-pane key="3" tab="账号消息"></a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <a-row v-if="tab!=='3'">
      <a-col class="mb">
        <a-button type='primary' @click='readAll'>全部已读</a-button>
        <a-button type='primary' class="ml" @click='markeRead'>标为已读</a-button>
      </a-col>
      <a-col>
        <a-table
          :loading="listLoading"
          :dataSource="noticelist"
          :rowSelection="rowSelectionRelease"
          :pagination="false"
          :customRow="readClick"
          rowKey="id">
          <a-table-column
            title="消息"
            dataIndex="price"
            width="1200px">
            <template slot-scope="text, record">
              <a-row>
                <a-col :span="1" style="width:20px;display:flex;text-align:center;align-items:center">
                  <a-badge v-show="record.read==='0'" status="processing"/>
                </a-col>
                <a-col :span="23" v-if="record.key==='20'" style="display:flex;flex-wrap:wrap">
                  <div class="mr">业绩结果：<span style="color:#1890ff">￥{{ record ? record.remark.saleResult : '' }}</span>
                  </div>
                  <div class="mr">总销量：<span style="color:#1890ff">{{ record ? record.remark.saleAllNum : '' }}件</span>
                  </div>
                  <div class="mr">总订单量：<span style="color:#1890ff">{{ record ? record.remark.orderAllNum : '' }}单</span>
                  </div>
                  <div class="mr">今日新增：<span style="color:#1890ff">￥{{ record ? record.remark.dayResult : '' }}</span>
                  </div>
                  <div class="mr">销量：<span style="color:#1890ff">{{ record ? record.remark.saleDayNum : '' }}件</span>
                  </div>
                  <div>订单量：<span style="color:#1890ff">{{ record ? record.remark.orderDayNum : '' }}单</span></div>
                </a-col>
                <a-col :span="23" v-if="record.key==='21'">
                  你有<span style="color:#1890ff">{{ record ? record.remark.num : '' }}</span>个订单即将达到剩余发货时间，请及时处理
                </a-col>
                <a-col :span="23" v-if="record.key==='22'">
                  你的商品<span style="color:#1890ff">{{ record ? record.remark.goodName : '' }}</span>正在被跟卖，请及时处理
                </a-col>
                <a-col :span="23" v-if="record.key==='23'">
                  你有<span style="color:#1890ff">{{ record ? record.remark.num : '' }}</span>个订单已经被退货，请及时处理
                </a-col>
                <a-col :span="23" v-if="record.key=='24'">
                  你新增了一个<span style="color:#1890ff">{{record?record.remark.country_cn:''}}</span>订单，销售额<span style="color:#1890ff">{{record?record.remark.amount:''}}</span>$，请及时处理
                </a-col>
                <a-col :span="23" v-if="record.key==='10'">
                  {{ record ? record.remark.title : '' }}
                </a-col>
                <a-col :span="23" v-if="record.key==='30'">
                  账号<span style="color:#1890ff">{{ record ? record.remark.username : '' }}</span>已完成
                  <span style="color:#1890ff">{{ record ? record.remark.title : '' }}</span>店铺授权，并获取，
                  <span style="color:#1890ff">{{ record ? record.remark.country_cn : '' }}</span>站点
                </a-col>
                <a-col :span="23" v-if="record.key==='31'">
                  {{ record ? record.remark.message : '' }}
                </a-col>
                <a-col :span="23" v-if="record.key==='32'">
                  账号<span style="color:#1890ff">{{ record ? record.remark.username : '' }}</span>通过{{record ? record.remark.name : ''}}充值
                  <span style="color:#1890ff">{{ record ? record.remark.amount : '' }}</span>元
                </a-col>
                <a-col :span="23" v-if="record.key==='33'">
                  你的系统将于<span style="color:#1890ff">{{ record ? record.remark.day : '' }}</span>天后的
                  <span style="color:#1890ff">{{ record ? record.remark.date : '' }}</span>到期
                </a-col>
              </a-row>
            </template>
          </a-table-column>
          <a-table-column
            title="类型"
            dataIndex="type_name">
          </a-table-column>
          <a-table-column
            title="时间"
            dataIndex="created_at">
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
    <a-row v-if="tab!='3'" class="mt" type="flex" justify="end">
      <a-col offset="18">
        <a-pagination
          v-model="current"
          @change="pagechange"
          :pageSize="page.pageSize"
          :total="(page.pageSize*page.lastPage)"
        />
      </a-col>
    </a-row>
    <a-row v-if="tab=='3'">
      <a-col>
        <a-collapse :bordered="false">
          <a-collapse-panel :style="customStyle" v-for="(item,index) in setInfo" :key="index">
            <template slot="header">
              {{ item.title }}
            </template>
            <a-row>
              <a-col>
                <a-table
                  :dataSource="item.child"
                  :pagination="false"
                  rowKey="id">
                  <a-table-column
                    title="消息类型"
                    dataIndex="title"
                    width="1500px">
                  </a-table-column>
                  <a-table-column
                    title="站内通知">
                    <template slot-scope="text, record">
                      <a-switch v-model="record.is_select=='1'?true:false" @change="(val)=>isAddChange(val,record)"/>
                    </template>
                  </a-table-column>
                </a-table>
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
    <a-modal
      :title='readTitle'
      :width="1000"
      :visible='readVisibles'
      @cancel="readCancel">
      <a-row>
        <a-col v-if="readData&&readData.key=='20'" style="display:flex;flex-wrap:wrap">
          <div class="mr">业绩结果：<span style="color:#1890ff">￥{{readData?readData.remark.saleResult:''}}</span></div>
          <div class="mr">总销量：<span style="color:#1890ff">{{readData?readData.remark.saleAllNum:''}}件</span></div>
          <div class="mr">总订单量：<span style="color:#1890ff">{{readData?readData.remark.orderAllNum:''}}单</span></div>
          <div class="mr">今日新增：<span style="color:#1890ff">￥{{readData?readData.remark.dayResult:''}}</span></div>
          <div class="mr">销量：<span style="color:#1890ff">{{readData?readData.remark.saleDayNum:''}}件</span></div>
          <div>订单量：<span style="color:#1890ff">{{readData?readData.remark.orderDayNum:''}}单</span></div>
        </a-col>
        <a-col v-if="readData&&readData.key=='21'">
          你有<span style="color:#1890ff">{{readData?readData.remark.num:''}}</span>个订单即将达到剩余发货时间，请及时处理
        </a-col>
        <a-col v-if="readData&&readData.key=='22'">
          你的商品<span style="color:#1890ff">{{readData?readData.remark.goodName:''}}</span>正在被跟卖，请及时处理
        </a-col>
        <a-col v-if="readData&&readData.key=='23'">
          你有<span style="color:#1890ff">{{readData?readData.remark.num:''}}</span>个订单已经被退货，请及时处理
        </a-col>
        <a-col v-if="readData&&readData.key=='24'">
          你新增了一个<span style="color:#1890ff">{{readData?readData.remark.country_cn:''}}</span>订单，销售额<span style="color:#1890ff">{{readData?readData.remark.amount:''}}</span>$，请及时处理
        </a-col>
        <a-col v-if="readData&&readData&&readData.key=='10'" v-html="readData?readData.html:''">
          <!-- {{readData?readData.remark.title:''}} -->
        </a-col>
        <a-col v-if="readData&&readData.key=='30'">
          账号<span style="color:#1890ff">{{readData?readData.remark.username:''}}</span>已完成
          <span style="color:#1890ff">{{readData?readData.remark.title:''}}</span>店铺授权，并获取，
          <span style="color:#1890ff">{{readData?readData.remark.country_cn:''}}</span>站点
        </a-col>
        <a-col v-if="readData&&readData.key=='31'">
          {{readData?readData.remark.message:''}}
        </a-col>
        <a-col v-if="readData&&readData.key=='32'">
          账号<span style="color:#1890ff">{{readData?readData.remark.username:''}}</span>通过{{readData?readData.remark.name:''}}充值
          <span style="color:#1890ff">{{readData?readData.remark.credit:''}}</span>元
        </a-col>
        <a-col v-if="readData&&readData.key=='33'">
          你的系统将于<span style="color:#1890ff">{{readData?readData.remark.day:''}}</span>天后的
          <span style="color:#1890ff">{{readData?readData.remark.date:''}}</span>到期
        </a-col>
      </a-row>
      <template slot="footer">
        <a-row>
          <a-col style="display:flex;justify-content: flex-end;">
            <a-button type='primary' @click='readOk'>确定</a-button>
          </a-col>
        </a-row>
      </template>
    </a-modal>
  </a-card>
</template>
<script>
import { noticeList, getMessageList, markRead, markReadAll, getMessageMenu, setMessage } from '@/api/home'

export default {
  name: 'news',
  data () {
    return {
      title: '标题',
      date: '2019-12-12',
      content: '666666666666666666',
      noticelist: '',
      page: '',
      current: 1,
      ids: '',
      tab:'2',
      type:'2',
      listLoading:false,
      selectAll:"",
      selectkey:"",
      selectedRowKeys:[],
      setInfo:[],
      customStyle:'border-radius: 4px;border: 0;overflow: hidden',
      readVisibles:false,
      readData:null,
      readTitle:''
    }
  },
  computed: {
    rowSelectionRelease () {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRowes) => {
          this.selectAll = selectedRowes
          this.selectkey = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys // 上传后勾选去掉
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User',
            name: record.name,
          }
        }),
      }
    },
  },
  methods: {
    noticeLists (page) {
      this.listLoading = true
      getMessageList({
        page: this.current,
        page_size: '10',
        type: this.type,
        read: this.tab
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) != '{}') {
            this.noticelist = res.data
          } else {
            this.noticelist = []
          }
          this.page = res.pages
          this.listLoading = false
        } else {
          this.noticelist = []
          this.page = res.pages
          this.listLoading = false
        }
      })
    },
    pagechange (page, pagesize) {
      this.current = page
      this.noticeLists()
    },
    callback1 (key) {
      this.tab = key || '2'
      this.noticelist = []
      if (key != '3') {
        this.noticeLists()
      } else {
        this.getMessageMenus()
      }
    },
    callback2 (key) {
      this.type = key || '2'
      this.noticelist = []
      this.noticeLists()
    },
    readAll () {
      markReadAll({}).then(res => {
        if (res.code === 0) {
          this.$notification.success({
            message: '成功',
            description: res.msg,
          })
          this.$store.dispatch('GetInfo')
          this.noticeLists()
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg,
          })
        }
      })
    },
    markeRead () {
      if (!this.selectAll.length) {
        this.$notification.error({
          message: '错误',
          description: '请先勾选标为已读的选项',
        })
        return
      }
      markRead({
        ids: this.selectkey,
      }).then(res => {
        if (res.code === 0) {
          this.$notification.success({
            message: '成功',
            description: res.msg,
          })
          this.selectedRowKeys = []
          this.$store.dispatch('GetInfo')
          this.noticeLists()
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg,
          })
        }
      })
    },
    getMessageMenus () {
      getMessageMenu({}).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) != '{}') {
            this.setInfo = res.data
          } else {
            this.setInfo = []
          }
        } else {
          this.setInfo = []
        }
      })
    },
    isAddChange(val,obj){
      obj.is_select = val?'1':'0'
      setMessage({
        keys:obj.key,
      }).then((res)=>{
        if(res.code === 0){
          this.$notification.success({
            message: '提示',
            description: res.msg,
          });
        }else{
          this.$notification.error({
            message: '提示',
            description: res.msg,
          });
        }
      })
    },
    readClick(record, index){
      let _this = this
      return {
        on: {
          click: () => {
            if(record.key=="10"){
              if(record.html){
                _this.readVisibles = true
                _this.readData = record
                _this.readTitle = record.title+'提醒'
              }
            }else{
              _this.readVisibles = true
              _this.readData = record
              _this.readTitle = record.title+'提醒'
            }
          }
        }
      }
    },
    readCancel(){
      this.readVisibles = false
      this.readData = null
    },
    readOk(){
      markRead({
        ids:this.readData.id,
      }).then(res => {
        if (res.code === 0) {
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          this.readVisibles = false
          this.readData = null
          this.$store.dispatch('GetInfo')
          this.noticeLists()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    }
  },
  created () {
    this.tab = this.$route.query.tab ? this.$route.query.tab.toString() : '2'
    this.type = this.$route.query.type ? this.$route.query.type.toString() : '2'
  },
  mounted () {
    if (this.tab == 3) {
      this.getMessageMenus()
    } else {
      this.noticeLists()
    }
    this.ids = this.$route.query.id
  },
  uptated () {
  },
  destroyed () {
  }
}
</script>
<style lang='less' scoped>
.ml {
  margin-left: 20px;
}

.mt {
  margin-top: 20px;
}

.tar {
  text-align: right;
}

.title {
  color: #000;
  font-size: 14px;
}
</style>

