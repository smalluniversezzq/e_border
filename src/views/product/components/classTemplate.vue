<template>
  <div class="classTemplate">
    <div v-if="this.$store.state.tabStatus.classLoading" class="spin-box">
      <a-spin class="spin" />
    </div>
    <a-row>
      <a-col :span="5" style="background:#fff; border-right: 1px solid #e8e8e8;">
        <div>
          <a-button class="mr" @click="addClass">新增分类</a-button>
          <a-button class="ml-sm " @click="edit()">{{ editShow ? '编辑' : '取消编辑' }}</a-button>
        </div>
        <s-tree
          :dataSource="orgTree"
          :openKeys.sync="openKeys"
          :defaultSelectedKeys="defaultSelectedKeys"
          :search="false"
          @click="handleClick"
          @edit="handleEdit"
          @del="handleDel"
          @titleClick="handleTitleClick"
        >
        </s-tree>
      </a-col>
      <a-col :span="12" offset="2" v-if="this.orgTree.length > 0">
        <div>
          <a-button
            v-if="this.bmId.length > 0"
            type="primary"
            loding="submitClssLoding"
            :loading="submitClassLoding"
            class="mt rt"
            @click="submitClass()"
            >保存
          </a-button>
        </div>
        <div style="margin:70px 0 0 0">
          <classSelect class="mt" v-if="this.bmId.length > 0" ref="selectDefaultDatas"></classSelect>
        </div>
      </a-col>
      <a-col v-else class="remind-box" :span="12" offset="2" style="height:500px">
        <div class="remind">
          <img :src="remind" alt="" />
        </div>
        <div class="remind-txt">请先添加分类</div>
        <div class="remind-btn">
          <a-button @click="addClass">新增分类</a-button>
        </div>
      </a-col>
    </a-row>
    <a-modal
      :maskClosable="false"
      :title="addTitle"
      :visible="classvisible"
      @ok="classHandleOk"
      :confirmLoading="confirmLoading"
      @cancel="classHandleCancel"
      :loading="editLoading"
    >
      <template>
        <a-input v-if="addstate === 'edit' || addstate === 'add'" v-model="classValue" style="150px"> </a-input>
        <p v-if="addstate === 'del'">
          确定删除分类
        </p>
      </template>
    </a-modal>
  </div>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { handlerData } from '@/utils/util'
import {
  AddproductCategory,
  getPersonalCategory,
  deletePersonalCategory,
  getAmazonCategory,
  saveCategory,
  changeId
} from '@/api/collect'
import classSelect from './classSelect.vue'

