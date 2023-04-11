<template>
    <div id="app">
        <div class="search-bar">
            <div class="city-btn">杭州<i class="el-icon-arrow-down"></i></div>
            <div class="search-input">
                <el-input size="mini" placeholder="请输入商户名、地点!">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="header-icon" @click="toPage(4)"><i class="el-icon-user"></i></div>
        </div>
        <div class="type-list">
            <!-- <div class="type-box" v-for="t in types" :key="t.id" @click="toShopList(t.id, t.name)">
                <div class="type-view"><img :src="'/imgs/' + t.icon" alt=""></div>
                <div class="type-text">{{ t.name }}</div>
            </div> -->
            <el-carousel :interval="5000" arrow="hover" height="160px" :autoplay="false">

                <el-carousel-item v-for="item in tubox" :key="item.id">
                    <img :src="item.tu" class="tu" style="object-fit: scale-down; width: 100%; height: 100%;">
                </el-carousel-item>
            </el-carousel>
        </div>

        <div class="blog-list" @scroll="onScroll">
            <div class="blog-box" v-for="b in blogs" :key="b.id">
                <div class="blog-foot">
                    <div class="blog-user-icon"><img :src="require('../assets/' + defaultImg)" alt=""></div>
                    <div class="blog-user-name">{{ b.name }}</div>
                    <div class="blog-liked" @click="addLike(b)">
                        <i class="el-icon-thumb" :class="{ active: b.isLike }"></i>
                        {{ b.liked }}
                    </div>
                </div>
                <div class="blog-title">{{ b.title }}</div>
                <div class="blog-img" @click="toBlogDetail(b)"><img :src="require('../assets' + b.img)" alt=""></div>
            </div>
        </div>
    </div>
</template>

<script>
// import axios from 'axios';
import axios from '../plugins/axios-0.18.0';
export default {
    data() {
        return {
            tubox: [
                { id: 0, tu: require("../assets/img/blog1.jpg") },
                { id: 1, tu: require("../assets/img/blog2.jpg") },
                { id: 2, tu: require("../assets/img/blog3.jpg") },
                { id: 3, tu: require("../assets/img/blog4.jpg") },

            ],
            defaultImg: "img/default-icon.png",
            isReachBottom: false,
            types: [], // 类型列表
            blogs: [
                {
                    img: "/img/blog1.jpg",
                    title: "kk餐厅卤肉饭",
                    name: "hewl",
                    isLike: true,
                    liked: 20
                },
                {
                    img: "/img/blog2.jpg",
                    title: "kk餐厅卤肉饭",
                    name: "张三",
                    isLike: true,
                    liked: 18
                },
                {
                    img: "/img/blog3.jpg",
                    title: "kk餐厅卤肉饭",
                    name: "李四",
                    isLike: true,
                    liked: 10
                },
                {
                    img: "/img/blog4.jpg",
                    title: "kk餐厅卤肉饭",
                    name: "王五",
                    isLike: true,
                    liked: 9
                }
            ], // 播客列表
            current: 1,// blog的页码

        }
    },
    created() {
        // 查询类型
        // console.log("hh");
        // this.queryTypes();
        this.queryHotBlogsScroll();
    },
    methods: {
        queryTypes() {
            axios.get(this.GLOBAL.serverSrc + "/shop-type/list")
                .then(({ data }) => {
                    console.log(data);
                    // this.types = data;
                })
                .catch(err => {
                    this.$message.error(err)
                })
        },
        queryHotBlogsScroll() {
            axios.get(this.GLOBAL.serverSrc + "/blog/hot?current=" + this.current)
                .then(({ data }) => {                    
                    // data = data.data
                    console.log(data)
                    data.forEach(b => b.img = b.images.split(",")[0]);
                    this.blogs = this.blogs.concat(data);
                    // console.log(this.blogs)
                })
                .catch(err => {
                    this.$message.error(err)
                })
        },
        addLike(b) {
            axios.put(this.GLOBAL.serverSrc + "/blog/like/" + b.id)
                .then(({ data }) => {
                    // this.queryBlogById(b)
                    console.log(data)
                })
                .catch(err => {
                    this.$message.error(err)
                })
        },
        queryBlogById(b) {
            axios.get(this.GLOBAL.serverSrc + "/blog/" + b.id)
                .then(({ data }) => {
                    b.liked = data.liked;
                    b.isLike = data.isLike;
                })
                .catch(() => {
                    this.$message.error
                    b.liked++;
                })
        },
        onScroll(e) {
            let scrollTop = e.target.scrollTop;
            let offsetHeight = e.target.offsetHeight;
            let scrollHeight = e.target.scrollHeight;
            if (scrollTop + offsetHeight > scrollHeight && !this.isReachBottom) {
                this.isReachBottom = true

                // 再次查询下一页数据
                this.current++;
                this.queryHotBlogsScroll();
            } else {
                this.isReachBottom = false
            }
        },
        toShopList(id, name) {
            location.href = "http://localhost:8081/shop-list.html?type=" + id + "&name=" + name
        },
        toBlogDetail(b) {
            location.href = "/blog-detail.html?id=" + b.id
        }
    }
}
</script>

<style>
@import "../assets/css/index.css";
@import "../assets/css/main.css";

/* @import "../assets/img/blog1.jpg"; */
/* @import "../css/element.css"; */
.el-input__inner {
    border-radius: 20px;
}

.el-carousel__item h3 {
    color: red;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}
.tu {
    width: 100%;
    /* height: 100%; */
}
</style>