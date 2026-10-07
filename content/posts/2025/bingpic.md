---
title: Bing每日图片部署教程：GitHub Actions工作流与随机图片功能
date: 2025-08-25 10:28:00
type: tech
categories: [技术干货]
tags: [EdgeOne]
recommend: 10
description: 本文介绍了如何部署Bing每日图片项目，包括在GitHub上Fork原仓库、启用GitHub Actions工作流、部署前端页面至Vercel或Netlify等平台，并添加了随机图片功能。通过新建get.js文件并运行工作流，可在部署域名下获取随机图片。
image: https://bing.qixz.cn/daily.webp
---

::alert{type="success"}
**重要更新**：原项目已更新API功能，现在可以正常使用！
::

## 项目介绍

Bing每日图片是一个实用的开源项目，可以自动获取Bing每日一图并提供前端页面展示，还支持扩展随机图片功能。本文将详细介绍如何部署该项目并进行功能扩展。

## 部署步骤

### 步骤1：Fork GitHub仓库

首先，访问原项目仓库[Daily Bing Image](https://github.com/willow-god/daily-image)，点击右上角的"Fork"按钮将仓库复制到你的GitHub账户。

::pic
---
src: https://i.p-i.vip/135/20251228-6950a3cddc587.png
caption: Fork原仓库
---
::

### 步骤2：启用GitHub Actions工作流

1. 进入你Fork的仓库
2. 点击顶部导航栏的"Actions"选项
3. 点击"I understand my workflows, go ahead and enable them"按钮启用工作流
4. 在工作流列表中找到"Daily Get Bing Image"
5. 将其从**禁用**状态改为**启用**状态

::pic
---
src: https://i.p-i.vip/135/20251228-6950a3e5b2af3.png
caption: 启用GitHub Actions工作流
---
::

::pic
---
src: https://i.p-i.vip/135/20251228-6950a3fd944fa.png
caption: 启用Daily Get Bing Image工作流
---
::

6. 点击"Run workflow"按钮手动运行一次工作流
7. 等待工作流执行完成，显示"Success"即表示第一步完成

::pic
---
src: https://i.p-i.vip/135/20251228-6950a410a2b0f.png
caption: 工作流执行成功
---
::

### 步骤3：部署前端页面

你可以选择多种平台来部署前端页面，如[Vercel](https://vercel.com)、[Netlify](https://www.netlify.com/)等，本文将使用EdgeOne Pages进行演示。

1. 登录EdgeOne控制台，进入Eo Pages
2. 点击"创建项目"，选择"导入Git仓库"

::pic
---
src: https://i.p-i.vip/135/20251228-6950a2e154182.png
caption: 创建EdgeOne Pages项目
---
::

3. 根据你的域名情况选择合适的加速区域：

| 是否ICP备案 | 服务区域 | 加速区域选择 |
| :--- | :--- | :--- |
| 已备案 | 中国大陆 | 中国大陆可用区 |
| 已备案 | 全球 | 全球可用区（含中国大陆） |
| 未备案 | 全球 | 全球可用区（不含中国大陆）|

4. 生产分支选择'page'，点击"开始部署"

::pic
---
src: https://i.p-i.vip/135/20251228-6950a476cb335.webp
caption: 开始部署项目
---
::

## 功能扩展：添加随机图片功能

部署完成后，你已经可以获取Bing每日图片了。但如果你想进一步扩展功能，可以添加随机图片功能，这样可以从历史的Bing每日图片中随机返回一张。

### 实现步骤

1. 进入你Fork的GitHub仓库
2. 在main分支的`page/functions`目录下新建`get.js`文件

::pic
---
src: https://i.p-i.vip/135/20251228-6950a49dc2eaa.png
caption: 新建get.js文件
---
::

3. 从[筱序二十の代码分享](https://gist.qixz.cn/qxzhan/eobingapi)获取代码内容并粘贴到`get.js`文件中
4. 保存并提交更改
5. 重新运行GitHub Actions工作流
6. 等待工作流执行完成并重新部署

::pic
---
src: https://i.p-i.vip/135/20251228-6950a4e4d522e.png
caption: 重新运行工作流
---
::

::pic
---
src: https://i.p-i.vip/135/20251228-6950a4f9cb73a.png
caption: 工作流执行成功
---
::

7. 部署完成后，访问你的部署域名`/get`即可获取随机图片

## 项目比较与说明

::alert{type="info"}
**关于原作者新增功能的说明**：
- 原作者已新增了`/api/daily`和`random`功能
- `/api/daily`功能提供API接口获取每日图片，但考虑到已有`/daily.jpeg`和`/daily.webp`等直链，这个功能的必要性不是很大
- 原作者的`random`函数在本文写作时无法正常运行，因此本文提供的方案是一个可靠的替代选择
::

## 项目展示

### Bing随机一图功能

- **项目维护者**：筱序二十
- **GitHub仓库**：[https://github.com/chizw/daily-image/](https://github.com/chizw/daily-image/)

::pic
---
src: https://bing.qixz.cn/get/
caption: Bing随机图片效果
---
::

### Bing每日图片功能

访问你的部署域名即可查看每日更新的Bing图片，如：
- `https://你的域名/daily.webp` - 获取WebP格式的每日图片
- `https://你的域名/daily.jpeg` - 获取JPEG格式的每日图片

## 参考项目

- [Daily Bing Image](https://github.com/willow-god/daily-image)（原项目）
- [Bing随机一图](https://github.com/chizw/daily-image/)（扩展项目）

## 后续维护

::alert{type="tip"}
- 项目会通过GitHub Actions定期自动获取Bing每日图片（默认每天一次）
- 如果遇到问题，可以查看GitHub Actions的运行日志进行排查
- 可以根据需要修改项目代码，自定义功能或调整获取图片的频率
- 建议定期检查项目依赖和配置，确保正常运行
::

希望本文对你有所帮助，如果你有任何问题或建议，欢迎在评论区留言！
