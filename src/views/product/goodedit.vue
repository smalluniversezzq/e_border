<template>
  <div>
    <a-form :form="form"  :selfUpdate="true">
      <a-card title='平台选择' :loading="cardLoading">
        <a-form-item
          label="商品来源"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} } "
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} } "
          >
          <a-input v-model="addNewUrl" v-decorator="['ori_url', { initialValue: data.ori_url }]" :disabled="editState" :style="{ display: 'inline-block', width: 'calc(68% - 12px)' }"/>
          <!-- <a-button type="primary" @click="editStatus()" style="margin-left:10px">修改</a-button> -->
          <a-button type="primary" @click="jumpto(data.ori_url)" style="margin-left:10px">查看</a-button>
        </a-form-item>
        <a-form-item
          label="选择店铺"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-select
          placeholder='请选择店铺'
          v-decorator="['store_id', { initialValue:data.store_id == '0' ? '' : data.store_id ,  }]"
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }" @change="ChangeStore">
            <a-select-option value="0">{{'请选择'}}</a-select-option >
            <a-select-option :value="storeItem.id" v-for="(storeItem,index) in storeSelect" :key="index">{{storeItem.title}}</a-select-option >
          </a-select>
        </a-form-item>
        <a-form-item
          label="站点信息"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-button class='ml-sm' :disabled='tabClassLoading === true ? true : false' :type='initCountry===item.title ? "primary":"dashed"' v-for='(item,index) in siteSelect'  :key="index" @click='tabCountry(item.title)'>{{item.value}}</a-button>
          <a-button v-if='disabShow === false' type="primary" @click='toCN' :style="{ display: 'inline-block',marginLeft:'24px' }">{{categoryCN === true ?'切换语言' :'切换语言(CN)'}}</a-button>
        </a-form-item>
        <a-form-item
          label="语言"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <div>
          <a-button @click='tabLanguage(true)' :type="ORI === 'ORI' &&  initCountry =='CN' ? 'primary':'dashed'">原语言</a-button>
            <img :src="tabico" alt="">
           <!-- <span style='width="100px"'>
              翻译
            <a-icon type="swap"  /> -->
           <!-- </span> -->
           <a-button @click='tabLanguage(false)' :type="ORI === 'ORI' &&  initCountry =='CN' ? 'dashed':'primary'">中文</a-button>
          </div>
        </a-form-item>
        <a-form-item
          v-for="(im,index) in siteSelect" 
          :key="index"
          v-show='initCountry == im.title'
          :label="'产品分类('+ im.value +')'"
          :labelCol="labelCol"
          :wrapperCol="{span:15}"
        >
          <!-- 德国 -->
            <a-select
              :defaultOpen='showOpen.DE'
              v-if ="im.title == 'DE'"
              :filterOption="filterOption"
              showSearch
              optionFilterProp="children"
              @blur="handleBlur"
              @focus="handleFocus(item)"
              :disabled='disabShow'
              placeholder='请选择产品分类' :class="(index%3 ===0 ) ? '' : 'ml'"
              v-for='(item,index) in selectListDE'
              :key="index"
              @change='classChange(selectValueDE[index],index,im.title)'
              v-model='selectValueDE[index]'
              :style="{ width: 'calc(30% )' }" 
              >
              <a-select-option   :class="showOpen.DE ? 'show' : 'hide'" v-for="(itemChild,inx) in item" :key="inx"  :value="itemChild.id" >
                <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
              </a-select-option>
            </a-select>
          <!-- 法国 -->
          <a-select
          :defaultOpen='showOpen.FR'
           :filterOption="filterOption"
            v-if ="im.title == 'FR'"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 === 0 ) ? '' : 'ml'"
            v-for='(item,index) in selectListFR'
            :key="index"
            @change='classChange(selectValueFR[index],index,im.title)'
            v-model='selectValueFR[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option  :class="showOpen.FR ? 'show' : 'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
         <!-- 英国 -->
          <a-select
          :defaultOpen='showOpen.GB'
            v-if ="im.title == 'GB'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 === 0 ) ? '' : 'ml'"
            v-for='(item,index) in selectListGB'
            :key="index"
            @change='classChange(selectValueGB[index],index,im.title)'
            v-model='selectValueGB[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.GB ? 'show' : 'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
           <!-- 意大利 -->
          <a-select
          :defaultOpen='showOpen.IT'
            v-if ="im.title == 'IT'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ? '' : 'ml'"
            v-for='(item,index) in selectListIT'
            :key="index"
            @change='classChange(selectValueIT[index],index,im.title)'
            v-model='selectValueIT[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.IT?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
          <!-- 西班牙 -->
          <a-select
           :defaultOpen='showOpen.ES'
            v-if ="im.title == 'ES'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 === 0 ) ? '' : 'ml'"
            v-for='(item,index) in selectListES'
            :key="index"
            @change='classChange(selectValueES[index],index,im.title)'
            v-model='selectValueES[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.ES?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
           <!-- 美国 -->
          <a-select
            :defaultOpen='showOpen.US'
            v-if ="im.title == 'US'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListUS'
            :key="index"
            @change='classChange(selectValueUS[index],index,im.title)'
            v-model='selectValueUS[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.US?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
          <!-- 加拿大 -->
          <a-select
            :defaultOpen='showOpen.CA'
            v-if ="im.title == 'CA'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListCA'
            :key="index"
            @change='classChange(selectValueCA[index],index,im.title)'
            v-model='selectValueCA[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.CA?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
           <!-- 巴西 -->
          <a-select
          :defaultOpen='showOpen.BR'
            v-if ="im.title == 'BR'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListBR'
            :key="index"
            @change='classChange(selectValueBR[index],index,im.title)'
            v-model='selectValueBR[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.BR?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
          <!-- 墨西哥 -->
          <a-select
          :defaultOpen='showOpen.MX'
            v-if ="im.title == 'MX'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListMX'
            :key="index"
            @change='classChange(selectValueMX[index],index,im.title)'
            v-model='selectValueMX[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.MX?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
         <!-- 阿拉伯联合酋长国 -->
          <a-select
          :defaultOpen='showOpen.AE'
            v-if ="im.title == 'AE'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListAE'
            :key="index"
            @change='classChange(selectValueAE[index],index,im.title)'
            v-model='selectValueAE[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.AE?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
          <!-- 印度 -->
          <a-select
          :defaultOpen='showOpen.IN'
            v-if ="im.title == 'IN'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListIN'
            :key="index"
            @change='classChange(selectValueIN[index],index,im.title)'
            v-model='selectValueIN[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.IN?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
            <!-- 土耳其 -->
          <a-select
          :defaultOpen='showOpen.TR'
            v-if ="im.title == 'TR'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListTR'
            :key="index"
            @change='classChange(selectValueTR[index],index,im.title)'
            v-model='selectValueTR[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.TR?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
          <!-- 日本 -->
          <a-select
            :defaultOpen='showOpen.JP'
            v-if ="im.title == 'JP'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListJP'
            :key="index"
            @change='classChange(selectValueJP[index],index,im.title)'
            v-model='selectValueJP[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.JP?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
          <!-- 澳大利亚 -->
          <a-select
            :defaultOpen='showOpen.AU'
            v-if ="im.title == 'AU'"
            :filterOption="filterOption"
            showSearch
            optionFilterProp="children"
            @blur="handleBlur"
            @focus="handleFocus(item)"
            :disabled='disabShow'
            placeholder='请选择产品分类' :class="(index%3 ===0 ) ?'':'ml'"
            v-for='(item,index) in selectListAU'
            :key="index"
            @change='classChange(selectValueAU[index],index,im.title)'
            v-model='selectValueAU[index]'
            :style="{ display: 'inline-block', width: 'calc(30% )' }" 
            >
            <a-select-option :class="showOpen.AU?'show':'hide'" v-for="(itemChild,inx) in item" :key="inx" :value="itemChild.id" >
              <div class='tal'>{{categoryCN === true ? itemChild.category : itemChild.category_cn}}<a-icon v-if='itemChild.is_menu === "1"' class='rt' type="right" /></div>
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-card >
      <a-card title='商品信息' class='mt' :loading="cardLoading">
        <a-form-item
        v-show='initCountry == "CN" && this.ORI ==="CN"'
        :label="'商品标题(中文)'"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
        <a-input
          v-decorator="['title.'+'CN',{initialValue:addNewProduct === 0 ? dataAll.CN.title : '' ,  }]"
          @blur='changetitle("CN")'
          :style="{ display: 'inline-block',
          width: 'calc(85% - 12px)'}"/>
        </a-form-item>
        <!-- <InputAll /> -->
        <a-form-item
        v-show='ORI === "ORI" &&  initCountry =="CN"'
        :label="'商品标题(原语言)'"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
        <a-input
          v-decorator="['title.'+'ORI',{initialValue:addNewProduct === 0 ? dataAll.ORI.title : '' ,  }]"
          @blur='changetitle("CN")'
          :style="{ display: 'inline-block',
          width: 'calc(85% - 12px)'}"/>
        </a-form-item>
        <a-form-item
          v-show='initCountry == item.title'
          v-for="(item,index) in siteSelect" 
          :key="index"
          :label="'商品标题('+ item.value +')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} }"
        >
        <a-input
            v-decorator="['title.'+item.title,{initialValue: dataAll[item.title] ? dataAll[item.title].title :'',  }]"
            @blur='changetitle(item.title)'
            :style="{ display: 'inline-block',width: 'calc(69% - 12px)'}"/>
          <a-button
          type="primary"
          class='ml'
          v-if='showEN'
          :style="{ display: 'inline-block',width:'calc(18% - 12px)'}"
          @click='tostr(item.title)'>首字母大写</a-button>
        </a-form-item>
        <a-form-item
          v-show='initCountry == "CN" && this.ORI ==="CN"'
          :label="'品牌(中文)'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
          @blur='brandchange()'
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"
          placeholder='请输入品牌名'
          v-decorator="['brand_name.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.brand_name : '',  }]" />
          <a-row class='dis-flex'>
            <a-col >
              <a-alert v-if ='brandwarning' message="品牌名不能为中文" type="warning" banner />
            </a-col>
        </a-row>
        </a-form-item>
        <a-form-item
          v-show='ORI === "ORI" &&  initCountry =="CN"'
          :label="'品牌(原语言)'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
          @blur='brandchange()'
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"
          placeholder='请输入品牌名'
          v-decorator="['brand_name.'+'ORI',
          { initialValue: addNewProduct === 0 ? dataAll.ORI.brand_name : '',
           }]" />
          <a-row class='dis-flex'>
            <a-col >
              <a-alert v-if ='brandwarning' message="品牌名不能为中文" type="warning" banner />
            </a-col>
        </a-row>
        </a-form-item>
        <a-form-item
          v-for="(item,index) in siteSelect" 
          :key="index"
          v-show='initCountry == item.title'
          :label="'品牌('+ item.value +')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
          placeholder='请输入品牌名'
          v-decorator="['brand_name.'+item.title, {initialValue: dataAll[item.title] ? dataAll[item.title].brand_name : '' ,  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px )' }"/>
        </a-form-item>
        <!-- <a-form-item
          v-show='initCountry == "CN" && this.ORI ==="CN"'
          :label="'厂家(中文)'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入厂家'
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"
          @blur='manufacturerchange()'
          v-decorator="['manufacturer.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.manufacturer : '', rules: [{required: checkStatus, message: '厂家不能为空'}] }]" />
          <a-row class='dis-flex'>
            <a-col>
              <a-alert v-if ='manufacturerwarning' message="厂家不能为中文" type="warning" banner/>
            </a-col>
          </a-row>
        </a-form-item> -->
        <!-- <a-form-item
          v-show='ORI === "ORI" &&  initCountry =="CN"'
          :label="'厂家(原语言)'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入厂家'
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"
          @blur='manufacturerchange()'
          v-decorator="['manufacturer.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.manufacturer : '', rules: [{required: checkStatus, message: '厂家不能为空'}] }]" />
          <a-row class='dis-flex'>
            <a-col>
              <a-alert v-if ='manufacturerwarning' message="厂家不能为中文" type="warning" banner/>
            </a-col>
          </a-row>
        </a-form-item> -->
        <!-- <a-form-item
          v-for="(item,inx) in siteSelect" :key='inx+"one"'
          v-show='initCountry == item.title'
          :label="'厂家('+item.value +')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入厂家'
          v-decorator="['manufacturer.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].manufacturer : '', rules: [{required: checkStatus, message: '厂家不能为空'}] }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"/>
        </a-form-item> -->
        <!-- <a-form-item
          v-show='initCountry == "CN" && this.ORI ==="CN"'
          :label="'产品编号(中文)'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
          placeholder='请输入产品编号'
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"
          @blur='partNumberchange()'
          v-decorator="['part_number.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.part_number : '', rules: [{required: checkStatus, message: '产品编号不能为空'}] }]" />
          <a-row  class='dis-flex'>
            <a-col>
              <a-alert v-if ='partNumberwarning'  message="产品编号不能为中文" type="warning" banner/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          v-show='ORI === "ORI" &&  initCountry =="CN"'
          :label="'产品编号(原语言)'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
          placeholder='请输入产品编号'
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"
          @blur='partNumberchange()'
          v-decorator="['part_number.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.part_number : '', rules: [{required: checkStatus, message: '产品编号不能为空'}] }]" />
          <a-row  class='dis-flex'>
            <a-col>
              <a-alert v-if ='partNumberwarning'  message="产品编号不能为中文" type="warning" banner/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          v-for="(item,index) in siteSelect" :key='index+"over"'
          v-show='initCountry == item.title'
          :label="'产品编号('+ item.value +')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
          placeholder='请输入产品编号'
          v-decorator="['part_number.'+item.title, {initialValue:dataAll[item.title] ? dataAll[item.title].part_number : '', rules: [{required: checkStatus, message: '产品编号不能为空'}] }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"/>
        </a-form-item> -->
        <a-form-item
          v-show='initCountry == "CN" && this.ORI ==="CN"'
          :label="'售价(中国)'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
        <a-input-number placeholder='请输入售价'
          v-decorator="['price.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.price : '',  }]" :style="{ display: 'inline-block', width: 'calc(13% )' }"/>
          <span  class='ml-sm' >{{currencyLogo[CN]}}</span>
          <a-input-number  :min="0" class='ml' placeholder='成本'  v-decorator="['cost.CN']"   :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-input-number  :min="0" class='ml' placeholder='运费' v-decorator="['freight.CN']" :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-input-number  :min="0"  class='ml' placeholder='利润' v-decorator="['profit.CN']"  :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-button class='ml' :style="{ display: 'inline-block', width: 'calc(16% )'}" @click='toSum("CN")'>生成售价</a-button >
        </a-form-item>
        <a-form-item
          v-show='ORI === "ORI" &&  initCountry =="CN"'
          :label="'售价(原语言)'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
        <a-input-number placeholder='请输入售价'

          v-decorator="['price.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.price : '',  }]" :style="{ display: 'inline-block', width: 'calc(13% )' }"/>
          <span  class='ml-sm' ></span>
          <a-input-number :min="0" class='ml' placeholder='成本'  v-decorator="['cost.ORI']"   :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-input-number :min="0" class='ml' placeholder='运费' v-decorator="['freight.ORI']" :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-input-number :min="0"  class='ml' placeholder='利润' v-decorator="['profit.ORI']"  :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-button class='ml' :style="{ display: 'inline-block', width: 'calc(16% )'}" @click='toSum("ORI")'>生成售价</a-button >
        </a-form-item>
        <a-form-item
          v-for="(item,index) in siteSelect" 
          :key="index"
          v-show='initCountry == item.title'
          :label="'售价('+ item.value +')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入售价'
          v-decorator="['price.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].price : '',  }]" :style="{ display: 'inline-block', width: 'calc(13% )' }"/>
          <span  class='ml-sm'>{{currencyLogo[item.title]}}</span>
          <!-- v-model='cost'  freight  profit-->
          <a-input-number :min="0" class='ml' placeholder='成本' v-decorator="['cost.'+ item.title]"  :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-input-number :min="0" class='ml' placeholder='运费' v-decorator="['freight.'+ item.title]" :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-input-number :min="0" class='ml' placeholder='利润' v-decorator="['profit.'+ item.title]"  :style="{ display: 'inline-block', width: 'calc(13% )'}"></a-input-number>
          <a-button class='ml' :style="{ display: 'inline-block', width: 'calc(16% )'}" @click='toSum(item.title)'>生成售价</a-button >
        </a-form-item>
        <a-form-item
          label="库存数"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input-number   placeholder='请输入库存数'
          v-decorator="['quantity', { initialValue: addNewProduct === 0 ? data.quantity : '',  }]"
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        </a-form-item>
        <a-form-item
          label="重量"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input-number :min="0"  placeholder='请输入重量' v-decorator="['weight', { initialValue: addNewProduct === 0 ? data.weight : '', }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px )' }"/>
          <span class='ml'>kg</span>
        </a-form-item>
        <a-form-item
          label="尺寸"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input-number :min="0" placeholder='请输入长'  v-decorator="['length', { initialValue: addNewProduct === 0 ? data.length : '',  }]" :style="{ display: 'inline-block', width: 'calc(19% )' }"/>
          <a-input-number :min="0" class='ml-s' placeholder='请输入宽' v-decorator="['width', { initialValue: addNewProduct === 0 ? data.width : '', }]" :style="{ display: 'inline-block', width: 'calc(18% )' }"/>
          <a-input-number :min="0" class='ml-s' placeholder='请输入高' v-decorator="['height', { initialValue: addNewProduct === 0 ? data.height : '',  }]" :style="{ display: 'inline-block', width: 'calc(18% )' }"/>
          <span class='ml'>{{size}}</span>
          <a-button v-if='size === "cm"'  class='ml' @click='toInch'>转换英寸</a-button>
          <a-button v-if='size === "inch"'  class='ml' @click='toCm'>转换厘米</a-button>
        </a-form-item>
        <a-form-item
          label="sku"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入EAN'
          v-decorator="['sku', { initialValue: addNewProduct === 0 ? data.sku : '',  }]"
          :style="{ display: 'inline-block', width: 'calc(69% )' }"/>
          <a-button class='ml' @click='skuRandom' >更换</a-button>
        </a-form-item>
        <a-form-item
          label="EAN"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input   placeholder='请输入EAN'
          v-decorator="['upc', { initialValue: addNewProduct === 0 ? data.upc : '',  }]"
          :style="{ display: 'inline-block', width: 'calc(69% )' }"/>
          <a-button class='ml' @click='upcRandom' >更换</a-button>
        </a-form-item>
      </a-card>
      <a-card v-show='initCountry ==="ORI" || initCountry ==="CN"' title='报关信息' class='mt' :loading="cardLoading">
        <a-form-item
          label="中文名称"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入中文名称'
          v-decorator="['clearance_cnName', {initialValue: addNewProduct === 0 ? data.clearance_cnName : '',  }]"
          :style="{ display: 'inline-block', width: 'calc(69% )' }"/>
        </a-form-item>
        <a-form-item
          label="英文名称"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入英文名称'
          v-decorator="['clearance_enName', { initialValue: addNewProduct === 0 ? data.clearance_enName :'',   }]"
          :style="{ display: 'inline-block', width: 'calc(69% )' }"/>
        </a-form-item>
        <a-form-item
          label="申报金额（usd）"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入申报金额（usd）'
          v-decorator="['clearance_usd', { initialValue: addNewProduct === 0 ? data.clearance_usd : '',   }]"
          :style="{ display: 'inline-block', width: 'calc(69% )' }"/>
        </a-form-item>
        <a-form-item
          label="报关重量（g）"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='请输入报关重量（g）'
          v-decorator="['clearance_weight', { initialValue: addNewProduct === 0 ? data.clearance_weight : '',  }]"
          :style="{ display: 'inline-block', width: 'calc(69% )' }"/>
        </a-form-item>
      </a-card>
      <a-card title='商品详情' class='mt' :loading="cardLoading">
      <a-form-item
        label="添加图片"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
      >
        <!-- <div>
          <div v-for="(item, index) in ImgList" v-dragging="{ list: ImgList, item: item, group: 'image' }" >
      　　　　<img :src="item" alt="">
      　　</div>
        </div> -->

      <template>
        <div class="clearfix">
          <!-- <ImgDrap/> -->
          <draggable
            v-model="fileList"
            :options="{ animation:200 }"
            style="display: flex; flex-wrap: wrap; ">
            <div class="image-box mr-sm" v-for="(item,index) in fileList" :key="index">
              <img :src="item.url" alt="" class="image-box-item over-hidden">
              <div class="mask-layer"></div>
              <a-icon type="eye" class="icon-eye" @click="lookBigImage(item.url, item)"/>
              <a-icon type="delete" class="icon-delete" @click="deleteImage(item.uid)"/>
              <a-icon type="home" class="icon-home" @click="setHomeImage(item.uid, fileList)"/>
            </div>
          </draggable>
          <a-upload
            :action="this.GLOBAL.BASE_URL+'api/b1/product/upload?token='+this.token"
            :multiple='true'
            :defaultFileList="fileList"
            listType="picture-card"
            :fileList="fileList"
            @preview="handlePreview"
            @change="handleChange"
            :beforeUpload="beforeUpload"
            :remove='removes'
          >
            <div v-if="fileList.length < 10">
              <a-icon type="plus" />
              <div class="ant-upload-text" >上传图片</div>
            </div>
          </a-upload>
          <div>
            <a-button @click='changePic' :loading='loading'>一键拉伸图片</a-button>
          </div>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img  id='imgbox' alt="example" style="width: 100%" :src="previewImage" />
            <a-row  class='mt'>
              <a-col v-if='nWidth' :span='4' offset="3">
                <span>{{nWidth}} X {{nHeight}}</span>
              </a-col>
              <a-col offset='17'>
                <a-button @click='toMeitu(previewImage)'>在线美图</a-button>
                <!-- <a-button class='ml' @click='setMain()'>设置为主图</a-button> -->
              </a-col>
            </a-row>
          </a-modal>
        </div>
      </template>
      </a-form-item>
      <a-form-item
        v-show='initCountry == "CN" && this.ORI ==="CN"'
        label="描述信息(中文)"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 14}, xl: {span: 14} ,xxl:{span: 9} }"
      >
        <a-textarea @change="wordCountLimit(1,$event)"
        :style="{ display: 'inline-block', width: 'calc(75.5% - 12px)' }"
        v-decorator="['detail.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.detail : '',  }]"
        placeholder="请输入描述信息" :rows="6"/>
        <span class="limitTip" :class="{beyondClass : isDetailBeyond}">{{detailText}}</span>
      </a-form-item>
      <a-form-item
        v-show='ORI === "ORI" &&  initCountry =="CN"'
        label="描述信息(原语言)"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 14}, xl: {span: 14} ,xxl:{span: 9} }"
      >
        <a-textarea @change="wordCountLimit(1,$event)"
        :style="{ display: 'inline-block', width: 'calc(75.5% - 12px)' }"
        v-decorator="['detail.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.detail : '',  }]"
        placeholder="请输入描述信息" :rows="6"/>
        <span class="limitTip" :class="{beyondClass : isDetailBeyond}">{{detailText}}</span>
      </a-form-item>
      <a-form-item
        v-for="(item,index) in siteSelect" 
        :key="index"
        v-show='initCountry == item.title'
        :label="'描述信息('+ item.value +')'"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 14}, xl: {span: 14} ,xxl:{span: 9} }"
      >
        <a-textarea @change="wordCountLimit(1,$event)"
        :style="{ display: 'inline-block', width: 'calc(75.5% - 12px)' }"
        v-decorator="['detail.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].detail : '',  }]"  
        placeholder="请输入描述信息" :rows="6"/>
        <span class="limitTip" :class="{beyondClass : isDetailBeyond}">{{detailText}}</span>
      </a-form-item>
      <!-- llll -->

      <a-form-item
        v-show='initCountry == "CN" && this.ORI ==="CN"'
        label="五点描述(中文)"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }">
        <a-textarea
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"
          @blur='changeBullet("CN")'
          v-decorator="['initialAll.'+'CN', ]"
          placeholder="请输入五点描述信息" :rows="6"/>
      </a-form-item>
      <a-form-item
        v-show='ORI === "ORI" &&  initCountry =="CN" '
        label="五点描述(原语言)"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }">
        <a-textarea
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"
          @blur='changeBullet("ORI")'
          v-decorator="['initialAll.'+'ORI', ]"
          placeholder="请输入五点描述信息" :rows="6"/>
      </a-form-item>
     <a-form-item
        v-for="(item,index) in siteSelect" 
        :key="index"
        v-show='initCountry == item.title'
        :label="'五点描述('+ item.value +')'"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }">
        <a-textarea
          :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"
          @blur='changeBullet(item.title)'
          v-decorator="['initialAll.'+item.title, {  }]"
          placeholder="请输入五点描述信息" :rows="6"/>
      </a-form-item>

      <!-- llll -->
      <a-form-item
        v-show='initCountry == "CN" && this.ORI ==="CN"'
        label="预览(中文)"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
      >
        <a-input placeholder='描述1'
          v-decorator="['bullet_point1.'+'CN', { initialValue:addNewProduct === 0 ? dataAll.CN.bullet_point1 :'',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述2'

          v-decorator="['bullet_point2.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.bullet_point2 : '',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述3'

          v-decorator="['bullet_point3.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.bullet_point3 :'',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述4'

          v-decorator="['bullet_point4.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.bullet_point4 : '',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述5'

          v-decorator="['bullet_point5.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.bullet_point5 : '',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
      </a-form-item>
      <a-form-item
        v-show='ORI === "ORI" &&  initCountry =="CN"'
        label="预览(原语言)"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
      >
        <a-input placeholder='描述1'
          v-decorator="['bullet_point1.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.bullet_point1 : '',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }" />

        <a-input placeholder='描述2'
          
          v-decorator="['bullet_point2.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.bullet_point2 : '',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述3'
          
          v-decorator="['bullet_point3.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.bullet_point3 : '',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述4'
          
          v-decorator="['bullet_point4.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.bullet_point4 : '',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述5'
          
          v-decorator="['bullet_point5.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.bullet_point5 : '',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
      </a-form-item>

      <a-form-item
        v-for="(item,index) in siteSelect" 
        :key='index'
        v-show='initCountry == item.title'
        :label="'五点描述('+ item.value +')'"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
      >
        <a-input placeholder='描述1'  v-decorator="['bullet_point1.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].bullet_point1 :'',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述2'  v-decorator="['bullet_point2.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].bullet_point2 :'',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述3'  v-decorator="['bullet_point3.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].bullet_point3 :'',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述4'  v-decorator="['bullet_point4.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].bullet_point4 :'',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        <a-input placeholder='描述5'  v-decorator="['bullet_point5.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].bullet_point5 :'',  }]" :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
      </a-form-item>

      <a-form-item
        v-show='initCountry == "CN" && this.ORI ==="CN"'
        label="关键词(中文)"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
      >
        <a-input placeholder='请输入关键词' @change="wordCountLimit(2,$event)"
        v-decorator="['keywords.'+'CN', { initialValue: addNewProduct === 0 ? dataAll.CN.keywords :'',  }]" :style="{ display: 'inline-block', width: 'calc(75.5% - 12px)' }"/>
        <span class="limitTip" :class="{beyondClass : isKeyBeyond}">{{keywordsText}}</span>
      </a-form-item>
      <a-form-item
        v-show='ORI === "ORI" &&  initCountry =="CN"'
        label="关键词(原语言)"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
      >
        <a-input placeholder='请输入关键词' @change="wordCountLimit(2,$event)"
        v-decorator="['keywords.'+'ORI', { initialValue: addNewProduct === 0 ? dataAll.ORI.keywords :'',  }]" :style="{ display: 'inline-block', width: 'calc(75.5% - 12px)' }"/>
        <span class="limitTip" :class="{beyondClass : isKeyBeyond}">{{keywordsText}}</span>
      </a-form-item>
      <a-form-item
        v-for="(item,index) in siteSelect" 
        :key="index"
        v-show='initCountry == item.title'
        :label="'关键词('+ item.value +')'"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
      >
        <a-input placeholder='请输入关键词' @change="wordCountLimit(2,$event)"
        v-decorator="['keywords.'+item.title, { initialValue:dataAll[item.title] ? dataAll[item.title].keywords :'',  }]" :style="{ display: 'inline-block', width: 'calc(75.5% - 12px)' }"/>
        <span class="limitTip" :class="{beyondClass : isKeyBeyond}">{{keywordsText}}</span>
      </a-form-item>
      <a-form-item :wrapperCol="{md: {span: 20, offset: 0}, lg: {span: 20, offset: 1}, xl: {span: 20, offset: 1}, xxl: {span: 20, offset: 2}}">
        <a-row>
          <a-col>
            <span v-if='Number(this.$store.state.user.balance) <= 0 ' class='cursor character-box' style='color:#3885e1' @click='Recharge()'>
              立即充值
            </span>
            <span class='mr' v-if='Number(this.$store.state.user.balance) > 0'>
              <i  class='character'>{{characterTxt}}</i>
            </span> 
            <a-select class='mr' v-model='defaultSlate' @change='SlateChange' style="width: 150px"  >
              <a-select-option  value="1" >谷歌（收费） </a-select-option>
              <!-- <a-select-option  value="2" >有道（收费）</a-select-option> -->
              <a-select-option  value="3" >谷歌（免费） </a-select-option>
              <a-select-option  value="4" >谷歌插件（免费） </a-select-option>
            </a-select>
            <a-button v-if="initCountry ==='CN'" :loading='interLoading' style="width:100px" @click='interpretAll()' >一键翻译</a-button>
            <a-button  v-if="initCountry !=='CN'" class='ml' :loading='interLoading' style="width:100px" @click='Tointerpret()' >翻译</a-button>
            <a-button type="primary" style='margin-left:15px; width:100px;' :loading='subloading' @click="nextStep">保存</a-button>
            <a-button class='ml' @click='goBack()'>返回</a-button>
          </a-col>
        </a-row>
      </a-form-item>
      </a-card>
    </a-form>
    <a-modal title="消费确认" :visible="transPayVisibles" @ok="handleOkTrans" @cancel="handleCancelTrans">
      <p>消费类型：翻译</p>
      <p>消费详情谷歌：翻译{{transWordLength}}字节(谷歌)</p>
      <p style="color:#f3ec09">预估本次消费：{{transWordMoney}}元</p>
    </a-modal>
  </div>
