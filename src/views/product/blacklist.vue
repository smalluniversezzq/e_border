<template>
  <div class="blacklist">
    <a-card>
      <a-row class="mb">
        <a-col>
          <a-alert
            message=" 品牌词黑名单说明："
            description="用户自主添加品牌词，用于采集批量采集或者单品采集时自动过滤标题带品牌词的商品，降低用户品牌侵权的情况发生，您不想采集的品牌和关键词都可以添加到黑名单里，系统会自动帮您过滤您不想要的产品。"
            type="warning"
          />
        </a-col>
      </a-row>
      <a-row class='mb' type="flex" justify="start">
        <a-radio-group v-model="currentStatus" @change="statusChange">
          <a-radio :value='3'>全部</a-radio>
          <a-radio :value="1">开启检测</a-radio>
          <a-radio :value="0">未开启检测</a-radio>
        </a-radio-group>
      </a-row>
      <a-row class='mb'>
        <a-col :span="12">
          <a-button type="primary" @click='enableBlack()'>批量开启检测</a-button>
          <a-button type="primary"  style="margin-left:10px;" @click='disenableBlack()'>批量关闭检测</a-button>
        </a-col>
        <a-col :span="12" style="text-align:right">
          <a-button type="primary" v-if='hasPerm(permsBtn.blacklist_addWord)' @click='addBrandWQrds'>添加关键词</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-table
            :columns="columns"
            :scroll="{ x: 1000 }"
            :pagination="false"
            :dataSource="data"
            :rowSelection="rowSelection"
            :loading="listLoading"
            rowKey="id">

              <span slot="titleStatus">
                违禁词检测
                <a-tooltip placement="right">
                  <template slot="title">
                    <p>开启违禁词检测后，可在亚马逊待发布列表中检测商品是否包含违禁词</p>
                  </template>
                  <a-icon type="question-circle" />
                </a-tooltip>
              </span>

              <template slot="id" slot-scope="text, record">
                <span>{{record.id}}</span>
              </template>

              <template slot="black" slot-scope="text, record">
                <span>{{record.black}}</span>
              </template>

              <template slot="created_at" slot-scope="text, record">
                <span>{{record.created_at}}</span>
              </template>

              <template slot="status" slot-scope="text, record">
                <a-switch checked-children="启用" un-checked-children="禁用" v-model="record.status=='1' ? true : false" @change="onChange(record)"/>
              </template>

              <template slot="action" slot-scope="text, record">
                <span>
                  <a-row>
                    <a-col :md="7" :lg="9" :xl="8" :xxl="4">
                      <a-button :disabled='!hasPerm(permsBtn.blacklist_edit)' type="primary" @click='Edits(record.id,record.black)'>编辑</a-button>
                    </a-col>
                    <a-col :md="7" :lg="9" :xl="8" :xxl="4">
                      <a-button :disabled='!hasPerm(permsBtn.blacklist_del)' type="danger" style="margin-left:10px;" @click='delword(record.id)'>删除</a-button>
                    </a-col>
                  </a-row>
                </span>
              </template>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
    <a-modal
      title="添加品牌词"
      :visible="showWord"
      @ok="WordOk"
      :confirmLoading="WordLoading"
      @cancel="WordCancel"
    >
    <a-textarea v-model='BrandWords' placeholder="请输入品牌词及关键词,输入多个请点Enter键，每行一个" :rows="8"/>
    </a-modal>
    <a-modal
      title="删除"
      :visible="showdelword"
      @ok="delOk"
      :confirmLoading="delLoading"
      @cancel="delCancel"
    >
    <p>确认删除吗</p>
    </a-modal>
  </div>
