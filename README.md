## 平台简介

* 本仓库为前端技术栈 [Vue3](https://v3.cn.vuejs.org) + [Element Plus](https://element-plus.org/zh-CN) + [Vite](https://cn.vitejs.dev) 版本。

## 在线体验
- 最近版V2 Lite演示地址：http://cangku.ichengle.top/
- 最新版V2 Advance演示地址：http://kucun.ichengle.top
- 旧版V1演示地址：http://wms.ichengle.top

## 不同分支介绍
lite: jdk17+vue3，支持多仓库，没有库区概念，操作简单，覆盖大部分库存应用场景。

advance: jdk17+vue3，支持多仓库、多库区，记录生产日期、过期日期、sn，可适配一物一码，操作相对复杂。

v1：jdk8+vue2

## 后端项目地址
#### gitee地址
https://gitee.com/zccbbg/wms-ruoyi

#### github地址
https://github.com/zccbbg/wms-ruoyi

## 前端运行

```bash
# 进入项目目录
cd ruoyi-wms-lite-vue

# 安装依赖
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev

# 构建测试环境 yarn build:stage
# 构建生产环境 yarn build:prod
# 前端访问地址 http://localhost:80
```