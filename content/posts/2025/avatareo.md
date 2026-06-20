---
title: 免费搭建自己的头像源：利用EdgeOne免费资源实现多源头像API
date: 2025-09-27 18:39:00
type: tech
categories: [技术干货]
tags: [EdgeOne, 教程]
recommend: 10
description: 本文介绍了如何免费搭建多源头像API，支持通过MD5值、邮箱或QQ号获取头像，并详细阐述了在EdgeOne中添加站点、配置边缘函数及触发条件的步骤。该API利用EdgeOne的免费资源，无需担心用量超限，并提供在线使用体验。
image: https://s3.qixz.cn/ywty/2026/04/19/69e441875f7b0.webp
---
::alert{type="info"}
**提示**：该项目利用EdgeOne的免费资源，日常使用无需担心用量超限。
::

## 功能简介

本头像API支持多种方式获取头像，匹配逻辑从上到下依次执行：

::tab{:tabs='["传入MD5值","传入邮箱值","传入QQ号"]'}
#tab1
回源gavatar，代理返回图片
#tab2
使用EdgeOne函数将邮箱转换为MD5，随后返回
#tab3
回源q.qlogo，随后代理返回QQ头像
::

支持传入源支持的参数，例如设置头像大小：`?s=640`

::alert{type="tip"}
**后续计划**：添加图片判断功能，确保尽可能返回有效的头像图片。
::

## 搭建教程

### 步骤1：添加站点到EdgeOne

首先需要在EdgeOne中添加一个站点，源站可以随便填写，确保HTTPS正常即可。

::pic
---
src: https://i.p-i.vip/135/20251228-69509ed0c4f8c.png
caption: 添加站点到EdgeOne
---
::

### 步骤2：配置边缘函数

1. 进入EdgeOne控制台，找到边缘函数配置页面：

::pic
---
src: https://i.p-i.vip/135/20251228-69509ef0e3a17.png
caption: 边缘函数配置页面
---
::

2. 创建新的边缘函数：

::pic
---
src: https://i.p-i.vip/135/20251228-69509f1197ae4.png
caption: 创建新的边缘函数
---
::

3. 选择后点击下一步，填入代码：

[获取代码点我](https://gist.qixz.cn/qxzhan/3d1e9efd866e444598fe64d646ac2fd2)

4. 点击“创建并部署”：

::pic
---
src: https://i.p-i.vip/135/20251228-69509f1197ae4.png
caption: 创建并部署边缘函数
---
::

5. 转到高级配置-->触发配置，新增一个触发规则：

::pic
---
src: https://i.p-i.vip/135/20251228-69509f12263ea.png
caption: 新增触发配置
---
::
::pic
---
src: https://i.p-i.vip/135/20251228-69509f1248e44.png
caption: 确认部署
---
::

6. 执行函数选择刚才新建的那个，触发条件选择HOST匹配，并选择你实际要访问的域名：

::pic
---
src: https://i.p-i.vip/135/20251228-69509f12b2835.png
caption: 配置触发条件示例
---
::

### 步骤3：资源使用说明

EdgeOne每月提供以下免费资源：
- 300万次边缘函数请求数
- 300万毫秒的边缘函数CPU Time

日常使用毫无压力，并且EO对于已处理的URL缓存后不会额外统计请求数，进一步降低了资源消耗。

## 在线使用体验

[访问头像API](https://avatar.wuxit.cn/)

## 效果预览

### MD5方式

::pic
---
src: https://fastjs.qixz.cn/avatar/3d72d0a8e5e7228a2577b347fefe7301
caption: 通过MD5获取头像
---
::

### 邮箱方式

::pic
---
src: https://fastjs.qixz.cn/avatar/qxbk@qq.com
caption: 通过邮箱获取头像
---
::

### QQ号方式

::pic
---
src: https://fastjs.qixz.cn/avatar/2907713872
caption: 通过QQ号获取头像
---
::

## 总结

通过本文的教程，你可以轻松搭建一个功能完善的免费头像API。该API支持多种方式获取头像，利用EdgeOne的免费资源，无需担心用量问题。

::pic
---
src: https://i.p-i.vip/135/20260207-698729601d444.webp
caption: 头像API效果
---
::
