<template>
  <div>
      123123
        <a-input
         v-model='title.ORI'
          :style="{ display: 'inline-block',
          width: 'calc(85% - 12px)'}"/>
  </div>
</template>
<script>
  export default {
    name:"",
    props:[],

    data(){
      return{
        title:{
          ORI:""
        }

      }
    }
  }
</script>
