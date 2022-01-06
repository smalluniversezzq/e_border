<template>
  <div class="orderverify">
    <a-card>
      <a-button-group>
        <a-button
          :type='screenType ==="all" ? "primary":"default"'
          @click='screen("all",1)'
        >全部</a-button>
        <a-button
          :type='screenType ==="0" ? "primary":"default"'
          @click='screen("0",1)'
        >待审核{{dataStatus.status_0?"("+dataStatus.status_0+")":""}}</a-button>
        <a-button
          :type='screenType ==="1" ? "primary":"default"'
          @click='screen("1",1)'
        >待发货{{dataStatus.status_1?"("+dataStatus.status_1+")":""}}</a-button>
        <a-button
          :type='screenType ==="2" ? "primary":"default"'
          @click='screen("2",1)'
        >已发货{{dataStatus.status_2?"("+dataStatus.status_2+")":""}}</a-button>
        <a-button
          :type='screenType ==="3" ? "primary":"default"'
          @click='screen("3",1)'
        >已完成{{dataStatus.status_3?"("+dataStatus.status_3+")":""}}</a-button>
        <a-button
          :type='screenType ==="4" ? "primary":"default"'
          @click='screen("4",1)'
        >FBA订单{{dataStatus.status_10?"("+dataStatus.status_10+")":""}}</a-button>
        <a-button
          :type='screenType ==="5" ? "primary":"default"'
          @click='screen("5",1)'
        >已搁置{{dataStatus.status_4?"("+dataStatus.status_4+")":""}}</a-button>
      </a-button-group>
    </a-card>
    <a-card
      :bordered="false"
      title='筛选'>
      <div class="table-page-search-wrapper">
        <a-row
          type="flex"
          justify="start">
          <a-col
            class='title-size'
            :span='2'>
            店铺名称
          </a-col>
          <a-col
            :span='1.5'
            style="margin-right:20px">
            <a-button
              :type='storeId==="all"?"primary":"default"'
              size="small"
              @click='storeVal("all")'>
              全部
            </a-button>
          </a-col>
          <a-col :span='19'>
            <a-button
              :type='storeId===item.id?"primary":"default"'
              class='mr'
              v-for='(item,index) in myStore'
              :key='index'
              size="small"
              @click='storeVal(item.id)'
            >{{item.title}}</a-button>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          justify="start">
          <a-col
            class='title-size'
            :span='2'>
            国家
          </a-col>
          <a-col
            :span='1.5'
            style="margin-right:20px">
            <a-button
              :type='countryId==="all"?"primary":"default"'
              size="small"
              @click='countryVal("all")'
            >全部</a-button>
          </a-col>
          <a-col
            :span='19'>
            <a-button
              class='mr'
              :type='countryId===item.code?"primary":"default"'
              v-for='(item,index) in CountryList'
              :key="index"
              @click='countryVal(item.code)'
              size="small"
            >{{item.title}}</a-button>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          v-if="screenType==='1'"
          justify="start">
          <a-col
            class='title-size'
            :span='2'>
            是否经过ERP
          </a-col>
          <a-col :span='19'>
            <a-button
              :type='isErpId==="all"?"primary":"default"'
              class='mr'
              size="small"
              @click='isErpVal("all")'
            >全  部</a-button>
            <a-button
              :type='isErpId===0?"primary":"default"'
              class='mr'
              size="small"
              @click='isErpVal(0)'
            >未设置</a-button>
            <a-button
              :type='isErpId===1?"primary":"default"'
              class='mr'
              size="small"
              @click='isErpVal(1)'
            >经  过</a-button>
            <a-button
              :type='isErpId===2?"primary":"default"'
              class='mr'
              size="small"
              @click='isErpVal(2)'
            >不经过</a-button>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          v-if="screenType!=='0'"
          justify="start">
          <a-col
            class='title-size'
            :span='2'>
            物流公司
          </a-col>
          <a-col
            :span='2'
            style="margin-right:20px"
            v-show="logisticStatus1"
            @click="selectLogistics(1)">
            <a-button class="logistics_icon">
              <img
                style="width:90px; margin-left:-5px;margin-top:-5px"
                :src="DSFlogo"
                alt=""/>
              <!-- <p v-show="logisticSelectShow!=1" class="logistics_noselect"></p> -->
              <p v-show="logisticSelectShow==1" class="logistics_select">
                <i class="logistics_select1"></i>
                <a-icon class="logistics_select2" type="check"/>
              </p>
            </a-button>
          </a-col>
          <a-col
            :span='2'
            style="margin-right:20px"
            v-show="logisticStatus2"
            @click="selectLogistics(2)">
            <a-button class="logistics_icon">
              <img
                style="width:90px; margin-left:-5px;margin-top:-5px"
                :src="YWlogo"
                alt=""/>
              <!-- <p v-show="logisticSelectShow!=2" class="logistics_noselect"></p> -->
              <p v-show="logisticSelectShow==2" class="logistics_select">
                <i class="logistics_select1"></i>
                <a-icon class="logistics_select2" type="check"/>
              </p>
            </a-button>
          </a-col>
          <a-col
            :span='2'
            style="margin-right:20px"
            v-show="logisticStatus3"
            @click="selectLogistics(3)">
            <a-button class="logistics_icon">
              <img
                style="width:90px; margin-left:-5px;margin-top:-5px"
                :src="SFlogo"
                alt=""/>
              <!-- <p v-show="logisticSelectShow!=3" class="logistics_noselect"></p> -->
              <p v-show="logisticSelectShow==3" class="logistics_select">
                <i class="logistics_select1"></i>
                <a-icon class="logistics_select2" type="check"/>
              </p>
            </a-button>
          </a-col>
          <a-col
            :span='2'
            style="margin-right:20px"
            v-show="logisticStatus4"
            @click="selectLogistics(4)">
            <a-button class="logistics_icon">
              <img
                style="width:90px; margin-left:-5px;margin-top:-5px"
                :src="YTlogo"
                alt=""/>
              <!-- <p v-show="logisticSelectShow!=3" class="logistics_noselect"></p> -->
              <p v-show="logisticSelectShow==4" class="logistics_select">
                <i class="logistics_select1"></i>
                <a-icon class="logistics_select2" type="check"/>
              </p>
            </a-button>
          </a-col>
          <a-col
            :span='2'
            style="margin-right:20px"
            v-show="logisticStatus5"
            @click="selectLogistics(5)">
            <a-button class="logistics_icon">
              <img
                style="width:90px; margin-left:-5px;margin-top:-5px"
                :src="YZlogo"
                alt=""/>
              <!-- <p v-show="logisticSelectShow!=3" class="logistics_noselect"></p> -->
              <p v-show="logisticSelectShow==5" class="logistics_select">
                <i class="logistics_select1"></i>
                <a-icon class="logistics_select2" type="check"/>
              </p>
            </a-button>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          v-if="screenType==='1'"
          justify="start">
          <a-col
            class='title-size'
            :span='2'>
            国际运单号
          </a-col>
          <a-col :span='19'>
            <a-button
              :type='isWaybillId==="all"?"primary":"default"'
              class='mr'
              size="small"
              @click='isWaybillVal("all")'
            >全部</a-button>
            <a-button
              :type='isWaybillId===1?"primary":"default"'
              class='mr'
              size="small"
              @click='isWaybillVal(1)'
            >有运单号</a-button>
            <a-button
              :type='isWaybillId===0?"primary":"default"'
              class='mr'
              size="small"
              @click='isWaybillVal(0)'
            >无运单号</a-button>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          v-if="screenType!=='4'"
          justify="start">
          <a-col
            class='title-size'
            :span='2'>
            排序方式
          </a-col>
          <a-col :span='19'>
            <a-button
              :type='sortId==="pay_time"?"primary":"default"'
              class='mr'
              size="small"
              @click='changeSort("pay_time",sortStatus.pay_time.key,sortStatus.pay_time.type)'
            >
            按付款时间
              <a-icon v-if='sortStatus.pay_time.type' type="up" />
              <a-icon v-if='!sortStatus.pay_time.type' type="down" />
            </a-button>
            <a-button
              :type='sortId==="update_time"?"primary":"default"'
              class='mr'
              size="small"
              @click='changeSort("update_time",sortStatus.update_time.key,sortStatus.update_time.type)'
            >
            按更新时间
              <a-icon v-if='sortStatus.update_time.type' type="up" />
              <a-icon v-if='!sortStatus.update_time.type' type="down" />
            </a-button>
            <a-button
              :type='sortId==="sku"?"primary":"default"'
              class='mr'
              size="small"
              @click='changeSort("sku",sortStatus.sku.key,sortStatus.sku.type)'
            >按SKU排序
              <a-icon v-if='sortStatus.sku.type' type="up" />
              <a-icon v-if='!sortStatus.sku.type' type="down" />
            </a-button>
            <a-button
              v-if="screenType==='0'||screenType==='1'||screenType==='all'"
              :type='sortId==="send_time"?"primary":"default"'
              class='mr'
              size="small"
              @click='changeSort("send_time",sortStatus.send_time.key,sortStatus.send_time.type)'
            >按剩余发货时间
              <a-icon v-if='sortStatus.send_time.type' type="up" />
              <a-icon v-if='!sortStatus.send_time.type' type="down" />
            </a-button>
            <a-button
              :type='sortId==="amount"?"primary":"default"'
              class='mr'
              size="small"
              @click='changeSort("amount",sortStatus.amount.key,sortStatus.amount.type)'
            >按订单金额
              <a-icon v-if='sortStatus.amount.type' type="up" />
              <a-icon v-if='!sortStatus.amount.type' type="down" />
            </a-button>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          v-if="screenType==='5'"
          justify="start">
          <a-col
            class='title-size'
            :span='2'>
            订单状态
          </a-col>
          <a-col :span='19'>
            <a-button
              :type='orderStatus===1?"primary":"default"'
              class='mr'
              size="small"
              @click='changeOrderStatus(1)'
            >全部</a-button>
            <a-button
              :type='orderStatus===2?"primary":"default"'
              class='mr'
              size="small"
              @click='changeOrderStatus(2)'
            >待审核</a-button>
            <a-button
              :type='orderStatus===3?"primary":"default"'
              class='mr'
              size="small"
              @click='changeOrderStatus(3)'
            >待发货</a-button>
            <a-button
              :type='orderStatus===4?"primary":"default"'
              class='mr'
              size="small"
              @click='changeOrderStatus(4)'
            >已发货</a-button>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          justify="start">
          <a-col :span="2">
            <span>查询</span>
          </a-col>
          <a-col
            :md="11"
            :lg="7"
            :xl="6"
            :xxl="4">
            <a-input
              style="width:200px"
              v-model='queryParam.orderNumber'
              :placeholder="queryStatus"
            />
          </a-col>
          <a-col
            :md="7"
            :lg="8"
            :xl="10"
            :xxl="13">
            <span v-if="screenType!=='0'">选择物流:</span>
            <span v-show="!logisticSelectShow && screenType!=='0'" style="color:#1890ff">请先选择物流方式</span>
            <a-select
              v-show="logisticSelectShow && screenType!=='0'"
              :allowClear='true'
              class='ml'
              placeholder="请选择物流"
              style="width:210px"
              @change='logisticsChange'
              v-model='queryParam.logistics'>
              <a-select-option value="">{{'全部'}}</a-select-option>
              <a-select-option
                :value="item.channel_code"
                v-for='(item,index) in Channel'
                :key='index'>
                {{item.channel_name}}
              </a-select-option>
            </a-select>
            <a-button class='ml' @click='queryParamchange'>筛选</a-button>
            <a-button class='ml' @click='clearValue'>重置</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card
      :bordered="false"
      class='mt'
      title="订单列表">
      <a-row type='flex' justify='end' class='mb-sm' style='position:relateve'>
