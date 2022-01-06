<template>
  <div>
    <div>
      {{ nWidth }}
      <draggable
        v-model="fileList"
        :options="{ animation: 200 }"
        style="display: flex; flex-wrap: wrap; min-width:200px"
      >
        <div class="image-box mr-sm" v-for="(item, index) in fileList" :key="index">
          <img :src="item.url" alt="" class="image-box-item over-hidden" :onerror="defaultImg" />
          <div class="mask-layer"></div>
          <a-icon type="eye" class="icon-eye" @click="lookBigImage(item.url, item)" />
          <a-icon type="delete" class="icon-delete" @click="deleteImage(item.uid)" />
          <!-- <a-icon type="home" class="icon-home" @click="setHomeImage(item.uid, fileList)"/> -->
          <a-icon type="plus" class="icon-add" @click="addImage(item.url)" />
          <!-- <a-icon type="scissor" class="icon-scissor" @click="editeImg(item.url, item)"/> -->
          <!-- <a-icon type="swap" class="icon-swap" @click="translationImg(item.url, item)"/> -->
          <!-- <a-icon v-if="item.imgSetStatus" type="rollback" class="icon-back" @click="revokeImg(item.url, item)"/> -->
        </div>
      </draggable>
      <div class="upload-box" @mouseover="showUpload" @mouseleave="hideUpload">
        <div class="mt-lg">
          <div>
            <a-icon type="plus" />
          </div>
          上传图片
        </div>
        <div v-show="showUploadBox" class="upload-child-box">
          <div>
            <a-upload
              :action="this.GLOBAL.BASE_URL + 'api/b1/product/upload?token=' + this.token"
              :multiple="true"
              :defaultFileList="fileList"
              listType="picture"
              :fileList="fileList"
              @preview="handlePreview"
              @change="handleChange"
              :remove="removes"
            >
              <div>
                <a-button>本地上传</a-button>
              </div>
            </a-upload>
          </div>
          <div>
            <a-button @click="uploadNetwork">网络图片</a-button>
          </div>
        </div>
      </div>
      <div>
        <one-click-stretch @ToFileList="ToFileList" :fileList="fileList"> </one-click-stretch>
      </div>
      <a-modal v-if="previewVisible" :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img v-if="previewImage" id="imgbox-attr" alt="example" style="width: 100%" :src="previewImage" />
        <a-row class="mt">
          <a-col v-if="nWidth" :span="4" offset="3">
            <span>{{ nWidth }} X {{ nHeight }}</span>
          </a-col>
          <a-col offset="17">
            <a-button @click="toMeitu(previewImage)">在线美图</a-button>
          </a-col>
        </a-row>
      </a-modal>
    </div>
    <a-form-item
      class="tar"
      :wrapperCol="{
        md: { span: 20, offset: 0 },
        lg: { span: 20, offset: 1 },
        xl: { span: 20, offset: 1 },
        xxl: { span: 20, offset: 2 }
      }"
    >
      <a-button
        v-show="false"
        type="primary"
        style="margin-left:30px; width:100px;"
        :loading="subloading"
        @click="updateImgContent"
        >保存</a-button
      >
    </a-form-item>
    <!-- 网络图片上传 -->
    <a-modal title="网络图片上传" :visible="NetworkInput" @ok="NetworkPicOk" @cancel="NetworkCancel">
      <div>
        <a-textarea v-model="networkUrl" placeholder="请填写图片URL链接，Enter换行输入多个图片链接" :rows="4" />
      </div>
    </a-modal>
    <a-modal title="选择翻译语言" :visible="countryvisible">
      <a-select style="width: 240px; margin:0 aotu" v-model="language">
        <a-select-option v-for="(item, index) in languageList" :value="item.code" :key="index">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <template slot="footer">
        <a-row type="flex" justify="end">
          <a-col>
            <a-button :loading="languageLoading" @click="countryhandleOk()">确认</a-button>
          </a-col>
        </a-row>
      </template>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import oneClickStretch from './oneClickStretch'
