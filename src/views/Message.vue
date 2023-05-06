<template>
    <div id="app">
        <div class="header">
            <div class="header-back-btn"></div>
            <div class="header-title">个人主页&nbsp;&nbsp;&nbsp;</div>
        </div>
        <!-- <h1>信息页面</h1> -->
        <div class="messages" @scroll="onScroll">
            <div class="notification_text" v-for="msg in followBlogs" :key="msg.id">
                <img :src="require('../assets' + msg.icon)" alt="上升" class="left_image" />
                <div class="text">
                    <p>您关注的{{ msg.name }}发表新评论了！</p>
                    <p>{{ msg.title }}</p>
                    <p style="font-size: 12px; color: #ccc">{{ msg.createTime | formatDate('yyyy-M-d H:m') }}</p>
                </div>
                <el-badge :value="1" class="item" type="primary">
                    <el-button size="small">评论</el-button>
                </el-badge>
            </div>

        </div>
    </div>
</template>
  
<script>
import axios from '../plugins/axios-0.18.0';
import '../assets/js/common';
export default ({
    data() {
        return {
            defaultImg: "/img/default-icon.png",
            followBlogs: [
                {
                    id: '0',
                    title: '北一煎包好吃！',
                    icon: '/imgs/icons/icon1.jpg',
                    name: '张三',
                    createTime: '2023-1-2',

                },
                {
                    id: '1',
                    title: '北一煎包好吃！',
                    icon: '/imgs/icons/icon1.jpg',
                    name: '张三',
                    createTime: '2023-1-2',
                },
                {
                    id: '3',
                    title: '北一煎包好吃！',
                    icon: '/imgs/icons/icon1.jpg',
                    name: '张三',
                    createTime: '2023-1-2',
                },
            ],
            params: {
                minTime: 0, // 上一次拉取到的时间戳
                offset: 0, // 偏移量
            },
            count: 5,
            isReachBottom: false,
        }
    },
    created() {
        this.queryBlogsOfFollow(true);
    },
    methods: {
        load() {
            this.count += 2;
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
                    this.followBlogs = clear ? list : this.followBlogs.concat(list);
                    this.params = params;
                })
                .catch(e => console.log(e))
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
        }
    }
})

</script>

<style lang="scss" scoped>
.item {
    margin-top: 20px;
    margin-right: 40px;
    padding-left: 300px;
}

.header {
    width: 100%;
    line-height: 40px;
    height: 6%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #79bbff;
}

.header-back-btn {
    width: 10%;
    color: #79bbff;
    font-size: 22px;
}

.header-title {
    width: 90%;
    text-align: center;
    font-size: 18px;
    font-family: Hiragino Sans GB, Arial, Helvetica, "\5B8B\4F53", sans-serif;
}

.el-menu-demo .el-menu-item,
.el-submenu__title {
    height: 35px;
    line-height: 35px;
}

.el-menu-demo {
    padding: 0 20px;
}

//图片
.left_image {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 10px;
    margin-top: -20px;
    border-radius: 50%;
}

//每一条
.notification_text {
    width: 100%;
    height: 100px;
    border-bottom: 1px #ccc solid;
    position: relative;
}

//底部按钮
.bottom_button {
    width: 330px;
    height: 50px;
    border-top: #ccc 1px solid;
    position: absolute;
    bottom: 0;
    left: 0;
}

//左右按钮
.bottom_button_left,
.bottom_button_right {
    display: inline-block;
    width: 164px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
}

//左按钮
.bottom_button_left {
    border-right: solid 1px #ccc;
}

//左按钮
.bottom_button_left:hover {
    color: #40aaf7;
}

//右按钮
.bottom_button_right:hover {
    color: #40aaf7;
}

//文字部分位置
.text {
    display: inline-block;
    position: absolute;
    top: 5px;
    left: 65px;
}

//内容部分超出隐藏，给滚动条
.box {
    overflow: auto;
    height: 400px;
    margin-bottom: 37px;
}

//滚动条的样式
::-webkit-scrollbar {
    //滚动条宽高
    width: 5px;
    height: 10px;
}

::-webkit-scrollbar-thumb {
    //滚动条颜色和圆角
    background-color: #dbd9d9;
    border-radius: 3px;
}
</style>

  