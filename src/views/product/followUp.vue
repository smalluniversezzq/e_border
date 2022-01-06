<template>
  <div class='timing-rlue'>
    <a-card>
      <a-tabs defaultActiveKey="1" type="card" class="intcardtab" @change='Tabcallback'>
        <a-tab-pane key="1" >
          <span slot="tab" >
            跟卖采集
          </span>
          <FollowUp v-if='showTabOne' :countrySelect='countrySelect'/>
        </a-tab-pane>
        <a-tab-pane key="3" >
          <span slot="tab" >
            防跟卖监控
          </span>
          <goodMonitor></goodMonitor>
        </a-tab-pane>
        <a-tab-pane key="2"  :disabled='!hasPerm(permsBtn.followup_timer)'>
          <span slot="tab">
            定时规则
          </span>
          <a-row>
            <a-col class='tal'>
              <a-button @click='addTimeRlue("0")' type='primary'>添加定时任务</a-button>
            </a-col>
          </a-row>
          <a-row v-if='showTabTow'>
            <a-col>
              <a-table
                :pagination="false"
                :dataSource="data"
                :loading = "listLoading"
                rowKey="id">
                <a-table-column
                  title="任务名称"
                  dataIndex="title"
                  width="100px"
                >
                </a-table-column>
                <a-table-column
                  title="包含产品"
                  dataIndex="to_sell_number"
                  width="100px"
                >
                </a-table-column>
                <a-table-column
                  title="有效期开始时间"
                  width="100px"
                >
                <template slot-scope='text,record'>
                  <span>{{moment(record.start_day).format('YYYY-MM-DD')}}</span>
                </template>
                </a-table-column>

                <a-table-column
                  title="有效期结束时间"
                  width="100px"
                >
                <template slot-scope='text,record'>
                  <span>{{moment(record.end_day).format('YYYY-MM-DD')}}</span>
                </template>
                </a-table-column>
                <!-- <a-table-column
                  title="创建时间"
                  width="100px"
                >
                <template slot-scope='text,record'>
                  <span>{{moment(parseInt(record.created_at)*1000).format('YYYY-MM-DD')}}</span>
                </template>
                </a-table-column> -->
                <a-table-column
                  title="更新时间"
                  width="100px"
                >
                <template slot-scope='text,record'>
                  <span>{{moment(parseInt(record.updated_at)*1000).format('YYYY-MM-DD')}}</span>
                </template>
                </a-table-column>
                <a-table-column
                  title="状态"
                  dataIndex="status"
                  width="100px"
                >
                <template slot-scope='text,record'>
                  <a-button :type='record.status==="1"?"primary":"default"' @click='tabStatus(record.id,record.status)'>{{record.status==='1'?"已启用":'已禁用'}}</a-button>
                </template>
                </a-table-column>
                <a-table-column
                    class="time"
                    title="操作"
                    width='210px'
                  >
                  <template slot-scope="text, record">
                    <a-button  class='mr-sm' @click="() => Edits(record.id)">详情</a-button>
                    <a-button  type="danger" @click='del(record.id)'>删除</a-button>
                  </template>
                </a-table-column>
              </a-table>
            </a-col>
          </a-row>
          <a-row>
            <a-col class='tar mt'>
              <a-pagination 
                v-model="current"
                @change='pagechanges'
                :pageSize='page.pageSize'
                :total='(page.pageSize*page.lastPage)'
              />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="4" >
          <span slot="tab" >
            智能调价
          </span>
          <adjustPrice></adjustPrice>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <div v-if='rlueShow'>
      <a-modal
        title="添加规则"
        :maskClosable='false'
        :visible="showRlue"
        @ok="RlueOk"
        :confirmLoading="RlueLoading"
        @cancel="RlueCancel"
        width='650px'
      >
      <a-form :form="form">
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="任务名称"
          >
            <a-input
            v-decorator="[
              'rlue_name',
              {initialValue:infoData.rlue_name},
            ]"
            placeholder="请输入任务名称"
            />
          </a-form-item>
          <a-form-item
            label="有效期设置"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            style="margin-bottom:0;"
          >
            <a-form-item
              :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
            >
              <a-date-picker
              style="width: 100%" 
               v-model="startValue"
              :disabledDate="disabledStartDate"
              format="YYYY-MM-DD"
              placeholder="请选择开始日期"
              @openChange="handleStartOpenChange"
              @change="dateChange"
            />
            </a-form-item>
            <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
              -
            </span>
            <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
              <a-date-picker
                v-model="endValue"
                :disabledDate="disabledEndDate"
                format="YYYY-MM-DD "
                placeholder="请选择结束日期"
                :open="endOpen"
                @openChange="handleEndOpenChange"
                @change="dateChange"
              />

            </a-form-item>
          </a-form-item>
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="时间段设置"
          >
            <a-row>
              <a-col span='24'>
                <a-radio-group 
                  @change="onTimeModeChange"
                  v-model="timeType">
                  <a-radio  :value="0">设置时间</a-radio>
                  <a-radio  :value="1">全天跟卖</a-radio>
                </a-radio-group>
              </a-col>
            </a-row>
            <a-row>
              <!-- {{created_time_value}}-{{end_time_value}} -->
              <a-col span='24' v-if='timeType === 0'>
                <a-time-picker  
                style="width: 45%" 
                format="HH:mm"
                :defaultValue="moment(created_time_value, 'HH:mm')"
                placeholder='请选择开始时间' 
                @change="onCreateTimeChange" />
                <span> - </span>
                <a-time-picker  
                style="width: 45%" 
                :defaultValue="moment(end_time_value, 'HH:mm')" 
                format="HH:mm"
                placeholder='请选择结束时间' 
                @change="onEndTimeChange" />
              </a-col>
              <a-col >
                <div>
                  <!-- <a-checkbox 
                  :indeterminate="indeterminate" 
                  @change="onCheckAllChange" 
                  :checked="checkAll">
                    全部
                  </a-checkbox> -->
                </div>
                <a-checkbox-group 
                  v-if="plainOptions"
                  :options="plainOptions" 
                  v-model="checkedList" 
                  @change="onTimeDayChange" >
                  <span
                    slot="label"
                    slot-scope="{value}"
                  >{{value}}</span>
                </a-checkbox-group >
              </a-col>
            </a-row>
          </a-form-item>
      </a-form>
    </a-modal>
    </div>
    <a-modal
      title="删除"
      :visible="showDel"
      @ok="delOk"
      @cancel="delCancel"
    >
      <p>确认删除</p>
    </a-modal>
  </div>
