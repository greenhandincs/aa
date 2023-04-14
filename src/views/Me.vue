<template>
    <div id="app">
        <!-- <h1>我的</h1> -->
        <div class="header">
            <div class="header-back-btn"></div>
            <div class="header-title">个人主页&nbsp;&nbsp;&nbsp;</div>
        </div>
        <div class="basic">
            <div class="basic-icon">
                <img :src="require('../assets' + icon)" alt="">
            </div>
            <div class="basic-info">
                <div class="name">{{ user.nickName }}</div>
                <span>{{ user.city || '未填写地址' }}</span>
                <div class="edit-btn" @click="toEdit">
                    编辑资料
                </div>
            </div>
            <div class="logout-btn" @click="logout">
                退出登录
            </div>
        </div>
        <div class="introduce">
            <span v-if="user.introduce">{{ user.introduce }}</span>
            <span v-else>添加个人简介，让大家更好的认识你 <i class="el-icon-edit"></i></span>
        </div>
        <div class="content">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="我的点评" name="1">
                    <div v-for="b in blogs" :key="b.id" class="blog-item">
                        <div class="blog-img"><img :src="require('../assets' + b.images)" alt=""></div>
                        <div class="blog-info">
                            <div class="blog-title">{{ b.title }}</div>
                            <div class="blog-liked"><i class="el-icon-thumb"></i>{{ b.liked }}</div>
                            <!-- <div class="blog-comments"><i class="el-icon-chat-dot-round"></i> {{ b.comments }}</div> -->
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 粉丝列表 -->
                <el-tab-pane :label="fansLabel" name="2">
                    <div class="follow-info" v-for="u in fans" :key="u.id">
                        <div class="follow-info-icon" @click="toOtherInfo(u.id)">
                            <img :src="require('../assets' + u.icon)" alt="">
                        </div>
                        <div class="follow-info-name">
                            <div class="name">{{ u.nickName }}</div>
                        </div>
                        <div class="follow-info-btn" @click="toOtherInfo(u.id)">
                            去主页看看
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 关注列表 -->
                <el-tab-pane :label="followsLabel" name="3">
                    <div class="follow-info" v-for="u in follow" :key="u.id">
                        <div class="follow-info-icon" @click="toOtherInfo(u.id)">
                            <img :src="require('../assets' + u.icon)" alt="">
                        </div>
                        <div class="follow-info-name">
                            <div class="name">{{ u.nickName }}</div>
                        </div>
                        <div class="follow-info-btn" @click="toOtherInfo(u.id)">
                            去主页看看
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
  
<script>
import axios from '../plugins/axios-0.18.0';
import '../assets/js/common';

export default ({
    data() {
        return {
            defaultImg: "img/default-icon.png",
            user: "",
            activeName: "1",
            info: {},
            blogs: [],
            blogs2: [], // 关注的人的播客
            params: {
                minTime: 0, // 上一次拉取到的时间戳
                offset: 0, // 偏移量
            },
            count: 5,
            isReachBottom: false,
            followCnt: 0,
            fansCnt: 0,
            fans: [
                {
                    id: 0,
                    icon: '/imgs/icons/icon1.jpg',
                    nickName: '我要拿奖'

                },
                {
                    id: 1,
                    icon: '/imgs/icons/default-icon.png',
                    nickName: '我是张三'

                },
                {
                    id: 2,
                    icon: '/imgs/icons/icon1.jpg',
                    nickName: '我是李四'

                }
            ],
            follow: []
        }
    },
    computed: {
        fansLabel: function () {
            return '粉丝(' + this.user.fans + ')';
        },
        followsLabel: function () {
            return '关注(' + this.user.followee + ')';
        },
        icon(){
            return this.user.icon ? this.user.icon : '/imgs/icons/default-icon.png'
        }
    },
    created() {
        this.queryUser();
        // this.queryFans();
        // this.queryFollow();
    },
    methods: {
        load() {
            this.count += 2;
        },
        toOtherInfo(id) {
            location.href = "/other-info.html?id=" + id
        },
        queryFans() {
            axios.get("/follow/fans")
                .then(({ data }) => {
                    if(data){
                        this.fans = data
                        this.fansCnt = data.length
                    }
                    // console.log(data);
                    // this.fansCnt = data.length
                })
                .catch(this.$message.error)
        },
        queryFollow() {

            axios.get("/follow/of/me")
                .then(({ data }) => {
                    this.follow = data
                    this.followCnt = data.length
                })
                .catch(this.$message.error)
        },
        queryBlogs() {
            axios.get("/blog/of/me")
                .then(({ data }) => {
                    data.forEach(b => {
                        b.images = b.images.split(',')[0]
                    });
                    this.blogs = data
                })
                .catch(this.$message.error)
        },
        queryUser() {
            // 查询用户信息            
            axios.get("/user/me/info")
                .then(({ data }) => {
                    // 保存用户
                    this.user = data;
                    // // 查询用户详情
                    // this.queryUserInfo();
                    // 查询用户笔记
                    this.queryBlogs();
                })
                .catch(err => {
                    // location.href = "login.html"
                    this.$router.push('/login');

                })
        },
        goBack() {
            history.back();
        },
        // queryUserInfo() {
        //     axios.get("/user/info/" + this.user.id)
        //         .then(({ data }) => {
        //             if (!data) {
        //                 return
        //             }
        //             // 保存用户详情
        //             this.info = data;
        //             // 保存到本地
        //             sessionStorage.setItem("userInfo", JSON.stringify(data))
        //         })
        //         .catch(err => {
        //             this.$message.error(err);
        //         })
        // },
        toEdit() {
            // location.href = 'info-edit.html'
            this.$router.push('/info-edit')
        },
        logout() {
            axios.post(this.GLOBAL.serverSrc + "/user/logout")
                .then(() => {
                    // 清理session
                    sessionStorage.removeItem("token")
                    // 跳转
                    location.href = "/"
                })
                .catch(this.$message.error)
        },
        handleClick(r) {
            console.log('handle' + r.name);
            switch (r.name) {
                case '1':
                    this.queryBlogs();
                    break
                case '2':
                    this.queryFans();
                    break
                case '3':
                    this.queryFollow();
                    break
            }
        },
        addLike(b) {
            axios.put("/blog/like/" + b.id)
                .then(({ data }) => {
                    this.queryBlogById(b);
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
            if (scrollTop === 0) {
                // 到顶部了，查询一次
                this.queryBlogsOfFollow(true);
            } else if (scrollTop + offsetHeight + 1 > scrollHeight && !this.isReachBottom) {
                this.isReachBottom = true
                // 再次查询下一页数据
                this.queryBlogsOfFollow();
            } else {
                this.isReachBottom = false
            }
        },
        queryBlogsOfFollow(clear) {
            if (clear) {
                this.params.offset = 0;
                this.params.minTime = new Date().getTime() + 1;
            }
            let { minTime, offset: os } = this.params;
            axios.get("/blog/of/follow", {
                params: { offset: os, lastId: minTime || new Date().getTime() + 1 }
            })
                .then(({ data }) => {
                    if (!data) {
                        return;
                    }
                    let { list, ...params } = data;
                    list.forEach(b => b.img = b.images.split(",")[0])
                    this.blogs2 = clear ? list : this.blogs2.concat(list);
                    this.params = params;
                })
                .catch(e => console.log(e))
        },
    },
})

</script>

<style scoped src="../assets/css/info.css"></style>