import {
  get_base,
  imgRessize,
  update_img,
  cutOutPic,
  transPic
} from '@/api/collect'
export default {
  name: '',
  props: ['allImg'],
  components: {
    //调用组件
    draggable,
    oneClickStretch
  },
  data() {
    return {
      fileList: [],
      token: '',
      previewVisible: false,
      previewImage: '',
      nWidth: '',
      nHeight: '',
      goodsimg: [],
      goodsimgs: '',
      fileID: '',
      fileName: '',
      loading: false,
      imgUrl: '',
      imgId: '',
      imgMain: '',
      M_URL: '',
      subloading: false,
      updateImgList: [],
      //网络图片
      showUploadBox: false,
      NetworkInput: false,
      networkUrl: '',
      defaultImg: 'this.src="' + require('@/assets/icons/picAlt.png') + '"', //默认图地址
      oriFileData: [],
      fileRandomNum: [],
      deletePic: [],
      countryvisible: false,
      languageList: [
        { name: '英语', code: 'en' },
        { name: '日语', code: 'ja' },
        { name: '法语', code: 'fr' },
        { name: '德语', code: 'de' },
        { name: '西班牙语', code: 'es' },
        { name: '意大利语', code: 'it' },
        { name: '阿拉伯语', code: 'ar' },
        { name: '葡萄牙语', code: 'pt' }
      ],
      language: 'en',
      languageLoading: false,
      transPicObj: null
    }
  },
  methods: {
    //一键抠图
    editeImg(url, item) {
      cutOutPic({
        image_url: url
      }).then(res => {
        if (res.code === 0) {
          item.url = res.data.url
          item.imgSetStatus = true
          console.log(res.data)
        }
      })
    },
    //图片翻译
    translationImg(url, item) {
      this.countryvisible = true
      this.transPicObj = item
    },
    //选择翻译语言确认
    countryhandleOk() {
      let _this = this
      this.languageLoading = true
      transPic({
        image_url: this.transPicObj.url,
        to: this.language
      }).then(res => {
        if (res.code === 0) {
          _this.fileList.forEach((item, index) => {
            if (item.uid == _this.transPicObj.uid) {
              item.url = res.data.url
              item.imgSetStatus = true
            }
          })
          _this.languageLoading = false
          _this.countryvisible = false
        } else {
          _this.languageLoading = false
          _this.$notification.error({
            message: '失败',
            description: res.msg
          })
        }
      })
    },
    //还原
    revokeImg(url, item) {
      if (this.oriFileData.length) {
        this.oriFileData.forEach((itm, idx) => {
          if (item.uid == itm.uid) {
            item.url = itm.url
            item.imgSetStatus = false
          }
        })
      }
    },
    // 获取商品信息  llll
    getBaseInfo() {
      let _this = this
      get_base({
        id: _this.goodsId
      }).then(res => {
        if (res.code === 0) {
          _this.data = res.data
          _this.cardLoading = false
          _this.fileList = res.data.image
          if (res.data.image && res.data.image.length) {
            _this.fileList.forEach((item, index) => {
              _this.fileRandomNum.push(item.uid)
            })
          }
          if (res.data.image) {
            _this.oriFileData = JSON.parse(JSON.stringify(res.data.image))
          }
        }
      })
    },
    lookBigImage(url, item) {
      this.previewVisible = false
      this.handlePreview(item)
    },
    deleteImage(id) {
      this.removes(id)
    },
    setHomeImage(id, fileList) {
      this.setMain(id)
    },
    // 添加图片至变体
    addImage(pic) {
      console.log(pic, 'pic')
      this.$emit('addVariant', pic)
    },
    handlePreview(file) {
      this.fileID = file.uid
      this.previewImage = file.url || file.thumbUrl
      console.log(this.previewImage)
      this.nWidth = 0
      this.nHeight = 0
      this.previewVisible = true
      setTimeout(() => {
        this.nWidth = document.getElementById('imgbox-attr').naturalWidth
        this.nHeight = document.getElementById('imgbox-attr').naturalHeight
      }, 300)
    },
    handleChange({ fileList, file }) {
      this.fileName = file.thumbUrl
      this.fileList = fileList
      this.fileList.forEach((item, index) => {
        if (item.status === 'done') {
          this.fileList[index].url = item.response.data.url
          if (item.uid == file.uid) {
            file.uid = this.setRandomNum()
            file.url = item.response.data.url
            this.fileList[index].uid = file.uid
            this.oriFileData.push(file)
          }
        }
      })
      // 刷新数组
      this.fileList.reverse().reverse()
      this.updateImgList = fileList
    },
    //设置上传文件随机uid
    setRandomNum() {
      let randomNum = Math.ceil(Math.random() * 1000)
      if (this.fileRandomNum.indexOf(randomNum) == -1) {
        this.fileRandomNum.push(randomNum)
        return randomNum
      } else {
        this.setRandomNum()
      }
    },
    removes(val) {
      this.fileList.forEach((item, inx) => {
        if (val === item.uid) {
          this.fileList.splice(inx, 1)
        }
      })
      this.oriFileData.forEach((item, inx) => {
        if (val === item.uid) {
          this.deletePic.push(item.url)
          this.oriFileData.splice(inx, 1)
        }
      })
      this.fileRandomNum.splice(this.fileRandomNum.indexOf(val), 1)

      this.$emit('getDeletePic', this.deletePic)
    },
    changePic() {
      let data = []
      let arr = []
      for (var i = 0; i < this.fileList.length; i += 5) {
        data.push(this.fileList.slice(i, i + 5))
      }
      this.loading = true
      let num = 0
      data.forEach((item, index) => {
        this.changePicAll(item)
          .then(res => {
            if (res) {
              res.forEach((itm, idx) => {
                arr.push(itm)
              })
            }
            return arr
          })
          .then(res => {
            num++
            if (arr.length == this.fileList.length) {
              this.fileList = arr
              this.loading = false
              this.$notification.success({
                message: '成功',
                description: '拉伸成功'
              })

              let stretchData = []
              this.fileList.forEach((item, index) => {
                if (this.oriFileData.length) {
                  this.oriFileData.forEach((itm, idx) => {
                    if (item.uid == itm.uid) {
                      let obj = {
                        ori_url: itm.url,
                        new_url: item.url
                      }
                      stretchData.push(obj)
                    }
                  })
                }
              })
              this.$emit('getFileList', stretchData)
            } else {
              if (num == data.length) {
                this.$notification.error({
                  message: '错误',
                  description: '拉伸失败'
                })
                this.loading = false
              }
            }
          })
      })
    },
    //  一个请求多张拉伸
    changePicAll(obj) {
      let picUrl = ''
      let picId = ''
      obj.forEach((item, index) => {
        picUrl += item.url + '^'
        picId += item.uid + '^'
      })
      this.imgUrl = picUrl.slice(0, -1)
      this.imgId = picId.slice(0, -1)
      return imgRessize({
        width: 1600,
        height: 1600,
        ids: this.imgId,
        img_array: this.imgUrl
      }).then(res => {
        if (res.code === 0) {
          return res.data
        } else {
          return false
        }
      })
    },
    //更新的数据添加到商品图库
    ToFileList(value) {
      this.fileList = value
      let stretchData = []
      if (this.fileList.length) {
        this.fileList.forEach((item, index) => {
          if (this.oriFileData.length) {
            this.oriFileData.forEach((itm, idx) => {
              if (item.uid == itm.uid) {
                let obj = {
                  ori_url: itm.url,
                  new_url: item.url
                }
                stretchData.push(obj)
              }
            })
          }
        })
        this.$emit('getFileList', stretchData)
      }
    },
    //  图片单个拉伸
    changePicList() {
      var _this = this
      _this.loading = true
      let picUrl = ''
      let arrurl = []
      for (var i = 0; i < _this.fileList.length; i++) {
        ;(function(a, list) {
          setTimeout(function() {
            imgRessize({
              width: 1600,
              height: 1600,
              img_array: list.url,
              ids: list.uid
            }).then(res => {
              if (res.code === 0) {
                arrurl.push(res.data[0])
                console.log(_this.fileList.length, a, 'over1', i)
                if (_this.fileList.length === i) {
                  _this.loading = false
                  _this.$notification.success({
                    message: '提醒',
                    description: res.msg
                  })
                }
                _this.fileList = arrurl
              } else {
                this.loading = false
              }
            })
          }, a * 500) //500代表间隔
        })(i, _this.fileList[i])
      }
    },
    handleCancel() {
      this.nWidth = ''
      this.nHeight = ''
      this.previewVisible = false
    },
    setMain(id) {
      this.fileID = id
      this.fileList.forEach((item, index) => {
        if (this.fileID === this.fileList[index].uid) {
          this.imgMain = this.fileList.splice(index, 1)
          this.fileList.unshift(this.imgMain[0])
        }
      })
      this.previewVisible = false
    },
    toMeitu(picUrl) {
      this.M_URL = {}
      this.M_URL.pic_URL = ''
      this.M_URL.file_ID = ''
      Vue.ls.set('monitor_URL', this.M_URL)
      if (this.GLOBAL.IS_E) {
        if (this.GLOBAL.PROTOCOL === 'http:') {
          window.open('https://erp.yunzanet.com/beautify/index.html?url=' + picUrl + '&index=' + this.fileID + '&type=' + '1' +
            '&base_url=' + this.GLOBAL.BASE_URL + '&token=' + Vue.ls.get('Access-Token'))
        } else {
          window.open(this.GLOBAL.BASE_URL + 'beautify/index1.html?url=' + picUrl + '&index=1' + '&type=' + this.fileID + '&token=' + Vue.ls.get('Access-Token'))
        }
      } else {
        window.open(this.GLOBAL.BASE_URL + 'beautify/index1.html?url=' + picUrl + '&index=1' + '&type=' + this.fileID + '&token=' + Vue.ls.get('Access-Token'))
      }
      const clearTime = setInterval(() => {
        if (Vue.ls.get('monitor_URL').file_ID) {
          window.clearInterval(clearTime)
          this.previewImage = Vue.ls.get('monitor_URL').pic_URL
          this.fileList.forEach((item, index) => {
            if (item.uid == Vue.ls.get('monitor_URL').file_ID) {
              this.fileList[index].url = Vue.ls.get('monitor_URL').pic_URL
              this.previewVisible = false
              this.handleCancel()
              this.M_URL = {}
              this.M_URL.pic_URL = ''
              this.M_URL.file_ID = ''
              Vue.ls.set('monitor_URL', this.M_URL)
            }
          })
          this.fileID = Vue.ls.get('monitor_URL').file_ID

          let stretchData = []
          if (this.fileList.length) {
            this.fileList.forEach((item, index) => {
              if (this.oriFileData.length) {
                this.oriFileData.forEach((itm, idx) => {
                  if (item.uid == itm.uid) {
                    let obj = {
                      ori_url: itm.url,
                      new_url: item.url
                    }
                    stretchData.push(obj)
                  }
                })
              }
            })
            this.$emit('getFileList', stretchData)
          }
        }
      }, 500)
    },
    //提交
    updateImgContent(type) {
      console.log('执行提交了')
      let _this = this
      this.subloading = true
      let data = []
      if (this.fileList.length) {
        this.fileList.forEach((item, index) => {
          if (this.oriFileData.length) {
            this.oriFileData.forEach((itm, idx) => {
              if (item.uid == itm.uid) {
                let obj = {
                  ori_url: itm.url,
                  new_url: item.url
                }
                data.push(obj)
              }
            })
          }
        })
      }
      if (this.addNewProduct == 1) {
        if (this.$store.state.tabStatus.goodsId) {
          this.goodsId = this.$store.state.tabStatus.goodsId
        } else {
          this.subloading = false
          this.$notification.error({
            message: '错误',
            description: '请先填写基本信息'
          })
          return
        }
      }
      update_img({
        id: this.goodsId,
        // image:this.goodsimgs
        image: data
      })
        .then(res => {
          if (res.code == 0) {
            this.goodsimg = []
            this.subloading = false
            // this.$store.commit('set_subTabtwo',true)
            if (type === 'forbid') {
            } else {
              this.$notification.success({
                message: '提醒',
                description: res.msg
              })
            }
          } else {
            this.goodsimg = []
            this.subloading = false
            // this.$store.commit('set_subTabtwo',true)
            if (type === 'forbid') {
            } else {
              this.$notification.error({
                message: '失败',
                description: res.msg
              })
            }
          }
        })
        .catch(() => {
          let _this = this
          _this.subloading = false
          _this.$notification.error({
            message: '提醒',
            description: '商品图片保存访问超时，请重新操作'
          })
          // this.$store.commit('set_subTabtwo','error')
        })
    },
    cancel() {
      this.$emit('commonSignOut')
    },

    // 网络图片
    showUpload() {
      this.showUploadBox = true
      console.log(this.showUploadBox)
    },
    hideUpload() {
      this.showUploadBox = false
      console.log(this.showUploadBox)
    },
    uploadNetwork() {
      this.NetworkInput = true
    },
    NetworkCancel() {
      this.NetworkInput = false
    },
    NetworkPicOk() {
      console.log(this.networkUrl)
      let reg = /\n/g
      var strs = new Array() //定义一数组
      strs = this.networkUrl.split(reg)
      console.log(strs)

      strs.forEach((item, index) => {
        let urlObj = {
          status: 0,
          uid: 0,
          url: ''
        }
        urlObj.uid = this.fileList.length + 1
        urlObj.url = item
        this.fileList.push(urlObj)
        this.oriFileData.push(urlObj)
      })
      console.log(this.fileList)
      this.NetworkInput = false
      this.networkUrl = ''
    }
  },
  mounted() {
    this.token = Vue.ls.get('Access-Token')

    console.log(this.$store.state.tabStatus.goodsId, 'idddd')
    console.log(this.$route.query.id)
    this.$route.query.id ? (this.goodsId = this.$route.query.id) : (this.goodsId = this.$store.state.tabStatus.goodsId)
    // this.goodsId = this.$store.state.tabStatus.goodsId;
    this.site = this.$route.query.site
    // this.$store.commit('set_Tabtwo',true)
    this.addNewProduct = this.$route.query.type
    // if(this.addNewProduct == 0) {
    this.getBaseInfo()
    // }
    // console.log(this.allImg,'allImg')
  }
}
</script>
<style lang="less" scoped>
.ml {
  margin-left: 20px;
}
.ml-s {
  margin-left: 10px;
}
.mt {
  margin-top: 10px;
}
.mr {
  margin-right: 10px;
}
.ml-sm {
  margin-left: 5px;
}
.mr-sm {
  margin-right: 5px;
}
//网络图片上传
.upload-box {
  position: relative;
  border: 1px dashed #d9d9d9;
  width: 104px;
  height: 104px;
  border-radius: 4px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
  -webkit-transition: border-color 0.3s ease;
  transition: border-color 0.3s ease;
  vertical-align: top;
  margin-right: 8px;
  margin-bottom: 8px;
  display: table;
  .upload-child-box {
    position: absolute;
    top: 0;
    left: 102px;
    width: 100px;
    height: 100px;
  }
}

