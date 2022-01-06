<template>
  <div class="history">
    <a-card :bordered="false" title='筛选条件'>
      <a-row  class='mt'>
        <a-col class='title-size' :span='2'>平台渠道</a-col>
         <a-col :span='2' >
            <a-button size="small">全部</a-button>
        </a-col>
        <a-col :span='2'>
          <a-button size="small">亚马逊</a-button>
        </a-col>
        <a-col :span='2' >
          <a-button size="small">亚马逊</a-button>
        </a-col>
      </a-row>
     <a-row  class='mt'>
        <a-col  class='title-size' :span='2'>国家</a-col>
        <a-col :span='2' >
          <a-button size="small">全部</a-button>
        </a-col>
       <a-col :span='2' >
          <a-button size="small">美国</a-button>
        </a-col>
        <a-col :span='2' >
          <a-button size="small">德国</a-button>
        </a-col>
        <a-col :span='2' >
          <a-button size="small">日本</a-button>
        </a-col>
        <a-col :span='2' >
          <a-button size="small">墨西哥</a-button>
        </a-col>
      </a-row>
      <a-row   class='mt'>
        <a-col  class='title-size' :span='2'>店铺名称</a-col>
        <a-col :span='2' >
          <a-button size="small">全部</a-button>
        </a-col>
       <a-col :span='2' >
          <a-button size="small">美国</a-button>
        </a-col>
        <a-col :span='2' >
          <a-button size="small">德国</a-button>
        </a-col>
        <a-col :span='2' >
          <a-button size="small">日本</a-button>
        </a-col>
        <a-col :span='2' >
          <a-button size="small">墨西哥</a-button>
        </a-col>
      </a-row>
      <a-row class='mt'>
        <a-col  class='title-size' :span='2'>上传条件</a-col>
        <a-col :span='2' >
          <a-button size="small">全部</a-button>
        </a-col>
        <a-col :span='2' >
          <a-button size="small">上传中</a-button>
        </a-col>     <a-col :span='2' >
          <a-button size="small">上传成功</a-button>
        </a-col>     <a-col :span='2' >
          <a-button size="small">上传失败</a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-card title='订单列表' class='mt'>
    <a-row class='mt-xl'>
      <!-- <a-col :md='2'>
        <div style='line-height: 32px'>订单列表</div>
      </a-col> -->
      <!-- <a-col :md="2">
        <a-button  type='primary' >
          批量发货
        </a-button>
      </a-col> -->
      <!-- <a-col :md="2">
          <a-select style='width:120px' v-model="ScreeningOrder" placeholder="全部订单" @change='onstatus'  default-value="0">
            <a-select-option value="0">已发货</a-select-option>
            <a-select-option value="1">未发货</a-select-option>
          </a-select>
      </a-col> -->
    </a-row>
    <!-- //列表 -->
    <a-row class='mt'>
      <a-col :span="24">
      <a-table  :dataSource="data" :rowSelection="rowSelection" :pagination="false " rowKey="id">
          <a-table-column
            title="标题"
              dataIndex="title"
          >
          </a-table-column>
          <a-table-column
            title="sku"
              dataIndex="sku"
          >
          </a-table-column>
          <a-table-column
            title="订单金额"
              dataIndex="amount"
          >
          </a-table-column>
          <a-table-column
            title="收件人"
              dataIndex="buyer_name"
          >
          </a-table-column>
          <a-table-column
            title="订单编号"
              dataIndex="order_id"
          >
          </a-table-column>
          <a-table-column
            title="时间"
          >
          <template slot-scope="text, record">
            <p>购买时间  {{record.purchase_date}}</p>
            <p>更新时间  {{record.last_update_date}}</p>
          </template>
          </a-table-column>
          <a-table-column
            title="物流方式"
          >
           <template slot-scope="text, record">
              <div>
                {{record.logistics_channel}}
                <a-icon @click='logisticfrom(record.country_code,record.id)'  type="form" />
              </div>
              <p>{{record.freightMoney}}</p>
            </template>
          </a-table-column>
          <a-table-column
            title="运单号"
            dataIndex="waybillcode"
          >
          </a-table-column>
           <a-table-column
            title="状态"
              dataIndex="order_status"
          >
          </a-table-column>
          <a-table-column
            title="操作"
          >
            <template slot-scope="text, record">
              <span>
                <a-button type='primary'  style="margin-left:10px"  >发货</a-button>
                 <a-button type='primary' style="margin-left:10px;" @click='details(record.id)'>订单详情</a-button>
                <a-modal
                title="删除"
                :visible="visible"
                @ok="handleOk"
                :confirmLoading="confirmLoading"
                @cancel="handleCancel"
              >
                <p>{{ModalText}}</p>
              </a-modal>
              </span>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
    <a-row v-if='data' class='mt' type="flex" justify="end">
      <a-col>
         <a-pagination v-model="current" @change='pagechange' :pageSize='page.pageSize' :total='(page.pageSize*page.lastPage)' />
      </a-col>
    </a-row>
    <a-modal
      title="导出选项"
      :visible="modals"
      @ok="exportOk"
      :confirmLoading="modalsLoading"
      @cancel="EXCancel"
    >
      <a-form-item
        label="当前物流"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span >当前物流</span>
      </a-form-item>
      <a-form-item
        label="选择物流"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select defaultValue="顺丰" v-model='logistics' style="width:120px " >
          <a-select-option value="邮政">邮政</a-select-option>
          <a-select-option value="顺丰">顺丰</a-select-option>
        </a-select>
      </a-form-item>

    </a-modal>
  </a-card>
  </div>
