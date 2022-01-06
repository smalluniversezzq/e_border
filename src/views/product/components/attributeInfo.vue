<template>
  <div>
    <a-row>
      <a-col :md="4" :lg="3" :xl="3" :xxl="2">
        <a-button type="primary" @click="editTypeHandle()">编辑多属性</a-button>
      </a-col>
      <a-col>
        <a-select defaultValue="计划售价" @change="handleChangeSelect" style="width:180px">
          <a-select-option v-model="item.id" v-for='(item,index) in storeSelect' :key='index'>{{item.title}}</a-select-option>
        </a-select>
        <div v-show="selectedID === 1" style="display: inline-block; margin-left:10px">
          <a-select
            allowClear
            v-show="selectedID === 1"
            mode="tags"
            maxTagCount = 1
            style="width:180px"
            @change="handleChangeCountry"
            placeholder='请选择国家'
            v-model='countryMulitple'
          >
            <a-select-option  value="all">全部</a-select-option>
            <a-select-option v-if='selectedCountryAll === false' v-model="item.title" v-for='(item,index) in countrySelect' :key='index'>{{item.value}}</a-select-option>
          </a-select>

          <a-select placeholder='请选择模式' @change="handleChangeMode" style="width:180px">
            <a-select-option v-model="item.title" v-for='(item,index) in modeSelect' :key='index'>{{item.value}}</a-select-option>
          </a-select>

          <a-input v-model="costValue" :placeholder="costValueText" style="width:180px" type="number" :min="0" />
          <a-input  v-model="percentageValue" placeholder="运费" style="width:180px" type="number" :min="0" />
        </div>

        <div v-show="selectedID === 2" style="display: inline-block;margin-left:10px">
          <a-input v-model="costPriceValue" placeholder="成本价(人民币)" style="width:180px" type="number" :min="0" />
        </div>

        <div v-show="selectedID === 3" style="display: inline-block;margin-left:10px">
          <a-input v-model="weightValue" placeholder="重量(g)" style="width:180px" type="number" :min="0" />
        </div>

        <div v-show="selectedID === 4" style="display: inline-block;margin-left:10px">
          <a-input v-model="numValue" placeholder="数量" style="width:180px" type="number" :min="0" />
        </div>

        <div v-show="selectedID === 5" style="display: inline-block;margin-left:10px">
          <a-input v-model="longValue" placeholder="长(cm)" style="width:180px" type="number" :min="0" />
          <a-input v-model="widthValue" placeholder="宽(cm)" style="width:180px" type="number" :min="0" />
          <a-input v-model="heightValue" placeholder="高(cm)" style="width:180px" type="number" :min="0" />
        </div>

        <div v-show="selectedID === 6" style="display: inline-block;margin-left:10px">
          <a-radio-group @change="onChangeCheckbox" v-model="battery_status">
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
        </div>
        <a-button type="primary" :loading='AttributeLoding' style="margin-left:10px" @click="confirm()">确认</a-button>
        <a-button type="danger" style="margin-left:10px" @click="batchDelet()">批量删除</a-button>
      </a-col>
    </a-row>
    <a-row class='mt'>
      <a-col>
        <a-button type="primary" @click="AddPictures()">批量添加变体图片</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-table
        :columns="columns"
        style="margin-top: 30px"
        :scroll="{ x: columnWidth, y: 800 }"
        :pagination="false"
        :dataSource="dataList"
        :loading = "dataListLoading"
        :rowSelection="rowSelection"
        rowKey="sid"
        bordered>

        <span slot="price2">
          计划售价
          <a-tooltip placement="right">
            <template slot="title">
              <p>利润率计算规则为：售价=（成本+运费）/（0.85-利润率,计算结果自动换算为当地货币</p>
              <p>加价倍计算规则为：售价=（成本价*加价倍+运费）/ 0.85,计算结果自动换算为当地货币</p>
              <p>利润值计算规则为：售价=（成本价+利润值+运费）/ 0.85,计算结果自动换算为当地货币</p>
              <p>自定义售价无需任何公式直接输入当地货币</p>
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>
        <span slot="profit">
          利润
          <a-tooltip placement="right">
            <template slot="title">
              利润的计算公式为：利润=售价*0.85-运费-成本
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>
        <span slot="sku">
          SKU
          <a-input  v-model="prefixValue" placeholder="设置SKU前缀" @blur="prefixChange" style="width:110px;margin-left:9px" type="text" />
          <a-button type="link" @click="resetSku()">一键生成</a-button>
        </span>
        <span slot="ean">
          <span @click='tabType()' style="cursor: pointer" >{{tabENA?"EAN(收费)":"EAN(免费)"}}</span>
          <a-button @click="tabType()">{{tabENA?"切换为免费":"切换为收费"}}</a-button>
          <a-button type="link" @click="resetEanAll(record)">一键更换</a-button>
        </span>

        <template slot="serialNumber" slot-scope="text, record">
          <span>{{record.serialNumber}}</span>
        </template>
        <template slot="image" slot-scope="text, record" style="display:flex; flex:wrap;">
          <div class='dis-flex flex-wrap'>
            <div style="width:100px; height:110px; overflow:hidden; display:block;line-height:110px;">
              <a-popover placement="rightTop" v-if='record.image[0]'>
                <template
                  slot="content"
                  style="width:200px">
                  <img style='width:250px;' :src="record.image[0]" alt="">
                </template>
                <a-button class='btn-pic' style="width:100px;position:relative;overflow:hidden;height:100px">
                  <img
                    v-if='record.image[0]'
                    style="width:100px; margin-left:-16px;margin-top:-2px"
                    :src="record.image[0]"
                    alt="暂无图片信息"/>
                </a-button>
              </a-popover>
              <a-button v-if='!record.image[0]' class='btn-pic' style="width:100px;position:relative;overflow:hidden;height:100px">
                <a-tooltip >
                  <template slot="title">
                    <span>由于网络原因，请重新上传！</span>
                  </template>
                  <img
                    style="width:100px; margin-left:-16px;margin-top:-2px"
                    :src="picAltError"
                    alt="暂无图片信息"/>
                </a-tooltip >
              </a-button>
            </div>
            <div class='dis-box' @click="uploadPicHandle(record)">
              <a-icon  class='ioc' type="edit"  style="margin-left:5px;color:#fff;cursor:pointer;"/>
            </div>
          </div>
        </template>
        <template slot="color" slot-scope="text, record">
          <template v-for="(item, index) in dataLL" v-if="item.name === 'color'">
            <template>
              <div v-for="(its, ids) in record.variant" :key="ids+1">
                <!-- <span v-if="its['zh'].name === item.name">{{its['zh'].value}}</span> -->
                <div
                  v-if="its[languages].name === item.name"
                  v-for='(languages,inx) in languageArr'
                  :key='inx' >
                  {{languageArrOrcountry[languages]}}:{{its[languages].value}}
                </div>
              </div>
            </template>
          </template>
        </template>
        <template slot="size" slot-scope="text, record">
          <!-- {{dataLL}} -->
          <template v-for="(item, index) in dataLL" v-if="item.name === 'size'" >
            <!-- {{record.variant}} -->
            <template>
              <div v-for="(its, ids) in record.variant"  :key ='ids'>
                <!-- {{its['zh'].name === item.name}}{{its['zh'].name+'判断'+item.name}} -->
                <div
                  v-if="its[languages].name === item.name"
                  v-for='(languages,inx) in languageArr'
                  :key='inx' >
                  {{languageArrOrcountry[languages]}}:{{its[languages].value}}
                </div>
              </div>
            </template>
          </template>
        </template>

        <template slot="price1" slot-scope="text, record">
          <a-input v-model="record.price.CN" type="number"/>
        </template>
        <template slot="price2" slot-scope="text, record">
          <!-- {{record.price}} -->
          <div v-for="(item, index) in record.price" :key='index'>
            <div v-for="(a, b) in countrySelect" :key='b'>
              <span v-if="index === 'DE' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'NL' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'SE' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'FR' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'GB' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'ES' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'IT' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'US' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'CA' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'MX' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'AU' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'JP' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
              <span v-if="index === 'PL' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥ <span><a-icon type="delete"  @click='delPrice(item,index,record)'/></span></span>
            </div>
          </div>
        </template>
        <template slot="profit" slot-scope="text, record">
          <!-- {{record.profit}} -->
          <div v-for="(item, index) in record.profit" :key='index'>
            <div v-for="(a, b) in countrySelect" :key='b'>
              <span v-if="index === 'DE' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'NL' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'SE' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'FR' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'GB' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'ES' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'IT' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'US' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'CA' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'MX' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'AU' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'JP' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              <span v-if="index === 'PL' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
            </div>
          </div>
        </template>
        <template slot="freight" slot-scope="text, record">
          {{record.freight}}<span v-if="record.freight">￥</span>
        </template>
        <template slot="quantity" slot-scope="text, record">
          <a-input v-model="record.quantity" type="number"/>
        </template>
        <template slot="sku" slot-scope="text, record">
          <a-input v-model="record.sku" style="width:173px" :disabled="true"/>
          <!-- <a-button @click="resetSku()">更换</a-button> -->
        </template>
        <template slot="ean" slot-scope="text, record">
          <a-input v-model="record.ean" style="width:173px" />
          <a-button @click="resetEan(record)">更换</a-button>
        </template>
        <template slot="weight" slot-scope="text, record">
          <a-input v-model="record.weight.weight" type="number"/>
        </template>
        <template slot="weights" slot-scope="text, record">
          长:<a-input v-model="record.weight.length" type="number" :min="0" style="width:70px" />
          宽:<a-input v-model="record.weight.width" type="number" :min="0" style="width:70px" />
          高:<a-input v-model="record.weight.height" type="number" :min="0" style="width:70px" />
        </template>
        <template slot="battery_status" slot-scope="text, record">
          <a-radio-group v-model="record.battery_status">
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-row>
              <a-col>
                <a-button type="danger" style="margin-left:10px" @click="deleteRow(record.sid)">删除</a-button>
              </a-col>
            </a-row>
          </div>
        </template>
      </a-table>
    </a-row>
    <a-modal v-model="previewVisible" :footer="null"  zIndex='1100'>
      <div style="padding-top:50px">
        <a-card>
          <img id='imgbox'  style="width:100%" :src="zoom_url">
        </a-card>
        <!-- <a-row v-if='nWidth' :span='4' offset="3"> -->
        <a-row class='mt'>
          <a-col v-if='nWidth' :span='4' offset="3">
            <span>{{nWidth}} X {{nHeight}}</span>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <a-modal
      title="编辑变体图库"
      :maskClosable='false'
      :visible="visiblePic"
      @ok="handleOkPic"
      :confirmLoading="confirmLoadingPic"
      @cancel="handleCancelPic"
      width='1100px'
      style='min-height:550px'>
      <template>
        <a-alert
          message="如图片在线美图打不开，请一键拉伸后再次进行操作"
          banner
          closable/>
        <a-row class='mt'>
          <a-col span='12'>
            <a-card
              :style="{ display: 'inline-block', width: 'calc(99%)'}"
              title="变体图库">
              <div class="clearfix">
                <draggable
                  v-model="fileList"
                  :options="{ animation:200 }"
                  style="display: flex; flex-wrap: wrap; ">
                  <div class="image-box mr-sm" v-for="(item,index) in fileList" :key="index">
                    <div class='btn-pic-box' style="width:100%;height:100%;position:relative;overflow:hidden;padding:8px;box-sizing:border-box;">
                      <img
                        v-if='item.url'
                        style="width:100%;height:100%;display:block"
                        :src="item.url"
                        :onerror="defaultImg"
                        alt="暂无图片信息"/>
                      <img
                        v-else
                        :src="picAlt"
                        alt="暂无图片信息"/>
                      <div class="mask-layer"></div>
                      <a-icon type="delete"  class='icon-close' @click="closeImage(item,index)"   />
                      <a-icon type="eye" class="icon-zoom" @click="zoomPic(item.url,item)"/>
                      <!-- <a-icon type="scissor" class="icon-scissor" @click="editeImg(item.url, item)"/> -->
                      <!-- <a-icon type="swap" class="icon-swap" @click="translationImg(item.url, item)"/> -->
                      <!-- <a-icon v-if="item.imgSetStatus" type="rollback" class="icon-back" @click="revokeImg(item.url, item)"/> -->
                    </div>
                  </div>
                </draggable>
              </div>
            </a-card>
          </a-col>
          <a-col  span='12' >
            <a-card
              :style="{ display: 'inline-block', width: 'calc(99%)'}"
              title='商品图库'>
              <attrbuteImg v-if='visiblePic' :allImg='true' ref='attrbuteImgs' @addVariant='addFileList'
                           @getFileList="updateLeftImage" @getDeletePic="setDeletePic"/>
            </a-card>
          </a-col>
        </a-row>
      </template>
      <div>
        <a-button style="margin-top:10px;width:110px;" @click="Reselect()">重新选择</a-button>
      </div>
    </a-modal>
    <!-- 共有图库 -->
    <a-modal
      title="批量添加图片"
      :maskClosable='false'
      :visible="AddPicturesVisible"
      @ok="handleOkSharePic"
      :confirmLoading="confirmLoadingPic"
      @cancel="AddPicturesCancel"
      width='1100px'
      style='min-height:550px'>
      <template>
        <a-row class='mt'>
          <a-col span='12'>
            <a-card
              :style="{ display: 'inline-block', width: 'calc(99%)'}"
              title="共有图库"
            >
              <div class="clearfix">
                <draggable
                  v-model="publicPic"
                  :options="{ animation:200 }"
                  style="display: flex; flex-wrap: wrap; ">
                  <div class="image-box mr-sm" v-for="(item,index) in publicPic" :key="index">
                    <div class='btn-pic-box' style="width:100%;height:100%;position:relative;overflow:hidden;padding:8px;box-sizing:border-box;">
                      <img
                        v-if='item.url'
                        style="width:100%;height:100%;display:block"
                        :src="item.url"
                        alt="暂无图片信息"/>
                      <img
                        v-else
                        style="width:100%;height:100%;display:block"
                        :src="picAlt"
                        alt="暂无图片信息"/>
                      <div class="mask-layer"></div>
                      <a-icon type="delete"  class='icon-close' @click="closeShareImage(item,index)"   />
                      <a-icon type="eye" class="icon-zoom" @click="zoomPic(item.url,item)"/>
                      <!-- <a-icon type="scissor" class="icon-scissor" @click="editeImg(item.url, item)"/> -->
                      <!-- <a-icon type="swap" class="icon-swap" @click="translationImg(item.url, item)"/> -->
                      <!-- <a-icon v-if="item.imgSetStatus" type="rollback" class="icon-back" @click="revokeImg(item.url, item)"/> -->
                    </div>
                  </div>
                </draggable>
                <div class='mt'>
                </div>
              </div>
            </a-card>
          </a-col>
          <!-- 共有图库!!!!!! -->
          <a-col  span='12' >
            <a-card
              :style="{ display: 'inline-block', width: 'calc(99%)'}"
              title='商品图库'
            >
              <attrbuteImg v-if='AddPicturesVisible' :allImg='false' ref='attrbuteImgs' @addVariant='AddSharePic'/>
            </a-card>
          </a-col>
        </a-row>
      </template>
      <div>
        <a-button style="margin-top:10px;width:110px;" @click="ReselectShareImage">重新选择</a-button>
      </div>
    </a-modal>

    <a-modal
      title="提示"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <p>{{ModalText}}</p>
    </a-modal>
    <a-drawer
      title="多属性编辑"
      :maskClosable="false"
      width='1200'
      :visible="editingAll"
      :confirmLoading="editingAllLoading"
      @close="editingAllCancel"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <edit-attribute v-if='editingAll' v-on:toDatall='toDatall' @editingAllCancel="editingAllCancel" :datall='datall' :ColAttribute='ColAttribute' :RowAttribute='RowAttribute' :isClass='isClass'>
      </edit-attribute>
    </a-drawer>
    <a-modal
      title="保存多属性"
      :visible="subAttribute"
      @ok="AttributeOk"
      @cancel="AttributeCancel">
      <p>{{subAttributeText}}</p>
    </a-modal>
    <a-modal
      title="确认翻译"
      :visible="transshow"
      @ok="transOk"
      @cancel="transCancel">
      <p>{{'翻译'+transNumber+"个字符，需要花费"+transMoney+"元，确认翻译吗"}}</p>
    </a-modal>
    <!-- 网络图片上传 -->
    <a-modal
      title="网络图片上传"
      :visible="NetworkInput"
      @ok="NetworkPicOk"
      @cancel="NetworkCancel">
      <div >
        <a-textarea v-model='networkUrl' placeholder="请填写图片URL链接，Enter换行输入多个图片链接" :rows="4" />
      </div>
    </a-modal>
    <a-modal
      title="选择翻译语言"
      :visible="countryvisible">
      <a-select style="width: 240px; margin:0 aotu" v-model="language">
        <a-select-option v-for="(item,index) in languageList" :value="item.code" :key="index">
          {{item.name}}
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
    <div style="margin-top:35px;">
      <a-button @click='cancel()'>取消</a-button>
      <a-button type="primary" :loading='subloading' @click="saveData" style="margin-left:40px">保存</a-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import attrbuteImg from './attrbuteImg'
