<template>
  <div class="history">
    <!-- <a-card :bordered="false" title='筛选条件'>
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
    </a-card> -->
    <a-card title='订单列表' class='mt'>
    <a-row>
      <a-col span="12">
        <a-button-group>
          <a-button >全部</a-button>
          <a-button >上传中</a-button>
          <a-button>上传成功</a-button>
          <a-button>上传失败</a-button>
        </a-button-group>
      </a-col>
      <a-col :span='12'>
      <a-row type='flex' justify="end">
          <a-col >
            <a-select  class='ml' placeholder='请选择国家'  style="width:180px " @change="classchange">
              <a-select-option :value="index"  v-for='(item,index) in codeORcountry' :key="index">{{item}}</a-select-option>
            </a-select>
          </a-col>
          <a-col>
            <a-button class='ml' type='primary' @click='UploadTO'>一键上传</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- //列表 -->
    <a-row class='mt'>
      <a-col :span="24">
      <a-table :dataSource="dataRecord" :rowSelection="rowSelection" :pagination="false " rowKey="id">
        <a-table-column
          title="id"
          dataIndex="goods_id"
        >
        </a-table-column>
          <a-table-column
            title="图片"
          >
            <template slot-scope="text, record">
              <span>
                <img style='width:60px;' :src="record.image" alt="">
              </span>
            </template>
            </a-table-column>
          <a-table-column
            title="标题"
            dataIndex="title"
            width='400px'
          >
          </a-table-column>
          <a-table-column
            title="sku"
            dataIndex="sku"
          >
          </a-table-column>
           <a-table-column
            title="价格"
            dataIndex="price"
          >
            <template  slot-scope="text, record">
              <span>{{record.price | priceTlt}}</span>
            </template>
          </a-table-column>
          <a-table-column
            title="店铺"
            dataIndex="store_name"
          >
          </a-table-column>
          <a-table-column
            title="国家"
            dataIndex="buyer_name"
          >
          <template slot-scope="text, record">
            <span  v-for='(item,index) in codeORcountry' :key='item' v-if='record.country == index'>{{record.country==index ? item:""}}</span>
          </template>
          </a-table-column>
          <a-table-column
            title="状态"
            dataIndex="status"
          >
          <template slot-scope="text, record">
            <div v-if='record.status === "1"'>上传中</div>
            <div v-if='record.status === "2"'>上传成功</div>
            <div v-if='record.status === "3"'>上传失败 
            <!-- <a-popover title="失败原因">
                <template slot="content">
                  <p v-if='record.status1 === "1"'>{{record.status1}}</p>
            
                </template>
                <a-icon type="question-circle"/>
            </a-popover> -->
            </div>
          </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
    <a-row v-if='data' class='mt' type="flex" justify="end">
      <a-col>
         <a-pagination v-model="currentRE" @change='pagechange' :pageSize='page.pageSize' :total='(page.pageSize*page.lastPage)' />
      </a-col>
    </a-row>
  </a-card>
  </div>
</template>
<script>
import { uploadResult } from '@/api/collect'
import { codeORcountry } from '@/views/order/public/country'
export default {
  name:"collecthistory",
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
      codeORcountry,
      dataRecord:"",
      pageRecord:"",
      currentRE:1,
      selectAll:"",
      queryState:false,
    }
  },
  created(){},
  mounted(){
    this.getuploadResult()
  },
  updated(){},
  destroyed(){},
  methods:{
    // 获取订单列表
    getuploadResult(){
      uploadResult({
        page:this.currentRE,
        country:""
      }).then(res =>{
        if(res.code === 0){
          // lll
          this.dataRecord = res.data
          this.pageRecord = res.pages
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
    pagechange(page,pagesize){
      this.current = page;
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


