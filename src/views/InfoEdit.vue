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
                    <el-input style="width: 80%; border: 0px;" class="borderNone" type="text" v-model="user.nickName"
                        minlength="1" maxlength="10" show-word-limit></el-input>
                </div>
                <div class="divider"></div>
                <div class="info-item">
                    <div class="info-label">个人介绍</div>
                    <el-input style="width: 80%; border: 0px;" class="borderNone" type="textarea" v-model="user.introduce"
                        maxlength="120" autosize show-word-limit></el-input>
                </div>                
            </div>
            <div class="info-box">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item name="1">
                        <template slot="title">
                            <div class="info-label">性别</div>
                            <div class="info-btn" style="margin-left: 260px;">
                                <div>{{ genderStr }}</div>
                            </div>
                        </template>
                        <div style="text-align: center;">
                            <el-radio v-model="user.gender" :label="false">男</el-radio>
                            <el-radio v-model="user.gender" :label="true">女</el-radio>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template slot="title">
                            <div class="info-label">城市</div>
                            <div class="info-btn" style="margin-left: 260px;">
                                <div>{{ user.city || '选择' }}</div>
                            </div>
                        </template>
                        <div style="text-align: center;">
                            <el-radio v-model="user.city" label="合肥">合肥</el-radio>
                            <el-radio v-model="user.city" label="宣城">宣城</el-radio>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template slot="title">
                            <div class="info-label">生日</div>
                            <div class="info-btn" >
                                <div style="margin-left: 260px;" v-if="showBirthday">选择</div>
                                <div v-else style="margin-left: 225px;">{{ user.birthday | formatDate('yyyy-M-d')}}</div>
                            </div>
                        </template>
                        <div style="text-align: center;">
                            <div class="block">                                
                                <el-date-picker v-model="user.birthday" type="date" placeholder="选择日期">
                                </el-date-picker>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>                
            </div>

        </div>
        <el-button @click="submitAll" style="width: 100%; background-color:#79bbff; color: #fff;">提交</el-button>
    </div>
</template>

<script>
import axios from '../plugins/axios-0.18.0';
import '../assets/js/common';
export default ({
    data() {
        return {
            user: {
                userId: '',
                nickName: '',
                icon: '',
                city: '',
                introduce: '',
                gender: '',
                birthday: '',
            },
            info: {},
            activeName: ''
        }
    },
    computed: {
        icon: function () {
            return this.user.icon ? this.user.icon : '/imgs/icons/default-icon.png'
        },
        genderStr: function () {
            if (typeof this.user.gender === 'undefined')
                return '选择'
            return !this.user.gender ? '男' : '女'
        },
        showBirthday(){
            if(!this.user.birthday)
                return true;
            return false;
        },
    },
    created() {
        this.checkLogin();
    },
    methods: {
        checkLogin() {
            // 查询用户信息
            axios.get("/user/me/info")
                .then(({ data }) => {
                    // console.log(data);
                    this.user = data;
                    Object.assign(this.user, data)
                    
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
                    console.log(data);
                    this.$router.push('/me')
                    // if (data) {
                    // }
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

.borderNone /deep/ .el-textarea__inner {
    border: none;
    padding: 10px 15px;
    display: inline;
}
</style>