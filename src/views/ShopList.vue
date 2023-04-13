<template>
  <div id="app">
    <!-- <h1>商铺页面</h1> -->
    <div class="header">
      <div class="header-back-btn"></div>
      <div class="header-title"><i class="el-icon-s-shop"></i>{{ typeName }}</div>

    </div>
    <div class="sort-bar">
      <!-- 餐厅下拉列表 -->
      <div class="sort-item">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ typeName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command=0>全部</el-dropdown-item>
            <el-dropdown-item v-for="t in types" :key="t.id" :command="t.id">
              {{ t.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 状态下拉列表 -->
      <div class="sort-item">
        <el-dropdown trigger="click" @command="chooseStatus">
          <span class="el-dropdown-link">
            状态<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command=0>全部</el-dropdown-item>
            <el-dropdown-item v-for="stas in stautusType" :key="stas.id" :command="stas.id">
              {{ stas.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <div class="sort-item" @click="sortAndQuery('')">
        距离 <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <div class="sort-item" @click="sortAndQuery('comments')">
        人气 <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <div class="sort-item" @click="sortAndQuery('score')">
        评分 <i class="el-icon-arrow-down el-icon--right"></i>
      </div> -->
    </div>
    <div class="shop-list" @scroll="onScroll">
      <div class="shop-box" v-for="s in shops" :key="s.id" @click="toDetail(s.id)">
        <div class="shop-img"><img :src="s.images" alt=""></div>
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
      stautusType: [
        {
          id: 1,
          name: '营业中'
        },
        {
          id: 2,
          name: '暂停营业'
        },
        {
          id: 3,
          name: '休假中'
        },
        {
          id: 4,
          name: '停止营业'
        },        
      ],
      shops: [
        // {
        //   id: 0,
        //   images: "img/blog1.jpg",
        //   name: "金味祥源快餐",
        //   comments: 20,
        //   area: "三楼",
        //   distance: 500,
        //   avgPrice: 30,
        //   address: "北区二楼",
        //   status: 0,
        //   statusStr: '营业中'
        // },
        // {
        //   id: 1,
        //   images: "img/blog2.jpg",
        //   name: "黄山大厦快餐",
        //   comments: 10,
        //   area: "三楼",
        //   distance: 2900,
        //   avgPrice: 15,
        //   address: "北区一楼",
        //   status: 1,
        //   statusStr: '暂停营业'
        // },
        // {
        //   id: 2,
        //   images: "img/blog3.jpg",
        //   name: "民族餐厅",
        //   comments: 27,
        //   area: "二楼",
        //   distance: 621,
        //   avgPrice: 20,
        //   address: "北区二楼半",
        //   status: 2,
        //   statusStr: '休假中'
        // },
        // {
        //   id: 3,
        //   images: "img/blog4.jpg",
        //   name: "山东百思特",
        //   comments: 8,
        //   area: "三楼",
        //   distance: 120,
        //   avgPrice: 12,
        //   address: "北区三楼",
        //   status: 0,
        //   statusStr: '售罄'
        // },
      ], // 商店列表
      typeName: "餐厅列表",
      params: {
        typeId: 0,
        current: 1,
        status: 0
        // sortBy: "",        
      }
    }
  },
  created() {
    //   // 获取参数
    //   this.params.typeId = util.getUrlParam("type");
    //   this.typeName = util.getUrlParam("name");
    // 查询类型
    this.queryTypes();
    // 查询商店
    // this.queryAll();
    this.params.typeId = 0;
    // console.log(this.params);
    this.queryShops();
  },
  methods: {
    getSatusStr(status) {
      switch (status) {
        case 1:
          return '营业中'
        case 2:
          return '暂停营业'
        case 3:
          return '休假中'
        case 4:
          return '停止营业'
        default:
          return '未知'
      }
    },
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
      // console.log("调用queryShops");
      axios.get("/shop/of/type", {
        params: this.params
      })
        .then(({ data }) => {
          if (!data) {
            return
          }

          data.forEach(s => {
            s.images = s.images.split(',')[0]
            s['statusStr'] = this.getSatusStr(s.status)
          });
          this.shops = this.shops.concat(data);
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err)
        })
    },
    handleCommand(id) {
      // console.log(id)
      this.params.typeId = id
      this.params.current = 0
      this.shops = []
      this.queryShops()

    },
    chooseStatus(id){
      // this.params.typeId = id
      this.params.current = 0
      this.params.status = id
      this.shops = []
      this.queryShops()
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
      )
    },

    onScroll(e) {
      let scrollTop = e.target.scrollTop;
      let offsetHeight = e.target.offsetHeight;
      let scrollHeight = e.target.scrollHeight;
      if (scrollTop + offsetHeight + 1 > scrollHeight && !this.isReachBottom) {
        this.isReachBottom = true
        // console.log("触底")
        this.params.current++
        this.queryShops(this.params.current, 5);
      } else {
        this.isReachBottom = false
      }
    },
  }
})

</script>

<!-- <style>

@import "../assets/css/shop-list.css";
@import "../assets/css/main.css";
</style> -->

<style scoped src="../assets/css/shop-list.css"></style>
  