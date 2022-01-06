<template>
  <div>
    <div id="chart_example" class='chart-box'>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    props:['echrartTitle'],
    data() {
      return {
        codeORcountrys:{
          "DE": "德国",
          "ES": "西班牙",
          "IT": "意大利",
          "FR": "法国",
          "GB": "英国",
          "NL": "荷兰",
          "US": "美国",
          "CA": "加拿大",
          "MX": "墨西哥",
          "AU": "澳大利亚",
          "JP": "日本",
          "ALL":"全部"
        },
        legendData:[],
        myChart:"",
        option:"",
        xAxisData:"",
        seriesData:"",
        countryColor:{
          "DE": "#2fc25b",
          "ES": "#1890ff",
          "IT": "#facc14",
          "NL": "#13c2c2",
          "FR": "#ef5b9c",
          "GB": "#8552a1",
          "US": "#ed1941",
          "CA": "#009ad6",
          "MX": "#bed742",
          "AU": "#f391a9",
          "JP": "#f8aba6",
          "ALL": "#130c0e",
        },
        colorList:[]
      }
    },
    mounted() {
      let _this = this;
      _this.myChart = echarts.init(document.getElementById('chart_example'));
      _this.option = {
        backgroundColor: '#fff',
        title: {
          text: "销售额",
          left: "18px",
          top: "0",
          textStyle: {
            color: "#999",
            fontSize: 12,
            fontWeight: '400'
          }
        },
        color: ['#2fc25b','#1890ff','#facc14', '#13c2c2','#ef5b9c','#8552a1','#ed1941','#ef5b9c', '#bed742','#f391a9', '#f8aba6','#130c0e'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            },
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        grid: {
          left: '25',
          right: '25',
          bottom: '24',
          top: '75',
          containLabel: true
        },
        legend: {
          // data: ['德国', '西班牙', '意大利','荷兰', '法国', '英国', '美国', '加拿大', '墨西哥', '澳大利亚', '日本', '全部'],
          data: [],
          orient: 'horizontal',
          icon: "rect",
          show: true,
          left: 20,
          top: 25,
        },
        xAxis: {
          type: 'category',
          data: [],
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          splitLine: {
              show: false
          },
          axisTick: {
              show: false
          },
          axisLine: {
              show: false
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#999',
            textStyle: {
              fontSize: 12
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F3F4F4'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
        },
        series: [
          {
            name: '德国',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#2fc25b",
          },
          {
            name: '西班牙',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#1890ff",
          },
          {
            name: '意大利',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#facc14",
          },
          {
            name: '荷兰',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#13c2c2",
          },
          {
            name: '法国',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#ef5b9c",
          },
          {
            name: '英国',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#8552a1",
          },
          {
            name: '美国',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#ed1941",
          },
          {
            name: '加拿大',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#ef5b9c",
          },
          {
            name: '墨西哥',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#bed742",
          },
          {
            name: '澳大利亚',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#f391a9",
          },
          {
            name: '日本',
            type: 'line',
            smooth: true,
            data: this.redomNum(7,200),
            color:"#f8aba6",
          },
          {
            name: '全部',
            type: 'line',
            smooth: true,
            data: this.redomNum(1,200),
            color:"#130c0e",
          }
        ]
      };
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener('resize',function() {this.myChart.resize()});
    },
    methods: {
      redomNum(m,n){
      this.a = [0]
      for (var j=0;j<m;j++){
        var number=parseInt(Math.random()*n);
        while (true){
        if(this.aa(number)){
          number=parseInt(Math.random()*n);
            } else {
              this.a[j]=number;
              break;
            }
          }
        }
        return this.a
      },
      aa(number){
        var z=false
        var num=number;
        for(var i = 0;i < this.a.length;i++){
          if(this.a[i] == num){
             z=true;
          }
        }
        return z;
      },
      dataConversion(e) {
        this.legendData = [];
        this.xAxisData = [];
        this.seriesData = [];
        this.colorList = []
        Object.keys(e).forEach((item,index)=>{
          let series = {
            code:"",
            name:"",
            type: 'line',
            data:[],
            smooth: true,
            title:[],
            color:"",
          }
          this.legendData.push(this.codeORcountrys[item])
          series.code = item
          series.name = this.codeORcountrys[item]
          series.color = this.countryColor[item]
          e[item].forEach((im,ix)=>{
            series.data.push(parseInt(im.number))
            series.title.push(im.title)
          })
          this.seriesData.push(series)
          this.colorList = series.color
        })
        if(this.seriesData.length>0){
          this.xAxisData = this.seriesData[0].title
        }
        this.option.xAxis.data = this.xAxisData
        this.option.legend.data = this.legendData
        this.option.series = this.seriesData
        this.option.title.text = this.echrartTitle
        this.option.color = this.colorList
        this.myChart.setOption(this.option);
      }
    },
    watch: {},
    created() {
    }
  }
</script>
<style lang='less' scoped>
  .chart-box{
    height:400px;
    margin-bottom: 20px;;

  }

</style>
