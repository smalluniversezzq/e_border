<template>
  <div>
    <a-card>
      <a-tabs v-model="tabKeys" type="card" class="intcardtab" @change="callback">
        <a-tab-pane key="1">
          <span slot="tab" :disabled="!hasPerm(permsBtn.amazon_product_list)"> 产品列表 </span>
          <a-card class="mt">
            <a-row style="margin-bottom: 10px">
              <a-col :md="19" :sm="20">
                <a-button type="primary" v-if="hasPerm(permsBtn.product_exportAll)" @click="exportListAll()"
                >批量导出
                </a-button>
                <a-button
                  type="primary"
                  v-if="hasPerm(permsBtn.product_editAll)"
                  style="margin-left: 10px"
                  @click="EditsAll()"
                >批量编辑基本信息
                </a-button>
                <a-button
                  type="primary"
                  v-if="hasPerm(permsBtn.product_editAll)"
                  style="margin-left: 10px"
                  @click="EditsInfoAll()"
                >批量编辑变体信息
                </a-button>
                <a-button
                  type="danger"
                  v-if="hasPerm(permsBtn.product_delAll)"
                  style="margin-left: 10px"
                  @click="collectdelAll()"
                >批量删除
                </a-button>
              </a-col>
              <a-col :md="5">
                <a-row type="flex" justify="end">
                  <a-col>
                    <a-button
                      style="margin-right: 20px"
                      type="primary"
                      v-if="hasPerm(permsBtn.product_add)"
                      @click="addProduct"
                    >新增商品
                    </a-button>
                    <a-button
                      type="primary"
                      @click="toReleasedAll"
                      v-if="hasPerm(permsBtn.product_release)"
                      :loading="addsloading"
                    >加入发布
                    </a-button>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row class="mb-l" type="flex" justify="start">
              <a-col :span="2.5">
                <a-select
                  :allowClear="true"
                  defaultValue="all"
                  placeholder="请选择国家"
                  style="width: 180px"
                  v-model="countryManage"
                  @change="countrychange"
                >
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option :value="item.title" v-for="(item, index) in countrySelect" :key="index">
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="2.5">
                <a-input
                  class="ml"
                  placeholder="请输入搜索的产品名称"
                  style="width: 180px"
                  v-model="searchName"
                ></a-input>
              </a-col>
              <a-col :span="6" class="ml">
                <a-date-picker
                  :disabledDate="disabledStartDate"
                  format="YYYY-MM-DD"
                  v-model="startValue"
                  placeholder="开始时间"
                  show-time
                  @change="onTimeChange"
                  @openChange="handleStartOpenChange"
                />
                至
                <a-date-picker
                  :disabledDate="disabledEndDate"
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  v-model="endValue"
                  :open="endOpen"
                  show-time
                  @change="onTimeChange"
                  @openChange="handleEndOpenChange"
                />
              </a-col>
              <a-col :span="1.5">
                <a-button class="ml" type="primary" @click="shopSearch()">搜索</a-button>
              </a-col>
              <a-col :span="1.5">
                <a-button class="ml" @click="clearSearch">重置</a-button>
              </a-col>
              <a-col :span="1.5">
                <a-badge :count="black_count">
                  <a-button :class="!blackSwitch ? 'ml btn-bgcolor' : 'ml btn-bgcolorTab'" @click="toBlack()"
                  >黑名单
                  </a-button
                  >
                </a-badge>
              </a-col>
            </a-row>
            <a-row>
              <!-- :scroll="{ x: 1555, y: 550}" -->
              <a-table
                :scroll="{ x: 1500 }"
                :pagination="false"
                :dataSource="data"
                :loading="listLoading"
                :rowSelection="rowSelection"
                rowKey="id"
              >
                <a-table-column dataIndex="id" fixed="left" width="100px">
                  <template slot-scope="text, record">
                    <a-tooltip placement="top" v-if="record.edit === 0">
                      <template slot="title"> 请编辑商品</template>
                      <div
                        :style="{ backgroundColor: '#8a8a8a', width: '20px', height: '20px', marginTop: '5px' }"
                      ></div>
                    </a-tooltip>
                    <div>
                      {{ record.id }}
                    </div>
                  </template>
                </a-table-column>
                <a-table-column title="图片" fixed="left" width="100px">
                  <template slot-scope="text, record">
                    <a-popover v-show="record.image" placement="rightTop">
                      <template slot="content" style="width: 200px">
                        <img style="width: 200px" :src="record.image" alt="" />
                      </template>
                      <a-button style="width: 100px; position: relative; overflow: hidden; height: 100px">
                        <img
                          style="width: 100px; margin-left: -16px; margin-top: -2px"
                          :src="record.image"
                          alt="暂无订单信息"
                          @click="jumpToOrderUrl(record.ori_url)"
                        />
                      </a-button>
                    </a-popover>
                  </template>
                </a-table-column>
                <a-table-column title="标题" dataIndex="title"></a-table-column>
                <a-table-column title="来源" dataIndex="ori_platform" width="100px"></a-table-column>
                <a-table-column title="原价" dataIndex="ori_price" width="100px">
                  <template slot-scope="text, record">
                    <span>{{ record.ori_price | priceTlt }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="售价" width="180px">
                  <template slot-scope="text, record">
                    <div v-for="(item, index) in record.categoryData" :key="index" v-if="item.price">
                      <div v-for="(im, ix) in countrySelects" :key="ix" v-if="item.country == im.title">
                        {{ item.country ? '(' + codeORcountry[item.country] + ')' : '' }} {{ item.price }}{{ im.logo }}
                      </div>
                    </div>
                  </template>
                </a-table-column>
                <a-table-column class="time" title="时间" dataIndex="created_at" width="240px">
                  <template slot-scope="text, record">
                    <p>创建时间:{{ record.created_at }}</p>
                    <p>更新时间:{{ record.updated_at }}</p>
                  </template>
                </a-table-column>
                <a-table-column title="是否可加入发布" width="150px">
                  <template slot-scope="text, record">
                    <div v-for="(item, index) in record.categoryData" :key="index">
                      <span v-for="(its, key, inx) in record.export_country" :key="inx">
                        {{ item.country === key ? '(' + codeORcountry[key] + ')' : '' }}
                      </span>
                      <span v-if="record.export_country && record.export_country.length !== 0">
                        <a-popover title="">
                          <template slot="content" v-show="showHover">
                            <div v-html="addWarning"></div>
                          </template>
                          <span
                            @mouseenter="
                              enter(record.export_country[item.country] == '0' ? true : false, item.country, record.id)
                            "
                            @mouseleave="leave()"
                          >
                            {{ record.export_country[item.country] == '0' ? '否' : '是' }}
                            <a-icon type="question-circle" v-if="record.export_country[item.country] == '0'" />
                          </span>
                        </a-popover>
                      </span>
                    </div>
                  </template>
                </a-table-column>
                <a-table-column title="操作" width="240px" fixed="right">
                  <template slot-scope="text, record">
                    <div>
                      <a-row>
                        <a-col :span="12">
                          <a-button
                            type="primary"
                            :disabled="!hasPerm(permsBtn.release_edit)"
                            @click="Edits(record.id, record.platform, record.ori_pid, record)"
                          >编辑
                          </a-button>
                        </a-col>
                        <a-col :span="12">
                          <a-button
                            :disabled="!hasPerm(permsBtn.product_del)"
                            type="danger"
                            style="margin-left: 10px"
                            @click="collectdel(record.id)"
                          >删除
                          </a-button>
                        </a-col>
                      </a-row>
                    </div>
                    <div>
                      <a-row>
                        <a-col :span="12">
                          <a-button
                            class="mt-sm"
                            :disabled="!hasPerm(permsBtn.product_copy)"
                            :loading="copyId == record.id ? copyloading : false"
                            @click="copyProduct(record.id)"
                          >一键复制
                          </a-button>
                        </a-col>
                        <a-col :span="12">
                          <a-button
                            v-if="record.publish == 0"
                            :disabled="!hasPerm(permsBtn.product_release)"
                            class="mt-sm"
                            :loading="addId == record.id ? addloading : false"
                            @click="released(record.id)"
                          >加入发布
                          </a-button>
                          <a-button
                            v-if="record.publish == 1"
                            :disabled="!hasPerm(permsBtn.product_release)"
                            class="mt-sm"
                            :loading="addloading"
                          >已加入
                          </a-button>
                        </a-col>
                      </a-row>
                    </div>
                  </template>
                </a-table-column>
              </a-table>
              <!-- </a-col> -->
            </a-row>
            <a-row class="mt" v-if="data.length !== 0" type="flex" justify="end">
              <a-col>
                <a-pagination
                  :pageSizeOptions="pageSizeOptionManage"
                  v-model="currentManege"
                  showSizeChanger
                  @showSizeChange="onShowSizeChange"
                  :pageSize.sync="pageManage.pageSize"
                  @change="pagechange"
                  :total="pageManage.pageSize * pageManage.lastPage"
                />
              </a-col>
            </a-row>
          </a-card>
          <a-modal
            title="导出选项"
            :visible="modals"
            @ok="exportOk"
            :confirmLoading="modalsLoading"
            @cancel="handleCancel"
            width="650px"
          >
            <a-form-item label="导出全部国家" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-checkbox :checked="allCountrysState" @change="onChangeButton">全部</a-checkbox>
              <span v-show="allCountrysState">选择关闭，则可多选国家</span>
              <span v-show="!allCountrysState">点击勾选，则对全部国家生效</span>
              <a-button class="ml" :loading="exportLoading" @click="originExport">原文导出</a-button>
            </a-form-item>
            <a-form-item label="选择导出国家" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!allCountrysState">
              <a-select
                mode="multiple"
                placeholder="请选择"
                style="width: 100%"
                @change="EXcountryChange"
                v-model="initialArr"
              >
                <a-select-option :value="index" v-for="(item, index) in codeORcountrys" :key="index"
                >{{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="标题前缀" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="prefix" placeholder="统一标题前缀"></a-input>
            </a-form-item>
            <a-form-item label="品牌" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="brand" placeholder="统一品牌"></a-input>
            </a-form-item>

            <a-row v-show="showWarning" type="flex" justify="center">
              <a-col :span="18">
                <div
                  v-show="item.failData.length > 0"
                  v-for="(item, index) in countryArr"
                  :key="index"
                  style="
                    width: 295px;
                    border: 1px solid #ccc;
                    margin-left: 60px;
                    border-radius: 3px;
                    background: rgb(255, 251, 230);
                    padding-left: 10px;
                    margin-bottom: 5px;
                  "
                >
                  ID为:{{ item.failData.join(',') }}&nbsp;&nbsp;{{ item.countryName }}信息填写不完整，请确认是否导出
                </div>
              </a-col>
            </a-row>
          </a-modal>
          <a-modal
            title="删除"
            :visible="visibles"
            @ok="handleOk"
            :confirmLoading="ManageLoading"
            @cancel="handleCanceldel"
          >
            <p>{{ ModalTextManage }}</p>
          </a-modal>
          <a-modal
            width="800px"
            title="批量编辑"
            :maskClosable="false"
            :visible="editShow"
            @ok="editOk"
            :confirmLoading="editLoading"
            @cancel="editceldel"
          >
            <div v-if="this.$store.state.tabStatus.classLoading" class="spin-box">
              <a-spin class="spin" />
            </div>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">品牌:</a-col>
              <a-col span="17">
                <a-input v-model="brand_name" placeholder="请输入品牌（英文）"></a-input>
              </a-col>
            </a-row>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">库存:</a-col>
              <a-col span="17">
                <a-input v-model="stock" placeholder="请输入库存"></a-input>
              </a-col>
            </a-row>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">自定义分类:</a-col>
              <a-col span="17">
                <a-select
                  defaultValue=""
                  v-model="customClassValue"
                  placeholder="请选择自定义分类"
                  style="width: 150px"
                  @change="PersonalHandleChange"
                >
                  <a-select-option :value="item.id" v-for="(item, index) in personalList" :key="index"
                  >{{ item.title }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">选择分类:</a-col>
              <a-col span="17">
                <div v-if="plainOptions1">
                  <a-checkbox :indeterminate="indeterminate1" @change="onCheckAllChange1" :checked="checkAll1"
                  >北美
                  </a-checkbox>
                  <a-checkbox-group :options="plainOptions1" v-model="checkedList1" @change="onChange1" />
                </div>
                <div v-if="plainOptions2">
                  <a-checkbox :indeterminate="indeterminate2" @change="onCheckAllChange2" :checked="checkAll2"
                  >欧洲
                  </a-checkbox>
                  <a-checkbox-group :options="plainOptions2" v-model="checkedList2" @change="onChange2" />
                </div>
                <div v-if="plainOptions3">
                  <a-checkbox-group :options="plainOptions3" v-model="checkedList3" @change="onChange3" />
                </div>
              </a-col>
            </a-row>
            <a-row class="mt-sm" v-if="siteArrValue.length">
              <a-col span="4" class="tar mr"></a-col>
              <a-col span="17">
                <a-card>
                  <div v-for="(site, index) in siteArrValue" :key="index" style="margin-bottom: 10px">
                    <a-row>
                      <a-col :span="5">
                        <a-button type="primary" style="margin-left: 10px">{{ site.title }}</a-button>
                      </a-col>
                      <a-col :span="16" style="position: relative">
                        <a-cascader
                          style="width: 250px"
                          :fieldNames="{
                            label: isToTrans ? 'tabValue' : 'label',
                            value: 'value',
                            children: 'children',
                          }"
                          v-show="!searchStatus[site.code]"
                          v-model="selectDefaultData[site.code]"
                          :defaultValue="selectDefaultData[site.code]"
                          :options="selectList[site.code] || []"
                          @change="(value, selectedOptions) => onSelectChange(value, selectedOptions, site.code)"
                          :loadData="loadDataInfo"
                          placeholder="Please select"
                        />
                        <a-input
                          style="width: 250px"
                          v-model="searchDefaultData[site.code].value"
                          placeholder="请输入搜索内容"
                          @keydown="getSearchData($event, site.code, 1)"
                          @blur="getSearchData($event, site.code, 2)"
                          v-show="searchStatus[site.code]"
                        />
                        <div
                          class="search_card"
                          v-show="searchStatus[site.code] && searchData[site.code].length && searchType[site.code]"
                        >
                          <a-row>
                            <a-col
                              class="search_li"
                              v-for="(search, index) in searchData[site.code]"
                              :key="index"
                              @click="setSearchData(search, site.code)"
                            >
                              <div>
                                <span v-for="(sch, idex) in search" :key="idex">
                                  {{ sch.category_cn }}
                                  <i>/</i>
                                </span>
                              </div>
                              <div>
                                <span v-for="(sch, idex) in search" :key="idex">
                                  {{ sch.category }}
                                  <i>/</i>
                                </span>
                              </div>
                            </a-col>
                          </a-row>
                        </div>
                      </a-col>
                      <a-col :span="3">
                        <a-button
                          style="margin-left: 10px"
                          shape="circle"
                          :type="searchStatus[site.code] ? 'primary' : ''"
                          icon="search"
                          @click="showSearch(site.code)"
                        />
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="5"></a-col>
                      <a-col :span="16" class="category_li">
                        <span v-for="(item, index) in selectedOptions[site.code]" :key="index"
                        >{{ item.tabValue }}<i>/</i></span
                        >
                      </a-col>
                    </a-row>
                  </div>
                </a-card>
              </a-col>
            </a-row>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">翻译选项:</a-col>
              <a-col span="17">
                <a-select class="mr" v-model="defaultSlate" @change="SlateChange" style="width: 150px">
                  <a-select-option value="1" v-if="GLOBAL.translateType == 1">谷歌（收费）</a-select-option>
                  <a-select-option value="2">有道（收费）</a-select-option>
                  <a-select-option value="3">谷歌（免费）</a-select-option>
                  <a-select-option value="4">谷歌插件（免费）</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">当前语言:</a-col>
              <a-col span="17" style="overflow: hidden">
                <div class="mr flex-min-max" style="float: left; margin-bottom: 5px">
                  <a-button
                    size="small"
                    :type="initCountry === initLanguage ? 'primary' : 'default'"
                    @click="currentLanguage(initLanguage)"
                  >
                    {{ languageCode[initLanguage] }}
                  </a-button>
                  <span>{{ '(' + languageCodeOrcountry[initLanguage] + ')' }}</span>
                  <a-tooltip placement="top" v-if="isTransErr(initLanguage)">
                    <template slot="title">
                      <span>该语言内容字符超出限制，请修改</span>
                    </template>
                    <a-icon type="exclamation" style="color: red; font-size: 14px; margin-left: 5px" />
                  </a-tooltip>
                </div>
                <div
                  class="mr flex-min-max"
                  style="float: left; margin-bottom: 5px"
                  v-for="(item, index) in orilanguage"
                  :key="index"
                >
                  <a-button
                    :type="initCountry === item ? 'primary' : 'default'"
                    size="small"
                    @click="currentLanguage(item)"
                  >
                    {{ languageCode[item] }}
                  </a-button>
                  <span>{{ '(' + languageCodeOrcountry[item] + ')' }}</span>
                  <a-tooltip placement="top" v-if="isTransErr(item)">
                    <template slot="title">
                      <span>该语言内容字符超出限制，请修改</span>
                    </template>
                    <a-icon type="exclamation" style="color: red; font-size: 14px; margin-left: 5px" />
                  </a-tooltip>
                </div>
              </a-col>
            </a-row>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">翻译到:</a-col>
              <a-col span="17">
                <a-button type="primary" :loading="tranLoading" @click="toTranslate()">点击翻译</a-button>
              </a-col>
            </a-row>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">目标语言:</a-col>
              <a-col span="17">
                <a-button
                  class="mr"
                  size="small"
                  @click="TOlanguageAll('all')"
                  :type="languageAll === true ? 'primary' : 'default'"
                >全部
                </a-button>
                <a-button
                  class="mr"
                  style="margin-bottom: 5px"
                  v-for="(item, index) in language"
                  :key="index"
                  size="small"
                  :type="languageBtn[item.languages] === true ? 'primary' : 'default'"
                  @click="TOlanguage(item.languages)"
                >
                  {{ item.name }}
                </a-button>
              </a-col>
            </a-row>
            <a-form :form="form" class="editAll">
              <a-form-item v-show="initCountry == initLanguage">
                <a-row class="mt-sm">
                  <a-col span="4" class="tar mr">五点描述:</a-col>
                  <a-col span="17">
                    <div>
                      <a-textarea
                        @change="wordCountLimit(4, $event)"
                        @blur="changeBullet(initLanguage)"
                        v-decorator="['initialAll.' + initLanguage]"
                        :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        placeholder="请输入五点描述"
                        :rows="6"
                      />
                      <div>
                        <span class="limitTip" :class="{ beyondClass: rowCount > 5 }">已检测{{ rowCount }}点描述</span>
                        <span class="limitTip" :class="{ beyondClass: isInitialAllBeyond }">{{ initialAllText }}</span>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item v-show="initCountry == item" v-for="(item, index) in orilanguage" :Key="index">
                <a-row class="mt-sm">
                  <a-col span="4" class="tar mr">五点描述:</a-col>
                  <a-col span="17">
                    <div>
                      <a-textarea
                        @change="wordCountLimit(4, $event)"
                        @blur="changeBullet(item)"
                        v-decorator="['initialAll.' + item]"
                        :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        placeholder="请输入五点描述"
                        :rows="6"
                      />
                      <div>
                        <span class="limitTip" :class="{ beyondClass: rowCount > 5 }">已检测{{ rowCount }}点描述</span>
                        <span class="limitTip" :class="{ beyondClass: isInitialAllBeyond }">{{ initialAllText }}</span>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item>
                <a-row class="mt-sm" style="display: none">
                  <a-col span="4" class="tar mr">五点描述:</a-col>
                  <a-col span="17">
                    <div>
                      <a-form-item>
                        <a-input
                          placeholder="描述1"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point1.' + initLanguage,
                            { initialValue: addNewProduct == 0 ? data[initLanguage].bullet_point1 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          placeholder="描述2"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point2.' + initLanguage,
                            { initialValue: addNewProduct == 0 ? data[initLanguage].bullet_point2 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          placeholder="描述3"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point3.' + initLanguage,
                            { initialValue: addNewProduct == 0 ? data[initLanguage].bullet_point3 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          placeholder="描述4"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point4.' + initLanguage,
                            { initialValue: addNewProduct == 0 ? data[initLanguage].bullet_point4 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          placeholder="描述5"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point5.' + initLanguage,
                            { initialValue: addNewProduct == 0 ? data[initLanguage].bullet_point5 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item v-for="(item, index) in orilanguage" :Key="index">
                <a-row class="mt-sm" style="display: none">
                  <a-col span="4" class="tar mr">五点描述:</a-col>
                  <a-col span="17">
                    <div>
                      <a-form-item>
                        <a-input
                          placeholder="描述1"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point1.' + item,
                            { initialValue: data[item] ? data[item].bullet_point1 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          placeholder="描述2"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point2.' + item,
                            { initialValue: data[item] ? data[item].bullet_point2 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          placeholder="描述3"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point3.' + item,
                            { initialValue: data[item] ? data[item].bullet_point3 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          placeholder="描述4"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point4.' + item,
                            { initialValue: data[item] ? data[item].bullet_point4 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          placeholder="描述5"
                          @change="InitInfoFilling()"
                          v-decorator="[
                            'bullet_point5.' + item,
                            { initialValue: data[item] ? data[item].bullet_point5 : '' },
                          ]"
                          :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                        />
                      </a-form-item>
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item v-show="initCountry == this.initLanguage">
                <a-row class="mt-sm">
                  <a-col span="4" class="tar mr">关键词:</a-col>
                  <a-col span="17">
                    <div>
                      <a-input
                        @change="wordCountLimit(2, $event)"
                        v-decorator="[
                          'keywords.' + initLanguage,
                          { initialValue: addNewProduct == 0 ? data[initLanguage].keywords : '' },
                        ]"
                        :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                      />
                      <div>
                        <span class="limitTip" :class="{ beyondClass: isKeyBeyond }">{{ keywordsText }}</span>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item v-show="initCountry == item" v-for="(item, index) in orilanguage" :Key="index">
                <a-row class="mt-sm">
                  <a-col span="4" class="tar mr">关键词:</a-col>
                  <a-col span="17">
                    <div>
                      <a-input
                        @change="wordCountLimit(2, $event)"
                        v-decorator="['keywords.' + item, { initialValue: data[item] ? data[item].keywords : '' }]"
                        :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"
                      />
                      <div>
                        <span class="limitTip" :class="{ beyondClass: isKeyBeyond }">{{ keywordsText }}</span>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-form>
            <a-row class="mt-sm">
              <a-col span="4" class="tar mr">sku前缀:</a-col>
              <a-col span="17">
                <a-input v-model="sku" placeholder="请输入sku前缀"></a-input>
              </a-col>
            </a-row>
            <template slot="footer">
              <a-button key="back" @click="editceldel">取消</a-button>
              <a-button key="submit" type="primary" :loading="editLoading" @click="editOk"> 确定</a-button>
            </template>
          </a-modal>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab" :disabled="!hasPerm(permsBtn.amazon_product_release)"> 产品发布 </span>
          <!-- <class-template>
          </class-template> -->
          <product-release></product-release>
        </a-tab-pane>
        <a-tab-pane key="3" v-if="hasPerm(permsBtn.billList_list)">
          <span slot="tab"> 产品榜单 </span>
          <a-card>
            <a-row>
              <a-col>
                <a-select :defaultValue="defaultValues" style="width: 200px" @change="countrychangeTitle">
                  <a-select-option :value="item.code" v-for="(item, index) in countryList" :key="index">
                    {{ item.title }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row class="mt">
              <a-col :xs="12" :sm="12" :md="6" :lg="6" :xl="4" :xxl="4">
                <a-menu
                  style="width: 200px"
                  mode="inline"
                  :openKeys="openKeys"
                  @click="prodocthandleClick"
                  checkedChildren="dark"
                  @openChange="onOpenChange"
                >
                  <a-sub-menu v-for="item in productListMenu" :key="item.id" @titleClick="titleClicks">
                    <span slot="title"
                    ><span>{{ item.category_cn }}</span></span
                    >
                    <a-menu-item :key="v.id" v-for="v in productSubListMenu">{{ v.category_cn }}</a-menu-item>
                  </a-sub-menu>
                </a-menu>
              </a-col>
              <a-col :xs="12" :sm="12" :md="18" :lg="18" :xl="20" :xxl="20">
                <a-row>
                  <a-col
                    class="mb"
                    :xs="24"
                    :sm="24"
                    :md="8"
                    :lg="8"
                    :xl="6"
                    :xxl="4"
                    v-for="(item, index) in goodsList"
                    :key="index"
                  >
                    <a-card hoverable style="width: 220px" :loading="cardLoading">
                      <img @click.stop="openTo(item.link)" :src="item.cover" slot="cover" />
                      <a-card-meta :title="item.title">
                        <template slot="description">
                          <a-row class="font-sizes" type="flex" justify="center">
                            <a-col :span="6">售价:</a-col>
                            <a-col :span="12">{{ item.price }}</a-col>
                          </a-row>
                          <a-row type="flex" justify="center">
                            <a-col :span="6">排名:</a-col>
                            <a-col :span="12">{{ item.rank }}</a-col>
                          </a-row>
                          <a-row type="flex" justify="center">
                            <a-col :span="6">ASIN:</a-col>
                            <a-col :span="12">{{ item.ori_id }}</a-col>
                          </a-row>
                          <a-row>
                            <a-col :span="24">
                              <a-rate :defaultValue="item.star" disabled />
                            </a-col>
                          </a-row>
                          <a-row class="mt-sm" type="flex" justify="center">
                            <a-col>
                              <a-button @click.stop="copyTitle(item.title)">复制标题</a-button>
                            </a-col>
                          </a-row>
                        </template>
                      </a-card-meta>
                    </a-card>
                  </a-col>
                </a-row>
                <a-row v-if="goodsList" class="mt" type="flex" justify="end">
                  <a-col>
                    <a-pagination
                      v-model="currentBD"
                      @change="pagechangeBD"
                      :pageSize="pageBD.pageSize"
                      :total="pageBD.pageSize * pageBD.lastPage"
                    />
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="4" :disabled="!hasPerm(permsBtn.amazon_class)">
          <span slot="tab"> 自定义分类 </span>
          <class-template></class-template>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal title="消费确认" :visible="transPayVisibles" @ok="handleOkTrans" @cancel="handleCancelTrans">
      <p>消费类型：翻译</p>
      <p>消费详情谷歌：翻译{{ transWordLength }}字节(谷歌)</p>
      <p style="color: #f3ec09">预估本次消费：{{ transWordMoney }}元</p>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  deleteGoodList,
  getCollectList,
  country_list,
  trans_fee,
  productApply,
  boxdel,
  getcountry,
  getcategory,
  getrank,
  exportList,
  trans,
  getGoodsList,
  productCopy,
  getMyStore,
  ExportCheck,
  insertPublish,
  batchUpdate,
  authCountry,
  search_category,
  changeId,
  transPlugin,
  getPersonalCategory,
  getAmazonCategory,
  mwsReverse,
  exportOri,
  getExportError
} from '@/api/collect'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  codeORcountry,
  codeORcountrys,
  language,
  languageCode,
  languageCodeOrcountry,
  countrySelects
} from '@/views/order/public/country'
import { tokenFn } from '@/utils/util'
import { permsBtn } from '@/utils/static'
import classTemplate from './components/classTemplate.vue'
import productRelease from './components/productRelease.vue'
import moment from 'moment'

export default {
  name: 'collect',
  components: {
    classTemplate,
    productRelease
  },
  data () {
    return {
      moment,
      permsBtn,
      countrySelects,
      countryArr: [],
      initialArr: [],
      allCountrysState: false,
      collectData: '',
      selectManageAll: '',
      selectkey: '',
      site: 'amazon',
      ids: '',
      ModalText: '确定要删除吗',
      loading: false,
      visible: false,
      confirmLoading: false,
      delid: '',
      delAll: '',
      page: '',
      current: 1,
      action: '',
      html: '',
      chromeID: '',
      chromeCode: '',
      showChromeUrl: false,
      showChromeCode: false,
      pageSizeOption: [10, 20, 40, 60, 80, 100, 200],
      goodsList: [],
      countryList: '',
      defaultValues: 'GB',
      productListMenu: '',
      productSubListMenu: [{}],
      rootSubmenuKeys: [],
      keys: '',
      openKeys: [],
      pageBD: '',
      currentBD: 1,
      cardLoading: true,
      selectedRowKeys: [],
      collectUrlClass: '',
      htmlAll: '',
      disabledAll: false,
      successNumber: 0,
      errorNumber: 0,
      codeORcountrys,
      codeORcountry,
      data: [],
      selectkeyManage: '',
      siteManage: '',
      idManege: '',
      platformManege: 'amazon',
      ModalTextManage: '确定要删除吗',
      visibles: false,
      modals: false,
      modalsLoading: false,
      ManageLoading: false,
      listLoading: false,
      editShow: false,
      editLoading: false,
      disabshow: true,
      categoryCN: false,
      tabClassLoading: false,
      delidManage: '',
      delManageAll: '',
      searchName: '',
      labelCol: { lg: { span: 6 }, sm: { span: 6 } },
      wrapperCol: { lg: { span: 15 }, sm: { span: 13 } },
      wrapperCols: { lg: { span: 16 }, sm: { span: 16 } },
      //弹窗
      // language:"EN",
      currency: 'GBP',
      prefix: '',
      firm: '',
      brand: '',
      prefixl: '',
      prefix2: '',
      Noexport: [],
      Noexports: '',
      pageManage: '',
      currentManege: 1,
      pageSizeOptionManage: ['10', '20', '40', '60', '80', '100', '200'],
      copyloading: false,
      addsloading: false,
      addloading: false,
      shop: '',
      countryManage: 'all',
      classres: '',
      showclass: false,
      countrySelect: '',
      storeSelect: '',
      EXids: '',
      // failData:"",
      showWarning: false,
      ExTxt: '',
      ReleasedIds: '',
      EXcountryValue: false,
      shopSearchInfo: '',
      clearselect: false,
      dataStatus: '',
      EditAll: '',
      storeId: '0',
      storeEdit: '',
      siteSelect: '',
      checkedValues: '',
      EditStoreId: '',
      brand_name: '',
      sku: '',
      stock: '',
      bullet_point1: '',
      bullet_point2: '',
      bullet_point3: '',
      bullet_point4: '',
      bullet_point5: '',
      keywords: '',
      batchData: {
        store_id: '',
        country: '',
        brand_name: '',
        // manufacturer:"",
        keywords: '',
        quantity: '',
        bullet_point1: '',
        bullet_point2: '',
        bullet_point3: '',
        bullet_point4: '',
        bullet_point5: '',
        category: ''
      },
      defaultSlate: '3',
      characterTxt: '（100万字符=142.228人民币）',
      copyId: '',
      addId: '',
      bullet_pointAll: '',
      // 分类
      initCountry: '',
      siteValue: '',
      DEnum: '',
      NLnum: '',
      ESnum: '',
      ITnum: '',
      USnum: '',
      CAnum: '',
      MXnum: '',
      AEnum: '',
      BRnum: '',
      FRnum: '',
      GBnum: '',
      INnum: '',
      TRnum: '',
      JPnum: '',
      AUnum: '',
      PLnum: '',
      selectListDE: [],
      selectListNL: [],
      selectListSE: [],
      selectListES: [],
      selectListIT: [],
      selectListUS: [],
      selectListCA: [],
      selectListMX: [],
      selectListAE: [],
      selectListBR: [],
      selectListFR: [],
      selectListGB: [],
      selectListIN: [],
      selectListTR: [],
      selectListAU: [],
      selectListJP: [],
      selectListPL: [],
      //
      selectValueDE: [],
      selectValueNL: [],
      selectValueSE: [],
      selectValueES: [],
      selectValueIT: [],
      selectValueUS: [],
      selectValueMX: [],
      selectValueAE: [],
      selectValueBR: [],
      selectValueFR: [],
      selectValueGB: [],
      selectValueIN: [],
      selectValueTR: [],
      selectValueCA: [],
      selectValueAU: [],
      selectValueJP: [],
      selectValuePL: [],
      //
      classValueDE: '',
      classValueNL: '',
      classValueSE: '',
      classValueES: '',
      classValueIT: '',
      classValueUS: '',
      classValueCA: '',
      classValueMX: '',
      classValueAE: '',
      classValueBR: '',
      classValueFR: '',
      classValueGB: '',
      classValueIN: '',
      classValueTR: '',
      classValueAU: '',
      classValueJP: '',
      classValuePL: '',
      classNode: {},
      classNodeDE: '',
      classNodeNL: '',
      classNodeES: '',
      classNodeIT: '',
      classNodeUS: '',
      classNodeCA: '',
      classNodeMX: '',
      classNodeAE: '',
      classNodeBR: '',
      classNodeFR: '',
      classNodeGB: '',
      classNodeIN: '',
      classNodeTR: '',
      classNodeAU: '',
      classNodeJP: '',
      classNodePL: '',

      transPayVisibles: false,
      transWordLength: 0,
      transWordMoney: 0,
      countryCheck: [],
      disabShow: '',

      indeterminate1: false,
      indeterminate2: false,
      indeterminate3: false,
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkedList1: [],
      checkedList2: [],
      checkedList3: ['', ''],
      plainOptions1: [],
      plainOptions2: [],
      plainOptions3: [],
      countryAll: [],
      selectList: {
        DE: [],
        NL: [],
        SE: [],
        ES: [],
        IT: [],
        US: [],
        CA: [],
        MX: [],
        AE: [],
        BR: [],
        FR: [],
        GB: [],
        IN: [],
        TR: [],
        AU: [],
        JP: [],
        PL: []
      },
      category: {
        DE: '',
        NL: '',
        SE: '',
        ES: '',
        IT: '',
        US: '',
        CA: '',
        MX: '',
        AE: '',
        BR: '',
        FR: '',
        GB: '',
        IN: '',
        TR: '',
        AU: '',
        JP: '',
        PL: []
      },
      selectDefaultData: {
        DE: [],
        NL: [],
        SE: [],
        ES: [],
        IT: [],
        US: [],
        CA: [],
        MX: [],
        AE: [],
        BR: [],
        FR: [],
        GB: [],
        IN: [],
        TR: [],
        AU: [],
        JP: [],
        PL: []
      },
      selectDefaultArry: {
        DE: [],
        NL: [],
        SE: [],
        ES: [],
        IT: [],
        US: [],
        CA: [],
        MX: [],
        AE: [],
        BR: [],
        FR: [],
        GB: [],
        IN: [],
        TR: [],
        AU: [],
        JP: [],
        PL: []
      },
      siteArrValue: [],
      isToTrans: false,
      searchStatus: {
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
        JP: false,
        PL: false
      },
      searchDefaultData: {
        DE: {
          id: '',
          value: ''
        },
        NL: {
          id: '',
          value: ''
        },
        SE: {
          id: '',
          value: ''
        },
        ES: {
          id: '',
          value: ''
        },
        IT: {
          id: '',
          value: ''
        },
        US: {
          id: '',
          value: ''
        },
        CA: {
          id: '',
          value: ''
        },
        MX: {
          id: '',
          value: ''
        },
        AE: {
          id: '',
          value: ''
        },
        BR: {
          id: '',
          value: ''
        },
        FR: {
          id: '',
          value: ''
        },
        GB: {
          id: '',
          value: ''
        },
        IN: {
          id: '',
          value: ''
        },
        TR: {
          id: '',
          value: ''
        },
        AU: {
          id: '',
          value: ''
        },
        JP: {
          id: '',
          value: ''
        },
        PL: {
          id: '',
          value: ''
        }
      },
      searchData: {
        DE: [],
        NL: [],
        SE: [],
        ES: [],
        IT: [],
        US: [],
        CA: [],
        MX: [],
        AE: [],
        BR: [],
        FR: [],
        GB: [],
        IN: [],
        TR: [],
        AU: [],
        JP: [],
        PL: []
      },
      searchType: {
        DE: true,
        NL: true,
        SE: true,
        ES: true,
        IT: true,
        US: true,
        CA: true,
        MX: true,
        AE: true,
        BR: true,
        FR: true,
        GB: true,
        IN: true,
        TR: true,
        AU: true,
        JP: true,
        PL: true
      },
      selectedOptions: {
        NL: [],
        SE: [],
        ES: [],
        IT: [],
        US: [],
        CA: [],
        MX: [],
        AE: [],
        BR: [],
        FR: [],
        GB: [],
        IN: [],
        TR: [],
        AU: [],
        JP: [],
        PL: []
      },
      initLanguage: '',
      language,
      languageCode,
      languageCodeOrcountry,
      orilanguage: [],
      tranLoading: false,
      languageBtn: {
        de: false,
        nl: false,
        // se:false,
        es: false,
        it: false,
        fr: false,
        sv: false,
        en: false,
        ja: false,
        zh: false,
        pl: false
      },
      tranIdAll: [],
      languageValue: '',
      controllerAll: {
        title: true,
        detail: true,
        initialAll: true,
        keywords: true
      },
      transAll: {
        title: '',
        detail: '',
        keywords: '',
        bullet_point1: '',
        bullet_point2: '',
        bullet_point3: '',
        bullet_point4: '',
        bullet_point5: ''
      },
      translanguage: '',
      InitFive: {
        zh: [],
        en: [],
        es: [],
        se: [],
        fr: [],
        it: [],
        ja: [],
        de: [],
        nl: [],
        pl: []
      },
      languageAll: false,
      istitleBeyond: false,
      initialAllCount: 500,
      initialAllText: '',
      isInitialAllBeyond: false,
      rowCount: 0,
      keywordsCount: 250,
      keywordsText: '',
      isKeyBeyond: false,
      addNewProduct: 1,
      form: this.$form.createForm(this),
      black_count: '0',
      blackSwitch: false,
      blackPic: require('@/assets/icons/black.png'),
      personalList: '',
      customClassValue: '',
      tabKeys: '',
      startValue: null,
      endValue: null,
      endOpen: false,
      exportLoading: false,
      addWarning: '',
      showHover: '',
      plug: 1
    }
  },
  computed: {
    rowSelection () {
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
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  created () {
    this.plug = this.GLOBAL.PLUG
    if (this.$store.state.tabStatus.tabnum) {
      this.tabKeys = this.$store.state.tabStatus.tabnum
    } else {
      this.tabKeys = '1'
    }
    this.chromeCode = Vue.ls.get('CHROMENEWID')
  },
  mounted () {
    if (this.$route.query.isBlack) {
      this.blackSwitch = true
      this.BlackAndWhiteList(10)
    } else {
      if (Vue.ls.get('PAGE_SIZE_AMAZON')) {
        this.currentManege = Vue.ls.get('currentManege_amazon')
        this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
      } else {
        this.BlackAndWhiteList(10)
      }
    }
    this.getCountryList()
    this.chromeCode = Vue.ls.get('CHROMENEWID')
    this.isChromeEB()
    this.initCountry = 'zh'
    this.initLanguage = 'zh'
    this.defaultSlate = Vue.ls.get('SLATE_TYPE')
  },
  methods: {
    disabledStartDate (startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    onTimeChange () {
    },
    isTransErr (str) {
      let str3 = this.form.getFieldValue('keywords.' + str)
      let str4 = this.form.getFieldValue('bullet_point1.' + str)
      let str5 = this.form.getFieldValue('bullet_point2.' + str)
      let str6 = this.form.getFieldValue('bullet_point3.' + str)
      let str7 = this.form.getFieldValue('bullet_point4.' + str)
      let str8 = this.form.getFieldValue('bullet_point5.' + str)
      str3 = str3 ? str3 : ''
      str4 = str4 ? str4 : ''
      str5 = str5 ? str5 : ''
      str6 = str6 ? str6 : ''
      str7 = str7 ? str7 : ''
      str8 = str8 ? str8 : ''
      let status1 = true
      let status2 = false
      if (
        str3.length > 250 ||
        str4.length > 500 ||
        str5.length > 500 ||
        str6.length > 500 ||
        str7.length > 500 ||
        str8.length > 500
      ) {
        return status1
      } else {
        return status2
      }
    },
    onChange1 (checkedList) {
      let _this = this
      this.indeterminate1 = !!checkedList.length && checkedList.length < this.plainOptions1.length
      this.checkAll1 = checkedList.length === this.plainOptions1.length
      let unCheckData = []
      this.plainOptions1.forEach(function (item) {
        if (checkedList.indexOf(item) == -1) {
          unCheckData.push(item)
        }
      })
      if (unCheckData.length) {
        unCheckData.forEach(function (item) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteArrValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteArrValue.splice(index, 1)
              }
            })
          }
        })
      }
      checkedList.forEach(function (item) {
        if (_this.countryAll.indexOf(item) == -1) {
          _this.countryAll.push(item)
          _this.getSiteValue(item)
        }
      })
    },
    onChange2 (checkedList) {
      let _this = this
      this.indeterminate2 = !!checkedList.length && checkedList.length < this.plainOptions2.length
      this.checkAll2 = checkedList.length === this.plainOptions2.length
      let unCheckData = []
      this.plainOptions2.forEach(function (item) {
        if (checkedList.indexOf(item) == -1) {
          unCheckData.push(item)
        }
      })
      if (unCheckData.length) {
        unCheckData.forEach(function (item) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteArrValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteArrValue.splice(index, 1)
              }
            })
          } else {
          }
        })
      }
      checkedList.forEach(function (item) {
        if (_this.countryAll.indexOf(item) == -1) {
          _this.countryAll.push(item)
          _this.getSiteValue(item)
        }
      })
    },
    onChange3 (checkedList) {
      let _this = this
      let unCheckData = []
      this.plainOptions3.forEach(function (item) {
        if (checkedList.indexOf(item) == -1) {
          unCheckData.push(item)
        }
      })
      if (unCheckData.length) {
        unCheckData.forEach(function (item) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteArrValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteArrValue.splice(index, 1)
              }
            })
          }
        })
      }
      checkedList.forEach(function (item) {
        if (_this.countryAll.indexOf(item) == -1) {
          _this.countryAll.push(item)
          _this.getSiteValue(item)
        }
      })
    },
    onCheckAllChange1 (e) {
      let _this = this
      Object.assign(this, {
        checkedList1: e.target.checked ? this.plainOptions1 : [],
        indeterminate1: false,
        checkAll1: e.target.checked
      })
      if (this.checkAll1) {
        this.plainOptions1.forEach(function (item) {
          if (_this.countryAll.indexOf(item) == -1) {
            _this.countryAll.push(item)
            _this.getSiteValue(item)
          }
        })
      } else {
        this.plainOptions1.forEach(function (item, index) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              delete _this.selectList[code]
            }
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteArrValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteArrValue.splice(index, 1)
              }
            })
          }
        })
      }
    },
    onCheckAllChange2 (e) {
      let _this = this
      Object.assign(this, {
        checkedList2: e.target.checked ? this.plainOptions2 : [],
        indeterminate2: false,
        checkAll2: e.target.checked
      })
      if (this.checkAll2) {
        this.plainOptions2.forEach(function (item) {
          if (_this.countryAll.indexOf(item) == -1) {
            _this.countryAll.push(item)
            _this.getSiteValue(item)
          }
        })
      } else {
        this.plainOptions2.forEach(function (item, index) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              delete _this.selectList[code]
            }
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteArrValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteArrValue.splice(index, 1)
              }
            })
          }
        })
      }
    },
    enter (type, country, id) {
      if (type) {
        this.showHover = true
        getExportError({
          id: id,
          country: country
        }).then((res) => {
          if (res.code === 0) {
            this.addWarning = res.data
          }
        })
      } else {
        this.showHover = false
      }
    },
    leave () {
      this.showHover = false
    },
    //输出国家代码
    outPutCode (str) {
      switch (str) {
        case '德国':
          return 'DE'
          break
        case '荷兰':
          return 'NL'
          break
        case '瑞典':
          return 'SE'
          break
        case '西班牙':
          return 'ES'
          break
        case '意大利':
          return 'IT'
          break
        case '美国':
          return 'US'
          break
        case '墨西哥':
          return 'MX'
          break
        case '阿拉伯联合酋长国':
          return 'AE'
          break
        case '巴西':
          return 'BR'
          break
        case '法国':
          return 'FR'
          break
        case '英国':
          return 'GB'
          break
        case '印度':
          return 'IN'
          break
        case '土耳其':
          return 'TR'
          break
        case '加拿大':
          return 'CA'
          break
        case '澳大利亚':
          return 'AU'
          break
        case '日本':
          return 'JP'
          break
        case '波兰':
          return 'PL'
          break
      }
    },
    //获取下拉列表数据
    getSiteValue (code) {
      let _this = this
      switch (code) {
        case '德国':
          _this.siteArrValue.push({
            title: '德国',
            code: 'DE'
          })
          this.getSelectList('0', 'DE')
          break
        case '荷兰':
          _this.siteArrValue.push({
            title: '荷兰',
            code: 'NL'
          })
          this.getSelectList('0', 'NL')
          break
        case '瑞典':
          _this.siteArrValue.push({
            title: '瑞典',
            code: 'SE'
          })
          this.getSelectList('0', 'SE')
          break
        case '西班牙':
          _this.siteArrValue.push({
            title: '西班牙',
            code: 'ES'
          })
          this.getSelectList('0', 'ES')
          break
        case '意大利':
          _this.siteArrValue.push({
            title: '意大利',
            code: 'IT'
          })
          this.getSelectList('0', 'IT')
          break
        case '美国':
          _this.siteArrValue.push({
            title: '美国',
            code: 'US'
          })
          this.getSelectList('0', 'US')
          break
        case '墨西哥':
          _this.siteArrValue.push({
            title: '墨西哥',
            code: 'MX'
          })
          this.getSelectList('0', 'MX')
          break
        case '阿拉伯联合酋长国':
          _this.siteArrValue.push({
            title: '阿拉伯联合酋长国',
            code: 'AE'
          })
          this.getSelectList('0', 'AE')
          break
        case '巴西':
          _this.siteArrValue.push({
            title: '巴西',
            code: 'BR'
          })
          this.getSelectList('0', 'BR')
          break
        case '法国':
          _this.siteArrValue.push({
            title: '法国',
            code: 'FR'
          })
          this.getSelectList('0', 'FR')
          break
        case '英国':
          _this.siteArrValue.push({
            title: '英国',
            code: 'GB'
          })
          this.getSelectList('0', 'GB')
          break
        case '印度':
          _this.siteArrValue.push({
            title: '印度',
            code: 'IN'
          })
          this.getSelectList('0', 'IN')
          break
        case '土耳其':
          _this.siteArrValue.push({
            title: '土耳其',
            code: 'TR'
          })
          this.getSelectList('0', 'TR')
          break
        case '加拿大':
          _this.siteArrValue.push({
            title: '加拿大',
            code: 'CA'
          })
          this.getSelectList('0', 'CA')
          break
        case '澳大利亚':
          _this.siteArrValue.push({
            title: '澳大利亚',
            code: 'AU'
          })
          this.getSelectList('0', 'AU')
          break
        case '日本':
          _this.siteArrValue.push({
            title: '日本',
            code: 'JP'
          })
          this.getSelectList('0', 'JP')
          break
        case '波兰':
          _this.siteArrValue.push({
            title: '波兰',
            code: 'PL'
          })
          this.getSelectList('0', 'PL')
          break
      }
      _this.siteArrValue = _this.uniqueArray(_this.siteArrValue, 'title')
    },
    uniqueArray (arr, param) {
      if (Array.isArray(arr)) {
        let temp = []
        let newArr = arr.reduce((acc, cur) => {
          if (temp.indexOf(cur[param]) === -1) {
            temp.push(cur[param])
            acc.push(cur)
            return acc
          } else {
            return acc
          }
        }, [])
        return newArr
      }
    },

    getSelectList (val, code) {
      let _this = this
      authCountry({
        country: code,
        pid: val
      }).then((res) => {
        if (res.code === 0) {
          let selectData = []
          if (code === 'DE') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.DE = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.DE, code)
            }
          } else if (code === 'NL') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.NL = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.NL, code)
            }
          } else if (code === 'SE') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.SE = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.SE, code)
            }
          } else if (code === 'ES') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.ES = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.ES, code)
            }
          } else if (code === 'IT') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.IT = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.IT, code)
            }
          } else if (code === 'US') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.US = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.US, code)
            }
          } else if (code === 'MX') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.MX = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.MX, code)
            }
          } else if (code === 'AE') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.AE = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.AE, code)
            }
          } else if (code === 'BR') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.BR = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.BR, code)
            }
          } else if (code === 'FR') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.FR = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.FR, code)
            }
          } else if (code === 'GB') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.GB = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.GB, code)
            }
          } else if (code === 'IN') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.IN = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.IN, code)
            }
          } else if (code === 'TR') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.TR = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.TR, code)
            }
          } else if (code === 'CA') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.CA = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.CA, code)
            }
          } else if (code === 'AU') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.AU = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.AU, code)
            }
          } else if (code === 'JP') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.JP = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.JP, code)
            }
          } else if (code === 'PL') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.PL = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.PL, code)
            }
          }
          setTimeout(() => {
            _this.selectDefaultData[code] = JSON.parse(JSON.stringify(_this.selectDefaultData[code]))
          }, 3000)
        }
      })
    },
    setSelectData (data, code) {
      let dataInfo = []
      data.forEach(function (dat) {
        if (dat.is_menu == 0) {
          dataInfo.push({
            value: dat.id,
            label: dat.category_cn,
            tabValue: dat.category,
            code: code,
            categoryid: dat.node_id
          })
        } else {
          dataInfo.push({
            value: dat.id,
            label: dat.category_cn,
            tabValue: dat.category,
            isLeaf: false,
            code: code,
            categoryid: dat.node_id
          })
        }
      })
      return dataInfo
    },
    getChildList (obj, code) {
      let _this = this
      obj.forEach(function (itm, inx) {
        _this.selectDefaultArry[code].forEach(function (id, index) {
          if (itm.value == id) {
            _this.getauthCountry(id, code).then((res) => {
              if (res.length) {
                let childrenData = []
                res.forEach(function (item) {
                  let status
                  if (item.is_menu == 0) {
                    childrenData.push({
                      value: item.id,
                      label: item.category_cn,
                      tabValue: item.category,
                      code: code,
                      categoryid: item.node_id
                    })
                  } else {
                    childrenData.push({
                      value: item.id,
                      label: item.category_cn,
                      isLeaf: false,
                      tabValue: item.category,
                      code: code,
                      categoryid: item.node_id
                    })
                  }
                })
                itm.children = childrenData
                _this.getChildList(itm.children, code)
              }
            })
          }
        })
      })
      setTimeout(() => {
        _this.$store.commit('set_classLoading', false)
      }, 1000)
    },
    getauthCountry (val, site) {
      return authCountry({
        country: site,
        pid: val
      }).then((res) => {
        if (res.code === 0) {
          return res.data
        }
      })
    },
    loadDataInfo (selectedOptions) {
      let _this = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      this.getauthCountry(targetOption.value, targetOption.code).then((res) => {
        if (res.length) {
          let childrenData = []
          res.forEach(function (item) {
            let status
            if (item.is_menu == 0) {
              childrenData.push({
                value: item.id,
                label: item.category_cn,
                tabValue: item.category,
                code: targetOption.code,
                categoryid: item.node_id
              })
            } else {
              childrenData.push({
                value: item.id,
                label: item.category_cn,
                isLeaf: false,
                tabValue: item.category,
                code: targetOption.code,
                categoryid: item.node_id
              })
            }
          })
          targetOption.children = childrenData
          targetOption.loading = false
          _this.selectList[targetOption.code] = [..._this.selectList[targetOption.code]]
        }
      })
    },
    //搜索
    getSearchData (e, code, num) {
      if (e.target.value) {
        if (num == 1) {
          if (e.keyCode == '13') {
            search_category({
              country: code,
              keyword: e.target.value
            }).then((res) => {
              if (res.code === 0) {
                this.searchData[code] = res.data
                if (this.searchData[code].length) {
                  this.searchType[code] = true
                }
              } else {
                this.$notification.error({
                  message: '错误',
                  description: res.msg
                })
              }
            })
          }
        } else {
          search_category({
            country: code,
            keyword: e.target.value
          }).then((res) => {
            if (res.code === 0) {
              this.searchData[code] = res.data
              if (this.searchData[code].length) {
                this.searchType[code] = true
              }
            } else {
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      }
    },
    setSearchData (arr, code) {
      this.selectDefaultArry[code] = []
      this.selectDefaultData[code] = []
      this.selectedOptions[code] = []
      arr.forEach((item) => {
        this.selectDefaultArry[code].push(item.id)
        this.selectDefaultData[code].push(item.id + '')
        this.selectedOptions[code].push({
          label: item.category_cn,
          tabValue: item.category
        })
      })
      this.getChildList(this.selectList[code], code)
      this.searchDefaultData[code].id = arr.slice(-1)[0].id
      let str = ''
      arr.forEach(function (it, index) {
        if (index == arr.length - 1) {
          str += it.category_cn + ''
        } else {
          str += it.category_cn + '/'
        }
      })
      this.searchDefaultData[code].value = str
      this.searchType[code] = false
      this.searchStatus[code] = !this.searchStatus[code]
      setTimeout(() => {
        this.selectList = this.selectList
        this.selectDefaultData[code] = JSON.parse(JSON.stringify(this.selectDefaultData[code]))
      }, 1000)
    },
    //切换搜索
    showSearch (code) {
      this.searchStatus[code] = !this.searchStatus[code]
      this.searchData[code] = []
    },
    onSelectChange (value, selectedOptions, code) {
      this.selectedOptions[code] = selectedOptions
      this.selectDefaultData[code] = value
    },
    // 切换当前语言
    currentLanguage (val) {
      this.initCountry = val
      this.wordsLimitShow(val)
    },
    wordsLimitShow (tabVal) {
      //显示字数限制
      let num1, num2, num3, num4
      if (this.form.getFieldValue('keywords.' + tabVal)) {
        let KeyWordLimit = this.form.getFieldValue('keywords.' + tabVal).length
        if (KeyWordLimit <= 250) {
          num2 = 250 - KeyWordLimit
          this.keywordsText = '还可输入' + num2 + '字'
          this.isKeyBeyond = false
        } else if (KeyWordLimit > 250) {
          num2 = KeyWordLimit - 250
          this.keywordsText = '已超过' + num2 + '字'
          this.isKeyBeyond = true
        }
      } else {
        this.keywordsText = '还可输入250字'
        this.isKeyBeyond = false
      }

      setTimeout(() => {
        if (this.form.getFieldValue('initialAll.' + tabVal)) {
          let initialAllLimit = this.form.getFieldValue('initialAll.' + tabVal).length
          if (initialAllLimit <= 2500) {
            num4 = 2500 - initialAllLimit
            this.initialAllText = '还可输入' + num4 + '字'
            this.isInitialAllBeyond = false
          } else if (initialAllLimit > 2500) {
            num4 = initialAllLimit - 2500
            this.initialAllText = '已超过' + num4 + '字'
            this.isInitialAllBeyond = true
          }
          let rowStr = this.form.getFieldValue('initialAll.' + tabVal)
          let bulletREG = /\n/g
          this.rowCount = rowStr.split(bulletREG).filter((d) => d).length

          //单条超出判断
          let arr = rowStr.split(/\n/g)
          arr.forEach((item, index) => {
            if (item.length > 500) {
              this.isInitialAllBeyond = true
              this.initialAllText = '检测到”' + item.substring(0, 4) + '...“描述超出字符限制'
            }
          })
        } else {
          this.initialAllText = '还可输入2500字'
          this.isInitialAllBeyond = false
        }
      }, 500)
    },
    toTranslate () {
      var tranId = []
      var languags = ''
      this.tranLoading = true
      setTimeout(() => {
        if (this.tranLoading === true) {
          this.tranLoading = false
          this.alertErr('翻译出现错误请重新翻译')
        }
      }, 30000)
      Object.keys(this.languageBtn).forEach((item, index, key) => {
        if (this.languageBtn[item] === true) {
          tranId.push(item)
        }
      })
      this.tranIdAll = tranId
      tranId.forEach((item, index) => {
        if (item !== this.initLanguage) {
          languags += item + ','
        }
      })
      this.languageValue = languags.slice(0, -1)
      Object.keys(this.controllerAll).forEach((item, index) => {
        if (index === 2) {
          this.controllerAll.initialAll === true
            ? (this.transAll.bullet_point1 = this.form.getFieldValue('bullet_point1.' + this.initLanguage))
            : (this.transAll.bullet_point1 = '')
          this.controllerAll.initialAll === true
            ? (this.transAll.bullet_point2 = this.form.getFieldValue('bullet_point2.' + this.initLanguage))
            : (this.transAll.bullet_point2 = '')
          this.controllerAll.initialAll === true
            ? (this.transAll.bullet_point3 = this.form.getFieldValue('bullet_point3.' + this.initLanguage))
            : (this.transAll.bullet_point3 = '')
          this.controllerAll.initialAll === true
            ? (this.transAll.bullet_point4 = this.form.getFieldValue('bullet_point4.' + this.initLanguage))
            : (this.transAll.bullet_point4 = '')
          this.controllerAll.initialAll === true
            ? (this.transAll.bullet_point5 = this.form.getFieldValue('bullet_point5.' + this.initLanguage))
            : (this.transAll.bullet_point5 = '')
        } else if (index === 3) {
          this.controllerAll.keywords === true
            ? (this.transAll.keywords = this.form.getFieldValue('keywords.' + this.initLanguage))
            : (this.transAll.keywords = '')
        }
      })
      if (tranId.length > 0) {
        if (this.defaultSlate == 1) {
          trans_fee({
            to: this.languageValue,
            trans_type: 1, //1:谷歌翻译 2：有道翻译 3：谷歌免费翻译
            trans_obj: this.transAll
          }).then((res) => {
            if (res.code === 0) {
              this.transPayVisibles = true
              this.transWordLength = res.data.number
              this.transWordMoney = Number(res.data.money).toFixed(2)
            }
          })
        } else {
          this.toNewTrans()
        }
      } else {
        this.tranLoading = false
        this.$notification.error({
          message: '失败',
          description: '请选择翻译到的语言'
        })
      }
    },
    //  新的翻译
    toNewTrans (hide) {
      if (this.defaultSlate == 4) {
        //走插件翻译
        this.orilanguage = this.languageValue.split(',')
        this.orilanguage.forEach((item, index) => {
          transPlugin({
            trans_type: 'encode',
            trans_obj: this.transAll
          }).then((res) => {
            if (res.code === 0) {
              this.chromeToTransAll('auto', item, res.data, item, index)
            }
          })
        })
      } else {
        trans({
          trans_type: this.defaultSlate,
          from: this.initLanguage,
          to: this.languageValue,
          q: this.transAll,
          platform: 'amazon'
        }).then((res) => {
          if (res.code === 0) {
            this.translanguage = []
            Object.keys(res.data).forEach((item, index) => {
              this.orilanguage.push(item)
              this.translanguage.push(item)
            })
            this.tranLoading = false
            // 去重
            this.orilanguage = this.removal(this.orilanguage)
            setTimeout(() => {
              this.translanguage.forEach((item, index) => {
                if (item !== this.initLanguage) {
                  if (this.controllerAll.keywords === true) {
                    this.form.setFieldsValue({
                      ['keywords.' + item]: res.data[item].keywords
                    })
                  }
                  if (this.controllerAll.initialAll === true) {
                    this.form.setFieldsValue({
                      ['bullet_point1.' + item]: res.data[item].bullet_point1,
                      ['bullet_point2.' + item]: res.data[item].bullet_point2,
                      ['bullet_point3.' + item]: res.data[item].bullet_point3,
                      ['bullet_point4.' + item]: res.data[item].bullet_point4,
                      ['bullet_point5.' + item]: res.data[item].bullet_point5
                    })
                  }
                  this.InitInfoFilling()
                }
                if (hide) {
                  setTimeout(hide, 0)
                }
              })
            }, 1000)
            if (hide) {
              setTimeout(hide, 0)
            }
            this.tranLoading = false
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
          } else {
            this.tranLoading = false
            if (hide) {
              setTimeout(hide, 0)
            }
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }
    },
    chromeToTransAll (sl, tl, q, country, count) {
      let _this = this
      let h = window.chrome
      let targetExtensionId = _this.chromeCode
      let tk = tokenFn(q)
      if (h && h.runtime && h.runtime.sendMessage) {
        h.runtime.sendMessage(
          targetExtensionId,
          {
            type: 'translate',
            msg: 'Hello',
            sl: sl,
            tl: tl,
            tk: tk,
            q: encodeURI(q)
          },
          function (response) {
            if (response.state === 'ok') {
              let ret = response.data[0]
              let data = ''
              for (let i = 0; i < ret.length; i++) {
                if (ret[i][0]) {
                  data += ret[i][0]
                }
              }
              let resData = data
              transPlugin({
                trans_type: 'decode',
                trans_obj: resData
              }).then((res) => {
                if (res.code === 0) {
                  _this.tranLoading = false
                  _this.form.setFieldsValue({
                    ['title.' + country]: res.data[0],
                    ['detail.' + country]: res.data[1],
                    ['keywords.' + country]: res.data[2],
                    ['bullet_point1.' + country]: res.data[3],
                    ['bullet_point2.' + country]: res.data[4],
                    ['bullet_point3.' + country]: res.data[5],
                    ['bullet_point4.' + country]: res.data[6],
                    ['bullet_point5.' + country]: res.data[7]
                  })
                  if (count >= _this.orilanguage.length - 1) {
                    _this.tranLoading = false
                    _this.$notification.success({
                      message: '成功',
                      description: '翻译成功'
                    })
                    setTimeout(() => {
                      _this.wordsLimitShow(_this.initLanguage)
                      _this.InitInfoFilling()
                    }, 200)
                  }
                } else {
                  _this.tranLoading = false
                }
              })
            } else {
              _this.tranLoading = false
              _this.$notification.success({ message: '提醒', description: '插件通信失败，请检查插件是否安装成功' })
            }
          }
        )
      } else {
        _this.$notification.error({
          message: '错误',
          description: '插件通信失败'
        })
      }
    },
    //五点描述 主动填充
    InitInfoFilling () {
      setTimeout(() => {
        this.InitFive[this.initLanguage] = []
        this.InitFive[this.initLanguage].push(
          this.form.getFieldValue('bullet_point1.' + this.initLanguage),
          this.form.getFieldValue('bullet_point2.' + this.initLanguage),
          this.form.getFieldValue('bullet_point3.' + this.initLanguage),
          this.form.getFieldValue('bullet_point4.' + this.initLanguage),
          this.form.getFieldValue('bullet_point5.' + this.initLanguage)
        )
        let arr = this.deleteTrim(this.InitFive[this.initLanguage])
        this.form.setFieldsValue({
          ['initialAll.' + this.initLanguage]: arr.join('\n')
        })

        this.orilanguage.forEach((item, index) => {
          if (item !== this.initLanguage) {
            this.InitFive[item] = []
            this.InitFive[item].push(
              this.form.getFieldValue('bullet_point1.' + item),
              this.form.getFieldValue('bullet_point2.' + item),
              this.form.getFieldValue('bullet_point3.' + item),
              this.form.getFieldValue('bullet_point4.' + item),
              this.form.getFieldValue('bullet_point5.' + item)
            )
            let arr1 = this.deleteTrim(this.InitFive[item])
            this.form.setFieldsValue({
              ['initialAll.' + item]: arr1.join('\n')
            })
          }
        })
      }, 200)
    },
    TOlanguageAll () {
      this.languageAll = !this.languageAll
      if (this.languageAll === true) {
        Object.keys(this.languageBtn).forEach((key) => {
          this.languageBtn[key] = true
        })
      } else {
        Object.keys(this.languageBtn).forEach((key) => {
          this.languageBtn[key] = false
        })
      }
    },
    TOlanguage (country) {
      var showlanguageAll = []
      this.languageBtn[country] = !this.languageBtn[country]
      Object.keys(this.languageBtn).forEach((item, index) => {
        if (this.languageBtn[item] === true) {
          showlanguageAll.push(item)
        }
      })
      if (showlanguageAll.length === 9) {
        this.languageAll = true
      } else {
        this.languageAll = false
      }
    },
    // 五点描述All分别填充到五点描述
    changeBullet (count) {
      let bulletREG = /\n/g
      let bulletArr = new Array()
      bulletArr = this.form
        .getFieldValue('initialAll.' + count)
        .split(bulletREG)
        .filter((d) => d)
      let arres = ['bullet_point1', 'bullet_point2', 'bullet_point3', 'bullet_point4', 'bullet_point5']
      bulletArr.forEach((item, index) => {
        if (bulletArr.length >= arres.length) {
          this.form.setFieldsValue({
            [arres[index] + '.' + count]: item
          })
        } else {
          if (bulletArr.length === 4) {
            this.form.setFieldsValue({
              [arres[index] + '.' + count]: item
            })
            this.form.setFieldsValue({
              [arres[4] + '.' + count]: ''
            })
          } else if (bulletArr.length === 3) {
            this.form.setFieldsValue({
              [arres[index] + '.' + count]: item
            })
            this.form.setFieldsValue({
              [arres[3] + '.' + count]: ''
            })
            this.form.setFieldsValue({
              [arres[4] + '.' + count]: ''
            })
          } else if (bulletArr.length === 2) {
            this.form.setFieldsValue({
              [arres[index] + '.' + count]: item
            })
            this.form.setFieldsValue({
              [arres[3] + '.' + count]: ''
            })
            this.form.setFieldsValue({
              [arres[4] + '.' + count]: ''
            })
            this.form.setFieldsValue({
              [arres[2] + '.' + count]: ''
            })
          } else if (bulletArr.length === 1) {
            this.form.setFieldsValue({
              [arres[index] + '.' + count]: item
            })
            this.form.setFieldsValue({
              [arres[1] + '.' + count]: ''
            })
            this.form.setFieldsValue({
              [arres[3] + '.' + count]: ''
            })
            this.form.setFieldsValue({
              [arres[4] + '.' + count]: ''
            })
            this.form.setFieldsValue({
              [arres[2] + '.' + count]: ''
            })
          }
        }
      })
    },
    tabController (core) {
      this.controllerAll[core] = !this.controllerAll[core]
    },
    alertErr (val) {
      this.$notification.error({
        message: '错误',
        description: val
      })
    },
    removal (array) {
      var res = []
      for (var i = 0, len = array.length; i < len; i++) {
        var current = array[i]
        if (res.indexOf(current) === -1) {
          res.push(current)
        }
      }
      return res
    },
    deleteTrim (arr) {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i]) {
          return arr
        } else {
          arr.splice(i, 1)
        }
      }
      return arr
    },
    jumpToOrderUrl (url) {
      if (url) {
        window.open(url, '_blank')
      } else {
      }
    },
    //获取国家列表
    getCountryList () {
      let _this = this
      _this.countrySelect = []
      country_list({
        type: 1
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.amazon.NA) {
            res.data.amazon.NA.forEach(function (country) {
              _this.countrySelect.push({
                title: country.code,
                value: country.title
              })
              _this.plainOptions1.push(country.title)
            })
          }
          if (res.data.amazon.EU) {
            res.data.amazon.EU.forEach(function (country) {
              _this.countrySelect.push({
                title: country.code,
                value: country.title
              })
              _this.plainOptions2.push(country.title)
            })
          }
          if (res.data.amazon.FE) {
            res.data.amazon.FE.forEach(function (country) {
              _this.countrySelect.push({
                title: country.code,
                value: country.title
              })
              _this.plainOptions3.push(country.title)
            })
          }
        }
      })
    },
    onChangeButton (checked) {
      if (!this.allCountrysState) {
        var arrCodeORcountrys = []
        // 循环对象 ES5 增加了 Object.keys 方法，直接获取对象自己的所有键，返回数组：
        arrCodeORcountrys = Object.keys(codeORcountrys)
        this.EXcountryValue = arrCodeORcountrys.join(',')
        let str = ''
        for (var i = 0; i < this.selectManageAll.length; i++) {
          str += this.selectManageAll[i].id + ','
        }
        this.EXids = str.slice(0, -1)
        ExportCheck({
          country: this.EXcountryValue,
          ids: this.EXids
        }).then((res) => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              this.countryArr = res.data
              this.showWarning = true
            } else {
              this.showWarning = false
            }
          }
        })
      } else {
        this.EXcountryValue = ''
        this.countryArr = []
      }
      this.allCountrysState = !this.allCountrysState
    },
    //判断插件是否安装
    isChromeEB () {
    },
    // 删除
    prodels () {
      if (this.delAll === false) {
        this.collectData.forEach((item, index) => {
          if (item.id == this.delid) {
            this.collectData.splice(index, 1)
          }
        })
        boxdel({
          ids: this.delid,
          platform: this.platform
        }).then((res) => {
          if (res.code === 0) {
            this.ModalText = res.msg
            if (Vue.ls.get('PAGE_SIZE_AMAZON')) {
              this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
            } else {
              this.BlackAndWhiteList(10)
            }
          } else {
          }
        })
      } else {
        if (this.selectManageAll) {
          let str = ''
          for (var i = 0; i < this.selectManageAll.length; i++) {
            str += this.selectManageAll[i].id + ','
          }
          this.ids = str.slice(0, -1)
          boxdel({
            ids: this.ids,
            platform: this.platform
          }).then((res) => {
            if (res.code === 0) {
              this.ModalText = res.msg
              this.selectedRowKeys = []
              if (Vue.ls.get('PAGE_SIZE_AMAZON')) {
                this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
              } else {
                this.BlackAndWhiteList(10)
              }
            } else {
            }
          })
        }
      }
    },
    Edits (id, siteManage, ori_pid, obj) {
      if (obj.type == 8) {
        this.$router.push({
          path: '/product/manage/templateGoodEdit',
          query: {
            id: id,
            ori_pid: ori_pid,
            site: siteManage,
            type: 0,
            combination: obj.combination
          }
        })
      } else {
        this.$router.push({
          path: '/product/manage/goodedit',
          query: {
            id: id,
            site: siteManage,
            type: 0
          }
        })
      }
      this.$store.commit('set_tabnum', '1')
      Vue.ls.set('MANAGE_ID', id)
    },

    // 批量认领
    collectClaimAll () {
      if (this.selectManageAll.length > 0) {
        let str = ''
        for (var i = 0; i < this.selectManageAll.length; i++) {
          str += this.selectManageAll[i].id + ','
        }
        this.ids = str.slice(0, -1)
        if (this.ids) {
          productApply({
            ids: this.ids,
            platform: this.site
          }).then((res) => {
            if (res.code === 0) {
              if (Vue.ls.get('PAGE_SIZE_AMAZON')) {
                this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
              } else {
                this.BlackAndWhiteList(10)
              }
              this.$notification.success({
                message: '提醒',
                description: res.msg
              })
              this.selectedRowKeys = []
            }
          })
        } else {
        }
      } else {
        this.$notification.error({
          message: '错误',
          description: '请选择认领的商品'
        })
      }
    },
    jumpto (val) {
      window.open(val, '_blank')
    },
    // 榜单相关的js ****************************************************************************************
    prodocthandleClick (e) {
      this.getGoodsListBD(this.defaultValues, e.key)
      this.keys = e.key
      //执行数据请求
    },
    //请求榜单商品数据
    getGoodsListBD (defaultValues, id) {
      this.cardLoading = true
      getrank({
        country: defaultValues,
        id: id,
        page: this.currentBD,
        page_size: '10'
      }).then((res) => {
        if (res.code === 0) {
          this.goodsList = res.data
          this.pageBD = res.pages
          this.cardLoading = false
        }
      })
    },
    pagechangeBD (page, pagesize) {
      this.currentBD = page
      this.getGoodsListBD(this.defaultValues, this.keys)
    },
    titleClicks (key) {
      this.subcategory(this.defaultValues, key.key)
    },
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find((key) => {
        return this.openKeys.indexOf(key) === -1
      })
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    callback (key) {
      if (key === '3') {
        getcountry({}).then((res) => {
          if (res.code === 0) {
            this.countryList = res.data
            this.getcategorys(this.defaultValues, '0')
          }
        })
      } else if (key === '1') {
        if (Vue.ls.get('PAGE_SIZE_AMAZON')) {
          this.currentManege = Vue.ls.get('currentManege_amazon')
          this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
        } else {
          this.BlackAndWhiteList(10)
        }
      }
    },
    countrychangeTitle (value) {
      this.defaultValues = value
      this.getcategorys(this.defaultValues, '0')
    },
    getcategorys (country, id) {
      getcategory({
        country: country,
        pid: id
      }).then((res) => {
        if (res.code === 0) {
          this.rootSubmenuKeys = []
          this.productListMenu = res.data
          this.productListMenu.forEach((item, index) => {
            this.rootSubmenuKeys.push(item.id)
          })
          if (res.data.length > 0) {
            getcategory({
              country: country,
              pid: this.productListMenu[0].id
            }).then((res) => {
              if (res.code === 0) {
                if (res.data.length > 0) {
                }
                this.keys = res.data[0].id
                this.getGoodsListBD(this.defaultValues, res.data[0].id)
              }
            })
          }
        }
      })
    },
    subcategory (country, id) {
      getcategory({
        country: country,
        pid: id
      }).then((res) => {
        if (res.code === 0) {
          this.productListMenu.forEach((item, index) => {
            if (item.id === id) {
              this.productSubListMenu = res.data
            }
          })
        }
      })
    },
    copyTitle (txt) {
      //原生copy方法
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', txt)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$notification.success({
          message: '复制成功',
          description: '复制内容为:' + txt
        })
      }
      document.body.removeChild(input)
    },
    openTo (link) {
      window.open(link, '_blank')
    },
    pagechange (page, pagesize) {
      this.current = page
      this.currentManege = page
      Vue.ls.set('currentManege_amazon', page)
      this.BlackAndWhiteList(pagesize)
    },
    // 区分黑名单和白名单
    BlackAndWhiteList (pagesize) {
      if (!this.blackSwitch) {
        this.getGoodsLists(pagesize)
      } else {
        let dataInfo = {
          page: this.current,
          page_size: pagesize,
          is_black: 1
        }
        this.getCollectListFn(dataInfo)
      }
    },
    // lll
    onShowSizeChange (current, pageSize) {
      this.BlackAndWhiteList(pageSize)
      Vue.ls.set('PAGE_SIZE_AMAZON', pageSize)
      Vue.ls.set('currentManege_amazon', current)
    },
    // 获取国家 和店铺信息
    getMyStores () {
      getMyStore({}).then((res) => {
        if (res.code === 0) {
          ;(this.storeSelect = res.data), (this.storeEdit = res.data)
        }
      })
    },
    getGoodsLists (pagesize) {
      this.listLoading = true
      getCollectList({
        page: this.currentManege,
        page_size: pagesize
      }).then((res) => {
        if (res.code === 0) {
          this.listLoading = false
          if (res.data.data.length > 0) {
            this.data = res.data.data
            this.currentManege = parseInt(res.pages.currentPage)
            this.pageManage = res.pages
            this.siteManage = res.data.data.platform
            this.black_count = res.data.black_count
          } else {
            this.data = []
            this.black_count = res.data.black_count
          }
        } else {
          this.listLoading = false
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    // change 导出国家选项
    EXcountryChange (value) {
      this.EXcountryValue = value.join(',')
      let str = ''
      for (var i = 0; i < this.selectManageAll.length; i++) {
        str += this.selectManageAll[i].id + ','
      }
      this.EXids = str.slice(0, -1)
      ExportCheck({
        country: this.EXcountryValue,
        ids: this.EXids
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.length > 0) {
            this.countryArr = res.data
            this.showWarning = true
          } else {
            this.showWarning = false
          }
        }
      })
    },
    addProduct () {
      this.$store.commit('set_goodsId', '')
      this.$router.push({
        path: '/product/manage/goodedit',
        query: {
          type: 1
        }
      })
    },
    goTemplateGood () {
      this.$router.push({
        path: '/product/manage/templateGood',
        query: {
          type: 1
        }
      })
    },
    SlateChange (val) {
      Vue.ls.set('SLATE_TYPE', val)
      if (val === '1') {
        this.characterTxt = '（100万字符=20美元）'
      } else if (val === '2') {
        this.characterTxt = '（100万字符=48人民币）'
      } else if (val === '3') {
        this.characterTxt = '（注：免费翻译会不准确，有时出现无法翻译现象！）'
      }
    },
    // 批量编辑
    EditsAll () {
      if (this.selectManageAll.length > 0) {
        this.getPersonalCategoryFn()
        let str = ''
        for (var i = 0; i < this.selectManageAll.length; i++) {
          str += this.selectManageAll[i].id + ','
        }
        this.EditAll = str.slice(0, -1)
        this.editShow = true
        this.disabShow = true
        this.siteSelect = []
        this.countryCheck = []
        this.countrySelect.forEach((item) => {
          this.siteSelect.push({
            label: item.value,
            value: item.title
          })
        })
        if (Vue.ls.get('SLATE_TYPE')) {
          this.defaultSlate = Vue.ls.get('SLATE_TYPE')
          if (Vue.ls.get('SLATE_TYPE') === '1') {
            this.characterTxt = '（100万字符=20美元）'
          } else if (Vue.ls.get('SLATE_TYPE') === '2') {
            this.characterTxt = '（100万字符=48人民币）'
          } else if (Vue.ls.get('SLATE_TYPE') === '3') {
            this.characterTxt = '（注：免费翻译会不准确，有时出现无法翻译现象！）'
          }
        } else {
          this.defaultSlate = '1'
        }
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选批量编辑的选项'
        })
      }
      this.selectListDE = ''
      this.DEnum = '0'
      this.selectListNL = ''
      this.NLnum = '0'
      this.selectListES = ''
      this.ESnum = '0'
      this.selectListIT = ''
      this.ITnum = '0'
      this.selectListUS = ''
      this.USnum = '0'
      this.selectListCA = ''
      this.CAnum = '0'
      this.selectListMX = ''
      this.MXnum = '0'
      this.selectListAE = ''
      this.AEnum = '0'
      this.selectListBR = ''
      this.BRnum = '0'
      this.selectListFR = ''
      this.FRnum = '0'
      this.selectListGB = ''
      this.GBnum = '0'
      this.selectListIN = ''
      this.INnum = '0'
      this.selectListTR = ''
      this.TRnum = '0'
      this.selectListAU = ''
      this.AUnum = '0'
      this.selectListJP = ''
      this.JPnum = '0'
      this.selectListPL = ''
      this.PLnum = '0'
      this.isKeyBeyond = false
      this.keywordsText = '还可输入250字'
      this.initialAllText = '还可输入2500字'
    },
    // 批量修改信息
    EditsInfoAll () {
      if (this.selectManageAll.length > 0) {
        let selectID = this.selectkey.join(',')
        this.$router.push({
          name: 'editInfoAll',
          query: {
            code: selectID
          }
        })
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选删除的选项'
        })
      }
    },
    onCheck (checkedValues) {
      this.checkedValues = checkedValues
      if (this.checkedValues.length == 0) {
        this.disabShow = true
      }
    },
    ChangeStore (val) {
      if (val === '0') {
        this.storeEdit = []
      } else {
        this.storeEdit.forEach((item, index) => {
          if (val === item.id) {
            this.siteSelect = item.mws_site
          }
        })
      }
    },
    editOk () {
      let _this = this
      this.editLoading = true
      let categoryId
      let categoryInfo
      if (this.siteArrValue.length) {
        this.siteArrValue.forEach(function (site) {
          if (_this.searchStatus[site.code]) {
            _this.category[site.code] = _this.searchDefaultData[site.code].id
          } else {
            _this.category[site.code] = _this.selectDefaultData[site.code].slice(-1).toString()
          }
        })
        categoryId = JSON.parse(JSON.stringify(this.category))
        for (let cat in categoryId) {
          if (categoryId[cat] == '') {
            delete categoryId[cat]
          }
        }
        changeId({
          ids: categoryId
        }).then((res) => {
          if (res.code == 0) {
            categoryInfo = {}
            Object.keys(categoryId).forEach((item, index) => {
              let idObj = {
                node_id: res.data[item],
                cid: categoryId[item]
              }
              categoryInfo[item] = idObj
            })
          }
        })
      } else {
        categoryInfo = {}
      }

      const {
        form: { validateFields }
      } = this
      validateFields((err, values) => {
        this.subvalues = values
      })

      if (this.siteArrValue.length) {
        if (JSON.stringify(categoryInfo) == '{}') {
          this.editLoading = false
          this.$notification.error({
            message: '错误',
            description: '保存失败，请选择分类'
          })
          return
        }
      }
      if (this.subvalues.initialAll.zh) {
        if (this.orilanguage.length) {
          this.orilanguage.forEach((item, index) => {
            if (!this.subvalues.initialAll[item]) {
              this.editLoading = false
              this.$notification.error({
                message: '错误',
                description: '保存失败，请选择目标语言并成功进行翻译'
              })
              return
            }
          })
        } else {
          this.editLoading = false
          this.$notification.error({
            message: '错误',
            description: '保存失败，请选择目标语言并进行翻译'
          })
          return
        }
      }
      if (this.subvalues.keywords.zh) {
        if (this.orilanguage.length) {
          this.orilanguage.forEach((item, index) => {
            if (!this.subvalues.keywords[item]) {
              this.editLoading = false
              this.$notification.error({
                message: '错误',
                description: '保存失败，请选择目标语言并成功进行翻译'
              })
              return
            }
          })
        } else {
          this.editLoading = false
          this.$notification.error({
            message: '错误',
            description: '保存失败，请选择目标语言并进行翻译'
          })
          return
        }
      }
      if (
        !this.brand_name &&
        !this.stock &&
        JSON.stringify(categoryInfo) == '{}' &&
        !this.subvalues.initialAll.zh &&
        !this.subvalues.keywords.zh &&
        !this.sku
      ) {
        this.editLoading = false
        this.$notification.error({
          message: '错误',
          description: '保存失败，如无需进行修改请点击取消'
        })
      } else {
        setTimeout(() => {
          batchUpdate({
            ids: this.EditAll,
            brand_name: this.brand_name,
            quantity: this.stock,
            category: categoryInfo,
            bullet_point1: this.subvalues.bullet_point1,
            bullet_point2: this.subvalues.bullet_point2,
            bullet_point3: this.subvalues.bullet_point3,
            bullet_point4: this.subvalues.bullet_point4,
            bullet_point5: this.subvalues.bullet_point5,
            keywords: this.subvalues.keywords,
            sku_pre: this.sku
          }).then((res) => {
            if (res.code === 0) {
              this.$notification.success({
                message: '成功',
                description: res.msg
              })
              this.delinfo()
              setTimeout(() => {
                this.editShow = false
                this.editLoading = false
              }, 800)
              this.selectedRowKeys = []
              this.selectManageAll = ''
              this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
            } else {
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
              setTimeout(() => {
                this.editShow = false
                this.editLoading = false
              }, 800)
              this.selectedRowKeys = []
              this.selectManageAll = ''
            }
          })
        }, 2000)
      }
    },
    editceldel (e) {
      this.delinfo()
      this.editShow = false
      this.storeId = '0'
      this.checkedValues = ''
      this.siteSelect = []
      this.countryCheck = []
      // 取消自定义分类数据
      this.customClassValue = ''
      this.siteArrValue = []
      this.checkedList1 = []
      this.checkedList2 = []
      this.checkedList3 = ['', '']
      this.searchStatus = {
        DE: false,
        NL: false,
        SE: false,
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
        JP: false,
        PL: false
      }
    },
    delinfo () {
      this.bullet_pointAll = ''
      this.brand_name = ''
      this.stock = ''
      this.bullet_point1 = ''
      this.bullet_point2 = ''
      this.bullet_point3 = ''
      this.bullet_point4 = ''
      this.bullet_point5 = ''
      this.keywords = ''
    },
    // 提交
    subEdit () {
      this.batchData.store_id = this.storeId
      this.batchData.country = this.EditStoreId
      this.batchData.brand_name = this.brand_name
      this.batchData.keywords = this.keywords
      this.batchData.quantity = this.stock
      this.batchData.bullet_point1 = this.bullet_point1
      this.batchData.bullet_point2 = this.bullet_point2
      this.batchData.bullet_point3 = this.bullet_point3
      this.batchData.bullet_point4 = this.bullet_point4
      this.batchData.bullet_point5 = this.bullet_point5
      this.batchData.category = this.classNode
      if (this.defaultSlate == 1) {
        trans_fee({
          to: this.batchData.country,
          trans_type: 1, //1:谷歌翻译 2：有道翻译 3：谷歌免费翻译
          trans_obj: {
            title: '',
            detail: '',
            keywords: this.keywords,
            bullet_point1: this.bullet_point1,
            bullet_point2: this.bullet_point2,
            bullet_point3: this.bullet_point3,
            bullet_point4: this.bullet_point4,
            bullet_point5: this.bullet_point5
          }
        }).then((res) => {
          if (res.code === 0) {
            this.transPayVisibles = true
            this.transWordLength = res.data.number
            this.transWordMoney = Number(res.data.money).toFixed(2)
          } else {
            this.editLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        this.againNext()
      }
    },
    againNext (hide) {
      if (
        this.brand_name.length > 0 ||
        this.stock.length > 0 ||
        this.keywords.length > 0 ||
        this.bullet_point1.length > 0 ||
        this.bullet_point2.length > 0 ||
        this.bullet_point3.length > 0 ||
        this.bullet_point4.length > 0 ||
        this.bullet_point5.length > 0 ||
        parseFloat(this.storeId) > 0 ||
        this.EditStoreId.length > 0
      ) {
        batchUpdate({
          ids: this.EditAll,
          data: this.batchData,
          trans_type: this.defaultSlate
        }).then((res) => {
          if (res.code === 0) {
            if (hide) {
              setTimeout(hide, 0)
            }
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.delinfo()
            setTimeout(() => {
              this.editShow = false
              this.editLoading = false
            }, 800)
            this.selectedRowKeys = []
            this.selectManageAll = ''
            this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
          } else {
            if (hide) {
              setTimeout(hide, 0)
            }
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            setTimeout(() => {
              this.editShow = false
              this.editLoading = false
            }, 800)
            this.selectedRowKeys = []
            this.selectManageAll = ''
          }
        })
      } else {
        this.editLoading = false
        this.checkedValues = []
        if (hide) {
          setTimeout(hide, 0)
        }
        this.$notification.error({
          message: '错误',
          description: '请填写编辑信息!'
        })
      }
    },
    copyProduct (id) {
      this.copyId = id
      this.copyloading = true
      productCopy({
        id: id
      }).then((res) => {
        if (res.code === 0) {
          this.currentManege = Vue.ls.get('currentManege_amazon')
          this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
          this.copyloading = false
        }
      })
    },
    collectdel (id) {
      this.visibles = true
      this.delidManage = id
      this.delManageAll = false
    },
    toSearch () {
      this.listLoading = true
      getGoodsList({
        keywords: this.searchName
      }).then((res) => {
        if (res.code === 0) {
          this.listLoading = false
          if (res.data.data.length > 0) {
            this.data = res.data.data
            this.siteManage = res.data.data.platform
            this.black_count = res.data.black_count
          }
        } else {
        }
      })
    },
    // 分类填充
    queryClassif (tabVal) {
      this.tabClassLoading = true
      setTimeout(() => {
        this.tabClassLoading = false
      }, 300)
      this.initCountry = tabVal
      this.siteValue = tabVal
      this.disabShow = false
      this.assignment(tabVal)
    },
    // 获取
    assignment (tabVal) {
      if (tabVal == 'DE' && this.DEnum !== '1') {
        this.DEnum = '1'
        this.selectListDE = []
        this.getauthCountrys('0')
      } else if (tabVal == 'NL' && this.NLnum !== '1') {
        this.NLnum = '1'
        this.selectListNL = []
        this.getauthCountrys('0')
      } else if (tabVal == 'ES' && this.ESnum !== '1') {
        this.ESnum = '1'
        this.selectListES = []
        this.getauthCountrys('0')
      } else if (tabVal == 'IT' && this.ITnum != '1') {
        this.ITnum = '1'
        this.selectListIT = []
        this.getauthCountrys('0')
      } else if (tabVal == 'US' && this.USnum != '1') {
        this.USnum = '1'
        this.selectListUS = []
        this.getauthCountrys('0')
      } else if (tabVal == 'CA' && this.CAnum != '1') {
        this.CAnum = '1'
        this.selectListCA = []
        this.getauthCountrys('0')
      } else if (tabVal == 'MX' && this.MXnum != '1') {
        this.MXnum = '1'
        this.selectListMX = []
        this.getauthCountrys('0')
      } else if (tabVal == 'AE' && this.AEnum != '1') {
        this.AEnum = '1'
        this.selectListAE = []
        this.getauthCountrys('0')
      } else if (tabVal == 'BR' && this.BRnum != '1') {
        this.BRnum = '1'
        this.selectListBR = []
        this.getauthCountrys('0')
      } else if (tabVal == 'FR' && this.FRnum != '1') {
        this.FRnum = '1'
        this.selectListFR = []
        this.getauthCountrys('0')
      } else if (tabVal == 'GB' && this.GBnum != '1') {
        this.GBnum = '1'
        this.selectListGB = []
        this.getauthCountrys('0')
      } else if (tabVal == 'IN' && this.INnum != '1') {
        this.INnum = '1'
        this.selectListIN = []
        this.getauthCountrys('0')
      } else if (tabVal == 'TR' && this.TRnum != '1') {
        this.TRnum = '1'
        this.selectListTR = []
        this.getauthCountrys('0')
      }
      if (tabVal == 'JP' && this.JPnum != '1') {
        this.JPnum = '1'
        this.selectListJP = []
        this.getauthCountrys('0')
      } else if (tabVal == 'AU' && this.AUnum != '1') {
        this.AUnum = '1'
        this.selectListAU = []
        this.getauthCountrys('0')
      } else if (tabVal == 'PL' && this.PLnum != '1') {
        this.PLnum = '1'
        this.selectListPL = []
        this.getauthCountrys('0')
      }
    },
    // 请求分类信息
    //  llll
    getauthCountrys (val) {
      var _this = this
      authCountry({
        country: _this.siteValue,
        pid: val
      }).then((res) => {
        if (res.code === 0) {
          if (_this.siteValue == 'DE') {
            _this.selectListDE.push(res.data)
          } else if (_this.siteValue == 'NL') {
            _this.selectListNL.push(res.data)
          } else if (_this.siteValue == 'ES') {
            _this.selectListES.push(res.data)
          } else if (_this.siteValue == 'IT') {
            _this.selectListIT.push(res.data)
          } else if (_this.siteValue == 'US') {
            _this.selectListUS.push(res.data)
          } else if (_this.siteValue == 'MX') {
            _this.selectListMX.push(res.data)
          } else if (_this.siteValue == 'AE') {
            _this.selectListAE.push(res.data)
          } else if (_this.siteValue == 'BR') {
            _this.selectListBR.push(res.data)
          } else if (_this.siteValue == 'FR') {
            _this.selectListFR.push(res.data)
          } else if (_this.siteValue == 'GB') {
            _this.selectListGB.push(res.data)
          } else if (_this.siteValue == 'IN') {
            _this.selectListIN.push(res.data)
          } else if (_this.siteValue == 'TR') {
            _this.selectListTR.push(res.data)
          } else if (_this.siteValue == 'CA') {
            _this.selectListCA.push(res.data)
          } else if (_this.siteValue == 'AU') {
            _this.selectListAU.push(res.data)
          } else if (_this.siteValue == 'JP') {
            _this.selectListJP.push(res.data)
          } else if (_this.siteValue == 'PL') {
            _this.selectListPL.push(res.data)
          }
        }
      })
    },
    prodelsManege () {
      //删除
      if (this.delManageAll === false) {
        this.data.forEach((item, index) => {
          if (item.id == this.delidManage) {
            this.data.splice(index, 1)
          }
        })
        deleteGoodList({
          ids: this.delidManage,
          platform: this.platformManege
        }).then((res) => {
          if (res.code === 0) {
            if (Vue.ls.get('PAGE_SIZE_AMAZON')) {
              this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
            } else {
              this.BlackAndWhiteList(10)
            }
          } else {
          }
        })
      } else {
        //批量删除
        if (this.selectManageAll) {
          let str = ''
          for (var i = 0; i < this.selectManageAll.length; i++) {
            str += this.selectManageAll[i].id + ','
          }
          this.idManege = str.slice(0, -1)
          deleteGoodList({
            ids: this.idManege,
            platform: this.platformManege
          }).then((res) => {
            if (res.code === 0) {
              if (Vue.ls.get('PAGE_SIZE_AMAZON')) {
                this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
              } else {
                this.BlackAndWhiteList(10)
              }
            } else {
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      }
    },
    collectdelAll () {
      if (this.selectManageAll.length > 0) {
        this.visibles = true
        this.delManageAll = true
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选删除的选项'
        })
      }
    },
    // 加入待发布
    released (id) {
      this.addId = id
      this.addloading = true
      insertPublish({
        goods_id: id
      })
        .then((res) => {
          this.addloading = false
          if (res.code === 0) {
            this.addloading = false
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
          } else {
            this.addloading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
        .catch((err) => {
          this.addloading = false
        })
    },
    // 批量加入待发布
    toReleasedAll () {
      this.addsloading = true
      if (this.selectManageAll.length > 0) {
        let str = ''
        for (var i = 0; i < this.selectManageAll.length; i++) {
          str += this.selectManageAll[i].id + ','
        }
        this.ReleasedIds = str.slice(0, -1)
        insertPublish({
          goods_id: this.ReleasedIds
        }).then((res) => {
          if (res.code === 0) {
            this.addsloading = false
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.selectedRowKeys = []
            this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
          } else {
            this.addsloading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        this.addsloading = false
        this.$notification.error({
          message: '错误',
          description: '请先勾选待发布的选项'
        })
      }
    },
    //批量导出
    exportListAll () {
      this.showWarning = false
      if (this.selectManageAll.length > 0) {
        this.Noexport = []
        this.selectManageAll.forEach((item, index) => {
          if (item.status === '0') {
            this.Noexport.push(item.id)
          }
        })
        this.Noexports = this.Noexport.join('  ')
        this.modals = true
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选导出的选项'
        })
      }
    },
    //导出请求
    exportpost () {
      const token = Vue.ls.get(ACCESS_TOKEN)
      if (this.selectManageAll) {
        let str = ''
        for (var i = 0; i < this.selectManageAll.length; i++) {
          str += this.selectManageAll[i].id + '-'
        }
        this.idManege = str.slice(0, -1)
      }
      exportList({
        country: this.EXcountryValue,
        ids: this.idManege,
        titlePrefix: this.prefix,
        brandName: this.brand
      }).then((res) => {
        if (res.code === 0) {
          // 商品导出
          let url = this.GLOBAL.BASE_URL.substr(0, this.GLOBAL.BASE_URL - 1)
          res.data.fileArr.forEach((item, index) => {
            window.open(url + item, '_blank')
          })
          this.selectedRowKeys = []
          this.EXcountryValue = false
          this.allCountrysState = false
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
        } else {
          this.selectedRowKeys = []
          this.EXcountryValue = false
          this.allCountrysState = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },

    shopSearch () {
      this.blackSwitch = false
      let pagesize = Vue.ls.get('PAGE_SIZE_AMAZON') ? Vue.ls.get('PAGE_SIZE_AMAZON') : 10
      let countryManage = this.countryManage !== 'all' ? this.countryManage : ''
      if (this.searchName) {
        this.shopSearchInfo = {
          page: this.currentManege,
          page_size: pagesize,
          country: countryManage,
          keywords: this.searchName,
          start_time: this.startValue ? moment(this.startValue).format('YYYY-MM-DD') : '',
          end_time: this.endValue ? moment(this.endValue).format('YYYY-MM-DD') : ''
        }
      } else {
        this.shopSearchInfo = {
          page: this.currentManege,
          page_size: pagesize,
          country: countryManage,
          start_time: this.startValue ? moment(this.startValue).format('YYYY-MM-DD') : '',
          end_time: this.endValue ? moment(this.endValue).format('YYYY-MM-DD') : ''
        }
      }
      getCollectList(this.shopSearchInfo).then((res) => {
        if (res.code === 0) {
          this.listLoading = false
          if (res.data.data.length > 0) {
            this.data = res.data.data
            this.currentManege = parseInt(res.pages.currentPage)
            this.pageManage = res.pages
            this.siteManage = res.data.data.platform
            this.black_count = res.data.black_count
          } else {
            this.data = []
            this.black_count = res.data.black_count
          }
        } else {
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    clearSearch () {
      this.searchName = ''
      this.startValue = null
      this.endValue = null
    },
    Recharge () {
      this.$router.push({
        path: '/rechange/fund'
      })
    },
    countrychange (value) {
      this.countryManage = value
    },
    classChange (value, index, category) {
      if (category == 'DE') {
        this.classValueDE = value
        this.selectValueDE[index + 1] = '' //防止id显示叠加
        this.selectListDE.splice(index + 1, this.selectListDE.length) //选中父级清空子级
        this.selectListDE[this.selectListDE.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueDE) {
            this.classNode.DE = im.node_id
          }
        })
        // 联级显示菜单
        this.selectListDE[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'DE').then((v) => {
                this.selectListDE.push(v)
              })
            }
          }
        })
      } else if (category == 'NL') {
        this.classValueNL = value
        this.selectValueNL[index + 1] = '' //防止id显示叠加
        this.selectListNL.splice(index + 1, this.selectListNL.length) //选中父级清空子级
        this.selectListNL[this.selectListNL.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueNL) {
            this.classNode.NL = im.node_id
          }
        })
        // 联级显示菜单
        this.selectListNL[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'NL').then((v) => {
                this.selectListNL.push(v)
              })
            }
          }
        })
      } else if (category == 'SE') {
        this.classValueSE = value
        this.selectValueSE[index + 1] = '' //防止id显示叠加
        this.selectListSE.splice(index + 1, this.selectListSE.length) //选中父级清空子级
        this.selectListSE[this.selectListSE.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueSE) {
            this.classNode.SE = im.node_id
          }
        })
        // 联级显示菜单
        this.selectListSE[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'SE').then((v) => {
                this.selectListSE.push(v)
              })
            }
          }
        })
      } else if (category == 'FR') {
        this.classValueFR = value
        this.selectListFR[this.selectListFR.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueFR) {
            this.classNode.FR = im.node_id
          }
        })
        this.selectValueFR[index + 1] = '' //防止id显示叠加
        this.selectListFR.splice(index + 1, this.selectListFR.length) //选中父级清空子级
        this.selectListFR[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'FR').then((v) => {
                this.selectListFR.push(v)
              })
            }
          }
        })
      } else if (category == 'GB') {
        this.classValueGB = value
        this.selectListGB[this.selectListGB.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueGB) {
            this.classNode.GB = im.node_id
          }
        })
        this.selectValueGB[index + 1] = '' //防止id显示叠加
        this.selectListGB.splice(index + 1, this.selectListGB.length) //选中父级清空子级
        this.selectListGB[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'GB').then((v) => {
                this.selectListGB.push(v)
              })
            }
          }
        })
      } else if (category == 'IT') {
        this.classValueIT = value
        this.selectListIT[this.selectListIT.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueIT) {
            this.classNode.IT = im.node_id
          }
        })
        this.selectValueIT[index + 1] = '' //防止id显示叠加
        this.selectListIT.splice(index + 1, this.selectListIT.length) //选中父级清空子级
        this.selectListIT[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'IT').then((v) => {
                this.selectListIT.push(v)
              })
            }
          }
        })
      } else if (category == 'ES') {
        this.classValueES = value
        this.selectListES[this.selectListES.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueES) {
            this.classNode.ES = im.node_id
          }
        })
        this.selectValueES[index + 1] = '' //防止id显示叠加
        this.selectListES.splice(index + 1, this.selectListES.length) //选中父级清空子级
        this.selectListES[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'ES').then((v) => {
                this.selectListES.push(v)
              })
            }
          }
        })
      } else if (category == 'US') {
        this.classValueUS = value
        this.selectListUS[this.selectListUS.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueUS) {
            this.classNode.US = im.node_id
          }
        })
        this.selectValueUS[index + 1] = '' //防止id显示叠加
        this.selectListUS.splice(index + 1, this.selectListUS.length) //选中父级清空子级
        this.selectListUS[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'US').then((v) => {
                this.selectListUS.push(v)
              })
            }
          }
        })
      } else if (category == 'CA') {
        this.classValueCA = value
        this.selectListCA[this.selectListCA.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueCA) {
            this.classNode.CA = im.node_id
          }
        })
        this.selectValueCA[index + 1] = '' //防止id显示叠加
        this.selectListCA.splice(index + 1, this.selectListCA.length) //选中父级清空子级
        this.selectListCA[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'CA').then((v) => {
                this.selectListCA.push(v)
              })
            }
          }
        })
      } else if (category == 'MX') {
        this.classValueMX = value
        this.selectListMX[this.selectListMX.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueMX) {
            this.classNode.MX = im.node_id
          }
        })
        this.selectValueMX[index + 1] = '' //防止id显示叠加
        this.selectListMX.splice(index + 1, this.selectListMX.length) //选中父级清空子级
        this.selectListMX[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'MX').then((v) => {
                this.selectListMX.push(v)
              })
            }
          }
        })
      } else if (category == 'BR') {
        this.classValueBR = value
        this.selectListBR[this.selectListBR.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueBR) {
            this.classNode.BR = im.node_id
          }
        })
        this.selectValueBR[index + 1] = '' //防止id显示叠加
        this.selectListBR.splice(index + 1, this.selectListBR.length) //选中父级清空子级
        this.selectListBR[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'BR').then((v) => {
                this.selectListBR.push(v)
              })
            }
          }
        })
      } else if (category == 'IN') {
        this.classValueIN = value
        this.selectListIN[this.selectListIN.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueIN) {
            this.classNode.IN = im.node_id
          }
        })
        this.selectValueIN[index + 1] = '' //防止id显示叠加
        this.selectListIN.splice(index + 1, this.selectListIN.length) //选中父级清空子级
        this.selectListIN[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'IN').then((v) => {
                this.selectListIN.push(v)
              })
            }
          }
        })
      } else if (category == 'TR') {
        this.classValueTR = value
        this.selectListTR[this.selectListTR.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueTR) {
            this.classNode.TR = im.node_id
          }
        })
        this.selectValueTR[index + 1] = '' //防止id显示叠加
        this.selectListTR.splice(index + 1, this.selectListTR.length) //选中父级清空子级
        this.selectListTR[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'TR').then((v) => {
                this.selectListTR.push(v)
              })
            }
          }
        })
      } else if (category == 'AE') {
        this.classValueAE = value
        this.selectListAE[this.selectListAE.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueAE) {
            this.classNode.AE = im.node_id
          }
        })
        this.selectValueAE[index + 1] = '' //防止id显示叠加
        this.selectListAE.splice(index + 1, this.selectListAE.length) //选中父级清空子级
        this.selectListAE[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'AE').then((v) => {
                this.selectListAE.push(v)
              })
            }
          }
        })
      } else if (category == 'AU') {
        this.classValueAU = value
        this.selectListAU[this.selectListAU.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueAU) {
            this.classNode.AU = im.node_id
          }
        })
        this.selectValueAU[index + 1] = '' //防止id显示叠加
        this.selectListAU.splice(index + 1, this.selectListAU.length) //选中父级清空子级
        this.selectListAU[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'AU').then((v) => {
                this.selectListAU.push(v)
              })
            }
          }
        })
      } else if (category == 'JP') {
        this.classValueJP = value
        this.selectListJP[this.selectListJP.length - 1].forEach((im, ix) => {
          if (im.id === this.classValueJP) {
            this.classNode.JP = im.node_id
          }
        })
        this.selectValueJP[index + 1] = '' //防止id显示叠加
        this.selectListJP.splice(index + 1, this.selectListJP.length) //选中父级清空子级
        this.selectListJP[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'JP').then((v) => {
                this.selectListJP.push(v)
              })
            }
          }
        })
      } else if (category == 'PL') {
        this.classValuePL = value
        this.selectListPL[this.selectListPL.length - 1].forEach((im, ix) => {
          if (im.id === this.classValuePL) {
            this.classNode.PL = im.node_id
          }
        })
        this.selectValuePL[index + 1] = '' //防止id显示叠加
        this.selectListPL.splice(index + 1, this.selectListPL.length) //选中父级清空子级
        this.selectListPL[index].forEach((item, inx) => {
          if (value === item.id) {
            if (item.is_menu === '1') {
              this.getauthCountry(value, 'PL').then((v) => {
                this.selectListPL.push(v)
              })
            }
          }
        })
      }
    },
    handleOk (e) {
      this.prodelsManege()
      this.ManageLoading = true
      setTimeout(() => {
        this.visibles = false
        this.ManageLoading = false
        this.ModalTextManage = '确定要删除吗'
      }, 1000)
    },
    handleCanceldel (e) {
      this.visibles = false
    },
    //导出确认
    exportOk () {
      this.modalsLoading = true
      this.exportpost()
      setTimeout(() => {
        this.modals = false
        this.modalsLoading = false
      }, 1000)
      this.initialArr = []
      this.selectedRowKeys = []
      this.EXcountryValue = false
      this.allCountrysState = false
    },
    originExport () {
      this.exportLoading = true
      let ids = this.selectkey.join(',')
      exportOri({
        ids: ids
      }).then((res) => {
        if (res.code === 0) {
          res.data.fileArr.forEach((item, index) => {
            window.open(this.GLOBAL.BASE_URL + item, '_blank')
          })
          this.selectedRowKeys = []
          this.EXcountryValue = false
          this.allCountrysState = false
          this.modals = false
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.exportLoading = false
        } else {
          this.exportLoading = false
        }
      })
    },
    handleCancel (e) {
      this.modals = false
      this.initialArr = []
      this.selectedRowKeys = []
      this.selectManageAll = []
      this.EXcountryValue = false
      this.allCountrysState = false
    },
    //字数限制
    wordCountLimit (type, str) {
      let _this = this
      let full_Value = str.target.value
      if (type == 2) {
        //关键字
        if (full_Value.length > 0 && full_Value.length <= 250) {
          _this.keywordsCount = 250 - full_Value.length
          _this.keywordsText = '还可输入' + _this.keywordsCount + '字'
          _this.isKeyBeyond = false
        } else if (full_Value.length > 250) {
          _this.isKeyBeyond = true
          _this.keywordsCount = full_Value.length - 250
          _this.keywordsText = '已超过' + _this.keywordsCount + '字'
        } else {
          _this.keywordsText = '还可输入250字'
          _this.isKeyBeyond = false
        }
      } else {
        //五点描述
        let bulletREG = /\n/g
        this.rowCount = full_Value.split(bulletREG).filter((d) => d).length
        if (full_Value.length > 0 && full_Value.length <= 2500) {
          _this.initialAllCount = 2500 - full_Value.length
          _this.initialAllText = '还可输入' + _this.initialAllCount + '字'
          _this.isInitialAllBeyond = false
        } else if (full_Value.length > 2500) {
          _this.isInitialAllBeyond = true
          _this.initialAllCount = full_Value.length - 2500
          _this.initialAllText = '已超过' + _this.initialAllCount + '字'
        } else {
          _this.initialAllText = '还可输入2500字'
          _this.isInitialAllBeyond = false
        }

        //单条超出判断
        let arr = full_Value.split(/\n/g)
        arr.forEach((item, index) => {
          if (item.length > 500) {
            _this.isInitialAllBeyond = true
            _this.initialAllText = '检测到”' + item.substring(0, 4) + '...“描述超出字符限制'
          }
        })
      }
    },
    //点击 确认翻译接口
    handleOkTrans () {
      const hide = this.$message.loading('扣费中', 0)
      this.transPayVisibles = false
      this.toNewTrans(hide)
    },
    handleCancelTrans () {
      this.transPayVisibles = false
      this.editLoading = false
      this.tranLoading = false
    },
    //黑名单
    toBlack () {
      this.blackSwitch = !this.blackSwitch
      Vue.ls.set('black', this.blackSwitch)
      this.currentManege = 1
      if (this.blackSwitch) {
        let dataInfo = {
          page: this.currentManege,
          page_size: 10,
          is_black: 1
        }
        this.getCollectListFn(dataInfo)
      } else {
        this.selectedRowKeys = []
        this.selectManageAll = ''
        if (Vue.ls.get('PAGE_SIZE_AMAZON')) {
          this.currentManege = Vue.ls.get('currentManege_amazon')
          this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE_AMAZON'))
        } else {
          this.BlackAndWhiteList(10)
        }
      }
    },
    getCollectListFn (dataInfo) {
      getCollectList(dataInfo).then((res) => {
        if (res.code === 0) {
          if (res.data.data.length > 0) {
            this.data = res.data.data
            this.pageManage = res.pages
            this.siteManage = res.data.data.platform
            this.black_count = res.data.black_count
          } else {
            this.data = []
            this.black_count = res.data.black_count
          }
        } else {
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    // 自定义分类相关代码
    // 获取自定义分类列表
    getPersonalCategoryFn () {
      getPersonalCategory().then((res) => {
        if (res.code === 0) {
          this.personalList = res.data
        }
      })
    },
    PersonalHandleChange (value) {
      this.getAmazonCategoryFn(value)
      this.$store.commit('set_classLoading', true)
    },
    getAmazonCategoryFn (val) {
      getAmazonCategory({
        id: val
      }).then((res) => {
        if (res.code === 0) {
          this.classProcessorFn(res.data)
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    classProcessorFn (data) {
      if (JSON.stringify(data) === '{}') {
        let reverseArr = [
          { country: 'DE', category: '0' },
          { country: 'NL', category: '0' },
          { country: 'SE', category: '0' },
          { country: 'US', category: '0' },
          { country: 'CA', category: '0' },
          { country: 'MX', category: '0' },
          { country: 'ES', category: '0' },
          { country: 'IT', category: '0' },
          { country: 'FR', category: '0' },
          { country: 'GB', category: '0' },
          { country: 'AU', category: '0' },
          { country: 'JP', category: '0' },
          { country: 'PL', category: '0' }
        ]
        this.reverseCheck(reverseArr, '0')
      } else {
        let reverseArr = []
        this.siteArrValue = []
        this.checkedList1 = []
        this.checkedList2 = []
        this.checkedList3 = ['', '']
        this.searchStatus = {
          DE: false,
          NL: false,
          SE: false,
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
          JP: false,
          PL: false
        }
        Object.keys(data).forEach((item, index, value) => {
          let reverseObj = {
            country: '',
            category: '',
            cid: ''
          }
          reverseObj.country = item
          reverseObj.category = data[item].node_id
          reverseObj.cid = toString(data[item].cid)
          reverseArr.push(reverseObj)
        })
        this.reverseCheck(reverseArr, '1')
      }
    },
    reverseCheck (reverseArr, state) {
      let _this = this
      if (state === '0') {
        _this.selectDefaultData = {
          DE: [],
          NL: [],
          ES: [],
          SE: [],
          IT: [],
          US: [],
          CA: [],
          MX: [],
          AE: [],
          BR: [],
          FR: [],
          GB: [],
          IN: [],
          TR: [],
          AU: [],
          JP: [],
          PL: []
        }
        _this.selectedOptions = {
          DE: [],
          NL: [],
          SE: [],
          ES: [],
          IT: [],
          US: [],
          CA: [],
          MX: [],
          AE: [],
          BR: [],
          FR: [],
          GB: [],
          IN: [],
          TR: [],
          AU: [],
          JP: [],
          PL: []
        }
        this.$notification.warning({
          message: '提醒',
          description: '自定义分类没有设置值'
        })
        this.$store.commit('set_classLoading', false)
      } else if (state === '1') {
        if (reverseArr.length) {
          reverseArr.forEach(function (item) {
            switch (item.country) {
              case 'DE':
                _this.checkedList2.push('德国')
                _this.countryAll.push('德国')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('德国')
                  }
                })
                break
              case 'NL':
                _this.checkedList2.push('荷兰')
                _this.countryAll.push('荷兰')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('荷兰')
                  }
                })
                break
              case 'SE':
                _this.checkedList2.push('瑞典')
                _this.countryAll.push('瑞典')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('瑞典')
                  }
                })
                break
              case 'ES':
                _this.checkedList2.push('西班牙')
                _this.countryAll.push('西班牙')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('西班牙')
                  }
                })
                break
              case 'IT':
                _this.checkedList2.push('意大利')
                _this.countryAll.push('意大利')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('意大利')
                  }
                })
                break
              case 'US':
                _this.checkedList1.push('美国')
                _this.countryAll.push('美国')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('美国')
                  }
                })
                break
              case 'MX':
                _this.checkedList1.push('墨西哥')
                _this.countryAll.push('墨西哥')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('墨西哥')
                  }
                })
                break
              case 'AE':
                _this.checkedList1.push('阿拉伯联合酋长国')
                _this.countryAll.push('阿拉伯联合酋长国')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('阿拉伯联合酋长国')
                  }
                })
                break
              case 'BR':
                _this.checkedList1.push('巴西')
                _this.countryAll.push('巴西')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('巴西')
                  }
                })
                break
              case 'FR':
                _this.checkedList2.push('法国')
                _this.countryAll.push('法国')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('法国')
                  }
                })
                break
              case 'GB':
                _this.checkedList2.push('英国')
                _this.countryAll.push('英国')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('英国')
                  }
                })
                break
              case 'IN':
                _this.checkedList1.push('印度')
                _this.countryAll.push('印度')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('印度')
                  }
                })
                break
              case 'TR':
                _this.checkedList1.push('土耳其')
                _this.countryAll.push('土耳其')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('土耳其')
                  }
                })
                break
              case 'CA':
                _this.checkedList1.push('加拿大')
                _this.countryAll.push('加拿大')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('加拿大')
                  }
                })
                break
              case 'AU':
                _this.checkedList3.push('澳大利亚')
                _this.countryAll.push('澳大利亚')
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('澳大利亚')
                  }
                })
                break
              case 'JP':
                _this.checkedList3.push('日本')
                _this.countryAll.push('日本')
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('日本')
                  }
                })
                break
              case 'PL':
                _this.checkedList3.push('波兰')
                _this.countryAll.push('波兰')
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('波兰')
                  }
                })
                break
            }
          })
        }
      }
    },
    //反向获取分类id   不存在cid
    getmwsReverse (code, node_id, cid) {
      return mwsReverse({
        country: code,
        node_id: node_id,
        cid: cid
      }).then((res) => {
        if (res.code === 0) {
          this.selectedOptions[code] = []
          res.data.title.forEach((item, index) => {
            this.selectedOptions[code].push({
              tabValue: item
            })
          })
          return res.data
        }
      })
    }
  },
  filters: {
    priceTlt (val) {
      return '￥' + val
    }
  }
}
</script>
<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}

