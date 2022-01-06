import { Menu, Icon, Input } from 'ant-design-vue'

const { Item, ItemGroup, SubMenu } = Menu
const { Search } = Input

export default {
  name: 'Tree',
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    // defaultSelectedKeys:[],
    defaultSelectedKeys: {
      type: Array,
      required: true
    },
    search: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.localOpenKeys = this.openKeys.slice(0)
    // console.log(this.defaultSelectedKeys,'defaultSelectedKeys')
    // console.log(this.localOpenKeys,this.openKeys,'localOpenKeys')
  },
  mounted() {

  },
  data() {
    return {
      localOpenKeys: []
    }
  },
  methods: {
    handlePlus(item, type) {
      if (type === 'edit') {
        this.$emit('edit', item)
      } else if (type === 'del') {
        // console.log("走了del")
        this.$emit('del', item)
      }
    },
    handleTitleClick(...args) {
      this.$emit('titleClick', { args })
    },

    renderSearch() {
      return (
        <Search
          placeholder="input search text"
          style="width: 100%; margin-bottom: 1rem"
        />
      )
    },
    renderIcon(icon) {
      return icon && (<Icon type={icon} />) || null
    },
    // { item.title}
    renderMenuItem(item) {
      // console.log("点击了")
      // console.log(this.defaultSelectedKeys,'defaultSelectedKeys')
      let _this = this
      let TabEdit = _this.$store.state.MerchantManege.tabEdit
      // console.log(_this.$store.state.MerchantManege.tabEdit,'显示隐藏')
      return (
        <Item key={item.key} class='over-menu'>
          { _this.renderIcon(item.icon)}
          { item.title}
          <a class="btn" style={{ width: '20px', zIndex: '99', right: '70px', display: TabEdit ? 'none' : 'block' }} {...{ on: { click: () => _this.handlePlus(item, 'edit') } }}><a-icon type="edit" /></a>
          {/* <a class="btn" style={{width:'20px',zIndex:'99' ,display:TabEdit?'none':'block'}} {...{ on: { click: () => _this.handlePlus(item,'del') } }}><a-icon type="delete"/></a> */}
        </Item>
      )
    },
    renderItem(item) {
      return item.children ? this.renderSubItem(item, item.key) : this.renderMenuItem(item, item.key)
    },
    renderItemGroup(item) {
      const childrenItems = item.children.map(o => {
        return this.renderItem(o, o.key)
      })

      return (
        <ItemGroup key={item.key}  >
          <template slot="title">
            <span>{item.title}</span>
            <a-dropdown>
              <a class="btn"></a>
              <a-menu slot="overlay">
                <a-menu-item key="1">新增</a-menu-item>
                <a-menu-item key="2">合并</a-menu-item>
                <a-menu-item key="3">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
          { childrenItems}
        </ItemGroup>
      )
    },
    renderSubItem(item, key) {
      const childrenItems = item.children && item.children.map(o => {
        return this.renderItem(o, o.key)
      })

      const title = (
        <span slot="title">
          { this.renderIcon(item.icon)}
          <span>{item.title}</span>
        </span>
      )

      if (item.group) {
        return this.renderItemGroup(item)
      }
      // titleClick={this.handleTitleClick(item)}
      return (
        <SubMenu key={key}>
          { title}
          { childrenItems}
        </SubMenu>
      )
    }
  },
  render() {
    const { dataSource, search } = this.$props

    // this.localOpenKeys = openKeys.slice(0)
    const list = dataSource.map(item => {
      return this.renderItem(item)
    })

    return (
      <div class="tree-wrapper">
        { search ? this.renderSearch() : null}
        <Menu mode="inline" class="custom-tree tree-height" {...{ on: { click: item => this.$emit('click', item), 'update:openKeys': val => { this.localOpenKeys = val } } }} defaultSelectedKeys={this.defaultSelectedKeys} openKeys={this.localOpenKeys} >
          {list}
        </Menu>
      </div>
    )
  }
}
