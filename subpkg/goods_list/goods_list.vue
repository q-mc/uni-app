<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //请求对象
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        //商品列表数据
        goodsList: [],
        //总数量，用来分页
        total: 0,
        //节流阀
        isloading: false
      };
    },
    onLoad(options){
      //将页面参数转存到this.queryObj对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      
      //调用获取商品列表数据的方法
      this.getGoodsList()
    },
    methods: {
      //获取商品列表数据的方法
      async getGoodsList(cb){
        // 发起请求
        //打开节流阀
        this.isloading = true
        const {data: res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        //关闭节流阀
        this.isloading = false
        if(res.meta.status !== 200) return uni.$showMsg()
        
        //只要数据请求完毕，即立即按需调用cb回调函数
        cb && cb()
        
        //为数据赋值
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      //点击跳转商品详情页
      gotoDetail(goods){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    //触底事件
    onReachBottom(){
      //判断是否还有下一页数据
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕!')
      
      //判断是否正在请求其他数据，如果是，则不发起额外的请求
      if(this.isloading) return
      
      //让页码值自增+1
      this.queryObj.pagenum ++
      this.getGoodsList()
    },
    //下拉刷新事件
    onPullDownRefresh(){
      //重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      
      //重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">
  
</style>
