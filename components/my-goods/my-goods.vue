<template>
  <view>
    <view class="goods-item">
      <!-- 左侧的盒子 -->
      <view class="goods-item-left">
        <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 右侧的盒子 -->
      <view class="goods-item-right">
        <!-- 商品的名字 -->
        <view class="goods-name">{{goods.goods_name}}</view>
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
          <!-- 商品数量s -->
          <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    props: {
      goods: {
        type: Object,
        default: {}
      },
      // 是否展示图片左侧的 radio
      showRadio: {
        type: Boolean,
        //默认情况下，不会展示 radio 组件
        default: false
      },
      // 是否展示图片右侧的 uni-number
      showNum: {
        type: Boolean,
        //默认情况下，不会展示 uni-number 组件
        default: false
      }
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    //过滤器
    filters: {
      tofixed(num){
        return Number(num).toFixed(2)
      }
    },
    methods: {
      // radio 组件的点击事件处理函数
      radioClickHandler(){
        // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
        // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
        this.$emit('radio-change',{
          // 商品的 Id
          goods_id: this.goods.goods_id,
          // 商品最新的勾选状态
          goods_state: !this.goods.goods_state
        })
      },
      // NumberBox 组件的 change 事件处理函数
      numChangeHandler(val){
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('num-change',{
           // 商品的 Id
           goods_id: this.goods.goods_id,
           // 商品的最新数量
           goods_count: +val
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item{
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    
    .goods-item-left{
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .goods-pic{
        width: 100px;
        height: 100px;
        display: block;
      }
    }
    .goods-item-right{
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      
      .goods-name{
        font-size: 13px;
      }
      
      .goods-info-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
                
        .goods-price{
          color: #C00000;
          font-size: 16px;
        }
      }
    }
  }
</style>