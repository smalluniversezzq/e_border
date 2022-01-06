export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () { }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
//空对象转空数组
export function handlerData(obj) {
  if (JSON.stringify(obj) == '{}') {
    return []
  } else {
    return obj
  }
}
// 深拷贝
export function deepClone(obj){
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
}

export function copyData(obj){
  if(obj === null) return null 
  if(typeof obj !== 'object') return obj;
  if(obj.constructor===Date) return new Date(obj); 
  var newObj = new obj.constructor ();  //保持继承链
  for (var key in obj) {
      if (obj.hasOwnProperty(key)) {   //不遍历其原型链上的属性
          var val = obj[key];
          newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; // 使用arguments.callee解除与函数名的耦合
      }
  }  
  return newObj; 
}
