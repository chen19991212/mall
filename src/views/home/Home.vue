<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                    @tabClick="tabClick" ref="tabControl1"  
                    class="tab-control" v-show="isTabFixed" />
    <!-- probe-type加冒号才能保证传输过去的是一个数字 -->
    <scroll class="content" ref="scroll" 
            :probe-type="3" @scroll="contentScroll" 
            :pull-up-load="true" @pullingUp="loadMore"
             >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view />
      <tab-control :titles="['流行','新款','精选']" 
                    @tabClick="tabClick" ref="tabControl2"  />
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


  import {getHomeMultidata,getHomeGoods} from 'network/home';
  import {debounce} from 'common/utils';
  import {itemListenerMixin,backTopMixin} from 'common/mixin';

  
  
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

      },
      mixins:[itemListenerMixin,backTopMixin],
      computed: {
        showGoods(){
          return this.goods[this.currentType].list
        }
      },
      activated() {
        this.$refs.scroll.scrollTo(0,this.saveY,0)
        this.$refs.scroll.refresh()
      },
      deactivated() {
        //保存Y值
        this.saveY = this.$refs.scroll.getScrollY()

        //取消全局事件的监听
        this.$bus.$off('itemImageLoad',this.itemImageListener)
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

          tabOffsetTop:0,
          isTabFixed:false,
          saveY:0,
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
      mounted() {
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
          this.$refs.tabControl1.currentIndex = index
          this.$refs.tabControl2.currentIndex = index
        },

        //回到顶部按钮的显示和隐藏
        contentScroll(position){
          //1.判断BackTop是否显示
          this.listenShowBackTop(position)
          //2.决定tabControl是否吸顶(position:fixed)
          this.isTabFixed = (-position.y)>this.tabOffsetTop
        },  
        loadMore(){
          this.getHomeGoods(this.currentType)

          //this.$refs.scroll.scroll.refresh()
        },
        swiperImageLoad(){
          //2. 获取tabOffsetTop的offsetTop
          //所有组件都有一个属性$el:用于获取组件中的圆度
          this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
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

            this.goods[type].list.push(...res.data.list)
            this.goods[type].page++

            //完成上拉加载更多
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
    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }

  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /* .content{
    height: calc(100% - 93px);
    overflow: hidden;
    
  } */
</style>