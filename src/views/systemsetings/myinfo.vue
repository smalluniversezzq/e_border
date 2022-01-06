<template>
  <div>
    <a-card :bordered="false">
      <a-row >
        <a-col :md="4" :lg="4" :xl="4" :xxl="2">
          <span class='title-xl'>账户信息</span>
        </a-col>
        <a-col :md="14" :lg="14" :xl="12" :xxl="10">
          <a-row type="flex" align="middle">
            <a-col :span='6'>
              <span>头像&nbsp;:</span>
            </a-col>
            <a-col  :span='18'>
              <a-avatar v-if='avatar'  shape="square" :size="64" :src='avatar'/>
              <a-avatar v-if='!avatar' shape="square" :size="64" icon="user"/>
            </a-col>
              <!-- :beforeUpload="beforeUpload" -->
             <!-- @preview="handlePreview" -->
          </a-row>
          <a-row class='mt' type="flex"  align="middle">
            <a-col  :span='6'>
              <span>用户名&nbsp;:</span>
            </a-col>
            <a-col  :span='18'>
              <span>{{info.username}}</span>
            </a-col>
          </a-row>
          <a-row v-if='infoType === "1"' type="flex" class='mt' align="middle">
            <a-col :span='6'>
              <span>手机号&nbsp;:</span>
            </a-col>
            <a-col :span='18'>
              <span>{{info.mobile}}</span>
            </a-col>
          </a-row>
           <a-row  type="flex" class='mt' align="middle">
            <a-col :span='6'>
              <span>到期时间&nbsp;:</span>
            </a-col>
            <a-col :span='18'>
              <span>{{info.end_at}}</span>
            </a-col>
          </a-row>
        </a-col>
         <!-- :xxl='2' :xl="2" :lg="2" :md="24" :sm="24" :xs="24" -->
        <a-col :md="4" :lg="4" :xl="4" :xxl="3" style="margin-left:12px;">
          <a-row>
              <!-- action="https://www.mocky.io/v2/5cc8019d300000980a055e76" -->
            <a-col id="impoants">
              <a-upload
              :action="this.GLOBAL.BASE_URL+'api/b1/product/upload?token='+this.token"
              listType="picture-card"
              :fileList="fileList"
              @change="handleChange"
              >
              <a-button style="width:102px;">
                  编辑头像
              </a-button>
            </a-upload>
            </a-col>
            <a-col v-if='infoType === "1"' style='margin-left:8px; margin-top:60px;'>
              <a-button @click='toupinfo()'>修改手机号</a-button>
            </a-col>
          </a-row>
        </a-col >
    </a-row>
    <a-row class='mt-xl'>
      <a-col :md="4" :lg="4" :xl="4" :xxl="2">
        <span class='title-xl'>认领设置</span>
      </a-col>
      <a-col :md="14" :lg="14" :xl="12" :xxl="10">
        <a-row class='mb'>
          <a-col :span='6'> 
            <a-switch v-model='claimSwitchType' @change="claimSwitch" />
          </a-col>
          <a-col :span='18' v-show='claimSwitchType'>
            <!-- {{claimSwitchState}} -->
            <a-radio-group  :default-value="'1'"  v-model='claimSwitchState' >
              <a-radio :value="'1'">
                默认认领Amazon
              </a-radio>
              <a-radio :value="'2'">
                默认认领Shopee
              </a-radio>
            </a-radio-group> 
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="4" :lg="4" :xl="4" :xxl="4" class='ml'>
        <a-button style="width:102px;" @click='subClaim()'>保存</a-button>
      </a-col>
    </a-row>
     <a-row class='mt-xl' v-if='consignorInfo'>
       <a-col :md="4" :lg="4" :xl="4" :xxl="2">
         <span class='title-xl'>发货人信息</span>
       </a-col>
       <a-col :md="14" :lg="14" :xl="12" :xxl="10">
          <a-row class='mb'>
            <a-col :span='6'>发货人&nbsp;：</a-col>
            <a-col :span='18'>
              <span v-if='showEdit==="0"' >{{consignorInfo.name}}</span>
              <a-input v-if='showEdit==="1"' v-model='consignorInfo.name'></a-input>
            </a-col>
          </a-row>
          <a-row class='mb'>
            <a-col :span='6'>手机号&nbsp;：</a-col>
            <a-col :span='18'>
              <span v-if='showEdit==="0"' >{{consignorInfo.phone}}</span>
              <a-input v-if='showEdit==="1"' v-model='consignorInfo.phone'></a-input>
            </a-col>
          </a-row>
          <a-row class='mb'>
            <a-col :span='6'>州/省&nbsp;：</a-col>
            <a-col :span='18'>
              <span v-if='showEdit==="0"'  >{{consignorInfo.state}}</span>
              <a-input v-if='showEdit==="1"' v-model='consignorInfo.state'></a-input>
            </a-col>
          </a-row>
          <a-row class='mb'>
            <a-col :span='6'>城市&nbsp;：</a-col>
            <a-col :span='18'>
              <span v-if='showEdit==="0"'  >{{consignorInfo.city}}</span>
              <a-input v-if='showEdit==="1"' v-model='consignorInfo.city'></a-input>
            </a-col>
          </a-row>
          <a-row class='mb'>
            <a-col :span='6'>区/县&nbsp;：</a-col>
            <a-col :span='18'>
              <span v-if='showEdit==="0"'  >{{consignorInfo.district}}</span>
              <a-input v-if='showEdit==="1"' v-model='consignorInfo.district'></a-input>
            </a-col>
          </a-row>
          <a-row class='mb'>
            <a-col :span='6'>街道详细地址&nbsp;:</a-col>
            <a-col :span='18'>
              <span v-if='showEdit==="0"'  >{{consignorInfo.street}}</span>
              <a-input v-if='showEdit==="1"' v-model='consignorInfo.street'></a-input>
            </a-col>
          </a-row>
          <a-row class='mb'>
            <a-col :span='6'>邮编&nbsp;:</a-col>
            <a-col :span='18'>
              <span v-if='showEdit==="0"'  >{{consignorInfo.post_code}}</span>
              <a-input v-if='showEdit==="1"' v-model='consignorInfo.post_code'></a-input>
            </a-col>
          </a-row>
       </a-col>
       <a-col :md="4" :lg="4" :xl="4" :xxl="4" class='ml'>
         <a-button style="width:102px;" v-if='showEdit==="0"' @click='showEdits()'>修改信息</a-button>
         <a-button style="width:102px;" v-if='showEdit==="1"' @click='subEdit()'>保存修改</a-button>
       </a-col>
      </a-row>
    </a-card>
     <!-- v-if='this.$store.state.user.type =="1"' -->
    <a-card :bordered="false" v-if='false' >
      <a-row class="mt">
        <a-col>
          <div class="table-operator" >
            <a-button type="primary" icon="plus" @click="toaddrole">添加子账号</a-button>
          </div>
        </a-col>
      </a-row>
      <!-- 子账号列表 -->
      <a-table
      v-if='data.length'
      :dataSource="data"
      rowKey="id">
        <a-table-column
          title="id"
          dataIndex="uid"
        />
        <a-table-column
          title="用户名"
          dataIndex="username"
        />
        <a-table-column
          title="手机号"
          dataIndex="mobile"
        />
        <a-table-column
          title="角色"
          dataIndex="title"
        >
        </a-table-column>
        <a-table-column
          title="操作"
        >
          <template slot-scope="text, record">
            <a-button type="primary" @click='uploaduser(record.uid, record.title)' class='mr'>编辑</a-button>
            <span>
              <a-button type="danger" @click='childdel(record.uid)'>删除</a-button>
              <!-- <a >删除</a> -->
              <a-modal
                title="删除"
                :visible="visible"
                @ok="handleOk"
                :confirmLoading="confirmLoading"
                @cancel="handleCanceldel"
              >
              <p>{{ModalText}}</p>
              </a-modal>
            </span>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </div>
