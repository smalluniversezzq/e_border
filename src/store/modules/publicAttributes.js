import Vue from 'vue'
// import {
//   CountDown
// } from '@/components/index';

const publicAttributes = {
  state: {
    setCountTime: 0,
    countDownText: ''
  },
  mutations: {
    setCountTime: (state, countTime, type) => {
      console.log(state, countTime, type, '999999')
      let obj = null
      var intervals = setInterval(() => {
        countTime--;
        if (countTime > 0) {
          let min = parseInt(countTime / 60)
          let sec = parseInt(countTime % 60 % 60)
          min = min < 10 ? '0' + min : min;
          sec = sec < 10 ? '0' + sec : sec;
          obj = {
            min: min,
            sec: sec
          }
          state.countDownText = obj.min + '分' + obj.sec + '秒后，可再次发布'
          state.setCountTime = countTime
          console.log(countTime, "qwe")
          // Vue.ls.set(countDownText, state.countDownText)
          // Vue.ls.set(setCountTime, state.setCountTime)
        } else {
          console.log('清除计时器前', intervals)
          clearInterval(intervals)
          // type ? '' : (Vue.ls.remove("countDesInfoShopValue"), Vue.ls.remove("countDesInfoClassValueType"))
        }
      }, 1000)

    },
  },
  actions: {
    setCountTime(context, countTime, type) {
      context.commit('setCountTime', countTime, type)
    }
  }
}

export default publicAttributes