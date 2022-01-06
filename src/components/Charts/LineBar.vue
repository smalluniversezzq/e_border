<template>
  <div class="line-bar antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :forceFit="true" :height="height" :data="datatherr"  :padding="[36, 5, 18, 5]" :scale="scale">
        <v-tooltip />
        <v-line position="key*value" />
        <v-point position="key*value" shape="circle" />
      </v-chart>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
const data = []
// const datatherr = [
//   { key: '10-01', value: 30 },
//   { key: '10-02', value: 3 },
//   { key: '10-03', value: 100 },
//   { key: '10-04', value: 3 },
//   { key: '10-05', value: 20 },
//   { key: '10-06', value: 3 },
//   { key: '10-07', value: 1 },
//   { key: '10-00', value: 1 },
// ];

const scale = [{
  dataKey: 'value',
  min: 0,
},{
  dataKey: 'key',
  min: 0,
  max: 1,
}];
const beginDay = new Date().getTime()

for (let i = 0; i < 10; i++) {
  data.push({
    key: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    value: Math.round(Math.random() * 10)
  })
}

const tooltip = [
  'key*value',
  (key, value) => ({
    name: key,
    value: value
  })
]

export default {
  name: 'LineBar',
  props:['datatherr'],
  data () {
    return {
      data,
      tooltip,
      height:110,
      // datatherr,
      scale,
    }
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