import {get_base, getSkuData, skuAddAttributes, skuGetAttributes,getBatchUpc, skuAlertAttributes, skuDeleteAttributes, getUpc, deleteSku, SkuPicture, upload, updateSku, productCurrency , trans , trans_fee ,imgRessize,cutOutPic, transPic} from '@/api/collect'
import EditAttribute from '@/components/EditAttribute/EditAttribute'
import { key } from 'vuex'
export default {
  name:"attributeInfo",
  components: {
    //调用组件
    draggable,
    attrbuteImg,
    EditAttribute
  },
  props:[],
  data(){
    return{
      nWidth:"",
      nHeight:"",
      form: this.$form.createForm(this),
      ColAttribute:[],
      RowAttribute:[],
      datall:{
        datacol:"",
        datarow:"",
      },
      backupData:{
        datacol:"",
        datarow:"",
        ColAttribute:'',
        RowAttribute:'',
      },
      subAttribute:false,
      countryValues: '',
      countryValue: '',
      costValue: '',
      costValueText: '',
      percentageValue: '', // 百分比
      costPriceValue: '',
      weightValue: '',
      numValue: '',
      longValue: '',
      widthValue: '',
      heightValue: '',
      planPrice: '',
      modeSelect:[
        {
          value: '利润率',
          title: '利润率'
        },{
          value: '利润值',
          title: '利润值'
        },{
          value: '加价倍',
          title: '加价倍'
        },{
          value:"自定义售价",
          title:"自定义售价"
        }
      ],
      AttributeLoding:false,
      mode: '',
      countrySelect:[
        {
          value: "德国",
          title: "DE",
          logo: "€",
          type: 'EUR'
        },
        {
          value: "法国",
          title: "FR",
          logo: "€",
          type: 'EUR'
        },
        {
          value: "英国",
          title: "GB",
          logo: "￡",
          type: 'GBP'
        },
        {
          value: "意大利",
          title: "IT",
          logo: "€",
          type: 'EUR'
        },
        {
          value: "西班牙",
          title: "ES",
          logo: "€",
          type: 'EUR'
        },

        {
          value: "美国",
          title: "US",
          logo: "$",
          type: 'USD'
        },
        {
          value: "加拿大",
          title: "CA",
          logo: "C$",
          type: 'CAD'
        },
        {
          value: "墨西哥",
          title: "MX",
          logo: "Mex$",
          type: 'MXN'
        },
        {
          value: "澳大利亚",
          title: "AU",
          logo: "A$",
          type: 'AUD'
        },
        {
          value: "日本",
          title: "JP",
          logo: "¥",
          type: 'JPY'
        },
        {
          value: "荷兰",
          title: "NL",
          logo: "€",
          type: 'EUR'
        },
        {
          value: "瑞典",
          title: "SE",
          logo: "£",
          type: 'SEK'
        },
        {
          value: "波兰",
          title: "PL",
          logo: "zł",
          type: 'PLN'
        },
      ],
      storeSelect: [
        {id:1,title:'计划售价'},
        {id:2,title:'成本价'},
        {id:3,title:'重量'},
        {id:4,title:'库存'},
        // {id:5,title:'尺寸'},
        // {id:6,title:'是否含电'},
      ],
      subAttributeText:"",
      selectedID: 1,
      selectedCountry: '',
      dataListLoading: false,
      dataLL: [],
      dataList: [],
      selectedRowKeys: [],
      selectManageAll: [],
      id: '',
      ModalText: '确认要删除吗',
      visible: false,
      confirmLoading: false,
      visiblePic: false,
      confirmLoadingPic: false,
      token: '',
      previewVisible: false,
      previewImage:'',
      fileList:[],
      file:{},
      fileID: '',
      fileName: "",
      editingAll:false,
      editingAllLoading:false,
      record: '',
      selectImgList: [],
      uploadImgList: [],
      mergeImgList: [],
      rowselect:[
        {
          attribute:"color1",
        },
        {
          attribute:"size2"
        }
      ],
      battery_status: 0,
      subloading: false,
      status: '',
      addNewProduct: '',
      checkTitle: '是',
      dataListNew: [{
        battery_status: 0,
        country: "",
        ean: "",
        image: [],
        image_pool: [
        ],
        variant: [
        ],
        ori_url: "",
        price: {
          "FR": "", "DE": "", "GB": "", "IT": "", "ES": "",  "SE": "","US": "", "NL": "", "CA": "", "MX": "", "AU": "", "JP": "", "PL": ""
        },
        profit: {
          "FR": "", "DE": "", "GB": "", "IT": "", "ES": "",  "SE": "","US": "", "NL": "", "CA": "", "MX": "", "AU": "", "JP": "", "PL": ""
        },
        freight:"",
        quantity: "20",
        sid: "0",
        serialNumber: "1",
        sku: "",
        weight:{
          height: "",
          length: "",
          value_type: "",
          weight: "",
          width: "",
        }
      }],

      stretchingLoading:false,
      newFilterImg:"",
      takeImg:"",
      checkHD:false,
      currencyType:"",
      exchange: "",
      attributeOne:"",
      attributeTow:"",
      attributeOneStr:"",
      attributeTowStr:"",
      tranInfo:"",
      defaultSlate:'3',
      translateLoading:false,
      chromeCode:this.GLOBAL.chrome.id,
      transMoney:"",
      transNumber:"",
      transshow:false,
      picAlt:require('@/assets/icons/picAlt.png'),
      picAltError:require('@/assets/icons/picAltError.png'),
      bgShow:true,
      rows:"",
      visible_zoom:false,
      zoom_url:'',
      columns:[
        {
          title: '序号',
          key: 'serialNumber',
          align:'center',
          scopedSlots: { customRender: 'serialNumber' },
          width:'112px'
        },
        {
          title: '图片',
          key: 'image',
          align:'center',
          scopedSlots: { customRender: 'image' },
          width:'165px'
        },
        // {
        //   title: '颜色(color)',
        //   key: 'color',
        //   align:'center',
        //   scopedSlots: { customRender: 'color' },
        //   width:'250px'
        // },
        // {
        //   title: '尺寸(size)',
        //   key: 'size',
        //   align:'center',
        //   scopedSlots: { customRender: 'size' },
        //   width:'250px'
        // },
        {
          title: '成本价(人民币)',
          key: 'price1',
          align:'center',
          scopedSlots: { customRender: 'price1' },
          width:'130px'
        },
        {
          key: 'price2',
          align:'center',
          slots: { title: 'price2' },
          scopedSlots: { customRender: 'price2' },
          width:'300px'
        },
        {
          key: 'profit',
          align:'center',
          slots: { title: 'profit' },
          scopedSlots: { customRender: 'profit' },
          width:'300px'
        },
        {
          title: '运费',
          key: 'freight',
          align:'center',
          scopedSlots: { customRender: 'freight' },
          width:'100px'
        },
        {
          title: '库存',
          key: 'quantity',
          align:'center',
          scopedSlots: { customRender: 'quantity' },
          width:'100px'
        },
        {
          // title: 'SKU',
          key: 'sku',
          align:'center',
          slots: { title: 'sku' },
          scopedSlots: { customRender: 'sku' },
          width:'270px'
        },
        {
          // title: 'EAN',
          key: 'ean',
          align:'center',
          slots: { title: 'ean' },
          scopedSlots: { customRender: 'ean' },
          width:'270px'
        },
        {
          title: '重量(g)',
          key: 'weight',
          align:'center',
          scopedSlots: { customRender: 'weight' },
          width:'130px'
        },
        // {
        //   title: '尺寸',
        //   key: 'weights',
        //   align:'center',
        //   scopedSlots: { customRender: 'weights' },
        //   width:'320px'
        // },
        // {
        //   title: '是否含电',
        //   key: 'battery_status',
        //   align:'center',
        //   scopedSlots: { customRender: 'battery_status' },
        //   width:'141px'
        // },
        {
          title: '操作',
          key: 'action',
          align:'center',
          scopedSlots: { customRender: 'action' },
          width:'120px'
        },
      ],
      columnData:[
        {
          title: '序号',
          key: 'serialNumber',
          align:'center',
          scopedSlots: { customRender: 'serialNumber' },
          width:'112px'
        },
        {
          title: '图片',
          key: 'image',
          align:'center',
          scopedSlots: { customRender: 'image' },
          width:'165px'
        },
        // {
        //   title: '颜色(color)',
        //   key: 'color',
        //   align:'center',
        //   scopedSlots: { customRender: 'color' },
        //   width:'250px'
        // },
        // {
        //   title: '尺寸(size)',
        //   key: 'size',
        //   align:'center',
        //   scopedSlots: { customRender: 'size' },
        //   width:'250px'
        // },
        {
          title: '成本价(人民币)',
          key: 'price1',
          align:'center',
          scopedSlots: { customRender: 'price1' },
          width:'130px'
        },
        {
          key: 'price2',
          align:'center',
          slots: { title: 'price2' },
          scopedSlots: { customRender: 'price2' },
          width:'300px'
        },
        {
          key: 'profit',
          align:'center',
          slots: { title: 'profit' },
          scopedSlots: { customRender: 'profit' },
          width:'300px'
        },
        {
          title: '运费',
          key: 'freight',
          align:'center',
          scopedSlots: { customRender: 'freight' },
          width:'100px'
        },
        {
          title: '库存',
          key: 'quantity',
          align:'center',
          scopedSlots: { customRender: 'quantity' },
          width:'100px'
        },
        {
          // title: 'SKU',
          key: 'sku',
          align:'center',
          slots: { title: 'sku' },
          scopedSlots: { customRender: 'sku' },
          width:'270px'
        },
        {
          // title: 'EAN',
          key: 'ean',
          align:'center',
          slots: { title: 'ean' },
          scopedSlots: { customRender: 'ean' },
          width:'270px'
        },
        {
          title: '重量(g)',
          key: 'weight',
          align:'center',
          scopedSlots: { customRender: 'weight' },
          width:'130px'
        },
        // {
        //   title: '尺寸',
        //   key: 'weights',
        //   align:'center',
        //   scopedSlots: { customRender: 'weights' },
        //   width:'320px'
        // },
        // {
        //   title: '是否含电',
        //   key: 'battery_status',
        //   align:'center',
        //   scopedSlots: { customRender: 'battery_status' },
        //   width:'141px'
        // },
        {
          title: '操作',
          key: 'action',
          align:'center',
          scopedSlots: { customRender: 'action' },
          width:'120px'
        },
      ],
      columnWidth:2559,
      exchangeCancel:{
        "FR": "", "DE": "", "GB": "", "IT": "", "ES": "","SE": "", "NL": "", "US": "", "CA": "", "MX": "", "AU": "", "JP": "", "PL": ""
      },
      arrs:[],
      selectedCountryAll:false,
      countryMulitple:[],
      AddPicturesVisible:false,
      publicPic:[],
      allImg:false,
      isClass:false,
      //网络图片
      showUploadBox:false,
      NetworkInput:false,
      networkUrl:'',

      defaultImg: 'this.src="' + require('@/assets/icons/picAlt.png') + '"', //默认图地址
      prefixValue:'',
      galleryData:[],//图库数据
      deletePic:[],
      languageAllArr:["de", "es","it","fr","en","nl","ja","zh","pl","sv"],
      languageArr:["en","zh","ja"],
      languageArrOrcountry:{
        // "de": "德语",
        // "es": "西班牙语",
        // "it": "意大利语",
        // "fr": "法语",
        "en": "英语",
        // "nl":"荷兰语",
        "ja": "日语",
        "zh": '中文',
      },
      tabENA:false,
      countryvisible:false,
      languageList:[
        {name:'英语',code:'en'},
        {name:'日语',code:'ja'},
        {name:'法语',code:'fr'},
        {name:'德语',code:'de'},
        {name:'西班牙语',code:'es'},
        {name:'意大利语',code:'it'},
        {name:'阿拉伯语',code:'ar'},
        {name:'葡萄牙语',code:'pt'},
        {name:'波兰语',code:'pl'},
        {name:'瑞典语',code:'sv'},
      ],
      language:'en',
      languageLoading:false,
      transPicObj:null
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
            this.selectedRowKeys = selectedRowKeys
        }
      }
    },
  },
  mounted() {
    // this.$store.commit('set_subTabthree',true)
    this.token = Vue.ls.get('Access-Token')
    // this.id = this.$route.query.id
    this.addNewProduct = Number(this.$route.query.type);
    if(this.addNewProduct === 1) {
      if(this.$store.state.tabStatus.goodsId){
        this.id = this.$store.state.tabStatus.goodsId
      }
    }else{
      this.id = this.$route.query.id
      this.$store.commit('set_goodsId',this.id)
    }
    console.log(this.$store.state.tabStatus.goodsId,'idddd')
    this.countrySelect.forEach((item,index)=>{
      productCurrency({
        money:"666",
        to:"CNY",
        from:item.type
      }).then(res=>{
        if(res.code===0){
          this.exchangeCancel[item.title] = res.data[0].exchange;
          console.log('asd')
        }
      })
    })
    // 点击属性信息 调取接口
    if(this.$store.state.tabStatus.key) {
      this.getSku()
    }else {
    }
    if(this.addNewProduct === 1) {
      this.resetSku(1)
      this.resetEan(1)
      setTimeout(() => {
        this.dataList = this.dataListNew
      }, 1000)
    }else {
    }
    if(Vue.ls.get('CHROME_ID')){
      this.chromeCode = Vue.ls.get('CHROME_ID')
    }else{
      this.chromeCode = this.GLOBAL.chrome.id
    }
    if(Vue.ls.get('SLATE_TYPE')){
      this.defaultSlate = Vue.ls.get('SLATE_TYPE')
    }else {
      this.defaultSlate = '3'
    }
    console.log(this.datall,'datall')

  },
  methods: {
    //一键抠图
    editeImg(url, item){
      cutOutPic({
        image_url:url
      }).then((res)=>{
        if(res.code === 0){
          item.url = res.data.url
          item.imgSetStatus = true
          console.log(res.data)
        }
      })
    },
    //图片翻译
    translationImg(url, item){
      this.countryvisible = true
      this.transPicObj = item
    },
    //选择翻译语言确认
    countryhandleOk(){
      let _this = this
      this.languageLoading = true
      transPic({
        image_url:this.transPicObj.url,
        to:this.language
      }).then((res)=>{
        if(res.code === 0){
          _this.fileList.forEach((item, index) => {
            if(item.uid == _this.transPicObj.uid){
              item.url = res.data.url
              item.imgSetStatus = true
            }
          })
          _this.languageLoading = false
          _this.countryvisible = false;
        }else{
          _this.languageLoading = false
          _this.$notification.error({
            message: '失败',
            description: res.msg,
          });
        }
      })
    },
    //还原
    revokeImg(url,item){
      if(this.oriFileData.length){
        this.oriFileData.forEach((itm,idx)=>{
          if(item.uid == itm.uid){
            item.url = itm.url
            item.imgSetStatus = false
          }
        })
      }
    },
    prefixChange(e){
      let reg = new RegExp("^[a-zA-Z0-9]+$")
      if(e.target.value){
        if(!reg.test(e.target.value)){
          this.prefixValue = ''
          this.$notification.error({
            message: '错误',
            description: "SKU前缀只能包含字母和数字",
            duration: 10
          });
        }
      }
    },
    zoomPic(url,item){
      console.log(item,'6666')
      // this.visible_zoom = true
      this.zoom_url = url
      this.handlePreview(item)
    },
    // 批量添加图片
    AddPictures(){
      if(this.selectManageAll.length > 0 ){
        this.AddPicturesVisible = true
      }else{
        this.$notification.error({
          message: '错误',
          description: '请勾选商品',
          duration: 10
        });
      }
    },
    AddPicturesCancel(){
      this.AddPicturesVisible = false
      //清空共有图库的数据
      this.publicPic = []
    },
    AddSharePic(pic){
      let picObj = {
        uid:this.fileList.length+1 ,
        url:pic,
        status:1,
      }
      this.publicPic.push(picObj);
      this.publicPic = this.uniqueArray(this.publicPic,'url')
      console.log(this.publicPic)
    },
    closeShareImage(value,index){
      this.publicPic.splice(index,1)
    },
    // 重新选择
    ReselectShareImage(){
      this.publicPic = []
    },
    // 确认
    handleOkSharePic(){
      console.log('图片',this.publicPic,'dataList',this.dataList,"selectedRowKeys",this.selectedRowKeys)
      this.dataList.forEach((item,index)=>{
        if(this.selectedRowKeys.indexOf(item.sid) != -1){
          let temporaryImage = item.image_pool
          item.image_pool = temporaryImage.concat(this.publicPic);
          // 过滤多余图片
          item.image_pool = this.uniqueArray(item.image_pool,'url');
          if(item.image.length < 1 && this.publicPic.length>0){
            item.image.push(this.publicPic[0].url)
          }
        }
      })
      console.log(this.dataList,'dataList')
      this.AddPicturesVisible = false
      this.publicPic = []
      console.log('批量添加图片')
      this.$refs.attrbuteImgs.updateImgContent()
    },
    updateColumns(){
      this.columns = JSON.parse(JSON.stringify(this.columnData))
      let size = {
        title: '尺寸(size)',
        key: 'size',
        align:'center',
        scopedSlots: { customRender: 'size' },
        width:'250px'
      },color={
        title: '颜色(color)',
        key: 'color',
        align:'center',
        scopedSlots: { customRender: 'color' },
        width:'250px'
      }
      let status1=0,status2=0
      if(this.dataLL.length){
        // debugger
        this.dataLL.forEach((item,index)=>{
          console.log(item)
          if(item.name == 'color'){
            if(this.dataList.length){
              this.dataList.forEach((itm,idx)=>{
                itm.variant.forEach((im,inx)=>{
                  console.log('itm.variant',im,"dataLL",item)
                  if(im["zh"].name == item.name){
                    // if(im["zh"].value){
                    //   status1 = 1
                    // }
                    this.languageAllArr.forEach((iten,index)=>{
                      if(im[iten].value){
                        status1++
                      }
                    })
                  }
                })
              })
            }
          }else if(item.name == 'size'){
            if(this.dataList.length){
              console.log(this.dataList)
              this.dataList.forEach((itm,idx)=>{
                itm.variant.forEach((im,inx)=>{
                  if(im["zh"].name == item.name){
                    this.languageAllArr.forEach((iten,index)=>{
                      if(im[iten].value){
                        status2++
                      }
                    })
                  }
                })
              })
            }
          }
        })
      }
      console.log(status1,status2,'over1111')
      if(status1&&!status2){
        console.log('执行了1')
        this.columns.splice(2,0,color)
        this.columnWidth=2309
      }else if(!status1&&status2){
        console.log('执行了2')
        this.columns.splice(2,0,size)
        this.columnWidth=2309
      }else if(status1&&status2){
        console.log('执行了3')
        this.columns.splice(2,0,color,size)
        this.columnWidth=2559
      }
    },
    reFresh() {
      if(this.addNewProduct === 0) {
        this.getSku(1)
      }
      if(this.addNewProduct === 1) {
        get_base({
          id:this.addNewProduct === 0 ? this.id : this.$store.state.tabStatus.goodsId,
        })
          .then(res => {
            if(res.code === 0) {
              this.dataList.forEach((item, index) => {
                item.image_pool = res.data.image
              })
              this.$notification.success({
                message: '提醒',
                description: '图片更新成功',
              });
            } else {
              this.$notification.error({
                message: '提醒',
                description: '图片更新失败',
              });
            }
          })
      }

    },
    sub(){
      console.log(this.datall)
    },
    getSku(value) {
      console.log('123')
      getSkuData({
        id: this.addNewProduct === 0 ? this.id : this.$store.state.tabStatus.goodsId,
      }).then(res => {
        if(res.code === 0) {
          console.log(res.ori_language,'ori_language')
          this.$store.commit('set_ori_language',res.ori_language)
          if(value === 1) {
            if(JSON.stringify(res.data) == "{}"){
              this.$notification.error({
                message: '提醒',
                description: '图片更新失败',
              });
            }else{
              res.data.forEach((item, index) => {
                this.dataList.forEach((items, indexs) => {
                  if(item.sid === items.sid) {
                    items.image = item.image
                    items.image_pool = item.image_pool
                  }
                })
              })
              // this.dataList = res.data
              // this.datall.datacol = this.deepCopy(this.dataList)
              this.$notification.success({
                message: '提醒',
                description: '图片更新成功',
              });
              if(this.dataList.length){
                let str = this.dataList[0].sku.split("-")
                if(str.length>2){
                  this.prefixValue = str[0]
                }
              }
            }
          } else {
            console.log('222')
            if(JSON.stringify(res.data) == "{}"){
              res.data =[]
              this.dataList = res.data
              this.dataList.forEach((item, index) => {
                item['serialNumber'] = index + 1
              })
              this.datall.datacol = this.deepCopy(this.dataList)
            }else{
              this.dataList = res.data
              this.dataList.forEach((item, index) => {
                item['serialNumber'] = index + 1
                if(!item.profit){
                  item.profit = {"FR": "", "DE": "", "GB": "", "IT": "", "ES": "", "SE": "", "US": "", "NL": "", "CA": "", "MX": "", "AU": "", "JP": "" , "PL": "" ,}
                }
              })
              this.datall.datacol = this.deepCopy(this.dataList)
            }
            if(this.dataList.length){
              let str = this.dataList[0].sku.split("-")
              if(str.length>2){
                this.prefixValue = str[0]
              }
            }

          }

          skuGetAttributes({
            pid: this.addNewProduct === 0 ? this.id : this.$store.state.tabStatus.goodsId,
          }).then(res => {
            if(res.code === 0){
              // 判断data是否为空对象
              if(JSON.stringify(res.data) == "{}"){
                res.data = []
                this.dataLL = res.data
                // this.datall.datarow = this.dataLL
                this.datall.datarow = this.deepCopy(this.dataLL)
                // console.log(this.datall,"ovee")
                this.initdatall()
              }else{
                this.dataLL = res.data
                // this.datall.datarow = this.dataLL
                this.datall.datarow = this.deepCopy(this.dataLL)
                // console.log(this.datall,"ovee")
                this.initdatall()
              }
              this.updateColumns()
            }
          })
          if(this.datall.datacol.length > 1 ){
            console.log('多属性',1,'ovee')
            this.isClass = true
          }else{
            console.log(this.datall.datacol[0].variant,'lllll',)
            console.log(this.datall.datacol[0].variant.length,'2222')
            console.log(this.datall.datacol[0].variant[0]['zh'].value.length,'3333')
            // && this.datall.datacol[0].variant[0]['cn'].value.length>0
            // if(this.datall.datacol[0].variant && this.datall.datacol[0].variant.length>0 && this.datall.datacol[0].variant[0].value.length>0){
            if(this.datall.datacol[0].variant && this.datall.datacol[0].variant.length>0 && this.datall.datacol[0].variant[0]["zh"].value.length>0){
              console.log('多属性',1,'ovee')
              this.isClass = true
            }else{
              console.log('单品',2,'ovee')
              this.isClass = false
            }
          }
        }
      })
    },
    // 深拷贝
    deepCopy(obj){
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
    // 初始化字典的值
    initdatall(state){
      this.RowAttribute = []
      Object.keys(this.datall.datarow).forEach((item,index)=>{
        this.RowAttribute.push(index)
      })
      // console.log(this.RowAttribute,'RowAttribute')
      this.ColAttribute = []
      Object.keys(this.datall.datacol).forEach((item,index)=>{
        this.ColAttribute.push(index)
        if(state === 'row'){
          let row = {
            name: "",
            prid: "0",
            sid: "0",
            value: "",
          }
          row.name = this.datall.datarow[this.datall.datarow.length-1].name
          row.prid = this.datall.datarow[this.datall.datarow.length-1].prid

          // console.log(this.datall.datacol)
          this.datall.datacol[index].variant.push(row)
        }
        if(state == 'del'){
          this.datall.datacol[index].variant.pop()
        }
      })
    },
    editTypeHandle() {
      this.editingAll = true
      this.datall.datacol = this.deepCopy(this.dataList)
      this.datall.datarow = this.deepCopy(this.dataLL)
      this.initdatall()
      console.log(this.datall,'datall')
    },
    handleChangeSelect(value) {
      console.log(`selected ${value}`);
      this.selectedID = value
    },
    handleChangeMode(value) {
      if(value === '利润值') {
        this.costValueText = '固定值'
      }
      if(value === '加价倍') {
        this.costValueText = '成本价*'
      }
      if(value === '利润率') {
        this.costValueText = '百分比'
      }
      if(value === '自定义售价'){
        this.costValueText = '当地货币'
      }
      this.mode = value
    },
    handleChangeCountry(value) {
      console.log(`selected ${value}`);
      this.selectedCountry = value
      console.log(this.countrySelect,'||||||',this.selectedCountry)
      this.selectedCountry.forEach((item,index)=>{
        if(item === 'all'){
          console.log('执行了')
          console.log(this.countryMulitple)
          this.selectedCountryAll = true
          this.countryMulitple = ["DE", "NL", "FR", "GB", "ES", "SE","IT", "US", "MX", "CA", "AU", "JP","PL"]
        }
      })
      if(this.selectedCountryAll === true){
        this.selectedCountry = this.countryMulitple
      }
      console.log(this.selectedCountry,'selectedCountry')
      if(this.selectedCountry.length === 0 || this.selectedCountry.indexOf('all' == -1)){
        this.selectedCountryAll = false
      }
      console.log(this.selectedCountryAll)
    },
    // 数组对象比较相同的值
    getArrDifSameValue(arr1,arr2){
      arr1.forEach((item,index)=>{
        arr2.forEach((im,ix)=>{
          if(item.title === im){
            // this.arrs.push(item.type)
            console.log(ix)
            this.getproductCurrency(item.type,item.title,ix)
            // console.log('汇率',this.getproductCurrency(item.type),'国家:',item.title,'type',item.type)
          }
        })
      })
      console.log(this.arrs,'arrs')
    },
    // 获取汇率
    getproductCurrency(v,title,index){
      console.log(v,title,index)
      productCurrency({
        money:"666",
        to:"CNY",
        from:v
      }).then(res=>{
        if(res.code===0){
          let countryObject = {
            type:v,
            title:title,
            exchange:res.data[1].exchange
          }
          this.arrs[index] = countryObject
        }
      })
    },
    onChangeCheckbox(e) {
      if(this.selectManageAll.length > 0) {
        if(this.battery_status) {
          // this.battery_status = 1
          this.checkTitle = '是'
        }else {
          // this.battery_status = 0
          this.checkTitle = '否'
        }
        console.log(this.battery_status)
      }else {
        this.$notification.error({
          message: '失败',
          description: '请勾选商品',
          duration: 5
        });
      }
    },
    onChangeList(e,record) {
      if(e.target.value){
        record.battery_status = 1
      }else{
        record.battery_status = 0
      }
    },
    onChangeListA(e,record) {
      console.log(record)
      console.log(`checked = ${e.target.checked}`)
      record.battery_status = 1
    },
    onChangeListB(e,record) {
      console.log(record)
      console.log(`checked = ${e.target.checked}`)
      record.battery_status = 0
    },
    // 重复执行
    priceFillingLoding(){
      setTimeout(() => {
        if(this.arrs.length === this.selectedCountry.length){
          this.priceFilling()
        }else{
          this.priceFillingLoding()
        }
      }, 3000);
    },
    confirm() {
      console.log(this.selectedRowKeys,this.selectManageAll)
      this.AttributeLoding = true
      this.arrs = []
      console.log(this.countrySelect,'选择的国家：',this.selectedCountry,'汇率：',this.exchange)
      if(this.selectedID === 1){
        if(this.selectedCountry){
          this.getArrDifSameValue(this.countrySelect,this.selectedCountry)
        }
      }
      if(this.selectManageAll.length > 0 ) {
        if(this.selectedID === 1) {
          if(this.arrs.length>0){
            this.AttributeLoding = true
            this.priceFilling()
          }else{
            this.AttributeLoding = true
            this.priceFillingLoding()
          }
        }if(this.selectedID === 2) {
          if(this.costPriceValue.length > 0) {
            this.selectManageAll.forEach((item, index) => {
              item.price.CN = this.costPriceValue
            })
          }else {
            this.$notification.error({
              message: '失败',
              description: '错误，信息填写不完整，请填写完整信息',
              duration: 10
            });
          }
          this.endAttrLoding()
        }if(this.selectedID === 3) {
          if(this.weightValue.length > 0) {
            this.selectManageAll.forEach((item, index) => {
              item.weight.weight = this.weightValue
            })
          }else {
            this.$notification.error({
              message: '失败',
              description: '错误，信息填写不完整，请填写完整信息',
              duration: 10
            });
          }
          this.endAttrLoding()
        }if(this.selectedID === 4) {
          if(this.numValue.length > 0) {
            this.selectManageAll.forEach((item, index) => {
              item.quantity = this.numValue
            })
          }else {
            this.$notification.error({
              message: '失败',
              description: '错误，信息填写不完整，请填写完整信息',
              duration: 10
            });
          }
          this.endAttrLoding()
        }if(this.selectedID === 5) {
          if(this.longValue.length >0 && this.widthValue.length > 0 && this.heightValue.length > 0) {
            this.selectManageAll.forEach((item, index) => {
              item.weight.length = this.longValue
              item.weight.width = this.widthValue
              item.weight.height = this.heightValue
            })
          }else {
            this.$notification.error({
              message: '失败',
              description: '错误，信息填写不完整，请填写完整信息',
              duration: 10
            });
          }
          this.endAttrLoding()
        }if(this.selectedID === 6) {
          // 是否含电
          if(this.battery_status == 1 || this.battery_status == 0) {
            this.dataList.forEach((item, index) => {
              this.selectManageAll.forEach((a, b) => {
                if(item.sid === a.sid) {
                  item.battery_status = this.battery_status
                  if(item.battery_status == "0"){
                  }else{
                  }
                }
              })
            })
          } else {
            this.$notification.error({
              message: '失败',
              description: '错误，信息填写不完整，请填写完整信息',
              duration: 10
            });
          }
          this.endAttrLoding()
        }
      }else {
        this.$notification.error({
          message: '失败',
          description: '请勾选商品',
          duration: 10
        });
        this.endAttrLoding()
      }
    },
    endAttrLoding(){
      setTimeout(()=>{
        this.AttributeLoding = false
      },300)
    },
    //填充 计划售价
    priceFilling(){
      console.log('填充计划售价')
      this.arrs.forEach((ParentItem,index)=>{
        if(ParentItem.title.length > 0 && this.mode.length > 0 && this.costValue.length > 0 ) {
          if(this.mode === '利润值') {
            let numA = (Number(this.costValue) + Number(this.percentageValue)) / 0.85 * Number(ParentItem.exchange).toFixed(2)
            if(isNaN(numA)) {
              this.$notification.error({
                message: '失败',
                description: '价格填写不完整',
                duration: 3
              });
            } else {
              this.selectManageAll.forEach((item,index) => {
                item.price[ParentItem.title] = ((Number(item.price.CN) + Number(this.costValue) + Number(this.percentageValue)) / 0.85 * Number(ParentItem.exchange)).toFixed(2)
                let profitNum = item.price[ParentItem.title]
                item.profit[ParentItem.title] = (profitNum*0.85 - Number(this.percentageValue) * Number(ParentItem.exchange) - Number(item.price.CN) * Number(ParentItem.exchange)).toFixed(2)
                if(ParentItem.title=='GB'){
                  item.price[ParentItem.title] = (item.price[ParentItem.title] * 1.2).toFixed(2)
                }
                item.freight = Number(this.percentageValue)
              })
              // this.selectManageAll = []
              // this.selectedRowKeys = []
            }
          }
          if(this.mode === '加价倍') {
            let numB = (Number(this.costValue) + Number(this.percentageValue)) / 0.85 * Number(ParentItem.exchange).toFixed(2)
            if(isNaN(numB)) {
              this.$notification.error({
                message: '失败',
                description: '价格填写不完整',
                duration: 3
              });
            } else {
              this.selectManageAll.forEach((item,index) => {
                item.price[ParentItem.title] = ((Number(item.price.CN) * Number(this.costValue) + Number(this.percentageValue)) / 0.85 * Number(ParentItem.exchange)).toFixed(2)
                let profitNum = item.price[ParentItem.title]
                item.profit[ParentItem.title] = (profitNum*0.85 - Number(this.percentageValue) * Number(ParentItem.exchange) - Number(item.price.CN) * Number(ParentItem.exchange)).toFixed(2)
                if(ParentItem.title=='GB'){
                  item.price[ParentItem.title] = (item.price[ParentItem.title] * 1.2).toFixed(2)
                }
                item.freight = Number(this.percentageValue)
              })
              // this.selectManageAll = []
              // this.selectedRowKeys = []
            }
          }
          if(this.mode === '利润率') {
            let num = Number(0.85 - Number(Number(this.costValue) / 100))
            let numC = (Number(this.percentageValue)) / Number( 0.85 - Number(Number(this.costValue) / 100) ) * Number(ParentItem.exchange).toFixed(2)
            if(num < 0) {
              this.$notification.error({
                message: '失败',
                description: '利润率不能超过85',
                duration: 3
              });
              this.costValue = ''
            } else {
              if(isNaN(numC)) {
                this.$notification.error({
                  message: '失败',
                  description: '价格填写不完整',
                  duration: 3
                });
              } else {
                this.selectManageAll.forEach((item,index) => {
                  item.price[ParentItem.title] = ((Number(item.price.CN) + Number(this.percentageValue)) / Number( 0.85 - Number(Number(this.costValue) / 100) ) * Number(ParentItem.exchange)).toFixed(2)
                  let profitNum = item.price[ParentItem.title]
                  item.profit[ParentItem.title] = (profitNum*0.85 - Number(this.percentageValue) * Number(ParentItem.exchange) - Number(item.price.CN) * Number(ParentItem.exchange)).toFixed(2)
                  if(ParentItem.title=='GB'){
                    item.price[ParentItem.title] = (item.price[ParentItem.title] * 1.2).toFixed(2)
                  }
                  item.freight = Number(this.percentageValue)
                })
                // this.selectManageAll = []
                // this.selectedRowKeys = []
              }
            }
          }
          if(this.mode === '自定义售价') {
            let numD = (Number(this.costValue)).toFixed(2)
            console.log(numD)
            if(isNaN(numD)) {
              this.$notification.error({
                message: '失败',
                description: '价格填写不完整',
                duration: 3
              });
            } else {
              this.selectManageAll.forEach((item,index) => {
                item.price[ParentItem.title] = Number(this.costValue).toFixed(2)
                let profitNum = item.price[ParentItem.title]
                item.profit[ParentItem.title] = (profitNum*0.85 - Number(this.percentageValue) * Number(ParentItem.exchange) - Number(item.price.CN) * Number(ParentItem.exchange)).toFixed(2)
                // if(ParentItem.title=='GB'){
                //   item.price[ParentItem.title] = (item.price[ParentItem.title] * 1.2).toFixed(2)
                // }
                item.freight = Number(this.percentageValue)
              })
              // this.selectManageAll = []
              // this.selectedRowKeys = []
            }
          }
        }else {
          this.$notification.error({
            message: '失败',
            description: '错误，信息填写不完整，请填写完整信息',
            duration: 3
          });
        }
      })
      this.endAttrLoding()
      console.log('selectManageAll', this.selectManageAll)
    },
    resetSku(record) {
      let ranstr =  ["0","1","2","3","4","5","6","7","8","9","A","a","B","b","C","c","D","d","E","e","F","f","G","g","H","h","I","i","J","j","K","k","L","l","M","m","N","n","O","o","P","p","Q","q","R","r","S","s","T","t","U","u","V","v","W","w","X","x","Y","y",'Z',"z"]
      let result = "";
      let r = ''
      if(record === 1) {
        for(var i = 0; i < 15; i++) {
          r = Math.floor(Math.random() * 62);
          result += ranstr[r];
        }
        // console.log(result,result.length,ranstr.length)
        this.dataListNew.forEach((item, index) => {
          if(this.prefixValue){
            item.sku = this.prefixValue + '-' +result + '-' + (index + 1)
          }else{
            item.sku = result + '-' + (index + 1)
          }
        })
      } else {
        for(var i = 0; i < 15; i++) {
          r = Math.floor(Math.random() * 62);
          result += ranstr[r];
        }
        // console.log(result,result.length,ranstr.length)
        this.dataList.forEach((item, index) => {
          // item.sku = result + '-' + (index + 1)
          if(this.prefixValue){
            item.sku = this.prefixValue + '-' +result + '-' + (index + 1)
          }else{
            item.sku = result + '-' + (index + 1)
          }
        })
      }
    },
    resetEan(record) {
      let type;
      this.tabENA?type=2:type=1
      if(record === 1) {
        getBatchUpc({num:1,type})
          .then(res => {
            if(res.code === 0) {
              this.dataListNew[0].ean = res.data.ean[0]
            }
          })
      } else {
        getBatchUpc({num:1,type})
          .then(res => {
            if(res.code === 0) {
              record.ean = res.data.ean[0]
            }
          })
      }
    },
    resetEanAll(record) {
      let type;
      this.tabENA?type=2:type=1
      if(record === 1) {
        getBatchUpc({num:this.dataListNew.length,type}).then(res => {
          if(res.code === 0) {
            // this.dataListNew[0].ean = res.data.upc
            this.dataListNew.forEach((item,index)=>{
              item.ean = res.data.ean[index]
            })
          }else{
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          }
        })
      } else {
        getBatchUpc({num:this.dataList.length,type}).then(res =>{
          if(res.code === 0) {
            // record.ean = res.data.upc
            this.dataList.forEach((item,index)=>{
              item.ean = res.data.ean[index]
            })
          }else{
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          }
        })
      }
    },
    tabType(){
      this.tabENA = !this.tabENA
      // Vue.ls.set("tabENA",this.tabENA)
    },

    // 批量删除
    batchDelet() {
      if(this.selectManageAll.length > 0) {
        this.visible = true;
      }else {
        this.$notification.error({
          message: '失败',
          description: '请勾选变体商品',
        });
      }
    },
    deleteRow(sid) {
      // console.log(sid)
      this.dataList.forEach((item,index)=>{
        if(item.sid === sid){
          // console.log(item.sid,'123')
          this.dataList.splice(index,1)
        }
      })
    },
    //设置按钮
    uploadPicHandle(record) {
      let _this = this
      _this.record = record
      // console.log(_this.record.image_pool)
      _this.fileList = _this.deepCopy(_this.record.image_pool)
      console.log( _this.fileList)
      //打开图库编辑前 请求总图库的图片
      _this.visiblePic = true
    },
    handleOkPic(e) {
      this.filterImg()
      this.$store.state.tabStatus.tabtwo = false
      this.$refs.attrbuteImgs.updateImgContent()
      console.log(this.deletePic,'删除的图片')
      this.dataList.forEach((itm,idx)=>{
        this.deletePic.forEach((item,index)=>{
          if(item==itm.image[0] && itm.image[0]){
            itm.image[0] = ''
          }
          itm.image_pool.forEach((im,ix)=>{
            if(item === im.url && im.url){
              itm.image_pool.splice(ix,1);
            }
          })
        })
        // if(this.deletePic === itm.image[0] && itm.image[0]){
        //   itm.image[0] = ''
        // }
        // itm.image_pool.forEach((im,ix)=>{
        //   if(this.deletePic === im.url && im.url){
        //     itm.image_pool.splice(ix,1);
        //   }
        // })
      })
      this.galleryData.forEach((item,index)=>{
        this.dataList.forEach((itm,idx)=>{
          if(item.ori_url === itm.image[0] && itm.image[0]){
            itm.image[0] = item.new_url
          }
          itm.image_pool.forEach((im,ix)=>{
            if(item.ori_url === im.url && im.url){
              im.url = item.new_url
            }
          })
        })
      })
    },
    handleCancelPic(e) {
      // console.log('Clicked cancel button');
      this.visiblePic = false;
      this.selectImgList = []
      this.uploadImgList = []
      this.fileList = []
      this.dataList.forEach((item, index) => {
        if(item.sid === this.record.sid) {
          item.image = this.record.image
          item.image_pool = this.record.image_pool
        }
      })
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      // console.log(file,'file')
      this.fileID = file.uid
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
      // console.log(this.previewImage,'previewImage','file',file,'zoom_url',this.zoom_url)
      setTimeout(() => {
        // console.log(document.getElementById('imgbox'),'ovee')
        this.nWidth = document.getElementById('imgbox').naturalWidth;
        this.nHeight = document.getElementById('imgbox').naturalHeight;
      }, 300);
    },
    handleChange({ fileList, file }) {
      console.log("执行--handleChange")
      this.fileName = file.thumbUrl
      this.fileList = fileList;
      this.fileList.forEach((item, index) => {
        if(item.status === "done") {
          this.fileList[index].url = item.response.data.url
          this.fileList[index].status = 0
          this.fileList[index].uid = item.uid
        }
      })
      this.fileList.reverse().reverse()
      if(file.status === "done") {
        this.fileList.forEach((item,index) => {
          if( index === this.fileList.length - 1 && !item.url ) {
            upload({ file:item.thumbUrl })
              .then((res) => {
                if(res.code === 0) {
                  this.uploadImgList.push(res.data.url)
                }
              })
          }
        })
      }
    },
    checkImage(changeImg) {
      // console.log(changeImg,"123")
      // console.log(this.fileList,'asd')
      this.fileList.forEach((keyItem,index)=>{
        if(keyItem.uid === changeImg.uid){
          if(changeImg.status == 0){
            keyItem.status = 1
          }else{
            keyItem.status = 0
          }
        }else{
          // console.log('不等于')
        }
      })
      // console.log(this.fileList,'fileList')
    },
    closeImage(value,index){
      this.fileList.splice(index,1)
    },
    filterImg(){
      let _this = this
      // console.log(this.fileList,this.uploadImgList)
      this.newFilterImg = []
      // this.takeImg = []
      // this.record.image = []
      this.fileList.forEach((item,idnex)=>{
        this.newFilterImg.push(item.url)
      })
      // this.newFilterImg.forEach((item,index)=>{
      //   this.takeImg.push(item.url)
      // })
      // //图片上传的数组
      // this.uploadImgList.forEach((item,index) => {
      //   this.takeImg.push(item)
      // })
      // console.log(this.takeImg,'takeImg')
      _this.record.image = _this.newFilterImg
      _this.record.image_pool = _this.deepCopy(_this.fileList)
      _this.visiblePic = false
      // console.log(_this.record,'结果')
    },
    Reselect() {
      // this.fileList.forEach((item, index) => {
      //   item.status = 0
      // })
      this.fileList = []
    },
    handleOk() {
      this.selectManageAll.forEach((item, index) => {
        this.dataList.forEach((items, indexs) => {
          if(item.sid === items.sid) {
            this.dataList.splice(indexs, 1)
          }
        })
      })
      this.$notification.success({
        message: '成功',
        description: '删除成功',
      });
      this.selectManageAll = []
      this.selectedRowKeys = []
      this.confirmLoading = true;
      setTimeout(() => {
        this.selectManageAll = []
        this.selectedRowKeys = []
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
    handleCancel(e) {
      // console.log('Clicked cancel button');
      this.visible = false;
    },
    editingAllCancel(){
      this.selectManageAll = []
      this.selectedRowKeys = []
      this.editingAll = false;
    },
    nextStep(ori){
      console.log('datacoll',this.datall,this.isClass)
      // console.log(this.isClass , this.datall.datacol[0].variant.length>0, this.datall.datacol[0].variant[0].value,'over')
      if(this.isClass){
        console.log(this.datall.datacol.length ,this.datall.datacol[0],'over')
        // if(this.datall.datacol.length > 0 && this.datall.datacol[0].variant && this.datall.datacol[0].variant.length>0 && this.datall.datacol[0].variant[0][ori].value.length>0){
        if(this.datall.datacol.length > 0 && this.datall.datacol[0].variant && this.datall.datacol[0].variant.length>0 ){
          this.subAttribute=true
          this.subAttributeText = '确认保存多属性'
        }else{
          this.$notification.error({
            message: '错误',
            description: '属性值或属性名未填写',
          });
        }
      }else{
        this.subAttribute=true
        this.subAttributeText = '确认保存多属性'
      }
    },
    AttributeOk(){
      let oldDataList = this.dataList
      console.log(this.datall,'this.datall6666')
      this.datall.datacol.forEach((item,index) =>{
        this.datall.datarow.forEach((itrow,inrow) =>{
          console.log('item',item,'itrow',itrow,'inrow')
          // console.log(item.variant[inrow]['zh'].name,item.variant[inrow]['zh'].name,itrow.name, itrow.prid)
          this.languageArr.forEach((languages,index)=>{
            item.variant[inrow][languages].name = itrow.name
            item.variant[inrow][languages].prid = itrow.prid
          })

        })
        if(item.sid == "0"){
          item.sid = '-' + (index+1)
          item.serialNumber = index + 1
        }
      })
      this.dataLL = this.deepCopy(this.datall.datarow)
      this.dataList = this.deepCopy(this.datall.datacol)
      this.resetSku()
      this.resetEanAll()
      this.subAttribute = false
      this.editingAll = false
      this.updateColumns()
      this.selectManageAll = []
      this.selectedRowKeys = []
    },
    AttributeCancel(){
      this.subAttribute=false
    },
    // 字典属性相关
    addRowAttribute(){
      // console.log(this.datall,'datall',this.datall.datarow[0].name)
      // console.log(this.datall.datarow.length,'length')
      if(this.datall.datarow.length>0){
        if(this.datall.datarow[0].name === 'color'){
          this.rows = {
            name: "size",
            prid: "0"
          }
        }else{
          this.rows = {
            name: "color",
            prid: "0"
          }
        }
      }else{
        this.rows = {
          name: "color",
          prid: "0"
        }
      }
      this.datall.datarow.push(this.rows)
      this.initdatall("row")
    },
    delRowAttribute(){
      this.datall.datarow.splice(this.RowAttribute.length-1,1)
      this.initdatall('del')
    },
    addColattribute(){
      var col = {
        battery_status: 0,
        country: "",
        ean: "",
        image: [],
        image_pool: [
          {
            uid: "",
            status: "",
            url: ""
          }
        ],
        variant: [
          {
            name: "",
            prid: "0",
            sid: "0",
            value: ""
          },
        ],
        ori_url: "",
        price: {
          "DE":"",
          "NL":"",
          "FR":"",
          "GB":"",
          "ES":"",
          "SE":"",
          "IT":"",
          "US":"",
          "CA":"",
          "MX":"",
          "AU":"",
          "JP":"",
          "PL":"",
        },
        profit: {
          "DE":"",
          "NL":"",
          "FR":"",
          "GB":"",
          "ES":"",
          "SE":"",
          "IT":"",
          "US":"",
          "CA":"",
          "MX":"",
          "AU":"",
          "JP":"",
          "PL":"",
        },
        freight:"",
        quantity: "45",
        sid: "0",
        sku: "",
        weight:{
          height: "",
          length: "",
          value_type: "",
          weight: "",
          width: "",
        }
      }
      var colVarant = {
        name: "",
        prid: "0",
        sid: "0",
        value: ""
      }
      //
      if(this.datall.datarow.length > 0){
        for(var i = 1;i < this.datall.datarow.length; i++){
          col.variant.push(colVarant)
        }
      }
      if(this.datall.datacol.length === 0){

      }else{
        col.battery_status = this.datall.datacol[0].battery_status
        col.ean = this.datall.datacol[0].ean
        col.image = this.datall.datacol[0].image
        col.image_pool = this.datall.datacol[0].image_pool
        col.ori_url = this.datall.datacol[0].ori_url
        col.quantity = this.datall.datacol[0].quantity
        col.sid = 0
        col.sku = this.datall.datacol[0].sku
        col.price = this.datall.datacol[0].price
        col.profit = this.datall.datacol[0].profit
        col.freight = this.datall.datacol[0].freight
        col.weight = this.datall.datacol[0].weight
      }
      this.datall.datacol.push(col)
      this.initdatall()
    },
    submits(){
      this.initdatall()
    },
    delColattribute(inx,item){
      this.datall.datacol.splice(inx,1)
      this.initdatall()
    },
    cancel() {
      this.$emit('commonSignOut');
    },
    saveData(type) {
      this.subloading = true
      let count = 0
      let arry = []
      this.dataList.forEach((item,index)=>{
        if(arry.indexOf(item.ean)!=-1){
          count++
        }else{
          arry.push(item.ean)
        }
      })
      if(count){
        this.subloading = false
        this.$notification.error({
          message: '失败',
          description: 'EAN值不能重复',
        });
        return
      }
      updateSku({
        // id:this.addNewProduct === 0 ? this.id : this.$store.state.tabStatus.goodsId,
        variant: this.dataList,
        id:this.id
      })
        .then(res => {
          if(res.code === 0) {
            this.subloading = false
            this.$store.commit('set_subTabthree',true)
            if(type === 'forbid'){
            }else{
              this.$notification.success({
                message: '提醒',
                description: res.msg,
              });
            }
          } if(res.code === 1) {
            this.subloading = false
            this.$store.commit('set_subTabthree',false)
            if(type === 'forbid'){
            }else{
              this.$notification.error({
                message: '失败',
                description: res.msg,
              });
            }
          }
        })
        .catch(res=>{
          console.log('asd')
          this.subloading = false
          this.$store.commit('set_subTabthree',false)
          if(type === 'forbid'){
          }else{
            this.$notification.error({
              message: '失败',
              description: '请求超时，请重试',
            });
          }
        })
    },
    // 翻译属性值
    translate(){
      this.translateLoading = true
      if(this.defaultSlate !=='1'){
        setTimeout(()=>{
          if(this.translateLoading === true ){
            this.$notification.error({
              message: '错误',
              description:'翻译出现错误',
            });
          }
          this.translateLoading = false
        },25000)
      }
      this.attributeOne = []
      this.attributeTow = []
      this.transMoney = 0
      this.transNumber = 0
      if(this.datall.datacol.length>0 && this.datall.datarow.length > 0){
        this.datall.datacol.forEach((item,index)=>{
          if(item.variant.length === 1){
            this.attributeOne.push(item.variant[0].value)
          }else{
            this.attributeOne.push(item.variant[0].value)
            this.attributeTow.push(item.variant[1].value)
          }
        })
        if(this.attributeOne.length>0){
          if(this.isNumber(this.attributeOne[0])){
            //是数字
          }else{
            this.attributeOneStr = this.attributeOne.join('^')
            //去翻译  如果是收费的
            if(this.defaultSlate === '1'){
              trans_fee({
                from:'zh',
                to: 'en',
                trans_type: 1,//1:谷歌翻译  3：谷歌免费翻译
                trans_obj: this.attributeOneStr
              }).then((res)=>{
                if(res.code === 0){
                  this.transMoney = (this.transMoney + parseFloat(res.data.money)).toFixed(2)
                  this.transNumber = this.transNumber + parseFloat(res.data.number)
                  // console.log(this.transMoney,this.transNumber)
                  this.transshow = true
                  this.translateLoading = false
                }else{
                  this.translateLoading = false
                  this.$notification.error({
                    message: '错误',
                    description:'翻译费用计算出现错误',
                  });
                }
              })
            }else{
              this.toTrans(this.attributeOneStr,0)
            }
          }
        }
        if(this.attributeTow.length>0){
          if(this.isNumber(this.attributeTow[0])){
            //是数字
          }else{
            this.attributeTowStr = this.attributeTow.join('^')
            if(this.defaultSlate === '1'){
              trans_fee({
                from:'zh',
                to: 'en',
                trans_type: 1,//1:谷歌翻译  3：谷歌免费翻译
                trans_obj: this.attributeTowStr
              }).then((res)=>{
                if(res.code === 0){
                  this.transMoney = (this.transMoney + parseFloat(res.data.money)).toFixed(2)
                  this.transNumber = this.transNumber + parseFloat(res.data.number)
                  // console.log(this.transMoney,this.transNumber)
                  this.transshow = true
                }else{
                  this.translateLoading = false
                  this.$notification.error({
                    message: '错误',
                    description:'翻译费用计算出现错误',
                  });
                }
              })
            }else{
              this.toTrans(this.attributeTowStr,1)
            }
          }
        }
      }else{
        this.translateLoading = false
        this.$notification.error({
          message: '错误',
          description: '缺少多属性值',
        });

      }
    },
    //关闭翻译弹窗
    transCancel(){
      this.transshow = false
      this.translateLoading = false
    },
    //校验数字
    isNumber(val){
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if(regPos.test(val) || regNeg.test(val)){
        return true;
      }else{
        return false;
      }
    },
    toTrans(q,leng){
      if(this.defaultSlate === '3'){
        //后端翻译
        trans({
          from:'zh-CHS',
          to:'en',
          q:q,
          platform:"amazon"
        }).then(res=>{
          if(res.code === 0){
            // console.log(res.data)
            this.fillInfo(res.data.en[0],leng,'3')
            this.translateLoading = false
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
          this.translateLoading = false
        })
      }else if(this.defaultSlate === '4'){
        //  插件翻译
        // auto , 到什么语言 ， 翻译的内容 ，国家/语言  ，index
        this.chromeToTrans('zh','en',q,leng)
      }
    },
    // 翻译的内容填充到相应的信息
    fillInfo(info,leng,type){
      // console.log(info,"info")
      this.tranInfo = []
      this.tranInfo = info.split('^')
      // console.log(this.tranInfo,'tranInfo')
      this.datall.datacol.forEach((item,index)=>{
        if(type === '3'){
          item.variant[leng].value =this.tranInfo[index]
        }else if(type === '4'){
          item.variant[leng].value =this.myTrim(this.tranInfo[index])
        }
      })
    },
    transOk(){
      const hide = this.$message.loading('扣费中', 0);
      if(this.attributeOneStr){
        // console.log('One')
        this.Chargetrans(this.attributeOneStr,0,hide)
      }
      if(this.attributeTowStr){
        // console.log("tow")
        this.Chargetrans(this.attributeTowStr,1,hide)
      }

    },
    // 收费翻译
    Chargetrans(q,leng,hide){
      //后端翻译
      trans({
        from:'zh-CHS',
        to:'en',
        q:q,
        trans_type:"1",
        platform:"amazon"
      }).then(res=>{
        if(res.code === 0){
          // console.log(res.data)
          this.fillInfo(res.data.en[0],leng,'3')
          this.translateLoading = false
          this.transshow = false
          if(hide){
            setTimeout(hide, 0);
          }
        }else{
          setTimeout(hide, 0);
          this.translateLoading = false
          this.transCancel()
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }

      })
    },
    // 翻译的方式
    SlateChange(val){
      Vue.ls.set('SLATE_TYPE',val);
    },
    // 去除空格
    myTrim(x) {
      console.log(x,'myTrim')
      return x.replace(/^\s+|\s+$/gm,'');
    },
    chromeToTrans(form,to,q,leng){
      // console.log(form,q,to,leng,'666')
      // lll
      let _this = this;
      let h = window.chrome;
      let targetExtensionId = _this.chromeCode; // 插件的ID
      let tk = _this.tokenFn(q);
      h && h.runtime && h.runtime.sendMessage ?
        window.chrome.runtime.sendMessage(targetExtensionId,{
          type: 'single',
          action:"detect",
        },function(response){
          if(response === "ok"){
            window.chrome.runtime.sendMessage(targetExtensionId,{
              action:"translate",
              transData:{
                sl:form,
                tl:to,
                tk:tk,
                q:encodeURI(q)
              }
            },function(response){
              if(response.state === "ok"){
                let ret = response.data[0];
                console.log(ret)
                let data = "";
                for (let i = 0; i < ret.length; i++) {
                  if (ret[i][0]) {
                    data += ret[i][0];
                  }
                }
                let resData = [];
                resData.push(data)
                console.log(resData,'resData',leng)
                _this.fillInfo(resData[0],leng,'4')
                _this.translateLoading = false;
              }else{
                _this.translateLoading  = false;
                _this.$notification.error({
                  message: '错误',
                  description: '插件通信失败',
                });
              }
            })
          }else{
            _this.translateLoading  = false;
            _this.$notification.error({
              message: '错误',
              description: '插件通信失败',
            });
          }
        }) : (console.log("插件未安裝"),_this.translateLoading  = false,this.$notification.error({message: '提醒',description: '插件未安装'}))
      //  lll
    },
    tokenFn(a){
      var k = "";
      var b = 406644;
      var b1 = 3293161072;
      var jd = ".";
      var sb = "+-a^+6";
      var Zb = "+-3^+b+-f";
      for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var m = a.charCodeAt(g);
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
          e[f++] = m >> 18 | 240,
          e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
          e[f++] = m >> 6 & 63 | 128),
          e[f++] = m & 63 | 128)
      }
      a = b;
      for (f = 0; f < e.length; f++)
        a += e[f],
          a = this.RL(a, sb);
      a = this.RL(a, Zb);
      a ^= b1 || 0;
      0 > a && (a = (a & 2147483647) + 2147483648);
      a %= 1E6;
      return a.toString() + jd + (a ^ b)
    },
    RL(a, b){
      var t = "a";
      var Yb = "+";
      for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2),
          d = d >= t ? d.charCodeAt(0) - 87 : Number(d),
          d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
        a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
      }
      return a
    },
    //变体图库 与图库交互
    addFileList(pic){
      this.fileList.forEach((item,index)=>{
        item.uid = index+1
      })
      let picObj = {
        uid:this.fileList.length+1 ,
        url:pic,
        status:1,
      }

      this.fileList.push(picObj);
      this.fileList = this.uniqueArray(this.fileList,'url')
      // console.log(this.fileList,'fileList')
    },
    //图库拉伸后更新左侧图片
    updateLeftImage(obj){
      console.log("执行了")
      this.galleryData = obj
      if(obj&&obj.length){
        obj.forEach((item,index)=>{
          this.fileList.forEach((itm,idx)=>{
            if(item.ori_url == itm.url){
              itm.url = item.new_url
            }
          })
        })
      }
      console.log(this.fileList,'更新')
    },
    //设置图库删除的图片数据
    setDeletePic(url){
      this.deletePic = url
      console.log(this.deletePic,'删除的图片')
      if(this.fileList.length){
        this.fileList.forEach((itm,idx)=>{
          if(url == itm.url){
            this.fileList.splice(idx,1);
          }
        })
      }
    },
    //过滤多余图片
    uniqueArray(arr,param) {
      // console.log(arr,'arr')
      if (Array.isArray(arr)) {
        let temp = [];
        let newArr = arr.reduce((acc, cur) => {
          if (temp.indexOf(cur[param]) === -1) {
            temp.push(cur[param]);
            acc.push(cur);
            return acc;
          } else {
            // console.log(acc);
            return acc;
          }
        }, []);
        // 可以用别的方法判断是否有重复，毕竟已经把重复的项过滤掉了
        let isDuplicate = newArr.length === arr.length;
        return newArr
      }
    },

    ToMeitu(picUrl){
      let uid = this.fileID
      // console.log(uid,'uid')
      this.M_URL={}
      this.M_URL.pic_URL = ''
      this.M_URL.file_ID = ''
      window.open(this.GLOBAL.BASE_URL+"beautify/index.html?url="+picUrl+"&index="+uid+'&type='+'2')
      Vue.ls.set("monitor_URL_Attribute",this.M_URL)
      const clearTime = setInterval(()=>{
        if(Vue.ls.get("monitor_URL_Attribute").file_ID){
          window.clearInterval(clearTime)
          // this.previewImage =  Vue.ls.get("monitor_URL_Attribute").pic_URL
          this.fileList.forEach((item,index)=>{
            if(item.uid == Vue.ls.get("monitor_URL_Attribute").file_ID){
              this.fileList[index].url = Vue.ls.get("monitor_URL_Attribute").pic_URL;
              // this.previewVisible = false
              // this.handleCancel()
              this.M_URL={}
              this.M_URL.pic_URL = ''
              this.M_URL.file_ID = ''
              Vue.ls.set("monitor_URL_Attribute",this.M_URL)
            }
          })
          this.fileID = Vue.ls.get("monitor_URL_Attribute").file_ID
        }
      },500)
    },
    stretchingPic(list,type){
      if(list.length>0){
        let data = []
        let arr = []
        for(var i=0;i<list.length;i+=5){
          data.push(list.slice(i,i+5));
        }
        this.stretchingLoading = true
        let num = 0
        data.forEach((item,index)=>{
          if(index == data.length-1){
            num = 1
          }
          this.changePicAll(item,num,type).then((res)=>{
            if(res){
              res.forEach((itm,idx)=>{
                arr.push(itm)
              })
            }
            return arr
          }).then((res)=>{
            if(arr.length == list.length){
              if(type ==="1"){
                this.fileList = arr
              }else{
                this.publicPic = arr
              }
            }
          })
        })

        // console.log('也执行了',list)
        // if(list.length > 5){
        //   this.changePicList(list,type)
        // }else{
        //   this.changePicAll(list,type)
        // }
      }
    },
    //  图片单个拉伸
    changePicList(fileList,type){
      var _this = this
      _this.stretchingLoading = true
      let picUrl = ''
      let arrurl = []
      for (let i = 0; i < fileList.length; i++) {
        (function(a,list) {
          // console.log(a,list,'ovee')
          setTimeout(function() {
            imgRessize({
              width:1600,
              height:1000,
              img_array:list.url,
              ids:list.uid
            }).then(res =>{
              if(res.code === 0){
                arrurl.push(res.data[0])
                if(type ==="1"){
                  _this.fileList = arrurl
                }else{
                  _this.publicPic = arrurl
                }
                // console.log(fileList.length ,i,'over')
                if(fileList.length-1 === a){
                  _this.stretchingLoading = false
                  _this.$notification.success({
                    message: '提醒',
                    description: res.msg,
                  });
                }
              }else{
                _this.stretchingLoading = false
              }
            })
          }, a*500); //500代表间隔
        })(i,fileList[i])
      }
    },
    //  一个请求多张拉伸
    changePicAll(fileList,num,type){
      // this.stretchingLoading = true
      let picUrl = ''
      let picId = ''
      fileList.forEach((item,index)=>{
        picUrl += (item.url + '^')
        picId += (item.uid + '^')
      })
      this.imgUrl = picUrl.slice(0,-1)
      this.imgId = picId.slice(0,-1)

      return imgRessize({
        width:1600,
        height:1600,
        ids:this.imgId,
        img_array:this.imgUrl
      }).then(res =>{
        if(res.code === 0){
          // console.log(res,'asd')
          // if(type ==="1"){
          //   this.fileList = res.data
          // }else{
          //   this.publicPic = res.data
          // }
          // this.stretchingLoading = false
          if(num){
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
            this.stretchingLoading = false
          }
          return res.data
        }else{
          if(num){
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
            this.stretchingLoading = false
          }
          return false
          // this.stretchingLoading = false
        }
      })
    },
    // 批量添加图片 一键拉伸
    imgResizeAll(){
      this.$refs.attrbuteImgs.changePic()
      setTimeout(()=>{
        this.stretchingPic(this.publicPic,"2")
      },2000)
    },
    onCheckChange(e){
      // console.log(e.target.checked)
      this.isClass = e.target.checked
      console.log("datacol",this.datall.datacol,'datarow',this.datall.datarow,'ColAttribute:',this.ColAttribute,'RowAttribute',this.RowAttribute)
      let col = this.datall.datacol[0]
      let row = this.datall.datacol[0]
      console.log(col,'col')
      if(this.isClass === false){
        console.log('切换单品属性',col)
        this.backupData.datacol = this.deepCopy(this.datall.datacol)
        this.backupData.datarow = this.deepCopy(this.datall.datarow)
        this.backupData.ColAttribute = this.deepCopy(this.ColAttribute)
        this.backupData.RowAttribute = this.deepCopy(this.RowAttribute)
        col.variant = col.variant.splice(0,1)
        col.variant[0].value = ''
        console.log(col,this.datall,'over')
        this.datall.datacol = []
        this.datall.datarow = []
        this.datall.datacol.push(col)
        this.datall.datarow.push(row)
        this.ColAttribute = [0]
        this.RowAttribute = [0]
        console.log(this.datall,'llllllllll')
      }else{
        console.log('切换变体属性')
        console.log(this.backupData)
        if(this.backupData.datacol){
          console.log('执行了')

          this.ColAttribute = this.deepCopy(this.backupData.ColAttribute)
          this.RowAttribute = this.deepCopy(this.backupData.RowAttribute)
          this.datall.datacol = this.deepCopy(this.backupData.datacol)
          this.datall.datarow = this.deepCopy(this.backupData.datarow)
        }else{
          console.log('--1')
        }
      }
    },
    // 网络图片
    showUpload(){
      this.showUploadBox = true
      console.log(this.showUploadBox)
    },
    hideUpload(){
      this.showUploadBox = false
      console.log(this.showUploadBox)
    },
    uploadNetwork(){
      this.NetworkInput = true
    },
    NetworkCancel(){
      this.NetworkInput = false
    },
    NetworkPicOk(){
      console.log(this.networkUrl)
      let reg = /\n/g
      var strs = new Array(); //定义一数组
      strs = this.networkUrl.split(reg)
      console.log(strs)

      strs.forEach((item,index)=>{
        let urlObj = {
          status: 0,
          uid: 0,
          url:"" ,
        }
        urlObj.uid = this.fileList.length+1
        urlObj.url = item
        this.fileList.push(urlObj)
      })
      console.log(this.fileList)
      this.NetworkInput = false
      this.networkUrl = ''
    },
    toDatall(data,isClass,ori){
      console.log(data,'datas')
      this.datall = data
      this.isClass = isClass
      console.log('更新了datall','并执行保存','isClass',isClass,"this.datall",this.datall)
      this.nextStep(ori)
    },
    delPrice(a,b,data){
      console.log(a,b,data)
      data.price[b] = ''
      data.profit[b] = ''
    }
  },
}
</script>
<style>
.upload-list-inline >>> .ant-upload-list-item {
  float: left;
  width: 100px;
  height: 100px;
  margin-right: 8px;
}
.ant-upload-list-picture .ant-upload-list-item, .ant-upload-list-picture-card .ant-upload-list-item {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  position: relative;
  width: 100px;
  height: 100px;
  float: left;
  margin-left: 10px;
}
.ant-upload-list-picture .ant-upload-list-item-thumbnail, .ant-upload-list-picture-card .ant-upload-list-item-thumbnail{
  width: 90px !important;
  height: 90px !important;
  position: absolute;
  top: 8px;
  left: 8px;
  text-align: center;
  line-height: 54px;
  font-size: 26px;
  opacity: 0.8;
}
.ant-upload-list-picture .ant-upload-list-item-thumbnail img, .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
  width: 80px !important;
  height: 80px !important;
}

