<template>
  <div id="app">
    <!-- <el-icon><Check /></el-icon> -->
    <!-- <h1>为什么</h1> -->
    <router-view></router-view>
    <FootBar :active-btn="footerPage"></FootBar>
  </div>
</template>

<script>
import FootBar from "../src/components/FooterBar.vue"
export default ({
  // el: '#app', 
  components: {
    FootBar
  },
  data() {
    return {
      footerPage: 1
    }
  },
  created() {
    console.log()
    const path = this.$route.path
    if (path === '/')
      this.footerPage = 1;
    else if (path === '/shop-list')
      this.footerPage = 2;
    else if (path === '/message')
      this.footerPage = 3;
    else if (path === '/me')
      this.footerPage = 4;

  }

})

</script>