</template>
<script>
import {getBlacklist , addBlacklist ,updateblacklist ,delBlacklist, updateBlackStatus} from '@/api/collect'
import { permsBtn } from '@/utils/static'
export default {
  name:"blacklist",
  data(){
    return{
      permsBtn,
      data: [],
      showWord:false,
      WordLoading:false,
      showdelword:false,
      delLoading:false,
      listLoading: false,
      BrandWords:"",
      subId:"",
      wordType:"",
      delID:"",

      columns:[
        {
          title: '序号',
          key: 'id',
          scopedSlots: { customRender: 'id' },
          align:'center'
        },
        {
          title: '品牌词',
          key: 'black',
          scopedSlots: { customRender: 'black' },
          align:'center'
        },
        {
          title: '创建时间',
          scopedSlots: { customRender: 'created_at' },
          key: 'created_at',
          align:'center'
        },
        {
          slots: { title: 'titleStatus' },
          scopedSlots: { customRender: 'status' },
          key: 'status',
          align:'center'
        },
        {
          title: '操作',
          key: 'action',
          // align:'center',
          scopedSlots: { customRender: 'action' }
        }
      ],

      selectAll: [],
      selectkey: [],
      selectedRowKeys: [],

      currentStatus: 3
    }
  },
  methods:{
    getBlacklists(){
      this.data = []
      this.listLoading = true
      getBlacklist({
        status: this.currentStatus
      }).then(res=>{
        if(res.code === 0){
          this.listLoading = false
          if(res.data.length){
            this.data = res.data;
          }else{
            this.data = [];
          }
        }
      })
    },
    updateBlackStatus(id) {
      updateBlackStatus({
        ids: id
      }).then(res=>{
        this.getBlacklists()
        this.$notification.success({
          message: '成功',
          description: res.msg,
        });
      })
    },
    addBrandWQrds(){
      this.showWord = true;
      this.BrandWords = ''
      this.wordType = "1"
    },
    // 新增
    subBrandWords(){
      let reg = /\n/g
      let wordsAll = this.BrandWords.replace(reg,",")
      addBlacklist({
        black:wordsAll,
      }).then(res=>{
        if(res.code === 0){
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          this.getBlacklists()
          setTimeout(() => {
            this.showWord = false;
            this.WordLoading = false;
          }, 800);
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
          setTimeout(() => {
            this.showWord = false;
            this.WordLoading = false;
          }, 800);
        }
      })

    },
    //更新
    updataBrandWords(){
      let reg = /\n/g
      let wordsAll = this.BrandWords.replace(reg,",")
      updateblacklist({
        id:this.subId,
        black:wordsAll,
      }).then(res=>{
        if(res.code === 0){
          this.getBlacklists()
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          setTimeout(() => {
            this.showWord = false;
            this.WordLoading = false;
          }, 800);
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
          setTimeout(() => {
            this.showWord = false;
            this.WordLoading = false;
          }, 800);
        }
      })
      setTimeout(() => {
        this.showWord = false;
        this.WordLoading = false;
      }, 800);
    },
    WordOk(){
      this.WordLoading = true;
      //  需要做个判断  是第一次编辑 还是 修改
      if(this.wordType === '1'){
        //新增
        this.subBrandWords()
      }else if(this.wordType === '2'){
        this.updataBrandWords()
        //编辑
      }
    },
    WordCancel(e) {
      this.showWord = false
    },
    delword(id){
      this.showdelword = true;
      this.delId = id
    },
    delOk(){
      this.delLoading = true;
      // 执行删除的操作
      this.delBlacklists()
      setTimeout(() => {
        this.showdelword = false;
        this.delLoading = false;
      }, 800);
    },
    delCancel(e) {
      this.showdelword = false
    },
    delBlacklists(){
      delBlacklist({
        id:this.delId
      }).then(res=>{
        if(res.code === 0){
          this.getBlacklists()
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          }); 
        }
      })
    },
    // 编辑
    Edits(id, words){
      //var wordstr = words.join(`\n`);
      this.BrandWords = words
      this.subId = id;
      this.wordType = "2"
      this.showWord = true;
    },
    onChange(record) {
      this.updateBlackStatus(record.id)
    },
    enableBlack() {
      if (this.selectkey.length == 0) {
        this.$notification.error({
          message: '错误',
          description: '请选择违禁词',
        });
        return;
      }
      updateBlackStatus({
        ids: this.selectkey,
        status: 1
      }).then(res=>{
        this.getBlacklists()
        this.$notification.success({
          message: '成功',
          description: res.msg,
        });
      })
    },
    disenableBlack() {
      if (this.selectkey.length == 0) {
        this.$notification.error({
          message: '错误',
          description: '请选择违禁词',
        });
        return;
      }
      updateBlackStatus({
        ids: this.selectkey,
        status: 0
      }).then(res=>{
        this.getBlacklists()
        this.$notification.success({
          message: '成功',
          description: res.msg,
        });
      })
    },
    statusChange(e) {
      this.currentStatus = e.target.value
      this.getBlacklists()
    }
  },
  created(){},
  mounted(){
    this.getBlacklists()
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectAll = selectedRows
          this.selectkey = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            name: record.name
          }
        })
      }
    },
  },
  updated(){},
  destroyed(){
  },
}
</script>

