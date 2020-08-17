<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!-- probe-type加冒号才能保证传输过去的是一个数字 -->
    <scroll class="content" ref="scroll" 
    :probe-type="3" @scroll="contentScroll" 
    :pull-up-load="true" @pullingUp="loadMore" >
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view />
      <tab-control :titles="['流行','新款','精选']" 
      class="tab-control" @tabClick="tabClick" />
      <goods-list :goods="showGoods" />
    </scroll>
    <!-- 
    .native修饰符  
    在我们需要监听一个组件的原生事件时，必须给对应的事件加上.native修饰符，才能进行监听 
    -->
    <back-top @click.native="backClick" v-show="isShow"></back-top>
  </div>
</template>

<script> 
  import HomeSwiper from './childComps/HomeSwiper';
  import RecommendView from './childComps/RecommendView';
  import FeatureView from './childComps/FeatureView';

  import NavBar from 'components/common/navbar/NavBar';
  import TabControl from 'components/content/tabControl/TabControl';
  import GoodsList from 'components/content/goods/GoodsList';
  import Scroll from 'components/common/scroll/Scroll';
  import BackTop from 'components/content/backTop/BackTop';

  import {getHomeMultidata,getHomeGoods} from 'network/home';

  
  
  export default {
      name:'Home',
      components:{  
        HomeSwiper,
        RecommendView,
        FeatureView,

        NavBar,
        TabControl,
        GoodsList,
        Scroll,
        BackTop
      },
      computed: {
        showGoods(){
          return this.goods[this.currentType].list
        }
      },
      data(){
        return {
          banners:[],
          recommends:[],
          goods:{
            'pop':{page:0,list:[]},  //流行
            'new':{page:0,list:[]},  //新款
            'sell':{page:0,list:[]}   //精选
          },
          currentType:'pop',
          isShow:false
        }
      },
      created(){
        //1.请求多个数据
        this.getHomeMultidata(),
        //2.请求商品数据
        this.getHomeGoods('pop')
        this.getHomeGoods('new')
        this.getHomeGoods('sell')
      },
      methods: {
        /* 事件监听相关方法 */
        tabClick(index){
          switch(index){
            case 0:
              this.currentType = 'pop'
              break;
            case 1:
              this.currentType = 'new'
              break;
            case 2:
              this.currentType = 'sell'
              break
          }
        },
        //回到首页
        backClick(){
          //console.log('backClick');
          this.$refs.scroll.scrollTo(0,0)
        },
        //回到顶部按钮的显示和隐藏
        contentScroll(position){
          //console.log(position);
          this.isShow = position.y<-1000
        },  
        loadMore(){
          this.getHomeGoods(this.currentType)

          //this.$refs.scroll.scroll.refresh()
        },
        /* 网络请求相关方法 */
        getHomeMultidata(){
          getHomeMultidata().then(res=>{
            //console.log(res);
            this.banners = res.data.banner.list
            this.recommends = res.data.recommend.list
          })
        },
        getHomeGoods(type){
          const page = this.goods[type].page + 1
          getHomeGoods(type,page).then(res=>{
            console.log(res);
            this.goods[type].list.push(...res.data.list)
            this.goods[type].page++

            this.$refs.scroll.finishPullUp()
          })
        }

      }
  }
</script>

<style scoped>
/* scoped 作用域  选择器只针对当前组件 */
  #home{
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .tab-control{
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  /*.content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }*/
  .content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }
</style>