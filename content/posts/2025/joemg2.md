---
title: Joe再续前缘魔改（二）
date: 2025-07-29 12:28:00
updated: 2026-01-02 12:00:00
type: tech
categories: [技术干货]
tags: [魔改, Joe]
recommend: 12
description: 本教程介绍如何在博客中新增轻量朋友圈页面，需先部署Friend-Circle-Lite项目。部署后，在博客后台添加独立页面代码，包括API地址、加载设置和样式脚本。教程提供代码示例和效果预览。
image: https://s3.qixz.cn/ywty/2026/04/19/69e44176ada86.webp
---

本文系Joe再续前缘主题魔改类第二篇教程，前置教程请见.
::quote{icon="ph:info-circle-duotone"}
[Joe再续前缘魔改铺垫（一）](/2025/joemgpd1)
::
## 这一期讲讲新增轻量朋友圈页面，需要提前部署[友链朋友圈](https://github.com/willow-god/Friend-Circle-Lite/)项目。

::quote{icon="ph:info-circle-duotone"}
具体部署教程详见[Friend-Circle-Lite:轻量友链朋友圈](https://blog.liushen.fun/posts/4dc716ec/)
::

## 部署完成后，请在博客后台>管理>独立页面
::pic
---
src: https://i.p-i.vip/135/20260102-6957703b040f0.png
caption: 博客后台独立页面添加入口
---
::
### 代码如下
```html
<div id="friend-circle-lite-root"></div>
<script>
    if (typeof UserConfig === 'undefined') {
        var UserConfig = {
            // 填写你的fc Lite地址
            private_api_url: 'https://example.com',
            // 点击加载更多时，一次最多加载几篇文章，默认20
            page_turning_number: 20,
            // 头像加载失败时，默认头像地址
            error_img: 'https://i.p-i.vip/30/20240815-66bced9226a36.webp',
        }
    }
</script>
<link rel="stylesheet" href="https://fastjs.qixz.cn/gh/willow-god/Friend-Circle-Lite/main/fclite.min.css">
<script src="https://fastjs.qixz.cn/gh/willow-god/Friend-Circle-Lite/main/fclite.min.js"></script>
```
### 前端效果预览
::pic
---
src: https://i.p-i.vip/135/20260102-695770c51d4b9.webp
caption: 轻量朋友圈页面前端效果预览
---
::

## 每日精选
::pic
---
src: https://s3.qixz.cn/ywty/2026/04/19/69e44176ada86.webp
caption: Joe再续前缘主题朋友圈页面配图
---
::
