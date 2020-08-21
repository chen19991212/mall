<template>
  <div  class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!-- 商品的列表 -->
    <cart-list />
    
    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar';

  import CartList from './childComps/CartList';
  import CartBottomBar from './childComps/CartBottomBar';

  import {mapGetters} from 'vuex';//将Vuex中的getters直接当作计算属性来使用
  export default {
      name:"Cart",
      components:{
        NavBar,
        CartList,
        CartBottomBar
      },
      computed: {
        //...mapGetters(['cartLength','cartList'])
        ...mapGetters({
          length:'cartLength',
        })
      },
  }
</script>

<style scoped>
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
    /* font-weight: 700; */
  }
  .cart{
    height: 100vh;
  }
</style>