</template>
<script>
  import moment from 'moment';
  import { permsBtn } from '@/utils/static'
  let plainOptions = [
    { label: '周一', value: '1' , disabled:false},
    { label: '周二', value: '2' , disabled:false},
    { label: '周三', value: '3' , disabled:false},
    { label: '周四', value: '4' , disabled:false},
    { label: '周五', value: '5' , disabled:false},
    { label: '周六', value: '6' , disabled:false},
    { label: '周日', value: '7' , disabled:false},
  ];

  const plainOptionres = ['1', '2', '3','4', '5', '6','7'];
  const defaultCheckedList = [];
  import { addTimerRule ,getTimerList ,country_list , timerUpdate} from '@/api/collect'
  import FollowUp from './components/FollowUp.vue';
  import adjustPrice from './components/adjustPrice.vue';
  import goodMonitor from './components/goodMonitor.vue';
  export default{
    name:"followup",
    components:{
      FollowUp,
      adjustPrice,
      goodMonitor
    },
    data(){
      return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
        permsBtn,
        rlueShow:false,
        listLoading:false,
        RlueLoading:false,
        showDel:false,
        delId:"",
        delLoading:false,
        showRlue:false,
        selectedRowKeys: [],
        selectManageAll:"",
        selectkey:"",
        data:[],
        current:1,
        page:"",
        timeType:0,
        checkedList: defaultCheckedList,
        indeterminate: false,
        checkAll: false,
        plainOptions,
        plainOptionres,
        form: this.$form.createForm(this),
        startValue: null,
        endValue: null,
        endOpen: false,
        timeCreateValue:"",
        timeEndValue:"",
        infoData:"",
        created_time_value:"00:00",
        end_time_value:"00:00",
        countrySelect:"",
        edidId:"",
        showTabOne:true,
        showTabTow:false,
        weekStatus:[0,1,2,3,4,5,6]
      }
    },
    computed: {
      rowSelection() {
        const { selectedRowKeys } = this;
        return {
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.selectManageAll = selectedRows,
            this.selectkey = selectedRowKeys,
            this.selectedRowKeys = selectedRowKeys
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      }
    },
    methods:{
      moment,
      dateChange(date, dateString){
        console.log(date, dateString);
        this.disableWeek()
      },
      //周一到周日选择状态
      disableWeek(){
        let a = moment(this.startValue)
        let b = moment(this.endValue)
        let c = b.diff(a,'days')
        if(!c){
          c = 0
        }
        console.log(c);
        if(c<7){
          if(c>0){
            let d = moment(this.startValue).day()
            let e = moment(this.endValue).day()
            console.log(d,e);
            this.weekStatus = []
            if(e<d){
              for(let i=0;i<7;i++){
                if(i>=d){
                  this.weekStatus.push(i)
                }
              }
              for(let i=0;i<e+1;i++){
                this.weekStatus.push(i)
              }
            }else{
              for(let i=d;i<e+1;i++){
                this.weekStatus.push(i)
              }
            }
            this.weekStatus.sort(this.compare)
          }else{
            this.weekStatus = []
            let f = moment(this.startValue).day()
            this.weekStatus.push(f)
          }
          console.log(this.weekStatus)
          this.plainOptions.forEach((item,index)=>{
            if(item.value == 7){
              item.disabled = this.weekStatus.indexOf(0) != -1?false:true
            }else{
              item.disabled = this.weekStatus.indexOf(Number(item.value)) != -1?false:true
            }
          })
        }else{
          this.weekStatus = [0,1,2,3,4,5,6]
          this.plainOptions.forEach((item,index)=>{
            item.disabled = false
          })
        }
        
        // this.checkedList = []
        if(this.checkedList.length){
          let selectData = []
          this.weekStatus.forEach((item,index)=>{
            this.checkedList.forEach((itm,idex)=>{
              if(itm==7&&item==0){
                selectData.push(7+'')
              }else if(itm == item){
                selectData.push(itm.toString())
              }
            })
          })
          this.checkedList = JSON.parse(JSON.stringify(selectData))
        }else{
          this.checkedList = []
        }
        console.log(this.weekStatus)
        console.log(this.checkedList)
      },
      //排序
      compare(a, b) {
        return a - b;
      },
      addTimeRlue(type){
        this.edidId = ''
        this.showRlue = true
        this.rlueShow = true
        this.checkAll = false

        // let day = new Date();
        // day.setTime(day.getTime()+24*60*60*1000);
        this.infoData = {
          rlue_name:"",
          start_time:'',
          end_time:'',
          timeType:0,
          created_time_value:"00:00",
          end_time_value:"23:59",
          checkedList:[]
        }
        if(type === "0"){
          this.created_time_value = '00:00'
          this.end_time_value = '23:59'
          let newDate = moment(new Date()).format("YYYY-MM-DD")
          this.infoData.start_time = new Date()
          this.infoData.end_time = new Date()
          // this.infoData.start_time = null
          // this.infoData.end_time = null
          this.infoData.checkedList = defaultCheckedList
          // this.startValue = newDate
          // this.endValue = newDate
          this.startValue = moment()
          this.endValue = moment()
        }
        this.checkedList = this.infoData.checkedList
        this.created_time_value = this.infoData.created_time_value
        this.end_time_value = this.infoData.end_time_value
        this.timeType =  this.infoData.timeType;
        console.log(this.infoData,'infodata')

        this.disableWeek()
      },
      RlueOk(){
        const { form: { validateFields } } = this
        validateFields((err, values) => {
          console.table(
          '任务名称',values.rlue_name,
          "开始时间",moment(this.infoData.start_time).format('YYYY-MM-DD'),
          '结束时间', moment(this.infoData.end_time).format('YYYY-MM-DD'),
          '是否',this.timeType,
          '开始时间1',this.created_time_value,
          '结束时间1',this.end_time_value,
          '时间段',this.checkedList,
          '初始时间2',this.startValue,
          '结束时间2',this.endValue,
          '初始时间3',moment(this.startValue).format('YYYY-MM-DD'),
          '结束时间3',moment(this.endValue).format('YYYY-MM-DD'),
          '判断',(moment(this.startValue).format('YYYY-MM-DD')===true)
          )
          if(values.rlue_name){
            if(moment(this.startValue).format('YYYY-MM-DD') || this.startValue || moment(this.infoData.start_time).format('YYYY-MM-DD')){
              if(moment(this.endValue).format('YYYY-MM-DD') || this.endValue || moment(this.infoData.end_time).format('YYYY-MM-DD')){
                if(this.checkedList.length > 0){
                //判断是新值  还是 默认值
                  if(this.endValue){
                    console.log("true")
                  }else{
                    console.log('false')
                  }
                  console.log(this.editId)
                  //edidId 有值为修改没值新增
                  if(this.edidId){
                    // console.log('请求前',moment(this.startValue).format('YYYY-MM-DD'),typeof moment(this.endValue).format('YYYY-MM-DD'))
                    // console.log('1')
                    // console.log(moment(this.infoData.start_time).format('YYYY-MM-DD'))
                    addTimerRule({
                      id:this.edidId,
                      title:values.rlue_name,
                      valid_start_day:this.startValue?moment(this.startValue).format('YYYY-MM-DD'):moment(this.infoData.start_time).format('YYYY-MM-DD'),
                      valid_end_day: this.endValue?moment(this.endValue).format('YYYY-MM-DD'):moment(this.infoData.end_time).format('YYYY-MM-DD'),
                      interval_start_time: this.created_time_value,
                      interval_end_time: this.end_time_value,
                      week_days:this.checkedList,
                      is_all_day:this.timeType,
                    }).then(res=>{
                      if(res.code === 0){
                        this.$notification.success({
                          message: '成功',
                          description: res.msg,
                        });
                        this.rlueShow = false
                        this.showRlue = false
                        this.checkAll = false
                        this.created_time_value = '00:00'
                        this.getTimerListFn()
                      }else{
                        this.$notification.error({
                          message: '提醒',
                          description: res.msg,
                        });
                      }
                    })
                  }else{
                    // console.log('2')
                    // console.log('请求前',moment(this.startValue).format('YYYY-MM-DD'),typeof moment(this.endValue).format('YYYY-MM-DD'))
                    // console.log(moment(this.infoData.start_time).format('YYYY-MM-DD'))
                    addTimerRule({
                      title:values.rlue_name,
                      valid_start_day:this.startValue?moment(this.startValue).format('YYYY-MM-DD'):moment(this.infoData.start_time).format('YYYY-MM-DD'),
                      valid_end_day: this.endValue?moment(this.endValue).format('YYYY-MM-DD'):moment(this.infoData.end_time).format('YYYY-MM-DD'),
                      interval_start_time: this.created_time_value,
                      interval_end_time: this.end_time_value,
                      week_days:this.checkedList,
                      is_all_day:this.timeType,
                    }).then(res=>{
                      if(res.code === 0){
                        this.$notification.success({
                          message: '成功',
                          description: res.msg,
                        });
                        this.rlueShow = false
                        this.showRlue = false
                        this.checkAll = false
                        this.created_time_value = '00:00'
                        this.getTimerListFn()
                      }else{
                        this.$notification.error({
                          message: '提醒',
                          description: res.msg,
                        });
                      }
                    })
                  }
                }else{
                  this.$notification.error({
                    message: '提醒',
                    description: '时间段填写不完整',
                  });
                }
              }else{
                this.$notification.error({
                  message: '提醒',
                  description: '结束日期不能为空',
                });
              }
            }else{
              this.$notification.error({
                message: '提醒',
                description: '开始日期不能为空',
              });
            }
          }else{
            this.$notification.error({
              message: '提醒',
              description: '任务名称不能为空',
            });
          }
        })
      },
      RlueCancel(){
        this.rlueShow = false
        this.showRlue = false
        this.weekStatus = [0,1,2,3,4,5,6]
      },
      //列表
      //添加规则
      onTimeModeChange(e){
        console.log('radio checked', e.target.value);
        this.timeType = e.target.value
      },
      onCreateTimeChange(time, timeString) {
        console.log(time, timeString);
        this.created_time_value = moment(time._d).format('HH:mm')
        if(this.weekStatus.length==1){
          if(this.created_time_value && this.end_time_value){
            if(this.created_time_value > this.end_time_value){
              this.$message.warning('初始时间不能低于结束时间');
            }else{
              console.log('时间正常')
            }
          }
        }
      },
      onEndTimeChange(time, timeString) {
        console.log(time, timeString);
        this.end_time_value = moment(time._d).format('HH:mm')
        if(this.weekStatus.length==1){
          if(this.created_time_value && this.end_time_value){
            if(this.created_time_value > this.end_time_value){
              this.$message.warning('初始时间不能低于结束时间');
            }else{
              console.log('时间正常')
            }
          }
        }  
      },
      onTimeDayChange(checkedList) {
        this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length;
        this.checkAll = checkedList.length === plainOptions.length;
        console.log(this.checkedList,'checkedList' )
      },
      onCheckAllChange(e) {
        console.log(e,'onCheckAllChange')
        Object.assign(this, {
          checkedList: e.target.checked ? plainOptionres : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
        this.checked = e.target.checked ? this.plainOptionres : []
      },
      disabledStartDate(startValue) {
        const endValue = this.endValue;
        let yesterday =  new Date();
        yesterday.setTime(yesterday.getTime()-24*60*60*1000);
        if (!startValue || !endValue) {
          return startValue && startValue < moment(yesterday)
        }
        return startValue.valueOf() > endValue.valueOf() || startValue && startValue < moment(yesterday);
      },
      disabledEndDate(endValue) {
        const startValue = this.startValue;
        let yesterday =  new Date();
        yesterday.setTime(yesterday.getTime()-24*60*60*1000);
        if (!endValue || !startValue) {
          return endValue && endValue < moment().endOf(yesterday)
        }
        return startValue.valueOf() >= endValue.valueOf() || startValue && startValue < moment(yesterday);
      },
      handleStartOpenChange(open) {
        if (!open) {
          this.endOpen = true;
        }
      },
      handleEndOpenChange(open) {
        this.endOpen = open;
      },
      // 切换
      tabStatus(id,status){
        let num = ''
        status === '0'?num='1':num='0'
        console.log(id,num,typeof status , status)
        timerUpdate({
          id:id,
          status:num
        }).then(res=>{
          if(res.code === 0){
            this.getTimerListFn()
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
      del(id){
        console.log(id,'id')
        this.showDel=true
        this.delId=id
      },
      delOk(){
        timerUpdate({
          id:this.delId,
        }).then(res=>{
          if(res.code === 0){
            this.showDel = false
            this.getTimerListFn()
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          }else{
            this.showDel = false
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      },
      delCancel(){
        this.showDel = false
      },
      // 编辑 
      Edits(id){
        this.edidId = id
        console.log(id,'ovee')
        console.log(this.toDate(1577932927*1000),'oooo')

        this.infoData = {
          rlue_name:"任务1",
          start_time:'2019-01-22',
          end_time:'2019-02-22',
          timeType:0,
          created_time_value:"02:22",
          end_time_value:"12:22",
          checkedList:['1','2','3','4','5','6']
        }
        this.data.forEach((item,index)=>{
          if(item.id == id){
            console.log('详情数据',id,item)
            this.infoData.rlue_name = item.title
            this.infoData.start_time = item.start_day
            this.infoData.end_time = item.end_day
            this.infoData.timeType = parseInt(item.is_all_day)
            this.infoData.created_time_value = moment(item.start_time).format('HH:mm')
            this.infoData.end_time_value = moment(item.end_time).format('HH:mm')
            this.infoData.checkedList = item.week_days.map(String)
          }
        })
        console.log(this.infoData,'infodata')
        this.created_time_value = this.infoData.created_time_value;
        this.end_time_value = this.infoData.end_time_value;
        this.timeType =  this.infoData.timeType;
        this.checkedList = this.infoData.checkedList;
        this.rlueShow = true
        this.showRlue = true
        // this.startValue = this.infoData.start_time;
        // this.endValue = this.infoData.end_time;
        this.startValue = moment(this.infoData.start_time);
        this.endValue = moment(this.infoData.end_time);

        this.disableWeek()
      },
      //  获取定时规则
      getTimerListFn(){
        getTimerList({
          page:this.current
        }).then(res =>{
          if(res.code === 0){
            console.log(res.data)
            if(JSON.stringify(res.data) === '{}'){
              console.log('是对象')
              this.data = []
            }else{
              console.log('是数组')
              this.data = res.data
            }
            this.page = res.pages
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      },
      toDate(time){
        console.log(parseInt(time))
        let times = parseInt(time)
        let dateTime = moment(times).format('YYYY-MM-DD HH:mm:ss')
        let dates = moment(dateTime).format("YYYY-MM-DD")
        console.log(dateTime)
        return dates
      },
      pagechanges(page, pagesize){
        this.current = page
        this.getTimerListFn()
      },
      getCountryList(){
        let _this = this
        _this.countrySelect =[]
        country_list({
          type:1
        }).then((res)=>{
          if(res.code === 0){
            if(res.data.NA){
              res.data.NA.forEach(function(country){
                _this.countrySelect.push({
                  title:country.code,
                  value:country.title
                })
              })
            } 
            if(res.data.EU){
              res.data.EU.forEach(function(country){
                _this.countrySelect.push({
                  title:country.code,
                  value:country.title
                })
              })
            }
            if(res.data.FE){
              res.data.FE.forEach(function(country){
                _this.countrySelect.push({
                  title:country.code,
                  value:country.title
                })
              })
            }
          }
        })
      },
      Tabcallback(key){
        if(key === '1'){
          this.showTabOne = true
          this.showTabTow = false
        }else if(key === '2'){
          this.showTabOne = false
          this.showTabTow = true
          this.getTimerListFn();
        }
      }
    },
    created(){
      this.getTimerListFn()
      this.getCountryList();
      
    },
    mounted(){

    },
    updataed(){},
    destroyed(){}
  }
</script>
<style scoped lang='less'>
  .tal{text-align: left;}
  .tar{text-align: right;}
  .mr-sm{margin-right:5px;}
</style>