export default {
  name: 'classTemplate',
  components: {
    STree,
    classSelect
  },
  data() {
    return {
      classvisible: false,
      confirmLoading: false,
      classValue: '',
      openKeys: ['1'],
      defaultSelectedKeys: [],
      orgTree: [],
      editShow: true,
      addvisible: false,
      addLoading: false,
      bmId: '',
      addTitle: '',
      addstate: '',
      submitClassLoding: false,
      editLoading: false,
      remind: require('@/assets/icons/remind.png')
    }
  },
  methods: {
    edit() {
      this.editShow = !this.editShow
      this.$store.commit('set_TabEditClass', this.editShow)
    },
    classHandleOk() {
      this.editLoading = true
      if (this.addstate === 'add') {
        AddproductCategory({
          name: this.classValue
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.editLoading = false
            this.classvisible = false
            this.getPersonalCategoryFnAdd()
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
          this.editLoading = false
          this.classvisible = false
        })
        this.classValue = ''
      } else if (this.addstate === 'edit') {
        AddproductCategory({
          id: this.bmId,
          name: this.classValue
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.classvisible = false
            this.editLoading = false
            this.getPersonalCategoryFn('edit')
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
          this.editLoading = false
          this.classvisible = false
        })
        this.classValue = ''
      } else if (this.addstate === 'del') {
        deletePersonalCategory({
          id: this.bmId
        }).then(res => {
          if (res.code === 0) {
            this.getPersonalCategoryFn('del')
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.classvisible = false
            this.editLoading = false
            this.bmId = ''
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            this.editLoading = false
          }
          this.classvisible = false
        })
      }
      // this.bmId = ""
    },
    classHandleCancel() {
      this.classvisible = false
    },
    // 获取分类列表
    getPersonalCategoryFn(type) {
      getPersonalCategory({}).then(res => {
        if (res.code === 0) {
          let data = handlerData(res.data)
          this.orgTree = data
          if (type === 'del') {
            if (data.length > 0) {
              this.bmId = ''
              this.getAmazonCategoryFn()
            } else {
              this.$store.commit('set_classLoading', false)
              this.submitClassLoding = false
              this.bmId = ''
            }
          } else if (type === 'edit') {
            if (data.length > 0) {
            } else {
            }
          } else {
            if (data.length > 0) {
              this.bmId = data[0].key
              this.getAmazonCategoryFn()
              this.defaultSelectedKeys[0] = data[0].key
            } else {
              this.$store.commit('set_classLoading', false)
              this.submitClassLoding = false
              this.bmId = ''
            }
          }
        } else {
        }
      })
    },
    getPersonalCategoryFnAdd(type) {
      getPersonalCategory({}).then(res => {
        if (res.code === 0) {
          let data = handlerData(res.data)
          this.orgTree = data
          if (data.length > 0) {
            if (data.length === 1) {
              this.bmId = data[0].key
              this.getAmazonCategoryFn()
              this.defaultSelectedKeys[0] = data[0].key
            } else {
            }
          } else {
            this.$store.commit('set_classLoading', false)
            this.submitClassLoding = false
            this.bmId = data[0].key
          }
        } else {
        }
      })
    },
    handleClick(e) {
      this.$store.commit('set_classLoading', true)
      this.bmId = e.key
      this.$set(this.defaultSelectedKeys, 0, e.key)
      this.getAmazonCategoryFn()
    },
    addClass() {
      this.addTitle = '添加分类'
      this.classvisible = true
      this.addstate = 'add'
    },
    handleEdit(item, type) {
      this.addTitle = '编辑分类'
      this.classvisible = true
      this.addstate = 'edit'
      this.bmId = item.key
    },
    handleDel(item, type) {
      this.bmId = item.key
      this.addTitle = '删除分类'
      this.addstate = 'del'
      this.classvisible = true
    },
    handleTitleClick(item) {},
    //获取亚马逊分类上次保留的
    getAmazonCategoryFn() {
      getAmazonCategory({
        id: this.bmId
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) === '{}') {
            let reverseArr = [
              { country: 'DE', category: '0' },
              { country: 'NL', category: '0' },
              { country: 'US', category: '0' },
              { country: 'CA', category: '0' },
              { country: 'MX', category: '0' },
              { country: 'ES', category: '0' },
              { country: 'IT', category: '0' },
              { country: 'FR', category: '0' },
              { country: 'GB', category: '0' },
              { country: 'AU', category: '0' },
              { country: 'JP', category: '0' }
            ]
            this.$refs.selectDefaultDatas.reverseCheck(reverseArr, '0')
          } else {
            let reverseArr = []
            ;(this.searchStatus = {
              DE: false,
              NL: false,
              ES: false,
              IT: false,
              US: false,
              CA: false,
              MX: false,
              AE: false,
              BR: false,
              FR: false,
              GB: false,
              IN: false,
              TR: false,
              AU: false,
              JP: false
            }),
              Object.keys(res.data).forEach((item, index, value) => {
                let reverseObj = {
                  country: '',
                  category: ''
                }
                reverseObj.country = item
                reverseObj.category = res.data[item].node_id
                reverseObj.cid = res.data[item].cid
                reverseArr.push(reverseObj)
              })
            this.$refs.selectDefaultDatas.reverseCheck(reverseArr, '1')
          }
        } else {
        }
      })
    },
    submitClass() {
      this.submitClassLoding = true
      this.$refs.selectDefaultDatas.submits()
      let category = this.$refs.selectDefaultDatas.categorys
      setTimeout(() => {
        changeId({
          ids: category
        }).then(res => {
          if (res.code === 0) {
            let categoryInfo = {}
            Object.keys(category).forEach((item, index) => {
              let idObj = {
                node_id: res.data[item],
                cid: category[item]
              }
              if (idObj.cid === '') {
                delete idObj.cid
              }
              if (!idObj.node_id) {
                delete idObj.node_id
              }
              if (JSON.stringify(idObj) === '{}') {
              } else {
                categoryInfo[item] = idObj
              }
            })
            Object.keys(categoryInfo).forEach((item, index) => {})

            saveCategory({
              id: this.bmId,
              category: categoryInfo
            }).then(res => {
              if (res.code === 0) {
                this.$notification.success({
                  message: '成功',
                  description: res.msg
                })
                this.submitClassLoding = false
              } else {
                this.$notification.error({
                  message: '错误',
                  description: res.msg
                })
                this.submitClassLoding = false
              }
            })
          }
        })
      }, 2000)
    }
  },
  created() {},
  mounted() {
    this.$store.commit('set_classLoading', true)
    this.getPersonalCategoryFn('1')
  }
}
</script>

<style lang="less" scoped>
.classtemplate {
  position: relative;
}

.classGoods {
  font-size: 18px;
}

.ml {
  margin-left: 20px;
}

.over-menu {
  width: 100% !important;
}
</style>
<style lang="less">
.ml-sm {
  margin-left: 10px;
}

.custom-tree {
  /deep/ .ant-menu-item-group-title {
    position: relative;

    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 50px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    // &:hover {
    //   transform: scale(1.2);
    //   transition: 0.5s all;
    // }
  }
}

.tree-title {
  background: #1890ff;
  height: 40px;
  // border-radius: 5px;
  line-height: 40px;

  .title-txt {
    color: #fff;
  }

  .cardmer {
    background: #f0f2f5;
    padding: 0;
  }
}
</style>
<style lang="less">
.tree-wrapper .ant-menu-inline {
  border-right: 0 solid #e8e8e8;
}

.links {
  color: #1890ff;
}

.tar {
  text-align: right;
}

.tree-height {
  max-height: 650px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.cursor {
  cursor: pointer;
}

::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: #f8f8f8;
}

::-webkit-scrollbar {
  //滚动条的宽度
  width: 9px;
  height: 9px;
}

::-webkit-scrollbar-thumb {
  //滚动条的设置
  background-color: #dddddd;
  background-clip: padding-box;
  min-height: 28px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #1890ff;
}

.box-height {
  min-height: 600px;
}

.lin-height {
  line-height: 32px;
}

.over-menu {
  width: 100% !important;
}

.tar {
  text-align: right;
}

.rt {
  float: right;
}

.spin-box {
  position: absolute;
  border-radius: 4px;
  margin: 0;
  text-align: center;
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.05);
  z-index: 100;

  .spin {
    margin-top: 240px;
  }
}

.remind-box {
  margin: 20px auto 0;

  .remind {
    width: 100px;
    height: 100px;
    margin: 20px auto;

    img {
      width: 100%;
    }
  }

  .remind-txt {
    color: rgba(0, 0, 0, 0.85);
    font-size: 24px;
    line-height: 1.8;
    text-align: center;
  }

  .remind-btn {
    margin-top: 25px;
    text-align: center;
  }
}

.mb {
  margin-bottom: 20px;
}
</style>