</style>
<style lang="less" >
.mt{margin-top: 10px;}
.mr-sm{margin-right:10px;}
.ml-sm{margin-left:5px;}
.tac{
  text-align: center;
}
.center{
  margin:0 auto;
}
//网络图片上传
.upload-box{
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
  .upload-child-box{
    position: absolute;
    top: 0;
    left: 102px;
    width: 100px;
    height: 100px;

  }
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
.over-hidden {
  overflow: hidden;
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
  transition:all .5s;
  -moz-transition:all .5s;
  -webkit-transition:all .5s;
  -o-transition:all .5s;
}
.icon-zoom {
  cursor: pointer;
  position: absolute;
  top: 43%;
  right: 55%;
  font-size: 18px !important;
  color: white;
  display: none;
  font-size: 16px;
}
.icon-edit {
  cursor: pointer;
  position: absolute;
  top: 74%;
  right:24%;
  font-size: 18px !important;
  color: white;
  display: none;
  font-size: 16px;
}
.icon-close {
  cursor: pointer;
  position: absolute;
  top: 43%;
  right: 24%;
  color: white;
  display: none;
  font-size: 16px;
}
.icon-check {
  cursor: pointer;
  position: absolute;
  top: 25%;
  left: 30%;
  color: white;
  // display: none;
  font-size: 45px;
}
.icon-checkone {
  color:#24d039a6;
  display:block;
}


.image-box:hover .icon-check {
  display: block;
}
.image-box:hover .icon-close {
  display: block;
}
.image-box:hover .icon-zoom {
  display: block;
}
.image-box:hover .icon-edit {
  display: block;
}
.image-box:hover .mask-layer {
  opacity: 0.7;
}
.ant-upload-list-picture {
  display:none;
}
.dis-flex{
  display: flex;
  position: relative;
}
.flex-wrap{
  flex-wrap: wrap;
}
.dis-box{
  width: 100px;
  height: 18px;
  position: absolute;
  bottom: 0px;
  margin-top: -7px;
  // left: 0px;
  background: #515151;
  opacity: .8;
  border-bottom-left-radius:4px;
  border-bottom-right-radius:4px;
}
.btn-pic-box{
  padding-left: 0px;
  border: none;
  img{
    // margin-left: 10px;
    width: 100%;
  }
}
.btn-pic{
  margin-top:10px;
  img{
    margin-left: 10px;
    width: 100%;
  }
}
.mb{
  margin-button:10px;
}


</style>
