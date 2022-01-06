<template>
  <div>
    <a-card>
      <a-row>
        <a-col span="24" class="tal">
          <a-select
            class="mr-sm"
            v-model="asin.storeId"
            :allowClear="true"
            placeholder="请选择店铺"
            style="width:180px "
            @change="shopCrawlChange"
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in storeSelect"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
          <a-select
            class="mr-sm"
            v-model="asin.country"
            :allowClear="true"
            placeholder="请选择国家"
            style="width:180px "
            @change="countryAsinChange"
          >
            <a-select-option
              :value="item.code"
              v-for="(item,index) in siteListSelect2"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <a-row class="mt">
        <a-col>
          <a-textarea v-model="asin.asinUrl" placeholder="输入ASIN，Enter换行最多可输入20个ASIN" :rows="4" />
        </a-col>
      </a-row>
      <a-row class="mt">
        <a-col class="tar">
          <a-button
            class="mr-sm"
            v-show="hasPerm(permsBtn.followMonitor_crawl)"
            :loading="loading"
            @click="addAsin()"
          >开始采集</a-button>
          <a-button class @click="(()=>(asin={}))">清空</a-button>
        </a-col>
      </a-row>

      <a-row style="margin-top:50px;">
        <a-col span="24" class="tal">
          查询：
          <a-select
            class="mr-sm"
            v-model="searchList.shopSearchValue"
            :allowClear="true"
            placeholder="请选择店铺"
            style="width:180px "
            @change="shopChange"
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in storeSelect"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
          <a-select
            class="mr-sm"
            v-model="searchList.countrySearchValue"
            :allowClear="true"
            placeholder="请选择国家"
            style="width:180px "
            @change="countryListChange"
          >
            <a-select-option
              :value="item.code"
              v-for="(item,index) in siteListSelect"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
          <a-input
            class="mr-sm"
            style="width:150px"
            v-model="searchList.asin"
            placeholder="请输入ASIN"
          />
          <a-select
            class="mr-sm"
            v-model="searchList.status"
            :allowClear="true"
            placeholder="状态"
            style="width:180px "
            @change="statusChange"
          >
            <a-select-option
              :value="item.code"
              v-for="(item,index) in statusSelect"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
          <a-select
            class="mr-sm"
            v-model="searchList.is_follow"
            :allowClear="true"
            placeholder="跟卖"
            style="width:180px "
            @change="isFollowChange"
          >
            <a-select-option
              :value="item.code"
              v-for="(item,index) in isFollowSelect"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
          <a-button type="primary" @click="search()">搜索</a-button>
          <a-button class="ml" @click="(()=>(searchList={}))">重置</a-button>
          <a-button
            v-show="hasPerm(permsBtn.followMonitor_add)"
            style="margin-left:3rem;"
            @click="addMonitor()"
            type="primary"
          >添加监控</a-button>
        </a-col>
      </a-row>

      <a-row>
        <a-col span="24" class="tal mt dis-flex flex-wrap">
          <a-button
            v-show="hasPerm(permsBtn.followMonitor_upload)"
            @click="uploadMonitor()"
            :loading="uMonotor"
            class="mr-sm"
          >上传监控信息</a-button>
        </a-col>
      </a-row>

      <a-row style="margin-top:1rem;">
        <a-col>
          <a-table
            :pagination="false"
            :dataSource="data"
            :loading="asinListLoading"
            :rowSelection="rowSelection"
            rowKey="id"
          >
            <a-table-column title="ASIN" data-index="asin"></a-table-column>
            <a-table-column title="图片" width="100px">
              <template slot-scope="text, record">
                <a-popover v-show="record.image" placement="rightTop">
                  <template slot="content" style="width:200px">
                    <img style="width:200px" :src="record.image" alt />
                  </template>
                  <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                    <img
                      style="width:100px; margin-left:-16px;margin-top:-2px"
                      :src="record.image"
                      alt="暂无订单信息"
                    />
                  </a-button>
                </a-popover>
              </template>
            </a-table-column>
            <a-table-column title="商品标题" data-index="title" width="300px">
              <template slot-scope="text, record">
                <div
                  class="list-link cur text-min"
                  :title="record.title"
                  @click="linkTo(record.url)"
                >{{record.title}}</div>
              </template>
            </a-table-column>
            <a-table-column title="店铺" data-index="store_name"></a-table-column>
            <a-table-column title="国家" data-index="country"></a-table-column>
            <a-table-column title="状态" data-index="status"></a-table-column>
            <a-table-column title="跟卖" data-index="is_follow"></a-table-column>
            <a-table-column class="time" title="操作">
              <template slot-scope="text, record">
                <a-button
                  type="danger"
                  :disabled="!hasPerm(permsBtn.followMonitor_deleted)"
                  @click="del(record.id)"
                >删除</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-col>
      </a-row>

      <a-row class="mt">
        <a-col class="tar">
          <a-pagination
            v-model="current"
            @change="pagechange"
            :pageSize="page.pageSize"
            :total="(page.pageSize*page.lastPage)"
          />
        </a-col>
      </a-row>
    </a-card>

    <a-modal
      title="添加监控"
      :maskClosable="false"
      :visible="showMonitor"
      @ok="addOk"
      :confirmLoading="addMonitorLoading"
      @cancel="cancel"
      width="650px"
    >
      <a-form>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="店铺">
          <a-select
            class="mr-sm"
            v-model="monitor.store_id"
            :allowClear="true"
            placeholder="请选择店铺"
            @change="shopMonitorChange"
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in storeSelect"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="国家">
          <a-select
            class="mr-sm"
            v-model="monitor.country"
            :allowClear="true"
            placeholder="请选择国家"
            @change="countryListChange1"
          >
            <a-select-option
              :value="item.code"
              v-for="(item,index) in siteListSelect1"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="ASIN">
          <a-input class="mr-sm" v-model="monitor.asin" placeholder="请输入ASIN" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="商品链接">
          <a-input class="mr-sm" v-model="monitor.url" placeholder="请输入商品链接" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="图片链接">
          <a-input class="mr-sm" v-model="monitor.image" placeholder="请输入图片链接" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { countryFollow } from '@/views/order/public/country'
