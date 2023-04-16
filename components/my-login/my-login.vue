<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <!-- 登录提示 -->
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import {mapMutations, mapState } from 'vuex'
  
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('m_user',['redirectInfo'])  
    },
    methods: {
      ...mapMutations('m_user',['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      //用户授权之后，获取用户的基本信息
      // getUserProfile(e){
      //   // 判断是否获取用户信息成功
      //   if(e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
        
      //   // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
      //   // console.log(e.detail.userInfo)
      //   // 3. 将用户的基本信息存储到 vuex 中
      //   this.updateUserInfo(e.detail.userInfo)
        
      //   // 获取登录成功后的 Token 字符串
      //   this.getToken(e.detail)
      getUserProfile() {
              uni.getUserProfile({
                desc: '你的授权信息',
                success: (res) => {
                  // 将信息存到 vuex 中
                  this.updateUserInfo(res.userInfo)
                  this.getToken(res)
                },
                fail: (res) => {
                  return uni.$showMsg('您取消了登录授权')
                }
              })
      },
      async getToken(info){
        //获取code对应的值
        const [err, res] = await uni.login().catch(err => err)
          // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
        // console.log(res.code)
        // console.log(info)
        
        //准备参数
        const query = {
            code: res.code,
            encryptedData: info.encryptedData,
            iv: info.iv,
            rawData: info.rawData,
            signature: info.signature
        }
        
        // // 换取 token
        // const { data: loginResult } = await uni.$http.post('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4d305d4979fb60ec&secret=3d6dad7cf2809502054609db6fba9cb9', query)
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        
        // // 2. 更新 vuex 中的 token
        // this.updateToken(loginResult.message.token)
        
        //换取 token
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if (loginResult.meta.status !== 200) { 
          // uni.$showMsg('登录失败！')
        }
        
        const fade = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
        //直接把token保存到vuex中
        this.updateToken(fade)
        
        // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack(){
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container{
    height: 750rpx;
    background-color: #F8F8F8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    
    &::after{
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }
    
    .btn-login{
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;
    }
    
    .tips-text{
      font-size: 12px;
      color: gray;
    }
  }
</style>