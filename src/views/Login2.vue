<template>
    <div id="app">
        <div class="login-container">
            <div class="header">
                <div class="header-back-btn" @click="goBack"><i class="el-icon-arrow-left"></i></div>
                <!-- <div class="header-back-btn"></div> -->
                <div class="header-title">手机号码快捷登录&nbsp;&nbsp;&nbsp;</div>
            </div>
            <div class="content">
                <div class="login-form">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
                        <el-form-item prop="ruleForm.id">
                            <el-select filterable v-model="ruleForm.id" placeholder="请选择商铺名称">
                                <el-option v-for="item in shops" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="ruleForm.password">
                            <el-input type="text" v-model="ruleForm.password" autocomplete="off"
                                placeholder="请输入管理员密码"></el-input>
                        </el-form-item>
                        <el-button @click="submitForm('ruleForm')"
                            style="width: 100%; background-color:#79bbff; color: #fff;">登录</el-button>
                    </el-form>
                    <div style="text-align: right; color:#333333; margin: 5px 0"><router-link
                            :to="{ path: '/login' }">用户登录</router-link></div>
                </div>
                <div class="login-radio">
                    <div>
                        <input type="radio" name="readed" v-model="radio" value="1">
                        <label for="readed"></label>
                    </div>
                    <div>我已阅读并同意
                        <a href="javascript:void(0)">
                            《吃在工大——校园点评系统用户服务协议》</a>、
                        <a href="javascript:void(0)">《隐私政策》</a>
                        等，接受免除或者限制责任、诉讼管辖约定等粗体标示条款
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
export default ({
    data() {
        return {
            radio: "1",
            shops: [
                {
                    id: 0,
                    name: '自选菜品',
                },
                {
                    id: 2,
                    name: '千里香小馄饨',
                },
                {
                    id: 3,
                    name: '煎包',
                },
                {
                    id: 4,
                    name: '面行人',
                },
            ],
            form: {
            },
            ruleForm: {                
                password: '',
                id: '',
            },
            rules: {
                id: [
                    { required: true, message: '商铺名不能为空', trigger: 'change' }
                ],
                password: [
                    // 
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.queryShops();
    },
    methods: {
        login() {
            if (!this.radio) {
                this.$message.error("请先确认阅读用户协议！");
                return
            }
            axios.post("/shop-user/login", this.ruleForm)
                .then(({ data }) => {
                    if (data) {
                        // data = data.data
                        // 保存用户信息到session  
                        sessionStorage.setItem("token", data);
                        sessionStorage.setItem("isShop", true);
                        // console.log('登录成功！')
                        // this.$router.push({
                        //     name: 'ShopEdit',
                        //     params: {
                        //         id: this.ruleForm.shopId
                        //     }
                        // })
                        this.$router.push('/')
                    }
                    // 跳转到首页
                    // location.href = "/index.html"
                })
                .catch(err => this.$message.error(err))
        },
        goBack() {
            history.back();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.login();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        queryShops() {
            // console.log("调用queryShops");
            axios.get("/shop/of/type")
                .then(({ data }) => {
                    if (!data) {
                        return
                    }
                    this.shops = data;
                    console.log(this.shops);
                })
                .catch(err => {
                    console.log(err);
                    this.$message.error(err)
                })
        },
    }

})

</script>

<!-- <style>
@import "../assets/css/main.css";
@import "../assets/css/login.css";
</style> -->
<style scoped src="../assets/css/login.css"></style>
  