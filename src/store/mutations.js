import {ADD_COUNTER,ADD_TO_CART} from './mutation-types';

export default{
  //mutations:修改state中的状态
  //mutations中的每个方法尽可能单一
  [ADD_COUNTER](state,payload){
    payload.count++
  },
  [ADD_TO_CART](state,payload){
    payload.checked = true
    state.cartList.push(payload)
  }
}