.list-articles-trigger {
  margin-left: 12px;
}

.mlspace {
  margin-left: 10px;
}

.ml {
  margin-left: 10px;
}

.mt {
  margin-top: 20px;
}

.mt-sm {
  margin-top: 10px;
}

.mb {
  margin-bottom: 20px;
}

.txt-color {
  color: #1890ff;
}

.mt-xl {
  margin-top: 40px;
}

.ant-tabs-bar {
  margin: none !important;
}

.font-sizes {
  font-size: 10px;
}

.mb-l {
  margin-bottom: 30px;
}

.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}

.list-articles-trigger {
  margin-left: 12px;
}

.danger-color {
  color: #f5222d;
}

// .black-box{
//   width: 16px;
//   height: 16px;
//   img{
//     width: 100%;
//   }
// }
</style>
<style lang="less" scoped>
.mr-sm {
  margin-right: 10px;
}

.mb-sm {
  margin-bottom: 5px;
}

.mr {
  margin-right: 20px;
}

// .rt{
//   float:right;
// }
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.15) !important;
}

.word-wrap {
  word-break: break-all;
}

#id {
  padding-left: 20px;
}

.spin-box {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  margin: 0;
  text-align: center;
  min-width: 90%;
  min-height: 90%;
  background: rgba(51, 51, 51, 0.05);
  z-index: 100;

  .spin {
    margin-top: 240px;
  }
}
</style>
<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.15) !important;
}

