<template>
  <div>
    <a-card>
      <!-- {{fileList}} -->
      <a-form-item
        label="添加图片"
        :labelCol="{ md: { span: 4 }, lg: { span: 4 }, xl: { span: 4 }, xxl: { span: 4 } }"
        :wrapperCol="{ md: { span: 17 }, lg: { span: 13 }, xl: { span: 13 }, xxl: { span: 8 } }"
      >
        <template>
          <div class="clearfix">
            <!-- <ImgDrap/> -->
            <draggable v-model="fileList" :options="{ animation: 200 }" style="display: flex; flex-wrap: wrap; ">
              <div class="image-box mr-sm" v-for="(item, index) in fileList" :key="index">
                <!-- {{item.url}} -->
                <img :src="item.url" alt="" class="image-box-item over-hidden" :onerror="defaultImg" />
                <!-- <img
              v-else
              style="width:100%;height:100%;display:block"
              :src="picAlt"
              alt="暂无图片信息"/> -->
                <div class="mask-layer"></div>
                <a-icon type="eye" class="icon-eye" @click="lookBigImage(item.url, item, index)" />
                <a-icon type="delete" class="icon-delete" @click="deleteImage(item.uid)" />
                <a-icon type="home" class="icon-home" @click="setHomeImage(item.uid, fileList)" />
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
                    :beforeUpload="beforeUpload"
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
              <!-- <a-button @click='changePic' :loading='loading'>一键拉伸图片</a-button> -->
              <one-click-stretch @ToFileList="ToFileList" :fileList="fileList"> </one-click-stretch>
            </div>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img id="imgbox-gallery" alt="example" style="width: 100%" :src="previewImage" />
              <a-row class="mt">
                <a-col v-if="nWidth" :span="4" offset="3">
                  <span>{{ nWidth }} X {{ nHeight }}</span>
                </a-col>
                <a-col offset="12">
