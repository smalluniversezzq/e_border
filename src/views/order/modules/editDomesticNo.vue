<template>
  <div>
    <a-row >
      <a-col span='3'>
        <a-select  style="width: 120px" placeholder='请输入国内物流' @change="handleChange">
          <a-select-option :value="item.no" v-for='(item,index) in logisticsList' :key='index'>
            {{item.com}}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col  span='3'>
        <a-button @click='fillLogisticsInfo()'>确认</a-button>
      </a-col>
      <a-col  offset='20'>
        <a-button @click='mergeDomesticNo()'>包裹拆分</a-button>
      </a-col>
    </a-row>
    <a-row class='mt tac overscrllo' >
      <a-col>
        <a-form :form='form' class='mt ' labelAlign='right' >
          <a-row class='bg-color th-box'>
            <a-col span='1'>
              <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              </a-checkbox>
            </a-col>
            <a-col span='11'>
              <a-row>
                <a-col  span='6'>
                  订单编号
                </a-col>
                <a-col  span='6'>
                  图片
                </a-col>
                <a-col  span='6'>
                  收件人
                </a-col >
                <a-col  span='6'>
                  商品数量
                </a-col>
              </a-row>
            </a-col>
            <a-col span='12'>
              <a-row>
                <a-col  span='6'>
                  国内物流方式
                </a-col>
                <a-col  span='6'>
                  国内单号
                </a-col>
                <a-col  span='6'>
                  备注
                </a-col>
                <a-col  span='6'>
                  操作
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-checkbox-group @change="onCheckChange" class='bottom-border right-border' :options="plainOptions" v-model="checkedList" style='width:100%'> 
            <a-row v-for='(item,index) in tableData' :key='index' class='lt-border '>
              <a-col span='1' class='top-border '>
                <div  class='check bottom-border'>
                  <a-checkbox :checked="false"  :value='index'></a-checkbox>
                </div> 
              </a-col>
              <a-col span='11'>
                <a-row  v-for='(itm,inx) in item[0]' :key='inx'  class='top-border'>
                  <!-- 订单编号 -->
                  <a-col span='6' class='rt-border lt-border bottom-border '>
                    <a-form-item class='mt-xl'>
                      {{itm.order_id}}
                    </a-form-item> 
                  </a-col>
                  <!-- 图片 -->
                  <a-col span='6' class='rt-border bottom-border'>
                    <a-form-item >
                      <div class=''>
                        <div style='width:98px' class='merge-pic margin-auto tac'>
                          <img :src="itm.image" alt="">
                        </div>
                      </div>
                    </a-form-item> 
                  </a-col>
                  <!-- 收件人 -->
                  <a-col span='6' class='rt-border bottom-border'>
                    <a-form-item class='mt-xl'>
                      {{itm.buyer_name}}
                    </a-form-item> 
                  </a-col>
                  <!-- 商品数量 -->
                  <a-col  span='6' class='rt-border bottom-border'>
                    <a-form-item class='mt-xl'>
                      {{itm.quantity}}
                    </a-form-item> 
                  </a-col>
                </a-row>
              </a-col>
              <a-col span='12' >
                <a-row  class='top-border'  v-for='(itm,inx) in item[1]' :key='inx' >
                  <!-- 国际物流方式 -->
                  <a-col span='6' class='rt-border lt-border bottom-border'>
                    <a-form-item class='mt-xl'>
                      <a-select  
                      style="width: 120px" 
                      placeholder='请输入国内物流' 
                      v-model="itm.inland_name" 
                      >
                        <a-select-option :value="item.no" v-for='(item,index) in logisticsList' :key='index'>
                          {{item.com}}
                        </a-select-option>
                      </a-select>
                    </a-form-item> 
                  </a-col>
                  <!-- 国内单号 -->
                  <a-col span='6' class='rt-border bottom-border'>
                    <a-form-item class='mt-xl'>
                      <a-input  style="width: 120px"  v-model='itm.inland_code' placeholder="请输入国内单号"  />
                    </a-form-item> 
                  </a-col>
                  <!-- 备注 -->
                  <a-col span='6' class='rt-border bottom-border'>
                    <a-form-item class='mt-xl'>
                      <a-input  style="width: 120px"  v-model='itm.remark' placeholder="请输入备注"  />
                    </a-form-item> 
                  </a-col>
                  <!-- 操作 -->
                  <a-col span='6' class='rt-border bottom-border'>
                    <a-form-item class='mt-xl'>
                      <div>
                        <a-button v-if='itm.type==0'  @click="editEvent(item,index)">合并包裹</a-button>
                        <a-button v-if='itm.type==1'  @click='delEvent(item,index,inx)' >删除</a-button>
                        <a-tooltip v-if='itm.type==2'>
                        <template  slot="title">
                          点击还原合并的包裹
                        </template>
                          <a-button   @click='reductionOrder(item,index)'>还原</a-button> 
                      </a-tooltip> 
                      </div> 
                    </a-form-item> 
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import {
  setOrderLnland
} from '@/api/order'
const plainOptions = []
export default {
  name:'editDomesticNo',
  props:[
    'tableData',
    'logisticsList'
  ],
  data() {
    return {
      plainOptions,
      plainOptionAll:[],
      checkedList:[],
      form: this.$form.createForm(this),
      indeterminate:false,
      checkAll:false,
      copyDataInfo:[],
      mergeCells:[ 
      ],

      checkedValue:[],
      fillLogisticsValue:"",
      idNum:0
    };
  },
    created () {
     var checkedIndex = []
      this.tableData.forEach((item,index)=>{
        checkedIndex.push(index)
      })
      this.plainOptionAll = checkedIndex
      this.copyDataInfo = this.deepClone(this.tableData)
      console.log(this.tableData,this.copyDataInfo)
    },
    mounted(){
    },
    methods: {
    editEvent(info ,index){
      if((info[1].length) < 6){
        let copyInfo = this.copyData(info[1][0])
        copyInfo.type = 1
        this.tableData[index][1].push(copyInfo)
      }else{
        this.$notification.error({
          message: '错误',
          description:'单号最多拆分5条'
        })
      }
    },
    //删除单号
    delEvent(info ,index , inx){
      this.tableData[index][1].splice(inx,1) 
    },
    // 合并国内单号
    mergeDomesticNo(){
      if(this.checkValue && this.checkValue.length>1){
        let checkedValue = []
        let typeNum = 0
        let typeNumTow = 0
        let mergeValue = []
        this.checkValue.forEach((item,index)=>{
          checkedValue.push(this.tableData[item])
        })
        checkedValue.forEach((item,index)=>{
          if(item[1].length>1){
            typeNum++
          }
          if(item[0].length>1){
            typeNumTow++
          }
        })

        if(typeNum===0){
          if(typeNumTow===0){
          checkedValue.forEach((item,index)=>{
            mergeValue.push(item[0][0])
          }) 
          console.log(mergeValue,'mergeValue')
          let checkedValueDel = this.copyData(this.checkValue)
          let copyDelChecked = checkedValueDel.sort().splice(0,1)
          console.log(checkedValueDel,'checkedValueDel')
          checkedValueDel.reverse()
          checkedValueDel.forEach((item,index)=>{
            console.log(item,'item')
            this.tableData.splice(item,1)
          })
          this.tableData[copyDelChecked][0] = mergeValue
          this.tableData[copyDelChecked][1][0].type=2
          Object.assign(this, {
            checkedList:[],
          });
          this.indeterminate=false
          this.checkAll = false
          }else{
            this.$notification.error({
            message: '提醒',
            description: '订单已经合并过，不能再次合并',
          });           
          }
        }else{
          this.$notification.error({
            message: '提醒',
            description: '订单已经拆分过，不能再次合并',
          });  
        }
      }else{
        this.$notification.error({
          message: '提醒',
          description: '请勾选合并的选项',
        }); 
      }
    },
    copyData(obj){
      if(obj === null) return null 
      if(typeof obj !== 'object') return obj;
      if(obj.constructor===Date) return new Date(obj); 
      var newObj = new obj.constructor ();  //保持继承链
      for (var key in obj) {
          if (obj.hasOwnProperty(key)) {   //不遍历其原型链上的属性
              var val = obj[key];
              newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; // 使用arguments.callee解除与函数名的耦合
          }
      }  
      return newObj; 
    },
    deepClone(obj){
      let str, newobj = obj.constructor === Array ? [] : {};
      if(typeof obj !== 'object'){
        return;
      } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
      } else {
        for(var i in obj){
          newobj[i] = typeof obj[i] === 'object' ? 
          cloneObj(obj[i]) : obj[i]; 
        }
      }
      return newobj;
    },
    fillLogisticsInfo(){
      if(this.checkValue.length>0){
        if(this.fillLogisticsValue){
          let checkedValue = [] 
          this.checkValue.forEach((item,index)=>{
            checkedValue.push(this.tableData[item])
          })
          checkedValue.forEach((item,index)=>{
            console.log(item[1])
            item[1].forEach((itm,inx)=>{
              itm.inland_name = this.fillLogisticsValue
            })
          })
        }else{
          this.$notification.error({
            message: '提醒',
            description: '请选择物流名称',
          });
        }
      }else{
        this.$notification.error({
          message: '提醒',
          description: '请勾选填充的选项',
        });
      }
    },
    handleChange(value){
      this.fillLogisticsValue = value
    },
    //还原订单
    reductionOrder(info,index){
      let reductionId = []
      let reductionInfo = []
      let reductionCode = []
      reductionCode = info[1][0]
      console.log(this.copyDataInfo,'copyDataInfo')
      const only = this.deepClone(this.copyDataInfo)
      console.log(info,index,reductionCode)

      info[0].forEach((item,index)=>{
        reductionId.push(item)
      })
      console.log(reductionId,'reductionId',this.copyDataInfo)
      reductionId.forEach((item,index)=>{
        let orderArr = []
        console.log(item,reductionCode)
        reductionCode.type = 0
        orderArr[0] = []
        orderArr[1] = []
        orderArr[0]=(item)
        orderArr[1]=this.copyData(reductionCode)
        reductionInfo[index] = []
        reductionInfo[index][0] = []
        reductionInfo[index][1] = []
        reductionInfo[index][0].push(orderArr[0])
        reductionInfo[index][1].push(orderArr[1])
        console.log(reductionInfo[index],"reductionInfo1")
      })
      console.log(reductionInfo,'reductionInfo')
      this.tableData.splice(index,1)
      reductionInfo.forEach((item,inx)=>{
        this.tableData.splice(index,0,item)
      })
      console.log(this.tableData)

      Object.assign(this, {
        checkedList:[],
      });
      this.indeterminate=false
      
    },
    //控制checked
     onCheckChange(checkedList){
      console.log(checkedList,checkedList)
      this.checkValue = checkedList
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptionAll.length;
      console.log(this.indeterminate,!!checkedList.length,checkedList.length < plainOptions.length)
      this.checkAll = checkedList.length === this.plainOptionAll.length;
      console.log(this.checkValue,'onCheckChange')
      console.log(this.checkedList)
    },
    onCheckAllChange(e) {
      let checkedIndex = []
      this.tableData.forEach((item,index)=>{
        checkedIndex.push(index)
      })
      this.plainOptionAll = checkedIndex
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptionAll : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      console.log(e.target.checked,this.plainOptionAll,this.checkedList)
      this.checkValue = this.checkedList
    },
    // 保存  父组件触发保存
    submitEditNo(){
      setOrderLnland({
        inland_info:this.tableData
      }).then(res=>{
        if(res.code === 0){
          this.$emit('closeEdit');
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
  .merge-pic{
    height: 98px;
    overflow:hidden;
    img{
      width: 100%;
    }
  }
  .lt-border{
    border-left: 1px solid #e8e8e8;
    height: 100;
    line-height: 100px;
  }
  .rt-border{
    border-right: 1px solid #e8e8e8;
    height: 100px;
    line-height: 100px;
  }
  .right-border{
    border-right: 1px solid #e8e8e8;
  }
  .mt-xl{
    margin-top: 20px;
  }
  .top-border{
    border-top: 1px solid #e8e8e8;
  }
  .bottom-border{
    border-bottom: 1px solid #e8e8e8;
  }
  .tac{
    text-align: center;
  }
  .margin-auto{
    margin: 0 auto;
  }
  .bg-color{
    background: #e8eaec;
  }
  .th-box{
    height: 65px;
    line-height: 65px;
    font-weight:800;
    
  }
  .check{
    height: 100px;
    line-height: 100px;
  }
  .overscrllo{
    height: 500px;
    overflow-x: scroll;
  }
</style>