</template>
<script>
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
import Vue from 'vue'
import { childdel ,getaddresslist ,upaddress ,deladdress ,updataCrawlConfig} from '@/api/manage'
import { uploadAvatar ,userPersonal } from '@/api/myinfo'
export default {
  // 子账号
  name: 'role',
  components: {
  },
  data () {
    return {
      group:"",
      data:'',
      info:"",
      permission:"",
      visible:false,
      confirmLoading: false,
      delid:"",
      ModalText:"确定要删除吗",
      selectAll:"",
      selectkey:"",
      ids:"",
      headers: {
        authorization: 'authorization-text',
      },
      imageUrl:"",
      fileList:[],
      loading:false,
      avatar:"",
      balance:"",
      consignorInfo:"",
      showEdit:"0",
      infoType:"",
      claimSwitchType:"",
      claimSwitchState:1,
      token:"",
    }
  },
  mounted:function(){
    this.getuserPersonal()
    this.getaddresslists()
    this.token = Vue.ls.get('Access-Token')
  },
  methods: {
    childdel(uid){
      this.visible = true
      this.delid = uid
    },
    // 获取 自动认领  updataCrawlConfig
    del(){
      childdel({id:this.delid}).then(res => {
        if(res.code === 0){
          this.$notification.success({
            message:'成功',
            description: res.msg,
          });
        }else{
          this.$notification.error({
          message:'提醒',
          description: res.msg,
          });
        }
      })
    },
    showEdits(){
      this.showEdit = '1'
    },
    subEdit(){
      // this.showEdit = '0'\
      if(!this.consignorInfo.name){
        this.subErr("用户名不能为空")
      }else if(!this.consignorInfo.phone){
         this.subErr("手机号不能为空")
      }else if(!this.consignorInfo.state){
         this.subErr("省/州不能为空")
      }else if(!this.consignorInfo.city){
         this.subErr("城市不能为空")
      }else if(!this.consignorInfo.district){
         this.subErr("区/县不能为空")
      }else if(!this.consignorInfo.street){
        this.subErr("街道 详细地址不能为空")
      }else if(!this.consignorInfo.post_code){
        this.subErr("邮编不能为空")
      }else{
        upaddress({
          name:this.consignorInfo.name,
          phone:this.consignorInfo.phone,
          state:this.consignorInfo.state,
          city:this.consignorInfo.city,
          district:this.consignorInfo.district,
          street:this.consignorInfo.street,
          post_code:this.consignorInfo.post_code
        }).then(res=>{
          if(res.code === 0){
            this.showEdit = '0'
            this.getaddresslist()
            this.subSuccess("修改成功")
          }
        })
        console.log(this.showEdit,"000")
      }
    },
    subErr(val){
      this.$notification.error({
      message:'提醒',
      description: val,
      });
    },
    subSuccess(val){
    this.$notification.success({
      message:'成功',
      description: val,
      });
    },
    handleOk(e) {
      this.del()
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
        this.ModalText = '确定要删除吗'
      }, 1000);
    },
    handleCanceldel(e) {
      this.visible = false
    },
    toaddrole(){
      this.$router.push({
        path:'/power/adduser'
      })
    },
    toupinfo(){
      this.$router.push({
        path:'/systemSetings/myInfo/upphone',
        query:{
          mobile:this.info.mobile
        }
      })
    },
    uppwd(){
      this.$router.push({
        path:'/systemSetings/myInfo/uppwd',
      })
    },
    //  图片上传
    handleChange (info) {
      console.log("info",info)
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    handleChange ({ fileList ,file}) {
      console.log(file,"file-------",file.thumbUrl)
      this.fileName = file.thumbUrl
      this.fileList = fileList
        console.log("this.fileName",this.fileName)
      if(file.status == "done"){
      uploadAvatar({
        avatar:this.fileName
      }).then((res)=>{
        if(res.code === 0){
          this.avatar = res.data.url;
          this.$store.commit('SET_AVATAR', res.data.url)
          this.$notification.success({
            message:'成功',
            description: res.msg,
          });
          }else{
            this.$notification.error({
              message:'提醒',
              description: res.msg,
            });
          }
        })

      }
    },
    fund(){
      this.$router.push({
        path:"/rechange/fund"
      })
    },
    uploaduser(uid, title){
      this.$router.push({
        path:"/systemSetings/myInfo/uploaduser",
        query:{
          id:uid,
          title: title
        }
      })
    },
    //获取用户信息
    getuserPersonal(){
      userPersonal().then((res)=>{
        if(res.code === 0){
          this.info = res.data.userInfo;
          this.infoType = res.data.userInfo.type;
          this.avatar = res.data.userInfo.avatar;
          this.balance = res.data.balance;
          this.claimSwitchState = res.data.userInfo.crawl
          this.claimSwitchType = res.data.userInfo.crawl == '0' ? false : true
          console.log('this.avatar',this.avatar)
          if(this.avatar){
            this.$store.commit('SET_AVATAR',this.avatar)
          }
          // this.$notification.success({
          //   message: '成功',
          //   description:res.msg,
          // });
        }else{
          this.$notification.error({
            message: '错误',
            description:res.msg,
          });
        }
      })
    },
    getaddresslists(){
      getaddresslist({}).then(res =>{
        if(res.code === 0){
          console.log(res.data)
          this.consignorInfo = res.data
        }
      })
    },
    claimSwitch(checked){
      this.claimSwitchType = checked
      if(checked){
        this.claimSwitchState = '1'
      }
      console.log(`a-switch to ${checked}`);
    },
    onchangeClaimSwitch(e){
      console.log('radio checked', e);
    },
    subClaim(){
      console.log(this.claimSwitchType,this.claimSwitchState)
      let crawl = ''
      crawl = this.claimSwitchType ? this.claimSwitchState:'0'
      console.log(crawl)
      updataCrawlConfig({
        crawl:crawl
      }).then((res)=>{
        if(res.code === 0){
          this.$notification.success({
            message: '成功',
            description:res.msg,
          });
        }else{
          this.$notification.error({
            message: '错误',
            description:res.msg,
          });
        }
      })
    },
  },

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
  .mt{margin-top:20px;}
  .mb{margin-bottom:20px;}
  .mr{margin-right:20px;}
  .ml{margin-left:20px;}
  .mt-xl{margin-top:50px;}
  .title-xl{font-size:18px; font-weight: 800}
  .tar{text-align: right;}
</style>
<style scoped lang='less'>
.ant-modal-mask{
  background-color: rgba(0, 0, 0, 0.15) !important;
}

</style>
<style>
#impoants > span>.ant-upload-list{
  display:none;
}
#impoants > span> .ant-upload.ant-upload-select-picture-card{
  min-width: 1px !important;
  min-height: 1px !important;
  background-color:#fff !important;
  border:none !important;
  height: 1px;
  height: 1px;
}

.ant-modal-mask{
  background-color: rgba(0, 0, 0, 0.15) !important;
}
</style>

