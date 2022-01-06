<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="toaddrole">新建</a-button>
    </div>
    <a-table v-if='data' :dataSource="data">
        <a-table-column
          title="id"
          dataIndex="id"
        />
        <a-table-column
          title="组名"
          dataIndex="title"
        />
        <a-table-column
          title="状态"
        >
          <template slot-scope="text, record">
            <span>
              {{record.status == '1' ? '开启':'关闭'}}
            </span>
          </template>
        </a-table-column>

        <a-table-column
          title="操作"
        >
          <template slot-scope="text, record">
            <span>
              <a v-if="false" href="javascript:;">Action 一 {{record.firstName}}</a>
              <a  @click='roledel(record.id)'>Delete</a>
            </span>
          </template>
        </a-table-column>
      </a-table>
  </a-card>
</template>

<script>
// import { STable } from '@/components'
import { getgroup ,groupdel} from '@/api/manage'
export default {
  name: 'role',
  components: {
    // STable
  },
  data () {
    return {
      group:"",
      data:'',
    }
  },
  mounted:function(){
    // console.log("执行了")
    this.getgroups()
  },
  methods: {
    getgroups () {
      getgroup().then(res => {
        if(res.code === 0){
          this.data = res.data
          console.log(res.data,"getgroup")
        }
      })
    },
    roledel(id){
      this.data.forEach((item,index) =>{
        if(item.id == id){
           this.data.splice(index,1)
        }
      })
      groupdel(
        {
          id:id
        }
      ).then(res => {
        if(res.code === 0){
        }
      })
    },
    toaddrole(){
      this.$router.push({
        path:'/power/addrole'
      })
    }
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

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }

  .fold {
    width: calc(100% - 216px);
    display: inline-block
  }

  .operator {
    margin-bottom: 18px;
  }

  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
