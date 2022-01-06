<template>
  <div>
    {{mergeCells}}
    <a-row  type="flex" justify="start">
      <a-col >
        <a-select  style="width: 120px" placeholder='请输入国内物流' @change="handleChange">
          <a-select-option :value="item.value" v-for='(item,index) in logisticsList' :key='index'>
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col class='ml'>
        <a-button @click='fillLogisticsInfo()'>确认</a-button>
      </a-col>
      <a-col class='ml'>
        <a-button @click='mergeDomesticNo()'>合并</a-button>
      </a-col>
    </a-row>
    <a-row class='mt'>
      <a-col>
        <vxe-table
          border
          resizable
          ref="xTable1"
          :span-method="mergeMethod"
          :data="tableData"
          @checkbox-all="selectAllEvent"
          @checkbox-change="selectChangeEvent"
        >
          <vxe-table-column type="checkbox" width="50"></vxe-table-column>
          <vxe-table-column field="order_no" title="订单编号" width="200"></vxe-table-column>
          <vxe-table-column field="img" title="图片" width="200">
            <template>
              <img src="" alt="">
            </template>
          </vxe-table-column>
          <vxe-table-column field="addressee" title="收件人" width="100"></vxe-table-column>
          <vxe-table-column field="goods_number" title="商品数量" width="50"></vxe-table-column>
          <vxe-table-column field="logistics_mode"  title="国内物流方式" width="200">
            <template v-slot="{ row }">
              <vxe-select v-model="row.logistics_mode" placeholder="默认尺寸">
                <vxe-option v-for="num in logisticsList" :key="num" :value="num.value" :label="num.label"></vxe-option>
              </vxe-select>
            </template>
          </vxe-table-column>
          <vxe-table-column field="domestic_no" title="国内单号" width="200">
            <template v-slot="{ row }">
              <vxe-input v-model="row.domestic_no" placeholder="请输入国内单号"></vxe-input>
            </template>
          </vxe-table-column>
          <vxe-table-column field="remarks" title="备注" width="200">
            <template v-slot="{ row }">
              <vxe-input v-model="row.remarks" placeholder="请输入备注"></vxe-input>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" width="300" show-overflow>
            <template v-slot="{ row ,rowIndex}">
              {{row.num}}
              <vxe-button type="text"  v-if='row.type==0' @click="editEvent(row,rowIndex)">拆分</vxe-button>
              <vxe-button v-if='row.type==1' type="text" @click='delEvent(row,rowIndex)' >删除</vxe-button>
              <vxe-button v-if='row.type==3' type="text"  @click='reductionOrder(row,rowIndex)'>还原</vxe-button>
              {{row.type}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="id" title="备注" width="200">
            <template v-slot="{ row }">
              <vxe-input v-model="row.id" placeholder="请输入备注"></vxe-input>
            </template>
          </vxe-table-column>
        </vxe-table>
      </a-col>
    </a-row>
    {{tableData}}
     <vxe-button type="text" @click='submits'>submit</vxe-button>
  </div>
</template>
<script>
import deepClone from '@/utils/util'
export default {
  data() {
    return {
      logisticsList:[
        {
          label:'圆通物流',
          value:'1'
        },
        {
          label:'申通物流',
          value:'0'
        },
        {
          label:'长通物流',
          value:'2'
        },
      ],
      tableData: [],
      mergeCells:[ 
        
        ],
      //[
        // { row: 0, col: 0, rowspan: 2, colspan: 1 ,id : 78415-45770},
        // { row: 0, col: 1, rowspan: 2, colspan: 1 ,id : 78415-45770},
        // { row: 0, col: 2, rowspan: 2, colspan: 1 ,id : 78415-45770},
        // { row: 0, col: 3, rowspan: 2, colspan: 1 ,id : 78415-45770},
        // { row: 0, col: 4, rowspan: 2, colspan: 1 ,id : 78415-45770},
        
        // {row: 2, col: 0, rowspan: 2, colspan: 1, id : 78415-45772},
        // {row: 2, col: 5, rowspan: 2, colspan: 1, id : 78415-45772},
        // {row: 2, col: 6, rowspan: 2, colspan: 1, id : 78415-45772},
        // {row: 2, col: 7, rowspan: 2, colspan: 1, id : 78415-45772},
      //],
      checkedValue:[],
      fillLogisticsValue:"",
      idNum:0


    };
  },
    created () {
     var list = []
      for(var index = 0; index < 15; index++){
        var item = {
          id: index,
          order_no: '78415-4577'+index,
          img: 'http://img20.360buyimg.com/jdcms/s150x150_jfs/t1/6249/18/7685/255374/5c076938E60037c86/dacd6b27c50d4fef.jpg.webp',
          addressee: 'lilei',
          goods_number: '10',
          logistics_mode: '0',
          domestic_no: index,
          remarks:'备注信息',
          num:0,
          type:0, // false 0 true 1
          
          // date:new Date(),
        }
        list.push(item)
      }
      this.tableData = list
      console.log(this.tableData)
    },
    methods: {
      // 通用单元格合并函数（将指定区域进行合并）
      mergeMethod ({ rowIndex, columnIndex }) {
        const { mergeCells } = this
        for (let mIndex = 0; mIndex < mergeCells.length; mIndex++) {
          const { row, col, rowspan, colspan } = mergeCells[mIndex]
          if (row === rowIndex && col === columnIndex) {
            return { rowspan, colspan }
          }
          if (rowIndex >= row && rowIndex < row + rowspan && columnIndex >= col && columnIndex < col + colspan) {
            return { rowspan: 0, colspan: 0 }
          }
        }
        return { rowspan: 1, colspan: 1 }
      },
    selectAllEvent ({ checked, records }) {
      console.log(checked ? '所有勾选事件' : '所有取消事件', records,checked)
      this.checkedValue = records
    },
    selectChangeEvent ({ checked, records }) {
      console.log(checked ? '勾选事件' : '取消事件', records,checked)
      this.checkedValue = records
    },
    getSelectEvent () {
      let selectRecords = this.$refs.xTable1.getCheckboxRecords()
      this.$XModal.alert(selectRecords.length)
    },
    editEvent(item ,index){
      if(!item.num){
        item.num = 0
      }
      item.status= true
      if(item.num<5){
        item.num++
        console.log(item,"ids" ,index,'index',item.num,)
        let templateInfo = {}
        let num = Math.floor(Math.random() * 100 + 1);
        
        templateInfo = this.copyData(item)
        templateInfo.type = 1 
        console.log(templateInfo,'over')
        this.tableData.splice(index+1,0,templateInfo)
        console.log(this.tableData,'over1')
        let mergeTemolate = [
          { row: 0, col: 0, rowspan: 2, colspan: 1 ,id : templateInfo.id ,type:1 ,num:0},
          { row: 0, col: 1, rowspan: 2, colspan: 1 ,id : templateInfo.id ,type:1 ,num:0},
          { row: 0, col: 2, rowspan: 2, colspan: 1 ,id : templateInfo.id ,type:1 ,num:0},
          { row: 0, col: 3, rowspan: 2, colspan: 1 ,id : templateInfo.id ,type:1 ,num:0},
          { row: 0, col: 4, rowspan: 2, colspan: 1 ,id : templateInfo.id ,type:1 ,num:0},
        ]
          mergeTemolate.forEach((im,inx)=>{
            if(item.num>0){
              im.rowspan += (item.num -1)
              im.num = item.num
            }
            if(true){
              im.row = index
            }
            // this.mergeCells.push(im)
          })
        console.log(this.mergeCells,'pppp')
        if(this.mergeCells.length==0){
          this.mergeCells.push.apply(this.mergeCells,mergeTemolate);
        }else{
          let num = 0
          this.mergeCells.forEach((itm,inx)=>{
            console.log(itm.id,'123',templateInfo.id)
            if(itm.id>templateInfo.id){
              console.log(itm.id,'大于',itm)
              itm.row++
            }else{
              console.log(itm.id,'小于')
            }
            mergeTemolate.forEach((im,ix)=>{
              console.log(im.id,'234')
              if(itm.id === im.id){
                this.mergeCells.splice(inx,1)
                num ++
                console.log('有重复的值',itm.id ,im.id)
              }else{
                console.log('无重复的值',itm.id ,im.id)
              }
            })
          })
          // if(num>0){
            this.mergeCells.push.apply(this.mergeCells,mergeTemolate);
          // }
        }
        console.log(this.mergeCells)
      }else{
        this.$notification.error({
          message: '错误',
          description: '单号最多拆分5条'
        })
      }
    },
    //删除单号
    delEvent(item ,index){
      console.log(item ,index,'del')
      console.log(this.mergeCells,this.mergeCells.length,'length')
       this.tableData.splice(index,1)
      for(let i = 0;i<this.mergeCells.length;i++){
        if(item.id==this.mergeCells[i].id){
          if(this.mergeCells[i].num<2){
            this.mergeCells.splice(i, 1);
            i--;
            this.tableData.forEach((itm,inx)=>{
              if(item.id == itm.id){
                itm.status = false
              }
            })
          }else{
            this.mergeCells[i].rowspan--
            this.mergeCells[i].num--
          }
        }
      }
      this.mergeCells.forEach((itm,inx)=>{
        if(itm.id>item.id){
          console.log(itm.id,'大于',itm)
            itm.row--
          }else{
            console.log(itm.id,'小于')
          }
      })
      //删除后需要把所有拆分的id-1
      this.tableData.forEach((im,ix)=>{
        if(im.id == item.id){
          im.num--
        }
      })
      console.log(this.tableData,'id')

    },
    submits(){
      console.log(this.tableData)
    },
    mergeDomesticNo(){
      console.log(this.checkedValue)
      this.idNum++
      var num = 0
      if(this.checkedValue.length>1){
        this.checkedValue.forEach((item,index)=>{
          console.log(item,'item')
          if(item.status){
            num ++
          }
        })
       console.log(num)
       if(num==0) {
         //改变勾选订单号的位置
         this.tableData.forEach((item,index)=>{
           this.checkedValue.forEach((itm,inx)=>{
             if(item.id === itm.id){
                item.type=3
                this.toFirst(this.tableData,index)
             }
           })
         })
         let mergeNotemplate = [
          {row: 0, col: 0, rowspan: 2, colspan: 1, id : 0},
          {row: 0, col: 5, rowspan: 2, colspan: 1, id : 0},
          {row: 0, col: 6, rowspan: 2, colspan: 1, id : 0},
          {row: 0, col: 7, rowspan: 2, colspan: 1, id : 0},
          {row: 0, col: 8, rowspan: 2, colspan: 1, id : 0},
         ]
          mergeNotemplate.forEach((im,inx)=>{
            im.rowspan = this.checkedValue.length
            im.id = this.idNum
            // im.num = item.num
          })
          if(this.mergeCells.length==0){
            this.mergeCells.push.apply(this.mergeCells,mergeNotemplate);

          }else{
            let num = 0
            this.mergeCells.forEach((itm,inx)=>{
              console.log(itm.id,'123',mergeNotemplate.id)
              if(itm.id<mergeNotemplate[0].id){
                console.log(itm.id,'大于',itm)
                itm.row+=this.checkedValue.length
              }else{
                console.log(itm.id,'小于')
              }
            })
          this.mergeCells.push.apply(this.mergeCells,mergeNotemplate);
        }
       }else{
          this.$notification.error({
            message: '提醒',
            description: '订单已经拆分或者合并过，不能再次合并',
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
    fillLogisticsInfo(){
      if(this.checkedValue.length>0){
        if(this.fillLogisticsValue){
          this.checkedValue.forEach((item,index)=>{
            item.logistics_mode = this.fillLogisticsValue
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
    reductionOrder(item,index){
      console.log(item,index)
    },
    //改变合并数组的位置
    toFirst(fieldData,index){
      if(index !=0){
        fieldData.unshift(fieldData.splice(index , 1)[0]);
        return fieldData
      }
    }
  }
};

</script>