import { mapGetters } from 'vuex'

export default{
  computed: {
    ...mapGetters('m_cart',['total'])
  },
  watch: {
    // 监听 total 值的变化
    total(){
      // 调用 methods 中的 setBadge 方法，重新为 tabBar 的数字徽章赋值
      this.setBadge()
    }
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  methods: {
    // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
    setBadge(){
      uni.setTabBarBadge({
        index: 2,
        text: this.total + ''
      })
    }
  }
}