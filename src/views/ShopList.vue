<template>
  <div id="app">
    <!-- <h1>商铺页面</h1> -->
    <div class="header">
      <div class="header-back-btn"></div>
      <div class="header-title"><i class="el-icon-s-shop"></i>{{ typeName }}</div>

    </div>
    <div class="sort-bar">
      <div class="sort-item">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ typeName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="t in types" :key="t.id" :command="t">
              {{ t.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="sort-item" @click="sortAndQuery('')">
        距离 <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <div class="sort-item" @click="sortAndQuery('comments')">
        人气 <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <div class="sort-item" @click="sortAndQuery('score')">
        评分 <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </div>
    <div class="shop-list" @scroll="onScroll">
      <div class="shop-box" v-for="s in shops" :key="s.id" @click="toDetail(s.id)">
        <div class="shop-img"><img :src="require('../assets/' + s.images)" alt=""></div>
        <div class="shop-info">
          <div class="shop-title shop-item">{{ s.name }}</div>
          <div class="shop-rate shop-item">
            <!-- <el-rate disabled v-model="s.score / 10" text-color="#F63" show-score></el-rate> -->
            <span>{{ s.comments }}条</span>
          </div>
          <div class="shop-area shop-item">
            <span>￥{{ s.avgPrice }}/人</span>
            <!-- <span v-if="s.distance">{{ s.distance < 1000 ? s.distance.toFixed(1) + 'm' :
                            (s.distance / 1000).toFixed(1) + 'km' }}</span> -->
            <span>{{ s.statusStr }}</span>
          </div>
          <!-- <div class="shop-avg shop-item">￥{{ s.avgPrice }}/人</div> -->
          <div class="shop-address shop-item">
            <i class="el-icon-map-location"></i>
            <span>{{ s.address }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from '../plugins/axios-0.18.0';
import '../assets/js/common';
export default ({
  data() {
    return {
      // util,
      isReachBottom: false,
      types: [], // 类型列表
      shops: [
        {
          id: 0,
          images: "img/blog1.jpg",
          name: "金味祥源快餐",
          comments: 20,
          area: "三楼",
          distance: 500,
          avgPrice: 30,
          address: "北区二楼",
          status: 0,
          statusStr: '营业中'
        },
        {
          id: 1,
          images: "img/blog2.jpg",
          name: "黄山大厦快餐",
          comments: 10,
          area: "三楼",
          distance: 2900,
          avgPrice: 15,
          address: "北区一楼",
          status: 1,
          statusStr: '暂停营业'
        },
        {
          id: 2,
          images: "img/blog3.jpg",
          name: "民族餐厅",
          comments: 27,
          area: "二楼",
          distance: 621,
          avgPrice: 20,
          address: "北区二楼半",
          status: 2,
          statusStr: '休假中'
        },
        {
          id: 3,
          images: "img/blog4.jpg",
          name: "山东百思特",
          comments: 8,
          area: "三楼",
          distance: 120,
          avgPrice: 12,
          address: "北区三楼",
          status: 0,
          statusStr: '售罄'
        },
      ], // 商店列表
      typeName: "餐厅列表",
      params: {
        typeId: 0,
        current: 1,
        sortBy: "",
        x: 120.149993, // 经度
        y: 30.334229 // 纬度
      }
    }
  },
  created() {
    //   // 获取参数
    //   this.params.typeId = util.getUrlParam("type");
    //   this.typeName = util.getUrlParam("name");
    // 查询类型
    // this.queryTypes();
    // 查询商店
    // this.queryShops();
  },
  methods: {
    // getSatusStr(status){
    //   switch(status){
    //     case: 0

    //   }
    // },
    queryTypes() {
      axios.get("/shop-type/list")
        .then(({ data }) => {
          this.types = data;
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err)
        })
    },
    queryShops() {
      axios.get("/shop/of/type", {
        params: this.params
      })
        .then(({ data }) => {
          if (!data) {
            return
          }
          data.forEach(s => s.images = s.images.split(',')[0]);
          this.shops = this.shops.concat(data);
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err)
        })
    },
    handleCommand(t) {
      location.href = "/shop-list.html?type=" + t.id + "&name=" + t.name;
    },
    sortAndQuery(sortBy) {
      this.params.sortBy = sortBy;
      this.queryShops();
    },
    goBack() {
      history.back();
    },
    toDetail(id) {
      this.$router.push({
        name: 'ShopDetail',
        params: {
          id: id
        }
      }
      // location.href = "/shop-detail.html?id="+id

    )},

    onScroll(e) {
      let scrollTop = e.target.scrollTop;
      let offsetHeight = e.target.offsetHeight;
      let scrollHeight = e.target.scrollHeight;
      if (scrollTop + offsetHeight + 1 > scrollHeight && !this.isReachBottom) {
        this.isReachBottom = true
        console.log("触底")
        this.params.current++
        this.queryShops(this.params.current, 5);
      } else {
        this.isReachBottom = false
      }
    },
  }
})

</script>

<style>
/* <link href="./css/shop-list.css" rel="stylesheet">
  <link href="./css/main.css" rel="stylesheet"> */

@import "../assets/css/shop-list.css";
@import "../assets/css/main.css";
</style>
  