<template>
  <div class="newdanmu">
    <div id="barrage">
      <div class="bobao" :style="{top:'-' + tops + 'px'}">
        <div class="record_list cursor" v-for="(item,index) in swiperList" :key='index'  @click='jumpTos(item.id)' >
            {{item.title}}{{item.created_at}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['swiperList'],
  data() {
    return {
      upbarrage: "",
      data:"",
      // datas:[
      //   {
      //     remark:"1每日抽奖获得积分9,已存入积分银行",
      //     price:"10",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //       {
      //     remark:"2每日抽奖获得积分9,已存入积分银行",
      //     price:"11",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //       {
      //     remark:"3每日抽奖获得积分9,已存入积分银行",
      //     price:"12",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //       {
      //     remark:"4每日抽奖获得积分9,已存入积分银行",
      //     price:"13",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //   {
      //     remark:"5每日抽奖获得积分9,已存入积分银行",
      //     price:"13",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //           {
      //     remark:"6每日抽奖获得积分9,已存入积分银行",
      //     price:"10",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //       {
      //     remark:"7每日抽奖获得积分9,已存入积分银行",
      //     price:"11",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //       {
      //     remark:"8每日抽奖获得积分9,已存入积分银行",
      //     price:"12",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //       {
      //     remark:"9每日抽奖获得积分9,已存入积分银行",
      //     price:"13",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      //   {
      //     remark:"10每日抽奖获得积分9,已存入积分银行",
      //     price:"13",
      //     created_at:"2019-05-06 10:48:08"
      //   },
      // ],
      tops:0,
      totop:60,
      timer: '',
      value:0,
      datalist:"",
    };
  },
  created: function() {},
  mounted: function() {
     this.timer = setInterval(this.get, 5000);
  },
  methods: {
    get(){
     this.value ++;
    //  console.log(this.swiperList.length,this.value*2)
      if(this.swiperList.length < (this.value*2)){
        this.tops = 0;
        this.value = 0;
      }else{
      this.tops = this.tops + this.totop;
      }
    },
      jumpTos(id){
      this.$router.push({
        path:'/home/homes/news',
        query:{
          id:id
        }
      })
    }
  },
  destroyed(){
     clearInterval(this.timer);
  }
};
</script>
<style  lang="less" scoped>
.newdanmu{
  height:60px;
  background: #fff;
  padding: 0 .2rem;
  margin-top:-0.02rem;
}
#barrage {
  overflow: hidden;
  height: 60px;
  position: relative;
  .bobao{
    position: absolute;
    top: 0;
  }
}



</style>
<style scoped>
  .record_list{
  box-sizing: border-box;
  height: 30px;
  line-height: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  }
</style>




