<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-row>
      <a-col :span='2'>问题描述</a-col>
      <a-col :span='22'>
        <a-textarea v-model='txt' placeholder="请输入问题描述" :rows="6"/>
      </a-col>
    </a-row>
    <a-row class='mt'>
      <a-col :span='2'>上传图片</a-col>
      <!-- <input type="file" ref="inputer" id="fileExport" @change='selectImage()'> -->
      <a-col :span='22'>
        <a-upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture"
          :defaultFileList="fileList"
          class="upload-list-inline"
          @change="handleChange"
        >
          <a-button>
            <a-icon type="upload" /> 上传图片
          </a-button>
        </a-upload>
      </a-col>
    </a-row>
    <a-row class="mt">
      <a-col offset='11'>
        <a-button type='primary' @click='subFeedback'>提交</a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { uploadImg ,subFeedback} from '@/api/myinfo'
export default {
  name: 'feedback',
  data () {
    return {
      fileList: '',
      fileName: '',
      txt:"",
      goodsimg:[],
      goodsimgs:"",
    }
  },
  methods: {
    subFeedback(){
      if(!this.txt){
        this.$notification.error({
          message:'提醒',
          description: '描述内容不能为空',
        });
      }else{
        if(this.fileList.length > 0){
          this.fileList.forEach((item)=>{
            this.goodsimg=this.goodsimg.concat(item.url) 
          })
          this.goodsimgs = JSON.stringify(this.goodsimg)
          this.goodsimgs = this.goodsimgs.replace(/\[|]/g,'').replace(/"/g,'')
          subFeedback({
            content:this.txt,
            accessory:this.goodsimgs
          }).then(res=>{
            if(res.code === 0){
              this.$notification.success({
                message:'成功',
                description: res.msg,
              });
              this.$router.push({
                // path:"/systemSetings/myInfo/myinfos"
                path:"/home"
              })
              // this.$router.go(0)
              this.goodsimgs=[];
            }else{
              this.$notification.error({
                message:'失败',
                description: res.msg,
              });
              this.goodsimgs=[];
            }
          })
        }else{
          subFeedback({
            content:this.txt,
          }).then(res=>{
            if(res.code === 0){
              this.$notification.success({
                message:'成功',
                description: res.msg,
              });
              this.$router.push({
                path:"/home"
              })
              this.goodsimgs=[];
            }else{
              this.$notification.error({
                message:'失败',
                description: res.msg,
              });
              this.goodsimgs=[];
            }
          })
        }
      }
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        console.log("done")
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },

    handleChange ({ fileList ,file}) {
      console.log(fileList,file)
      this.fileName = file.thumbUrl
      this.fileList = fileList
      
      if(file.status == "done"){
        
      this.fileList.forEach((item,index)=>{
        if(!item.url){
        uploadImg({
          file:item.thumbUrl
          }).then((res)=>{
          if(res.code === 0){
            this.fileList[index].url= res.data.url
            }
          })
          }
        })
        console.log(this.fileList)
      }
    },
  },
  created(){
  },
  mounted(){
  }
}
</script>
<style scoped lang='less'>
  .mt{margin-top:20px; }


</style>
<style scoped>
  /* tile uploaded pictures */
  .upload-list-inline >>> .ant-upload-list-item {
    float: left;
    width: 200px;
    margin-right: 8px;
  }
  .upload-list-inline >>> .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
  }
  .upload-list-inline >>> .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
  }
</style>

