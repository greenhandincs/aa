<script>
// import router from '@/router'

export default {
  data() {
    return {
      activeBtnHere: this.activeBtn
    }
  },
  props: ['activeBtn'],
  methods: {  
    toPage(i) {      
      if(this.activeBtnHere != i){
        this.activeBtnHere = i;
        switch (i) {
          case 1:               
            this.$router.push('/');
            break;
          case 2:
            this.$router.push('/shop-list');          
            break;
          case 3:
            this.$router.push('/message');          
            break;
          case 4:
            this.$router.push('/me');          
            break;
          default:
            break;
        }      
      }
    }

    // if(i !== this.activeBtnHere){
    //   }
  }
}
</script>

<template>
  <div class="foot">
    <div class="foot-box" :class="{ active: activeBtnHere === 1 }" @click="toPage(1)">
      <div class="foot-view"><i class="el-icon-s-home"></i></div>
      <div class="foot-text">首页</div>
    </div>
    <div class="foot-box" :class="{ active: activeBtnHere === 2 }" @click="toPage(2)">
      <div class="foot-view"><i class="el-icon-map-location"></i></div>
      <div class="foot-text">餐厅</div>
    </div>
    <div class="foot-box" @click="toPage(0)">
      <!-- <img class="add-btn" src="/imgs/add.png" alt=""> -->
      <i class="el-icon-circle-plus" style="color: #79bbff; font-size: 45px"></i>
    </div>
    <div class="foot-box" :class="{ active: activeBtnHere === 3 }" @click="toPage(3)">
      <div class="foot-view"><i class="el-icon-chat-dot-round"></i></div>
      <div class="foot-text">消息</div>
    </div>
    <div class="foot-box" :class="{ active: activeBtnHere === 4 }" @click="toPage(4)">
      <div class="foot-view"><i class="el-icon-user"></i></div>
      <div class="foot-text">我的</div>
    </div>
  </div>
</template>
