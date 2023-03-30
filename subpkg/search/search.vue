<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //延时器的timerId
        timer: null,
        //搜索关键词
        kw: '',
        //搜索结果列表
        searchResults: [],
        //搜索历史的数组
        historyList: []
      };
    },
    onLoad(){
     this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      //input 输入事件的处理函数
      input(e){
        //清除timer对应的延时器
        clearTimeout(this.timer)
        //重新启动一个延时器，并把timerID赋值给this.timer
        this.timer = setTimeout(() => {
          //如果500毫秒内，没有触发新的输入事件，则为搜索关键字赋值
          this.kw = e.value
          //根据关键词，查询搜索建议列表
          this.getSearchList()
        },500)
      },
      //根据搜索关键词，搜索商品建议列表
      async getSearchList() {
       //判断搜索关键词是否为空
       if(this.kw.length === 0){
         this.searchResults = []
         return
       }
       //发起请求，获取搜索建议列表
       const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query: this.kw})
       if(res.meta.status !== 200) return uni.$showMsg()
       this.searchResults = res.message
       
       this.saveSearchHistory()
      },
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      //保存搜索关键词为历史记录
      saveSearchHistory(){
        // this.historyList.push(this.kw)
        
        //1.将Array数组转化为Set对象
        const set = new Set(this.historyList)
        //2.调用Set对象的delete方法，移除对应的的元素
        set.delete(this.kw)
        //3.调用Set对象的add方法，向Set中添加元素
        set.add(this.kw)
        //4.将Set对象转换为Array数组
        this.historyList = Array.from(set)
        
        //对搜索历史数据，进行持久化的存储
        uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      //清空搜索记录
      clean(){
        this.historyList = []
        uni.setStorageSync('kw','[]')
      },
      //点击搜索记录跳转页面
      gotoGoodsList(kw){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    //计算属性
    computed: {
      histories(){
        //数据翻转
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .search-box{
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  .sugg-list{
    padding: 0 5px;
    
    .sugg-item{
      display: flex;
      align-items: center;
      //两端贴边对齐
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      
      .goods-name{
        //文本不允许换行
        white-space: nowrap;
        //溢出隐藏
        overflow: hidden;
        //文本溢出后，用...代替
        text-overflow: ellipsis;
      }
    }
  }
  
  .history-box{
    padding: 0 5px;
    
    .history-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
    
    .history-list{
      display: flex;
      flex-wrap: wrap;
      
      .uni-tag{
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