<!--        <div v-if="screenType==='all'" style='position:absolute;top:14px;right:250px'>-->
<!--          <a-date-picker-->
<!--            :disabledDate="disabledStartDate"-->
<!--            format="YYYY-MM-DD"-->
<!--            v-model="startValue"-->
<!--            placeholder="开始时间"-->
<!--            @change="onChange"-->
<!--            @openChange="handleStartOpenChange"-->
<!--          />-->
<!--          至-->
<!--          <a-date-picker-->
<!--            :disabledDate="disabledEndDate"-->
<!--            format="YYYY-MM-DD"-->
<!--            placeholder="结束时间"-->
<!--            v-model="endValue"-->
<!--            :open="endOpen"-->
<!--            @change="onChange"-->
<!--            @openChange="handleEndOpenChange"-->
<!--          />-->
<!--        </div>-->
<!--        <a-button  style='position:absolute;top:14px;right:150px' v-if="screenType==='all' || screenType==='0' " class='ml' @click='orderExport()'>-->
<!--          订单导出-->
<!--        </a-button>-->
        <a-button  style='position:absolute;top:14px;right:30px' v-if="screenType==='all' || screenType==='0' " class='ml' @click='orderSync()'>
          订单同步
        </a-button>
      </a-row>
      <a-row>
        <a-col
          :md="8"
          :lg="9"
          :xl="9"
          :xxl='9'>
        </a-col>
        <a-col
          :md="{ offset: 2, span: 14 }"
          :lg="{ offset: 5, span: 10 }"
          :xl="{ offset: 5, span: 10 }"
          :xxl="{ offset: 7, span: 8 }"
          class='dis-flex justify-end'
          >
          <a-button  @click="clearanceTemplate()">报关模板</a-button>
          <a-dropdown  v-if='screenType == "0" || screenType == "1" || screenType == "2" || screenType == "5"' >
            <a-button class='ml' type="primary"  >批量操作 <a-icon type="down" /></a-button>
            <a-menu slot="overlay">
              <!-- 待发货 -->
              <a-menu-item v-if='screenType === "1"' key="6" @click='batchOperation(6)'>设置国内单号</a-menu-item>
              <!-- 待审核  -->
              <a-menu-item v-if='screenType === "1" || screenType === "2"' key="5" @click='batchOperation(5)'>设置国际物流</a-menu-item>
              <!-- 待审核  -->
              <!-- <a-menu-item v-if='screenType === "0" || screenType === "1" ' key="1" @click='batchOperation(1)'>批量虚拟发货</a-menu-item> -->
              <!-- 待审核  -->
              <a-menu-item v-if='screenType === "0"'  key="2" @click='batchOperation(2)'>批量设置报关</a-menu-item>
              <!-- 待审核  -->
              <a-menu-item v-if='screenType === "0" || screenType === "1"  || screenType === "2"' key="3" @click='batchOperation(3)'>批量标记</a-menu-item>
              <!-- 待审核  -->
              <a-menu-item v-if='screenType === "0"' key="4" @click='batchOperation(4)'>批量修改收件人信息</a-menu-item>
              <!-- 待发货 -->
              <!-- <a-menu-item v-if='screenType === "1"' key="7" @click='batchOperation(7)'>批量设置国内物流</a-menu-item> -->
              <!-- 已发货 -->
              <!-- <a-menu-item v-if='screenType === "2"' key="8" @click='batchOperation(8)'>批量更换国内物流</a-menu-item> -->
              <!-- 待发货 已发货-->
              <a-menu-item v-if='screenType === "1" || screenType === "2"' key="10" @click='batchOperation(9)'>打回待审核</a-menu-item>
              <!-- 待审核  待发货 已发货-->
              <a-menu-item v-if='screenType === "0" || screenType === "1" || screenType === "2"' key="11" @click='batchOperation(10)'>移入搁置</a-menu-item>
              <!-- 已搁置 -->
              <a-menu-item v-if='screenType === "5"' key="12" @click='batchOperation(11)'>批量还原</a-menu-item>
              <!-- 已搁置 -->
              <a-menu-item v-if='screenType === "5"' key="13" @click='batchOperation(12)'>批量删除</a-menu-item>
              <!-- 批量设置报关模板 -->
              <a-menu-item  key="14" @click='batchOperation(13)'>批量设置报关模板</a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-button class='ml'
            v-if='screenType === "all"'
            @click='toAuditedAllFn()'
            >
            批量移入待审核
          </a-button>
          <a-button
            class='ml'
            v-if='screenType === "0" || screenType === "1"'
            @click='batchOperation(1)'>
            虚拟发货
          </a-button>
          <a-button
            class='ml'
            v-if='hasPerm(permsBtn.amazon_add_order)'
            v-show="screenType==='0'"
            @click='addNewList()'>
            新增订单
          </a-button>
          <a-button
            class='ml'
            v-if='hasPerm(permsBtn.order_examineAll)'
            v-show='Examine === true'
            @click='examineAll()'
            :loading="examineLoading">
            批量审核
          </a-button>
          <a-button
            class='ml'
            v-show='screenType === "1"'
            @click='applyOrderNum()'>
            申请国际单号
          </a-button>
          <a-button
            v-if='hasPerm(permsBtn.order_goodsOutAll)'
            class='ml'
            v-show='codeAll === true'
            @click='suball()'>
            批量发货
          </a-button>
          <a-button v-if="screenType==='2'" @click="markComplete" class='ml'>
            标记已完成
          </a-button>
        </a-col>
        <!-- <a-col :offset='Examine === true?"0":"1"'  :md="3" :lg="3" :xl="3" :xxl="2">
        </a-col> -->
        <!-- <a-col :md="2">
          <a-button @click='jumpTo()'>新增订单</a-button>
        </a-col> -->
      </a-row>
      <!-- //列表 -->
      <a-row class='mt'>
        <a-table
          :scroll="{ x: 1800 }"
          :dataSource="data"
          :rowSelection="rowSelection"
          :pagination="false"
          :loading="listLoading"
          rowKey="id">
          <a-table-column
            fixed="left"
            title="订单编号"
            width="200px">
            <template slot-scope="text, record">
              <div v-if='record.color_mark.length>0'>
                <div v-if='!(record.color_mark[0].type == 0 && record.color_mark[1].type == 0  && record.color_mark[2].type == 0 && record.color_mark[3].type == 0 && record.color_mark[4].type == 0 && record.color_mark[5].type == 0)'  class='flex flex-state'>
                  <div v-for='(item,index) in record.color_mark' @click='tabSetingColor(record.id)' :key='index'>
                    <div class='mr-sm' v-if='item.type == 1'>
                      <a-tooltip placement="top" >
                        <template slot="title">
                          <span>{{item.name}}</span>
                        </template>
                        <div :style='{backgroundColor:item.color,width: "20px",height: "20px",marginTop:"5px"}'></div>
                      </a-tooltip>
                    </div>
                  </div>
                </div>
                <div v-else @click='tabSetingColor(record.id)'>
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>设置自定义标记</span>
                    </template>
                    <div :style='{backgroundColor:"#8a8a8a",width: "20px",height: "20px",marginTop:"5px"}'></div>
                  </a-tooltip>
                </div>
              </div>
              <div v-else @click='tabSetingColor(record.id)'>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>设置自定义标记</span>
                  </template>
                  <div :style='{backgroundColor:"#8a8a8a",width: "20px",height: "20px",marginTop:"5px"}'></div>
                </a-tooltip>
              </div>
              <a-popover placement="top">
                <template slot="content">
                  订单备注：{{record.remark}}
                </template>
                <a type="link" @click='details(record.id)'>{{record.order_id}}</a>
              </a-popover>
              <div v-if='record.product_count'>
                  订单内商品数量:
                <span>{{record.product_count}}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="店铺/操作人"
            width="150px">
            <template slot-scope="text, record">
              <div class='min-txt'>
                {{record.shop_name}}
              </div>
              <div class='min-txt'>
                {{record.username}}
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="图片"
            width='150px'
            >
            <template slot-scope="text, record">
              <a-popover
                v-show="record.order_image"
                placement="rightTop">
                <template
                  slot="content"
                  style="width:200px">
                  <img
                    style="width:200px"
                    :src="record.order_image"
                    alt="">
                </template>
                <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                  <img
                    style="width:100px; margin-left:-16px;margin-top:-2px"
                    :src="record.order_image"
                    alt="暂无订单信息"
                    @click="jumpToOrderUrl(record.ori_url)"/>
                </a-button>
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column
            title="订单金额"
            width='180px'>
            <template slot-scope="text, record">
              <div
                v-for='(item,index) in currencyList'
                :key='index'>
                <p v-if='item.id === record.country_code'>
                  <span>
                    {{record.amount +'('+ item.logo}}
                  </span>
                  <span>
                    {{item.title}})
                  </span>
                  <span v-if='countrysCode.indexOf(record.country_code) < 0'>
                    {{record.country_code}})
                  </span>
                </p>
              </div>
            </template>
          </a-table-column>
          <a-table-column
          title="时间"
          width='250px'
          >
            <template slot-scope="text, record">
              <p>购买时间:{{record.purchase_date}}</p>
              <p>更新时间:{{record.last_update_date}}</p>
            </template>
          </a-table-column>
          <a-table-column
            title="物流方式"
            width="200px">
            <template slot-scope="text, record">
              <div>
                <a-row style="overflow:hidden">
                  <a-col style="float:left">
                    <div v-if="Array.isArray(record.logistics_channel) && record.logistics_channel.length">
                      <div v-for="(item,index) in record.logistics_channel" :key="index">
                        <div v-html="item.replace(/\r?\n/g, '<br />')"></div>
                      </div>
                    </div>
                    <div v-if="Array.isArray(record.logistics_channel) && !record.logistics_channel.length">
                      待获取
                    </div>
                  </a-col>
                  <a-col style="float:left;margin-left:5px">
                    <a-icon
                      class='cursor'
                      v-if='hasPerm(permsBtn.order_editLogistics)'
                      v-show='(record.status === "0" || record.status === "1") && record.amazon_ship!==1 && record.out_stock!==1'
                      @click='editeLogistic(record)'
                      type="edit"
                      theme="twoTone"/>
                  </a-col>
                </a-row>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="运单号"
            dataIndex="waybillcode">
            <template slot-scope='text, record'>
              <div>
                <div style="overflow:hidden">
                  <div style="width:60px;float:left">
                    物流单号:
                  </div>
                  <div style="float:left" v-if="record.logistics_channel_code.length">
                    <p style="margin-bottom:5px" v-for="(item,index) in record.logistics_channel_code"  @mouseout='getInfo(record.id,"2",item)' :key="index">
                      {{item}}
                      <a-popover
                        trigger="hover"
                        placement="leftTop">
                        <template slot="content">
                          <a-timeline style='width:500px'>
                            <a-timeline-item
                              v-for='(item,index) in ExpressInfo'
                              :color="index === 0 ? 'green':'blue'"
                              :key='index'
                            >
                            {{item.time}}&nbsp;&nbsp;{{item.context}}
                            </a-timeline-item>
                          </a-timeline>
                        </template>
                        <a-icon type="car" />
                      </a-popover>
                    </p>
                  </div>
                </div>
                <div style="overflow:hidden">
                  <div style="width:60px;float:left">
                    备注单号:
                  </div>
                  <div style="float:left" v-if="record.inland_info.length">
                    <p style="margin-bottom:5px" v-for="(item,index) in record.inland_info"  @mouseout='getInfo(record.id,"1",item)' :key="index">{{item}}
                      <a-popover
                        trigger="hover"
                        placement="leftTop">
                        <template slot="content">
                          <a-timeline style='width:500px'>
                            <a-timeline-item
                              v-for='(item,index) in RemarksInfo'
                              :color="index === 0 ? 'green':'blue'"
                              :key='index'
                            >{{item.time}}&nbsp;&nbsp;{{item.context}}</a-timeline-item>
                          </a-timeline>
                        </template>
                        <a-icon type="car" />
                      </a-popover>
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="状态"
            width='150px'
            >
            <template slot-scope="text, record">
              <div v-if='record.task_status === "-1"'>
                <span>获取单号失败</span>
                <a-popover title="获取单号失败"  >
                  <template slot="content" >
                    <div class='alert-box' >
                      <a-alert class='mb' v-if='record.error_message' :message='record.error_message' type="warning" style='width:400px;' />
                    </div>
                  </template>
                  <a-icon class='ml-sm' type="question-circle"/>
                </a-popover>
              </div>
              <div v-if='record.is_checked=="0" && record.amazon_ship==0 && record.is_fba!="1"'>
                <div v-if='record.status =="20"'>
                  等待付款
                </div>
                <!-- virtual 1 虚拟绿色   virtual2 虚拟黄色 -->
                <div v-if='record.status !="20"'>
                  <div v-if="getOrderStatus(record.earliest_ship_date)>0"  class='dis-flexs flex-wraps justift-state tal'>
                    <span>待审核</span>
                    <i v-if='record.virtual===1' class='sprite-pic-success'></i>
                    <a-tooltip placement="bottom" v-else-if='record.virtual===2'>
                      <template slot="title">
                        <span>{{record.virtual_message}}</span>
                      </template>
                      <i  class='sprite-pic-warning'></i>
                    </a-tooltip>
                    <span style="color:red" v-if='record.virtual!==1'>{{'(请在'+getOrderDate(record.earliest_ship_date)+'前发货)'}}</span>
                  </div>
                  <div v-if="getOrderStatus(record.earliest_ship_date)<=0" class='dis-flexs flex-wraps justift-state'>
                    <span>待审核</span>
                    <i  v-if='record.virtual===1' class='sprite-pic-success'></i>
                    <a-tooltip placement="bottom" v-else-if='record.virtual===2'>
                      <template slot="title">
                        <span>{{record.virtual_message}}</span>
                      </template>
                      <i  class='sprite-pic-warning'></i>
                    </a-tooltip>
                    <span style="color:red" v-if='record.virtual!==1'>(请在{{getOrderDate(record.earliest_ship_date)}}前发货)</span>
                  </div>
                </div>
              </div>
              <div v-if='record.is_checked=="0" && record.amazon_ship==1 && record.is_fba!="1"'>
                <div>
                  已发货
                  <i v-if='record.virtual===1' class='sprite-pic-success'></i>
                  <a-tooltip placement="bottom" v-else-if='record.virtual===2'>
                    <template slot="title">
                      <span>{{record.virtual_message}}</span>
                    </template>
                    <i  class='sprite-pic-warning'></i>
                  </a-tooltip>
                  <span style="color:red">(该订单已在亚马逊发货，如仍需操作请点击移入待审核)</span>
                </div>
              </div>
              <div v-if='record.is_checked!="0"'>
                <div v-if='record.remark ' class='dis-flexs flex-wraps'>
                  <span>{{record.order_status}}</span>
                  <i v-if='record.virtual===1' class='sprite-pic-success'></i>
                  <a-tooltip placement="bottom" v-else-if='record.virtual===2'>
                    <template slot="title">
                      <span>{{record.virtual_message}}</span>
                    </template>
                    <i  class='sprite-pic-warning'></i>
                  </a-tooltip>
                  <span class='txt-red'>{{'('+record.remark+')'}}</span>
                </div>
                <div v-else class='dis-flexs flex-wraps'>
                  <span>{{record.order_status}}</span>
                  <i v-if='record.virtual===1' class='sprite-pic-success'></i>
                  <a-tooltip placement="bottom" v-else-if='record.virtual===2'>
                    <template slot="title">
                      <span>{{record.virtual_message}}</span>
                    </template>
                    <i  class='sprite-pic-warning'></i>
                  </a-tooltip>
                </div>
              </div>

            </template>
          </a-table-column>
          <a-table-column
            title="操作"
            width="260px">
            <template slot-scope="text, record">
              <span>
                <a-button
                  :disabled='!hasPerm(permsBtn.order_details)'
                  class='mt-sm '
                  type='primary'
                  @click='details(record.id)'
                >订单详情</a-button>
                <a-button class='ml mt-sm' v-if='record.is_checked=="0" && record.amazon_ship==1 && record.is_fba!="1"&&screenType === "all"' @click='toAudited(record.id)'>移入待审核</a-button>
                <a-popover
                  title="提醒"
                  v-show='record.status==="1" && record.is_checked ==="1"'
                >
                  <template slot="content">
                    <p>中转仓未收到货前，提前把亚马逊订单变成发货状态</p>
                  </template>
                </a-popover>
              </span>
            </template>
          </a-table-column>
        </a-table>
      </a-row>
      <a-modal
        title="提示"
        :visible="modalTS"
        @ok="TSOk"
        :maskClosable=false
        :confirmLoading="TSLoading"
        @cancel="TSCancel"
        width='450px'>
        <div class='tac'>
          <p>请前往→订单详情→报关信息，填写报关重量！</p>
        </div>
      </a-modal>
      <a-modal
        title="选择物流"
        :visible="modals"
        :confirmLoading="modalsLoading"
        :maskClosable=false
        @cancel="EXCancel"
        width='560px'>
        <template slot="footer">
          <a-button key="back" @click="EXCancel">取消</a-button>
        </template>
        <div class='dis-flex'>
          <a-button @click='openInternational()'>填写国际单号</a-button>
          <a-button @click='openDomestic()' class='ml'>填写国内单号</a-button>
        </div>
      </a-modal>
      <a-modal
        width='800px'
        title="填写国际物流信息"
        :visible="showInternational"
        :maskClosable='false'
        :footer="null"
        @cancel="cancelInternational">
        <a-card :bordered="false">
          <internationalView
          v-if='ifInternational'
          :orderID="orderID"
          @cancelInternational='cancelInternational()'
          :Channel='Channel'
          :openInternationalState='openInternationalState'
          @returnInternational='returnInternational()'>
          </internationalView>
        </a-card>
      </a-modal>
      <a-modal
        width='1200px'
        title="填写国内物流信息"
        :visible="showDomestic"
        :maskClosable='false'
        @cancel="cancelDomestic"
        :footer="null">
        <a-card :bordered="false">
          <domesticView
          v-if='ifDomestic'
          @cancelDomestic='cancelDomestic()'
          :orderID="orderID"
          :Channel='Channel'
          :openDomesticState='openDomesticState'
          :logisInfo='logisInfo'
          :country_code_param='country_code_param'
          :orderWeight="orderWeight"
          :battery_status='battery_status'
          @returnDomestic='returnDomestic()'>
          </domesticView>
        </a-card>
      </a-modal>
      <a-modal
        title="删除"
        :visible="visible"
        @ok="handleOk"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel">
        <p>{{ModalText}}</p>
      </a-modal>
      <a-modal
        title="选择物流方式"
        :visible="getcodeshow"
        @ok="getcodeOk"
        :confirmLoading="getcodeLoading"
        @cancel="getcodeCancel">
        <a-form-item
          label="当前物流"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <span>{{CurrentLogistics}}</span>
        </a-form-item>
        <a-form-item
          label="物流名称"
          :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
          :wrapperCol="{ lg: { span: 18 }, sm: { span: 18 } }"
        >
          <a-select
            style="width: 100%"
            @change="handleChange"
          >
            <a-select-option
              :value="index"
              v-for='(item,index) in logisInfo'
              :key='index'
            >{{item}} </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="物流单号"
          :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
          :wrapperCol="{ lg: { span: 18 }, sm: { span: 18 } }"
        >
          <a-input
            v-model='code'
            :rows="4"
          ></a-input>
        </a-form-item>
      </a-modal>
      <a-row
        v-if='data'
        class='mt'
        type="flex"
        justify="end">
        <a-col>
          <a-pagination
            v-model="current"
            @change='pagechange'
            :pageSize='page.pageSize'
            :total='(page.pageSize*page.lastPage)'/>
        </a-col>
      </a-row>
    </a-card>
    <a-modal
      title="修改订单标记"
      :visible="TabColor"
      :confirm-loading="TabColorLoading"
      @ok="TabColorOk"
      @cancel="TabColorCancel"
      :width='750'
      :maskClosable = 'false'
      >
      <div>
        <a-table
        :columns="columns"
        :data-source="colorData"
        :pagination='false'
        bordered>
          <template
            v-for="col in ['name', 'color']"
            :slot="col"
            slot-scope="text, record, index"
          >
            <div v-if="col === 'name'" :key="col">
              <a-input
                maxLength=20
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeName(e.target.value, record.key, col,e)"
                placeholder='请输入描述信息'
              />
              <template v-else>
                <span v-if='text'>
                  {{ text }}
                </span>
                <span v-else>
                  {{'无描述'}}
                </span>

              </template>
            </div>
            <div v-if="col === 'color'" :key="col">
              <template >
                <div :style='{backgroundColor:text,width: "20px",height: "20px",marginTop:"5px"}'></div>
              </template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(record.key)">保存</a>
                 &nbsp;&nbsp;
                <a @click="() => use(record.key)">{{record.type==1?"已使用":"未使用"}}</a>
              </span>
              <span v-else>
                <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
                 &nbsp;&nbsp;
                <a @click="() => use(record.key)">{{record.type==1?"已使用":"未使用"}}</a>
              </span>
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>
    <!-- 批量订单标记 -->
    <a-modal
      title="批量修改订单标记"
      :visible="TabColorAll"
      :confirm-loading="TabColorAllLoading"
      @ok="TabColorAllOk"
      @cancel="TabColorAllCancel"
      :width='750'
      :maskClosable = 'false'
      >
      <div>
        <a-table
        :columns="columns"
        :data-source="colorDataAll"
        :pagination='false'
        bordered>
          <template
            v-for="col in ['name', 'color']"
            :slot="col"
            slot-scope="text, record,"
          >
            <div v-if="col === 'name'" :key="col">
              <a-input
                maxLength=20
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeNameAll(e.target.value, record.key, col,e)"
                placeholder='请输入描述信息'
              />
              <template v-else>
                <span v-if='text'>
                  {{ text }}
                </span>
                <span v-else>
                  {{'无描述'}}
                </span>

              </template>
            </div>
            <div v-if="col === 'color'" :key="col">
              <template >
                <div :style='{backgroundColor:text,width: "20px",height: "20px",marginTop:"5px"}'></div>
              </template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => saveAll(record.key)">保存</a>
                 &nbsp;&nbsp;
                <a @click="() => useAll(record.key)">{{record.type==1?"已使用":"未使用"}}</a>
              </span>
              <span v-else>
                <a :disabled="editingKey !== ''" @click="() => editAll(record.key)">编辑</a>
                 &nbsp;&nbsp;
                <a @click="() => useAll(record.key)">{{record.type==1?"已使用":"未使用"}}</a>
              </span>
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>
    <a-modal
      title="批量修改收货人信息"
      :maskClosable=false
      :visible="editConsigneeInfoVisible"
      @ok="editConsigneeInfoOk"
      :confirmLoading="editConsigneeInfoLoading"
      @cancel="editConsigneeInfoCancel"
      width='950px'
      >
      <!-- {{consigneeData}} -->
      <div v-if='consigneeData' v-for='(item,index) in consigneeData' :key='index'>
        <a-row>
          <a-col class='order-code-color ml mb'>{{item.order_id}}</a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="收件人"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
            <a-input
            v-model='consigneeData[index].Name'
            :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
            </a-form-item>
          </a-col>
            <a-col  :span="8">
              <a-form-item
                label="手机号"
                :labelCol="{span:8}"
                :wrapperCol="{span:16}"
              >
                <a-input
                  v-model='consigneeData[index].Phone'
                  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
              </a-form-item>
            </a-col>
            <a-col  :span="8">
              <a-form-item
                label="邮编"
                :labelCol="{span:8}"
                :wrapperCol="{span:16}"
              >
                <a-input
                  v-model='consigneeData[index].PostalCode'
                  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
              </a-form-item>
            </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="国家"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-select
              disabled
              v-model='consigneeData[index].CountryCode'
              :default-value="consigneeData[index].CountryCode"
              :style="{ display: 'inline-block', width: 'calc(85% )' }"
              @change="handleChange"
              >
                <a-select-option
                  :value="it.id"
                  v-for='(it,inx) in currencyList'
                  :key='inx'>
                  {{it.title}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
            <a-col  :span="8">
            <a-form-item
              label="州或省"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input
              v-model='consigneeData[index].StateOrRegion'
                :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
            </a-col>
            <a-col  :span="8">
            <a-form-item
              label="地区"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input
              v-model='consigneeData[index].District'
                :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
            </a-col>
        </a-row>
        <a-row>
          <a-col  :span="8">
            <a-form-item
              label="县"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input
              v-model='consigneeData[index].County'
                  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
            </a-col>
            <a-col  :span="8">
              <a-form-item
                label="城市"
                :labelCol="{span:8}"
                :wrapperCol="{span:16}"
              >
                <a-input
                v-model='consigneeData[index].City'
                :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
              </a-form-item>
            </a-col>
        </a-row>
        <a-row>
          <a-col  :span="8">
            <a-form-item
              label="详细地址1"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input
                v-model='consigneeData[index].AddressLine1'
                :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
            <a-col  :span="8">
              <a-form-item
                label="详细地址2"
                :labelCol="{span:8}"
                :wrapperCol="{span:16}"
              >
                <a-input
                  v-model='consigneeData[index].AddressLine2'
                  :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
              </a-form-item>
            </a-col>
            <a-col  :span="8">
              <a-form-item
                label="详细地址3"
                :labelCol="{span:8}"
                :wrapperCol="{span:16}"
              >
                <a-input
                v-model='consigneeData[index].AddressLine3'
                :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
              </a-form-item>
            </a-col>
        </a-row>
        <a-divider />
      </div>
    </a-modal>
    <a-modal
      title="批量设置国内单号"
      :maskClosable=false
      :visible="setDocNoVisible"
      @ok="setDocNoOk"
      :confirmLoading="setDocNoLoading"
      @cancel="setDocNoCancel"
      width='1250px'
      >
      <div>
        <edit-domesticno ref='eventEditDomesticNo' @closeEdit="closeEdit" :tableData='tableData' :logisticsList='logisInfo'></edit-domesticno>
      </div>
     </a-modal>
    <!-- 批量报关 -->
    <a-modal
      title="批量设置报关"
      :visible="customsVisible"
      @ok="customsOk"
      @cancel="customsCancel"
      width='1200px'>
      <!-- {{customsData}} -->
      <a-table
        :dataSource="customsData"
        :pagination="false"
        rowKey="id">
        <a-table-column
          title="图片">
          <template slot-scope="text, record">
            <img
              style="width:60px"
              :src="record.image"
              alt="">
          </template>
        </a-table-column>
        <a-table-column
          title="标题">
          <template slot-scope="text, record">
            {{record.title}}
          </template>
        </a-table-column>
        <a-table-column
          title="中文名称">
          <template slot-scope="text, record">
            <a-input v-model="record.cnName" style="width:100px"/>
          </template>
        </a-table-column>
        <a-table-column
          title="英文名称">
          <template slot-scope="text, record">
            <a-input v-model="record.enName" style="width:100px"/>
          </template>
        </a-table-column>
        <a-table-column
          title="申报金额(usd)">
          <template slot-scope="text, record">
            <a-input v-model="record.usd" style="width:100px"/>
          </template>
        </a-table-column>
        <a-table-column
          title="报关重量(g)">
          <template slot-scope="text, record">
            <a-input v-model="record.weight" style="width:100px"/>
          </template>
        </a-table-column>
        <a-table-column
          title="商品类型">
          <template slot-scope="text, record">
            <a-input v-model="record.type" style="width:100px"/>
        </template>
        </a-table-column>
        <a-table-column
          title="商品描述">
          <template slot-scope="text, record">
            <a-input v-model="record.desc" style="width:100px"/>
          </template>
        </a-table-column>
        <a-table-column
          title="是否含电">
          <template slot-scope="text, record">
            <a-radio-group v-model="record.battery_status">
              <a-radio :value="1">
                是
              </a-radio>
              <a-radio :value="0">
                否
              </a-radio>
            </a-radio-group>
          </template>
        </a-table-column>
      </a-table>
    </a-modal>
    <!-- 批量编辑物流 -->
    <a-modal
      v-if="logisticsVisible"
      title="批量设置国际物流"
      :visible="logisticsVisible"
      @ok="logisticsOk"
      @cancel="logisticsCancel"
      width='1000px'>
      <a-checkbox @change="isPassERP" :checked="isPassERPValue" :disabled="LogisticsInfo[0].warehouse?true:false">
        不经ERP官方仓库发货（直接填写国际单号）
      </a-checkbox>
      <a-row
        class='mt'
        type="flex"
        v-show="!isPassERPValue"
        justify="start">
        <a-col
          class='title-size'
          :span='3'
          style="line-height: 46px">
          选择物流公司:
        </a-col>

        <a-col :span='21'>
          <a-row type='flex' justify='start' >
            <a-col
              :span='4'
              style="margin-right:20px"
              v-show='logisticStatus1'
              @click="selectLogistics1(1)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="DSFlogo"
                  alt=""/>
                <p v-show="logisticSelectShow1==1" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
            <a-col
              :span='4'
              style="margin-right:20px"
              v-show='logisticStatus2'
              @click="selectLogistics1(2)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="YWlogo"
                  alt=""/>
                <p v-show="logisticSelectShow1==2" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
            <a-col
              :span='4'
              style="margin-right:20px"
              v-show='logisticStatus3'
              @click="selectLogistics1(3)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="SFlogo"
                  alt=""/>
                <p v-show="logisticSelectShow1==3" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
            <a-col
              :span='4'
              style="margin-right:20px"
              v-show='logisticStatus4'
              @click="selectLogistics1(4)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="YTlogo"
                  alt=""/>
                <p v-show="logisticSelectShow1==4" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
            <a-col
              :span='4'
              style="margin-right:20px"
              v-show='logisticStatus5'
              @click="selectLogistics1(5)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="YZlogo"
                  alt=""/>
                <p v-show="logisticSelectShow1==5" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row
        class='mt mb'
        type="flex"
        justify="start">
        <a-col
          class='title-size'
          style="line-height: 30px"
          :span='3'>
          <span>选择国际物流:</span>
        </a-col>
        <a-col :span='20'>
          <span v-if="!logisticSelectShow1&&!isPassERPValue" style="color:#1890ff">请先选择物流方式</span>
          <a-tree-select

            v-if="logisticSelectShow1&&!isPassERPValue"
            style="width:210px"
            :dropdownStyle="{ maxHeight:'400px', overflow:'auto'}"
            :treeData="Channel1"
            placeholder='请选择国际物流方式'
            @change='logisticsChange1'
            v-model='logisticsValue'>
            <span
              style="color: #08c"
              slot="title"
              slot-scope="{key, value}">
              {{key}}{{value}}
            </span>
          </a-tree-select>
          <a-select
            v-if="isPassERPValue"
            :allowClear='true'
            placeholder="请选择国际物流方式"
            style="width:210px"
            @change='logisticsChange1'
            v-model='logisticsValue'>
            <a-select-option value="">{{'全部'}}</a-select-option>
            <a-select-option
              :value="item.channel_code"
              v-for='(item,index) in Channel1'
              :key='index'>
              {{item.channel_name}}
            </a-select-option>
          </a-select>
          <a-button class='ml' type="primary" @click='verifyKey'>确认</a-button>
        </a-col>
      </a-row>
      <a-table
        :dataSource="LogisticsInfo"
        :pagination="false"
        :rowSelection="rowSelectionOne"
        rowKey="id">
        <a-table-column
          title="图片">
          <template slot-scope="text, record">
            <img
              style="width:60px"
              :src="record.image"
              alt="">
          </template>
        </a-table-column>
        <a-table-column
          title="商品数量"
          dataIndex="quantity">
        </a-table-column>
        <a-table-column
          title="订单编号"
          dataIndex="order_id">
        </a-table-column>
        <a-table-column
          title="物流信息"
          width="400px">
          <template slot-scope="text, record">
            <div v-if="!isPassERPValue">
              <a-row class="mb">
                <a-col :span="14">
                  选择国际物流:{{record.logistics_channel_name}}
                </a-col>
                <a-col :span="10">
                  运费预估约:{{record.freight}}元
                </a-col>
              </a-row>
              <a-row class="mb">
                <a-col :span="14">
                  预估到货时间:{{record.ArrivalTime}}
                </a-col>
                <a-col :span="10">
                  物流限制:{{record.limit}}kg
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  发货仓库地址:
                  <span v-if="record.address.length" v-for="(item,index) in record.address" :key="index">{{item}}</span>
                </a-col>
              </a-row>
            </div>
            <div v-if="isPassERPValue">
              <a-row class="mb">
                <a-col>
                  选择国际物流:{{record.logistics_channel_name}}
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  国际单号:
                  <a-input
                    style="width:200px"
                    v-model='record.international_number'
                    placeholder="请输入国际单号"/>
                </a-col>
              </a-row>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-modal>
    <!-- 单个编辑物流 -->
    <a-modal
      v-if="editeLogistics"
      title="编辑物流方式"
      :visible="editeLogistics"
      @ok="editeLogisticsOk"
      @cancel="editeLogisticsCancel"
      width='800px'>
      <!-- :disabled="logisticsInfo1[0].warehouse?true:false" -->
      <a-checkbox @change="isPassERP1" :checked="isPassERPValue1" >
        不经ERP官方仓库发货（直接填写国际单号）
      </a-checkbox>
      <a-row
        class='mt'
        type="flex"
        v-show="!isPassERPValue1"
        justify="start">
        <a-col
          class='title-size'
          :span='3'
          style="line-height: 46px">
          选择物流公司:
        </a-col>
        <a-col :span='21'>
          <a-row type='flex' justify='start' >
            <a-col
              :span='8'
              class='mt'
              v-show='logisticStatus1'
              @click="selectLogistics2(1)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="DSFlogo"
                  alt=""/>
                <p v-show="logisticSelectShow2==1" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
            <a-col
              :span='8'
               class='mt'
                v-show="logisticStatus2"
              @click="selectLogistics2(2)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="YWlogo"
                  alt=""/>
                <p v-show="logisticSelectShow2==2" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
            <a-col
              :span='8'
               class='mt'
              v-show="logisticStatus3"
              @click="selectLogistics2(3)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="SFlogo"
                  alt=""/>
                <p v-show="logisticSelectShow2==3" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
            <a-col
              :span='8'
               class='mt'
                v-show="logisticStatus4"
              @click="selectLogistics2(4)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="YTlogo"
                  alt=""/>
                <p v-show="logisticSelectShow2==4" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
            <a-col
              :span='8'
              class='mt'
              v-show="logisticStatus5"
              @click="selectLogistics2(5)">
              <a-button class="logistics_icon">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="YZlogo"
                  alt=""/>
                <p v-show="logisticSelectShow2==5" class="logistics_select">
                  <i class="logistics_select1"></i>
                  <a-icon class="logistics_select2" type="check"/>
                </p>
              </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row
        class='mt mb'
        type="flex"
        justify="start">
        <a-col
          class='title-size'
          style="line-height: 30px"
          :span='3'>
          <span>选择国际物流:</span>
        </a-col>
        <a-col :span='20'>
          <span v-if="!logisticSelectShow2&&!isPassERPValue1" style="color:#1890ff">请先选择物流方式</span>
          <a-tree-select
            class='tree-select-q'
            v-if="logisticSelectShow2&&!isPassERPValue1"
            style="width:210px"
            :dropdownStyle="{ maxHeight:'400px', overflow:'auto'}"
            :treeData="Channel2"
            placeholder='请选择国际物流方式'
            @change='logisticsChange2'
            v-model='logisticsValue1'>
            <span
              style="color: #08c"
              slot="title"
              slot-scope="{key, value}">
              {{key}}{{value}}
            </span>
          </a-tree-select>
          <a-select
            v-if="isPassERPValue1"
            :allowClear='true'
            placeholder="请选择国际物流方式"
            style="width:210px"
            @change='logisticsChange2'
            v-model='logisticsValue1'>
            <a-select-option value="">{{'全部'}}</a-select-option>
            <a-select-option
              :value="item.channel_code"
              v-for='(item,index) in Channel2'
              :key='index'>
              {{item.channel_name}}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row
        class='mt mb'
        type="flex"
        v-show="!isPassERPValue1"
        justify="start">
        <a-col
          class='title-size'
          :span='3'>
          <span>运费预估约:</span>
        </a-col>
        <a-col :span='20'>
          {{logisticsInfo1[0].freight}}<span v-if="logisticsInfo1[0].freight">元</span>
        </a-col>
      </a-row>
      <a-row
        class='mt mb'
        type="flex"
        v-show="!isPassERPValue1"
        justify="start">
        <a-col
          class='title-size'
          :span='3'>
          <span>物流限制:</span>
        </a-col>
        <a-col :span='20'>
          {{logisticsInfo1[0].limit}}
        </a-col>
      </a-row>
      <a-row
        class='mt mb'
        type="flex"
        v-show="!isPassERPValue1"
        justify="start">
        <a-col
          class='title-size'
          :span='3'>
          <span>预估到货时间:</span>
        </a-col>
        <a-col :span='20'>
          {{logisticsInfo1[0].ArrivalTime}}
        </a-col>
      </a-row>
      <a-row
        class='mt mb'
        type="flex"
        v-show="!isPassERPValue1"
        justify="start">
        <a-col
          class='title-size'
          :span='3'>
          <span>发货仓库地址:</span>
        </a-col>
        <a-col :span='20'>
          <span v-if="logisticsInfo1[0].address.length" v-for="(item,index) in logisticsInfo1[0].address" :key="index">{{item}}</span>
        </a-col>
      </a-row>
      <a-row
        class='mt mb'
        type="flex"
        v-show="isPassERPValue1"
        justify="start">
        <a-col
          class='title-size'
          style="line-height: 30px"
          :span='3'>
          <span>国际单号:</span>
        </a-col>
        <a-col :span='20'>
          <a-input
            style="width:200px"
            v-model='logisticsInfo1[0].international_number'
            placeholder="请输入国际单号"/>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 多个提示 -->
    <a-modal
      v-if="updateLogistics"
      title="修改物流方式提示"
      :visible="updateLogistics"
      @ok="updateLogisticsOk"
      @cancel="updateLogisticsCancel"
      width='500px'>
      <p>
        修改物流方式订单将自动生成国际运单号并冻结
        <span style="color:red">{{updateLogisticsMsg.freeze_money}}</span>元
        ，并将已冻结的
        <span style="color:red">{{updateLogisticsMsg.return_money}}</span>元
        金额返回
      </p>
      <a-button type="link" style="margin-left:319px" @click="goTopUp" v-if="topUpStatus">
        余额不足？点击充值
      </a-button>
    </a-modal>
    <!-- 单个提示 -->
    <a-modal
      v-if="updateLogistics1"
      title="修改物流方式提示"
      :visible="updateLogistics1"
      @ok="updateLogisticsOk1"
      @cancel="updateLogisticsCancel1"
      width='500px'>
      <p>
        修改物流方式订单将自动生成国际运单号并冻结
        <span style="color:red">{{updateLogisticsMsg1.freeze_money}}</span>元
        ，并将已冻结的
        <span style="color:red">{{updateLogisticsMsg1.return_money}}</span>元
        金额返回
      </p>
      <a-button type="link" style="margin-left:319px" @click="goTopUp" v-if="topUpStatus1">
        余额不足？点击充值
      </a-button>
    </a-modal>
    <a-modal
      v-if="applyWaybillNumber"
      title="申请国际单号提示"
      :visible="applyWaybillNumber"
      @ok="applyWaybillOk"
      @cancel="applyWaybillCancel"
      width='500px'>
      <p>
        申请国际运单号将冻结
        <span style="color:red">{{applyWaybillMsg.freeze_money}}</span>元
      </p>
      <a-button type="link" style="margin-left:319px" @click="goTopUp" v-if="!applyTopUpStatus">
        余额不足？点击充值
      </a-button>
    </a-modal>
    <!-- 订单同步 -->
      <!-- @ok="orderSynOk" -->
    <a-modal
      title="订单同步"
      :visible="orderSyncVisible"
      :confirm-loading="orderSynLoading"
      @cancel="orderSynCancel">
      <div>
        <a-progress :percent="30" />
        <div>
          <span>状态：订单同步完成</span>
          <div class='details-box'>
            <div>详情：</div>
            <div>
              <div>{{'lilei'}}({{'欧洲'}})，同步成功,成功同步{{'10'}}条</div>
              <div>{{'lilei'}}({{'欧洲'}})，同步成功,成功同步{{'10'}}条</div>
              <div>{{'lilei'}}({{'欧洲'}})，同步成功,成功同步{{'10'}}条</div>
            </div>
          </div>

        </div>
      </div>
       <template slot="footer">
         <a-button type="primary" @click='orderSyncOk()'>确认</a-button>
          <a-button key="submit" type="primary"  @click="orderSynCancel">
            取消
          </a-button>
      </template>
    </a-modal>
    <a-modal
      title="申请运单号"
      :visible="orderNoVisible"
      @ok='orderNoOk'
      @cancel="orderNoCancel"
    >
      <div>
        检测到订单没有国内单号，如需申请国内单号，请点击取消后，在批量操作里设置国内单号。如无需国内单号，请点击确定
      </div>
    </a-modal>
    <a-modal
      :maskClosable="false"
      title="报关列表"
      :visible="clearanceTemplateV"
      @ok='clearanceTemplateOk'
      @cancel="clearanceTemplateCancel"
      width='850px'
     >
    <div>
      <a-row>
        <a-col>
          <a-button v-show="!showTemplate"  @click="addTemplate('add')">
            添加报关模板
          </a-button>
        </a-col>
      </a-row>
      <div v-if="showTemplate">
        <a-row>
          <a-col span="12" class="mt">
            <a-row>
              <a-col class="titleH" span="6">中文报关：</a-col>
              <a-col span="18">
                <a-input placeholder="请输入中文报关"
                v-model="template.cnName"
                :style="{ display: 'block', width: 'calc(85% )' }">
                </a-input>
              </a-col>
            </a-row>
          </a-col>
           <a-col span="12" class="mt">
            <a-row>
              <a-col class="titleH" span="6">英文报关：</a-col>
              <a-col span="18">
                <a-input placeholder="请输入英文报关"
                v-model="template.enName"
                :style="{ display: 'block', width: 'calc(85% )' }">
                </a-input>
              </a-col>
            </a-row>
          </a-col>
          <a-col span="12" class="mt">
            <a-row>
              <a-col class="titleH" span="6">报关金额：</a-col>
              <a-col span="18">
                <a-input placeholder="请输入报关金额"
                v-model="template.usd"
                :style="{ display: 'block', width: 'calc(85% )' }">
                </a-input>
              </a-col>
            </a-row>
          </a-col>
           <a-col span="12" class="mt">
            <a-row>
              <a-col class="titleH" span="6">重    量：</a-col>
              <a-col span="18">
                <a-input placeholder="请输入重量"
                v-model="template.weight"
                :style="{ display: 'block', width: 'calc(85% )' }">
                </a-input>
              </a-col>
            </a-row>
          </a-col>
          <a-col span="12" class="mt">
            <a-row>
              <a-col class="titleH" span="6">商品类型：</a-col>
              <a-col span="18">
                <a-input placeholder="请输入商品类型"
                v-model="template.type"
                :style="{ display: 'block', width: 'calc(85% )' }">
                </a-input>
              </a-col>
            </a-row>
          </a-col>
          <a-col span="12" class="mt">
            <a-row>
              <a-col class="titleH" span="6">商品描述：</a-col>
              <a-col span="18">
                <a-input placeholder="请输入商品描述"
                v-model="template.desc"
                :style="{ display: 'block', width: 'calc(85% )' }">
                </a-input>
              </a-col>
            </a-row>
          </a-col>
          <a-col span="12" class="mt">
            <a-row>
              <a-col  span="6">是否含电：</a-col>
              <a-col span="18">
                <a-checkbox v-model="template.battery_status" @change="isBatteryChange">
                  {{template.battery_status==0?"不含电":"含电"}}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div v-if="!showTemplate" class='mt'>
        <a-table
        :pagination='false'
        :columns="templateColumns"
        :data-source="templateData"
        bordered
        >
          <template slot="battery" slot-scope="text, record">
            <div  >
              {{record.battery_status == "0"?"不含电":"含电"}}
            </div>
          </template>
          <template slot="open" slot-scope="text, record">
            <div class='edit-title' @click="templateEdit(record.id)">修改</div>
            <a-popconfirm
               title="确认删除吗"
              ok-text="Yes"
              cancel-text="No"
              @confirm="templateDel(record.id)"
              @cancel="templat">
              <div class='edit-title'>删除</div>
            </a-popconfirm>

          </template>
        </a-table>
        <template>
          <a-row
            class='mt'
            type="flex"
            justify="end"
          >
            <a-col>
              <a-pagination
              v-model="templateCurrent"
              @change='templatePageChange'
              :pageSize='templatePage.pageSize'
              :total='(templatePage.pageSize*templatePage.lastPage)' />
            </a-col>
          </a-row>
        </template>
      </div>
    </div>
    </a-modal>
    批量设置
    <!-- <a-modal
     :maskClosable="false"
      title="报关列表"
      :visible="setTemplateAll"
      @ok='setTemplateOk'
      @cancel="setTemplateAllCancel"
      width='850px'
    > -->
    <a-modal
     :maskClosable="false"
      title="报关列表"
      :visible="setTemplateAll"
      @cancel="setTemplateAllCancel"
      width='850px'
    >
    <div>
      <a-table
        :pagination='false'
        :columns="templateColumns"
        :data-source="templateAllData"
        >
          <template slot="battery" slot-scope="text, record">
            <div  >
              {{record.battery_status == "0"?"不含电":"含电"}}
            </div>
          </template>
          <template slot="open" slot-scope="text, record">
            <a-popconfirm
               title="确认引用此报关"
              ok-text="Yes"
              cancel-text="No"
              @confirm="templateQuote(record.id)"
              @cancel="templat">
              <div class='edit-title'>引用</div>
            </a-popconfirm>
          </template>
      </a-table>
         <a-row
            class='mt'
            type="flex"
            justify="end"
          >
            <a-col>
              <a-pagination
              v-model="templateAllCurrent"
              @change='templateAllPageChange'
              :pageSize='templateAllPage.pageSize'
              :total='(templateAllPage.pageSize*templateAllPage.lastPage)' />
            </a-col>
          </a-row>
    </div>
    </a-modal>
  </div>
</template>
<script>
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {},
  };
  if (index === 4) {
    obj.attrs.colSpan = 0;
  }
  return obj;
};
const columns = [
  {
    title: '标记名称',
    dataIndex: 'name',
    width: '40%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '颜色',
    dataIndex: 'color',
    width: '40%',
    scopedSlots: { customRender: 'color' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];
import Vue from 'vue'
import {
  oriOrderList,
  groupUpdate,
  orderCheck,
  getChannel,
  setChannel,
  getAllChannel,
  getLogisticsNo,
  deliver,
  warehouseAddress,
  getExpressInfo,
  getUserConfig,
  getInlandCode,
  orderMoveProcess,
  updateAmazonStatus,
  getLogisticsCompany,
  updataColorMark,
  orderBatchMark,
  orderGetAddress,
  amazonOrderList,
  orderClearance,
  updateClearance,
  moveShelve,
  orderUpdaAddress,
  orderVirtualSend,
  moveProcess,
  orderRevert,
  batchDelete,
  createOrder,
  getForeignChannel,
  getAmazonChannel,
  getOrderLogistics,
  saveLogisticsData,
  getOrderLnland,
  setOrderLnland,
  getWarehouseAddressFund,
  judgeBalance,
  judgeByIds,
  orderMarkComlete,
  syncOrder,
  getClearanceTemplate,
  editclearancetemplate,
  deleteClearanceTemplate,
  batchSetClearance,
  exportOrder
} from '@/api/order'
import { getMyStore ,getCountryList ,mwsOrderPush} from '@/api/collect'
import { logisInfo, currencyList ,currencyListType,countrysCode } from './public/country'
import { constants } from 'crypto'
import debounce from 'lodash/debounce'
import { type } from 'os'
import { permsBtn } from '@/utils/static'
import internationalView from './modules/international.vue'
import domesticView from './modules/domestic.vue'
import moment from 'moment'
import {deepClone , copyData ,handlerData} from '@/utils/util'
import editDomesticno from './modules/editDomesticNo'
export default {
  name: 'orderverify',
  components:{
    internationalView,
    domesticView,
    editDomesticno
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectAll = selectedRows
          this.selectkey = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            // disabled: record.amazon_ship == 1 && record.is_checked == "0", // Column configuration not to be checked
            name: record.name
          }
        })
      }
    },
    rowSelectionOne() {
      const { selectedRowKeysSon } = this
      return {
        selectedRowKeysSon,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectAllOne = selectedRows
          this.selectkeyOne = selectedRowKeys
          this.selectedRowKeysOne = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.amazon_ship == 1 && record.is_checked == "0", // Column configuration not to be checked
            name: record.name,
            defaultChecked: this.selectedRowKeysOne.includes(record.id)
          }
        }),
      }
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      permsBtn,
      data: [],
      page: '',
      currencyList,
      currencyListType,
      countrysCode,
      current: 1,
      selectAll: '',
      selectedRowKeys: [],
      queryState: false,
      info: '',
      selectkey: '',
      queryParam: {
        logistics: '',
        orderNumber: '',
        country: '0'
      },
      queryStatus: '输入订单号、物流单号、sku',
      ScreeningOrder: '0',
      labelCol: { lg: { span: 6 }, sm: { span: 6 } },
      wrapperCol: { lg: { span: 12 }, sm: { span: 12 } },
      logistics: '邮政',
      modals: false,
      visible: false,
      ModalText: '确定要删除吗',
      modalsLoading: false,
      confirmLoading: false,
      delId: '',
      treeData: '',
      // treeData,
      Selectvalue: '',
      orderid: '',
      CurrentLogistics: '',
      listLoading: false,
      myStore: '',
      CountryList: '',
      storeId: 'all',
      countryId: 'all',
      screenType: 'all',
      queryInfo: '', // 请求状态
      Examine: true,
      codeAll: true,
      Channel: '',
      channelValue: '',
      getcodeshow: false,
      getcodeLoading: false,
      name: '',
      code: '',
      logisInfo:"",
      subVal: '',
      logisticsPrice: '',
      address: '',
      showInfo: false,
      value: undefined,
      modalTS: false,
      TSLoading: false,
      waybillCode: false,
      ExpressInfo: '',
      RemarksInfo: '',
      orderIds: '',
      types: '',
      handianstate: false,
      checkedHandle: '',
      battery_type: '',
      logisticId:"",
      battery_status:0,
      dataStatus:"",
      orderTabstatus:"all",
      mwsCountry:[],
      datatime1:'2019-12-9',
      datatime2:'2019-12-8',
      datatime3:'2019-12-7',
      showInternational:false,
      ifInternational:false,
      ifDomestic:false,
      showDomestic:false,
      showDomestic:false,
      ifDomestic:false,
      openDomesticState:"0",
      openInternationalState:"0",
      country_code_param:"",
      examineLoading:false,
      DSFlogo:require("@/assets/image/dsf.jpg"),
      YWlogo:require("@/assets/image/yw.jpg"),
      SFlogo:require("@/assets/image/sf.jpg"),
      YTlogo:require("@/assets/image/yt.png"),
      YZlogo:require("@/assets/image/yz.png"),
      logisticSelectShow:0,
      company:'',
      logisticStatus1:false,
      logisticStatus2:false,
      logisticStatus3:false,
      logisticStatus4:false,
      logisticStatus5:false,
      // 标记相关
      selectColor:[
        {
          color: "#61bd50",
          key: "0",
          name: "",
          type:false
        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:false
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:false
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:false
        },
          {
          color: "#f56c6c",
          key: "4",
          name: "",
          type:false
        },
          {
          color: "#137abf",
          key: "5",
          name: "",
          type:false
        }
      ],
      selectColorAll:[
        {
          color: "#61bd50",
          key: "0",
          name: "",
          type:false
        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:false
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:false
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:false
        },
          {
          color: "#f56c6c",
          key: "4",
          name: "",
          type:false
        },
          {
          color: "#137abf",
          key: "5",
          name: "",
          type:false
        }
      ],
      cacheDataAll:[
       {
          color: "#61bd50",
          key: "0",
          name: "",
          type:false

        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:false
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:false
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:false
        },
          {
          color: "#f56c6c",
          key: "4",
          name: "",
          type:false
        },
          {
          color: "#137abf",
          key: "5",
          name: "",
          type:false
        }
      ],
      cacheData:[
       {
          color: "#61bd50",
          key: "0",
          name: "",
          type:false

        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:false
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:false
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:false
        },
          {
          color: "#f56c6c",
          key: "4",
          name: "",
          type:false
        },
          {
          color: "#137abf",
          key: "5",
          name: "",
          type:false
        }
      ],

      // 选择框的颜色
      colorData:[],
      colorSelectValue:'',
      TabColor:false,
      TabColorLoading:false,
      editingKey: '',
      columns,
      isErpId:'all',//是否经过erp
      isWaybillId:"all",//有无运单号
      sortId:'pay_time',//排序方式
      orderStatus:1,//订单状态

      // 批量更改标记
      TabColorAll:false,
      TabColorAllLoading:false,
      colorDataAll:[],
      editingKeyAll: '',

      //批量修改收货人信息
      editConsigneeInfoVisible:false,
      editConsigneeInfoLoading:false,

      //批量报关
      customsData:[],
      customsVisible:false,
      consigneeData:'',
      setDocNoLoading:false,

      //批量设置国内单号
      setDocNoVisible:false,
      tableData:"",

      //批量设置国际物流
      logisticsVisible:false,
      logisticSelectShow1:0,
      company1:'',
      logisticsValue:'',
      Channel1:[],
      isPassERPValue:false,
      LogisticsInfo:[],
      LogisticsInfoUnPass:[],
      selectAllOne:[],
      selectkeyOne:[],
      selectedRowKeysOne:[],
      updateLogistics:false,
      updateLogisticsMsg:'',
      topUpStatus:false,
      channel_name:'',

      //申请国际单号
      applyWaybillNumber:false,
      applyWaybillMsg:'',
      applyTopUpStatus:false,

      //订单同步
      orderSyncVisible:false,
      orderSynLoading:false,

      //编辑单个物流
      editeLogistics:false,
      logisticSelectShow2:0,
      company2:'',
      logisticsValue1:'',
      Channel2:[],
      isPassERPValue1:false,
      logisticsInfo1:'',
      channel_name1:'',
      updateLogistics1:false,
      topUpStatus1:false,
      updateLogisticsMsg1:'',
      orderNoVisible:false,
      sortStatus:{
        pay_time:{
          type:true,
          key:"pay_time",
          state:1
        },
        update_time:{
          type:true,
          key:"update_time",
          state:0
        },
        sku:{
          type:true,
          key:"sku",
          state:0
        },
        send_time:{
          type:true,
          key:"send_time",
          state:0

        },
        amount:{
          type:true,
          key:"amount",
          state:0
        },
      },
      sort:'DESC',
      timers:null,
      // 报关模板
      clearanceTemplateV:false,
      showTemplate:false,
      isTemplate:"",
      template:{
        cnName:"",
        enName:"",
        usd:"",
        weight:"",
        type:"",
        desc:"",
        battery_status:0

      },
      templateCurrent:0,
      templateId:"",
      templateDelId:"",
      templatePage:{
        currentPage: 1,
        firstPage: 1,
        lastPage: 1,
        pageSize: 10,
      },
      templateData:[
      ],
      templateColumns:[
        {
          title: '中文报关',
          dataIndex: 'cnName',
          scopedSlots: { customRender: 'cnName' },
        },
        {
          title: '英文报关',
          className: 'enName',
          dataIndex: 'enName',
        },
        {
          title: '报关金额',
          dataIndex: 'usd',
        },
        {
          title: '重量',
          dataIndex: 'weight',
        },
        {
          title: '商品类型',
          dataIndex: 'type',
        },
        {
          title: '商品描述',
          dataIndex: 'desc',
        },
        {
          title: '是否含电',
          dataIndex: 'battery_status',
          scopedSlots: { customRender: 'battery' },
        },
        {
          title: '编辑',
          dataIndex: 'edit',
          scopedSlots: { customRender: 'open' },
        },
      ],
      templateCurrent:1,
      templatePage:"",
      setTemplateAll:false,
      templateAllCurrent:1,
      templateAllData:"",
      templateAllPage:"",
      startValue: null,
      endValue: null,
      endOpen: false,
    }
  },
  created() {
    // moment  时间处理库
    this.getTomorrow()
  },
  mounted() {
    if(this.$route.query.orderTab){
      this.screenType = this.$route.query.orderTab;
        if(Vue.ls.get('cacheInfo')){
          this.current = Vue.ls.get('cacheInfo').current
        }else{
          this.current = 1
        }
      //
      this.cacheFn()
    }else{
      this.queryInfo = {
        page_size:"10",
        page: this.current,
        status: 'all',
        is_checked: 'all',
        store_id: this.storeId,
        country: this.countryId,
        order_by: this.sortId,//排序方式
        company: this.company,
        channel: this.channelValue,
        keywords: this.queryParam.orderNumber,
        sort:this.sort
      }
      this.Examine = false
      this.codeAll = false
      this.getoriOrderList()
    }
    this.getLogisticsCompanys()
    this.getMyStores()
    this.getAllChannels()
    this.getInlandCodeFn()
    let date1 = new Date()
    let date2 = new Date(date1)
    date2.setDate(date1.getDate()-1)
    this.startValue = moment(date2, 'YYYY-MM-DD')
    this.endValue = moment(date2, 'YYYY-MM-DD')
  },
  updated() {},
  destroyed() {
    // clearTimeout(this.timers)
    clearInterval(this.timers)
    this.timers = null
  },
  methods: {
    moment,
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() > moment().subtract(1, 'days').valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf() || endValue.valueOf() > moment().subtract(1, 'days').valueOf();
    },
    onChange(){},
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    //是否经过erp
    isErpVal(id){
      this.isErpId = id
      this.queryParamchange()
    },
    //有无运单号
    isWaybillVal(id){
      this.isWaybillId = id
      this.queryParamchange()
    },
    //排序方式
    changeSort(id,key,type){
      let state
      if(key === "pay_time"){
        this.sortStatus.pay_time.state !== 0 ?this.sortStatus.pay_time.type = !this.sortStatus.pay_time.type:""
        this.sortStatus.pay_time.type?state="DESC":state="ASC"
        this.sortStatus.pay_time.state++
        this.sortStatus.update_time.state=0
        this.sortStatus.sku.state=0
        this.sortStatus.send_time.state=0
        this.sortStatus.amount.state=0
      }else if(key === "update_time"){
        this.sortStatus.update_time.state !== 0 ?this.sortStatus.update_time.type = !this.sortStatus.update_time.type:""
        this.sortStatus.update_time.type?state="DESC":state="ASC"
        this.sortStatus.update_time.state++
        this.sortStatus.pay_time.state= 0
        this.sortStatus.sku.state= 0
        this.sortStatus.send_time.state=0
        this.sortStatus.amount.state=0
      }else if(key === "sku"){
        this.sortStatus.sku.state !== 0 ?this.sortStatus.sku.type = !this.sortStatus.sku.type:""
        this.sortStatus.sku.type?state="DESC":state="ASC"
        this.sortStatus.pay_time.state= 0
        this.sortStatus.update_time.state=0
        this.sortStatus.sku.state++
        this.sortStatus.send_time.state=0
        this.sortStatus.amount.state=0
      }else if(key === "send_time"){
        this.sortStatus.send_time.state !== 0 ?this.sortStatus.send_time.type = !this.sortStatus.send_time.type:""
        this.sortStatus.send_time.type?state="DESC":state="ASC"
        this.sortStatus.pay_time.state= 0
        this.sortStatus.update_time.state=0
        this.sortStatus.sku.state=0
        this.sortStatus.send_time.state++
        this.sortStatus.amount.state=0
      }else if(key === "amount"){
        this.sortStatus.amount.state !== 0 ?this.sortStatus.amount.type = !this.sortStatus.amount.type:""
        this.sortStatus.amount.type?state="DESC":state="ASC"
        this.sortStatus.pay_time.state = 0
        this.sortStatus.update_time.state=0
        this.sortStatus.sku.state=0
        this.sortStatus.send_time.state=0
        this.sortStatus.amount.state++
      }
      this.sort = state
      this.sortId = id
      this.screen(this.orderTabstatus,0)

    },
    //订单状态
    changeOrderStatus(id){
      this.orderStatus = id
    },
    //新增订单
    addNewList(){
      this.$router.push({
        path:'/order/fictitious/addorder',
        query:{
          orderTab:"0"
        }
      })
    },
    //获取订单审核状态
    getOrderStatus(num){
      let orderDate = moment(num*1000).format('YYYY-MM-DD')
      let count = moment(orderDate,'YYYY-MM-DD').diff(moment(), 'day')
      return count
    },
    //获取订单审核时间
    getOrderDate(num){
      // let orderDate = moment(num*1000).format('YYYY-MM-DD')
      let orderDate = new Date(num*1000)
      let year = orderDate.getFullYear()
      let mounth = orderDate.getMonth()+1
      let day = orderDate.getDate()
      return year+'年'+mounth+'月'+day+'日'
    },
    // 获取国内物流渠道
    getInlandCodeFn(){
      getInlandCode({}).then((res)=>{
        if(res.code === 0){
          this.logisInfo = res.data
        }
      })
    },
    // 获取订单列表
    getoriOrderList() {
      this.queryState = false
      this.listLoading = true
      amazonOrderList(this.queryInfo).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          if (res.data) {
            if (res.data.data) {
              this.data = res.data.data
              this.page = res.pages
              this.dataStatus = res.data.countData
              if(this.data.color_mark){
                let  DefaultValue = {
                  key:''
                }
                DefaultValue.key = this.data.color_mark.key
                this.colorSelectValue = DefaultValue
              }else{
                let  DefaultValue = {
                  key:'0'
                }
                this.colorSelectValue = DefaultValue
              }
            } else {
              this.data = []
            }
          }
        } else {
          this.listLoading = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    jumpToOrderUrl(url) {
      if (url) {
        window.open(url, '_blank')
      } else {
      }
    },
    screen(status,type,updata) {
      if(type){
        this.queryParam.orderNumber = ''
      }

      Vue.ls.set("orderTab",status);
      this.orderTabstatus = status
      // 查询状态 筛选  通过id
      if(updata == 1){
      }else{
        this.current = 1
      }
      if (status === 'all') {
        this.screenType = 'all'
        this.Examine = false
        this.codeAll = false
        this.waybillCode = false
        this.queryInfo = {
          page: this.current,
          page_size:"10",
          status: 'all',
          is_checked: 'all',
          store_id: this.storeId,
          country: this.countryId,
          order_by: this.sortId,//排序方式
          company: this.company,
          channel: this.channelValue,
          keywords: this.queryParam.orderNumber,
          sort:this.sort
        }
        this.getoriOrderList()
      } else if (status === '0') {
        this.Examine = true
        this.codeAll = false
        this.waybillCode = false
        // 待审核
        this.screenType = '0'
        // this.sortId = 'send_time'
        this.queryInfo = {
          page: this.current,
          page_size:"10",
          status: '0',
          is_checked: '0',
          store_id: this.storeId,//店铺
          country: this.countryId,//国家
          order_by: this.sortId,//排序方式
          // warehouse: this.isErpId,//是否经过ERP
          // channel: this.channelValue,//渠道
          // company: this.company,//物流公司
          keywords: this.queryParam.orderNumber,//关键词
          sort:this.sort
        }
        this.getoriOrderList()
      } else if (status === '1') {
        // 待发货
        this.Examine = false
        this.codeAll = true
        this.screenType = '1'
        this.waybillCode = true
        this.queryInfo = {
          page: this.current,
          page_size:"10",
          status: '0',
          is_checked: '1',
          store_id: this.storeId,
          country: this.countryId,
          warehouse: this.isErpId,//是否经过ERP
          company: this.company,
          inland_info: this.isWaybillId,//有无运单号
          order_by: this.sortId,//排序方式
          keywords: this.queryParam.orderNumber,
          channel: this.channelValue,
          sort:this.sort
        }
        this.getoriOrderList()
      } else if (status === '2') {
        // 已发货
        if(this.sortId=='send_time'){
          this.sortId="sku"
        }
        this.Examine = false
        this.codeAll = false
        this.screenType = '2'
        this.waybillCode = false
        this.queryInfo = {
          page: this.current,
          page_size:"10",
          status: '1',
          is_checked: '1',
          store_id: this.storeId,
          country: this.countryId,
          company: this.company,
          order_by: this.sortId,//排序方式
          keywords: this.queryParam.orderNumber,
          channel: this.channelValue,
          sort:this.sort
        }
        this.getoriOrderList()
      } else if (status === '3') {
        // 已完成
        if(this.sortId=='send_time'){
          this.sortId="sku"
        }
        this.Examine = false
        this.codeAll = false
        this.screenType = '3'
        this.waybillCode = false
        this.queryInfo = {
          page: this.current,
          page_size:"10",
          status: '4',
          is_checked: '1',
          store_id: this.storeId,
          country: this.countryId,
          company: this.company,
          order_by: this.sortId,//排序方式
          keywords: this.queryParam.orderNumber,
          channel: this.channelValue,
          sort:this.sort
        }
        this.getoriOrderList()
      } else if (status === '4'){
        this.Examine = false
        this.codeAll = false
        this.screenType = '4'
        this.queryInfo = {
          page: this.current,
          page_size:"10",
          keywords: this.queryParam.orderNumber,
          country: this.countryId,
          store_id: this.storeId,
          channel: this.channelValue,
          is_fba:"1",
          company: this.company,
          sort:this.sort
        }
        this.getoriOrderList()
      } else if (status === '5') {
        // 已搁置
        if(this.sortId=='send_time'){
          this.sortId="sku"
        }
        let num1,num2
        if(this.orderStatus == 1){
          num1=''
          num2=''
        }else if(this.orderStatus == 2){
          num1='0'
          num2='0'
        }else if(this.orderStatus == 3){
          num1='0'
          num2='1'
        }else if(this.orderStatus == 4){
          num1='1'
          num2='1'
        }
        this.Examine = false
        this.codeAll = false
        this.screenType = '5'
        this.waybillCode = false
        this.queryInfo = {
          page: this.current,
          page_size:"10",
          status: num1,
          is_checked: num2,
          store_id: this.storeId,
          country: this.countryId,
          company: this.company,
          keywords: this.queryParam.orderNumber,
          channel: this.channelValue,
          shelve:1,
          sort:this.sort
        }
        this.getoriOrderList()
      }
      this.selectAll = []
      this.selectkey = []
      this.selectedRowKeys = []
    },
    //   筛选查询
    queryParamchange() {
      this.screen(this.orderTabstatus,0)
      // this.getoriOrderList()
    },
    storeVal(id) {
      this.storeId = id
      if (id === 'all') {
        this.CountryList = this.mwsCountry
      }
      this.queryParamchange()

      this.myStore.forEach((item, index) => {
        if (item.id === id) {
          this.CountryList = item.mws_site
        }
      })
    },
    countryVal(val) {
      this.countryId = val
      this.queryParamchange()
    },
    pagechange(page, pagesize) {
      this.current = page
      if (this.queryState === false) {
        if (this.screenType === 'all') {
          this.queryInfo = {
            page: this.current,
            page_size:"10",
            status: 'all',
            is_checked: 'all',
            store_id: this.storeId,
            country: this.countryId,
            order_by: this.sortId,//排序方式
            company: this.company,
            channel: this.channelValue,
            keywords: this.queryParam.orderNumber,
            sort:this.sort
          }
          this.getoriOrderList()
        } else if (this.screenType === '0') {
          this.queryInfo = {
            page: this.current,
            page_size:"10",
            status: '0',
            is_checked: '0',
            store_id: this.storeId,//店铺
            country: this.countryId,//国家
            order_by: this.sortId,//排序方式
            // warehouse: this.isErpId,//是否经过ERP
            // channel: this.channelValue,//渠道
            // company: this.company,//物流公司
            keywords: this.queryParam.orderNumber,//关键词
            sort:this.sort
          }
          this.getoriOrderList()
        } else if (this.screenType === '1') {
          this.queryInfo = {
            page: this.current,
            page_size:"10",
            status: '0',
            is_checked: '1',
            store_id: this.storeId,
            country: this.countryId,
            warehouse: this.isErpId,//是否经过ERP
            company: this.company,
            inland_info: this.isWaybillId,//有无运单号
            order_by: this.sortId,//排序方式
            keywords: this.queryParam.orderNumber,
            channel: this.channelValue,
            sort:this.sort
          }
          this.getoriOrderList()
        } else if (this.screenType === '2') {
          this.queryInfo = {
            page: this.current,
            page_size:"10",
            status: '1',
            is_checked: '1',
            store_id: this.storeId,
            country: this.countryId,
            company: this.company,
            order_by: this.sortId,//排序方式
            keywords: this.queryParam.orderNumber,
            channel: this.channelValue,
            sort:this.sort
          }
          this.getoriOrderList()
        } else if (this.screenType === '3') {
          this.queryInfo = {
            page: this.current,
            page_size:"10",
            status: '4',
            is_checked: '1',
            store_id: this.storeId,
            country: this.countryId,
            company: this.company,
            order_by: this.sortId,//排序方式
            keywords: this.queryParam.orderNumber,
            channel: this.channelValue,
            sort:this.sort
          }
          this.getoriOrderList()
        }else if (this.screenType === '4') {
          this.queryInfo = {
            page: this.current,
            page_size:"10",
            keywords: this.queryParam.orderNumber,
            country: this.countryId,
            store_id: this.storeId,
            channel: this.channelValue,
            is_fba:"1",
            company: this.company,
            sort:this.sort
          }
          this.getoriOrderList()
        }else if (this.screenType === '5') {
          let num1,num2
          if(this.orderStatus == 1){
            num1=''
            num2=''
          }else if(this.orderStatus == 2){
            num1='0'
            num2='0'
          }else if(this.orderStatus == 3){
            num1='0'
            num2='1'
          }else if(this.orderStatus == 4){
            num1='1'
            num2='1'
          }
          this.queryInfo = {
            page: this.current,
            page_size:"10",
            status: num1,
            is_checked: num2,
            store_id: this.storeId,
            country: this.countryId,
            company: this.company,
            keywords: this.queryParam.orderNumber,
            channel: this.channelValue,
            shelve:1,
            sort:this.sort
          }
          this.getoriOrderList()
        }
      } else {
        this.queryOrderList( this.queryParam.orderNumber)
      }
    },
    onChangeSelect(value) {
      this.Selectvalue = value
      this.getwarehouseAddress(value)
    },
    handianchangge(e) {
      this.checkedHandle = e.target.checked
      if (e.target.checked === true) {
        getChannel({
          country_code: this.CountryCode,
          type: 1 //1支持,
        }).then(res => {
          this.treeData = res.data
        })
      } else {
        getChannel({
          country_code: this.CountryCode
          // type: 0
        }).then(res => {
          this.treeData = res.data
        })
      }
    },
    //  获取物流地址
    getwarehouseAddress(value) {
      warehouseAddress({
        channel_code: value,
        id: this.orderid
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.address = res.data.address
            this.logisticsPrice = res.data.freight
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //获取筛选列表
    getMyStores() {
      getMyStore({}).then(res => {
        if (res.code === 0) {
          this.mwsCountry = []
          this.myStore = res.data
          if(JSON.stringify(this.myStore)!=="{}"){
            this.myStore.forEach((item,index)=>{
              this.mwsCountry = this.mwsCountry.concat(item.mws_site)
            })
          }
          // else{
          //   this.$notification.error({
          //     message: '错误',
          //     description: '暂无店铺'
          //   })
          // }
          this.mwsCountry = this.removal(this.mwsCountry)
          this.CountryList = this.mwsCountry
        }
      })
    },
    removal(array){
      var result = [];
        var obj = {};
        for(var i =0; i<array.length; i++){
            if(!obj[array[i].code]){
                result.push(array[i]);
                obj[array[i].code] = true;
            }
        }
      return result
    },
    //批量审核
    examineAll() {
      this.examineLoading =true
      if (this.selectAll.length > 0) {
        let str = ''
        for (var i = 0; i < this.selectAll.length; i++) {
          str += this.selectAll[i].id + ','
        }
        this.ids = str.slice(0, -1)
        orderCheck({
          ids: this.ids
        }).then(res => {
          if (res.code === 0) {
            this.selectedRowKeys = []
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.examineLoading = false
            this.screen('1',0)
          } else {
            this.examineLoading = false
            this.selectedRowKeys = []
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        this.examineLoading = false
        this.$notification.error({
          message: '错误',
          description: '请先勾选审核的选项'
        })
      }
    },
    // 查询订单
    queryOrderList(code) {
      this.info = {
        keywords: code,
        page: this.current,
        status: 'all',
        is_checked: 'all'
      }
      this.allGetOrderList(this.info)
    },
    clearValue(){
      this.queryParam.logistics = "";
      this.storeId = 'all';
      this.countryId = 'all';
      this.CountryList = this.mwsCountry;
      this.channelValue = '';
      this.queryParam.orderNumber = '';
      this.company = '';
      this.logisticSelectShow = 0
      this.isErpId = 0
      this.isWaybillId = 1
      this.sortId = 'sku'
      this.orderStatus = 1
      this.screen(this.orderTabstatus,0)
    },
    allGetOrderList(info) {
      oriOrderList(info).then(res => {
        if (res.code === 0) {
          if (res.data) {
            if (res.data.data) {
              this.data = res.data.data
              this.page = res.pages
              this.dataStatus = res.data.countData
            } else {
              this.data = []
            }
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //获取物流方式
    getAllChannels() {
      getUserConfig({
        page:1,
        page_size: 100,
        company:this.company
      }).then(res => {
        if (res.code === 0) {
          this.Channel = res.data.data
        }
      })
    },
    getAllChannels1() {
      getAmazonChannel({
        ids:this.selectkey,
        company:this.company1
      }).then(res => {
        if (res.code === 0) {
          this.Channel1 = res.data
        }
      })
    },
    getAllChannels2() {
      getAmazonChannel({
        ids:this.logisticsInfo1[0].id,
        company:this.company2
      }).then(res => {
        if (res.code === 0) {
          this.Channel2 = res.data
        }
      })
    },
    //新增订单
    jumpTo() {
      this.$router.push({
        path: '/order/orderverify/creatorder',
        query:{
          orderTab:"0"
        }
      })
    },
    //提交物流信息
    logisticfrom(CountryCode, id, logis, price, infos,battery_status,order_id,type,country_code,) {
      // this.value = undefined
      // this.Selectvalue = ''
      this.battery_status = battery_status
      this.logisticId = id;
      this.CountryCode = CountryCode
      this.orderID = order_id
      this.orderid = id
      this.CurrentLogistics = logis
      this.country_code_param = country_code
      this.orderWeight = infos.weight
      this.logisticsPrice = price
      if(type === 0){
        this.modals = true
        this.openInternationalState = '0'
        this.openDomesticState = '0'
      }else if(type === 1){
        this.openInternational()
        this.openInternationalState = '1'
      }else if(type === 2){
        this.openDomestic()
        this.openDomesticState = '2'
      }else if(type === 3){
        this.openDomestic()
        this.openDomesticState = '3'
      }
    },
    // 批量虚拟发货
    suball() {
      let str = ''
      for (var i = 0; i < this.selectAll.length; i++) {
        str += this.selectAll[i].id + ','
      }
      this.subVal = str.slice(0, -1)
      if (this.subVal) {
        deliver({ id: this.subVal }).then(res => {
          if (res.code === 0) {
            this.selectedRowKeys = []
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
          this.screen("2",0)
          } else {
            this.selectedRowKeys = []
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选批量提交的单号'
        })
      }
    },

    //进入详情页
    details(id) {
      this.setCacheFn()
      this.$router.push({
        path: '/order/fictitious/orderdetails',
        query: {
          id: id,
          disableds:this.screenType === '4'?'0':"1",
          orderTab:this.screenType
        }
      })
    },
    // 物流搜索
    logisticsChange(value) {
      this.channelValue = value
    },
    // 批量设置国际物流弹窗物流搜索
    logisticsChange1(value,data) {
      this.logisticsValue = value
      if(!this.isPassERPValue){
        this.channel_name = data.toString()
      }else{
        this.Channel1.forEach((itm,idx)=>{
          if(itm.channel_code == this.logisticsValue){
            this.channel_name = itm.channel_name
          }
        })
      }
    },
    logisticsChange2(value,data) {
      this.logisticsValue1 = value
      if(!this.isPassERPValue1){
        this.channel_name1 = data.toString()
      }else{
        this.Channel2.forEach((itm,idx)=>{
          if(itm.channel_code == this.logisticsValue1){
            this.channel_name1 = itm.channel_name
          }
        })
      }
      getWarehouseAddressFund({
        ids:this.logisticsInfo1[0].id,
        channel_code:this.logisticsValue1
      }).then((res)=>{
        if(res.code == 0){
          this.logisticsInfo1[0].channel_code = this.logisticsValue1
          this.logisticsInfo1[0].logistics_channel_code = this.logisticsValue1
          this.logisticsInfo1[0].logistics_channel_name = this.channel_name1
          this.logisticsInfo1[0].freight = res.data[0].freight
          this.logisticsInfo1[0].limit = res.data[0].limit
          this.logisticsInfo1[0].address = res.data[0].address
          this.logisticsInfo1[0].ArrivalTime = res.data[0].ArrivalTime
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //  获取运单号
    getcode(CountryCode, id, logis) {
      this.orderid = id
      this.CurrentLogistics = logis
      this.getcodeshow = true
      this.code = ''
    },
    EXCancel(e) {
      this.modals = false
      this.handianstate = false
      // 重置国内物流信息
      this.ifDomestic = false
      // 重置国内物流信息
      this.ifInternational = false
    },
    //打开国际单号
    openInternational(){
      this.showInternational = true;
      this.ifInternational = true
      this.modals = false;

    },
    // 关闭国际单号
    cancelInternational(){
      this.showInternational = false;
      this.ifInternational = false;
      this.getoriOrderList()
    },
    //从国际订单返回
    returnInternational(){
      this.showInternational = false;
      //this.ifInternational = false;
      this.modals = true;
    },
    // 打开国内单号
    openDomestic(){
      this.showDomestic = true;
      this.ifDomestic = true
      this.modals = false;
    },
    // 国内单号取消
    cancelDomestic(){
      this.showDomestic = false;
      this.ifDomestic = false;
      this.getoriOrderList()
    },
    // 从国内单号返回
    returnDomestic(){
      this.showDomestic = false;
      // this.ifDomestic = false;
      this.modals = true;
    },
    TSOk() {
      this.$router.push({
        path:"/order/fictitious/orderdetails",
        query:{
          id:this.logisticId
        }
      })
      setTimeout(() => {
        this.modalTS = false
        this.TSLoading = false
      }, 1000)
    },
    TSCancel(e) {
      this.modalTS = false
    },

    //删除订单
    orderdel(id) {
      this.visible = true
      this.delId = id
    },
    handleOk() {
      //删除的操作
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 1000)
    },
    handleCancel(e) {
      this.visible = false
    },
    //
    handleChange(value) {
      this.name = value
    },
    getcodeOk() {
      this.getcodeLoading = true
      if (this.name.length <= 0) {
        this.$notification.error({
        message: '错误',
        description: "物流名称不能为空",
        });
        this.getcodeLoading = false
      }else if(this.code.length <= 0){
        this.$notification.error({
          message: '错误',
          description: '物流单号不能为空'
        })
        this.getcodeLoading = false
      } else {
        // this.code = this.code.replace(/\n/g,',')
        getLogisticsNo({
          id: this.orderid,
          inland_channel: this.name,
          inland_code: this.code
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: '物流修改成功'
            })
            this.screen("1",0)
            //提交
            setTimeout(() => {
              this.getcodeshow = false
              this.getcodeLoading = false
            }, 500)
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            this.getcodeLoading = false
          }
        })
      }
    },
    getcodeCancel() {
      this.getcodeshow = false
    },
    // 鼠标防抖
    debounce(fn, delay) {
      var delay = delay || 200
      var timer
      return function() {
        var th = this
        var args = arguments
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(function() {
          timer = null
          fn.apply(th, args)
        }, delay)
      }
    },

    getInfo: debounce(function(ids, types,code) {
      // 存放每条数据对应的id值
      if (this.orderIds != ids || this.types != types) {
        if (types == 1) {
          getExpressInfo({
            id: ids,
            type: types,
            logistics_code:code
          }).then(res => {
            if (res.code === 0) {
              this.RemarksInfo = res.data
            }
            this.orderIds = ids
            this.types = types
          })
        }
        if (types == 2) {
          getExpressInfo({
            id: ids,
            type: types,
            logistics_code:code
          }).then(res => {
            if (res.code === 0) {
              this.ExpressInfo = res.data
            }
            this.orderIds = ids
            this.types = types
          })
        }
      } else {
      }
    }, 200),
    // 获取明天时间
    getTomorrow(){
      var day = new Date();
      day.setTime(day.getTime()+24*60*60*1000);
      var Tomorrow  = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
      return Tomorrow
    },
    toAudited(id){
      moveProcess({
        ids:id
      }).then((res)=>{
        if(res.code === 0){
            this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.getoriOrderList()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    toAuditedAllFn(){
      if(this.selectAll.length>0){
        var AuditedAllArr = []
        this.selectAll.forEach((item)=>{
          if(item.amazon_ship === 1 && item.is_checked =="0"){
            AuditedAllArr.push(item.id)
          }
        })
        moveProcess({
          ids:AuditedAllArr
        }).then((res)=>{
          if(res.code === 0){
              this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.selectAll = []
            this.selectkey = []
            this.selectedRowKeys = []
            this.getoriOrderList()
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }else{
        this.$notification.error({
          message: '提示',
          description: '请先勾选订单'
        })
      }
    },
    //选择物流公司
    selectLogistics(type){
      if(this.logisticSelectShow == type){
        this.logisticSelectShow = 0
        this.company = ''
        this.getAllChannels()
        this.queryParamchange()
      }else{
        if(type==1){
          this.logisticSelectShow = 1
          this.company = 'fpx'
        }else if(type==2){
          this.logisticSelectShow = 2
          this.company = 'yw'
        }else if(type==3){
          this.logisticSelectShow = 3
          this.company = 'sf'
        }else if(type==4){
          this.logisticSelectShow = 4
          this.company = 'yt'
        }else if(type==5){
          this.logisticSelectShow = 5
          this.company = 'yz'
        }
        this.queryParam.logistics = ''
        this.getAllChannels()
        this.queryParamchange()
      }
    },
    //设置国际物流选择物流公司
    selectLogistics1(type){
      this.logisticsValue = ''
      if(this.logisticSelectShow1 == type){
        this.logisticSelectShow1 = 0
        this.company1 = ''
      }else{
        if(type==1){
          this.logisticSelectShow1 = 1
          this.company1 = 'fpx'
        }else if(type==2){
          this.logisticSelectShow1 = 2
          this.company1 = 'yw'
        }else if(type==3){
          this.logisticSelectShow1 = 3
          this.company1 = 'sf'
        }else if(type==4){
          this.logisticSelectShow1 = 4
          this.company1 = 'yt'
        }else if(type==5){
          this.logisticSelectShow1 = 5
          this.company1 = 'yz'
        }
        this.getAllChannels1()
      }
    },
    selectLogistics2(type){
      this.logisticsValue1 = ''
      this.logisticsInfo1[0].channel_code = ''
      this.logisticsInfo1[0].logistics_channel_code = ''
      this.logisticsInfo1[0].logistics_channel_name = ''
      this.logisticsInfo1[0].freight = ''
      this.logisticsInfo1[0].limit = ''
      this.logisticsInfo1[0].address = ''
      this.logisticsInfo1[0].ArrivalTime = ''
      if(this.logisticSelectShow2 == type){
        this.logisticSelectShow2 = 0
        this.company2 = ''
      }else{
        if(type==1){
          this.logisticSelectShow2 = 1
          this.company2 = 'fpx'
        }else if(type==2){
          this.logisticSelectShow2 = 2
          this.company2 = 'yw'
        }else if(type==3){
          this.logisticSelectShow2 = 3
          this.company2 = 'sf'
        }else if(type==4){
          this.logisticSelectShow2 = 4
          this.company2 = 'yt'
        }else if(type==5){
          this.logisticSelectShow2 = 5
          this.company2 = 'yz'
        }
        this.getAllChannels2()
      }
    },
    //标记完成
    markComplete(){
      if(this.selectAll.length>0){
        let ids = []
        this.selectAll.forEach((item,index)=>{
          ids.push(item.id)
        })
        ids = ids.join(',')
        orderMarkComlete({ids:ids}).then(res=>{
          if (res.code === 0) {
            if (res.data) {
              this.screenType='3'
              this.queryInfo = {
                page: this.current,
                page_size:"10",
                keywords: this.queryParam.orderNumber,
                status: '4',
                is_checked: '1',
                country: this.countryId,
                store_id: this.storeId,
                channel: this.channelValue,
                company: this.company,
                sort:this.sort
              }
              this.getoriOrderList()
              this.selectAll = []
            }
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.selectkey = []
            this.selectedRowKeys = [];
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }else{
        this.$notification.error({
          message: '提示',
          description: '请先勾选订单数据'
        })
      }
    },
    //获取物流权限
    getLogisticsCompanys(){
      getLogisticsCompany().then(res=>{
        if (res.code === 0) {
          if (res.data.data) {
            res.data.data.forEach((item,index)=>{
              if(item.code=='fpx'){
                this.logisticStatus1 = true
              }else if(item.code=='yw'){
                this.logisticStatus2 = true
              }else if(item.code=='sf'){
                this.logisticStatus3 = true
              }else if(item.code=='yt'){
                this.logisticStatus4 = true
              }else if(item.code=='yz'){
                this.logisticStatus5 = true
              }
            })
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //标记
    tabSetingColor(id){
      this.selectColor = [
        {
          color: "#61bd50",
          key: "0",
          name: "",
          type:0

        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:0
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:0
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:0
        },
          {
          color: "#7f09f8",
          key: "4",
          name: "",
          type:0
        },
        {
          color: "#137abf",
          key: "5",
          name: "",
          type:0
        }
      ],
      this.EditSignId=id
      this.data.forEach((item,index)=>{
        if(item.id === id){
          if(item.color_mark){
            this.selectColor.forEach((it,ix)=>{
              item.color_mark.forEach((im,inx)=>{
                if(it.key === im.key){
                  it.type = im.type
                  it.name = im.name
                }
              })
            })
          }
        }
      })
      this.colorData = deepClone(this.selectColor)
      this.TabColor = true
    },
    TabColorOk(){
      let color_mark = []
      this.colorData.forEach((item,index)=>{
        // if(item.type){
          color_mark.push(item)
        // }
      })
      this.selectColor = deepClone(this.colorData)
      this.updataColorMarkFn(this.EditSignId,color_mark)


    },
    //请求保存当前的标记
    updataColorMarkFn(id,color_mark){
      updataColorMark({
        id:id,
        color_mark:color_mark
      }).then(res=>{
        if(res.code === 0){
          this.getoriOrderList()
          this.TabColor = false
          this.editingKey = ''
        }
      })
    },
    TabColorCancel(){
      this.TabColor = false
      this.editingKey = ''
    },
    edit(key) {
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.colorData = newData;
      }
    },
    use(key){
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      target.type==1 ?target.type=0:target.type=1
      this.selectColor = newData
      this.colorData = deepClone(this.selectColor)
    },
    save(key) {
      const newData = [...this.colorData];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.colorData = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    handleChangeName(value, key, column,e) {
      //正 0 name
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.colorData = newData;
      }
    },
    // 批量操作
    batchOperation(type){
      if(this.selectkey.length>0){
        // 1 批量虚拟发货   、
        // 2 批量设置报关 、
        // 3 批量标记 、
        // 4 批量修改收件人信息 、
        // 5 批量设置国际物流
        // 6 设置国内单号
        // 7 批量设置国内物流
        // 8 批量更换国内物流
        // 9 打回待审核 、
        // 10 移入搁置
        // 11 批量还原
        // 12 批量删除
        // 12 批量删除
        if(type === 1){
          this.virtualDelivery()
        }else if(type === 2){
          this.setCustomsInfo()
        }else if(type === 3){
          this.tabSetingColorAll()
        }else if(type === 4){
          this.editConsigneeInfo()
        }else if(type === 5){
          if(this.isErpId !=="all"){

            this.setCacheFn()
            this.setLogistics()
          }else{
            this.$notification.error({
              message: '错误',
              description: "请选择是否经过ERP"
            })
          }

        }else if(type === 6){
          this.setCacheFn()
          this.setDocNo()
        }else if(type === 7){
        }
        // else if(type === 8){}
        else if(type === 9){
          this.moveNoVerify()
        }else if(type === 10){
          this.moveShelve()
        }else if(type === 11){
          this.revertOrder()
        }else if(type === 12){
          this.deleteOrder()
        }else if(type===13){
          this.setTemplate()
        }
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先勾选操作的选项'
        })
      }
    },
    // 报关模板
    clearanceTemplate(){
      this.clearanceTemplateV = true
      this.getClearanceTemplateFn()
    },
    addTemplate(type){
      this.showTemplate = true
      this.isTemplate = type
    },
    clearanceTemplateOk(){
      if(this.showTemplate){
        if(this.template.cnName && this.template.enName && this.template.usd && this.template.weight){
          //新增保存
          if(this.isTemplate === "add"){
            this.template.id = ""
            this.editclearancetemplateFn(this.template)
          }else if(this.isTemplate === "edit"){
            this.template.id = this.templateId
            this.editclearancetemplateFn(this.template)
          }
        }else{
          let errInfo = []
          this.template.cnName?"":errInfo.push("中文报关")
          this.template.enName?"":errInfo.push("英文报关")
          this.template.usd?"":errInfo.push("报关金额")
          this.template.weight?"":errInfo.push("重量")
          let errMsg = errInfo.join(",")
          this.$notification.error({
            message: '错误',
            description: errMsg +"不能为空"
          })
        }
      }else{
        this.clearanceTemplateV = false
      }
    },
    clearanceTemplateCancel(){
      if(this.showTemplate){
        this.showTemplate = false
        this.clearInfoFn()
        this.getClearanceTemplateFn()
      }else{
        this.clearanceTemplateV = false
        this.showTemplate = false
        this.clearInfoFn()
      }
    },
    setTemplate(){
      this.setTemplateAll = true
      this.getSetTemplateAllFn()
    },
    // 关闭批量设置弹窗
    setTemplateAllCancel(){
      this.setTemplateAll = false
    },
  templateAllPageChange(page,pagesize){
      this.templateAllCurrent = page;
      this.getSetTemplateAllFn()
    },
  getSetTemplateAllFn(){
      getClearanceTemplate({
        page:this.templateAllCurrent,
        page_size:"10"
      }).then(res =>{
        if(res.code === 0){
          this.templateAllData = handlerData(res.data)
          this.templateAllPage = res.pages
        }
      })
    },
    templateQuote(id){
      batchSetClearance({
        id:this.selectkey,
        template_id:id
      }).then(res=>{
        if(res.code === 0){
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.setTemplateAllCancel()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    // 清空报关信息数据
    clearInfoFn(){
      this.template = {
        cnName:"",
        enName:"",
        usd:"",
        weight:"",
        type:"",
        desc:"",
        battery_status:0
      }
    },
    //是否含电
    isBatteryChange(e){
      e.target.checked?this.template.battery_status=1:this.template.battery_status=0
    },
    // 报关分页
    templatePageChange(page,pagesize){
      this.templateCurrent = page;
      this.getClearanceTemplateFn()
    },
    //批量设置报关信息弹窗
    setCustomsInfo(){
      orderClearance({
        ids:this.selectkey
      }).then((res)=>{
        if(res.code===0){
          this.customsData = res.data
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
      this.customsVisible = true
    },
    customsOk(){
      updateClearance({
        clearance:this.customsData
      }).then((res)=>{
        if(res.code === 0){
          this.customsVisible = false
          this.selectkey = []
          this.selectedRowKeys = [];
          this.getoriOrderList()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    customsCancel(){
      this.customsVisible = false
    },
    getClearanceTemplateFn(){
      getClearanceTemplate({
        page:this.templateCurrent,
        page_size:"10"
      }).then(res =>{
        if(res.code === 0){
          this.templateData = handlerData(res.data)
          this.templatePage = res.pages
        }
      })
    },
    // 新增模板 修改模板
    editclearancetemplateFn(data){
      editclearancetemplate(data).then(res=>{
        if(res.code === 0){
          // 关闭弹窗
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.clearanceTemplateCancel()
        } else{
          this.$notification.error({
            message: '失败',
            description: res.msg
          })
          this.clearInfoFn()
          this.showTemplate = !this.showTemplate
          this.getClearanceTemplateFn()
        }
      })
    },
    templateEdit(id){
      var that = this
      that.addTemplate("edit")
      that.templateId = id
      if (that.templateData.length > 0) {
        this.templateData.forEach(function(item) {
          if (item.id == id) {
            that.template.enName = item.enName
            that.template.cnName = item.cnName
            that.template.usd = item.usd
            that.template.weight = item.weight
            that.template.battery_status = parseInt(item.battery_status)
            that.template.type = item.type
            that.template.desc = item.desc
            return
          }
        });
      }
    },
    templateDel(id){
      this.templateDelId = id
      deleteClearanceTemplate({
        id
      }).then(res=>{
        if(res.code===0){
          this.getClearanceTemplateFn()
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
        }
      })
    },

    //批量移入搁置
    moveShelve(){
      moveShelve({
        ids:this.selectkey
      }).then((res)=>{
        if(res.code === 0){
          this.selectkey = []
          this.selectedRowKeys = [];
          this.getoriOrderList()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //打回待审核
    moveNoVerify(){
      moveProcess({
        ids:this.selectkey
      }).then((res)=>{
        if(res.code === 0){
          this.selectkey = []
          this.selectedRowKeys = [];
          this.getoriOrderList()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //订单还原到之前的状态
    revertOrder(){
      orderRevert({
        ids:this.selectkey
      }).then((res)=>{
        if(res.code === 0){
          this.selectkey = []
          this.selectedRowKeys = [];
          this.getoriOrderList()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //搁置的订单批量删除
    deleteOrder(){
      batchDelete({
        ids:this.selectkey
      }).then((res)=>{
        if(res.code === 0){
          this.selectkey = []
          this.selectedRowKeys = [];
          this.getoriOrderList()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //批量设置国际物流弹窗
    setLogistics(){
      this.logisticsVisible = true
      this.getOrderLogistics()
    },
    // 获取国际物流
    getForeignChannelFn(){
      getForeignChannel({}).then(res=>{
        if(res.code === 0){
          this.Channel1 = res.data
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    getForeignChannelFn1(){
      getForeignChannel({}).then(res=>{
        if(res.code === 0){
          this.Channel2 = res.data
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    logisticsOk(){
      let type = 1
      this.LogisticsInfo.forEach((item,index)=>{
        if(item.type==2){
          type=2
        }
      })
      if(type==2){
        judgeBalance({
          logistics:this.LogisticsInfo
        }).then((res)=>{
          if(res.code==0){
            this.updateLogistics = true
            this.updateLogisticsMsg = res.data
            if(res.code!==0){
              this.topUpStatus = true
            }else{
              this.topUpStatus = false
            }
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }else{
        this.updateLogisticsOk()
      }
    },
    logisticsCancel(){
      this.logisticsVisible = false
      this.logisticSelectShow1 = 0
      this.company1 = ''
      this.logisticsValue = ''
      this.Channel1 = []
      this.isPassERPValue = false
      this.LogisticsInfo = []
      this.selectAllOne = []
      this.selectkeyOne = []
      this.selectedRowKeysOne = []
      this.cacheFn()
    },
    updateLogisticsOk(){
      let errflag = true
      for (var view in this.LogisticsInfo){
        if(this.isPassERPValue){
          if(this.LogisticsInfo[view].international_number=="" || this.LogisticsInfo[view].logistics_channel_name==""){
            errflag = false
            break
          }
        }else{
          if( this.LogisticsInfo[view].logistics_channel_name==""){
            errflag = false
            break
          }
        }
      }
      if(errflag){
        saveLogisticsData({
          logistics:this.LogisticsInfo
        }).then((res)=>{
          if(res.code===0){
            this.logisticsVisible = false
            this.updateLogistics = false
            this.logisticSelectShow1 = 0
            this.company1 = ''
            this.logisticsValue = ''
            this.Channel1 = []
            this.isPassERPValue = false
            this.LogisticsInfo = []
            this.selectAllOne = []
            this.selectkeyOne = []
            this.selectedRowKeysOne = []
            this.selectAll = []
            this.selectkey = []
            this.selectedRowKeys= []
            this.getoriOrderList()
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
          }else{
            this.logisticsVisible = false
            this.updateLogistics = false
            this.logisticSelectShow1 = 0
            this.company1 = ''
            this.logisticsValue = ''
            this.Channel1 = []
            this.isPassERPValue = false
            this.LogisticsInfo = []
            this.selectAllOne = []
            this.selectkeyOne = []
            this.selectedRowKeysOne = []
            this.selectAll = []
            this.selectkey = []
            this.selectedRowKeys= []
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }else{
        this.$notification.error({
          message: '错误',
          description: '选择国际物流和国际单号'
        })
      }
    },
    updateLogisticsCancel(){
      this.updateLogistics = false
    },
    updateLogisticsOk1(){
      saveLogisticsData({
        logistics:this.logisticsInfo1
      }).then((res)=>{
        if(res.code===0){
          this.editeLogistics = false
          this.updateLogistics1 = false
          this.logisticSelectShow2 = 0
          this.company2 = ''
          this.logisticsValue1 = ''
          this.Channel2 = []
          this.isPassERPValue1 = false
          this.LogisticsInfo = ''
          this.cacheFns()
          this.getoriOrderList()
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
        }else{
          this.editeLogistics = false
          this.updateLogistics1 = false
          this.logisticSelectShow2 = 0
          this.company2 = ''
          this.logisticsValue1 = ''
          this.Channel2 = []
          this.isPassERPValue1 = false
          this.LogisticsInfo = ''
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    updateLogisticsCancel1(){
      this.updateLogistics1 = false
    },
    goTopUp(){
      let routeData = this.$router.resolve({ path: '/rechange/fund' });
      window.open(routeData.href, '_blank');
    },
    //是否不经过ERP官方仓库发货
    isPassERP(e){
      this.isPassERPValue = e.target.checked
      this.Channel1 = []
      this.logisticSelectShow1 = 0
      this.company1 = ''
      this.logisticsValue = ''
      if(this.isPassERPValue){
        this.getForeignChannelFn()
      }
      this.LogisticsInfo.forEach((item,index)=>{
        item.channel_code = ''
        item.logistics_channel_code = ''
        item.logistics_channel_name = ''
      })
    },
    isPassERP1(e){
      this.isPassERPValue1 = e.target.checked
      this.Channel2 = []
      this.logisticSelectShow2 = 0
      this.company2 = ''
      this.logisticsValue1 = ''
      if(this.isPassERPValue1){
        this.getForeignChannelFn1()
      }
      this.logisticsInfo1.channel_code = ''
      this.logisticsInfo1.logistics_channel_code = ''
      this.logisticsInfo1.logistics_channel_name = ''
    },
    //条件确认
    verifyKey(){
      if(this.selectAllOne.length){
        getWarehouseAddressFund({
          ids:this.selectkeyOne,
          channel_code:this.logisticsValue
        }).then((res)=>{
          if(res.code == 0){
            this.selectAllOne.forEach((item,index)=>{
              item.channel_code = this.logisticsValue
              item.logistics_channel_code = this.logisticsValue
              item.logistics_channel_name = this.channel_name
              if(JSON.stringify(res.data) !== "{}"){
                res.data.forEach((itm,idx)=>{
                  if(item.id == itm.id){
                    item.freight = itm.freight
                    item.limit = itm.limit
                    item.address = itm.address
                    item.ArrivalTime = itm.ArrivalTime
                  }
                })
              }
            })
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }else{
        this.$notification.error({
          message: '错误',
          description: '请选择数据'
        })
      }
    },
    //获取订单的物流方式
    getOrderLogistics(){
      getOrderLogistics({
        ids:this.selectkey
      }).then((res)=>{
        if(res.code==0){
          this.LogisticsInfo = res.data
          if( this.LogisticsInfo[0].warehouse == 1){
            this.isPassERPValue = false
          }else if( this.LogisticsInfo[0].warehouse == 2){
            this.isPassERPValue = true
          }else{
            this.isPassERPValue = false
          }
        let ids = []
        this.LogisticsInfo.forEach((item,index)=>{
          ids.push(item.id)
        })
        this.selectedRowKeysOne = ids
        this.selectkeyOne = ids
        this.selectAllOne = this.LogisticsInfo
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    getOrderLogistics1(id){
      getOrderLogistics({
        ids:id
      }).then((res)=>{
        if(res.code==0){
          this.logisticsInfo1 = res.data
          this.editeLogistics = true
          // 1经过erp 2 不经过erp  0未设置
          if(res.data[0].warehouse == 1){
            this.isPassERPValue1 = false
          }else if(res.data[0].warehouse == 2){
            this.isPassERPValue1 = true
          }else{
            this.isPassERPValue1 = false
          }
          this.setCacheFn()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //申请国际单号
    applyOrderNum(){
      let checkedNum = 0
      let islogisticsName = 0
      this.selectAll.forEach((item,index)=>{
        if(item.inland_info.length === 0){
          checkedNum ++
        }
        if(item.logistics_channel_name.length === 0){
          islogisticsName ++
        }
      })
      if(islogisticsName>0){
        this.$notification.error({
          message: '错误',
          description: '请先选择物流方式'
        })
      }else{
        if(checkedNum>0){
          this.orderNoVisible = true
        }else{
          judgeByIds({
            ids:this.selectkey
          }).then((res)=>{
            if(res.code === 0){
              this.applyWaybillNumber = true
              this.applyWaybillMsg = res.data

              if(res.data.flag){
                this.applyTopUpStatus = 1
              }else{
                this.applyTopUpStatus = 0
              }
            }else{
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      }
    },
    orderNoOk(){
      judgeByIds({
        ids:this.selectkey
      }).then((res)=>{
        if(res.code === 0){
          this.applyWaybillNumber = true
          this.applyWaybillMsg = res.data
          if(res.data.flag){
            this.applyTopUpStatus = 1
            // clearInterval(this.timers)
            // // 轮循调用
            // this.monitorInfo()
          }else{
            this.applyTopUpStatus = 0
          }
          this.orderNoVisible = false
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
          this.orderNoCancel()
        }
      })
    },
    orderNoCancel(){
      this.selectAll = []
      this.selectkey = []
      this.selectedRowKeys = []
      this.orderNoVisible = false
    },

    //编辑单个物流方式
    editeLogistic(data){
      this.getOrderLogistics1(data.id)
    },
    editeLogisticsOk(){
      let type = this.logisticsInfo1[0].type
      if(type==2){
        judgeBalance({
          logistics:this.logisticsInfo1
        }).then((res)=>{
          if(res.code==0){
            this.updateLogistics1 = true
            this.updateLogisticsMsg1 = res.data
            if(res.code!==0){
              this.topUpStatus1 = true
            }else{
              this.topUpStatus1 = false
              this.cacheFn()
            }
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            this.orderNoCancel()
          }
        })
      }else{
        this.updateLogisticsOk1()
      }
    },
    editeLogisticsCancel(){
      this.editeLogistics = false
      this.logisticSelectShow2 = 0
      this.company2 = ''
      this.logisticsValue1 = ''
      this.Channel2 = []
      this.isPassERPValue1 = false
      this.LogisticsInfo = ''
    },
    applyWaybillOk(){
      if(!this.applyTopUpStatus){
        this.$notification.error({
          message: '错误',
          description: '余额不足申请国际单号'
        })
      }else{
        createOrder({
          ids:this.selectkey,
          channel_code:this.channelValue
        }).then((res)=>{
          if(res.code === 0){
            this.selectAll = []
            this.selectkey = []
            this.selectedRowKeys = [];
            this.applyWaybillNumber = false
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            clearInterval(this.timers)
            // 轮循调用
            this.monitorInfo(this.selectkey)
            // this.getoriOrderList()
          }else{
            this.applyWaybillNumber = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }
    },
    applyWaybillCancel(){
      this.applyWaybillNumber = false
      this.selectkey = []
      this.selectedRowKeys = []
      this.selectAll = []
    },
    tabSetingColorAll(){
      this.selectColorAll = [
        {
          color: "#61bd50",
          key: "0",
          name: "",
          type:0

        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:0
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:0
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:0
        },
          {
          color: "#7f09f8",
          key: "4",
          name: "",
          type:0
        },
          {
          color: "#137abf",
          key: "5",
          name: "",
          type:0
        }
      ]
      if(this.data[0].color_mark){
        this.selectColorAll.forEach((it,ix)=>{
          this.data[0].color_mark.forEach((im,inx)=>{
            if(it.key === im.key){
              it.name = im.name
            }
          })
        })
      }
      this.colorDataAll = deepClone(this.selectColorAll)
      this.TabColorAll = true
    },
    TabColorAllOk(){
      let ids = this.selectkey.join(',')
      this.orderBatchMarkFn(ids,this.colorDataAll)
      //批量修改标记 接口
    },
    orderBatchMarkFn(id,color_mark){
      orderBatchMark({
        ids:id,
        color_mark:color_mark
      }).then((res)=>{
        if(res.code === 0){
          this.TabColorAll = false
          this.editingKeyAll = ''
          this.selectkey = []
          this.selectedRowKeys = [];
          this.getoriOrderList()
        }
      })
    },
    TabColorAllCancel(){
      this.TabColorAll = false
      this.editingKeyAll = ''
      this.selectkey = []
      this.selectedRowKeys = [];
    },
    editAll(key) {
      const newData = [...this.colorDataAll];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKeyAll = key;
      if (target) {
        target.editable = true;
        this.colorDataAll = newData;
      }
    },
    useAll(key){
      const newData = [...this.colorDataAll];
      const target = newData.filter(item => key === item.key)[0];
      target.type==1 ?target.type=0:target.type=1
      this.selectColorAll = newData
      this.colorDataAll = deepClone(this.selectColorAll)
    },
    saveAll(key) {
      const newData = [...this.colorDataAll];
      const newCacheData = [...this.cacheDataAll];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.colorDataAll = newData;
        Object.assign(targetCache, target);
        this.cacheDataAll = newCacheData;
      }
      this.editingKeyAll = '';
    },
    handleChangeNameAll(value, key, column,e) {
      //正 0 name
      const newData = [...this.colorDataAll];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.colorDataAll = newData;
      }
    },
    //批量清空标记
    clearSign(){
    this.selectColorAll.forEach((item,index)=>{
      item.type = 0
    })
    this.colorDataAll = deepClone(this.selectColorAll)
    },
    //批量修改收货人信息
    editConsigneeInfo(){
      this.consigneeData = null
      let ids = this.selectkey.join(',')
      orderGetAddress({
        ids:ids
      }).then(res =>{
        if(res.code === 0){
          this.consigneeData = res.data
          this.editConsigneeInfoVisible = true
        }
      })
    },
    editConsigneeInfoOk(){
      this.orderUpdaAddressFn(this.consigneeData)
    },
    orderUpdaAddressFn(address){
      orderUpdaAddress({
        address:address
      }).then(res=>{
        if(res.code === 0){
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
          this.editConsigneeInfoVisible = false
          this.selectkey = []
          this.selectedRowKeys = [];
        }else{
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
        }
      })
    },
    editConsigneeInfoCancel(){
        this.editConsigneeInfoVisible = false
        this.selectkey = []
        this.selectedRowKeys = [];
    },
    //批量虚拟发货
    virtualDeliverys(){
      let ids = this.selectkey.join(',')
      this.orderVirtualSendFn(ids,)
    },
    orderVirtualSendFn(ids){
      orderVirtualSend({
        ids:ids
      }).then(res=>{
        if(res.code === 0){
          this.selectkey = []
          this.selectedRowKeys = [];
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    monitorInfo(id){
      this.timers = setInterval(()=>{
        mwsOrderPush({
          id
        }).then(res=>{
          if(res.code === 0){
            let monitorInfos = handlerData(res.data)
            if(monitorInfos.length>0){
              clearInterval(this.timers)
              this.data.forEach((item) =>{
                monitorInfos.forEach((im)=>{
                  if(item.id === im.id){
                    item.logistics_channel_code = im.logistics_channel_code
                    item.error_message = im.error_message
                    item.virtual = im.virtual
                  }
                })
              })
            }else{

            }
          }else{

          }
        })
      },1500)
    },
    editConsigneeInfoCancel(){
        this.editConsigneeInfoVisible = false
        this.selectkey = []
        this.selectedRowKeys = [];
    },
   //批量虚拟发货
    virtualDelivery(){
      let ids = this.selectkey.join(',')
      this.orderVirtualSendFn(ids,)
    },
    orderVirtualSendFn(ids){
      orderVirtualSend({
        ids:ids
      }).then(res=>{
        if(res.code === 0){
          this.selectkey = []
          this.selectedRowKeys = [];
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          clearInterval(this.timers)
           // 轮循调用
          this.monitorInfo(ids)
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    setDocNo(){
      let ids = this.selectkey.join(',')
      getOrderLnland({ids:ids}).then(res=>{
        if(res.code === 0 ){
          this.tableData = res.data
          this.setDocNoVisible = true
        }
      })
    },
    setDocNoOk(){
      //调用子组件的方法
        this.$refs.eventEditDomesticNo.submitEditNo();
    },
    setDocNoCancel(){
      this.setDocNoVisible = false
      this.selectkey = []
      this.selectedRowKeys = [];
      //根据缓存请求
      this.cacheFn()

    },
    orderSync(){
      // this.orderSyncVisible = true
      syncOrder().then((res)=>{
        if(res.code==0){
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
    orderExport(){
      this.queryInfo.start_date = moment(this.startValue).format('YYYY-MM-DD')
      this.queryInfo.end_date = moment(this.endValue).format('YYYY-MM-DD')
      exportOrder(this.queryInfo).then((res)=>{
        if(res.code==0){
          if (res.data) {
            window.open(res.data , '_blank')
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          }
        }
      })
    },
    orderSynCancel(){
      this.orderSyncVisible = false
    },
    orderSyncOk(){

    },
    closeEdit(){
      this.setDocNoCancel()
      this.screen("1",0,1)

    },
    //根据缓存请求
    cacheFn(){
      let cacheInfo = Vue.ls.get('cacheInfo')
      this.storeId = cacheInfo.storeId
      this.countryId = cacheInfo.countryId
      this.isErpId = cacheInfo.isErpId
      this.logisticSelectShow = cacheInfo.logisticSelectShow
      this.isWaybillId = cacheInfo.isWaybillId
      this.sortId = cacheInfo.sortId
      this.current = cacheInfo.current
      this.screen(this.screenType,0,1)
    },
    setCacheFn(){
      let cacheInfo = {
        storeId:this.storeId,
        countryId:this.countryId,
        isErpId:this.isErpId,
        logisticSelectShow:this.logisticSelectShow,
        isWaybillId:this.isWaybillId,
        sortId:this.sortId,
        current:this.current,
      }
      Vue.ls.set("cacheInfo",cacheInfo)
    },

    cacheFns(){
      let cacheInfo = Vue.ls.get('cacheInfo')
      this.storeId = cacheInfo.storeId
      this.countryId = cacheInfo.countryId
      this.isErpId = cacheInfo.isErpId
      this.logisticSelectShow = cacheInfo.logisticSelectShow
      this.isWaybillId = cacheInfo.isWaybillId
      this.sortId = cacheInfo.sortId
      this.current = cacheInfo.current
    },

  },
  filters: {
    prices(val) {
      if (val === '0.00') {
        return ''
      } else {
        return '￥' + val
      }
    },
    logisticsPrices(vals) {
      if (vals === '0.00') {
        return '0.00元'
      } else {
        return vals + '元'
      }
    }
  }
}
</script>
<style scoped lang='less'>
.mt {
  margin-top: 20px;
}
.ml {
  margin-left: 20px;
}
.mr {
  margin-right: 20px;
}
.mt-sm {
  margin-top: 10px;
}
.mr-sm {
  margin-right: 5px;
}
.ml-sm {
  margin-left: 5px;
}
.mb-sm{margin-bottom: 5px;}
.modal_box {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
}
.tac {
  text-align: center;
}
.tar{
  text-align: right;
}
.dis-flex{
  display:flex;
  justify-content: flex-end;
}
.order-code-color{
  color:#1890ff ;
}
.details-box{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.order-txt-box{
}
.dis-flexs{
  display: flex;
  justify-content: flex-start;
}
.flex-wraps{
  flex-wrap: wrap;
  justify-content: flex-start;
}
.sprite-pic-success{
  display: block;
  width: 45px;
  height: 21px;
  background: url('../../assets/sprite/sprite.png') no-repeat 4px -30px;
}
.sprite-pic-warning{
  display: block;
  width: 45px;
  height: 21px;
  background: url('../../assets/sprite/sprite.png') no-repeat 4px -56px;
}
.min-txt{
  width:200px;
  height:21px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tree-select-q{

}
.titleH{
  line-height:32px ;
}
.edit-title{
  color: #1890ff;
}
</style>
<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.15) !important;
}
.ant-select-tree li span.ant-select-tree-switcher,
.ant-select-tree li span.ant-select-tree-iconEle {
  width: 90%;
  text-align: right;
  position: absolute;
}
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-switcher-noop {
  display: none;
}
.cursor{cursor:pointer;}
.cursor-not{cursor:not-allowed;}
.dis-flex{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.flex{
 display: flex;
 flex-wrap: wrap;
}
.flex-state{
  justify-content: flex-start;
}
.txt-red{
  color: red;
}
.logistics_icon{
  width:140px;
  overflow:hidden;
  height:49px;
  position:relative
}
.logistics_icon:hover .logistics_noselect{
  display: none;
}
.logistics_select{
  position:absolute;
  width:140px;
  height:49px;
  top:0;
  left:0;
}
.logistics_select1{
  width:0;
  height:0;
  border-width:0 0 25px 25px;
  border-style:solid;
  border-color:transparent transparent #1890ff;
  position:absolute;
  right:0;
  bottom:0
}
.logistics_select2{
  color:#fff;
  position:absolute;
  right:2px;
  bottom:1px
}
.logistics_noselect{
  position:absolute;
  width:140px;
  height:49px;
  background-color:#666;
  opacity:0.5;
  top:0;
  left:0;
}
.justift-state{
  justify-content: flex-start;
}
.tal{
  text-align: left;
}



</style>



