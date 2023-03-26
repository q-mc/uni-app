<template>
	<view>
	<!-- 轮播图的区域	 -->
  <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
    <swiper-item v-for="(item,i) in swiperList" :key="i">
      <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
        <image :src="item.image_src"></image>
      </navigator> 
    </swiper-item>
  </swiper>
  
  <!-- 分类导航区域 -->
  <view class="nav_list">
    <view class="nav_item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
      <image :src="item.image_src" class="nav-img"></image>
    </view>
  </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//这是轮播图的数据列表
        swiperList: [],
        //分类导航的数据列表
        navList: []
			};
		},
    onLoad(){
      //调用方法，获取轮播图的数据
      this.getSwiperList()
      //调用方法，获取导航的数据
      this.getNavList()
    },
    methods:{
      async getSwiperList(){
        const {data : res} =await uni.$http.get('/api/public/v1/home/swiperdata')
        //请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        //请求成功，为 data 中的数据赋值
        this.swiperList=res.message
      },
      async getNavList(){
      const {data : res} = await uni.$http.get('/api/public/v1/home/catitems')
      //请求失败
      if(res.meta.status !== 200) return uni.$showMsg()
      //请求成功，为 data 中的数据赋值
      this.navList=res.message
      },
      //点击事件
      navClickHandler(item){
        if(item.name === '分类'){
          uni.switchTab({
            url:'/pages/cate/cate'
          })
        }
      }
    }
	}
</script>

<style lang="scss">
  swiper{
    height: 330rpx;
    
    .swiper-item,
    image{
      width: 100%;
      height: 100%;
    }
  }
  
  .nav_list{
    display: flex;
    justify-content: space-around;
    margin: 15px 0;
    
    .nav-img{
      width: 128rpx;
      height: 140rpx;
    }
  }
</style>
