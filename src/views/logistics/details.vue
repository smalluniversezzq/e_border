<template>
  <div class="orderdetails">
    <a-card :bordered="false">
      <a-form :form="form">
        <a-row>
          <a-col :span="4">
            <a-form-item label="模板名称" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input
                v-decorator="['templateName', { initialValue: data.templateName, rules: [{required: true, message: '模板名称不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(85% )' }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="选择国家" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-select
                v-decorator="['country', { initialValue: data.country, rules: [{required: true, message: '国家不能为空'}] }]"
                style="width:120px "
              >
                <a-select-option value="jnd">加拿大</a-select-option>
                <a-select-option value="mg">美国</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <span>计算方式：按首重续费计算</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            <span>计算规则</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            <a-form-item label="重量范围" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input
                v-decorator="['templateName', { initialValue: data.templateName, rules: [{required: true, message: '重量范围不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(85% )' }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="首重" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input
                v-decorator="['templateName', { initialValue: data.templateName, rules: [{required: true, message: '首重不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(85% )' }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="首重费用" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input
                v-decorator="['templateName', { initialValue: data.templateName, rules: [{required: true, message: '首重费用不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(85% )' }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="续重单位重量" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input
                v-decorator="['templateName', { initialValue: data.templateName, rules: [{required: true, message: '续重单位重量不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(85% )' }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="续重单价" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input
                v-decorator="['templateName', { initialValue: data.templateName, rules: [{required: true, message: '续重单价不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(85% )' }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="挂号费用" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input
                v-decorator="['templateName', { initialValue: data.templateName, rules: [{required: true, message: '挂号费用不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(85% )' }"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-row class="mt">
        <a-col>
          <a-form-item :wrapperCol="{span: 12, offset: 10}">
            <a-button style="margin-left:10px">取消</a-button>
            <a-button type="primary" style="margin-left:10px" @click="nextStep">保存</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
export default {
  name: 'orderdetails',
  data() {
    return {
      queryParam: {
        status: '0',
        logistics: '0',
        orderNumber: ''
      },
      addstatus: true,
      form: this.$form.createForm(this),
      queryStatus: '请输入订单号',
      ScreeningOrder: '0',
      modals: false,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      externalLogistics: 'externalLogistics',
      interiorLogistics: 'interiorLogistics',
      logisticscode: '',
      logisticsmoney: '60',
      ModalText: '确认删除吗',
      confirmLoading: false,
      visible: false,
      data: {
        Addressee: '李洛克',
        phone: '15003000300',
        mobile: '037168752365',
        country: '米国',
        province: '华盛顿',
        city: '罗克福',
        addressone: '666号',
        addresstow: '888号',
        zipcode: '920375'
      }
    }
  },
  created() {},
  mounted() {},
  updated() {},
  destroyed() {},
  methods: {
    nextStep(e) {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
      })
    },
    addtable(add, i) {},
    onstatus() {
      if (this.queryParam.status === '0') {
        this.queryStatus = '请输入订单号'
      } else if (this.queryParam.status === '1') {
        this.queryStatus = '请输入sku'
      }
    },
    // 删除订单
    orderdel() {
      this.visible = true
    },
    handleOk() {
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 1000)
    },
    handleCancel(e) {
      this.visible = false
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