<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="关键词">
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="起止日期"
              :labelCol="{lg: {span: 7}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
              <a-range-picker
                name="buildTime"
                style="width: 100%"
                v-decorator="[
                  'buildTime',
                  {rules: [{ required: true, message: '请选择起止日期' }]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item
              label="类型"
              :labelCol="{lg: {span: 7}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
              :required="false"
            >
               <!-- help="客户、邀评人默认被分享" -->
              <a-radio-group v-model="value">
                <a-checkbox :value="1">主账号</a-checkbox>
                <a-checkbox :value="2">子账号</a-checkbox>
              </a-radio-group>
            </a-form-item> 
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
          </a-row>
      </a-form>
    </div>
    <a-table v-if='data' :dataSource="data" rowKey="id">
          <a-table-column
            title="id"
            dataIndex="uid"
          />
          <a-table-column
            title="用户名"
            dataIndex="username"
          />
          <a-table-column
            title="手机号"
            dataIndex="mobile"
          />
         <!-- <a-table-column
            title="详细地址"
            dataIndex="title"
          /> -->
          <!-- <a-table-column
            title="注册时间"
            dataIndex="title"
          /> -->
          <a-table-column
            title="账户状态"
          >
            <template slot-scope="text, record">
              <span>
                {{record.status == '1' ? '正常':'关闭'}}
              </span>
            </template>
          </a-table-column>

          <a-table-column
            title="操作"
          >
            <template slot-scope="text, record">
              <span>
                <a v-if="false" href="javascript:;">Action 一 {{record.firstName}}</a>
                <a  @click='childdel(record.uid)'>Delete</a>
              </span>
            </template>
          </a-table-column>
        </a-table>
  </a-card>
</template>

<script>
import { getchildlist ,childdel} from '@/api/manage'
import RoleModal from './modules/RoleModal'
export default {
  name: 'TableList',
  components: {
    RoleModal
  },
  data () {
    return {
      visible: false,
      data:"",
      form: null,
      mdl: {},
      value:1,
    }
  },
  mounted:function(){
    this.childlist()
  },
  methods: {
    childlist () {
      getchildlist().then(res => {
        if(res.code === 0){
          // this.data = res.data
          console.log(res.data,"getchildlist")
        }
      })
    },
    childdel(id){
      this.data.forEach((item,index) =>{
        if(item.id == id){
          this.data.splice(index,1)
        }
      })
      childdel(
        {
          id:id
        }
      ).then(res => {
        if(res.code === 0){
        }
      })
    },

  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
