<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" 
            :probe-type="3"  @scroll="contentScroll">
      <!-- 属性:topImages  传入值:top-images -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop"  />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" /> 
      
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShow"></back-top>
    
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar';
  import DetailSwiper from './childComps/DetailSwiper';
  import DetailBaseInfo from './childComps/DetailBaseInfo';
  import DetailShopInfo from './childComps/DetailShopInfo';
  import DetailGoodsInfo from './childComps/DetailGoodsInfo';
  import DetailParamInfo from './childComps/DetailParamInfo';
  import DetailCommentInfo from './childComps/DetailCommentInfo';
  import DetailBottomBar from './childComps/DetailBottomBar';

  import Scroll from 'components/common/scroll/Scroll';
  import GoodsList from 'components/content/goods/GoodsList';

  

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail.js';
  import {debounce} from 'common/utils';
  import {itemListenerMixin,backTopMixin} from 'common/mixin';

  export default {
    name:"Detail",
    components:{
      DetailNavBar, //顶部导航栏
      DetailSwiper, //轮播图
      DetailBaseInfo,  //基本信息
      DetailShopInfo,   //店铺信息
      Scroll,           //Better-Scroll
      DetailGoodsInfo,  //商品图片
      DetailParamInfo,  //参数信息
      DetailCommentInfo,  //评论信息
      GoodsList,        //推荐商品
      DetailBottomBar,  //底部导航栏
      //BackTop         //返回页面顶部按钮
    },
    mixins:[itemListenerMixin,backTopMixin],
    data() {
      return {
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid

      //2.根据iid请求数据
      getDetail(this.iid).then(res=>{
        //1.获取数据
        const data = res.result
        //2.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages
        //3.获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        //4.创建店铺信息
        this.shop = new Shop(data.shopInfo)
        //5.保存商品的详情数据
        this.detailInfo = data.detailInfo
        //6.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        //7.取出评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }

        /* //1.第一次获取，值不对
        //值不对的原因:this.$refs.$el还没有被渲染

        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        console.log(this.themeTopYs) */

        /* this.$nextTick(()=>{
          //2.第二次获取，值不对
          //根据最新的数据，对应的DOM已经被渲染出来
          //但是图片依然是没有加载完的（目前获取到的offsetTop不包含图片）
          //offsetTop值不对的时候，一般都是因为图片的问题
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

          console.log(this.themeTopYs)
        }) */
      }) 
      //3.请求推荐数据
      getRecommend().then(res=>{
        console.log(res);
        this.recommends = res.data.list
      })
      //对赋值操作进行防抖
      this.getThemeTopY = debounce(()=>{
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)

        console.log(this.themeTopYs)
      },100)
    },
    methods: {
      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],300)
      },

      contentScroll(position){
        //1.获取Y值
        const positionY = -position.y
        //2.positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        for(let i=0;i<length-1;i++){
          /* if(positionY>this.themeTopYs[i]&&positionY<this.themeTopYs[i+1]){
            console.log(i);
          } */
          //1.普通做法
          /* if(this.currentIndex !== i && ((i<length-1&&positionY>=this.themeTopYs[i]&&
          positionY<this.themeTopYs[i+1])||(i===length-1&&positionY>=this.themeTopYs[i]))){
            this.currentIndex = i
            //console.log(this.currentIndex);
            this.$refs.nav.currentIndex = this.currentIndex
          } */
          //2.hack
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i]&& 
              positionY<this.themeTopYs[i+1])){
              this.currentIndex = i
              this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        //3.是否显示回到顶部
        this.listenShowBackTop(position)


      },
      addToCart(){
        //1.获取购物车需要展示的商品信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        //2.将商品添加到购物车
        //this.$store.cartList.push(product)
        //this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product)
      }
      

    },
    mounted() {
      
    },
    updated() {
  
    },
    destroyed() {
      this.$bus.$off('itemImageLoad',this.itemImageListener)
    },
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>