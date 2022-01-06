const PROTOCOL = window.location.protocol
const domain = window.location.host
const BASE_URL = PROTOCOL === 'http:' ? ('http://' + domain + '/') : ('https://' + domain + '/')
const CALCULATE_URL = BASE_URL + 'v1/#/home/homes/feeCalculate' // 运费测算链接
const url = window.location.href
// eslint-disable-next-line camelcase
let logoText, logoIcon, picType, login_Bac, EnLogoText, Explain, paymentInfo, translateType
// eslint-disable-next-line no-unused-vars,camelcase
let loginTxt, Copyright, address, info, DOWNLOAD_FORMSL_URL, chrome, urlType, login_logo

const chromeCode = 'chkfgplodblpnkdckojpdmlogdipkkfd'

const urlArr = [
  'localhost:8000',
  '127.0.0.1:8000',
  'erp.yunzanet.com',
  'www.jindeng.top',
  'erp319.czkjds.com',
  'erp.liqikeji6.com',
  'test.outaokj.com'
]

const ekuajingUrlArr = [
  'erp.yunzanet.com',
  'www.jindeng.top',
  'erp319.czkjds.com',
  'erp.liqikeji6.com',
  'test.outaokj.com'
]
// eslint-disable-next-line no-unused-vars
const IS_E = ekuajingUrlArr.includes(domain) ? true : false