</template>
<script>
import { oriOrderList ,groupUpdate , orderCheck ,getChannel ,setChannel} from '@/api/order'
export default {
  name:"history",
    computed: {
     rowSelection() {
        const { selectedRowKeys } = this;
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      }
    },
  data(){
    return{
      queryParam:{
        status:"0",
        logistics:"0",
        orderNumber:"",
      },
      queryStatus:"请输入订单号",
      ScreeningOrder:"0",
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      logistics:"邮政",
      modals:false,
      visible:false,
      ModalText:"确定要删除吗",
      modalsLoading:false,
      confirmLoading:false,
      listLoading:false,
      treeData:"",
      Selectvalue:"",
      orderid:"",
      data:"",
      page:"",
      current:1,
      selectAll:"",
      queryState:false,
    }
  },
  created(){},
  mounted(){
    this.getoriOrderList()
  },
  updated(){},
  destroyed(){},
  methods:{
    onstatus(){
      if(this.queryParam.status === '0'){
        this.queryStatus = '请输入订单号'
      }else if(this.queryParam.status === '1'){
        this.queryStatus = '请输入sku'
      }
    },
    // 获取订单列表
    getoriOrderList(){
      this.queryState = false;
      this.listLoading=true;
      oriOrderList({
        page:this.current,
        status:2,
        is_checked:1
      }).then(res =>{
        this.listLoading=false
        if(res.code === 0){
          // lll
          this.data = res.data
          this.page = res.pages
          console.log(res.pages,'666')
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
          this.listLoading=false
        }
      })
    },
    pagechange(page,pagesize){
      this.current = page;
      if(this.queryState === false){
        this.getoriOrderList()
      }else{
        this.queryOrderList(this.queryParam.status,this.queryParam.orderNumber)
      }
    },
     queryOrderList(mode,code){
      if(mode === '0'){
        this.info = {
          ids:code,
          page:this.current,
          status:2,
          is_checked:1
        }
      }else if(mode === '1'){
        this.info = {
          keywords:code,
          page:this.current,
          status:2,
          is_checked:1
        }
      }
      oriOrderList(this.info).then(res=>{
        if(res.code === 0){
          this.data = res.data
          this.page = res.pages
          this.queryState = true
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
    //进入详情页
    details(id){
      this.$router.push({
        path:"/order/fictitious/orderdetails",
        query:{
          id:id
        }
      })
    },
    //提交物流信息
    logisticfrom(){
      this.modals=true
    },
    exportOk(){
      this.modalsLoading = true;
      setTimeout(() => {
        this.modals = false;
        this.modalsLoading = false;
      }, 1000);
    },

    EXCancel(e) {
      this.modals = false
    },
    handleCancel(e) {
      this.visible = false
    },
    handleOk(){
      //删除的操作
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
  }
}
</script>
<style scoped lang='less'>
  .mt{margin-top: 20px;}
  .mr{margin-right: 20px;}
  .mt-xl{margin-top:40px;}
  .title-size{
    font-size:14px;
    color: #000;
  }
</style>


