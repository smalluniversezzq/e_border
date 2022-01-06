<template>
  <div class="logisticsCost">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="2" :sm="24">
              <a-button type="primary">添加模板</a-button>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label>
                <a-input v-model="logisticsName" placeholder="请输入物流名称" />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- //列表 -->
      <a-row class="mt">
        <a-col :span="24">
          <a-table
            v-if="!data.length <= 0"
            :dataSource="data"
            :rowSelection="rowSelection"
            rowKey="id"
          >
            <a-table-column title="优先级" data-index="priority"></a-table-column>
            <a-table-column title="规则名称" data-index="RuleName"></a-table-column>
            <a-table-column title="国家" data-index="country"></a-table-column>
            <a-table-column title="重量范围" data-index="weight"></a-table-column>
            <a-table-column title="首重/首重费用">
              <template slot-scope="text,record">
                <span>{{record.Ykg}}/{{record.YkgCost}}</span>
              </template>
            </a-table-column>
            <a-table-column title="续重单位重量/单价">
              <template slot-scope="text,record">
                <span>{{record.Continuousweight}}/{{record.Price}}</span>
              </template>
            </a-table-column>
            <a-table-column title="挂号费" data-index="register"></a-table-column>
            <a-table-column title="更新时间" data-index="updateTime"></a-table-column>
            <a-table-column title="操作">
              <template slot-scope="text, record">
                <span>
                  <a-button type="primary" @click="details(record.id)">编辑</a-button>
                  <a-button type="danger" style="margin-left:10px;" @click="orderdel(record.id)">删除</a-button>
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
      <a-modal
        title="导出选项"
        :visible="modals"
        @ok="exportOk"
        :confirmLoading="modalsLoading"
        @cancel="EXCancel"
      >
        <a-form-item label="当前物流" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span>当前物流</span>
        </a-form-item>
        <a-form-item label="选择物流" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select defaultValue="顺丰" v-model="logistics" style="width:120px ">
            <a-select-option value="邮政">邮政</a-select-option>
            <a-select-option value="顺丰">顺丰</a-select-option>
          </a-select>
        </a-form-item>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
const data = [
  {
    priority: '1',
    RuleName: '物流1',
    country: '叙利亚',
    weight: '1g-20g',
    Ykg: '1g',
    YkgCost: '$5',
    Continuousweight: '1g',
    Price: '￥1',
    register: '￥1',
    updateTime: '2019-6-24',
    openState: '0',
    id: '1'
  }
]
export default {
  name: 'logisticsCost',
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  data() {
    return {
      data,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      modals: false,
      visible: false,
      ModalText: '确定要删除吗',
      modalsLoading: false,
      confirmLoading: false,
      logistics: '',
      logisticsName: ''
    }
  },
  created() {},
  mounted() {},
  updated() {},
  destroyed() {},
  methods: {
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
    },
    details(id) {
      this.$router.push({
        path: '/logistics/logistics/details',
        query: {
          id: id
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


