<template>
  <div class="DateScreen">
    <a-range-picker
      :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
      @change="onChange"
    />
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'DateScreen',
  components: {
  },
  props: {},
  watch: {
  },
  data () {
    return {
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM',
      start_time:"",
      end_time:"",
      }
    },
  methods: {
    moment,
    onChange(dates, dateStrings) {
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      this.start_time = dateStrings[0]
      this.end_time = dateStrings[1]
      let info = {
        start_time:this.start_time,
        end_time:this.end_time,
      }
      this.$emit('dataScreenInfo',info)
    },

  },
  created(){

  },
  mounted(){

  },


}

</script>
<style lang="less" scoped>
</style>