.tar {
  text-align: right;
}

/* .intcardtab > .ant-tabs-bar{
  background: #fff;
} */

.beyondClass {
  color: red;
}

.limitTip {
  margin-left: 10px;
}

.modal_check_xu .ant-checkbox-group .ant-checkbox-group-item {
  width: 100%;
}

.search_card {
  position: absolute;
  top: 32px;
  left: 0;
  z-index: 10;
  padding: 5px;
  box-sizing: border-box;
  overflow: auto;
  width: 400px;
  height: 200px;
  background-color: #fff;
  border-top: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
}

.search_li div span:last-child {
  color: red;
}

.category_li {
  color: #dddddd;
}

.category_li span:last-child i {
  display: none;
}

.search_li div span:last-child i {
  display: none;
}

.search_li {
  cursor: pointer;
}

.cursors {
  cursor: pointer;
}

.search_li:hover {
  background-color: #dddddd;
}

.editAll .ant-row {
  margin-bottom: 0 !important;
}

.flex-min-max {
  min-width: 100px;
  max-width: 350px;
}

.btn-bgcolor {
  color: #fff;
  background: #cdcdcd;
}

.btn-bgcolor:hover,
.btn-bgcolor:focus {
  color: #fff;
  background: #cdcdcd;
  border-color: #fff;
}

.btn-bgcolorTab {
  color: #fff;
  background: #707070;
}

.btn-bgcolorTab:hover,
.btn-bgcolorTab:focus {
  color: #fff;
  background: #707070;
  border-color: #fff;
}

.black-box {
  max-width: 22px;
  max-height: 22px;
}

.black-box-img {
  width: 100%;
}

.flex-box {
  /* display: flex; */
  /* justify-content: start; */
}

.overhidden {
  overflow: hidden;
}
</style>
