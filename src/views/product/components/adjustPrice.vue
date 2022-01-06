<template>
  <div class='adjust-price'>
    <a-row class="mb">
      <a-col class='tal'>
        <a-button @click='addPriceRlue' type='primary'>添加规则</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <a-table
          :pagination="false"
          :dataSource="data"
          :loading = "listLoading"
          rowKey="id">
          <a-table-column
            title="规则名称"
            dataIndex="name">
          </a-table-column>
          <a-table-column
            title="规则描述"
            dataIndex="remark">
          </a-table-column>
          <a-table-column
            title="包含产品">
            <template slot-scope='text,record'>
              <span>{{record.productCount}}个</span>
            </template>
          </a-table-column>
          <a-table-column
            title="状态">
            <template slot-scope='text,record'>
              <a-switch checked-children="启用" un-checked-children="禁用" 
                v-model="record.status=='1'?true:false" @change="(val)=>onChange(val,record)"/>
            </template>
          </a-table-column>
          <a-table-column
            title="操作">
            <template slot-scope="text, record">
              <a class='mr-sm mr' @click="() => Edits(record.id)">设置</a>
              <a @click='del(record.id)'>删除</a>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
    <a-row>
      <a-col class='tar mt'>
        <a-pagination
          :pageSizeOptions="pageSizeOptionManage"
          v-model='current'
          showSizeChanger
          @showSizeChange="onShowSizeChange"
          :pageSize.sync="page.pageSize"
          @change='pagechange'
          :total='(page.pageSize*page.lastPage)' />
      </a-col>
    </a-row>
    <a-modal
      title="添加规则"
      :width="1000"
      :visible="ruleVisible"
      :confirmLoading="btnLoading"
      @ok="ruleOk"
      @cancel="ruleCancel">
      <a-form :form="form">
        <a-row style="display: flex;">
          <a-col :span="4" style="text-align: right;margin-top:10px">
            <span style="color:red">*</span>
            规则名称：
          </a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input style="width: 300px" v-model="editPrice1" placeholder="" 
                v-decorator="['editPrice1', { initialValue:editPrice1,rules: [{ required: true, message: '不能为空' }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="mb">
          <a-col :span="4" style="text-align: right;">
            规则描述：
          </a-col>
          <a-col :span="20">
            <a-textarea style="width: 300px" v-model="editPrice2" placeholder="" :rows="4" />
          </a-col>
        </a-row>
        <a-row class="mb">
          <a-col :span="4" style="text-align: right;margin-top:5px">
            竞争对手设置：
          </a-col>
          <a-col :span="20">
            <a-row class="mb">
              <a-col style="display: flex;align-items: center;">
                当有多个竞争对手时，与竞争对手价格中
                <a-select style="width: 128px;margin:0 5px" v-model="select4">
                  <a-select-option value="1">
                    最高价者
                  </a-select-option>
                  <a-select-option value="2">
                    最低价格者
                  </a-select-option>
                </a-select>
                竞争
              </a-col>
            </a-row>
            <a-row>
              <a-col style="display: flex;align-items: center;">
                当，无竞争对手时
                <a-select style="width: 128px;margin-left:5px" v-model="select5">
                  <a-select-option value="1">
                    使用原始价格
                  </a-select-option>
                  <a-select-option value="2">
                    不进行调价
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4" style="text-align: right;margin-top:5px">
            调价设置：
          </a-col>
          <a-col :span="20">
            <a-row :class="setObj[0].select1!='4'?'mb':''">
              <a-col :span="14" style="display: flex;align-items: center;width:54.5%">
                当，竞争对手价格≤我的最低价格
                <a-select class="ml" style="width: 160px;margin-left:5px" 
                  v-model="setObj[0].select1" @change="(val)=>priceChange(val,0)">
                  <a-select-option value="1">
                    使用最低价格
                  </a-select-option>
                  <a-select-option value="2">
                    使用最高价格
                  </a-select-option>
                  <a-select-option value="3">
                    不进行调价
                  </a-select-option>
                  <a-select-option value="4">
                    使用竞争对手价格
                  </a-select-option>
                </a-select>
                <a-select class="ml" style="width: 55px;margin-left:5px" 
                  v-model="setObj[0].select2" v-if="setObj[0].status">
                  <a-select-option value="1">
                    +
                  </a-select-option>
                  <a-select-option value="2">
                    -
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6" style="width:14%;margin-top:-4px">
                <a-form-item>
                  <a-input type="number" style="width: 100px;margin:0 5px;" v-model="setObj[0].num" placeholder="" v-if="setObj[0].status" 
                    v-decorator="['num', { initialValue:setObj[0].num,rules: [{ required: true, message: '不能为空' }] }]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :class="setObj[1].select1!='4'?'mb':''">
              <a-col :span="16" style="display: flex;align-items: center;width:62.6%">
                当，我的最低价&lt;竞争对手价格≤我的最高价
                <a-select style="width: 160px;margin-left:5px" 
                  v-model="setObj[1].select1" @change="(val)=>priceChange(val,1)">
                  <a-select-option value="1">
                    使用最低价格
                  </a-select-option>
                  <a-select-option value="2">
                    使用最高价格
                  </a-select-option>
                  <a-select-option value="3">
                    不进行调价
                  </a-select-option>
                  <a-select-option value="4">
                    使用竞争对手价格
                  </a-select-option>
                </a-select>
                <a-select class="ml" style="width: 55px;margin-left:5px" 
                  v-model="setObj[1].select2" v-if="setObj[1].status">
                  <a-select-option value="1">
                    +
                  </a-select-option>
                  <a-select-option value="2">
                    -
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="4" style="width:14%;margin-top:-4px">
                <a-form-item>
                  <a-input type="number" style="width: 100px;margin:0 5px;" v-model="setObj[1].num" placeholder="" v-if="setObj[1].status" 
                    v-decorator="['num1', { initialValue:setObj[1].num,rules: [{ required: true, message: '不能为空' }] }]"/>
                </a-form-item>
              </a-col>
              <a-col :span="4" style="width:19%">
                <span v-if="setObj[1].status">且</span>
                <a-select class="ml" style="width: 128px;margin-left:5px" 
                  v-model="setObj[1].select3" v-if="setObj[1].status">
                  <a-select-option value="1">
                    无最低价限制
                  </a-select-option>
                  <a-select-option value="2">
                    不低于最低价
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row :class="setObj[2].select1!='4'?'mb':''">
              <a-col :span="14" style="display: flex;align-items: center;width:52.7%">
                当，我的最高价&lt;竞争对手价格
                <a-select style="width: 160px;margin-left:5px" 
                  v-model="setObj[2].select1" @change="(val)=>priceChange(val,2)">
                  <a-select-option value="1">
                    使用最低价格
                  </a-select-option>
                  <a-select-option value="2">
                    使用最高价格
                  </a-select-option>
                  <a-select-option value="3">
                    不进行调价
                  </a-select-option>
                  <a-select-option value="4">
                    使用竞争对手价格
                  </a-select-option>
                </a-select>
                <a-select class="ml" style="width: 55px;margin-left:5px" 
                  v-model="setObj[2].select2" v-if="setObj[2].status">
                  <a-select-option value="1">
                    +
                  </a-select-option>
                  <a-select-option value="2">
                    -
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6" style="width:14%;margin-top:-4px">
                <a-form-item>
                  <a-input type="number" style="width: 100px;margin:0 5px;" v-model="setObj[2].num" placeholder="" v-if="setObj[2].status" 
                    v-decorator="['num2', { initialValue:setObj[2].num,rules: [{ required: true, message: '不能为空' }] }]"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal 
      title='删除'
      :visible='delVisibles'
      @ok="delOk"
      @cancel="delCancel">
      <div> 
        确认删除吗
      </div>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import {getPriceRule,getPriceRuleDetail,addPriceRule,changeStatus,updatePriceRule,delPriceRule} from '@/api/collect'
  export default {
    name:"adjust_price",
    components:{
    },
    data(){
      return{
        form: this.$form.createForm(this),
        data:[],
        listLoading:false,
        ruleStatus:false,
        current:1,
        page:"",
        pageSizeOptionManage:['10','20','40','60','80','100','200'],
        ruleVisible:false,
        editPrice1:'',
        editPrice2:'',
        setObj:[
          {
            select1:'1',
            select2:'1',
            num:'',
            status:false
          },
          {
            select1:'4',
            select2:'1',
            select3:'1',
            num:'',
            status:true
          },
          {
            select1:'2',
            select2:'1',
            num:'',
            status:false
          }
        ],
        select4:'1',
        select5:'1',
        btnLoading:false,
        editeId: 0,
        delVisibles:false,
        delId:''
      }
    },
    watch: {
    },
    computed: {
      
    },
    methods:{
      //获取列表数据
      getRuleData(pagesize){
        getPriceRule({
          page:this.current,
          page_size:pagesize
        }).then((res)=>{
          if(res.code === 0){
            if(JSON.stringify( res.data)==="{}"){
              this.data = []
            }else{
              this.data = res.data
            }
            this.page = res.pages
          }else{
            this.$notification.error({
              message: '提示',
              description: res.msg,
            });
          }
        })
      },
      pagechange(page,pagesize){
        this.current = page
      },
      onShowSizeChange(current, pageSize) {
        this.getRuleData(pageSize)
      },
      //新增调价规则
      addPriceRlue(){
        this.ruleVisible = true
      },
      onChange(val,obj){
        this.editeId = obj.id
        obj.status = val?'1':'0'
        changeStatus({
          id:obj.id,
          status:val?'1':'0'
        }).then((res)=>{
          if(res.code === 0){
            this.$notification.success({
              message: '提示',
              description: res.msg,
            });
          }else{
            this.$notification.error({
              message: '提示',
              description: res.msg,
            });
          }
        })
      },
      //设置
      Edits(id){
        this.editId = id
        getPriceRuleDetail({
          id:id,
        }).then((res)=>{
          if(res.code === 0){
            if(JSON.stringify(res.data)==="{}"){
              
            }else{
              // this.form.setFieldsValue({
              //   ['editPrice1']:res.data.name,
              // })
              this.editPrice1 = res.data.name
              this.editPrice2 = res.data.remark
              this.select4 = res.data.price_type.toString()
              this.select5 = res.data.no_compete_type.toString()
              this.setObj[0].select1 = res.data.low_my_price.toString()
              this.setObj[1].select1 = res.data.middle_my_price.toString()
              this.setObj[2].select1 = res.data.high_my_price.toString()
              if(this.setObj[0].select1.toString()=='4'){
                this.setObj[0].select2 = res.data.low_symbol.toString()
                // this.form.setFieldsValue({
                //   ['num']:res.data.low_step,
                // })
                this.setObj[0].num = res.data.low_step
                this.setObj[0].status = true
              }
              if(this.setObj[1].select1.toString()=='4'){
                this.setObj[1].select2 = res.data.middle_symbol.toString()
                // this.form.setFieldsValue({
                //   ['num1']:res.data.middle_step,
                // })
                this.setObj[1].num = res.data.low_step
                this.setObj[1].select3 = res.data.step_type.toString()
                this.setObj[1].status = true
              }
              if(this.setObj[2].select1.toString()=='4'){
                this.setObj[2].select2 = res.data.high_symbol.toString()
                // this.form.setFieldsValue({
                //   ['num2']:res.data.high_step,
                // })
                this.setObj[2].num = res.data.low_step
                this.setObj[2].status = true
              }
              this.ruleVisible = true
            }
          }else{
            this.$notification.error({
              message: '提示',
              description: res.msg,
            });
          }
        })
      },
      del(id){
        this.delVisibles = true
        this.delId = id
      },
      delOk(){
        delPriceRule({
          ids:this.delId
        }).then((res)=>{
          if(res.code === 0){
            this.$notification.success({
              message:'成功',
              description: "删除成功",
            });
            this.delVisibles = false
            this.getRuleData(this.page.pageSize)
          }
        })
      },
      delCancel(){
        this.delVisibles = false
      },
      ruleOk(){
        let _this = this
        this.btnLoading = true
        const { form: { validateFields } } = this
        validateFields((err, values) => {
          let obj = {
            id: this.editId,
            name:this.editPrice1,
            remark:this.editPrice2,
            price_type:this.select4,
            no_compete_type:this.select5,
            low_my_price:this.setObj[0].select1,
            middle_my_price:this.setObj[1].select1,
            high_my_price:this.setObj[2].select1,
            low_symbol:this.setObj[0].status?this.setObj[0].select2:'',
            middle_symbol:this.setObj[1].status?this.setObj[1].select2:'',
            high_symbol:this.setObj[2].status?this.setObj[2].select2:'',
            low_step:this.setObj[0].status?this.setObj[0].num:'',
            middle_step:this.setObj[1].status?this.setObj[1].num:'',
            high_step:this.setObj[2].status?this.setObj[2].num:'',
            step_type:this.setObj[1].status?this.setObj[1].select3:'',
          }
          if(this.editeId){
            obj.id = this.editeId
            updatePriceRule(obj).then((res)=>{
              if(res.code === 0){
                this.$notification.success({
                  message: '提示',
                  description: res.msg,
                });
                this.ruleVisible = false
                this.btnLoading = false
                this.getRuleData(this.page.pageSize)
              }else{
                this.$notification.error({
                  message: '提示',
                  description: res.msg,
                });
                this.btnLoading = false
              }
            })
          }else{
            addPriceRule(obj).then((res)=>{
              if(res.code === 0){
                this.$notification.success({
                  message: '提示',
                  description: res.msg,
                });
                this.ruleVisible = false
                this.btnLoading = false
                this.getRuleData(this.page.pageSize)
              }else{
                this.$notification.error({
                  message: '提示',
                  description: res.msg,
                });
                this.btnLoading = false
              }
            })
          }
        })
      },
      ruleCancel(){
        this.editeId = ''
        this.ruleVisible = false
        this.editPrice1 = ''
        this.editPrice2 = ''
        this.select4 = '1'
        this.select5 = '1'
        this.setObj = [
          {
            select1:'1',
            select2:'1',
            num:'',
            status:false
          },
          {
            select1:'4',
            select2:'1',
            select3:'1',
            num:'',
            status:true
          },
          {
            select1:'2',
            select2:'1',
            num:'',
            status:false
          }
        ]
      },
      priceChange(val,num){
        if(val=='4'){
          this.setObj[num].status = true
        }else{
          this.setObj[num].status = false
        }
      },
    },
    created(){
      this.getRuleData(10)
    },
    mounted(){},
    updated(){},
    destroyed(){},
    filters:{
      priceTlt(val){
        return '￥' + val
      }
    },

  }
</script>
<style lang="less" scpoed>
  .ml{margin-left:10px;}
  .tar{text-align: right;}
  .mr-sm{margin-right: 5px;}
  .list-link{
    color: #1890ff;

  }
  .cur{cursor:pointer;}
  .text-min{
    width:250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dis-flex{
    display:flex;
  }
  .flex-wrap{
    flex-wrap: wrap;
  }
  .highlight{
    color: #1890ff;
    font-weight: 800;
  }
 .default{
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
 } 
</style>