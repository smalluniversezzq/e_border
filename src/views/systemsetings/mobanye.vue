<template>
  <div class="orderverify">
    orderverify
  </div>
</template>
<script>
export default {
  name:"orderverify",
  data(){
    return{
      name:"eslint",
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
    }
  },
  created(){},
  mounted(){},
  updated(){},
  destroyed(){
      this.classValueDE = res.data.stepId[res.data.stepId.length-1];
            this.selectValueDE = res.data.stepId;
            this.updataStepIdDE = [];
            for (var i in res.data.stepId) {
              this.updataStepIdDE[i] = res.data.stepId[i];
            }
            this.updataStepIdDE.splice(0,0,'0')
            if(this.classValueDE){
              this.disabShow = false
            }
            this.updataStepIdDE.forEach((item,value)=>{
            setTimeout(()=>{
            this.getauthCountry(item,country).then((v)=>{
              // console.log(value,v,"------------------",typeof(this.selectList))
              this.selectListDE[value]=v
              //  this.selectList = EachValue
              // console.log(this.selectList,'arr?object')
              if(this.updataStepIdDE.length === (value+1)){
                this.selectListDE.pop()
                }
              })
             },value*200)
            })
  },
  methods:{
    

  }
}
</script>
