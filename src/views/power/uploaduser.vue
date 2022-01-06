<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item label="选择用户角色"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }"
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }">
        <a-select placeholder="请选择"
          v-decorator="[
            'selectoption',
            { initialValue: info.group_id, rules: [{ required: true, message: '请选择用户角色' }] }
          ]">
          <a-select-option v-for='(item,index) in data' :value="item.id" :key='index'>{{item.title}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="用户名称"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }"
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }">
        <a-input
        v-decorator="['username', { initialValue: info.username,  rules: [{required: true, message: '用户名称不能为空'}] }]"
        placeholder="请输入用户名称" />
        </a-form-item>
      <a-form-item
        label="密码"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span:8} }">
        <a-input type="password"
        v-decorator="['password', {initialValue:info.password,  rules: [{required: true, message: '密码不能为空'}] }]"
            name="password"
            placeholder="请输入密码" />
      </a-form-item>

      <!-- <a-form-item
        label="手机号"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="['mobile', {initialValue:info.mobile,  rules: [{required: true, message: '手机号不能为空'}] }]"
          placeholder="请输入11位手机号" />
      </a-form-item> -->

      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-row type="flex" justify="center">
          <a-col :md="{span: 10, offset: 6}" :lg="{span: 11, offset: 9}" :xl="{span: 10, offset: 6}" :xxl="{span: 8, offset: 0}">
            <a-button htmlType="submit" type="primary" style="width: 100%">保存</a-button>
          </a-col>
        </a-row>
        <!-- <a-button style="margin-left: 8px">保存</a-button> -->
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getchildupdate ,getgroup ,getchildlist} from '@/api/manage'
export default {
  name: 'uploaduser',
  data () {
    return {
      value: 1,
      username:"",
      pwd:"",
      mobile:"",
      address:"",
      form: this.$form.createForm(this),
      data:"",
      selectoption:'',
      id:"",
      info:""
    }
  },
  methods: {
    // 修改
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values)
          getchildupdate(
            {
              id:this.id,
              username:values.username,
              // mobile:values.mobile,
              group_id:this.selectoption,
              password:values.password,
            }
          ).then(res => {
            if(res.code === 0){
            //  提示信息
              this.$notification.success({
                message: '成功',
                description:res.msg,
              });
              this.$router.push({
                path:'/systemSetings/myInfo/myinfos'
              })
            }else{
              this.$notification.error({
                message: '错误',
                description:res.msg,
              });
            }
          })
        }
      })
    },
    //  获取角色列表
    getgroups () {
      getgroup({
        type:'options'
      }).then(res => {
        if(res.code === 0){
          this.data = res.data
          // console.log(res.data,"getgroup")
          // this.$notification.success({
          //   message:'成功',
          //   description: res.msg,
          // });
        }else{
          this.$notification.error({
            message:'提醒',
            description: res.msg,
          });
        }
      })
    },
    //获取子账号信息
    getchildlists(){
      getchildlist({
        id:this.id
      }).then(res => {
        if(res.code === 0){
          this.info = res.data[0]
          // console.log(this.info)
          this.selectoption = this.info.group_id
          // console.log(this.selectoption)
          // this.$notification.success({
          //   message:'成功',
          //   description: res.msg,
          // });
        }else{
          this.$notification.error({
            message:'提醒',
            description: res.msg,
          });
        }
      })
    }
  },
  created(){
  },
  mounted(){
    this.id = this.$route.query.id;
    // this.title = this.$route.query.title;
    this.getgroups();
    this.getchildlists();
  }
}
</script>
