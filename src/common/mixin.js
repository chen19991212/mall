import {debounce} from './utils';
import BackTop from 'components/content/backTop/BackTop';
export const itemListenerMixin = {
  data() {
    return {
      itemImageListener:null
    }
  },
  mounted() {
    let refresh = debounce(this.$refs.scroll.refresh,200)

      this.itemImageListener = () =>{
        refresh()
      }
      this.$bus.$on('itemImageLoad',this.itemImageListener)
  },
}
export const backTopMixin = {
  data() {
    return {
      isShow:false
    }
  },
  components:{
    BackTop
  },
  methods: {
    backClick(){
      //console.log('backClick');
      this.$refs.scroll.scrollTo(0,0)
    },
    listenShowBackTop(position){
      this.isShow = -position.y > 1000  
    }
  },
}