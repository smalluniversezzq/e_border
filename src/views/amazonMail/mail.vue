<template>
  <div>
    <a-card>
      <a-row>
        <a-col span="24" class="tal mt dis-flex flex-wrap">
          <a-button @click="bindMail()" class="mr-sm">添加邮箱</a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-modal
      title="添加邮箱"
      :maskClosable="false"
      :visible="showBind"
      @ok="addOk"
      :confirmLoading="bindLoading"
      @cancel="cancel"
      width="850px"
    >
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="店铺">
          <a-select
            class="mr-sm"
            :allowClear="true"
            placeholder="请选择店铺"
            @change="shopChange"
            v-decorator="['mail.store_id', { rules: [ { required: true, message: '请选择店铺'} ]} ]"
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in storeSelect"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="国家">
          <a-select
            class="mr-sm"
            mode="multiple"
            :allowClear="true"
            placeholder="请选择国家"
            @change="countryListChange"
            v-decorator="['mail.country', { rules: [ { required: true, message: '请选择国家'} ]} ]"
          >
            <a-select-option
              :value="item.code"
              v-for="(item,index) in siteListSelect"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱类型">
          <a-select
            class="mr-sm"
            :allowClear="true"
            placeholder="邮箱类型"
            @change="mailTypeChange"
            v-decorator="['mail.type', { rules: [ { required: true, message: '请选择邮箱类型'} ]} ]"
          >
            <a-select-option
              :value="item.code"
              v-for="(item,index) in mailType"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱">
          <a-input
            v-decorator="['mail.mail', { rules: [ { required: true, message: '请输入邮箱地址'} ]} ]"
            class="mr-sm"
            placeholder="请输入邮箱地址"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="邮箱授权密码">
          <a-input
            v-decorator="['mail.password', { rules: [ { required: true, message: '请输入邮箱邮箱授权密码'} ]} ]"
            class="mr-sm"
            placeholder="邮箱授权密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>


<script>
import { getMyStore } from '@/api/collect'
export default {
  name: 'amazonMail',
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      bindLoading: false,
      showBind: false,
      mail: {},
      selectedRowKeys: [],
      mailType: [
        { code: 'qq', title: 'qq邮箱' },
        { code: '126', title: '126邮箱' },
        { code: '163', title: '163邮箱' },
        { code: 'yeah', title: 'yeah邮箱' },
        { code: 'sina', title: '新浪邮箱' },
      ],
      siteListSelect: [],
      storeSelect: [],
    }
  },
  methods: {
    // 绑定邮箱
    bindMail() {
      this.showBind = true
    },
    mailTypeChange(value) {
      this.mail.type = value
    },
    addOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          
        }
      })
    },
    cancel() {
      this.showBind = false
      this.bindLoading = false
    },
    // 店铺
    shopChange(val) {
      if (this.mail.country) {
        this.mail.country = ''
      }
      this.storeSelect.forEach((item, index) => {
        if (val === item.id) {
          this.siteListSelect = item.mws_site
        }
      })
    },
    countryListChange(value) {
      this.mail.country = value
    },
    // 获取店铺信息
    getMyStoreFn() {
      getMyStore().then((res) => {
        if (res.code === 0) {
          this.storeSelect = res.data
        }
      })
    },
  },
  created() {
    this.getMyStoreFn()
  },
}
</script>