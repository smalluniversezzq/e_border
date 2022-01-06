<template>
  <div class="logisticsList">
    <a-card :bordered="false" >
      <a-row class="mt">
        <a-col :span="24">
          <a-table :scroll="{ x: 1500 }" v-if="!data.length <= 0" :dataSource="data">
            <a-table-column title="收件人" data-index="logisticsname"></a-table-column>
            <a-table-column title="仓库地点" data-index="site"></a-table-column>
            <a-table-column title="联系人" data-index="liaison"></a-table-column>
            <a-table-column title="联系方式" data-index="mobile"></a-table-column>
            <a-table-column title="邮编" data-index="zipCode"></a-table-column>
            <a-table-column title="详细地址" data-index="address"></a-table-column>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import { permsBtn } from '@/utils/static'
import { getWarehouse } from '@/api/order'
export default {
  name: 'logisticsList',
  computed: {},
  data() {
    return {
      permsBtn,
      data:"",
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      modals: false,
      visible: false,
      ModalText: '确定要删除吗',
      modalsLoading: false,
      confirmLoading: false
    }
  },
  created() {},
  mounted() {
    this.getWarehouseFn()
  },
  updated() {},
  destroyed() {},
  methods: {
    //获取物流列表
    getWarehouseFn(){
      getWarehouse({}).then((res)=>{
        if(res.code === 0){
          this.data = res.data
        }
      })
    },
    //提交物流信息
    logisticfrom() {
      this.modals = true
    },
    exportOk() {
      this.modalsLoading = true
      setTimeout(() => {
        this.modals = false
        this.modalsLoading = false
      }, 1000)
    },
    EXCancel(e) {
      this.modals = false
    },
    handleCancel(e) {
      this.visible = false
    },
    handleOk() {
      //删除的操作
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 1000)
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