</template>
<script>
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
import Vue from 'vue'
import { trans_fee , transPlugin , trans , updateGood , getGoodsList , upload , imgRessize , authCountry , getMyStore , mwsReverse , productCurrency , getUpc } from '@/api/collect'
import { countryORlanguages , currencyList , Europe ,OZorBM , codeORcountry } from '@/views/order/public/country'
import InputAll from '@/views/product/components/InputAll.vue'
// import ImgDrap from '@/components/imgDrap'
import draggable from 'vuedraggable'
export default {
  name: 'goodedit',
  // components:{ImgDrap},
  components: {
    //调用组件
    draggable,
    InputAll,
  },
  data () {
    return {
      addNewUrl:'',
      editState: true,
      token: '',
      apipost:"/api/site/upload",
      dataAll: '',
      codeORcountry,
      data:"",
      OZorBM,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
      form: this.$form.createForm(this),
      loading: false,
      cardLoading:true,
      imageUrl: '',
      previewVisible: false,
      previewImage: '',
      titles:"商品标题",
      imglist:"",
      imglists:"",
      ImgList: [
        require('@/assets/image/order.png'),
        require('@/assets/image/goods.png'),
        require('@/assets/image/tow.png'),
        require('@/assets/image/therr.png'),
        require('@/assets/image/showsell.png')
      ],
      fileList: [],
      tabZN:"primary",
      tabEN:"",
      toEN:"",
      goodsId:"",
      site:"",
      fileName:"",
      uploadimg:"",
      subimg:"",
      goodsimg:[],
      goodsimgs:"",
      subtime:false,
      radiovalue:0,
      showEN:true,
      strify :"",
      enstrify:"",
      d:[],
      checkStatus:false,
      CN:'CN',
      ENindex:[],
      language:{
        de:"DE",
        es:"ES",
        it:"IT",
        fr:"FR",
        en:"GB",
        au:"AU",
        jp:"JP"
      },
      initCountry:"CN",
      currencyLogo:{
        CN:"￥",
      },
      currencyType:"",
      currencyList,
      Europe,
      languageValue:"en",
      fileID:"",
      imgMain:"",
      nWidth:"",
      nHeight:"",
      imgUrl:"",
      imgId:"",
      loading:false,
      interLoading:false,
      tabClassLoading:false,
      subloading:false,
      ENList:"",
      showtow:false,
      selectListDE:[],
      selectListES:[],
      selectListIT:[],
      selectListUS:[],
      selectListCA:[],
      selectListMX:[],
      selectListAE:[],
      selectListBR:[],
      selectListFR:[],
      selectListGB:[],
      selectListIN:[],
      selectListTR:[],
      selectListAU:[],
      selectListJP:[],
      selectValue:[],
      classValue:"",
      classValueDE:"",
      classValueES:"",
      classValueIT:"",
      classValueUS:"",
      classValueCA:"",
      classValueMX:"",
      classValueAE:"",
      classValueBR:"",
      classValueFR:"",
      classValueGB:"",
      classValueIN:"",
      classValueTR:"",
      classValueAU:"",
      classValueJP:"",
      storeSelect:"",
      classNode:{},
      classNodeDE:"",
      classNodeES:"",
      classNodeIT:"",
      classNodeUS:"",
      classNodeCA:"",
      classNodeMX:"",
      classNodeAE:"",
      classNodeBR:"",
      classNodeFR:"",
      classNodeGB:"",
      classNodeIN:"",
      classNodeTR:"",
      classNodeAU:"",
      classNodeJP:"",
      selectValue:[],
      selectValueDE:[],
      selectValueES:[],
      selectValueIT:[],
      selectValueUS:[],
      selectValueMX:[],
      selectValueAE:[],
      selectValueBR:[],
      selectValueFR:[],
      selectValueGB:[],
      selectValueIN:[],
      selectValueTR:[],
      selectValueCA:[],
      selectValueAU:[],
      selectValueJP:[],
      siteSelect:"",
      updataStepIdDE:"",
      updataStepIdES:"",
      updataStepIdIT:"",
      updataStepIdUS:"",
      updataStepIdCA:"",
      updataStepIdMX:"",
      updataStepIdAE:"",
      updataStepIdBR:"",
      updataStepIdFR:"",
      updataStepIdGB:"",
      updataStepIdIN:"",
      updataStepIdTR:"",
      updataStepIdAU:"",
      updataStepIdJP:"",
      updataStepId:"",
      disabShow:true,
      siteValue:"",
      copiId:"",
      cost:"",
      freight:"",
      profit:"",
      size:"cm",
      searchValue:"",
      showValue:"",
      M_URL:"",
      exchange:{
      },
      categoryCN:false,
      countryORlanguages,
      languageOR:"",
      DEnum:"",ESnum:"",ITnum:"",USnum:"",CAnum:"",MXnum:"",AEnum:"",BRnum:"",FRnum:"",GBnum:"",INnum:"",TRnum:"",AUnum:"",JPnum:"",
      mwsValue:{},
      brandwarning:false,
      manufacturerwarning:false,
      partNumberwarning:false,
      interList:"",
      SingleLanguage:"",
      seleState:"",
      showOpen:{
        DE:false,
        FR:false,
        GB:false,
        IT:false,
        ES:false,
        AU:false,
        JP:false
        // IT:false,
        // IT:false,
      },
      tabORI:true,
      ORI:"ORI",
      // ORI:"CN",
      tabico:require('@/assets/tablogo.png'),
      transInfo:{
        id:"",
        from:"",
        to:"",
        trans_obj:"",
        trans_type:"",
      },
      trans_obj:{
        title:"",
        detail:"",
        keywords:"",
        bullet_point1:"",
        bullet_point2:"",
        bullet_point3:"",
        bullet_point4:"",
        bullet_point5:"",
      },
      languageToTrans:"",
      balance:"",
      defaultSlate:"1",
      characterTxt:"（100万字符=142.228人民币）",
      addNewProduct: "",
      powerTab:'CN',
      transAll:{
        title:"",
        detail:"",
        keywords:"",
        bullet_point1:"",
        bullet_point2:"",
        bullet_point3:"",
        bullet_point4:"",
        bullet_point5:"",
        clearance_cnName:"",
      },
      BGInfo:{
       clearance_cnName:""
      },
      chromeCode:"jdjacbknodjemkphlacpedfenmohdcla",
      detailCount:2000,
      detailText:'',
      keywordsCount:250,
      keywordsText:'',
      isDetailBeyond:false,
      isKeyBeyond:false,
      transPayVisibles:false,
      againModalType:1,
      transWordLength:0,
      transWordMoney:0
    }
  },
  methods: {
    lookBigImage(url, item) {
      console.log(url, item)
      this.previewVisible = false
      this.handlePreview(item)
    },
    deleteImage(id) {
      console.log(id)
      this.removes(id)
    },
    setHomeImage(id, fileList) {
      console.log(id, fileList)
      this.setMain(id)
    },
    // change: function (evt) {
    //   console.log(evt)
    // },
    // //start ,end ,add,update, sort, remove 得到的都差不多
    // start: function (evt) {
    //   console.log(evt)
    // },
    // end: function (evt) {
    //   console.log(evt)
    //   evt.item //可以知道拖动的本身
    //   evt.to    // 可以知道拖动的目标列表
    //   evt.from  // 可以知道之前的列表
    //   evt.oldIndex  // 可以知道拖动前的位置
    //   evt.newIndex  // 可以知道拖动后的位置
    // },
    // move: function (evt, originalEvent) {
    //   console.log(evt)
    //   console.log(originalEvent) //鼠标位置
    // },
    // 联级菜单
    classChange(value,index,category){
      this.seleState = category
      if(category == 'DE'){
        this.classValueDE = value
        this.selectValueDE[index+1] ="" ; //防止id显示叠加
        this.selectListDE.splice((index+1),this.selectListDE.length)  //选中父级清空子级
        this.selectListDE[this.selectListDE.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueDE){
            this.classNode.DE = im.node_id
          }
        })
        // 联级显示菜单
        this.selectListDE[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'DE').then((v)=>{
                this.selectListDE.push(v)
              })
            }
          }
        })
      }else if(category == 'FR'){
        this.classValueFR = value
        this.selectListFR[this.selectListFR.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueFR){
            this.classNode.FR=im.node_id
          }
        })
        this.selectValueFR[index+1] ="" ; //防止id显示叠加
        this.selectListFR.splice((index+1),this.selectListFR.length)  //选中父级清空子级
        this.selectListFR[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'FR').then((v)=>{
                this.selectListFR.push(v)
              })
            }
          }
        })
      }else if(category == 'GB'){
        this.classValueGB = value
        console.log(this.classValueGB,"GB")
         this.selectListGB[this.selectListGB.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueGB){
            this.classNode.GB = im.node_id
          }
        })
        this.selectValueGB[index+1] ="" ; //防止id显示叠加
        this.selectListGB.splice((index+1),this.selectListGB.length)  //选中父级清空子级
        this.selectListGB[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'GB').then((v)=>{
                this.selectListGB.push(v)
              })
            }
          }
        })
      }else if(category == 'IT'){
        this.classValueIT = value
        console.log(this.classValueIT,"IT")
        this.selectListIT[this.selectListIT.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueIT){
            this.classNode.IT = im.node_id
          }
        })
        this.selectValueIT[index+1] ="" ; //防止id显示叠加
        this.selectListIT.splice((index+1),this.selectListIT.length)  //选中父级清空子级
        this.selectListIT[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'IT').then((v)=>{
                this.selectListIT.push(v)
              })
            }
          }
        })
      }else if(category == 'ES'){
        this.classValueES = value
        console.log(this.classValueES,"ES")
        this.selectListES[this.selectListES.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueES){
            this.classNode.ES = im.node_id
          }
        })
        this.selectValueES[index+1] ="" ; //防止id显示叠加
        this.selectListES.splice((index+1),this.selectListES.length)  //选中父级清空子级
        this.selectListES[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'ES').then((v)=>{
                this.selectListES.push(v)
              })
            }
          }
        })
      }else if(category == 'US'){
        this.classValueUS = value
        console.log(this.classValueUS,"US")
        this.selectListUS[this.selectListUS.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueUS){
            this.classNode.US = im.node_id
          }
        })
        this.selectValueUS[index+1] ="" ; //防止id显示叠加
        this.selectListUS.splice((index+1),this.selectListUS.length)  //选中父级清空子级
        this.selectListUS[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'US').then((v)=>{
                this.selectListUS.push(v)
              })
            }
          }
        })
      }else if(category == 'CA'){
        this.classValueCA = value
        console.log(this.classValueCA,"CA")
          this.selectListCA[this.selectListCA.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueCA){
            this.classNode.CA = im.node_id
          }
        })
        this.selectValueCA[index+1] ="" ; //防止id显示叠加
        this.selectListCA.splice((index+1),this.selectListCA.length)  //选中父级清空子级
        this.selectListCA[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'CA').then((v)=>{
                this.selectListCA.push(v)
              })
            }
          }
        })
      }else if(category == 'MX'){
        this.classValueMX = value
        console.log(this.classValueMX,"MX")
           this.selectListMX[this.selectListMX.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueMX){
            this.classNode.MX = im.node_id
          }
        })
        this.selectValueMX[index+1] ="" ; //防止id显示叠加
        this.selectListMX.splice((index+1),this.selectListMX.length)  //选中父级清空子级
        this.selectListMX[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'MX').then((v)=>{
                this.selectListMX.push(v)
              })
            }
          }
        })
      }else if(category == 'BR'){
        this.classValueBR = value
        console.log(this.classValueBR,"BR")
           this.selectListBR[this.selectListBR.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueBR){
            this.classNode.BR = im.node_id
          }
        })
        this.selectValueBR[index+1] ="" ; //防止id显示叠加
        this.selectListBR.splice((index+1),this.selectListBR.length)  //选中父级清空子级
        this.selectListBR[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'BR').then((v)=>{
                this.selectListBR.push(v)
              })
            }
          }
        })
      }else if(category == 'IN'){
        this.classValueIN = value
        console.log(this.classValueIN,"IN")
          this.selectListIN[this.selectListIN.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueIN){
            this.classNode.IN = im.node_id
          }
        })
        this.selectValueIN[index+1] ="" ; //防止id显示叠加
        this.selectListIN.splice((index+1),this.selectListIN.length)  //选中父级清空子级
        this.selectListIN[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'IN').then((v)=>{
                this.selectListIN.push(v)
              })
            }
          }
        })
      }else if(category == 'TR'){
        this.classValueTR = value
        console.log(this.classValueTR,"TR")
          this.selectListTR[this.selectListTR.length-1].forEach((im,ix)=>{
          if(im.id === this.classValueTR){
            this.classNode.TR = im.node_id
          }
        })
        this.selectValueTR[index+1] ="" ; //防止id显示叠加
        this.selectListTR.splice((index+1),this.selectListTR.length)  //选中父级清空子级
        this.selectListTR[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'TR').then((v)=>{
                this.selectListTR.push(v)
              })
            }
          }
        })
      }else if(category == 'AE'){
        this.classValueAE = value
        console.log(this.classValueAE,"AE")
        this.selectListAE[this.selectListAE.length-1].forEach((im,ix)=>{
            if(im.id === this.classValueAE){
              this.classNode.AE = im.node_id
            }
          })
        this.selectValueAE[index+1] ="" ; //防止id显示叠加
        this.selectListAE.splice((index+1),this.selectListAE.length)  //选中父级清空子级
        this.selectListAE[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'AE').then((v)=>{
                this.selectListAE.push(v)
              })
            }
          }
        })
      }else if(category == 'AU'){
        this.classValueAU = value
        console.log(this.classValueAU,"AU")
        this.selectListAU[this.selectListAU.length-1].forEach((im,ix)=>{
            if(im.id === this.classValueAU){
              this.classNode.AU = im.node_id
            }
          })
        this.selectValueAU[index+1] ="" ; //防止id显示叠加
        this.selectListAU.splice((index+1),this.selectListAU.length)  //选中父级清空子级
        this.selectListAU[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'AU').then((v)=>{
                this.selectListAU.push(v)
              })
            }
          }
        })
      }else if(category == 'JP'){
        this.classValueJP = value
        console.log(this.classValueJP,"JP")
        this.selectListJP[this.selectListJP.length-1].forEach((im,ix)=>{
            if(im.id === this.classValueJP){
              this.classNode.JP = im.node_id
            }
          })
        this.selectValueJP[index+1] ="" ; //防止id显示叠加
        this.selectListJP.splice((index+1),this.selectListJP.length)  //选中父级清空子级
        this.selectListJP[index].forEach((item,inx)=>{
          if(value === item.id){
            if(item.is_menu === '1'){
              console.log(value,this.siteValue)
              this.getauthCountry(value,'JP').then((v)=>{
                this.selectListJP.push(v)
              })
            }
          }
        })
      }
    },
    //
    getauthCountry(val,site){
     return authCountry({
        country:site,
        // country:"DE",
        pid:val
      }).then((res)=>{
        if(res.code === 0){
          return res.data
        }
      })
    },
    // 反向返显联级菜单多国家
    mwsReversesAll(){
        console.log(this.dataAll,"over","mwsReversesAll",this.siteSelect)
      if(this.dataAll.CN && this.addNewProduct === 0){
        if(this.siteSelect){
          this.siteSelect.forEach((item,index)=>{
            this.mwsReverses(item.title,this.dataAll[item.title].category)
          })
        }else{
          this.Europe.forEach((item,index)=>{
            this.mwsReverses(item.title,this.dataAll[item.title].category)
          })
        }
      } else {
        if(this.siteSelect){
          this.siteSelect.forEach((item,index)=>{
            this.mwsReverses(item.title)
          })
        }
      }
    },
    mwsReverses(country,category){
      // 请求 参数 id
      console.log(country,category,"over")
      mwsReverse({
        country:country,
        node_id:category
      }).then((res)=>{
        if(res.code === 0){
          if(country === 'DE'){
            // 把最后一级的nodeID保存
            this.classValueDE = res.data.stepId[res.data.stepId.length-1];
            console.log(res.data.id,"stepId")
            this.selectValueDE = res.data.id;
            this.updataStepIdDE = [];
            for (var i in res.data.id) {
              this.updataStepIdDE[i] = res.data.id[i];
            }
            this.updataStepIdDE.splice(0,0,'0')
            if(this.classValueDE){
              this.disabShow = false
            }
            this.updataStepIdDE.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList),"getauthCountry")
              this.selectListDE[value]=v
              // this.selectList = EachValue
              console.log(this.selectList,'arr?object')
              if(this.updataStepIdDE.length === (value+1)){
                this.selectListDE.pop()
                }
              })
             },value*200)
            //  console.log(this.selectListDE,"this.selectListDE")
            })
          }else if(country === 'ES'){
            this.classValueES = res.data.stepId[res.data.stepId.length-1];
            this.selectValueES = res.data.id;
            this.updataStepIdES = [];
            for (var i in res.data.id) {
              this.updataStepIdES[i] = res.data.id[i];
            }
            this.updataStepIdES.splice(0,0,'0')
            if(this.classValueES){
              this.disabShow = false
            }
            this.updataStepIdES.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListES[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdES.length === (value+1)){
                this.selectListES.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'IT'){
            this.classValueIT = res.data.stepId[res.data.stepId.length-1];
            this.selectValueIT = res.data.id;
            this.updataStepIdIT = [];
            for (var i in res.data.id) {
              this.updataStepIdIT[i] = res.data.id[i];
            }
            this.updataStepIdIT.splice(0,0,'0')
            if(this.classValueIT){
              this.disabShow = false
            }
            this.updataStepIdIT.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListIT[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdIT.length === (value+1)){
                this.selectListIT.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'US'){
            this.classValueUS = res.data.stepId[res.data.stepId.length-1];
            this.selectValueUS = res.data.id;
            this.updataStepIdUS = [];
            for (var i in res.data.id) {
              this.updataStepIdUS[i] = res.data.id[i];
            }
            this.updataStepIdUS.splice(0,0,'0')
            if(this.classValueUS){
              this.disabShow = false
            }
            this.updataStepIdUS.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListUS[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdUS.length === (value+1)){
                this.selectListUS.pop()
                }
              })
             },value*200)
            })

          }else if(country === 'MX'){
            this.classValueMX = res.data.stepId[res.data.stepId.length-1];
            this.selectValueMX = res.data.id;
            this.updataStepIdMX = [];
            for (var i in res.data.id) {
              this.updataStepIdMX[i] = res.data.id[i];
            }
            this.updataStepIdMX.splice(0,0,'0')
            if(this.classValueMX){
              this.disabShow = false
            }
            this.updataStepIdMX.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListMX[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdMX.length === (value+1)){
                this.selectListMX.pop()
                }
              })
             },value*200)
            })

          }else if(country === 'AE'){
            this.classValueAE = res.data.stepId[res.data.stepId.length-1];
            this.selectValueAE = res.data.id;
            this.updataStepIdAE = [];
            for (var i in res.data.id) {
              this.updataStepIdAE[i] = res.data.id[i];
            }
            this.updataStepIdAE.splice(0,0,'0')
            if(this.classValueAE){
              this.disabShow = false
            }
            this.updataStepIdAE.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListAE[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdAE.length === (value+1)){
                this.selectListAE.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'BR'){
            this.classValueBR = res.data.stepId[res.data.stepId.length-1];
            this.selectValueBR = res.data.id;
            this.updataStepIdBR = [];
            for (var i in res.data.id) {
              this.updataStepIdBR[i] = res.data.id[i];
            }
            this.updataStepIdBR.splice(0,0,'0')
            if(this.classValueBR){
              this.disabShow = false
            }
            this.updataStepIdBR.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListBR[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdBR.length === (value+1)){
                this.selectListBR.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'FR'){
            this.classValueFR = res.data.stepId[res.data.stepId.length-1];
            this.selectValueFR = res.data.id;
            this.updataStepIdFR = [];
            for (var i in res.data.id) {
              this.updataStepIdFR[i] = res.data.id[i];
            }
            this.updataStepIdFR.splice(0,0,'0')
            if(this.classValueFR){
              this.disabShow = false
            }
            this.updataStepIdFR.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListFR[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdFR.length === (value+1)){
                this.selectListFR.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'GB'){
            this.classValueGB = res.data.stepId[res.data.stepId.length-1];
            this.selectValueGB = res.data.id;
            this.updataStepIdGB = [];
            for (var i in res.data.id) {
              this.updataStepIdGB[i] = res.data.id[i];
            }
            this.updataStepIdGB.splice(0,0,'0')
            if(this.classValueGB){
              this.disabShow = false
            }
            this.updataStepIdGB.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              this.selectListGB[value]=v
              //  this.selectList = EachValue
              if(this.updataStepIdGB.length === (value+1)){
                this.selectListGB.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'IN'){
            this.classValueIN = res.data.stepId[res.data.stepId.length-1];
            this.selectValueIN = res.data.id;
            this.updataStepIdIN = [];
            for (var i in res.data.id) {
              this.updataStepIdIN[i] = res.data.id[i];
            }
            this.updataStepIdIN.splice(0,0,'0')
            if(this.classValueIN){
              this.disabShow = false
            }
            this.updataStepIdIN.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListIN[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdIN.length === (value+1)){
                this.selectListIN.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'TR'){
            this.classValueTR = res.data.stepId[res.data.stepId.length-1];
            this.selectValueTR = res.data.id;
            this.updataStepIdTR = [];
            for (var i in res.data.id) {
              this.updataStepIdTR[i] = res.data.id[i];
            }
            this.updataStepIdTR.splice(0,0,'0')
            if(this.classValueTR){
              this.disabShow = false
            }
            this.updataStepIdTR.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListTR[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdTR.length === (value+1)){
                this.selectListTR.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'CA'){
            this.classValueCA = res.data.stepId[res.data.stepId.length-1];
            this.selectValueCA = res.data.id;
            this.updataStepIdCA = [];
            for (var i in res.data.id) {
              this.updataStepIdCA[i] = res.data.id[i];
            }
            this.updataStepIdCA.splice(0,0,'0')
            if(this.classValueCA){
              this.disabShow = false
            }
            this.updataStepIdCA.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListCA[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdCA.length === (value+1)){
                this.selectListCA.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'JP'){
            this.classValueJP = res.data.stepId[res.data.stepId.length-1];
            this.selectValueJP = res.data.id;
            this.updataStepIdJP = [];
            for (var i in res.data.id) {
              this.updataStepIdJP[i] = res.data.id[i];
            }
            this.updataStepIdJP.splice(0,0,'0')
            if(this.classValueJP){
              this.disabShow = false
            }
            this.updataStepIdJP.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListJP[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdJP.length === (value+1)){
                this.selectListJP.pop()
                }
              })
             },value*200)
            })
          }else if(country === 'AU'){
            this.classValueAU = res.data.stepId[res.data.stepId.length-1];
            this.selectValueAU = res.data.id;
            this.updataStepIdAU = [];
            for (var i in res.data.id) {
              this.updataStepIdAU[i] = res.data.id[i];
            }
            this.updataStepIdAU.splice(0,0,'0')
            if(this.classValueAU){
              this.disabShow = false
            }
            this.updataStepIdAU.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListAU[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdAU.length === (value+1)){
                this.selectListAU.pop()
                }
              })
             },value*200)
            })
          }
        }
      })
    },
    // 联级菜单搜索
    handleBlur() {
    },
    handleFocus(i) {
    },
    filterOption(input, option) {
      // return console.log("1",option.componentOptions.propsData.value,'2',option.componentOptions.children[0].children[0].text,"input",input)
      return option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getauthCountrys(val){
      var _this = this
      console.log("siteValue",_this.siteValue,"------------")
      authCountry({
        country:_this.siteValue,
        pid:val
      }).then((res)=>{
        if(res.code === 0){
          if(_this.siteValue == "DE"){
          _this.selectListDE.push(res.data)
          }else if(_this.siteValue == "ES"){
          _this.selectListES.push(res.data)
          }else if(_this.siteValue == "IT"){
          _this.selectListIT.push(res.data)
          }else if(_this.siteValue == "US"){
          _this.selectListUS.push(res.data)
          }else if(_this.siteValue == "MX"){
          _this.selectListMX.push(res.data)
          }else if(_this.siteValue == "AE"){
          _this.selectListAE.push(res.data)
          }else if(_this.siteValue == "BR"){
          _this.selectListBR.push(res.data)
          }else if(_this.siteValue == "FR"){
          _this.selectListFR.push(res.data)
          }else if(_this.siteValue == "GB"){
          _this.selectListGB.push(res.data)
          }else if(_this.siteValue == "IN"){
          _this.selectListIN.push(res.data)
          }else if(_this.siteValue == "TR"){
          _this.selectListTR.push(res.data)
          }else if(_this.siteValue == "CA"){
          _this.selectListCA.push(res.data)
          }else if(_this.siteValue == "AU"){
          _this.selectListAU.push(res.data)
          }else if(_this.siteValue == "JP"){
          _this.selectListJP.push(res.data)
          }
          console.log(this.selectListDE,"selectList")
        }
      })
    },
    toCN(){
      this.categoryCN = !this.categoryCN
    },
    nextStep () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          console.log(err,"err")
          // this.$emit('nextStep')
          console.log(this.fileList,"fileList")
           this.subvalues = values
           console.log(this.subvalues,"resule")
          if(this.fileList.length > 0){
            this.fileList.forEach((item)=>{
              this.goodsimg=this.goodsimg.concat(item.url)
            })
            this.goodsimgs = JSON.stringify(this.goodsimg)
            this.goodsimgs = this.goodsimgs.replace(/\[|]/g,'').replace(/"/g,'')
            if(this.classNode){
              // console.log(this.classNode,"over","提交")
              this.subupdateGood()
              this.subloading = true
            }else{
              this.subupdateGood()
              this.$notification.error({
                message: '错误',
                description: '请选择分类',
              });
            }
          }else if(this.fileList.length === 0){
            console.log(this.subvalues)
            console.log(this.classNode,"over","提交")
            // this.subupdateGood()
            this.$notification.error({
              message: '错误',
              description: '请至少添加一张图片',
            });
          }
        }else{
          this.$notification.error({
            message: '错误',
            description: '请填写其他国家内容',
          });
        }
      })
    },
    //获取 店铺getMyStore
    getMyStores(){
       getMyStore({}).then(res=>{
        if(res.code === 0){
          console.log(this.storeSelect,"storeSelect")
          if(this.data.store_id){
            this.storeSelect = res.data
            for(var i=0;i<this.storeSelect.length;i++){
              // console.log(i,"over",this.storeSelect.length)
              if(this.data.store_id == this.storeSelect[i].id){
                 this.siteSelect = this.storeSelect[i].mws_site;
                 console.log(this.siteSelect,"over66");
                 break
              }
              // 如果没有店铺 或者不存在 select请选择
              if(this.storeSelect.length-1 === i){
                  // console.log("没有这个值",'over')
                this.form.setFieldsValue({
                  'store_id':'0'
                });
              }
            }
            console.log(this.storeSelect,'storeSelect')
            this.mwsReversesAll()
          }else{
            if(this.addNewProduct === 1) {
              this.siteSelect = []
            }
            this.storeSelect = res.data
            // this.siteSelect = this.storeSelect[0].mws_site;
            console.log(this.storeSelect,'storeSelect',this.siteSelect)
            this.form.setFieldsValue({
              'store_id':'0'
            });
            console.log('start1111')
          }
        }
      })
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // console.log("info.file.originFileObj",info.file.originFileObj)
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    // 根据国家选择分类
    tabCountry(tabVal,tabVal2){
      this.powerTab = tabVal
      this.tabClassLoading = true
      this.InfoFilling(tabVal)
      setTimeout(()=>{
        this.tabClassLoading = false
      },300)
      this.initCountry = tabVal;
      this.siteValue = tabVal;
      //显示字数限制
      let num1,num2;
      if(tabVal2){
        tabVal = tabVal2
      }
      if(this.form.getFieldValue('detail.'+tabVal)){
        let detailLimit = this.form.getFieldValue('detail.'+tabVal).length;
        if(detailLimit<=2000){
          num1 = 2000-detailLimit;
          this.isDetailBeyond = false;
          this.detailText = "还可输入"+num1+"字";
        }else if(detailLimit>2000){
          num1 = detailLimit-2000;
          this.isDetailBeyond = true;
          this.detailText = "已超过"+num1+"字符";
        }
      }else{
        this.isDetailBeyond = false;
        this.detailText = "还可输入2000字";
      }
      if(this.form.getFieldValue('keywords.'+tabVal)){
        let KeyWordLimit = this.form.getFieldValue('keywords.'+tabVal).length;
        if(KeyWordLimit<=250){
          num2 = 250-KeyWordLimit;
          this.isKeyBeyond = false;
          this.keywordsText = "还可输入"+num2+"字";
        }else if(KeyWordLimit>250){
          num2 = KeyWordLimit-250;
          this.isKeyBeyond = true;
          this.keywordsText = "已超过"+num2+"字符";
        }
      }else{
        this.isKeyBeyond = false;
        this.keywordsText = "还可输入250字";
      }
      

      this.disabShow = false;
      console.log(this.dataAll[tabVal],"************************")
      // 判断 是否第二次进入
      if(this.dataAll[tabVal]){
        if(!this.dataAll[tabVal].category){
          this.assignment(tabVal)
        }else{
          // 换了店铺 ，国家也少了 重新加载select
        }
      }else{
        this.assignment(tabVal)
      }
      // this.getauthCountrys("0");
      // 选择国家汇率
      this.queryCurrencyType(tabVal)
      // this.data = this.dataAll[tabVal]
      this.showOpens(tabVal)

    },
    //根据国家 默认展开select
    showOpens(tabVal){
      this.OZorBM.forEach((item,index)=>{
        if(tabVal === item.title){
          this.showOpen[item.title] = true
          console.log(this.showOpen[item.title],"open")
        }else{
          this.showOpen[item.title] = false
        }
      })
      console.log(this.showOpen,'opens')
    },
    assignment(tabVal){
        if(tabVal == 'DE' && this.DEnum !=="1" ){
          this.DEnum = "1"
          this.selectListDE = []
          this.getauthCountrys("0");
        }else if(tabVal == 'ES' && this.ESnum !=="1" ){
          this.ESnum = "1"
          this.selectListES = []
          this.getauthCountrys("0");
        }else if(tabVal == 'IT' && this.ITnum !="1" ){
          this.ITnum ='1'
          this.selectListIT = []
          this.getauthCountrys("0");
        }else if(tabVal == 'US' && this.USnum !="1" ){
          this.USnum ='1'
          this.selectListUS = []
          this.getauthCountrys("0");
        }else if(tabVal == 'CA' && this.CAnum !="1" ){
          this.CAnum ='1'
          this.selectListCA = []
          this.getauthCountrys("0");
        }else if(tabVal == 'MX' && this.MXnum !="1" ){
          this.MXnum ='1'
          this.selectListMX = []
          this.getauthCountrys("0");
        }else if(tabVal == 'AE' && this.AEnum !="1" ){
          this.AEnum ='1'
          this.selectListAE = []
          this.getauthCountrys("0");
        }else if(tabVal == 'BR' && this.BRnum !="1" ){
          this.BRnum ='1'
          this.selectListBR = []
          this.getauthCountrys("0");
        }else if(tabVal == 'FR' && this.FRnum !="1" ){
          this.FRnum ='1'
          this.selectListFR = []
          this.getauthCountrys("0");
        }else if(tabVal == 'GB' && this.GBnum !="1" ){
          this.GBnum ='1' 
          this.selectListGB = []
          this.getauthCountrys("0");
        }else if(tabVal == 'IN' && this.INnum !="1" ){
          this.INnum ='1'
          this.selectListIN = []
          this.getauthCountrys("0");
        }else if(tabVal == 'TR' && this.TRnum !="1" ){
          this.TRnum ='1'
          this.selectListTR = []
          this.getauthCountrys("0");
        }else if(tabVal == 'AU' && this.AUnum !=="1" ){
          this.AUnum = "1"
          this.selectListAU = []
          this.getauthCountrys("0");
        }else if(tabVal == 'JP' && this.JPnum !=="1" ){
          this.JPnum = "1"
          this.selectListJP = []
          this.getauthCountrys("0");
        }
      },
    ChangeStore(val){
      console.log(val,"over")
      this.siteSelect = []
      if(val ==='0'){
        this.siteSelect = []
      }else{
        this.storeSelect.forEach((item,index)=>{
          if(val === item.id){
            setTimeout(()=>{
              this.siteSelect = this.siteSelect.concat(item.mws_site)
            },300)
            this.selectList = []
            this.selectValue = []
            this.form.setFieldsValue({
              country:"",
            });
          }
        })
      }
    },
    sitechang(val){
      console.log(val,"val=========")
      this.siteValue = val;
      this.disabShow = false;
      this.selectList = []
      this.selectValue = []
      this.getauthCountrys("0");
      this.queryCurrencyType(this.siteValue)
    },
    //获取国家类别
    queryCurrencyType(v){
      console.log(this.currencyList,"currencyList")
      this.currencyList.forEach((item,index)=>{
        if(item.id === v){
          this.currencyLogo[v]=item.logo
          this.currencyType = item.type
          this.getproductCurrency(v)
          console.log(this.currencyLogo,"currencyLogo")
        }
      })
    },
    //获取汇率
    getproductCurrency(v){
      console.log(this.currencyType,"currencyType","v",v)
      productCurrency({
        money:"666",
        to:"CNY",
        from:this.currencyType
      }).then(res=>{
        if(res.code===0){
          this.exchange[v] = res.data[1].exchange;
          console.log(this.exchange,"this.exchange",this.exchange[v])
        }
      })
    },
    removes(val){
      console.log(val)
      this.fileList.forEach((item,inx)=>{
        // if(val.uid === item.uid){
        if(val === item.uid){
          this.fileList.splice(inx,1);
        }
      })
    },
    // 提交
    subupdateGood(){
      if(this.addNewProduct === 1) {
        this.goodsId = ''
      }
      // if(this.)
      console.log(this.classNode,"over","666")
      console.log(this.subvalues.ori_url, 'ori_url')
      updateGood({
        id:this.goodsId,
        image:this.goodsimgs,
        platform:this.site,
        sku:this.subvalues.sku,
        title:this.subvalues.title,
        store_id:this.subvalues.store_id,
        country:this.subvalues.country,
        category:this.classNode,
        upc:this.subvalues.upc,
        brand_name:this.subvalues.brand_name,
        // manufacturer:this.subvalues.manufacturer,
        // part_number:this.subvalues.part_number,
        price:this.subvalues.price,
        quantity:this.subvalues.quantity,
        detail:this.subvalues.detail,
        keywords:this.subvalues.keywords,
        bullet_point1:this.subvalues.bullet_point1,
        bullet_point2:this.subvalues.bullet_point2,
        bullet_point3:this.subvalues.bullet_point3,
        bullet_point4:this.subvalues.bullet_point4,
        bullet_point5:this.subvalues.bullet_point5,
        weight:this.subvalues.weight,
        length:this.subvalues.length,
        width:this.subvalues.width,
        height:this.subvalues.height,
        value_type:this.size,
        clearance_cnName:this.subvalues.clearance_cnName,
        clearance_enName:this.subvalues.clearance_enName,
        clearance_usd:this.subvalues.clearance_usd,
        clearance_weight:this.subvalues.clearance_weight,
        ori_url:this.subvalues.ori_url
        }).then((res)=>{
        if(res.code === 0){
          console.log(res.msg)
          this.$notification.success({
            message: '提醒',
            description: res.msg,
          });
          this.subloading = false
          this.$router.go(-1)
        }else{
          this.subloading = false
          this.$notification.error({
            message: '提醒',
            description: res.msg,
          });
        }
      })
    },
    changetitle(cuntrys){
      let _this = this
      let fieldvalue = _this.form.getFieldValue('title.'+cuntrys)
      if(fieldvalue.length > 0){
        var reg = new RegExp("[A-Za-z]+");
          if (!reg.test(fieldvalue)){
            _this.showEN = false;
          }else{
            _this.showEN = true;
        }
      }
    },
    ifZN(){
      if(this.data.title){
        var reg = new RegExp("[A-Za-z]+");
        if (!reg.test(this.data.title)){
          this.showEN=false;
        }else{
          this.showEN=true;
        }
      }
    },
    tostr(strType){
      console.log(strType,'strType')
      let Fieldtitle = this.form.getFieldValue('title.'+strType)
      console.log(Fieldtitle,"Fieldtitle")
      this.form.setFieldsValue({
        ['title.'+strType]:this.replaceStr(Fieldtitle),
      });
    },
    replaceStr(strs){
      strs = strs.toLowerCase();
      var reg = /\b(\w)|\s(\w)/g; //
      return strs.replace(reg,function(m){
        return m.toUpperCase()
      });
    },
    // 翻译语言
    languageChange(value){
      console.log(value,"value")
      this.languageValue = value
    },
    //一键翻译
    interpretAll(){
      //填充报关信息
      this.fillcustomsInfo()
      if(this.siteSelect){
      var languags = ''
      // 一键翻译的国家
      this.languageOR=[]
      this.siteSelect.forEach((item,index)=>{
        this.countryORlanguages.forEach((itm,inx)=>{
          if(item.title === itm.country){
            languags += (itm.languages+",")
            this.languageOR.push(this.countryORlanguages[inx])
          }
        })
      })
      this.languageValue = languags.slice(0,-1)
      console.log(this.languageValue)
      // 价格填充  cost.CN
      this.priceFill();
      // 翻译
      this.interpret();
      console.log(this.languageOR,"languageOR")
      }else{
        this.alertErr("请先选择店铺");
      }
    },
      //填充报关信息
    fillcustomsInfo(){
      // this.form.setFieldsValue({
      //   clearance_cnName:this.form.getFieldValue("title.ORI"),
      // });
      // trans({
      //   to:"en",
      //   q:this.form.getFieldValue("title.ORI"),
      //   trans_type:this.defaultSlate,
      // }).then((res)=>{
      //   if(res.code === 0 ){
      //     this.form.setFieldsValue({
      //       clearance_enName:res.data.en
      //     });
      //   }
      // })
      productCurrency({
        money:"666",
        to:"CNY",
        from:"USD"
      }).then(res=>{
        if(res.code===0){
          //exchange
        let usdNUM=(this.form.getFieldValue("price.ORI")*(Number(res.data[1].exchange))).toFixed(2)
          if(usdNUM<15){
          this.form.setFieldsValue({
            clearance_usd:usdNUM
          });
          }else{
            this.form.setFieldsValue({
              clearance_usd:15
            });
          }
        }
      })
      // this.form.setFieldsValue({
      //   usd:this.form.getFieldValue("price.ORI"),
      // });
      if(Number(this.form.getFieldValue("weight"))>0){
        this.form.setFieldsValue({
          clearance_weight:Number(this.form.getFieldValue("weight"))*1000,
        });
      }else{
        this.form.setFieldsValue({
          clearance_weight:0,
        });
      }
    },
    priceFill(){
      this.languageOR.forEach((item,index)=>{
        console.log(item.country,"over")
        if(this.ORI === 'CN') {
            this.form.setFieldsValue({
              //price  // profit  //cost
              ['cost.'+ item.country]:this.form.getFieldValue("price.CN"),
            });
            // this.form.setFieldsValue({
            //   ['price.'+ item.country]:this.form.getFieldValue("price.CN"),
            // });
            this.form.setFieldsValue({
              ['profit.'+ item.country]:this.form.getFieldValue("profit.CN")
            });
            this.form.setFieldsValue({
              ['brand_name.'+ item.country]:this.form.getFieldValue("brand_name.CN")
            });
            // this.form.setFieldsValue({
            //   ['manufacturer.'+ item.country]:this.form.getFieldValue("manufacturer.CN")
            // });
    
        }else if(this.ORI === 'ORI'){
            this.form.setFieldsValue({
              //price  // profit  //cost
              ['cost.'+ item.country]:this.form.getFieldValue("price.ORI"),
            });
            // this.form.setFieldsValue({
            //   ['price.'+ item.country]:this.form.getFieldValue("price.ORI"),
            // });
            this.form.setFieldsValue({
              ['profit.'+ item.country]:this.form.getFieldValue("profit.ORI")
            });
            this.form.setFieldsValue({
              ['brand_name.'+ item.country]:this.form.getFieldValue("brand_name.ORI")
            });
            // this.form.setFieldsValue({
            //   ['manufacturer.'+ item.country]:this.form.getFieldValue("manufacturer.ORI")
            // });
        }
      })
    },

    // 一键翻译 翻译内容
    interpret(){
      let _this=this
      _this.interLoading = true
      if(this.defaultSlate != 1){
        setTimeout(() => {
          if( _this.interLoading === true){
            _this.interLoading = false
            _this.alertErr("翻译出现错误请重新翻译");
          }
        }, 30000);
      }
      _this.BGInfo.clearance_cnName = _this.form.getFieldValue('clearance_cnName')
      if(_this.ORI ==="ORI"){
        _this.ENList=[
        "title.ORI","detail.ORI","keywords.ORI","bullet_point1.ORI","bullet_point2.ORI","bullet_point3.ORI","bullet_point4.ORI","bullet_point5.ORI"
        ]
        if(this.addNewProduct === 1 ){
         _this.languageToTrans = 'ori'
        }else{
          _this.languageToTrans = this.dataAll.ORI.ori_language
        }
      }else if(_this.ORI ==="CN"){
        _this.ENList=[
          "title.CN","detail.CN","keywords.CN","bullet_point1.CN","bullet_point2.CN","bullet_point3.CN","bullet_point4.CN","bullet_point5.CN"
        ]
        if(this.addNewProduct === 1 ){
         _this.languageToTrans = 'cn'

        }else{
          _this.languageToTrans = this.dataAll.CN.ori_language
        }
      }
      console.log(_this.ENList, 'enlist')
      _this.toEN = []
      // 获取到翻译内容
      // _this.ENList.forEach((item,index)=>{
      //   _this.toEN.push(_this.form.getFieldValue(item))
      // })
      _this.ENList.forEach((item,index)=>{
        if(index === 0 ){
          _this.transAll.title = _this.form.getFieldValue(item)
        }else if(index === 1){
          _this.transAll.detail = _this.form.getFieldValue(item)
        }else if(index === 2){
          _this.transAll.keywords = _this.form.getFieldValue(item)
        }else if(index === 3){
          _this.transAll.bullet_point1 = _this.form.getFieldValue(item)
        }else if(index === 4){
          _this.transAll.bullet_point2 = _this.form.getFieldValue(item)
        }else if(index === 5){
          _this.transAll.bullet_point3 = _this.form.getFieldValue(item)
        }else if(index === 6){
          _this.transAll.bullet_point4 = _this.form.getFieldValue(item)
        }else if(index === 7){
          _this.transAll.bullet_point5 = _this.form.getFieldValue(item)
        }
      })
      // _this.toEN.forEach((item,index)=>{
      //   if(item){
      //      _this.totrans(item,index,_this.languageToTrans)
      //   }
      // })
      console.log(_this.BGInfo)

      if(this.defaultSlate == 1){
        this.againModalType = 2;
        trans_fee({
          "to": _this.languageValue,
          "trans_type": 1,//1:谷歌翻译 2：有道翻译 3：谷歌免费翻译
          "trans_obj": _this.transAll
        }).then((res)=>{
          if(res.code === 0){
            _this.transPayVisibles = true;
            _this.transWordLength = res.data.number;
            _this.transWordMoney = Number(res.data.money).toFixed(2);
          }
        })
      }else{
        this.goTransProcessAll();
      }
    },
    //一键翻译流程
    goTransProcessAll(hide){
      let _this = this;
      if(_this.BGInfo.clearance_cnName){
        if(_this.defaultSlate == 4){//走插件翻译
          let bgValue = _this.chromeToTransBG(_this.BGInfo.clearance_cnName);
          if(bgValue){
            _this.form.setFieldsValue({
            'clearance_enName' : bgValue
            })
          }
        }else{
          trans({
            q: _this.BGInfo,
            to:'en',
            trans_type:_this.defaultSlate
          }).then((res) =>{
            if(res.code === 0){
              _this.form.setFieldsValue({
              'clearance_enName' : res.data.en.clearance_cnName
              })
            }
          })
        }
      }else{
        console.log("报关信息内容为空")
      }
      _this.toNewTrans(hide)
    },
    //  新的翻译
    toNewTrans(hide){
      if(this.languageValue == 'ja') {
        this.defaultSlate = 2
      }
      if(this.defaultSlate == 4){//走插件翻译
        this.languageOR.forEach((item,index)=>{
          transPlugin({
            "trans_type":"encode",
            "trans_obj":this.transAll
          }).then((res)=>{
            if(res.code === 0 ){
              this.chromeToTransAll('auto',item.languages,res.data,item.country,index);
            }else{
              console.log('请求失败')
            }
          })
        })
      }else{
        console.log("languageToTrans",this.languageToTrans,this.languageValue)
        console.log("批量翻译")
        trans({
          trans_type:this.defaultSlate,
          from:this.languageToTrans,
          to:this.languageValue,
          q:this.transAll,
        }).then((res)=>{
          if(res.code === 0 ){
            this.languageOR.forEach((item,index)=>{
              console.log(item)
              this.form.setFieldsValue({
                ['title.'+ item.country]:res.data[item.languages].title,
                ['detail.'+ item.country]:res.data[item.languages].detail,
                ['keywords.'+ item.country]:res.data[item.languages].keywords,
                ['bullet_point1.'+ item.country]:res.data[item.languages].bullet_point1,
                ['bullet_point2.'+ item.country]:res.data[item.languages].bullet_point2,
                ['bullet_point3.'+ item.country]:res.data[item.languages].bullet_point3,
                ['bullet_point4.'+ item.country]:res.data[item.languages].bullet_point4,
                ['bullet_point5.'+ item.country]:res.data[item.languages].bullet_point5,
              });
              this.wordsLimitShow(item.country)
              if(hide){
                setTimeout(hide, 0);
              }
            })
            this.interLoading = false;
              this.$notification.success({
              message: '成功',
              description: res.msg,
              });
          }else{
            this.interLoading = false;
            if(hide){
              setTimeout(hide, 0);
            }
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      }
    },
    //  舍弃的翻译方法
    totrans(val,inx,language){
      if(this.languageValue == 'ja') {
        this.defaultSlate = 2
      }
       trans({
        from:language,
        to:this.languageValue,
        q:val,
        trans_type:this.defaultSlate,
      }).then((res)=>{
        if(res.code === 0){
          console.log(inx,"inx",this.toEN[inx],res.data.res,'res',typeof(inx),"----")
          if(inx === 0){
            this.languageOR.forEach((item,index)=>{
              this.form.setFieldsValue({
                ['title.'+ item.country]:this.replaceStr(res.data[item.languages])
              });
            })
          }else if(inx === 1){
            this.languageOR.forEach((item,index)=>{
              this.form.setFieldsValue({
                ['detail.'+ item.country]:res.data[item.languages]
              });
            })
          }else if(inx === 2){
            this.languageOR.forEach((item,index)=>{
              this.form.setFieldsValue({
              	['keywords.'+ item.country]:res.data[item.languages]
              });
            })
          }else if(inx === 3){
            this.languageOR.forEach((item,index)=>{
              this.form.setFieldsValue({
              	['bullet_point1.'+ item.country]:res.data[item.languages]
              });
            })
          }else if(inx === 4){
            this.languageOR.forEach((item,index)=>{
              this.form.setFieldsValue({
              	['bullet_point2.'+ item.country]:res.data[item.languages]
              });
            })
          }else if(inx === 5){
            this.languageOR.forEach((item,index)=>{
              this.form.setFieldsValue({
              	['bullet_point3.'+ item.country]:res.data[item.languages]
              });
            })
          }else if(inx === 6){
            this.languageOR.forEach((item,index)=>{
              this.form.setFieldsValue({
              	['bullet_point4.'+ item.country]:res.data[item.languages]
              });
            })
          }else if(inx === 7){
            this.languageOR.forEach((item,index)=>{
              this.form.setFieldsValue({
              	['bullet_point5.'+ item.country]:res.data[item.languages]
              });
            })
          }
          this.showEN=true
          this.interLoading = false
        }else{
          this.interLoading = false
          this.$notification.error({
          message: '错误',
          description: res.msg,
          });
        }
      })
    },
    Tointerpret(){
      this.interLoading = true
      let _this = this
      console.log(_this.initCountry,"this.initCountry")
      _this.interList=[
        "title","detail","keywords","bullet_point1","bullet_point2","bullet_point3","bullet_point4","bullet_point5"
      ]
      

      // console.log(_this.initCountry)
      // _this.interList.forEach((item,index)=>{
      //   _this.countryORlanguages.forEach((itm,inx)=>{
      //     if(_this.initCountry === itm.country){
      //       _this.SingleLanguage = itm.languages
      //     }
      //   })
      //   // this.transSingle(this.form.getFieldValue(item+"."+this.initCountry),index,this.SingleLanguage)
      //   console.log(this.form.getFieldValue(item+"."+this.initCountry),index,this.SingleLanguage)
      // })

      _this.countryORlanguages.forEach((itm,inx)=>{
        if(_this.initCountry === itm.country){
          _this.SingleLanguage = itm.languages
        }
      })
      _this.interList.forEach((item,index)=>{
        if(index === 0 ){
          _this.transAll.title = _this.form.getFieldValue(item+"."+this.initCountry)
        }else if(index === 1){
          _this.transAll.detail = _this.form.getFieldValue(item+"."+this.initCountry)
        }else if(index === 2){
          _this.transAll.keywords = _this.form.getFieldValue(item+"."+this.initCountry)
        }else if(index === 3){
          _this.transAll.bullet_point1 = _this.form.getFieldValue(item+"."+this.initCountry)
        }else if(index === 4){
          _this.transAll.bullet_point2 = _this.form.getFieldValue(item+"."+this.initCountry)
        }else if(index === 5){
          _this.transAll.bullet_point3 = _this.form.getFieldValue(item+"."+this.initCountry)
        }else if(index === 6){
          _this.transAll.bullet_point4 = _this.form.getFieldValue(item+"."+this.initCountry)
        }else if(index === 7){
          _this.transAll.bullet_point5 = _this.form.getFieldValue(item+"."+this.initCountry)
        }
      })

      
      if(_this.defaultSlate == 1){
        _this.againModalType = 1;
        trans_fee({
          "to": _this.SingleLanguage,
          "trans_type": 1,//1:谷歌翻译 2：有道翻译 3：谷歌免费翻译
          "trans_obj": _this.transAll
        }).then((res)=>{
          if(res.code === 0){
            _this.transPayVisibles = true;
            _this.transWordLength = res.data.number;
            _this.transWordMoney = Number(res.data.money).toFixed(2);
          }
        })
      }else{
        _this.NewtransSingle(_this.initCountry)
      }


      // _this.NewtransSingle(_this.initCountry)
      // console.log(_this.transAll,"transAll")
    },
    //插件翻译
    chromeToTrans(tl,q,initCountry){
      let _this = this;
      let h = window.chrome;
      let targetExtensionId = _this.chromeCode; // 插件的ID
      let tk = _this.tokenFn(q);
      console.log("插件使用前")
      h && h.runtime && h.runtime.sendMessage ?
      window.chrome.runtime.sendMessage(targetExtensionId,{
        type: 'single',
        action:"detect",
      },function(response){
        if(response === "ok"){
          window.chrome.runtime.sendMessage(targetExtensionId,{
            action:"translate",
            transData:{
              sl:'auto',
              tl:tl,
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
              let resData = data;
              transPlugin({
                "trans_type":"decode",
                "trans_obj":resData
              }).then((res)=>{
                if(res.code === 0 ){
                  console.log('请求成功');
                  _this.form.setFieldsValue({
                    ['title.'+ initCountry]:res.data[0],
                    ['detail.'+ initCountry]:res.data[1],
                    ['keywords.'+ initCountry]:res.data[2],
                    ['bullet_point1.'+ initCountry]:res.data[3],
                    ['bullet_point2.'+ initCountry]:res.data[4],
                    ['bullet_point3.'+ initCountry]:res.data[5],
                    ['bullet_point4.'+ initCountry]:res.data[6],
                    ['bullet_point5.'+ initCountry]:res.data[7],
                  });
                  _this.interLoading = false
                  _this.$notification.success({
                    message: '成功',
                    description: res.msg,
                  });
                  _this.wordsLimitShow(initCountry)
                }else{
                  _this.interLoading = false
                  console.log('请求失败')
                }
              })
            }else{
              _this.interLoading = false
              console.log("插件通信失败")
            }
          })
        }else{
          _this.interLoading = false
          console.log("插件通信失败")
        }
      }) : (console.log("插件未安裝"),_this.interLoading = false)
    },
    //插件一键翻译
    chromeToTransAll(sl,tl,q,country,count){
      let _this = this;
      let h = window.chrome;
      let targetExtensionId = _this.chromeCode; // 插件的ID
      let tk = _this.tokenFn(q);
      console.log("插件使用前")
      h && h.runtime && h.runtime.sendMessage ?
      window.chrome.runtime.sendMessage(targetExtensionId,{
        type: 'single',
        action:"detect",
      },function(response){
        if(response === "ok"){
          window.chrome.runtime.sendMessage(targetExtensionId,{
            action:"translate",
            transData:{
              sl:sl,
              tl:tl,
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
              let resData = data;
              // let resData = response.data;
              transPlugin({
                "trans_type":"decode",
                "trans_obj":resData
              }).then((res)=>{
                if(res.code === 0 ){
                  _this.form.setFieldsValue({
                    ['title.'+ country]:res.data[0],
                    ['detail.'+ country]:res.data[1],
                    ['keywords.'+ country]:res.data[2],
                    ['bullet_point1.'+ country]:res.data[3],
                    ['bullet_point2.'+ country]:res.data[4],
                    ['bullet_point3.'+ country]:res.data[5],
                    ['bullet_point4.'+ country]:res.data[6],
                    ['bullet_point5.'+ country]:res.data[7],
                  });
                  _this.wordsLimitShow(country)
                  if(count>=_this.languageOR.length-1){
                    _this.interLoading = false;
                    _this.$notification.success({
                      message: '成功',
                      description: '翻译成功',
                    });
                  }
                }else{
                  _this.interLoading = false;
                  console.log('请求失败')
                }
              })
            }else{
              _this.interLoading = false;
              console.log("插件通信失败")
            }
          })
        }else{
          _this.interLoading = false;
          console.log("插件通信失败")
        }
      }) : (console.log("插件未安裝"),_this.interLoading = false)
    },
    //插件翻译报关信息
    chromeToTransBG(q){
      let _this = this;
      let h = window.chrome;
      let targetExtensionId = _this.chromeCode; // 插件的ID
      let tk = _this.tokenFn(q);
      console.log("插件使用前")
      h && h.runtime && h.runtime.sendMessage ?
      window.chrome.runtime.sendMessage(targetExtensionId,{
        type: 'single',
        action:"detect",
      },function(response){
        if(response === "ok"){
          window.chrome.runtime.sendMessage(targetExtensionId,{
            action:"translate",
            transData:{
              sl:'auto',
              tl:'en',
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
              let resData = data;
              return resData;
            }else{
              console.log("插件通信失败")
            }
          })
        }else{
          console.log("插件通信失败")
        }
      }) : (console.log("插件未安裝"))
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
    //翻译流程
    goTransProcess(){
      
    },
    // 新的单个翻译
    NewtransSingle(initCountry,hide){
      let _this = this;
      if(this.defaultSlate != 4){
        trans({
          trans_type:this.defaultSlate,
          to:this.SingleLanguage,
          q:this.transAll,
        }).then((res)=>{
          if(res.code === 0 ){
            this.form.setFieldsValue({
              ['title.' + initCountry]:res.data[this.SingleLanguage].title,
              ['detail.' + initCountry]:res.data[this.SingleLanguage].detail,
              ['keywords.' + initCountry]:res.data[this.SingleLanguage].keywords,
              ['bullet_point1.' + initCountry]:res.data[this.SingleLanguage].bullet_point1,
              ['bullet_point2.' + initCountry]:res.data[this.SingleLanguage].bullet_point2,
              ['bullet_point3.' + initCountry]:res.data[this.SingleLanguage].bullet_point3,
              ['bullet_point4.' + initCountry]:res.data[this.SingleLanguage].bullet_point4,
              ['bullet_point5.' + initCountry]:res.data[this.SingleLanguage].bullet_point5,
            });
            this.interLoading = false
            _this.wordsLimitShow(initCountry)
            if(hide){
              setTimeout(hide, 0);
            }
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          }else{
            this.interLoading = false
            console.log('翻译失败')
            if(hide){
              setTimeout(hide, 0);
            }
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      }else{
        transPlugin({
          "trans_type":"encode",
          "trans_obj":this.transAll
        }).then((res)=>{
          if(res.code === 0 ){
            _this.chromeToTrans(_this.SingleLanguage,res.data,initCountry);
          }else{
            console.log('请求失败')
          }
        })
      }
    },
    //单个翻译
    transSingle(val,inx,SingleLanguage){
      console.log(SingleLanguage,'SingleLanguage',inx,"inx",this.initCountry,'this.initCountry')
      if( SingleLanguage == 'ja' ) {
        this.defaultSlate = 2
      }
      trans({
        from:"auto",
        to:SingleLanguage,
        q:val,
        trans_type:this.defaultSlate,
      }).then((res)=>{
        if(res.code === 0){
          console.log("翻译后",res.data)
           if(inx === 0){
            this.form.setFieldsValue({
              ['title.'+ this.initCountry]:this.replaceStr(res.data[this.SingleLanguage])
            })
          }else if(inx === 1){
            this.form.setFieldsValue({
              ['detail.'+ this.initCountry]:res.data[this.SingleLanguage]
            });
          }else if(inx === 2){
            this.form.setFieldsValue({
              ['keywords.'+ this.initCountry]:res.data[this.SingleLanguage]
            });
          }else if(inx === 3){
            console.log('进入')
            this.form.setFieldsValue({
              ['bullet_point1.'+ this.initCountry]:res.data[this.SingleLanguage]
            });
          }else if(inx === 4){
            this.form.setFieldsValue({
              ['bullet_point2.'+ this.initCountry]:res.data[this.SingleLanguage]
            });
          }else if(inx === 5){
            this.form.setFieldsValue({
              ['bullet_point3.'+ this.initCountry]:res.data[this.SingleLanguage]
            });
          }else if(inx === 6){
            this.form.setFieldsValue({
              ['bullet_point4.'+ this.initCountry]:res.data[this.SingleLanguage]
            });
          }else if(inx === 7){
            this.form.setFieldsValue({
              ['bullet_point5.'+ this.initCountry]:res.data[this.SingleLanguage]
            });
          }
        }
      })
    },
    // 判断 是不是中文 brandchange
    brandchange(){
        if(this.isZN(this.form.getFieldValue("brand_name.CN"))){
          this.brandwarning = true;
        }else{
          this.brandwarning = false;
        }
    },
    manufacturerchange(){
      if(this.isZN(this.form.getFieldValue("manufacturer.CN"))){
        this.manufacturerwarning = true;
      }else{
        this.manufacturerwarning = false;
      }
    },
    partNumberchange(){
      if(this.isZN(this.form.getFieldValue("part_number.CN"))){
          this.partNumberwarning = true;
        }else{
          this.partNumberwarning = false; 
        }
    },
    isZN(txt){
      //  /[\x{4e00}-\x{9fa5}]
      　var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
      if (reg.test(txt)){
        // 不是英文
        console.log("不是英文")
        return true
      }else{
        // 是英文
        return false
        console.log("是英文")
      }
    },
     //原语言中文切换
    tabLanguage(tab){
      // console.log(this.powerTab,"ovaa",this.ORI,'ORI',this.tabORI,'tabORI',tab)
      let tabVal2;
      if(tab){
        tabVal2 = 'ORI'
      }else{
        tabVal2 = 'CN'
      }
      if(this.powerTab !== 'CN' ){
        tab?this.ORI = 'ORI': this.ORI = "CN"
        this.tabCountry("CN",tabVal2)
      }else {
        console.log(this.powerTab,"powerTab")
        if(tab !== this.tabORI){
          this.tabORI = !this.tabORI
        }
        tab?this.ORI = 'ORI' : this.ORI = "CN"
        if(this.ORI === "CN"){
          this.trans_obj.title = this.form.getFieldValue("title.ORI")
          this.trans_obj.detail = this.form.getFieldValue("detail.ORI")
          this.trans_obj.keywords = this.form.getFieldValue("keywords.ORI")
          this.trans_obj.bullet_point1 = this.form.getFieldValue("bullet_point1.ORI")
          this.trans_obj.bullet_point2 = this.form.getFieldValue("bullet_point2.ORI")
          this.trans_obj.bullet_point3 = this.form.getFieldValue("bullet_point3.ORI")
          this.trans_obj.bullet_point4 = this.form.getFieldValue("bullet_point4.ORI")
          this.trans_obj.bullet_point5 = this.form.getFieldValue("bullet_point5.ORI")
          this.addNewProduct === 0 ? this.transInfo.from = this.dataAll.ORI.ori_language : "ori"
          this.addNewProduct === 0 ? this.transInfo.id = this.goodsId:this.transInfo.id = this.goodsId = "";
          this.transInfo.to = 'zh-CHS'
          this.transInfo.trans_type = this.defaultSlate
          this.transInfo.trans_obj =  this.trans_obj
          this.tabTrans()
          this.tabCountry("CN",tabVal2)
        }else if(this.ORI === "ORI"){
          this.trans_obj.title = this.form.getFieldValue("title.CN")
          this.trans_obj.detail = this.form.getFieldValue("detail.CN")
          this.trans_obj.keywords = this.form.getFieldValue("keywords.CN")
          this.trans_obj.bullet_point1 = this.form.getFieldValue("bullet_point1.CN")
          this.trans_obj.bullet_point2 = this.form.getFieldValue("bullet_point2.CN")
          this.trans_obj.bullet_point3 = this.form.getFieldValue("bullet_point3.CN")
          this.trans_obj.bullet_point4 = this.form.getFieldValue("bullet_point4.CN")
          this.trans_obj.bullet_point5 = this.form.getFieldValue("bullet_point5.CN")
          this.transInfo.from = 'zh-CHS'
          this.addNewProduct === 0 ? (this.transInfo.id = this.goodsId):(this.transInfo.id = this.goodsId = "");
          this.addNewProduct === 0 ? (this.transInfo.to = this.dataAll.ORI.ori_language) :""
          this.transInfo.trans_type = this.defaultSlate
          this.transInfo.trans_obj = this.trans_obj
          this.tabTrans()
          this.tabCountry("CN",tabVal2)
        }
      }
    },
    wordsLimitShow(tabVal){
      //显示字数限制
      
      let num1,num2;
      if(this.form.getFieldValue('detail.'+tabVal)){
        let detailLimit = this.form.getFieldValue('detail.'+tabVal).length;
        
        if(detailLimit<=2000){
          num1 = 2000-detailLimit;
          this.detailText = "还可输入"+num1+"字";
          this.isDetailBeyond = false;
        }else if(detailLimit>2000){
          num1 = detailLimit-2000;
          this.detailText = "已超过"+num1+"字符";
          this.isDetailBeyond = true;
        }
      }else{
        this.detailText = "还可输入2000字";
        this.isDetailBeyond = false;
      }
      
      if(this.form.getFieldValue('keywords.'+tabVal)){
        let KeyWordLimit = this.form.getFieldValue('keywords.'+tabVal).length;
        if(KeyWordLimit<=250){
          num2 = 250-KeyWordLimit;
          this.keywordsText = "还可输入"+num2+"字";
          this.isKeyBeyond = false;
        }else if(KeyWordLimit>250){
          num2 = KeyWordLimit-250;
          this.keywordsText = "已超过"+num2+"字符";
          this.isKeyBeyond = true;
        }
      }else{
        this.keywordsText = "还可输入250字";
        this.isKeyBeyond = false;
      }
    },
    tabTrans(){
      console.log(this.transInfo,"over11")
      trans(this.transInfo).then((res)=>{
        if(res.code === 0){
          if(this.ORI === "CN"){
            this.form.setFieldsValue({
              'title.CN':res.data.CN.title,
              'detail.CN':res.data.CN.detail,
              'keywords.CN':res.data.CN.keywords,
              'bullet_point1.CN':res.data.CN.bullet_point1,
              'bullet_point2.CN':res.data.CN.bullet_point2,
              'bullet_point3.CN':res.data.CN.bullet_point3,
              'bullet_point4.CN':res.data.CN.bullet_point4,
              'bullet_point5.CN':res.data.CN.bullet_point5,
            });
          }else if(this.ORI === "ORI"){
            this.form.setFieldsValue({
              'title.ORI':res.data.ORI.title,
              'detail.ORI':res.data.ORI.detail,
              'keywords.ORI':res.data.ORI.keywords,
              'bullet_point1.ORI':res.data.ORI.bullet_point1,
              'bullet_point2.ORI':res.data.ORI.bullet_point2,
              'bullet_point3.ORI':res.data.ORI.bullet_point3,
              'bullet_point4.ORI':res.data.ORI.bullet_point4,
              'bullet_point5.ORI':res.data.ORI.bullet_point5,
            });
            console.log(res.data.ORI.title, 'oriTitle')
          }
        }
      })
    },
    // 获取商品信息  llll
    getGoodsLists(){
      let _this = this
      getGoodsList({
        id:_this.goodsId
      }).then((res)=>{
        if(res.code === 0){
          _this.dataAll = res.data;
          console.log(typeof _this.dataAll,'type')
          _this.data = res.data.ORI;
          _this.cardLoading = false;
          _this.fileList = res.data.ORI.image;
          _this.size = res.data.ORI.value_type;
          _this.form.setFieldsValue({
            title:res.data.ORI.title,
          });
          setTimeout(()=>{
            _this.wordsLimitShow('ORI')
          },200)
          _this.getMyStores();
          _this.ifZN()
          _this.InfoFilling("ORI")
          if(res.data.ORI.country){
            _this.queryCurrencyType(res.data.ORI.country);
          }
        }
      })
    },

    //   getGoodsLists(){
    //   var _this = this
    //   getGoodsList({
    //     id:_this.goodsId
    //   }).then((res)=>{
    //     if(res.code === 0){
    //       _this.dataAll = res.data;
    //       console.log(typeof _this.dataAll,'type')
    //       _this.data = res.data.CN;
    //       _this.cardLoading = false;
    //       _this.fileList = res.data.CN.image;
    //       _this.size = res.data.CN.value_type;
    //       _this.form.setFieldsValue({
    //         title:res.data.CN.title,
    //       });
    //       _this.getMyStores();
    //       _this.ifZN()
    //       _this.InfoFilling("CN")
    //       if(res.data.CN.country){
    //         this.queryCurrencyType(res.data.CN.country);
    //       }
    //     }
    //   })
    // },
    changePic(){
      console.log(typeof(this.fileList.length),this.fileList.length,(this.fileList.length>10))
      if(this.fileList.length > 5){
        console.log("大于5张")
        this.changePicList()
      }else{
         console.log("少于5张")
        this.changePicAll()
      }
    },
    //  一个请求多张拉伸
    changePicAll(){
      this.loading = true
      let picUrl = ''
      let picId = ''
      this.fileList.forEach((item,index)=>{
        picUrl += (item.url + ',')
        picId += (item.uid + ',')
      })
      this.imgUrl = picUrl.slice(0,-1)
      this.imgId = picId.slice(0,-1)
      console.log(this.imgUrl)
      imgRessize({
        ids:this.imgId,
        img_array:this.imgUrl
      }).then(res =>{
        if(res.code === 0){
          console.log(res.data)
          this.fileList = res.data
          this.loading = false
          this.$notification.success({
          message: '成功',
          description: res.msg,
          });
        }else{
          this.$notification.error({
          message: '错误',
          description: res.msg,
          });
          this.loading = false
        }
      })
    },
    //  图片单个拉伸
    changePicList(){
      var _this = this
      _this.loading = true
      let picUrl = ''
      let arrurl = []
      for (var i = 0; i < _this.fileList.length; i++) {
        (function(a,list) {
          setTimeout(function() {
            imgRessize({
            img_array:list.url,
            ids:list.uid
            }).then(res =>{
              if(res.code === 0){
                arrurl.push(res.data[0])
                _this.fileList = arrurl
                if(_this.fileList.length === i){
                  _this.loading = false
                  _this.$notification.success({
                  message: '提醒',
                  description: res.msg,
                  });
                }
                console.log(arrurl,"666",_this.fileList,i,_this.fileList.length)
              }else{
                this.loading = false
              }
            })
          }, a*500); //500代表间隔
        })(i,_this.fileList[i])
      }
      // this.fileList.forEach((item,index)=>{
      //   imgRessize({
      //   img_array:item.url,
      //   ids:item.uid
      //   }).then(res =>{
      //     if(res.code === 0){
      //       arrurl.push(res.data[0])
      //       if(this.fileList.length === (index+1)){
      //         this.loading = false
      //         this.fileList = arrurl
      //         this.$notification.success({
      //         message: '提醒',
      //         description: res.msg,
      //         });
      //       }
      //       console.log(arrurl)
      //     }else{
      //       console.log("第"+(index+1)+ "张图片拉伸失败")
      //     }
      //   })
      // })
    },
    // 生成售价
    toSum(sumType){
      console.log(sumType,"sumType")
      console.log(this.form.getFieldValue('cost.'+sumType),'cost')
      console.log(this.form.getFieldValue('freight.'+sumType),'freight')
      console.log(this.form.getFieldValue('profit.'+sumType),'profit')
      if(!this.form.getFieldValue('cost.'+sumType)){
        this.alertErr("成本不能为空")
      }else if(this.form.getFieldValue('cost.'+sumType) < 0){
        this.alertErr("成本不能为负数")
      }else if(!this.form.getFieldValue('freight.'+sumType)){
        this.alertErr("运费不能为空")
      }else if(this.form.getFieldValue('freight.'+sumType) < 0){
        this.alertErr("运费不能为负数")
      }else if(!this.form.getFieldValue('profit.'+sumType)){
        this.alertErr("利润不能为空")
      }else if(this.form.getFieldValue('profit.'+sumType) < 0){
        this.alertErr("利润不能为负数")
      }else{
        // console.log(this.form.getFieldValue('cost.'+sumType).length,"length")
        console.log(this.form.getFieldValue('cost.'+sumType),typeof this.form.getFieldValue('cost.'+sumType),"this.form.getFieldValue(['cost.'+sumType])")
        let toPrice = ((Number(this.form.getFieldValue('cost.'+sumType))+Number(this.form.getFieldValue('freight.'+sumType))+Number(this.form.getFieldValue('profit.'+sumType))) /0.85).toFixed(2)
        let PriceAll =(Number(this.form.getFieldValue('cost.'+sumType))+Number(this.form.getFieldValue('freight.'+sumType))+Number(this.form.getFieldValue('profit.'+sumType)))
        console.log(toPrice,PriceAll,"PriceAll++++++++++++++++", ["price."+sumType],"售价",(((Number(toPrice)*0.15)+Number(PriceAll)).toFixed(2)*(Number(this.exchange[sumType]))).toFixed(2),"汇率",this.exchange[sumType])
        if(this.exchange.length <=0){
          this.alertErr("请先选择站点")
        }else{
          if(sumType=="CN" || sumType=="ORI"){
            console.log("生成中国售价")
            this.form.setFieldsValue({
              // （成本+运费+利润）/0.85 *0.15 +(成本+运费+利润) =售价
              ["price."+sumType]:((Number(toPrice)*0.15)+Number(PriceAll)).toFixed(2)
            });
            // 申报金额usd填充
            productCurrency({
              money:"666",
              to:"CNY",
              from:"USD"
            }).then(res=>{
              if(res.code === 0){
                //exchange
              let usdNUM = (((Number(toPrice)*0.15)+Number(PriceAll)).toFixed(2)*(Number(res.data[1].exchange))).toFixed(2)
                if(usdNUM<15){
                  this.form.setFieldsValue({
                    clearance_usd:usdNUM
                  });
                }else{
                  this.form.setFieldsValue({
                    clearance_usd:15
                  });
                }
              }
            })
          }else{
            this.form.setFieldsValue({
              //exchange
              // （成本+运费+利润）/0.85 *0.15 +(成本+运费+利润) =售价*汇率
              ["price."+sumType]:(((Number(toPrice)*0.15)+Number(PriceAll)).toFixed(2)*(Number(this.exchange[sumType]))).toFixed(2)
            });
          }
        }
      }
    },
    // 转换英寸
    toInch(){
      this.form.setFieldsValue({
        length:(Number(this.form.getFieldValue('length'))/2.54 ).toFixed(2)
      });
      this.form.setFieldsValue({
        width:(Number(this.form.getFieldValue('width'))/2.54 ).toFixed(2)
      });
      this.form.setFieldsValue({
        height:(Number(this.form.getFieldValue('height'))/2.54 ).toFixed(2)
      });
      this.size = "inch"
    },
    // 转换厘米
    toCm(){
      this.form.setFieldsValue({
        length:(Number(this.form.getFieldValue('length'))*2.54 ).toFixed(2)
      });
      this.form.setFieldsValue({
        width:(Number(this.form.getFieldValue('width'))*2.54 ).toFixed(2)
      });
      this.form.setFieldsValue({
        height:(Number(this.form.getFieldValue('height'))*2.54 ).toFixed(2)
      });
      this.size = "cm"
    },
    // upc 随机
    upcRandom(){
      getUpc({}).then((res)=>{
        this.form.setFieldsValue({
          upc: res.data.upc
        });
      })
    },
    //sku 随机
    skuRandom(){
      let ranstr=  ["0","1","2","3","4","5","6","7","8","9","A","a","B","b","C","c","D","d","E","e","F","f","G","g","H","h","I","i","J","j","K","k","L","l","M","m","N","n","O","o","P","p","Q","q","R","r","S","s","T","t","U","u","V","v","W","w","X","x","Y","y",'Z',"z"]
        let result = "";
        let r = ''
        for(var i=0;i<16;i++){
          r=Math.floor(Math.random()*16);
          result+=ranstr[r];
        }
      this.form.setFieldsValue({
        sku: result,
        ['part_number.CN']:result
      });
    },
    // 公共err弹窗
    alertErr(val){
      this.$notification.error({
      message: '错误',
      description: val,
      });
    },
    // 五点描述填充
    InfoFilling(CountryCode){
      console.log("执行了")
      setTimeout(()=>{
        console.log(this.form.getFieldValue('bullet_point1.'+CountryCode),"over")
        let InfoAreaAll=[]
        InfoAreaAll[0]= '1' + this.form.getFieldValue('bullet_point1.'+CountryCode)
        InfoAreaAll[1]= '2' +this.form.getFieldValue('bullet_point2.'+CountryCode)
        InfoAreaAll[2]= '3' +this.form.getFieldValue('bullet_point3.'+CountryCode)
        InfoAreaAll[3]= '4' +this.form.getFieldValue('bullet_point4.'+CountryCode)
        InfoAreaAll[4]= '5' +this.form.getFieldValue('bullet_point5.'+CountryCode)
        console.log(InfoAreaAll,"InfoAreaAll")
        var ll = InfoAreaAll.join(`\n`)
        console.log(ll)
        this.form.setFieldsValue({
            ['initialAll.' + CountryCode]:ll
          });
      },200)
    },
    // 五点描述All填充
    changeBullet(count){
      let bulletREG = /\n/g
      let bulletArr = new Array()
      bulletArr = this.form.getFieldValue('initialAll.' + count).split(bulletREG)
      let arres = ["bullet_point1","bullet_point2","bullet_point3","bullet_point4","bullet_point5"]
      bulletArr.forEach((item,index)=>{
        if(bulletArr.length >= arres.length){
          this.form.setFieldsValue({
            [arres[index]+"."+count]:item
          });
        }else{
          if(bulletArr.length === 4){
            console.log(bulletArr.length,"length")
            this.form.setFieldsValue({
            [arres[index]+"."+count]:item
            });
             this.form.setFieldsValue({
            [arres[4]+"."+count]:""
            });
          }else if(bulletArr.length === 3){
            console.log(bulletArr.length,"length")
            this.form.setFieldsValue({
            [arres[index]+"."+count]:item
            });
            this.form.setFieldsValue({
            [arres[3]+"."+count]:""
            });
            this.form.setFieldsValue({
            [arres[4]+"."+count]:""
            });
          }else if(bulletArr.length === 2){
            console.log(bulletArr.length,"length")
            this.form.setFieldsValue({
            [arres[index]+"."+count]:item
            });
            this.form.setFieldsValue({
            [arres[3]+"."+count]:""
            });
            this.form.setFieldsValue({
            [arres[4]+"."+count]:""
            });
             this.form.setFieldsValue({
            [arres[2]+"."+count]:""
            });
          }else if(bulletArr.length === 1){
            this.form.setFieldsValue({
            [arres[index]+"."+count]:item
            });
             this.form.setFieldsValue({
            [arres[1]+"."+count]:""
            });
            this.form.setFieldsValue({
            [arres[3]+"."+count]:""
            });
            this.form.setFieldsValue({
            [arres[4]+"."+count]:""
            });
             this.form.setFieldsValue({
            [arres[2]+"."+count]:""
            });
          }
        }
      })
    },
    beforeUpload (file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      // if (!isJPG || !isPNG) {
      //   this.$message.error('You can only upload JPG amd png file!')
      // }
      // const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isLt2M) {
      //   this.$message.error('Image must smaller than 2MB!')
      // }
      // return isJPG && isLt2M
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file ) {
      console.log("file" , file,"666",file.uid)
      this.fileID = file.uid
      this.previewImage = file.url || file.thumbUrl
      // console.log(file.thumbUrl)
      this.previewVisible = true;
      setTimeout(() => {
        this.nWidth = document.getElementById('imgbox').naturalWidth;
        this.nHeight = document.getElementById('imgbox').naturalHeight;
      }, 300);
    },
    setMain(id){
      this.fileID = id
      console.log(this.fileID,this.fileList);
      this.fileList.forEach((item,index)=>{
        if(this.fileID=== this.fileList[index].uid){
         this.imgMain = this.fileList.splice(index,1)
         this.fileList.unshift(this.imgMain[0])
        }
      })
      this.previewVisible = false
    },
    toMeitu(picUrl){
      this.M_URL={}
      this.M_URL.pic_URL = ''
      this.M_URL.file_ID = ''
      window.open(this.GLOBAL.BASE_URL+"beautify/index.html?url="+picUrl+"&index="+this.fileID)
      Vue.ls.set("monitor_URL",this.M_URL)
      const clearTime = setInterval(()=>{
        if(Vue.ls.get("monitor_URL").file_ID){
          window.clearInterval(clearTime)
          this.previewImage =  Vue.ls.get("monitor_URL").pic_URL
          this.fileList.forEach((item,index)=>{
            if(item.uid == Vue.ls.get("monitor_URL").file_ID){
              this.fileList[index].url = Vue.ls.get("monitor_URL").pic_URL;
              this.previewVisible = false
              this.handleCancel()
              this.M_URL={}
              this.M_URL.pic_URL = ''
              this.M_URL.file_ID = ''
              Vue.ls.set("monitor_URL",this.M_URL)
            }
          })
          this.fileID = Vue.ls.get("monitor_URL").file_ID
        }
      },500)
    },
    handleChange ({ fileList, file }) {
      this.fileName = file.thumbUrl
      this.fileList = fileList
      this.fileList.forEach((item, index) => {
        if(item.status === "done") {
          this.fileList[index].url = item.response.data.url
        }
      })
      // 刷新数组
      this.fileList.reverse().reverse()
      console.log(this.fileList)
      // if(file.status === "done") {  
      //   this.fileList.forEach((item,index) => {
      //     if( index === this.fileList.length - 1 && !item.url ) {
      //       upload({
      //         file:item.thumbUrl
      //       }).then((res)=>{
      //           if(res.code === 0) {
      //             this.fileList[index].url= res.data.url
      //           }
      //         })
      //     }
      //   })
      // }
    },
    jumpto(val){
      console.log(val)
      if(val) {
        window.open(val, "_blank");
      }else if( val == null ) {
        window.open(this.addNewUrl, "_blank")
      }
      else {
        console.log("跳转失败")
        this.$notification.error({
          message: '提醒',
          description: '跳转失败',
        });
      }
    },
    Recharge(){
      this.$router.push({
        path:"/rechange/fund"
      })
    },
    goBack(){
      this.$router.go(-1)
      // console.log(window.history,"history",router)
    },
    selectCountry(){
      // if(this.form.getFieldValue('country')){
      //   console.log("发送请求country",this.form.getFieldValue('country'))
      // }
    },
    createIframe(imgSrc) { 
      if (document.getElementById('IframeReportImg').length === 0){
        body.html('<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="downloadImg();" width="0" height="0" src="about:blank"></iframe>')
      }
      if(document.getElementById('IframeReportImg').attr("src") != imgSrc){ 
        document.getElementById('IframeReportImg').attr("src")
      }else{
        this.downloadImg()
      }
    },
    downloadImg(){
      if (document.getElementById('IframeReportImg').src != "about:blank") {
        window.frames["IframeReportImg"].document.execCommand("SaveAs"); 
      }
    },
    download(imgSrc,num){ 
      this. createIframe(imgSrc)
    },
    SlateChange(val){
      Vue.ls.set('SLATE_TYPE',val);
      console.log(val,"over")
      if(val ==="1"){
        this.characterTxt = '（100万字符=20美元）'
      }else if(val ==="2"){
        this.characterTxt = '（100万字符=48人民币）'
      }else if(val ==="3" || val ==="4"){
        this.characterTxt = '（注：免费翻译会不准确，有时出现无法翻译现象！）'
      }
    },
    editStatus() {
      this.editState = !this.editState
    },
    //字数限制
    wordCountLimit(type,str){
      let _this = this;
      let full_Value = str.target.value;
      if(type == 1){//详情
        if(full_Value.length>0&&full_Value.length<=2000){
          _this.detailCount = 2000 - full_Value.length;
          _this.detailText = "还可输入"+_this.detailCount+"字";
          _this.isDetailBeyond = false;
        }else if(full_Value.length>2000){
          _this.isDetailBeyond = true;
          _this.detailCount = full_Value.length-2000;
          _this.detailText = "已超过"+_this.detailCount+"字符";
        }else{
          _this.detailText = "还可输入2000字";
          _this.isDetailBeyond = false;
        }
      }else{//关键字
        if(full_Value.length>0&&full_Value.length<=250){
          _this.keywordsCount = 250 - full_Value.length;
          _this.keywordsText = "还可输入"+_this.keywordsCount+"字";
          _this.isKeyBeyond = false;
        }else if(full_Value.length>250){
          _this.isKeyBeyond = true;
          _this.keywordsCount = full_Value.length-250;
          _this.keywordsText = "已超过"+_this.keywordsCount+"字符";
        }else{
          _this.keywordsText = "还可输入250字";
          _this.isKeyBeyond = false;
        }
      }
    },
    handleOkTrans(){
      let _this = this;
      const hide = this.$message.loading('扣费中', 0);
      if(this.againModalType == 1){
        _this.transPayVisibles = false;
        _this.NewtransSingle(_this.initCountry,hide)
      }else{
        _this.transPayVisibles = false;
        this.goTransProcessAll(hide);
      }
    },
    handleCancelTrans(){
      this.transPayVisibles = false;
      this.interLoading = false;
    }
  },
  created(){
  },
  mounted(){
//     　　this.$dragging.$on('dragged', (value) => {
//           console.log(value.value.list)
// 　　　　//因为我这在排序的时候不需要做处理，所以空着就行
//         //https://www.cnblogs.com/zengkai/p/9641769.html
// 　　　　})
    // this.$dragging.$on('dragged', ({ value }) => {
    //   console.log(value.item)
    //   console.log(value.list)
    //   console.log(value.otherData)
    // })
    // this.$dragging.$on('dragend', () => {
    // })

    this.token = Vue.ls.get('Access-Token')
    if(Vue.ls.get('CHROME_ID')){
      this.chromeCode = Vue.ls.get('CHROME_ID')
    }else{
      this.chromeCode  = "jdjacbknodjemkphlacpedfenmohdcla"
    }
    // this.chromeCode = Vue.ls.get('CHROME_ID')
    console.log(this.token)
    this.goodsId = this.$route.query.id;
    this.site = this.$route.query.site;
    this.addNewProduct = this.$route.query.type;
    this.balance = Number(this.$store.state.user.balance);
    console.log(typeof this.balance)
    console.log(this.addNewProduct, typeof this.addNewProduct, this.site)
    this.addNewProduct = Number(this.addNewProduct)
    if(this.addNewProduct === 1) {
      // if(window.performance.navigation.type == 0) {
        this.cardLoading = false;
        this.getMyStores();
        this.editState = false
    }else {
      // if(window.performance.navigation.type == 0) {
        this.cardLoading = false;
        this.getGoodsLists();
        this.editState = true
      // }else{
      //   console.log("首次被加载")
      //   this.cardLoading = false;
      //   this.getGoodsLists();
      // }
    }
    if(Vue.ls.get("SLATE_TYPE")){
      this.defaultSlate = Vue.ls.get("SLATE_TYPE")
      if(Vue.ls.get("SLATE_TYPE") ==="1"){
        this.characterTxt = '（100万字符=20美元）'
      }else if(Vue.ls.get("SLATE_TYPE") ==="2"){
        this.characterTxt = '（100万字符=48人民币）'
      }else if(Vue.ls.get("SLATE_TYPE") ==="3" || Vue.ls.get("SLATE_TYPE") ==="4"){
        this.characterTxt = '（注：免费翻译会不准确，有时出现无法翻译现象！）'
      }
    }else{
      this.defaultSlate = '1'
    }
    
  },
}
</script>

<style lang="less" scoped>
.ml{margin-left:20px;}
.ml-s{margin-left:10px;}
.mt{margin-top:10px;}
.mr{margin-right:10px;}
.ml-sm{margin-left:5px;}
.mr-sm{margin-right:5px;}
.formcolor{
  background: #fff;
  padding:25px 0 1px;
}
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
.pic-box{
  display: flex;
  flex-wrap: wrap;
  width: 660px;
  .pic{
    width: 100px;
    height: 150px;
    margin-right: 10px;
    img{
      width: 100%;
      }
    .btns{
       width: 100%;
      text-align: center;
    }
  }
}
.uploadimg{
  width: 100px;
}
.tal{text-align: left;}
.tar{text-align: right;}
.dis-flex{
  display: flex;
}
.rt{
  float:right;
}
.ant-select-selection-selected-value > .tal > .anticon-right{
  display: none;
}
.dis-flex{
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
  transition:all .5s;
  -moz-transition:all .5s;
  -webkit-transition:all .5s;
  -o-transition:all .5s;
}
.image-box:hover .mask-layer {
  opacity: 0.7;
}
.icon-eye {
  cursor: pointer;
  position: absolute;
  top: 45%;
  left: 20%;
  color: white;
  display: none
}
.icon-delete {
  cursor: pointer;
  position: absolute;
  top: 45%;
  left: 40%;
  color: white;
  display: none
}
.icon-home {
  cursor: pointer;
  position: absolute;
  top: 45%;
  left: 60%;
  color: white;
  display: none
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
</style>
<style>
.show{
  display: block  !important;
}
.hide{
  display:none !important;
}
.ant-upload-list-picture-card {
  display: none;
}
.over-hidden {
  overflow: hidden;
}
.beyondClass{
  color: red;
}
.limitTip{
  margin-left: 10px;
}
</style>