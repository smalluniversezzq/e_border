<template>
  <div>
    <!-- {{rowMerge}}
    {{colNum}} -->
    <a-row>
      <a-col :md="4" :lg="3" :xl="3" :xxl="2">
        <a-button type="primary" @click="editTypeHandle()">编辑多属性</a-button>
      </a-col>
      <a-col>
        <a-select defaultValue="计划售价" @change="handleChangeSelect" style="width:180px">
          <a-select-option v-model="item.id" v-for='(item,index) in storeSelect' :key='index'>{{item.title}}</a-select-option>
        </a-select>
        <div v-show="selectedID === 1" style="display: inline-block; margin-left:10px">
          <!-- <a-select placeholder='请选择国家1'  @change="handleChangeCountry" style="width:180px">
            <a-select-option v-model="item.title" v-for='(item,index) in countrySelect' :key='index'>{{item.value}}</a-select-option>
          </a-select> -->
          <!-- mode="multiple" -->
          <!-- :defaultValue="['a1', 'b2']" -->
          <a-select
            allowClear
            v-show="selectedID === 1"
            mode="tags"
            maxTagCount = 1
            style="width:180px"
            @change="handleChangeCountry"
            placeholder='请选择国家'
            v-model = 'countryMulitple'
          >
            <a-select-option  value="all">全部</a-select-option>
            <a-select-option v-if='selectedCountryAll === false' v-model="item.title" v-for='(item,index) in countrySelect' :key='index'>{{item.value}}</a-select-option>
          </a-select>

          <a-select placeholder='请选择模式' @change="handleChangeMode" style="width:180px">
            <a-select-option v-model="item.title" v-for='(item,index) in modeSelect' :key='index'>{{item.value}}</a-select-option>
          </a-select>
          
          <a-input v-model="costValue" :placeholder="costValueText" style="width:180px" type="number" :min="0" />
          <!-- :disabled ='costValueText=="当地货币"?true:false' -->
          <!-- <a-input  v-model="percentageValue" placeholder="运费" style="width:180px" type="number" :min="0" /> -->
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
          <!-- <a-checkbox @change="onChangeCheckbox">{{checkTitle}}</a-checkbox> -->
          <a-radio-group @change="onChangeCheckbox" v-model="battery_status">
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
        </div>
        <a-button type="primary" :loading='AttributeLoding' style="margin-left:10px" @click="confirm()">确认</a-button>
        <!-- <a-button type="danger" style="margin-left:10px" @click="batchDelet()">批量删除</a-button> -->
        <!-- <a-button type="primary" style="margin-left:10px" @click="reFresh()"><a-icon type="sync" /></a-button> -->
      </a-col>
    </a-row>
    <!-- <a-row class='mt'>
      <a-col>
        <a-button type="primary" @click="AddPictures()">批量添加变体图片</a-button>
      </a-col>
    </a-row> -->
    <a-row>
      <a-table
        v-show = 'showTab'
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
              <!-- <p>利润率计算规则为：售价=（成本）/（0.95-利润率,计算结果自动换算为当地货币</p>
              <p>加价倍计算规则为：售价=（成本价*加价倍）/ 0.95,计算结果自动换算为当地货币</p> -->
              <p>利润值计算规则为：售价=（成本价+利润值）/ 0.95,计算结果自动换算为当地货币</p>
              <p>自定义售价无需任何公式直接输入当地货币</p>
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>
        <span slot="profit">
          利润 
          <a-tooltip placement="right">
            <template slot="title">
              利润的计算公式为：利润=售价*0.95-成本
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>
        <span slot="customSKU"> 
          SKU
          <!-- <span @click='replaceSkuAll' style='color:#1890ff'>一键更换</span> -->
        </span>

        <template slot="serialNumber" slot-scope="text, record">
          <span>{{record.serialNumber}}</span>
        </template>
        <!-- <a-table-column
          title="序号"
          dataIndex="serialNumber"
          align="center"
          width="120px"
          fixed="left">
        </a-table-column> -->

        <!-- <a-table-column
          title="图片"
          align="center"
          width="170px"> -->
          <template slot="image" class='lll' slot-scope="text, record" style="display:flex; flex:wrap;">
            <!-- {{record }} -->
            <div class='dis-flex flex-wrap'>
              <div style="width:100px; height:110px; overflow:hidden; display:block;line-height:110px;">
                <a-popover placement="rightTop">
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
                      <img
                        v-else
                        style="width:100px; margin-left:-16px;margin-top:-2px"
                        :src="picAlt"
                        alt="暂无图片信息"/>
                    </a-button>
                  </a-popover>
              </div>
              <!-- {{single}} -->
              <div class='edit-bg' v-if='!single'>
                <div class='dis-box' @click="uploadPicHandle(record,record.serialNumber-1)" v-if='rowMerge.indexOf(record.serialNumber-1)!=-1'>
                  <a-icon  class='ioc' type="edit"  style="margin-left:5px;color:#fff;cursor:pointer;"/>  
                </div>
              </div>
              <div class='edit-bg' v-else>
                <div class='dis-box' @click="uploadPicHandle(record,record.serialNumber-1)" >
                  <a-icon  class='ioc' type="edit"  style="margin-left:5px;color:#fff;cursor:pointer;"/>  
                </div>
              </div>
           
            </div>
          </template>
        <!-- </a-table-column> -->

        <template slot="color" slot-scope="text, record">
          <template v-for="(item, index) in dataLL" v-if="item.name === 'color'">
            <template>
              <div v-for="(its, ids) in record.variant" :key="ids">
                <span v-if="its.name === item.name">{{its.value}}</span>
              </div>
            </template>
          </template>
        </template>
        <!-- <a-table-column
          v-for="(item, index) in dataLL"
          v-if="item.name === 'color'"
          title="颜色(color)"
          width="250px"
          align="center"
          :key='index'>
          <template slot-scope="text, record">
            <div v-for="(its, ids) in record.variant">
              <span v-if="its.name === item.name">{{its.value}}</span>
            </div>
          </template>
        </a-table-column> -->
        
        <template slot="size" slot-scope="text, record">
          <template v-for="(item, index) in dataLL" v-if="item.name === 'size'">
            <template>
              <div v-for="(its, ids) in record.variant" :key='ids'>
                <span v-if="its.name === item.name">{{its.value}}</span>
              </div>
            </template>
          </template>
        </template>
        <!-- <a-table-column
          v-for="(item, index) in dataLL"
          v-if="item.name === 'size'"
          title="尺寸(size)"
          width="250px"
          align="center"
          :key='index'>
          <template slot-scope="text, record">
            <div v-for="(its, ids) in record.variant" :key='ids'>
              <span v-if="its.name === item.name">{{its.value}}</span>
            </div>
          </template>
        </a-table-column> -->

        <!-- <a-table-column
          title="成本价(人民币)"
          width="130px"
          align="center"> -->
          <template slot="price1" slot-scope="text, record">
            <a-input v-model="record.price.CN" type="number"/>
          </template>
        <!-- </a-table-column> -->
      
        <!-- <a-table-column
          title="计划售价"
          width="130px"
          align="center"> -->
          <template slot="price2" slot-scope="text, record">
            <div v-for="(item, index) in record.price" :key='index'>
              <div v-for="(a, b) in countrySelect">
                <!-- <span v-if="index === 'CN' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}</span> -->
                <span v-if="index === 'MY' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'SG' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <!-- <span v-if="index === 'GB' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'ES' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'IT' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'US' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'CA' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'MX' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'AU' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'JP' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span> -->
              </div>
            </div>
          </template>
        <!-- </a-table-column> -->

        <!-- <a-table-column
          title="利润"
          width="130px"
          align="center"> -->
          <template slot="profit" slot-scope="text, record">
            <div v-for="(item, index) in record.profit" :key='index'>
              <div v-for="(a, b) in countrySelect">
                <!-- <span v-if="index === 'CN' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}</span> -->
                <span v-if="index === 'MY' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
                <span v-if="index === 'SG' && item && index === a.title">{{a.value}}:{{item}}{{a.logo}}  人民币:{{(item*exchangeCancel[index]).toFixed(2)}}￥</span>
              </div>
            </div>
          </template>
        <!-- </a-table-column> -->

         <!-- <a-table-column
          title="运费"
          width="100px"
          align="center"
          dataIndex="fare">
        </a-table-column> -->
        <template slot="freight" slot-scope="text, record">
          {{record.freight}}<span v-if="record.freight">￥</span>
        </template>

        <!-- <a-table-column
          title="库存"
          width="100px"
          align="center"> -->
          <template slot="inventory" slot-scope="text, record">
            <a-input v-model="record.inventory" type="number"/>
          </template>
        <!-- </a-table-column> -->

        <!-- <a-table-column
          title="SKU"
          width="270px"
          align="center"> -->
          <template slot="sku" slot-scope="text, record">
            <a-input v-model="record.sku" style="width:173px"/>
            <a-button @click="resetSku()">更换</a-button>
          </template>
        <!-- </a-table-column> -->

        <!-- <a-table-column
          title="EAN"
          width="270px"
          align="center"> -->
          <template slot="ean" slot-scope="text, record">
            <a-input v-model="record.ean" style="width:173px" />
            <a-button @click="resetEan(record)">更换</a-button>
          </template>
        <!-- </a-table-column> -->

        <!-- <a-table-column
          title="重量(g)"
          width="130px"
          align="center"> -->
          <template slot="weight" slot-scope="text, record">
            <a-input v-model="record.weight.weight" type="number"/>
          </template>
        <!-- </a-table-column> -->

        <!-- <a-table-column
          title="尺寸"
          width="320px"
          align="center"> -->
          <template slot="weights" slot-scope="text, record">
            长:<a-input v-model="record.weight.length" type="number" :min="0" style="width:70px" />
            宽:<a-input v-model="record.weight.width" type="number" :min="0" style="width:70px" />
            高:<a-input v-model="record.weight.height" type="number" :min="0" style="width:70px" />
          </template>
        <!-- </a-table-column> -->

        <!-- <a-table-column
          title="是否含电"
          align="center"> -->
          <template slot="battery_status" slot-scope="text, record">
            <a-radio-group v-model="record.battery_status">
              <a-radio value="1">是</a-radio>
              <a-radio value="0">否</a-radio>
            </a-radio-group>
            <!-- <a-checkbox v-if="record.battery_status == 0" @change="onChangeListA($event,record)"  :checked='false'>否</a-checkbox>
            <a-checkbox v-if="record.battery_status == 1" @change="onChangeListB($event,record)" :checked='true' :defaultChecked="true" >是</a-checkbox> -->
          </template>
        <!-- </a-table-column> -->

        <!-- <a-table-column
          title="操作"
          width="120px"
          fixed="right"
          align="center"> -->
          <template slot="action" slot-scope="text, record">
            <div>
              <a-row>
                <a-col>
                  <a-button type="danger" style="margin-left:10px" @click="deleteRow(record.sid)">删除</a-button>
                </a-col>
              </a-row>
            </div>
          </template>
        <!-- </a-table-column> -->
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
            <a-col offset='17'>
              <a-button  @click="ToMeitu(zoom_url)">在线美图</a-button>
            </a-col>
          </a-row>
        <!-- </div> -->
      </div>
    </a-modal>
    <a-modal 
      title="编辑变体图库"
      :maskClosable='false' 
      :visible="visiblePic" 
      @ok="handleOkPic" 
      :confirmLoading="confirmLoadingPic" 
      @cancel="handleCancelPic" 
      width='500px' 
      style='min-height:550px'>
      <template>
        <a-alert
          message="如图片在线美图打不开，请一键拉伸后再次进行操作"
          banner
          closable
        />
        <a-row class='mt'>
          <a-col span='12' v-show='false'>
            <a-card
            :style="{ display: 'inline-block', width: 'calc(99%)'}"
            title="变体图库"
            >
              <div class="clearfix">
                {{fileList}}
                <draggable
                  v-model="fileList"
                  :options="{ animation:200 }"
                  style="display: flex; flex-wrap: wrap; ">
                  <div class="image-box mr-sm" v-for="(item,index) in fileList" :key="index">
                    <div class='btn-pic-box' style="width:100%;height:100%;position:relative;overflow:hidden;padding:8px;box-sizing:border-box;">
                      <img
                        v-if='item'
                        style="width:100%;height:100%;display:block"
                        :src="item"
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
                <a-upload
                  :action="this.GLOBAL.BASE_URL+'api/b1/product/upload?token='+this.token"
                  listType="picture-card"
                  :multiple="true"
                  :fileList="fileList"
                  :defaultFileList="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                  class="upload-list-inline"
                >
                  <div>
                    <a-icon type="plus" />
                    <div class="ant-upload-text" >上传图片</div>
                  </div>
                </a-upload>
                <div class='mt'>
                  <a-button @click='stretchingPic(fileList,"1")' :loading='stretchingLoading'>一键拉伸图片</a-button>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col  span='24' >
            <a-card
              :style="{ display: 'inline-block', width: 'calc(99%)'}"
              title='商品图库'
            >
              <attrbuteImg v-if='visiblePic' :imgType='true' :allImg='true' ref='attrbuteImgs' @shopeeAddVariant='addFileList'/>
            </a-card>
          </a-col>
        </a-row>
      </template>

      <div>
        <a-button style="margin-top:10px;width:110px;" @click="Reselect()">重新选择</a-button>
      </div>
    </a-modal>
    <a-modal
      title="提示"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
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
      <a-from :from='form' layout="vertical" hideRequiredMark>  
        <!-- {{isClass}} -->
        <div class='mb'>
          <a-checkbox v-model='isClass' @change="onCheckChange">启用变体属性</a-checkbox>
          <span>{{isClass?"（如需单品商品，请取消勾选）":"（如需变体商品，请点击勾选）"}}</span>
        </div>
        <!-- v-show='isClass' -->
        <div  v-show='isClass' >
          <a-button :disabled='RowAttribute.length>1' @click='addRowAttribute()' >
            添加属性
          </a-button>
          <a-select class='ml' v-model='defaultSlate' @change='SlateChange' style="width: 150px"  >
            <a-select-option  value="1"  v-if='GLOBAL.translateType==1'>谷歌（收费） </a-select-option>
            <a-select-option  value="3" >谷歌（免费） </a-select-option>
            <a-select-option  value="4" >谷歌插件（免费） </a-select-option>
          </a-select>
          <a-button class='ml' :loading='translateLoading' @click='translate()'>
            翻译属性值
          </a-button>
          <a-card class='mt'>
            <div v-show = 'false'>
            {{'AttributeList:'}}
            {{AttributeList}}
            <br/>
            {{'RowAttribute'}}
            {{RowAttribute}}
            </br>
            {{'MainAttributeList'}}
            {{MainAttributeList}}
            </br>
            {{'SubAttributeList'}}
            {{SubAttributeList}}
            </br>
            {{MainAttributeList.length}}
            {{SubAttributeList.length}}
            {{SubAttributeList.length * MainAttributeList.length}}
            </div>
           <a-form-item
                label="属性名"
                :labelCol="{ md: {span:2}, lg: {span: 2}, xl: {span: 2} ,xxl:{span: 2} }"
                :wrapperCol="{ md: {span:20}, lg: {span: 20}, xl: {span: 20} ,xxl:{span: 20} }"
              >
              <a-row>
                <a-col span='8' class='mr' v-for='(item,index) in RowAttribute' :key='index'>
                  <a-select
                    :style="{ display: 'inline-block', width: 'calc(60% )' }"
                    placeholder='请选择属性名'
                    v-model='datall.datarow[index].name'
                  >
                    <a-select-option v-if='index === 0' value='color'>{{'color'}}</a-select-option >
                    <a-select-option v-if='index === 1' value='size'>{{'size'}}</a-select-option >
                  </a-select>
                   <a-button class='ml' @click='delRowAttribute(index,value)' :disabled='RowAttribute.length ===1' >删除属性</a-button>
                </a-col>
              </a-row>
              </a-form-item>
              <a-form-item
                label="属性值"
                :labelCol="{ md: {span:2}, lg: {span: 2}, xl: {span: 2} ,xxl:{span: 2} }"
                :wrapperCol="{ md: {span:20}, lg: {span: 20}, xl: {span: 20} ,xxl:{span: 20} }"
              >
              <a-row >
                <a-col span='8' class='mr'  v-for='(im,ix) in AttributeList'  :key='ix'>
                  <!-- {{im}}{{ix}} -->
                  <div v-for='(item,index) in im' :key='index'>
                    <a-input
                    v-model = 'im[index].value'
                    placeholder='请输入属性值' 
                    :style="{ display: 'inline-block', width: 'calc(60% )' }" @blur='checkAttribute(ix)'></a-input>
                    <a-button class='ml' @click='delAttribute(ix,index)'  icon="minus"> </a-button>
                  </div>
                  <!-- 分别显示 -->
                  <div>
                    <!-- {{ix}} -->
                    <a-button v-if='MainAttributeList.length<20' :style="{ display: 'inline-block', width: 'calc(60% )' }" class='tac' @click='addAttribute(ix)' icon="plus">
                    </a-button>
                  </div>
                  <!-- <div v-for="(rowIm,rowIx) in RowAttribute" :key='rowIx'>
                    {{rowIm}}{{ix}}{{'rowIx'}}{{rowIx}}
                    <div  v-if='rowIm===0 && ix ==="color"'>
                      <div v-if='(SubAttributeList.length * MainAttributeList.length)<50' >
                        <a-button v-if='MainAttributeList.length<20' :style="{ display: 'inline-block', width: 'calc(60% )' }" class='tac' @click='addAttribute(ix)' icon="plus">
                        </a-button>
                      </div>
                    </div>
                    <div  v-if='rowIm===1 && ix ==="size"'>
                      <div v-if='(SubAttributeList.length * MainAttributeList.length)<50' >
                        <a-button v-if='MainAttributeList.length<20' :style="{ display: 'inline-block', width: 'calc(60% )' }" class='tac' @click='addAttribute(ix)' icon="plus">
                        </a-button>
                      </div>
                    </div>
                  </div> -->
                </a-col>
              </a-row>
              </a-form-item>
          </a-card>
          </div>
        </a-from>
        <div
          :style="{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }"
        >
        <a-button :style="{marginRight: '8px'}" @click="editingAllCancel">退出</a-button>
        <!-- <a-button @click="sub" type="primary">submit</a-button> -->
        <a-button @click="nextStep" type="primary">提交</a-button>
      </div>
    </a-drawer>
    <a-modal
      title="保存多属性"
      :visible="subAttribute"
      @ok="AttributeOk"
      @cancel="AttributeCancel"
    >
      <p>{{subAttributeText}}</p>
    </a-modal>
    <a-modal
      title="确认翻译"
      :visible="transshow"
      @ok="transOk"
      @cancel="transCancel"
    >
      <p>{{'翻译'+transNumber+"个字符，需要花费"+transMoney+"元，确认翻译吗"}}</p>
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
import {get_base, getVariant, skuAddAttributes, getProperty, skuAlertAttributes, skuDeleteAttributes, getUpc, deleteSku, SkuPicture, upload, updateVariant, productCurrency , trans , trans_fee ,imgRessize ,updatePropertyValue,cutOutPic, transPic} from '@/api/collect'
import attrbuteImg from './shopeeAttrbuteImg'
import { key } from 'vuex'
  export default {
    name:"attributeInfo",
    components: {
      //调用组件
      draggable,
      attrbuteImg
    },
    props:[],
    data(){
      return{
        rowDel:[],
        colNum:[],
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
          // {
          //   value: '利润率',
          //   title: '利润率'
          // },
          {
            value: '利润值',
            title: '利润值'
          },
          // {
          //   value: '加价倍',
          //   title: '加价倍'
          // },
          {
            value:"自定义售价",
            title:"自定义售价"
          }
        ],
        AttributeLoding:false,
        mode: '',
        countrySelect:[
          {
            value: "马来西亚",
            title: "MY",
            logo: "MYR",
            type: 'MYR'
          },
          // {
          //   value: "新加坡",
          //   title: "SG",
          //   logo: "S$",
          //   type: 'SGD'
          // },
        ],
        storeSelect: [
          {id:1,title:'计划售价'},
          {id:2,title:'成本价'},
          {id:3,title:'重量'},
          {id:4,title:'库存'},
          {id:5,title:'尺寸'},
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
            // {
            //   uid: '',
            //   url: '',
            //   status: '',
            // }
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
            "MY":"",
            "SG":"",
            // "GB":"",
            // "ES":"",
            // "IT":"",
            // "US":"",
            // "CA":"",
            // "MX":"",
            // "AU":"",
            // "JP":"",
          },
          profit: {
            "MY":"",
            "SG":"",
            // "GB":"",
            // "ES":"",
            // "IT":"",
            // "US":"",
            // "CA":"",
            // "MX":"",
            // "AU":"",
            // "JP":"",
          },
          freight:"",
          inventory: "20",
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
          // {
          //   title: '运费',
          //   key: 'freight',
          //   align:'center',
          //   scopedSlots: { customRender: 'freight' },
          //   width:'100px'
          // },
          {
            title: '库存',
            key: 'inventory',
            align:'center',
            scopedSlots: { customRender: 'inventory' },
            width:'100px'
          },
          {
            key: 'sku',
            align:'center',
            slots: { title: 'customSKU' },
            scopedSlots: { customRender: 'sku' },
            width:'300px'
          },
          {
            title: '重量(g)',
            key: 'weight',
            align:'center',
            scopedSlots: { customRender: 'weight' },
            width:'130px'
          },
          {
            title: '尺寸',
            key: 'weights',
            align:'center',
            scopedSlots: { customRender: 'weights' },
            width:'320px'
          },
          // {
          //   title: '是否含电',
          //   key: 'battery_status',
          //   align:'center',
          //   scopedSlots: { customRender: 'battery_status' },
          //   width:'141px'
          // },
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
          // {
          //   title: '运费',
          //   key: 'freight',
          //   align:'center',
          //   scopedSlots: { customRender: 'freight' },
          //   width:'100px'
          // },
          {
            title: '库存',
            key: 'inventory',
            align:'center',
            scopedSlots: { customRender: 'inventory' },
            width:'100px'
          },
          {
            key: 'sku',
            align:'center',
            slots: { title: 'customSKU' },
            scopedSlots: { customRender: 'sku' },
            width:'300px'
          },
          {
            title: '重量(g)',
            key: 'weight',
            align:'center',
            scopedSlots: { customRender: 'weight' },
            width:'130px'
          },
          {
            title: '尺寸',
            key: 'weights',
            align:'center',
            scopedSlots: { customRender: 'weights' },
            width:'320px'
          },
          // {
          //   title: '是否含电',
          //   key: 'battery_status',
          //   align:'center',
          //   scopedSlots: { customRender: 'battery_status' },
          //   width:'141px'
          // },
          // {
          //   title: '操作',
          //   key: 'action',
          //   align:'center',
          //   scopedSlots: { customRender: 'action' },
          //   width:'120px'
          // },
        ],
        columnWidth:3020,
        exchangeCancel:{
          "MY":"",
          "SG":"",
          // "GB":"",
          // "ES":"",
          // "IT":"",
          // "US":"",
          // "CA":"",
          // "MX":"",
          // "AU":"",
          // "JP":"",
        },
        arrs:[],
        selectedCountryAll:false,
        countryMulitple:[],
        AddPicturesVisible:false,
        publicPic:[],
        allImg:false,
        isClass:false,
        rowMerge:[],
        AttributeList:[],
        SubAttributeList:[],
        MainAttributeList:[],
        backupsAttribute:[],
        picNum:'',
        manyAttribute:"",
        single:false,
        backupMainInfo: [ 0, 1 ] ,
        backupDataInfo:{ "color": [ { "prid": "0", "sid": "0", "value": "", "name": "color" } ], "size": [ { "prid": "0", "sid": "0", "value": "", "name": "size" } ] } ,
        showTab:false,
        // 限制超出
        PropertyNum:"",
        attributeNum:"",
        PropertyWarning:false,
        PropertyWarningInfo:"",
        PropertyWarningInfoOne:"",
        PropertyWarningInfoTow:"",
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
      }
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
      // handleOkSharePic(){
      //   console.log('图片',this.publicPic,'dataList',this.dataList,"selectedRowKeys",this.selectedRowKeys)
      //   this.dataList.forEach((item,index)=>{
      //     if(this.selectedRowKeys.indexOf(item.sid) != -1){
      //     let temporaryImage = item.image_pool
      //     item.image_pool = temporaryImage.concat(this.publicPic);
      //     // 过滤多余图片
      //     item.image_pool = this.uniqueArray(item.image_pool,'url');
      //       if(item.image.length < 1 && this.publicPic.length>0){
      //         item.image.push(this.publicPic[0].url)
      //       }
      //     }
      //   })
      //   console.log(this.dataList,'dataList')
      //   this.AddPicturesVisible = false
      //   this.publicPic = []
      //   console.log('批量添加图片')
      //   this.$refs.attrbuteImgs.updateImgContent()
      // },
      updateColumns(){
        console.log('执行')
        // row.length 1 2
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
          // scopedSlots:{customRender: 'color'},
          customRender: (text, row, index)=>{
            // console.log(text,row,index,)
            const obj = {
              children: text.variant[0].value,
              attrs: {},
            };
            
            if (this.rowDel.indexOf(index) !=-1) {
              obj.attrs.rowSpan = 0;
            }
            
            if (this.rowMerge.indexOf(index) !=-1) {
              obj.attrs.rowSpan = this.colNum;
            }
            return obj;
           },
          width:'250px'
        }
        let status1=0,status2=0
        console.log(this.dataLL.length,'this.dataLL.length',this.dataList)
        if(this.dataLL.length){
          this.dataLL.forEach((item,index)=>{
            if(item.name == 'color'){
                this.dataList.forEach((itm,idx)=>{
                  itm.variant.forEach((im,inx)=>{
                    if(im.name == item.name){
                      if(im.value){
                        console.log('llllllllll')
                        status1 = 1
                      }
                    }
                  })
                })
            }else if(item.name == 'size'){
              if(this.dataList.length){
                this.dataList.forEach((itm,idx)=>{
                  itm.variant.forEach((im,inx)=>{
                    if(im.name == item.name){
                      if(im.value){
                        status2 = 1
                      }
                    }
                  })
                })
              }
            }
          })
        }
        console.log(status1,status2,'over1111')
        if(status1&&!status2){
          this.columns.splice(2,0,color)
          this.columnWidth=2317
          // Vue.set(this.columns,2,color);
        }else if(!status1&&status2){
          this.columns.splice(2,0,size)
          this.columnWidth=2317
          // Vue.set(this.columns,2,size);
        }else if(status1&&status2){
          console.log('执行了')
          this.columns.splice(2,0,color,size)
          this.columnWidth=2610
        }
        //合并颜色规则
        this.MergerRules()
        setTimeout(()=>{
          this.dataListLoading = false
          this.showTab = true
        },300)
        
  
      },
      MergerRules(){
        //子属性 5
        console.log(this.dataList,'MergerRules',this.datall.datarow,'datarow')
        if(this.datall.datarow.length===2){
          this.rowMerge = []
          this.rowDel = []
          for(var i = 0;i<this.dataList.length+1;i++){
            if(i%this.colNum==0){
            this.rowMerge.push(i)
            }
          }
          for(var j = 0;j<this.dataList.length+1;j++){
            if(this.rowMerge.indexOf(j)==-1){
              this.rowDel.push(j)
            }
          }
          this.single = false
        }else if(this.datall.datarow.length===1){
          console.log('单品')
          // kkkkkkk
          this.rowMerge = []
          this.rowDel = []
          this.single = true
        }
        console.log(this.rowMerge,'rowMerge',"rowDel",this.rowDel,this.colNum)
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
        this.dataListLoading = true
        this.showTab = false
        getVariant({
          id: this.addNewProduct === 0 ? this.id : this.$store.state.tabStatus.goodsId,
        }).then(res => {
          if(res.code === 0) {
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
                this.$notification.success({
                  message: '提醒',
                  description: '图片更新成功',
                });

              }
            } else {
              if(JSON.stringify(res.data) == "{}"){
                res.data =[]
                this.dataList = res.data
                this.dataList.forEach((item, index) => {
                  item['serialNumber'] = index + 1
                })
                this.datall.datacol = this.deepCopy(this.dataList)
              }else{
                this.dataList = res.data
                console.log(res.data,'datalist')
                this.dataList.forEach((item, index) => {
                  item['serialNumber'] = index + 1
                  if(!item.profit){
                    item.profit = {"MY":"","SG":"",}
                  }
                  // item.profit = {"DE":"","FR":"","GB":"","ES":"","IT":"","US":"","CA":"","MX":"","AU":"","JP":"",}
                })
                this.datall.datacol = this.deepCopy(this.dataList)
              }
            }
            
            getProperty({
              pid: this.addNewProduct === 0 ? this.id : this.$store.state.tabStatus.goodsId,
            }).then(res => {
              if(res.code === 0){
                console.log(res,'res')
                // 判断data是否为空对象
                if(JSON.stringify(res.data) == "{}"){
                  res.data = []
                  this.dataLL = res.data
                  // this.datall.datarow = this.dataLL
                  this.datall.datarow = this.deepCopy(this.dataLL) 
                  console.log(this.datall,"ovee")
                  this.initdatall()
                }else{
                  this.dataLL = res.data
                  res.data.forEach((item,index)=>{
                    if(item.name ==='color'){
                      if(item.number === 0){
                        res.data.splice(index,1)
                      }
                    } 
                    if(item.name ==='size'){
                      this.colNum = item.number
                      if(item.number === 0){
                        res.data.splice(index,1)
                      }
                    } 
                  })
                  // this.datall.datarow = this.dataLL
                  this.datall.datarow = this.deepCopy(this.dataLL) 
                  console.log(this.datall,"ovee")
                  this.initdatall()
                  this.ifMaxAttribute(this.datall.datarow)
                }
                this.updateColumns()
              }
            })
            if(this.datall.datacol.length > 1 ){
              console.log('多属性',1,'ovee')
              this.isClass = true
            }else{
              if(this.datall.datacol[0].variant && this.datall.datacol[0].variant.length>0 && this.datall.datacol[0].variant[0].value.length>0){
                console.log('多属性',1,'ovee')
                this.isClass = true
              }else{
                console.log('单品',2,'ovee')
                this.isClass = false
              }
            }
            this.single = !this.isClass
          }
        })
      },
      ifMaxAttribute(info){
        this.PropertyWarning = false
        console.log(info,'overinfo')
        //变体数量：超出限制 | 限制50 | 当前数量：90
        // 属性值：超出限制| 限制20 | 当前数量：30
        this.PropertyWarningInfo=""
        this.PropertyWarningInfoOne=""
        this.PropertyWarningInfoTow=""
        if(info){
          if(info.length === 2){
            let maxNum = info[0].number*info[1].number
            console.log(maxNum)
            if(maxNum>50){
              console.log('超过50')
              this.PropertyWarning  = true
              this.PropertyNum = maxNum
              this.PropertyWarningInfoOne = '变体数量：超出限制 | 限制50 | 当前数量：' + this.PropertyNum
            }else{
              console.log('正常')
            }
            if(info[0].number>20 || info[1].number>20 ){
              console.log('属性值超出限制')
              this.PropertyWarning = true
              if(info[0].number>20){
                this.attributeNum = info[0].number
              }else if(info[1].number>20){
                this.attributeNum = info[1].number
              }
            this.PropertyWarningInfoTow = '属性值：超出限制| 限制20 | 当前数量：'+ this.attributeNum
            }else{
              console.log('属性值正常')
            }
          }else if(info.length === 1){
           let maxNum = info[0].number
            if(maxNum>50){
              console.log('超过50')
              this.PropertyWarning  = true
              this.PropertyNum = maxNum
              this.PropertyWarningInfoOne = '变体数量：超出限制 | 限制50 | 当前数量：' + this.PropertyNum
            }else{
              console.log('正常')
            }
            if(info[0].number>20 ){
              console.log('属性值超出限制')
              this.PropertyWarning = true
              this.attributeNum = info[0].number
              this.PropertyWarningInfoTow = '属性值：超出限制| 限制20 | 当前数量：'+ this.attributeNum
            }else{
              console.log('属性值正常')
            }
          }
          this.PropertyWarningInfo = this.PropertyWarningInfoOne+"\n"+this.PropertyWarningInfoTow
        }
        if(this.PropertyWarning){
          this.$notification.warning({
          message: '请注意',
          description:this.PropertyWarningInfo,
          duration:8,
            btn:h=>{
              return h(
                'a-button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => this.editTypeHandle(),
                  },
                },
              '修改属性值',
              )
            }
          });
        }
      },
      // 深拷贝
      
      deepCopy(obj){
        console.log('lll',obj)
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
        console.log(this.RowAttribute,'RowAttribute')
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
        this.PropertyWarning = false
        this.datall.datacol = this.deepCopy(this.dataList) 
        this.datall.datarow = this.deepCopy(this.dataLL) 
        this.initdatall()
        console.log(this.datall)

        // 虾皮属性
        this.SwitchShopeeAttributeFn()

      },
      SwitchShopeeAttributeFn(){
        this.AttributeList = {}
        this.MainAttributeList = []
        this.SubAttributeList = []
        this.datall.datacol.forEach((item,index)=>{
          if(item.variant.length===2){
            this.MainAttributeList.push(item.variant[0])
            this.SubAttributeList.push(item.variant[1])
          }else if(item.variant.length===1 && item.variant[0].name === 'color'){
            this.MainAttributeList.push(item.variant[0])
          }else if(item.variant.length===1 && item.variant[0].name === 'size'){
            this.SubAttributeList.push(item.variant[0])
          }
        })

        this.SubAttributeList = this.uniqueArray(this.SubAttributeList,'value')
        this.MainAttributeList = this.uniqueArray(this.MainAttributeList,'value')

        this.addArrayFn('single')
        console.log(this.SubAttributeList,this.MainAttributeList,'合并',)
        
        
      },
      // 数组去重
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
          let isDuplicate = newArr.length === arr.length;
          return newArr
        }
      },
      // 添加到大数组
      addArrayFn(type){
        //如果是单品
        if(type=='single'){
          if(this.MainAttributeList && this.SubAttributeList && this.SubAttributeList.length>0 && this.MainAttributeList.length>0){
            console.log('all')
            this.AttributeList.color = this.MainAttributeList
            this.AttributeList.size = this.SubAttributeList
          }else if(this.SubAttributeList && this.SubAttributeList.length>0){
             console.log('1')
            this.AttributeList.size = this.SubAttributeList
          }else if(this.MainAttributeList && this.MainAttributeList.length>0){
            console.log('2')
            this.AttributeList.color=this.MainAttributeList
          }
        }else{
          if(this.MainAttributeList && this.SubAttributeList){
            this.AttributeList.color = this.MainAttributeList
            this.AttributeList.size = this.SubAttributeList
          }else if(this.SubAttributeList){
            this.AttributeList.size = this.SubAttributeList
          }else if(this.MainAttributeList){
            this.AttributeList.color=this.MainAttributeList
          }
          console.log(this.AttributeList,this.SubAttributeList,this.MainAttributeList,'obob')
        }

      },
      //删除属性值
      delAttribute(type,index){
        if(type ==='color'){
          this.MainAttributeList.splice(index,1)
        }else{
          this.SubAttributeList.splice(index,1)
        }
        this.addArrayFn('single')
      },
      // 增加属性值
      addAttribute(type){
        console.log(type,this.MainAttributeList.length,this.SubAttributeList.length+1,'over')
        if((this.MainAttributeList.length*(this.SubAttributeList.length+1))<=50){
        console.log(type)
          if(type==='color'){
            let color = { 
              "prid": "0", 
              "sid": "0", 
              "value": "", 
              "name": "color" 
              }
            this.MainAttributeList.splice(this.MainAttributeList.length,0,color)
          }else{
            let size = { 
              "prid": "0", 
              "sid": "0", 
              "value": "", 
              "name": "size" 
              }
            this.SubAttributeList.splice(this.SubAttributeList.length,0,size)
            
          }
          console.log(this.datall,'this.datall')
          this.addArrayFn('single')
          }else{
            this.$notification.error({
              message: '提醒',
              description: '变体超过50个不能添加',
            }); 
          }
      },
      // 校验属性值是否相同
      checkAttribute(type){
        if(type==='color'){
          let colorVal = []
          this.AttributeList.color.forEach((item,index)=>{
            colorVal.push(item.value)
          })
          this.checkArr(colorVal,'color')
        }else{
          let colorVal = []
         this.AttributeList.size.forEach((item,index)=>{
            colorVal.push(item.value)
          })
          this.checkArr(colorVal,'size')
        }
      },
      // 判断值是否相同
      checkArr(ary,type){
        var nary=ary.sort();
        var colorTips = []
        var sizeTips = []
        for(var i=0;i<ary.length;i++){
          if (nary[i]==nary[i+1]){
              if(type === 'color'){
               colorTips.push(nary[i])
              }else if(type === "size"){
                sizeTips.push(nary[i])
              }
            //   this.$notification.error({
            //   message: '提醒',
            //   description: type+"属性值重复内容："+nary[i],
            // }); 
          }
        }
        console.log(colorTips,sizeTips,colorTips.length,sizeTips.length,'overs')
        if(colorTips.length>0){
          this.$notification.error({
            message: '提醒',
            description: 'color属性值重复内容'
          });
        }
          if(sizeTips.length>0){
          this.$notification.error({
            message: '提醒',
            description: 'size属性值重复内容'
          });
        }
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
            this.countryMulitple = ["MY","SG",]
            // this.countryMulitple = ["DE", "FR", "GB", "ES", "IT", "US", "MX", "CA", "AU", "JP"]
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
        // this.countrySelect.forEach((item, index) => {
        //   if(item.title === value) {
        //     this.currencyType = item.type
        //   }
        // })
        
        // this.getproductCurrency(value)
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

            // console.log(this.exchange,"this.exchange",this.exchange[v])
          }
        })
      },
      onChangeCheckbox(e) {
        // let status;
        // status = e.target.checked
        // console.log(status)
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
                item.inventory = this.numValue
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
        this.arrs.forEach((ParentItem,index)=>{
          if(ParentItem.title.length > 0 && this.mode.length > 0 && this.costValue.length > 0 ) {
            if(this.mode === '利润值') {
              let numA = (Number(this.costValue) + Number(this.percentageValue)) / 0.95 * Number(ParentItem.exchange).toFixed(2)
              if(isNaN(numA)) {
                this.$notification.error({
                  message: '失败',
                  description: '价格填写不完整',
                  duration: 3
                });
              } else {
                this.selectManageAll.forEach((item,index) => {
                  item.price[ParentItem.title] = ((Number(item.price.CN) + Number(this.costValue) + Number(this.percentageValue)) / 0.95 * Number(ParentItem.exchange)).toFixed(2)
                  let profitNum = item.price[ParentItem.title]
                  item.profit[ParentItem.title] = (profitNum*0.95 - Number(this.percentageValue) * Number(ParentItem.exchange) - Number(item.price.CN) * Number(ParentItem.exchange)).toFixed(2)
                  item.freight = Number(this.percentageValue)
                })
                // this.selectManageAll = []
                // this.selectedRowKeys = []
              }
            }
            if(this.mode === '加价倍') {
              let numB = (Number(this.costValue) + Number(this.percentageValue)) / 0.95 * Number(ParentItem.exchange).toFixed(2)
              if(isNaN(numB)) {
                this.$notification.error({
                  message: '失败',
                  description: '价格填写不完整',
                  duration: 3
                });
              } else {
                this.selectManageAll.forEach((item,index) => {
                  item.price[ParentItem.title] = ((Number(item.price.CN) * Number(this.costValue) + Number(this.percentageValue)) / 0.95 * Number(ParentItem.exchange)).toFixed(2)
                  let profitNum = item.price[ParentItem.title]
                  item.profit[ParentItem.title] = (profitNum*0.95 - Number(this.percentageValue) * Number(ParentItem.exchange) - Number(item.price.CN) * Number(ParentItem.exchange)).toFixed(2)
                  item.freight = Number(this.percentageValue)
                })
                // this.selectManageAll = []
                // this.selectedRowKeys = []
              }
            }
            if(this.mode === '利润率') {
              let num = Number(0.95 - Number(Number(this.costValue) / 100))
              let numC = (Number(this.percentageValue)) / Number( 0.95 - Number(Number(this.costValue) / 100) ) * Number(ParentItem.exchange).toFixed(2)
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
                    item.price[ParentItem.title] = ((Number(item.price.CN) + Number(this.percentageValue)) / Number( 0.95 - Number(Number(this.costValue) / 100) ) * Number(ParentItem.exchange)).toFixed(2)
                    let profitNum = item.price[ParentItem.title]
                    item.profit[ParentItem.title] = (profitNum*0.95 - Number(this.percentageValue) * Number(ParentItem.exchange) - Number(item.price.CN) * Number(ParentItem.exchange)).toFixed(2)
                    item.freight = Number(this.percentageValue)
                  })
                  // this.selectManageAll = []
                  // this.selectedRowKeys = []
                }
              }
            }
            if(this.mode === '自定义售价') {
              let numD = (Number(this.costValue))
              if(isNaN(numD)) {
                this.$notification.error({
                  message: '失败',
                  description: '价格填写不完整',
                  duration: 3
                });
              } else {
                this.selectManageAll.forEach((item,index) => {
                  item.price[ParentItem.title] = Number(this.costValue)
                  let profitNum = item.price[ParentItem.title]
                  item.profit[ParentItem.title] = (profitNum*0.95 - Number(this.percentageValue) * Number(ParentItem.exchange) - Number(item.price.CN) * Number(ParentItem.exchange)).toFixed(2)
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
      },
      resetSku(record) {
        let ranstr =  ["0","1","2","3","4","5","6","7","8","9","A","a","B","b","C","c","D","d","E","e","F","f","G","g","H","h","I","i","J","j","K","k","L","l","M","m","N","n","O","o","P","p","Q","q","R","r","S","s","T","t","U","u","V","v","W","w","X","x","Y","y",'Z',"z"]
        let result = "";
        let r = ''
        if(record === 1) {
          console.log('record1')
          for(var i = 0; i < 8; i++) {
            r = Math.floor(Math.random() * 62);
            result += ranstr[r];
          }
          // console.log(result,result.length,ranstr.length)
          this.dataListNew.forEach((item, index) => {
            item.sku = result + '-' + (index + 1)
          })
        } else {
          console.log('record2')
          for(var i = 0; i < 8; i++) {
            r = Math.floor(Math.random() * 62);
            result += ranstr[r];
          }
          // console.log(result,result.length,ranstr.length)
          this.dataList.forEach((item, index) => {
            item.sku = result + '-' + (index + 1)
          })
        }
      },
      replaceSkuAll(){
        console.log('lll')
        this.resetSku(2)
      },
      resetEan(record) {
        console.log(record,'record')
        if(record === 1) {
          getUpc({})
            .then(res => {
              if(res.code === 0) {
                this.dataListNew[0].ean = res.data.upc
              }
            })
        } else {
          getUpc({})
            .then(res => {
              if(res.code === 0) {
                record.ean = res.data.upc
              }
            })
        }
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
      uploadPicHandle(record,num) {
        let _this = this
        _this.picNum = num
        _this.record = record
        _this.fileList = _this.deepCopy(_this.record.image)
        //打开图库编辑前 请求总图库的图片
        _this.visiblePic = true
        console.log(_this.picNum,'picNum')
        // 保存图片

      },
      // 
      handleOkPic(e) {
        this.filterImg()
        this.$store.state.tabStatus.tabtwo = false
        this.$refs.attrbuteImgs.updateImgContent()
      },
      handleCancelPic(e) {
        // console.log('Clicked cancel button');
        this.visiblePic = false;
        this.selectImgList = []
        this.uploadImgList = []
        this.fileList = []
        // this.dataList.forEach((item, index) => {
        //   if(item.sid === this.record.sid) {
        //     item.image = this.record.image
        //     item.image_pool = this.record.image_pool
        //   }
        // })
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
        //  single 单品
        if(!this.single){
          console.log(this.fileList,this.uploadImgList)
          this.newFilterImg = []
          this.visiblePic = false
          let num = this.picNum+this.colNum
          let imgNum = []
          for(var i = this.picNum;i<num;i++ ){
            imgNum.push(i)
          }
          this.dataList.forEach((item,index)=>{
            if(imgNum.indexOf(index)!=-1){
              item.image=this.fileList
            }
          })
        }else{
          this.record.image = this.fileList
          this.visiblePic = false
        }
        
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
        this.editingAll = false;
      },
      nextStep(){
        if(this.isClass){
          console.log('datacoll',this.datall)
          this.manyAttribute = {
            attribute:"",
            pid:""
          }
          this.manyAttribute.attribute = this.AttributeList
          this.manyAttribute.pid = this.id
          console.log(this.manyAttribute,'manyAttribute')
          console.log(this.AttributeList,'love')
          var isColorValue = false,isSizeValue = false
          if(this.AttributeList.color && this.AttributeList.size){
            console.log('1')
            if(this.AttributeList.color.length == 0 && this.AttributeList.size.length == 0){
               console.log('1-1')
              isColorValue=true
              isSizeValue=true
            }else if(this.AttributeList.color.length == 0){
              console.log('1-2')
              isColorValue=true
            }else if(this.AttributeList.size.length == 0){
              console.log('1-3')
              isSizeValue = true 
            }else{
              console.log('1-4')
              if(this.AttributeList.color){
                this.AttributeList.color.forEach((item,index)=>{
                  if(!item.value){
                    isColorValue = true 
                  }
                })
              }
              if(this.AttributeList.size){
                this.AttributeList.size.forEach((item,index)=>{
                  if(!item.value){
                    isSizeValue = true 
                  }
                })
              }
            }
          }else{
            console.log('缺少属性值2')
            if(this.AttributeList.color){
              this.AttributeList.color.forEach((item,index)=>{
                if(!item.value){
                  isColorValue = true 
                }
              })
              if(this.AttributeList.color.length == 0){
                console.log('2-1-2')
                isColorValue=true
              }
            }
            if(this.AttributeList.size){
              this.AttributeList.size.forEach((item,index)=>{
                if(!item.value){
                  isSizeValue = true 
                }
              })
              if(this.AttributeList.size.length == 0){
                console.log('2-1-2')
                isSizeValue=true
              }
            }
          }
   
     
          console.log(isColorValue,isSizeValue,'color-size')
          if(isColorValue){
            this.$notification.error({
              message: '错误',
              description: 'color属性不能为空',
            });
          }else{
            if(isSizeValue){
              this.$notification.error({
                message: '错误',
                description: 'size属性不能为空',
              });
            }else{
              console.log('允许保存了')
              if(this.SubAttributeList.length * this.MainAttributeList.length <=50){
                this.subAttribute=true
                this.subAttributeText = '确认保存多属性'
                this.subType='1'
              }else{
                this.$notification.error({
                  message: '错误',
                  description: '变体超过50个不能保存',
                });
              }
            }
          }
        }else{
            this.subType='2'
            this.subAttribute=true
            this.subAttributeText = '确认保存多属性'
        }
      },
      updatePropertyValueFn(){
        console.log('变体提交',this.isClass)
        if(this.isClass){
          updatePropertyValue(this.manyAttribute).then(res=>{
            if(res.code === 0){
              this.subAttribute=false
              this.editingAll=false
              this.getSku()
              this.backupsAttribute = []
            }else{
              this.$notification.error({
                message: '错误',
                description: '多属性保存失败',
              });
            }
          })
        }else{
          var manyAttribute = {
            attribute:"",
            pid:""
          }
          manyAttribute.attribute = {
            color:[],
            size:[]
          }
          manyAttribute.pid = this.id
          updatePropertyValue(manyAttribute).then(res=>{
            if(res.code === 0){
              this.subAttribute=false
              this.editingAll=false
              this.getSku()
               this.backupsAttribute = []
            }else{
              this.$notification.error({
                message: '错误',
                description: '多属性保存失败',
              });
            }
          })
          // this.dataListLoading = true
          // this.showTab = false
          // setTimeout(()=>{
          //   this.dataListLoading = false
          //   this.showTab = true
          // },1000)
        }
      },
      AttributeOk(){
        if(this.subType === '1'){
          this.updatePropertyValueFn()
        }else{
          console.log('单品保存')
          this.updatePropertyValueFn()
        // let oldDataList = this.dataList
        // console.log(this.datall,'this.datall')
        // this.datall.datacol.forEach((item,index) =>{
        //   // console.log(item,'datacol')
        //   this.datall.datarow.forEach((itrow,inrow) =>{
        //     // console.log(itrow,'datarow')
        //     item.variant[inrow].name = itrow.name
        //     item.variant[inrow].prid = itrow.prid
        //   })
        //    if(item.sid == "0"){
        //     //  console.log(item.sid)
        //       item.sid = '-' + (index+1)
        //       item.serialNumber = index + 1
        //    }
        // })
        // console.log('6699')
        // this.dataLL = this.deepCopy(this.datall.datarow)
        // this.dataList = this.deepCopy(this.datall.datacol)
        // this.resetSku()     
        // for( let i = oldDataList.length; i < this.dataList.length; i++) {
        //   getUpc({})
        //     .then(res => {
        //       if(res.code === 0) {
        //         this.dataList[i].ean = res.data.upc
        //       }
        //     })
        //     // console.log(this.dataList[i])
        // }
        // this.subAttribute = false
        // this.editingAll = false
        // this.updateColumns()
        }
      },
      AttributeCancel(){
        this.subAttribute=false
      },
      onChangeCountry(e) {
        // console.log(this.countryValue)
      },
      // 字典属性相关
      addRowAttribute(){
        // console.log(this.datall,'datall',this.datall.datarow[0].name)
        // console.log(this.datall.datarow.length,'length')
        if(this.datall.datarow.length>0){
          if(this.datall.datarow[0].name === 'color'){
            console.log('size-1')
            this.rows = {
              name: "size",
              prid: "0"
            }
          this.AttributeList.size = this.backupsAttribute  
          this.SubAttributeList  = this.AttributeList.size
          }else{
            console.log('color-1')
            this.rows = {
              name: "color",
              prid: "0"
            }
            this.AttributeList.color = this.backupsAttribute 
            this.MainAttributeList = this.AttributeList.color
            this.$set(this.AttributeList,'color',this.backupsAttribute )
            this.orderObj()
          }
        }else{
          this.rows = {
            name: "color",
            prid: "0"
          }
          this.AttributeList.color = this.backupsAttribute 
          this.MainAttributeList = this.AttributeList.color  
        }
        // console.log(this.datall.datarow)
        if(this.rows.name==='color'){
          this.datall.datarow.splice(0,0,this.rows)
        }else{
          this.datall.datarow.push(this.rows)
        }
        
        this.initdatall("row")
      },
      //交换对象的位置
      orderObj(){
        let obj = {
            "color": this.AttributeList['color'],
            "size": this.AttributeList['size'],
          }
        this.AttributeList = obj
      },
      delRowAttribute(index){
        this.backupsAttribute = []
        console.log(index)
        let num = ''
        index===1?num='size':num='color'
        // console.log(this.RowAttribute.length,'ovee')
        this.datall.datarow.splice(index,1)
        // this.AttributeList.delect(num,1)
        this.backupsAttribute = this.AttributeList[num]
        delete this.AttributeList[num]
        index===1?this.SubAttributeList=[]:this.MainAttributeList=[]

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
            "MY":"",
            "SG":"",
          },
          profit: {
            "MY":"",
            "SG":"",
          },
          freight:"",
          inventory: "45",
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
        // console.log(this.datall.datacol)
        if(this.datall.datacol.length === 0){

        }else{
          col.battery_status = this.datall.datacol[0].battery_status
          col.ean = this.datall.datacol[0].ean
          col.image = this.datall.datacol[0].image
          col.image_pool = this.datall.datacol[0].image_pool
          col.ori_url = this.datall.datacol[0].ori_url
          col.inventory = this.datall.datacol[0].inventory
          col.sid = 0
          col.sku = this.datall.datacol[0].sku
          col.price = this.datall.datacol[0].price
          col.profit = this.datall.datacol[0].profit
          col.freight = this.datall.datacol[0].freight
          col.weight = this.datall.datacol[0].weight
        }
        this.datall.datacol.push(col)
        this.initdatall()
        // this.ColAttribute.push(this.ColAttribute.length+1)
        // console.log(this.ColAttribute)
      },
      submits(){
        this.initdatall()
      },
      // delColattribute(inx,item,items){
      //   console.log(this.ColAttribute,'index:',inx,'item:',item,'items',items)
      //   console.log(this.datall.datacol,'col')
      //   // this.datall.datacol.splice(inx,1)
      //   this.datall.datacol.forEach((im,ix)=>{
      //     if(inx === ix){
      //       this.datall.datacol[ix].variant.splice(items,1)
      //     }
      //   })
      //   console.log(this.datall.datacol,'lll')
      //   this.initdatall()
      // },
      cancel() {
        this.$emit('shopeeCommonSignOut');
      },
      saveData(type) {
        console.log(this.dataList)
        // console.log(this.$store.state.tabStatus.goodsId)
        this.subloading = true
        // let count = 0
        let arry = []
        // this.dataList.forEach((item,index)=>{
        //   if(arry.indexOf(item.ean)!=-1){
        //     count++
        //   }else{
        //     arry.push(item.ean)
        //   }
        // })
        // if(count){
        //   this.subloading = false
        //   this.$notification.error({
        //     message: '失败',
        //     description: 'EAN值不能重复',
        //   });
        //   return
        // }
        updateVariant({
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
        // console.log(this.datall,'datall')
          this.attributeOne = []
          this.attributeTow = []
          this.transMoney = 0
          this.transNumber = 0
        if(false){   
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
                console.log(this.attributeOneStr)
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
            // console.log(this.attributeOneStr,this.attributeTowStr,'str')
          }else{
            this.translateLoading = false
            this.$notification.error({
              message: '错误',
              description: '缺少多属性值',
            });
          }
        }
        if(this.AttributeList.color && this.AttributeList.size){
          if(this.AttributeList.color.length>0 && this.AttributeList.size.length>0 ){
            console.log('全部翻译')
            this.AttributeList.color.forEach((item,index)=>{
               this.attributeOne.push(item.value)
            })
            this.isNumFn(this.attributeOne,'color')
            this.AttributeList.size.forEach((item,index)=>{
               this.attributeTow.push(item.value)
            })
            this.isNumFn(this.attributeTow,'size')
          }else if(this.AttributeList.color.length>0){
            this.AttributeList.color.forEach((item,index)=>{
               this.attributeOne.push(item.value)
            })
            this.isNumFn(this.attributeOne,'color')
          }else if(this.AttributeList.size.length>0){
            this.AttributeList.size.forEach((item,index)=>{
               this.attributeTow.push(item.value)
            })
            this.isNumFn(this.attributeTow,'size')
          }else{
            console.log('不翻译')
            this.translateLoading = false
          }
        }else if(this.AttributeList.color){
          if(this.AttributeList.color.length>0){
            console.log('翻译color')
            this.AttributeList.color.forEach((item,index)=>{
               this.attributeOne.push(item.value)
            })
            this.isNumFn(this.attributeOne,'color')
          }else{
            console.log('不翻译')
            this.translateLoading = false
          }
        }else if(this.AttributeList.size){
          if(this.AttributeList.size.length>0){
            console.log('翻译size')
            this.AttributeList.size.forEach((item,index)=>{
               this.attributeTow.push(item.value)
            })
            this.isNumFn(this.attributeTow,'size')
          }else{
            console.log('不翻译')
            this.translateLoading = false
          }
        }else{
          this.translateLoading = false 
          this.$notification.error({
            message: '错误',
            description:'翻译费用计算出现错误',
          });
        }
        
      },
      //判断是否是存在数字  数组转字符串
      isNumFn(str,type){
        if(type === 'color'){
          if(this.isNumber(str[0])){
            //是数字
            this.$notification.error({
              message: '错误',
              description:'color属性值为数字，暂不翻译',
            });
            this.translateLoading = false 
          }else{
            this.attributeOneStr = str.join('^')
              //执行翻译
            this.shopeeTranslate(this.attributeOneStr,'color')
          }
        }
        if(type ==='size'){
          if(this.isNumber(str[0])){
            //是数字
            this.$notification.error({
              message: '错误',
              description:'size属性值为数字，暂不翻译',
            });
            this.translateLoading = false 
          }else{
            this.attributeTowStr = str.join('^')
              //执行翻译
            this.shopeeTranslate(this.attributeTowStr,'size')
          }
        }
      },
      shopeeTranslate(str,type){
        if(this.defaultSlate === '1'){
          trans_fee({
            from:'zh',
            to: 'en',
            trans_type: 1,//1:谷歌翻译  3：谷歌免费翻译
            trans_obj: str
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
          this.toTrans(str,type)
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
            platform:"shopee"
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
        console.log(info,"info",leng,type)
        this.tranInfo = []
        this.tranInfo = info.split('^')
        console.log(this.tranInfo)
        // console.log(this.tranInfo,'tranInfo')
          if(leng === 'color'){
            this.AttributeList.color.forEach((item,index)=>{
              console.log(item.index)
              item.value =this.tranInfo[index]
            })
              // item.variant[leng].value =this.tranInfo[index]
              this.MainAttributeList = this.AttributeList.color
          }
          if(leng === 'size'){
            this.AttributeList.size.forEach((item,index)=>{
              console.log(item.index)
              item.value = this.tranInfo[index]
            })
            this.SubAttributeList  = this.AttributeList.size
          }
          console.log(this.AttributeList.color)
          // 数组数据更新到数组
      },
      transOk(){
        const hide = this.$message.loading('扣费中', 0);
        if(this.attributeOneStr){
          // console.log('One')
          this.Chargetrans(this.attributeOneStr,'color',hide)
        }
        if(this.attributeTowStr){
          // console.log("tow")
          this.Chargetrans(this.attributeTowStr,'size',hide)
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
            platform:"shopee"
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
              let data = "";
              for (let i = 0; i < ret.length; i++) {
                if (ret[i][0]) {
                  data += ret[i][0];
                }
              }
              let resData = [];
              resData.push(data)
              // console.log(resData,'resData',leng)
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
        console.log(pic,'pic')
        this.$set(this.fileList,0,pic)
        // this.fileList[0] = pic;
        this.handleOkPic()

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
        window.open(this.GLOBAL.BASE_URLS+"beautify/index.html?url="+picUrl+"&index="+uid+'&type='+'2'+'&base_url='+this.GLOBAL.BASE_URL+'&token='+Vue.ls.get("Access-Token"))
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
          console.log('也执行了',list)
          if(list.length > 5){
            this.changePicList(list,type)
          }else{
            this.changePicAll(list,type)
          }
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
                width:1024,
                height:1024,
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
      changePicAll(fileList,type){
        this.stretchingLoading = true
        let picUrl = ''
        let picId = ''
        fileList.forEach((item,index)=>{
          picUrl += (item.url + '^')
          picId += (item.uid + '^')
        })
        this.imgUrl = picUrl.slice(0,-1)
        this.imgId = picId.slice(0,-1)
        
        imgRessize({
          width:1024,
          height:1024,
          ids:this.imgId,
          img_array:this.imgUrl
        }).then(res =>{
          if(res.code === 0){
            console.log(res,'asd')
            if(type ==="1"){
              this.fileList = res.data
            }else{
              this.publicPic = res.data
            }
            this.stretchingLoading = false
            this.$notification.success({
            message: '成功',
            description: res.msg,
            });
          }else{
            this.$notification.error({
            message: '错误',
            description: res.msg,
            });
            this.stretchingLoading = false
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
        console.log(this.datall.datacol,'ovee',this.datall.datarow,'ColAttribute:',this.ColAttribute,'RowAttribute',this.RowAttribute)
        let col = this.datall.datacol[0]
        let row = this.datall.datacol[0]
        console.log(col,'col')
        if(this.isClass === false){
         console.log('切换单品属性',col)
          this.backupDataInfo = this.deepCopy(this.AttributeList)
          this.backupMainInfo = this.deepCopy(this.RowAttribute)
          console.log('保存属性',this.backupDataInfo,this.backupMainInfo)
         
          this.backupData.datacol = this.deepCopy(this.datall.datacol)
          this.backupData.datarow = this.deepCopy(this.datall.datarow)
          this.backupData.ColAttribute = this.deepCopy(this.ColAttribute)
          this.backupData.RowAttribute = this.deepCopy(this.RowAttribute)
          // col.variant = col.variant.splice(0,1)
          // col.variant[0].value = ''
          // console.log(col,this.datall,'over')
          // this.datall.datacol = []
          // this.datall.datarow = []
          // this.datall.datacol.push(col)
          // this.datall.datarow.push(row)
          // this.ColAttribute = [0]
          // this.RowAttribute = [0]
          // 保存 变体属性
          console.log(this.AttributeList,'this.AttributeList2')
        }else{
           console.log('切换变体属性')
          console.log(this.backupDataInfo,this.backupMainInfo,'切换变体')
          // this.AttributeList = this.deepCopy(this.backupDataInfo)
          this.AttributeList=[]
          this.AttributeList = Object.assign(this.backupDataInfo)
          // this.$set(this.AttributeList,this.deepCopy(this.backupDataInfo))
          this.RowAttribute = this.deepCopy(this.backupMainInfo)
          this.backupMainInfo.forEach((item,index)=>{
            console.log(item,index,'iver')
            if(item===0){
              this.$set(this.AttributeList,'color',this.backupDataInfo.color)
            }
            if(item===1){
              this.$set(this.AttributeList,'size',this.backupDataInfo.size)
            }
          })
          console.log(this.AttributeList,this.RowAttribute,'切换至')
          Object.keys(this.AttributeList).forEach((item,index)=>{
            console.log(this.AttributeList[item][0].name)
            if(this.AttributeList[item][0].name==='color'){
              this.MainAttributeList = this.AttributeList[item]
            }
            if(this.AttributeList[item][0].name==='size'){
              this.SubAttributeList = this.AttributeList[item]
            }
          })
          // this.SubAttributeList
          // this.MainAttributeList
          console.log(this.MainAttributeList ,this.SubAttributeList,'qwe')
            this.datall.datarow = [
              {
              name: "color",
              prid: "0"
              },
              {
              name: "size",
              prid: "0"
              }
            ]
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
      }
    }
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
  .edit-bg{
    position: absolute;
    bottom: 0px;
    margin-top: -7px;
  }
  .dis-box{
    width: 100px;
    height: 18px;
   

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
