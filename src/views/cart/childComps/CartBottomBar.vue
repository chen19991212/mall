<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" 
                  :is-checked="isSelectAll" @click.native="checkClick" />
      <span>全选</span>
    </div>
    <div class="price">合计：{{totalPrice}}</div>
    <div class="calculate" @click="calcClick">去计算({{checkLength}})</div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton';

  import {mapGetters} from 'vuex';
  export default {
    name:'CartBottomBar',
    components:{
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice(){
        return '￥' + this.cartList.filter(item=>{
          return item.checked
        }).reduce((preValue,item)=>{
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkLength(){
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll(){
        if(this.cartList.length ===0) return false
        //return !(this.cartList.filter(item=> !item.checked).length)
        return !this.cartList.find(item=>!item.checked)
      }
    },
    methods: {
      checkClick(){
        if(this.isSelectAll){ //全部选中
          this.cartList.forEach(item=>item.checked=false)
        }else{//部分未选中
          this.cartList.forEach(item=>item.checked=true)
        }
        //this.cartList.forEach(item=> item.checked = !this.isSelectAll) 此路不通
      },
      calcClick(){
        if (!this.isSelectAll) {
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    },
  }
</script>

<style scoped>
  .bottom-bar{
    position: fixed;
    width: 100%;
    bottom: 49px;
    display: flex;
    line-height: 40px;
    height: 40px;
    
    background-color: #eee;
    font-size: 14px;
    
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .price{
    margin-left: 20px;
    flex: 1;
  }
  .calculate{
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>