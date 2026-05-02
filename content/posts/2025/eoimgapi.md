---
title: 使用Eo Pages免费搭建随机图API！
date: 2025-08-25 10:40:00
type: tech
categories: [技术干货]
tags: [EdgeOne]
recommend: 10
description: 使用Eo Pages搭建随机图API，Fork Acgapi仓库，选择加速区域，部署main分支。访问路径包括/get（双端自适应）、/pc（电脑端）和/pe（移动端），注意调整图片存储和数量。
image: https://api.yppp.net/api.php
---

::alert{type="error"}
**重要通知**：由于EdgeOne Pages平台或相关API的更新，当前方法暂时无法使用。请关注项目仓库获取最新维护信息，静待更新修复。
::

::quote
开学在即，有挺多事情处理，更新频率可能会降低，感谢大家的理解。
::

## 项目背景

在研究Bing每日一图功能时，我产生了一个想法：既然Bing可以提供随机图片，为什么不搭建一个属于自己的随机图片API呢？这样可以更好地控制图片内容和展示效果。

::pic
---
src: https://api.yppp.net/api.php
caption: 随机图片API效果示例
---
::
## 实现原理

随机图片API的实现原理其实很简单：

1. 将图片资源分类存储（电脑端和移动端）
2. 通过JavaScript随机选择一张图片
3. 将选中的图片返回给请求者
4. 根据设备类型自适应返回不同尺寸的图片

## 部署步骤

### 步骤1：Fork仓库

首先，Fork这个[Acgapi](https://github.com/scfcn/acgapi)仓库到你的GitHub账户。

### 步骤2：在Eo Pages创建项目

登录EdgeOne控制台，进入Eo Pages，点击"创建项目"，然后选择"导入Git仓库"。

::pic
---
src: https://i.p-i.vip/135/20251228-6950a2e154182.png
caption: Eo Pages创建项目示例
---
::

### 步骤3：选择加速区域

根据你的域名情况选择合适的加速区域：

| 是否ICP备案 | 服务区域 | 加速区域选择 |
| :--- | :--- | :--- |
| 已备案 | 中国大陆 | 中国大陆可用区 |
| 已备案 | 全球 | 全球可用区（含中国大陆） |
| 未备案 | 全球 | 全球可用区（不含中国大陆）|

### 步骤4：部署项目

在生产分支选择'main'，然后点击"开始部署"按钮，等待部署完成。

::alert{type="warning"}
**注意**：由于平台更新，当前部署可能会失败。请等待项目维护者更新后再尝试。
::
## 使用教程

部署完成后，可以通过以下路径访问随机图片API：

| 返回内容 | 访问路径 |
| :--- | :--- |
| 双端自适应 | /get |
| 电脑端图片 | /pc |
| 移动端图片 | /pe |

## 注意事项

1. **图片存储位置**：
   - 电脑端图片存储在`acg_pc`目录
   - 移动端图片存储在`acg_m`目录

2. **图片命名规则**：
   - 默认图片名称格式为`pic_xxxx`（如pic_0001.png）
   - 图片格式需为png

3. **图片数量调整**：
   - 新增或减少图片时，需要调整`get.js`、`pc.js`和`pe.js`文件中的`maxImages`值
   - 否则可能会出现图片不存在或无法随机到的问题

## 项目信息

- **项目名称**：随机ACG图片API
- **维护者**：筱序二十
- **GitHub仓库**：[https://github.com/scfcn/acgapi/](https://github.com/scfcn/acgapi/)


![GitHub Stars](https://img.shields.io/github/stars/scfcn/acgapi)
![GitHub License](https://img.shields.io/github/license/scfcn/acgapis)

## 后续维护

::alert{type="info"}
**重要提示**：
- 当前方法暂时无法使用，项目维护者正在进行更新修复
- 请关注GitHub仓库获取最新维护信息
- 有任何问题可以在GitHub仓库提交Issue
::

感谢大家的理解与支持！
