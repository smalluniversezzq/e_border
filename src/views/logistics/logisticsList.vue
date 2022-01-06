<template>
  <div class="logisticsList">
    <a-card>
      <!-- //列表 -->
      <a-row class="mt">
        <a-col :span="24">
          <a-table :columns="columns" :dataSource="dataInfo" @expand="openShow" :rowKey="(r, i) => i" :defaultExpandAllRows="false">
            <span slot="time">系统默认设置</span>
            <a-card slot="expandedRowRender" slot-scope="record">
              <a-form layout="inline">
                <a-row type="flex" justify="start">
                  <a-col :md="8" :lg="8" :xl="8" :xxl="8">
                    <span style="margin-right:10px">物流渠道:</span>
                    <a-input-search placeholder="请输入物流渠道名称" style="width:200px" @search="(value,event)=>onSearch(value,event,record.code)"/>
                  </a-col>
                </a-row>
              </a-form>
              <a-table
                class='mt'
                :columns="innerColumns"
                :dataSource="record.children1"
                :pagination="false"
                :rowKey="(r, i) => i">
              </a-table>
            </a-card>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import { getUserConfig, tabStatusChange, getLogisticsCompany} from '@/api/order'
import { permsBtn } from '@/utils/static'
export default {
  name: 'logisticsList',
  data() {
    return {
      permsBtn,
      dataInfo: [],
      current:1,
      page:"",
      adds: '',
      querycode: '',
      listLoading:false,
      columns:[
        { title: '物流公司', dataIndex: 'name' },
        { title: '启用时间', key: 'time' , scopedSlots: { customRender: 'time' },},
      ],
      innerColumns:[
        { title: '物流名称', dataIndex: 'channel_name' },
        { title: '启用时间', dataIndex: 'updated_at' },
      ],
      infoChild:[],
      num:"",
    }
  },
  created() {},
  mounted() {
    this.getLogisticsCompanys()
  },
  updated() {},
  destroyed() {},
  methods: {
    // 获取物流信息
    getUserConfigs(pagesize) {
      let _this = this
      getUserConfig({
        page_size:pagesize,
        page:_this.current
      }).then((res) => {
        if (res.code === 0) {
          _this.dataInfo = res.data
          _this.page = res.pages
          console.log(res.data,_this.dataInfo)
        } else {
          _this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    //获取一级列表
    async getLogisticsCompanys(){
      const { code, data, msg } = await getLogisticsCompany({
        page: this.current,
        company: this.querycode
      })
      if (code === 0) {
        this.dataInfo = data.data.map(item => ({ ...item, children1: [] }))
      } else {
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
    //展开请求二级数据
    async openShow(expanded, { id, code: company }){
      const { code, data, msg } = await getUserConfig({ company })
      if (code === 0) {
        this.dataInfo = this.dataInfo.map(item => ({
          ...item,
          children1: item.id === id ? data.data : item.children1
        }))
      } else {
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
    //二级查询
    async onSearch(value,event,codes){
      const { code, data, msg } = await getUserConfig({ company:codes , keywords:value})
      if (code === 0) {
        this.dataInfo = this.dataInfo.map(item => ({
          ...item,
          children1: item.code === codes ? data.data : item.children1
        }))
      } else {
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
    queryList() {
      if (this.querycode) {
        getUserConfig({
          page: this.current,
          keywords: this.querycode
        }).then(res => {
          if (res.code === 0) {
            this.dataInfo = res.data
            this.page = res.pages
          } else {
            this.$notification.error({
              message: '提醒',
              description: res.msg
            })
          }
        })
      } else {
        console.log(this.querycode)
        this.getUserConfigs()
      }
    },
    pagechange(page, pagesize) {
      console.log(page)
      this.current = page
      this.getUserConfigs(pagesize)
    },
    addtable(id, status) {
      if (status == '0') {
        this.adds = 1
      } else if (status == '1') {
        this.adds = 0
      }
      tabStatusChange({
        channel_code: id,
        status: this.adds
      }).then(res => {
        if (res.code === 0) {
          this.getUserConfigs()
        }
      })
    }
  }
}
</script>
<style scoped lang='less'>
.mt {
  margin-top: 20px;
}
.mr {
  margin-right: 20px;
}
</style>


