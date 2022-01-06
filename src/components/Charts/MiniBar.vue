<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="orderData" :padding="[36, 5, 18, 5]">
        <v-tooltip />
        <v-bar position="key*value" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
const data = []
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

const scale = [{
  dataKey: 'key',
  min: 2
}, {
  dataKey: 'value',
  title: '时间',
  min: 1,
  max: 30
}]

export default {
  name: 'MiniBar',
  props:['orderData'],
  data () {
    return {
      data,
      tooltip,
      scale,
      height: 100
    }
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
