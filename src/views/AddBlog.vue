<template>
    <div id="app">
        <div class="header">
            <div class="header-cancel-btn" @click="goBack">取消</div>
            <div class="header-title">&nbsp;&nbsp;发布点评<i class="el-icon-info"></i></div>
            <div class="header-commit">
                <div class="header-commit-btn" @click="submitBlog">发布</div>
            </div>
        </div>
        <div class="upload-box">
            <input type="file" @change="fileSelected" name="file" ref="fileInput" style="display: none">
            <div class="upload-btn" @click="openFileDialog">
                <i class="el-icon-camera"></i>
                <div style="font-size: 12px;line-height: 12px">上传照片</div>
            </div>
            <div class="pic-list">
                <div class="pic-box" v-for="(f, i) in fileList" :key="i">
                    <img :src="require('../assets' + f)" alt="">
                    <i class="el-icon-close" @click="deletePic(i)"></i>
                </div>
            </div>
        </div>
        <div class="blog-title">
            <input v-model="params.title" type="text" placeholder="填写标题更容易上首页哦~">
        </div>
        <div class="blog-content">
            <textarea v-model="params.content" placeholder="最近打卡了什么地方，有什么新奇体验呢？"></textarea>
        </div>
        <div class="divider"></div>
        <div class="blog-shop" @click="showDialog = true">
            <div class="shop-left">关联商户</div>
            <div v-if="selectedShop.name">{{ selectedShop.name }}</div>
            <div v-else>去选择&nbsp;<i class="el-icon-arrow-right"></i></div>
        </div>
        <div class="mask" v-show="showDialog" @click="showDialog = false"></div>

        <transition name="el-zoom-in-bottom">
            <div class="shop-dialog" v-show="showDialog">
                <div class="blog-shop">
                    <div class="shop-left">关联商户</div>
                </div>
                <div class="search-bar">
                    <div class="city-select">杭州 <i class="el-icon-arrow-down"></i></div>
                    <div class="search-input">
                        <i class="el-icon-search" @click="queryShops"></i>
                        <input v-model="shopName" type="text" placeholder="搜索商户名称">
                    </div>
                </div>
                <div class="shop-list">
                    <div v-for="s in shops" :key="s.id" class="shop-item" @click="selectShop(s)">
                        <div class="shop-name">{{ s.name }}</div>
                        <div>{{ s.area }}</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
import axios from '../plugins/axios-0.18.0';
import '../assets/js/common';
export default({    
    data() {
        return {            
            fileList: [], // 文件列表
            params: {},
            showDialog: false, //
            shops: [], // 商户信息
            shopName: "", //商户名称
            selectedShop: {}, // 选中的商户
        }
    },
    created() {
        // this.checkLogin();
        this.queryShops();
    },
    methods: {
        queryShops() {
            axios.get("/shop/of/name?name=" + this.shopName)
                .then(({ data }) => this.shops = data)
                .catch(this.$message.error)
        },
        selectShop(s) {
            this.selectedShop = s;
            this.showDialog = false;
        },
        submitBlog() {
            let { ...data } = this.params;
            data.images = this.fileList.join(",");
            data.shopId = this.selectedShop.id;
            axios.post("/blog", data)
                .then(resp => this.$router.push('/'))
                .catch(this.$message.error)
        },
        openFileDialog() {
            this.$refs.fileInput.click();
        },
        fileSelected() {
            let file = this.$refs.fileInput.files[0];
            let formData = new FormData();
            formData.append("file", file);
            const config = {
                headers: { "Content-Type": "multipart/form-data;boundary=" + new Date().getTime() }
            };
            axios
                .post("/upload/blog", formData, config)
                .then(({ data }) => this.fileList.push('/imgs' + data))
                .catch(this.$message.error);
        },
        deletePic(i) {
            axios.get("/upload/blog/delete?name=" + this.fileList[i])
                .then(() => this.fileList.splice(i, 1))
                .catch(this.$message.error)
        },
        checkLogin() {
            // 获取token
            let token = sessionStorage.getItem("token");
            if (!token) {
                location.href = "login.html"
            }
            // 查询用户信息
            axios.get("/user/me")
                .then()
                .catch(err => {
                    this.$message.error(err);
                    setTimeout(() => location.href = "login.html", 200)
                })
        },
        goBack() {
            history.back();
        },
        handleRemove(file) {
            console.log(file);
        }
    },

})
</script>

<style scoped src="../assets/css/blog-edit.css"></style>
<!-- <style>
@import "../assets/css/blog-edit.css";
@import "../assets/css/main.css";
</style> -->