// eslint-disable-next-line prefer-const
urlType = urlArr.includes(BASE_URL) ? true : false
const projectDeployData = [
  // 本地
  {
    picType: 'E',
    linkUrl: 'localhost:8000',
    logoText: 'E跨境',
    EnLogoText: 'E CROSS-BORDER',
    Explain: '做您身边的跨境专家，让跨境更简单',
    loginTxt: '欢迎来到E跨境电商平台',
    logoIcon: 'logo.png',
    login_Bac: 'bg.png',
    Copyright: 'Copyright &copy;2020 河南邦耀网络科技有限公司',
    address: '郑州市郑东新区商务外环13号绿地峰会天下20层',
    paymentInfo: 3,
    translateType: 1,
    info: {
      tel: '15600357306',
      mail: 'AMZ.Service@ekuajing.cn',
      webSite: 'www.ekuajing.cn'
    },
    chrome: 'none',
    DOWNLOAD_FORMSL_URL: 'https://eborder.oss-cn-zhangjiakou.aliyuncs.com/share-chrome.zip'
  },
  {
    picType: 'E',
    linkUrl: 'test.outaokj.com',
    logoText: 'E跨境',
    EnLogoText: 'E CROSS-BORDER',
    Explain: '做您身边的跨境专家，让跨境更简单',
    loginTxt: '欢迎来到E跨境电商平台',
    logoIcon: 'logo.png',
    login_Bac: 'bg.png',
    Copyright: 'Copyright &copy;2020 河南邦耀网络科技有限公司',
    address: '郑州市郑东新区商务外环13号绿地峰会天下20层',
    paymentInfo: 3,
    translateType: 1,
    info: {
      tel: '15600357306',
      mail: 'AMZ.Service@ekuajing.cn',
      webSite: 'test.outaokj.com'
    },
    chrome: 'none',
    DOWNLOAD_FORMSL_URL: 'http://erp.yunzanet.com/crawl.zip'
  },
  {
    picType: 'LEGEND',
    linkUrl: 'kjerp.myhost.com',
    logoText: '传奇跨境',
    EnLogoText: 'LEGEND CROSS-BORDER',
    Explain: '做您身边的跨境专家，让跨境更简单',
    loginTxt: '欢迎来传奇跨境电商平台',
    logoIcon: 'logo.png',
    login_Bac: 'bg.png',
    Copyright: 'Copyright &copy;2020 云赞信息技术有限公司',
    address: '郑州市金水区花园路59号居易摩根中心7层',
    paymentInfo: 0,
    translateType: 1,
    info: {
      tel: '15978431369',
      mail: '1779783620@qq.com',
      webSite: 'kjerp.myhost.com'
    },
    // chrome: {
    //   routers: 'installtutorial',
    //   url: 'https://chrome.google.com/webstore/detail/e跨境/jdjacbknodjemkphlacpedfenmohdcla?hl=zh-CN&pli=1&authuser=1',
    //   id: 'jdjacbknodjemkphlacpedfenmohdcla'
    // },
    chrome: 'none',
    DOWNLOAD_FORMSL_URL: 'http://erp.yunzanet.com/crawl.zip'
  },
  {
    picType: 'LEGEND',
    linkUrl: 'erp.yunzanet.com',
    logoText: '传奇跨境',
    EnLogoText: 'LEGEND CROSS-BORDER',
    Explain: '做您身边的跨境专家，让跨境更简单',
    loginTxt: '欢迎来传奇跨境电商平台',
    logoIcon: 'logo.png',
    login_Bac: 'bg.png',
    Copyright: 'Copyright &copy;2020 郑州传奇科技有限公司',
    address: '郑州市金水区花园路59号居易摩根中心14层',
    paymentInfo: 0,
    translateType: 1,
    info: {
      tel: '15978431369',
      mail: '1779783620@qq.com',
      webSite: 'erp.yunzanet.com'
    },
    chrome: 'none',
    DOWNLOAD_FORMSL_URL: 'http://erp.yunzanet.com/crawl.zip'
  },
  {
    picType: 'YL',
    linkUrl: 'www.jindeng.top',
    logoText: '云朗跨境',
    EnLogoText: 'LEGEND CROSS-BORDER',
    Explain: '做您身边的跨境专家，让跨境更简单',
    loginTxt: '欢迎来到云朗跨境电商平台',
    logoIcon: 'logo.png',
    login_Bac: 'bg.png',
    Copyright: 'Copyright &copy;2020 冀ICP备2020027638号 河北锦登网络科技有限公司',
    address: '河北省沧州市运河区北京路渤海紫信大厦1009室',
    paymentInfo: 3,
    translateType: 1,
    info: {
      tel: '15512780768',
      mail: '419441409@qq.com',
      webSite: 'www.jindeng.top'
    },
    chrome: 'none',
    DOWNLOAD_FORMSL_URL: 'http://erp.yunzanet.com/crawl.zip'
  },
  {
    picType: 'CZ',
    linkUrl: 'erp319.czkjds.com',
    logoText: '',
    EnLogoText: 'LEGEND CROSS-BORDER',
    Explain: '做您身边的跨境专家，让跨境更简单',
    loginTxt: '欢迎来到沧众电商平台',
    logoIcon: 'logo.png',
    login_Bac: 'bg.png',
    Copyright: 'Copyright &copy;2021 豫ICP备19020127号-1 河南沧众跨境电商有限公司',
    address: '河南省自贸区郑州片区（经开)航海东路1508号保税区综合楼2层',
    paymentInfo: 3,
    translateType: 1,
    info: {
      tel: '15093413319',
      mail: '1400174000@qq.com',
      webSite: 'erp319.czkjds.com'
    },
    chrome: 'none',
    DOWNLOAD_FORMSL_URL: 'http://erp.yunzanet.com/crawl.zip'
  },
  {
    picType: 'LQ',
    linkUrl: 'erp.liqikeji6.com',
    logoText: '立启跨境',
    EnLogoText: 'LEGEND CROSS-BORDER',
    Explain: '做您身边的跨境专家，让跨境更简单',
    loginTxt: '欢迎来到立启电商平台',
    logoIcon: 'logo.png',
    login_Bac: 'bg.png',
    Copyright: 'Copyright &copy;2021 晋ICP备2021003004号-1 立启科技有限公司',
    address: '山西省原平市古玩城内',
    paymentInfo: 3,
    translateType: 1,
    info: {
      tel: '15600399121',
      mail: '793453343@qq.com',
      webSite: 'erp.liqikeji6.com'
    },
    chrome: 'none',
    DOWNLOAD_FORMSL_URL: 'http://erp.yunzanet.com/crawl.zip'
  }
]

projectDeployData.forEach((item) => {
  if (url.indexOf(item.linkUrl) !== -1) {
    item.linkUrl = PROTOCOL + '//' + item.linkUrl
    if (item.info !== 'none') {
      item.info.webSite = PROTOCOL + '//' + item.info.webSite
    }
    paymentInfo = item.paymentInfo
    translateType = item.translateType
    picType = item.picType
    logoText = item.logoText
    EnLogoText = item.EnLogoText
    Explain = item.Explain
    loginTxt = item.loginTxt
    logoIcon = item.logoIcon
    login_Bac = item.login_Bac
    login_logo = item.login_logo
    Copyright = item.Copyright
    address = item.address
    info = item.info
    chrome = item.chrome
    DOWNLOAD_FORMSL_URL = item.DOWNLOAD_FORMSL_URL
  }
})

export default {
  BASE_URL,
  PROTOCOL,
  IS_E,
  CALCULATE_URL,
  DOWNLOAD_FORMSL_URL,
  logoText,
  EnLogoText,
  Explain,
  logoIcon,
  picType,
  login_Bac,
  login_logo,
  loginTxt,
  Copyright,
  address,
  info,
  chrome,
  urlType,
  paymentInfo,
  translateType,
  chromeCode
}
