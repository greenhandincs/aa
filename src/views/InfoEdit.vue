<template>
    <div id="app">
        <div class="header">
            <div class="header-back-btn" @click="goBack"><i class="el-icon-arrow-left"></i></div>
            <div class="header-title">资料编辑&nbsp;&nbsp;&nbsp;</div>
        </div>
        <div class="edit-container">
            <div class="info-box">
                <div class="info-item">
                    <div class="info-label">头像</div>
                    <div class="info-btn">
                        <img width="35" :src="require('../assets' + icon)" alt="">
                        <div><i class="el-icon-arrow-right"></i></div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="info-item">
                    <div class="info-label">昵称</div>
                    <el-input style="width: 80%; border: 0px;" 
                    class="borderNone" type="text" v-model="user.nickName" minlength="1" maxlength="10" show-word-limit></el-input>
                        <!-- <div class="info-btn">
                            <div>{{ user.nickName }}</div>
                            <div>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div> -->
                </div>
                <div class="divider"></div>
                <div class="info-item">
                    <div class="info-label">个人介绍</div>
                    <div class="info-btn">
                        <div style="overflow: hidden; width: 150px;text-align: right">{{ info.introduce || '介绍一下自己' }}</div>
                        <div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-box">
                <div class="info-item">
                    <div class="info-label">性别</div>
                    <div class="info-btn">
                        <div>{{ info.gender || '选择' }}</div>
                        <div><i class="el-icon-arrow-right"></i></div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="info-item">
                    <div class="info-label">城市</div>
                    <div class="info-btn">
                        <div>{{ info.city || '选择' }}</div>
                        <div><i class="el-icon-arrow-right"></i></div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="info-item">
                    <div class="info-label">生日</div>
                    <div class="info-btn">
                        <div>{{ info.birthday || '添加' }}</div>
                        <div><i class="el-icon-arrow-right"></i></div>
                    </div>
                </div>
            </div>

        </div>
        <el-button @click="submitAll"
                            style="width: 100%; background-color:#79bbff; color: #fff;">提交</el-button>
    </div>
</template>

<script>
import axios from '../plugins/axios-0.18.0';
import '../assets/js/common';
export default ({
    data() {
        return {
            user: "",
            info: {},
        }
    },
    computed: {
        icon: function () {
            return this.user.icon ? this.user.icon : '/imgs/icons/default-icon.png'
        }
    },
    created() {
        this.checkLogin();
    },
    methods: {
        checkLogin() {
            // 查询用户信息
            axios.get("/user/me/info")
                .then(({ data }) => {
                    console.log(data);
                    this.user = data;
                    this.info = JSON.parse(sessionStorage.getItem("userInfo")) || {}
                })
                .catch(err => {
                    this.$message.error(err);
                    setTimeout(() => this.$router.push('/login'), 1000)
                })
        },
        goBack() {
            history.back();
        },
        submitAll() {
            axios.post("/user/user/update", this.user)
                .then(({ data }) => { 
                    if (data) {
                        console.log(data);
                        this.$router.push('/me')
                    }
                    // 跳转到首页
                    // location.href = "/index.html"
                })
                .catch(err => this.$message.error(err))
        }
    },

})
</script>

<style src="../assets/css/info.css" scoped></style>
<style scoped>
/* .el-input__inner{
    border: 0px;
} */
.borderNone /deep/ .el-input__inner {
  border: none;
}
</style>