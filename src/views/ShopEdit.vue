<template>
    <div id="app">
        <div class="header">
            <div class="header-back-btn" @click="goBack"><i class="el-icon-arrow-left"></i></div>
            <div class="header-title">店铺详情</div>
            <div class="header-share">...</div>
        </div>
        <div class="top-bar"></div>
        <div class="shop-info-box">
            <span class="shop-title">{{ shop.name }}</span>
            <span>{{ shop.statusStr }}</span>
            <div class="shop-rate">
                <el-rate disabled v-model="shop.score" text-color="#F63" show-score></el-rate>
                <span>{{ shop.comments }}条</span>
            </div>
            <div class="shop-rate-info"> 口味:4.9 环境:4.8 服务:4.7 </div>

            <div class="shop-images">
                <div v-for="(s, i) in shop.images" :key="i">
                    <img :src="s" alt="">
                </div>
            </div>
            <div class="shop-address">
                <div><i class="el-icon-map-location"></i></div>
                <span>{{ shop.address }}</span>
                <div style="width: 10px; flex-grow: 2; text-align: center; color: #e1e2e3">|</div>
                <span><i class="el-icon-watch"></i></span>
                <div style="padding-right: 10px;">营业时间</div>
                <div>{{ shop.openHours }}</div>
            </div>
        </div>
        <div class="shop-divider"></div>

        <div class="menu">
            <div class="comments-head">
                <div>菜单</div>
            </div>
            <div class="menu-img">
                <img style="width: 75%; height: auto;" :src="require('../assets' + shop.menu)">
            </div>
        </div>
        <div class="shop-divider"></div>
        <div class="shop-comments">
            <div class="comments-head">
                <div>相关点评 <span>（{{ shop.comments }}）</span></div>
                <div><i class="el-icon-arrow-right"></i></div>
            </div>

            <div class="comment-list">
                <div class="comment-box" v-for="blog in blogs" :key="blog.id">
                    <div class="comment-icon">
                        <img :src="require('../assets' + blog.icon)" alt="">
                    </div>

                    <div class="comment-info">
                        <div class="comment-user">{{ blog.name }} <div>{{ blog.createTime | formatDate('yyyy-M-d H:m') }}
                            </div>
                        </div>
                        <div class="blog-liked" @click="addLike(blog)">
                            <i class="el-icon-thumb" :class="{ active: blog.isLike }"></i>
                            {{ blog.liked }}
                        </div>
                        <div style="display: flex;">

                        </div>
                        <div style="padding: 5px 0; font-size: 14px">
                            {{ blog.content }}
                        </div>
                        <div class="comment-images">
                            <div v-for="(_img, i) in blog.images" :key="i">
                                <img :src="require('../assets' + _img)" alt="">
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div
                    style="display: flex; justify-content: space-between;padding: 15px 0; border-top: 1px solid #f1f1f1; margin-top: 10px;">
                    <div>查看全部119条评价</div>
                    <div><i class="el-icon-arrow-right"></i></div>
                </div>
            </div>
        </div>
        <div class="shop-divider"></div>
        <div class="copyright">
            copyright ©2023 吃在工大——校园食堂点评
        </div>
    </div>
</template>

<script>
import axios from '../plugins/axios-0.18.0';
import '../assets/js/common';
// import util from '../assets/js/common'
export default ({
    data() {
        return {
            shop: {
                id: 0,
                // images: "img/blog1.jpg",
                name: "金味祥源快餐",
                comments: 20,
                score: 5,
                area: "三楼",
                distance: 500,
                avgPrice: 30,
                address: "北区二楼",
                status: 0,
                statusStr: '营业中',
                images: [
                    'https://img.meituan.net/msmerchant/cf3dff697bf7f6e11f4b79c4e7d989e4591290.jpg', 'https://img.meituan.net/msmerchant/0b463f545355c8d8f021eb2987dcd0c8567811.jpg', 'https://img.meituan.net/msmerchant/c3c2516939efaf36c4ccc64b0e629fad587907.jpg'
                ],
                openHours: "11:00-13:50,17:00-20:50"

            },
            blogs: {

            },
            params: {
                id: 10
            }

        }
    },
    created() {
        // 获取参数        
        let shopId = this.$route.params.id
        // 查询信息
        this.queryShopById(shopId);
        //查询评价
        this.queryBlogs(shopId);
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
        goBack() {
            history.back();
        },
        queryShopById(shopId) {
            axios.get("/shop/" + shopId)
                .then(({ data }) => {
                    data.images = data.images.split(",")
                    data['statusStr'] = this.getSatusStr(data.status)
                    this.shop = data
                })
                .catch(this.$message.error)
        },
        queryBlogs(shopId) {
            this.params.id = shopId
            axios.get("/blog/of/shop", {
                params: this.params
            })
                .then(({ data }) => {
                    // console.log(data);
                    data.forEach(s => s.images = s.images.split(','));
                    // data.images = data.images.split(",")
                    this.blogs = data
                })
                .catch(this.$message.error)
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

    }
})
</script>

<!-- <style>
@import "../assets/css/shop-detail.css";
@import "../assets/css/main.css";</style> -->
<style scoped src="../assets/css/shop-detail.css"></style>