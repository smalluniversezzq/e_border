<template>
  <div class="screen">
    asd
    <!-- <a-row   class='mt'>
        <a-col  class='title-size' :span='2'>店铺名称</a-col>
        <a-col :span='2' >
          <a-button size="small" @click='storeVal("all")'>全部</a-button>
        </a-col>
        <a-col :span='2'  v-for='(item,index) in myStore' :key='index'>
          <a-button size="small" @click='storeVal(item.id)'>{{item.title}}</a-button>
        </a-col>
      </a-row>
      <a-row  class='mt'>
        <a-col  class='title-size' :span='2'>国家</a-col>
        <a-col :span='2'>
        <a-button size="small" @click='countryVal("all")'>全部</a-button>
        </a-col>
        <a-col class='mb' :span='2'  v-for='(item,index) in CountryList' :key="index">
          <a-button   @click='countryVal(item.title)' size="small">{{item.value}}</a-button>
        </a-col>
    </a-row>-->
  </div>
</template>
<script>
export default {
  props: [],
  name: 'screen',
  data() {
    return {}
  },
  methods: {
    storeVal(id) {
      this.storeId = id
      this.info = {
        page: this.current,
        status: 0,
        is_checked: 0,
        store_id: this.storeId,
        country: 'all'
      }
      if (id === 'all') {
        this.CountryList = this.country
      }
      this.allGetOrderList(this.info)
      this.myStore.forEach((item, index) => {
        if (item.id === id) {
          this.CountryList = item.mws_site
        }
      })
    },
    countryVal(val) {
      this.countryId = val
      this.info = {
        page: this.current,
        status: 0,
        is_checked: 0,
        store_id: this.storeId,
        country: this.countryId
      }
      this.allGetOrderList(this.info)
    }
  },
  created() {},
  mounted() {
    alert('666')
  }
}
</script>