<!--                  <a-dropdown :trigger="['click']">-->
<!--                    <a-button style="margin-left: 8px" @click="e => e.preventDefault()">-->
<!--                      一键智能 <a-icon type="down" />-->
<!--                    </a-button>-->
<!--                    <a-menu-->
<!--                      slot="overlay"-->
<!--                      @click="-->
<!--                        val => {-->
<!--                          editeImgs(val, index)-->
<!--                        }-->
<!--                      "-->
<!--                    >-->
<!--                      <a-menu-item key="1">-->
<!--                        <span>一键图片白底</span>-->
<!--                      </a-menu-item>-->
<!--                      <a-menu-item key="2">-->
<!--                        <span>一键图片翻译</span>-->
<!--                      </a-menu-item>-->
<!--                    </a-menu>-->
<!--                  </a-dropdown>-->
                  <a-button class="ml" @click="toMeitu(previewImage)">在线美图</a-button>
                  <!-- <a-button class='ml' @click='setMain()'>设置为主图</a-button> -->
                </a-col>
              </a-row>
            </a-modal>
            <!-- 网络图片上传 -->
            <a-modal title="网络图片上传" :visible="NetworkInput" @ok="NetworkPicOk" @cancel="NetworkCancel">
              <div>
                <a-textarea v-model="networkUrl" placeholder="请填写图片URL链接，Enter换行输入多个图片链接" :rows="4" />
              </div>
            </a-modal>
          </div>
        </template>
      </a-form-item>
      <a-form-item
        :wrapperCol="{
          md: { span: 20, offset: 0 },
          lg: { span: 20, offset: 1 },
          xl: { span: 20, offset: 1 },
          xxl: { span: 20, offset: 2 }
        }"
      >
        <a-button class="ml" style="margin-left:144px; width:100px;" @click="cancel()">取消</a-button>
        <a-button type="primary" style="margin-left:30px; width:100px;" :loading="subloading" @click="updateImgContent"
          >保存</a-button
        >
      </a-form-item>
    </a-card>
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
    <a-modal :title="titleText" :width="720" :visible="editeImgVisible" @cancel="editeImgCancel">
      <div class="mb">
        <a-checkbox :checked="selectAll" @change="onchange">
          选择全部
          <span v-if="editeStatus == 1">（图片说明：仅展示分辨率小于1200*1200像素，大小不超过2M的图片）</span>
        </a-checkbox>
      </div>
      <div style="display: flex; flex-wrap: wrap; ">
        <div class="image-box mr-sm" v-for="(item, index) in fileList" :key="index" @click="chooseImg(index)">
          <img :src="item.url" alt="" class="image-box-item over-hidden" :onerror="defaultImg" />
          <a-icon class="selectImg" :class="imgStatus[index] ? 'selectImg1' : ''" type="check-circle" theme="twoTone" />
        </div>
      </div>
      <template slot="footer">
        <a-row type="flex" justify="end">
          <a-col style="display: flex;align-items:center;">
            已选中{{ selectNum }}张，共计<span style="color:#ffad33">
              {{
                editeStatus == 1
                  ? (selectNum * $store.state.user.info.cut_fee).toFixed(2)
                  : (selectNum * $store.state.user.info.trans_fee).toFixed(2)
              }}元</span
            ><a class="ml" @click="tofund">去充值>>)</a>
          </a-col>
          <a-col class="ml">
            <a-tooltip placement="bottom" v-if="editeStatus == 1">
              <template slot="title">
                <span>图片格式：JPEG、JPG、PNG、BMP、WEBP</span>
              </template>
              <a-button type="primary" @click="editeImg">一键白底</a-button>
            </a-tooltip>
            <a-dropdown v-if="editeStatus == 2">
              <a-button type="primary" class="ml" @click="e => e.preventDefault()">
                一键翻译 <a-icon type="down"
              /></a-button>
              <a-menu slot="overlay" @click="translationImg">
                <a-menu-item key="2">
                  <span>中文——>英文</span>
                </a-menu-item>
                <a-menu-item key="1">
                  <span>中文——>日文</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button @click="editeImgCancel">关闭</a-button>
          </a-col>
        </a-row>
      </template>
    </a-modal>
    <a-modal class="jindutiao" :closable="false" :footer="false" :visible="editeResultStatus">
      <div>
        <a-progress :percent="jindu" :show-info="false" />
        <p style="text-align:center">正在处理中...</p>
      </div>
    </a-modal>
    <a-modal :title="titleText1" :width="720" :visible="editeImgVisible1" @cancel="editeImgCancel1">
      <div style="height:500px">
        <a-row style="height:100%">
          <a-col :span="6" class="hide_over">
            <p>已白底{{ editedFileList.length }}张</p>
            <div style="display: flex; flex-wrap: wrap; ">
              <div
                class="image-box mr-sm"
                :class="chooseImgIndex == index ? 'boder_color' : ''"
                v-for="(item, index) in editedFileList"
                :key="index"
                @click="chooseImg1(index)"
              >
                <img :src="item.new_url" alt="" class="image-box-item over-hidden" :onerror="defaultImg" />
              </div>
            </div>
          </a-col>
          <a-col :span="18" style="height:100%">
            <div class="mb">
              <a-row>
                <a-col>
                  <a-radio-group v-model="imgTab" @change="tabImg">
                    <a-radio-button value="1">
                      白底图
                    </a-radio-button>
                    <a-radio-button value="2">
                      原图
                    </a-radio-button>
                  </a-radio-group>
                  <a-checkbox :checked="keepOldImg" class="ml" v-if="titleText1 == '图片白底'" @change="onchange1">
                    保留原图
                  </a-checkbox>
                  <a-button-group style="margin-left:100px">
                    <a-button :disabled="chooseImgIndex == 0" @click="tabChange(1)">
                      上一张
                    </a-button>
                    <a-button :disabled="chooseImgIndex == editedFileList.length - 1" @click="tabChange(2)">
                      下一张
                    </a-button>
                  </a-button-group>
                </a-col>
              </a-row>
            </div>
            <div>
              <img :src="previewImg" alt="" style="display:block;width:100%;height:460px" />
            </div>
          </a-col>
        </a-row>
      </div>
      <template slot="footer">
        <a-row type="flex" justify="end">
          <a-col>
            <a-button type="primary" @click="saveProductImgs">保存</a-button>
            <a-button class="ml" @click="editeImgCancel1">关闭</a-button>
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
  transPic,
  saveProductImg
} from '@/api/collect'
export default {
  name: '',
  components: {
    //调用组件
    draggable,
    oneClickStretch
  },
  props: [],
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
      showUploadBox: false,
      NetworkInput: false,
      networkUrl: '',
      defaultImg: 'this.src="' + require('@/assets/icons/picAlt.png') + '"', //默认图地址
      fileRandomNum: [],
      oriFileData: [],
      postCount: 0,
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
      transPicObj: null,
      titleText: '',
      editeImgVisible: false,
      selectAll: false,
      editeType: '',
      imgStatus: [],
      editeStatus: null,
      selectNum: 0,
      editeResultStatus: false,
      editedFileList: [],
      jindu: 0,
      titleText1: '',
      editeImgVisible1: false,
      imgTab: '1',
      nextPreve: 0,
      keepOldImg: false,
      chooseImgIndex: 0,
      previewImg: ''
    }
  },
  methods: {
    // 获取商品信息  llll
    getBaseInfo() {
      let _this = this
      get_base({
        id: _this.goodsId //_this.goodsId
      }).then(res => {
        if (res.code === 0) {
          _this.data = res.data
          _this.cardLoading = false
          _this.fileList = res.data.image ? res.data.image : []
          if (res.data.image && res.data.image.length) {
            _this.fileList.forEach((item, index) => {
              _this.fileRandomNum.push(item.uid)
              _this.imgStatus.push(false)
            })
          }
          if (res.data.image) {
            _this.oriFileData = JSON.parse(JSON.stringify(res.data.image))
          }
        }
      })
    },
    lookBigImage(url, item, index) {
      this.imgStatus.splice(index, 1, true)
      this.previewVisible = false
      this.handlePreview(item)
    },
    deleteImage(id) {
      this.removes(id)
    },
    setHomeImage(id, fileList) {
      this.setMain(id)
    },
    //一键抠图
    editeImg() {
      let _this = this
      this.editeImgVisible = false
      this.selectAll = false
      this.editeResultStatus = true
      this.jindu = 50
      let obj = []
      if (!this.selectAll) {
        this.imgStatus.forEach((item, index) => {
          if (item) {
            obj.push(_this.fileList[index])
          }
        })
      } else {
        obj = this.fileList
      }
      if (!obj.length) {
        this.$notification.error({
          message: '提醒',
          description: '请至少选择1张要进行白底的图片'
        })
        return
      }
      cutOutPic({
        image_url: obj
      }).then(res => {
        if (res.code === 0) {
          this.editedFileList = res.data
          this.jindu = 100
          this.editeResultStatus = false
          this.titleText1 = '图片白底'
          this.imgStatus = []
          this.fileList.forEach((item, index) => {
            this.imgStatus.push(false)
          })
          this.editeImgVisible1 = true
          this.previewImg = this.editedFileList[0].new_url
        } else {
          this.editeResultStatus = false
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    //图片翻译
    translationImg(e) {
      this.editeImgVisible = false
      this.selectAll = false
      this.editeResultStatus = true
      this.jindu = 50
      let _this = this
      let obj = {
        image_url: [],
        from: '',
        to: ''
      }
      if (!this.selectAll) {
        this.imgStatus.forEach((item, index) => {
          if (item) {
            obj.image_url.push(_this.fileList[index])
          }
        })
      } else {
        obj.image_url = this.fileList
      }
      if (!obj.image_url.length) {
        this.$notification.error({
          message: '提醒',
          description: '请至少选择1张要进行翻译的图片'
        })
        return
      }
      if (e.key == '1') {
        obj.from = 'zh'
        obj.to = 'ja'
      } else {
        obj.from = 'zh'
        obj.to = 'en'
      }
      transPic(obj).then(res => {
        if (res.code === 0) {
          this.editedFileList = res.data
          this.jindu = 100
          this.editeResultStatus = false
          this.imgStatus = []
          this.fileList.forEach((item, index) => {
            this.imgStatus.push(false)
          })
          this.titleText1 = '图片翻译'
          this.editeImgVisible1 = true
          this.previewImg = this.editedFileList[0].new_url
        } else {
          this.editeResultStatus = false
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
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
    handlePreview(file) {
      this.fileID = file.uid
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
      setTimeout(() => {
        this.nWidth = document.getElementById('imgbox-gallery').naturalWidth
        this.nHeight = document.getElementById('imgbox-gallery').naturalHeight
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
    beforeUpload(file) {},
    removes(val) {
      this.fileList.forEach((item, inx) => {
        if (val === item.uid) {
          this.fileList.splice(inx, 1)
        }
        // item.uid = inx+1
      })
      this.oriFileData.forEach((item, inx) => {
        if (val === item.uid) {
          this.oriFileData.splice(inx, 1)
        }
        // item.uid = inx+1
      })
      this.fileRandomNum.splice(this.fileRandomNum.indexOf(val), 1)
    },
    changePics() {
      let data = []
      let arr = []
      for (var i = 0; i < this.fileList.length; i += 3) {
        data.push(this.fileList.slice(i, i + 3))
      }
      this.loading = true
      let num = 0
      let errNum = 0
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
          .catch(() => {
            errNum++
            if (errNum == 1) {
              this.loading = false
              this.$notification.error({
                message: '错误',
                description: '拉伸失败,请重新拉伸'
              })
            }
          })
      })
    },
    //  一个请求多张拉伸
    async changePicAll(obj) {
      let picUrl = ''
      let picId = ''
      obj.forEach((item, index) => {
        picUrl += item.url + '^'
        picId += item.uid + '^'
      })
      this.imgUrl = picUrl.slice(0, -1)
      this.imgId = picId.slice(0, -1)
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
                _this.fileList = arrurl
                if (_this.fileList.length === i) {
                  _this.loading = false
                  _this.$notification.success({
                    message: '提醒',
                    description: res.msg
                  })
                }
              } else {
                this.loading = false
              }
            })
          }, a * 500) //500代表间隔
        })(i, _this.fileList[i])
      }
    },
    ToFileList(value, type) {
      this.fileList = value
      if (type == '1') {
        this.titleText = '图片白底'
        this.editeStatus = 1
      } else {
        this.titleText = '图片翻译'
        this.editeStatus = 2
      }
      this.previewVisible = false
      if (handler === 'pic') {
        this.editeImgVisible = true
      }
      this.selectAll = true
      this.imgStatus = []
      this.fileList.forEach((item, index) => {
        this.imgStatus.push(true)
      })
    },
    handleCancel() {
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
        }
      }, 500)
    },
    //提交
    updateImgContent(type) {
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
            this.$store.commit('set_subTabtwo', true)
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
            this.$store.commit('set_subTabtwo', true)
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
          this.$store.commit('set_subTabtwo', 'error')
        })
    },
    cancel() {
      this.$emit('commonSignOut')
    },
    showUpload() {
      this.showUploadBox = true
    },
    hideUpload() {
      this.showUploadBox = false
    },
    uploadNetwork() {
      this.NetworkInput = true
    },
    NetworkCancel() {
      this.NetworkInput = false
    },
    NetworkPicOk() {
      let reg = /\n/g
      var strs = new Array() //定义一数组
      strs = this.networkUrl.split(reg)

      strs.forEach((item, index) => {
        let urlObj = {
          status: 0,
          uid: 0,
          url: ''
        }

        urlObj.uid = this.setRandomNum()
        urlObj.url = item
        this.fileList.push(urlObj)
        this.oriFileData.push(urlObj)
      })
      this.NetworkInput = false
      this.networkUrl = ''
    },
    //翻译或抠图
    editeImgs(e) {
      if (e.key == '1') {
        this.titleText = '图片白底'
        this.editeStatus = 1
      } else {
        this.titleText = '图片翻译'
        this.editeStatus = 2
      }
      this.selectNum = 0
      this.imgStatus.forEach((item, index) => {
        if (item) {
          this.selectNum++
        }
      })
      this.previewVisible = false
      this.editeImgVisible = true
    },
    editeImgCancel() {
      this.editeImgVisible = false
      this.selectAll = false
      this.imgStatus = []
      this.fileList.forEach((item, index) => {
        this.imgStatus.push(false)
      })
    },
    chooseImg(index) {
      this.imgStatus.splice(index, 1, !this.imgStatus[index])
      this.selectNum = 0
      this.imgStatus.forEach((item, index) => {
        if (item) {
          this.selectNum++
        }
      })
    },
    editeImgCancel1() {
      this.editeImgVisible1 = false
    },
    chooseImg1(index) {
      this.chooseImgIndex = index
      if (this.imgTab == '1') {
        this.previewImg = this.editedFileList[index].new_url
      } else {
        this.previewImg = this.editedFileList[index].old_url
      }
    },
    tabChange(type) {
      if (type == 1) {
        if (this.chooseImgIndex > 0) {
          this.chooseImgIndex--
        }
      } else {
        if (this.chooseImgIndex < this.editedFileList.length) {
          this.chooseImgIndex++
        }
      }
      if (this.imgTab == '1') {
        this.previewImg = this.editedFileList[this.chooseImgIndex].new_url
      } else {
        this.previewImg = this.editedFileList[this.chooseImgIndex].old_url
      }
    },
    tabImg() {
      if (this.imgTab == '1') {
        this.previewImg = this.editedFileList[this.chooseImgIndex].new_url
      } else {
        this.previewImg = this.editedFileList[this.chooseImgIndex].old_url
      }
    },
    saveProductImgs() {
      let _this = this
      let obj = {
        id: this.goodsId,
        image: []
      }
      if (this.titleText1 == '图片白底') {
        this.editedFileList.forEach((item, index) => {
          if (_this.keepOldImg) {
            item.status = 1
          }
        })
      }
      obj.image = this.editedFileList
      saveProductImg(obj).then(res => {
        if (res.code === 0) {
          this.editeImgVisible1 = false
          this.getBaseInfo()
          this.$notification.success({
            message: '提醒',
            description: res.msg
          })
        } else {
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    onchange(e) {
      this.selectAll = e.target.checked
      if (e.target.checked) {
        this.imgStatus = []
        this.fileList.forEach((item, index) => {
          this.imgStatus.push(true)
        })
        this.selectNum = 0
        this.imgStatus.forEach((item, index) => {
          if (item) {
            this.selectNum++
          }
        })
      } else {
        this.imgStatus = []
        this.selectNum = 0
        this.fileList.forEach((item, index) => {
          this.imgStatus.push(false)
        })
      }
    },
    onchange1(e) {
      this.keepOldImg = e.target.checked
    },
    tofund() {
      this.$router.push('/rechange/fund')
    }
  },
  mounted() {
    this.token = Vue.ls.get('Access-Token')
    this.goodsId = this.$route.query.id
    this.site = this.$route.query.site
    this.$store.commit('set_Tabtwo', true)
    this.addNewProduct = this.$route.query.type
    this.getBaseInfo()
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
.selectImg {
  display: none;
}
.selectImg1 {
  display: block;
  position: absolute;
  color: #1890ff;
  top: 10px;
  left: 70px;
  font-size: 24px;
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
}
.image-box:hover .mask-layer {
  opacity: 0.7;
}
.icon-eye {
  cursor: pointer;
  position: absolute;
  top: 35%;
  left: 20%;
  color: white;
  display: none;
}
.icon-delete {
  cursor: pointer;
  position: absolute;
  top: 35%;
  left: 40%;
  color: white;
  display: none;
}
.icon-home {
  cursor: pointer;
  position: absolute;
  top: 35%;
  left: 60%;
  color: white;
  display: none;
}
.icon-scissor {
  cursor: pointer;
  position: absolute;
  top: 55%;
  left: 20%;
  color: white;
  display: none;
}
.icon-swap {
  cursor: pointer;
  position: absolute;
  top: 55%;
  left: 40%;
  color: white;
  display: none;
}
.icon-back {
  cursor: pointer;
  position: absolute;
  top: 55%;
  left: 60%;
  color: white;
  display: none;
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
.image-box:hover .icon-scissor {
  display: block;
}
.image-box:hover .icon-swap {
  display: block;
}
.image-box:hover .icon-back {
  display: block;
}
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
.boder_color {
  border: 1px solid #3385ff;
  box-sizing: border-box;
}
.hide_over {
  overflow-y: auto;
  height: 100%;
}
.hide_over::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
<style lang="less">
.mt-lg {
  margin-top: 20px;
}
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
.jindutiao {
  .ant-modal-content {
    background-color: inherit;
    box-shadow: none;
  }
}
</style>
