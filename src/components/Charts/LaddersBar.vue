<template>
  <div class="ladders-bar antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :scale="scale">
          <v-tooltip />
             <v-line position="year*value" />
            <v-point position="year*value" shape="circle" />
        </v-chart>
    </div>
  </div>
</template>

<script>

import moment from 'moment'

const data = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];

const scale = [{
  dataKey: 'value',
  min: 0,
},{
  dataKey: 'year',
  min: 0,
  max: 1,
}];

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]

export default {
  name: 'LaddersBar',
  data () {
    return {
      data,
      tooltip,
      height:100,
      scale,
    }
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