.formcolor {
  background: #fff;
  padding: 25px 0 1px;
}
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0, 0, 0, 0.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
.pic-box {
  display: flex;
  flex-wrap: wrap;
  width: 660px;
  .pic {
    width: 100px;
    height: 150px;
    margin-right: 10px;
    img {
      width: 100%;
    }
    .btns {
      width: 100%;
      text-align: center;
    }
  }
}
.uploadimg {
  width: 100px;
}
.tal {
  text-align: left;
}
.tar {
  text-align: right;
}
.dis-flex {
  display: flex;
}
.rt {
  float: right;
}
.ant-select-selection-selected-value > .tal > .anticon-right {
  display: none;
}
.dis-flex {
  display: flex;
  flex-wrap: wrap;
}
.image-box {
  width: 104px;
  height: 104px;
  margin-bottom: 5px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  position: relative;
}
.image-box-item {
  width: 86px;
  height: 86px;
  margin: 8px 8px 8px 8px;
}
.mask-layer {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 86px;
  height: 86px;
  background: rgba(41, 41, 41, 0.6);
  color: #ffffff;
  opacity: 0;
  transition: all 0.5s;
  -moz-transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  z-index: 9;
}
.image-box:hover .mask-layer {
  opacity: 0.7;
}
.icon-eye {
  cursor: pointer;
  position: absolute;
  top: 74%;
  left: 30%;
  color: white;
  display: none;
  z-index: 100;
  font-size: 16px;
}
.icon-delete {
  cursor: pointer;
  position: absolute;
  top: 74%;
  left: 60%;
  color: white;
  display: none;
  z-index: 100;
  font-size: 16px;
}
.icon-home {
  cursor: pointer;
  position: absolute;
  top: 74%;
  left: 60%;
  color: white;
  display: none;
  z-index: 100;
  font-size: 16px;
}
.icon-add {
  width: 14px;
  height: 14px;
  cursor: pointer;
  position: absolute;
  color: white;
  top: 20%;
  left: 30%;
  display: none;
  z-index: 100;
  font-size: 44px;
}
.image-box:hover .icon-eye {
  display: block;
}
.image-box:hover .icon-delete {
  display: block;
}
.image-box:hover .icon-home {
  display: block;
}
.image-box:hover .icon-add {
  display: block;
}
// .icon-add , .icon-home , .icon-delete ,.icon-eye{display: block;}
</style>
<style>
.show {
  display: block !important;
}
.hide {
  display: none !important;
}
.ant-upload-list-picture-card {
  display: none;
}
.over-hidden {
  overflow: hidden;
}
.beyondClass {
  color: red;
}
.limitTip {
  margin-left: 10px;
}
</style>
<style scoped>
.custom-icons-list >>> .anticon {
  margin-right: 6px;
}
</style>
