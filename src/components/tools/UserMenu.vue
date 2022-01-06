<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!-- <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a> -->
      <!-- <notice-icon class="action"/> -->

      <a :href="this.GLOBAL.CALCULATE_URL" v-if='hasPerm(permsBtn.freight)' target="_blank" style="margin-right:10px">
        运费测算
      </a>
      <router-link
        v-if='this.$store.state.user.balance'
        class='mr'
        :to="{ name: 'fund'}"
      >
        <span>余额:￥</span><span>{{this.$store.state.user.balance}}</span>
      </router-link>
      <router-link
        class='mr'
        :to="{ name: 'feedback'}"
      >
        <a-icon
          theme='filled'
          type="edit"
        />
      </router-link>
      <router-link :to="{ name: 'news'}">
        <a-icon
          theme='filled'
          type="bell"
        />
      </router-link>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar
            v-if='avatar()'
            class="avatar"
            size="small"
            :src="avatar()"
          />
          <a-avatar
            v-else
            class="avatar"
            size="small"
            :src="defaultAvatar"
          />
          <span>{{this.$store.state.user.username}}</span>
          <!-- <span>{{username()}} </span> -->
          <!-- {{Logout()}} -->
          <!-- <span>{{'名称' }}</span> -->
          <!-- this.$store.state.user.username -->
        </span>
        <a-menu
          slot="overlay"
          class="user-dropdown-menu-wrapper"
        >
          <a-menu-item key="0">
            <router-link :to="{ name: 'myInfo' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item
            v-if='this.$store.state.user.type ==="1"'
            key="1"
          >
            <router-link :to="{ name: 'uppwd' }">
              <a-icon type="user" />
              <span>修改密码</span>
            </router-link>
          </a-menu-item>
          <!-- <a-menu-item key="1">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting"/>
              <span>账户设置</span>
            </router-link>
          </a-menu-item> -->
          <!-- <a-menu-item key="2" disabled>
            <a-icon type="setting"/>
            <span>测试</span>
          </a-menu-item> -->
          <a-menu-item key="2">
            <a
              href="javascript:;"
              @click="handleLogout"
            >
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { permsBtn } from '@/utils/static'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  data() {
    return {
      permsBtn,
      defaultAvatar: require('@/assets/EBlogo.png')
    }
  },
  methods: {
    ...mapState(['username']),
    ...mapActions(['Logout']),
    ...mapGetters(['avatar', 'nickname']),
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    }
  }
}
</script>
<style scoped>
.mr {
  margin-right: 12px;
}
</style>

