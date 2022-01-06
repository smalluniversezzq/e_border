<template>
  <a-card
    :body-style="{padding: '24px 32px'}"
    :bordered="false"
  >
    <a-form
      @submit="handleSubmit"
      :form="form"
    >
      <a-form-item
        label="角色名称"
        :labelCol="{ md: {span:7}, lg: {span: 9}, xl: {span: 8} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:14}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }"
      >
        <a-input
          rows="4"
          placeholder="请填写角色名称"
          v-model='jsnames'
          v-decorator="[
            'description',
            {rules: [{ required: true, message: '请填写角色名称' }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="状态"
        :labelCol="{ md: {span:7}, lg: {span: 9}, xl: {span: 8} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:14}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }"
      >
        <a-select v-model="state">
          <a-select-option :value="1">正常</a-select-option>
          <a-select-option :value="0">禁用</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="拥有权限"
        :labelCol="{ md: {span:7}, lg: {span: 9}, xl: {span: 8} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:14}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }"
      >
        <a-checkbox-group @change="onChange">
          <!-- <a-checkbox
              class='mt-sm'
              @change="onCheckAllChange"
              :checked="checkAll"
              value='all'
            >
              全选
            </a-checkbox> -->
          <a-row
            type='flex'
            align='middle '
            v-for="(item, index) in treedata"
            :key="index"
          >
            <a-col>
              <a-checkbox :value="item.id">{{item.title}}</a-checkbox>
              <a-checkbox
                :disabled='showvalue[index] ==="false" ? false:true'
                :checked='checked '
                :value="i.id"
                v-for='(i,v) in item.children'
                :Key="v"
              >{{i.title}}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-row
          type="flex"
          justify="center"
        >
          <a-col
            :md="{span: 14, offset: 4}"
            :lg="{span: 11, offset: 5}"
            :xl="{span: 10, offset: 2}"
            :xxl="{span: 8, offset: 0}"
          >
            <a-button
              htmlType="submit"
              type="primary"
              style="width:100%"
            >提交</a-button>
          </a-col>
        </a-row>
        <!-- <a-button style="margin-left: 8px">保存</a-button> -->
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
const plainOptions = [
  '1',
  '13',
  '14',
  '15',
  '16',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '8',
  '12',
  '11',
  '9',
  '10',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7'
]
import { getRoleList, getPermissions, getMenu, groupUpdate } from '@/api/manage'
export default {
  name: 'addrole',
  data() {
    return {
      value: 1,
      form: this.$form.createForm(this),
      state: 1,
      permissiones: '',
      checkedValues: '',
      jsnames: '',
      names: '',
      permissionId: '',
      treedata: [],
      showvalue: '',
      checked: true,
      selectedRowKeys: [],
      plainOptions,
      checkAll: false
    }
  },
  created() {
    this.loadPermissions()
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
      let str = ''
      for (var i = 0; i < this.checkedValues.length; i++) {
        console.log(this.checkedValues[i])
        str += this.checkedValues[i] + ','
      }
      this.permissionId = str.slice(0, -1)
      // console.log(this.state,"state",this.permissionId,"checkedValues",this.jsnames,"jsnames",this.names,"names")
      groupUpdate({
        title: this.jsnames,
        rules: this.permissionId,
        status: this.state
      }).then(res => {
        if (res.code === 0) {
          this.$router.push({
            path: '/power/userlist'
          })
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    onCheckAllChange(e) {
      console.log(e)
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        checkAll: e.target.checked
      })
    },
    onChange(checkedValues, selectedRowKeys) {
      this.showvalue = []
      console.log('checked = ', checkedValues)
      this.checkedValues = checkedValues
      this.treedata.forEach((item, index) => {
        this.checkedValues.forEach((it, inx) => {
          if (item.id == it) {
            this.showvalue[index] = 'false'
            console.log(this.showvalue[index])
          }
        })
      })
      console.log(this.treedata)
    },
    loadPermissions() {
      getMenu().then(res => {
        if (res.code === 0) {
          // res.data.shift()
          this.treedata = res.data
          console.log(res.data, 'addrole')
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.mt-sm {
  margin-top: 10px;
}
.ant-checkbox-wrapper-disabled {
  margin-right: 8px !important;
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0px;
}
</style>
