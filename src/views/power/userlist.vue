<template>
  <a-card :bordered="false">
    <a-button
      v-if='hasPerm(permsBtn.role_getNumber)'
      style="margin-bottom: 20px"
      type='primary'
      @click='toEmpower'
    >
      添加角色
    </a-button>
    <a-table
      :scroll="{ x: 1100 }"
      :loading="listLoading"
      v-if='!data.length <= 0'
      :dataSource="data"
      rowKey="id"
    >
      <a-table-column
        title="id"
        dataIndex="id"
      />
      <a-table-column
        title="角色名"
        dataIndex="title"
      />
      <a-table-column
        title="权限"
        dataIndex="permission"
        :width='350'
      >
        <template slot-scope="text, record">
          <span
            v-for='(item,index) in record.rules'
            :key='index'
          >
            {{item.title}}
          </span>
        </template>
      </a-table-column>
      <a-table-column title="角色状态">
        <template slot-scope="text, record">
          <span>
            {{record.status == '1' ? '开启':'关闭'}}
          </span>
        </template>
      </a-table-column>
      <a-table-column title="操作">
        <template slot-scope="text, record">
          <span>
            <!-- <a v-if="false" href="javascript:;">Action 一 {{record.firstName}}</a> -->
            <a-button @click='upuser(record.id,record.title,record.status)' :disabled='!hasPerm(permsBtn.role_editLogistics)'  >修改</a-button>
            <a-button
              style='margin-left:20px'
              @click='roledel(record.id)'
              type='danger'
            >删除</a-button>

          </span>
        </template>
      </a-table-column>
    </a-table>
    <a-modal
      title="删除"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCanceldel"
    >
      <p>{{ModalText}}</p>
    </a-modal>
  </a-card>
</template>

<script>
import { getgroup, groupdel } from '@/api/manage'
import { permsBtn } from '@/utils/static'
export default {
  // 角色列表
  name: 'userlist',
  components: {},
  data() {
    return {
      permsBtn,
      listLoading: false,
      group: '',
      data: '',
      permission: '',
      visible: false,
      confirmLoading: false,
      delid: '',
      ModalText: '确定要删除吗',
      selectAll: '',
      selectkey: '',
      ids: ''
      //
      // visible: false,
      // data:"",
      // form: null,
      // mdl: {},
      // value:1,
    }
  },
  mounted: function() {
    this.getgroups()
  },
  methods: {
    toEmpower() {
      this.$router.push({
        name: 'addrole'
      })
    },
    getgroups() {
      this.listLoading = true
      getgroup().then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.data = res.data
          // console.log(res.data, 'getgroup')
          // this.$notification.success({
          //   message:'成功',
          //   description: res.msg,
          // });
        } else {
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    // roledelAll(){
    //   if(this.selectAll.length > 0){
    //     this.visible = true
    //     this.delAll = true
    //   }else{
    //     this.$notification.error({
    //       message: '错误',
    //       description: '请先勾选删除的选项',
    //     });
    //   }
    // },
    roledel(id) {
      this.visible = true
      this.delid = id
    },
    upuser(id, title, status) {
      // console.log(id, title, status)
      this.$router.push({
        path: '/power/upuser',
        query: {
          id: id,
          title: title,
          status: status
        }
      })
    },
    del() {
      //删除
      this.data.forEach((item, index) => {
        if (item.id == this.delid) {
          this.data.splice(index, 1)
        }
      })
      groupdel({
        id: this.delid
      }).then(res => {
        if (res.code === 0) {
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.getgroups()
        } else {
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
          this.getgroups()
        }
      })
    },
    toaddrole() {
      this.$router.push({
        path: '/power/addrole'
      })
    },
    handleOk(e) {
      this.del()
      this.confirmLoading = true
      this.visible = false
      this.confirmLoading = false
      this.ModalText = '确定要删除吗'
    },
    handleCanceldel(e) {
      this.visible = false
    }
  },
  watch: {}
}
</script>
<style scoped>
.ml {
  margin-left: 20px;
}
</style>

