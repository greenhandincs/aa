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


        <div class="blog-list" @scroll="onScroll">
            <!-- 轮播图 -->
            <div style="height: 35%; width: 100%; overflow:auto">
                <el-carousel :interval="5000" arrow="hover" :autoplay="true">
                    <el-carousel-item v-for="item in tubox" :key="item.id">
                        <img :src="item.tu" class="tu">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <!-- 点评列表 -->
            <div class="blog-box" v-for="b in blogs" :key="b.id">
                <div class="author-title reply-father">
                    <el-avatar class="header-img" :size="40" :src="require('../assets' + icon(b.icon))"></el-avatar>
                    <div class="author-info">
                        <span class="author-name">{{ b.name }}</span>
                        <span class="author-time">{{ b.createTime | formatDate('yyyy-M-d H:m') }}</span>
                    </div>
                    <div class="icon-btn" @click="addLike(b)">
                        <span class="xin">
                            <i class="el-icon-thumb" :class="{ active: b.isLike }"></i>
                            {{ b.liked }}
                        </span>
                    </div>
                </div>
                <div class="blog-info">
                    <div class="blog-title">{{ b.title }}</div>
                    <FoldBox :mes2="b.content">
                        
                    </FoldBox>
                    <div class="comment-images">
                        <div v-for="(_img, i) in b.images" :key="i">
                            <!-- <img :src="require('../assets' + _img)" alt=""> -->
                            <el-image lazy style="width: 150px; margin-right: 5px;" fit='contain'
                                :src="require('../assets' + _img)" :preview-src-list="[require('../assets' + _img)]">
                            </el-image>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
// import axios from 'axios';
import axios from '../plugins/axios-0.18.0';
import '../assets/js/common';
import FoldBox from '../components/FoldBox.vue'
export default {
    components: {
        FoldBox
    },
    data() {
        return {
            tubox: [
                { id: 0, tu: "http://www.hfut.edu.cn/images/dongshaobo.jpg" },
                { id: 1, tu: "http://www.hfut.edu.cn/images/pan.png" },
                { id: 2, tu: "http://xc.hfut.edu.cn/_upload/article/images/f6/f8/875163004c49b8d871cfeb8724b8/097b6aad-cd6f-41b4-b225-19e10baa59f8.jpg" },
                { id: 3, tu: "http://xc.hfut.edu.cn/_upload/article/images/66/ac/6bd138114bbda30d0bbf50ee570c/b083c0f7-b494-4615-a9a5-78967661c494.jpg" },

            ],
            srcList: [
                '../assets/img/default-icon.png',
                '../assets/img/blog1.png',

            ],
            defaultImg: "img/default-icon.png",
            isReachBottom: false,
            types: [], // 类型列表
            blogs: [
                {
                    images: ['/img/blog1.jpg', '/img/blog1.jpg', '/img/blog1.jpg',],
                    title: "kk餐厅卤肉饭",
                    createTime: '2020-1-1',
                    name: "hewl",
                    isLike: true,
                    liked: 20
                },
                {
                    images: ['/img/blog1.jpg', '/img/blog1.jpg', '/img/blog1.jpg',],
                    title: "kk餐厅卤肉饭",
                    name: "张三",
                    isLike: true,
                    createTime: '2020-1-1',
                    liked: 18
                },
                {
                    images: ['/img/blog3.jpg', '/img/blog3.jpg',],
                    title: "kk餐厅卤肉饭",
                    name: "李四",
                    createTime: '2020-1-1',
                    isLike: true,
                    liked: 10
                },
                {
                    images: ['/img/blog3.jpg', '/img/blog3.jpg',],
                    title: "kk餐厅卤肉饭",
                    name: "王五",
                    createTime: '2020-1-1',
                    isLike: true,
                    liked: 9
                }
            ], // 播客列表
            current: 1,// blog的页码

        }
    },
    computed: {

    },
    created() {
        // 查询类型
        // console.log("hh");
        // this.queryTypes();
        this.queryHotBlogsScroll();
    },
    methods: {
        icon(src) {
            return src ? src : '/imgs/icons/default-icon.png'
        },
        queryTypes() {
            axios.get("/shop-type/list")
                .then(({ data }) => {
                    console.log(data);
                    // this.types = data;
                })
                .catch(err => {
                    this.$message.error(err)
                })
        },
        queryHotBlogsScroll() {
            axios.get("/blog/hot?current=" + this.current)
                .then(({ data }) => {
                    // data = data.data
                    // console.log(data)
                    data.forEach(b => b.images = b.images.split(","));
                    this.blogs = this.blogs.concat(data);
                    // console.log(this.blogs)
                })
                .catch(err => {
                    this.$message.error(err)
                })
        },
        addLike(b) {
            axios.put("/blog/like/" + b.id)
                .then(({ data }) => {
                    this.queryBlogById(b)
                    // console.log(data)
                })
                .catch(err => {
                    this.$message.error(err)
                })
        },
        queryBlogById(b) {
            axios.get("/blog/" + b.id)
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


<style scoped src="../assets/css/index.css"></style>
<style src="../assets/css/main.css"></style>
<style scoped src="../assets/css/element.css"></style>