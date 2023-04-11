<template>
    <div id="app">
        <div class="header">
            <div class="header-back-btn" @click="goBack"><i class="el-icon-arrow-left"></i></div>
            <div class="header-title">店铺详情</div>
            <div class="header-share">...</div>
        </div>
        <div class="top-bar"></div>
        <div class="shop-info-box">
            <div class="shop-title">{{ shop.name }}</div>
            <div>{{shop.statusStr}}</div>
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
                <img style="width: 75%; height: auto;" src="../assets/img/blog5.jpg">
            </div>
        </div>
        <div class="shop-divider"></div>
        <div class="shop-comments">
            <div class="comments-head">
                <div>网友评价 <span>（119）</span></div>
                <div><i class="el-icon-arrow-right"></i></div>
            </div>

            <div class="comment-list">
                <div class="comment-box" v-for="i in 3" :key="i">
                    <div class="comment-icon">
                        <img src="https://p0.meituan.net/userheadpicbackend/57e44d6eba01aad0d8d711788f30a126549507.jpg%4048w_48h_1e_1c_1l%7Cwatermark%3D0"
                            alt="">
                    </div>
                    <div class="comment-info">
                        <div class="comment-user">叶小乙 <span>Lv5</span></div>
                        <div style="display: flex;">
                            
                        </div>
                        <div style="padding: 5px 0; font-size: 14px">
                            某平台上买的券，价格可以当工作餐吃，虽然价格便宜，但是这家店一点都没有...
                        </div>
                        <div class="comment-images">
                            <img src="https://qcloud.dpfile.com/pc/6T7MfXzx7USPIkSy7jzm40qZSmlHUF2jd-FZUL6WpjE9byagjLlrseWxnl1LcbuSGybIjx5eX6WNgCPvcASYAw.jpg"
                                alt="">
                            <img src="https://qcloud.dpfile.com/pc/sZ5q-zgglv4VXEWU71xCFjnLM_jUHq-ylq0GKivtrz3JksWQ1f7oBWZsxm1DWgcaGybIjx5eX6WNgCPvcASYAw.jpg"
                                alt="">
                            <img src="https://qcloud.dpfile.com/pc/xZy6W4NwuRFchlOi43DVLPFsx7KWWvPqifE1JTe_jreqdsBYA9CFkeSm2ZlF0OVmGybIjx5eX6WNgCPvcASYAw.jpg"
                                alt="">
                            <img src="https://qcloud.dpfile.com/pc/xZy6W4NwuRFchlOi43DVLPFsx7KWWvPqifE1JTe_jreqdsBYA9CFkeSm2ZlF0OVmGybIjx5eX6WNgCPvcASYAw.jpg"
                                alt="">
                        </div>
                        <div>
                            浏览641 &nbsp;&nbsp;&nbsp;&nbsp;评论5
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
import util from '../assets/js/vue'
export default ({
    data() {
        return {
            util,
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
                images:[
                    'https://img.meituan.net/msmerchant/cf3dff697bf7f6e11f4b79c4e7d989e4591290.jpg','https://img.meituan.net/msmerchant/0b463f545355c8d8f021eb2987dcd0c8567811.jpg','https://img.meituan.net/msmerchant/c3c2516939efaf36c4ccc64b0e629fad587907.jpg'
                ],
                openHours: "11:00-13:50,17:00-20:50"
                
            },
        }
    },
    created() {
        // 获取参数
        // let shopId = util.getUrlParam("id");
        let shopId = this.$route.params.id
        // console.log(this.$route.params);
        // 查询酒店信息
        this.queryShopById(shopId);
    },
    methods: {
        goBack() {
            history.back();
        },
        queryShopById(shopId) {
            axios.get("/shop/" + shopId)
                .then(({ data }) => {
                    data.images = data.images.split(",")
                    this.shop = data
                })
                .catch(this.$message.error)
        },
        queryVoucher(shopId) {
            axios.get("/voucher/list/" + shopId)
                .then(({ data }) => {
                    this.vouchers = data;
                })
                .catch(this.$message.error)
        },
        formatTime(v) {
            let b = new Date(v.beginTime);
            let e = new Date(v.endTime);
            return b.getMonth() + 1 + "月" + b.getDate() + "日 "
                + b.getHours() + ":" + this.formatMinutes(b.getMinutes())
                + " ~ "/*  + e.getMonth() + 1 + "月" + e.getDate() + "日 " */
                + e.getHours() + ":" + this.formatMinutes(e.getMinutes());
        },
        formatMinutes(m) {
            if (m < 10) m = "0" + m
            return m;
        },
        isNotBegin(v) {
            return new Date(v.beginTime).getTime() > new Date().getTime();
        },
        isEnd(v) {
            return new Date(v.endTime).getTime() < new Date().getTime();
        },
        seckill(v) {
            if (!token) {
                this.$message.error("请先登录")
                // 未登录，跳转
                setTimeout(() => {
                    location.href = "/login.html"
                }, 200);
                return;
            }
            if (this.isNotBegin(v)) {
                this.$message.error("优惠券抢购尚未开始！")
                return;
            }
            if (this.isEnd(v)) {
                this.$message.error("优惠券抢购已经结束！")
                return;
            }
            if (v.stock < 1) {
                this.$message.error("库存不足，请刷新再试试！")
                return;
            }
            let id = v.id;
            // 秒杀抢购
            axios.post("/voucher-order/seckill/" + id)
                .then(({ data }) => {
                    // 抢购成功，这里输出订单id，支付功能TODO
                    this.$message.success("抢购成功，订单id：" + data)
                })
                .catch(this.$message.error)
        }
    }
})
</script>

<style>
@import "../assets/css/shop-detail.css";
@import "../assets/css/main.css";
</style>