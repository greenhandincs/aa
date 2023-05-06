<template>
    <div id="app">
        <div class="header">
            <div class="header-back-btn" @click="goBack"><i class="el-icon-arrow-left"></i></div>
            <div class="header-title">&nbsp;&nbsp;&nbsp;</div>
        </div>
        <div class="basic">
            <div class="basic-icon">
                <img :src="require('../assets' + icon)" alt="">
            </div>
            <div class="basic-info">
                <div class="name">{{ user.nickName }}</div>                
                <span>{{ user.city || '未填写地址' }}</span>
            </div>
            <div class="logout-btn" @click="follow" style="text-align: center">
                {{ followed ? "取消关注" : "关注" }}
            </div>
        </div>
        <div class="introduce">
            <span v-if="info.introduce">{{ info.introduce }}</span>
            <span v-else>这个人很懒，什么都没有留下</span>
        </div>
        <div class="content">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="点评" name="1">
                    <div v-for="b in blogs" :key="b.id" class="blog-item">
                        <div class="blog-img"><img :src="require('../assets' + b.images.split(',')[0])" alt=""></div>
                        <div class="blog-info">
                            <div class="blog-title" v-html="b.title"></div>
                            <div class="blog-liked"><i class="el-icon-thumb"></i>{{ b.liked }}</div>                            
                        </div>
                    </div>
                </el-tab-pane>
                
            </el-tabs>
        </div>
    </div>
</template>

<script>
import axios from '../plugins/axios-0.18.0';
import util from '../assets/js/common';
export default ({
    data() {
        return {
            util,
            user: "",
            loginUser: {},
            activeName: "1",
            info: {},
            blogs: [],
            followed: false, // 是否关注了
            commonFollows: [], // 共同关注
        }
    },
    computed: {        
        icon(){
            return this.user.icon ? this.user.icon : '/imgs/icons/default-icon.png'
        }
    },
    created() {
        let userId = this.$route.params.id
      this.queryUser(userId);
      this.queryLoginUser();
    },
    methods: {
      queryBlogs() {
        axios.get("/blog/of/user", {
            params: {id: this.user.id, current: 1}
          })
          .then(({data}) => this.blogs = data)
          .catch(this.$message.error)
      },
      queryLoginUser() {
        // 查询用户信息
        axios.get("/user/me")
          .then(({data}) => {
            // 保存用户
            this.loginUser = data;
          })
          .catch(console.log)
      },
      queryUser(id) {
        // 查询用户信息
        // let id = util.getUrlParam("id")
        axios.get("/user/" + id)
          .then(({data}) => {
            // 保存用户
            this.user = data;
            // 查询用户详情
            this.queryUserInfo();
            // 查询用户笔记
            this.queryBlogs();
            // 是否被关注
            this.isFollowed();
          })
          .catch(console.log)
      },
      goBack() {
        history.back();
      },
      queryUserInfo(id) {
        axios.get("/user/info/" + this.user.id)
          .then(({data}) => {
            if (!data) {
              return
            }
            // 保存用户详情
            this.info = data;
            // 保存到本地
            sessionStorage.setItem("userInfo", JSON.stringify(data))
          })
          .catch(err => {
            this.$message.error(err);
          })
      },
      isFollowed(){
        axios.get("/follow/or/not/" + this.user.id)
          .then(({data}) => this.followed = data)
          .catch(this.$message.error)
      },
      queryCommonFollow() {
        axios.get("/follow/common/" + this.user.id)
          .then(({data}) => this.commonFollows = data)
          .catch(err => {
            this.$message.error(err);
          })
      },
      follow() {
        axios.put("/follow/" + this.user.id + "/" + !this.followed)
          .then(() => {
            this.$message.success(this.followed ? "已取消关注" : "已关注")
            this.followed = !this.followed
          })
          .catch(this.$message.error)
      },
      handleClick(t) {
        if (t.name === '2') {
          this.queryCommonFollow();
        }
      },
      toOtherInfo(id){
        location.href = "/other-info.html?id=" + id
      }
    },
})
</script>

<style src="../assets/css/info.css" scoped></style>