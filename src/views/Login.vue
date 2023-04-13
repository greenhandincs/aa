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
                        <div style="display: flex; justify-content: space-between">
                            <!-- <el-input style="width: 60%" placeholder="请输入手机号" v-model="form.phone">
                        </el-input> -->
                            <el-form-item prop="phone">
                                <el-input type="text" v-model="ruleForm.phone" autocomplete="off"
                                    placeholder="请输入手机号"></el-input>
                            </el-form-item>
                            <el-button style="width: 38%; height: 100%;" @click="sendCode" type="primary" plain
                                :disabled="disabled">
                                {{ codeBtnMsg }}</el-button>
                        </div>

                        <!-- <div style="height: 5px"></div> -->
                        <!-- <el-input placeholder="请输入验证码" v-model="form.code">
                    </el-input> -->
                        <el-form-item prop="code">
                            <el-input type="text" v-model="ruleForm.code" autocomplete="off"
                                placeholder="请输入验证码"></el-input>
                        </el-form-item>
                        <div style="text-align: center; color: #8c939d;margin: 5px 0">未注册的手机号码验证后自动创建账户</div>
                        <el-button @click="submitForm('ruleForm')"
                            style="width: 100%; background-color:#79bbff; color: #fff;">登录</el-button>

                    </el-form>
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
        var checkcode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('验证码不能为空'));
            }
            return callback();
        };
        var validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('手机号不能为空！'));
            } else {
                let reg = /^1[0-9]{10}$/;
                if (!reg.test(value)) {
                    callback(new Error('手机号格式不正确'));
                }
            }
            return callback();
        };
        return {
            radio: "1",
            disabled: false, // 发送短信按钮
            codeBtnMsg: "发送验证码", // 发送短信按钮提示
            form: {
            },
            ruleForm: {
                phone: '',
                code: '',
            },
            rules: {
                phone: [
                    { validator: validatePhone, trigger: 'blur' }
                ],
                code: [
                    { validator: checkcode, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        login() {
            if (!this.radio) {
                this.$message.error("请先确认阅读用户协议！");
                return
            }
            axios.post("/user/login", this.ruleForm)
                .then(({ data }) => { 
                    if (data) {
                        // data = data.data
                        // 保存用户信息到session  
                        sessionStorage.setItem("token", data);
                        // console.log('登录成功！')
                        this.$router.push('/me')
                    }
                    // 跳转到首页
                    // location.href = "/index.html"
                })
                .catch(err => this.$message.error(err))
        },
        goBack() {
            history.back();
        },
        sendCode() {
            let flag = false;
            this.$refs.ruleForm.validateField(["phone"], (valid, vv) => {
                console.log(valid);
                if (valid) {                 
                    flag = true;                    
                }
            });
            if(flag)
                return;            
            // 发送验证码
            axios.post("/user/code?phone=" + this.ruleForm.phone)
                .then(() => { })
                .catch(err => {
                    console.log(err);
                    this.$message.error(err)
                });
            // 禁用按钮
            this.disabled = true;
            // 按钮倒计时
            let i = 60;
            this.codeBtnMsg = (i--) + '秒后可重发'
            let taskId = setInterval(() => this.codeBtnMsg = (i--) + '秒后可重发', 1000);
            setTimeout(() => {
                this.disabled = false;
                clearInterval(taskId);
                this.codeBtnMsg = "发送验证码";
            }, 59000)
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
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }

})

</script>

<!-- <style>
@import "../assets/css/main.css";
@import "../assets/css/login.css";
</style> -->
<style scoped src="../assets/css/login.css"></style>
  