import { getMonitorList, deleteMonitor, uploadMonitorInfo, addMonitorLog, followCrawler } from '@/api/amazon'
import { getMyStore } from '@/api/collect'
import { permsBtn } from '@/utils/static'
export default {
  name: 'followMonitor',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      data: [], //ASIN列表数据
      countryFollow,
      permsBtn,
      siteListSelect: [], //搜索店国家
      siteListSelect1: [], //手动添加ASIN信息国家
      siteListSelect2: [], //采集商品选择的国家
      storeSelect: [], //店铺
      // 搜索
      searchList: {},
      showMonitor: false,
      loading: false,
      uMonotor: false,
      addMonitorLoading: false,
      asinListLoading: false,
      monitor: {
        store_id: '',
        country: '',
        asin: '',
      },
      selectManageAll: '',
      selectkey: '',
      selectedRowKeys: [],
      statusSelect: [
        { code: 0, title: '未监控' },
        { code: 1, title: '监控中' },
      ],
      isFollowSelect: [
        { code: 0, title: '未知' },
        { code: 1, title: '被跟卖' },
        { code: 2, title: '无跟卖' },
      ],
      //采集
      asin: {},
      chromeID: this.GLOBAL.chrome.id,
      chromeCode: this.GLOBAL.chrome.id,
      showChromeCode: false,
      showChromeUrl: false,
      siteUrl: {
        US: 'https://www.amazon.com/dp/',
        CA: 'https://www.amazon.ca/dp/',
        MX: 'https://www.amazon.com.mx/dp/',
        DE: 'https://www.amazon.de/dp/',
        ES: 'https://www.amazon.es/dp/',
        FR: 'https://www.amazon.fr/dp/',
        GB: 'https://www.amazon.co.uk/dp/',
        IT: 'https://www.amazon.it/dp/',
        AU: 'https://www.amazon.com.au/dp/',
        NL: 'https://www.amazon.nl/dp/',
        SE: 'https://www.amazon.se/dp/',
      },
      current: 1,
      page: {},
    }
  },
  methods: {
    countryListChange(value) {
      this.searchList.countrySearchValue = value
      this.getMonitorList()
    },
    countryAsinChange(value) {
      this.asin.country = value
    },
    statusChange(value) {
      this.searchList.status = value
      this.getMonitorList()
    },
    isFollowChange(value) {
      this.searchList.is_follow = value
      this.getMonitorList()
    },
    countryListChange1(value) {
      this.monitor.country = value
    },
    // 获取店铺信息
    getMyStoreFn() {
      getMyStore().then((res) => {
        if (res.code === 0) {
          this.storeSelect = res.data
        }
      })
    },
    // 店铺搜索查询
    shopChange(val) {
      if (this.searchList.countrySearchValue) {
        this.searchList.countrySearchValue = ''
      }
      this.storeSelect.forEach((item, index) => {
        if (val === item.id) {
          this.siteListSelect = item.mws_site
        }
      })
      this.getMonitorList()
    },
    // 采集店铺搜索
    shopCrawlChange(val) {
      if (this.asin.country) {
        this.asin.country = ''
      }
      this.storeSelect.forEach((item, index) => {
        if (val === item.id) {
          this.siteListSelect2 = item.mws_site
        }
      })
    },
    // 手动添加记录店铺搜索
    shopMonitorChange(val) {
      if (this.monitor.country) {
        this.monitor.country = ''
      }
      this.storeSelect.forEach((item, index) => {
        if (val === item.id) {
          this.siteListSelect1 = item.mws_site
        }
      })
    },
    // 搜索
    search() {
      this.getMonitorList()
    },
    addMonitor() {
      this.showMonitor = true
    },
    addOk() {
      if (!this.monitor.store_id) {
        this.$notification.error({
          message: '失败',
          description: '请选择店铺',
        })
        return
      }
      if (!this.monitor.country) {
        this.$notification.error({
          message: '失败',
          description: '请选择国家',
        })
        return
      }
      if (!this.monitor.asin) {
        this.$notification.error({
          message: '失败',
          description: '请输入ASIN',
        })
        return
      }
      this.addMonitorLoading = true
      this.uploadMonitorInfo()
    },
    cancel() {
      this.showMonitor = false
    },
    // 手动上传记录
    uploadMonitorInfo() {
      let that = this
      uploadMonitorInfo({
        store_id: that.monitor.store_id,
        country: that.monitor.country,
        asin: that.monitor.asin,
        url: that.monitor.url,
        image: that.monitor.image,
      }).then((res) => {
        that.addMonitor = false
        if (res.code === 0) {
          that.addMonitorLoading = false
          that.$notification.success({
            message: '成功',
            description: res.msg,
          })
        } else {
          that.$notification.error({
            message: '提醒',
            description: res.msg,
          })
        }
      })
    },
    // 上传微服务记录
    uploadMonitor() {
      let that = this
      if (!this.searchList.shopSearchValue) {
        this.$notification.error({
          message: '提醒',
          description: '请选择店铺',
        })
        return
      }
      if (!this.searchList.countrySearchValue) {
        this.$notification.error({
          message: '提醒',
          description: '请选择国家',
        })
        return
      }
      if (this.selectedRowKeys.length == 0) {
        this.$notification.error({
          message: '提醒',
          description: '请选择记录',
        })
      } else {
        that.uMonotor = true
        addMonitorLog({
          store_id: that.searchList.shopSearchValue,
          country: that.searchList.countrySearchValue,
          ids: that.selectedRowKeys,
        }).then((res) => {
          that.uMonotor = false
          if (res.code === 0) {
            that.showMonitor = false
            that.$notification.success({
              message: '成功',
              description: res.msg,
            })
          } else {
            that.$notification.error({
              message: '提醒',
              description: res.msg,
            })
          }
        })
      }
    },
    del(id) {
      let that = this
      deleteMonitor({
        id: id,
      }).then((res) => {
        that.$notification.success({
          message: '提示',
          description: res.msg,
        })
        that.getMonitorList()
      })
    },
    getMonitorList() {
      this.asinListLoading = true
      getMonitorList({
        store_id: this.searchList.shopSearchValue,
        country: this.searchList.countrySearchValue,
        status: this.searchList.status,
        is_follow: this.searchList.is_follow,
        page: this.current,
      }).then((res) => {
        this.asinListLoading = false
        if (res.code === 0) {
          this.page = res.pages
          if (res.data.length > 0) {
            this.data = res.data
          } else {
            this.data = []
          }
        }
      })
    },
    pagechange(page, pagesize) {
      this.current = page
      this.getMonitorList()
      Object.assign(this, {
        selectedRowKeys: [],
      })
    },
    addAsin() {
      if (!this.asin.storeId) {
        this.$notification.error({
          message: '错误',
          description: '请选择店铺',
        })
        return
      }
      if (!this.asin.country) {
        this.$notification.error({
          message: '错误',
          description: '请选择国家',
        })
        return
      }
      if (this.asin.asinUrl) {
        this.toCollect()
      } else {
        this.$notification.error({
          message: '错误',
          description: 'ASIN不能为空',
        })
      }
    },
    isChrome() {
      let that = this
      let h = window.chrome
      h && h.runtime && h.runtime.sendMessage ? (that.showChromeUrl = false) : (that.showChromeUrl = true)
      console.log(that.showChromeUrl === true ? '未安装插件' : '安装了插件')
    },
    toCollect() {
      let that = this
      that.loading = true
      setTimeout(() => {
        if (that.loading === true) {
          that.loading = false
          that.$notification.error({
            message: '错误',
            description: '采集出现错误，请重新采集',
          })
        }
      }, 60000)
      let h = window.chrome
      let targetExtensionId = that.chromeCode
      h && h.runtime && h.runtime.sendMessage
        ? window.chrome.runtime.sendMessage(
            targetExtensionId,
            {
              type: 'single',
              action: 'detect',
            },
            function (response) {
              if (response === 'ok') {
                let reg = /\n/g
                if (reg.test(that.asin.asinUrl)) {
                  var strs = new Array()
                  strs = that.asin.asinUrl.split(reg)
                  let splitStr = that.splitUrl(strs, 'all')
                  that.collectAll(splitStr)
                } else {
                  let splitStr = that.splitUrl(that.asin.asinUrl, 'single')
                  that.singleCollect(splitStr)
                }
              } else {
                that.loading = false
                that.$notification.error({
                  message: '错误',
                  description: '插件安装失败',
                })
              }
            }
          )(console.log('装了插件'))
        : (this.toCollects(), console.log('插件未安裝'))
    },
    splitUrl(strs, type) {
      let urlAll = []
      let urlSingle = ''
      let urlPost = this.siteUrl[this.asin.country]
      if (type == 'all') {
        strs.forEach((item, index) => {
          urlAll.push(urlPost.concat(item))
        })
        return urlAll
      } else {
        return urlPost.concat(strs)
      }
    },
    toCollects() {},
    getCrawler(splitStr) {},
    // 批量采集
    collectAll(strs) {
      let _this = this
      let num = 0
      let targetExtensionId = _this.chromeCode
      strs.forEach((item, index) => {
        window.chrome.runtime.sendMessage(
          targetExtensionId,
          {
            type: 'single',
            action: 'getHtml',
            url: item,
            config: '',
          },
          function (response) {
            let html = response.data.html
            followCrawler({
              url: item,
              country: _this.asin.country,
              store_id: _this.asin.storeId,
              html: html,
            }).then((res) => {
              _this.loading = false
              if (res.code === 0) {
                _this.$notification.success({
                  message: '提示',
                  description: '采集成功',
                })
                _this.getMonitorList()
              }
            })
          }
        )
      })
    },
    singleCollect(strs) {
      let _this = this
      let targetExtensionId = _this.chromeCode
      window.chrome.runtime.sendMessage(
        targetExtensionId,
        {
          type: 'single',
          action: 'getHtml',
          url: strs,
          config: '',
        },
        function (response) {
          let html = response.data.html
          followCrawler({
            url: strs,
            country: _this.asin.country,
            store_id: _this.asin.storeId,
            html: html,
          }).then((res) => {
            _this.loading = false
            if (res.code === 0) {
              _this.$notification.success({
                message: '提示',
                description: '采集成功',
              })
              _this.getMonitorList()
            }
          })
        }
      )
    },
    // 跳转第三方页面
    linkTo(url) {
      if (url) {
        window.open(url, '_blank')
      }
    },
  },
  created() {
    this.getMyStoreFn()
    this.getMonitorList()
    this.isChrome()
    if (Vue.ls.get('CHROME_ID')) {
      this.chromeCode = Vue.ls.get('CHROME_ID')
      this.showChromeCode = false
    } else {
      this.showChromeCode = true
      this.chromeCode = this.GLOBAL.chrome.id
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          ;(this.selectManageAll = selectedRows),
            (this.selectkey = selectedRowKeys),
            (this.selectedRowKeys = selectedRowKeys)
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.name === 'Disabled User',
            name: record.name,
          },
        }),
      }
    },
  },
}
</script>

<style lang="less" scpoed>
.ml {
  margin-left: 10px;
}
.tar {
  text-align: right;
}
.mr-sm {
  margin-right: 5px;
}
.list-link {
  color: #1890ff;
}
.cur {
  cursor: pointer;
}
.text-min {
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dis-flex {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.highlight {
  color: #1890ff;
  font-weight: 800;
}
.default {
  color: rgba(0, 0, 0, 0.65);
  font-weight: 400;
}
</style>
