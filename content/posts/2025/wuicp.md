---
title: 雾都虚拟备案系统：免费开源的自动巡查与邮件提醒备案工具
date: 2025-07-14 20:49:00
updated: 2026-01-02 12:00:00
type: tech
categories: [技术干货]
tags: [雾都虚拟备案, 源码, 免费]
description: 雾都虚拟备案系统提供自动巡查、邮件提醒、中文域名支持等功能，支持PHP 8.1、MySQL 5.6及以上版本，部署简单。系统有Lanzou和GitHub版本，欢迎Star支持。
image: https://ywtypic.wuxit.cn/pic/2025/10/12/68eaf5354d4b8.png
---

{cloud title="雾都虚拟备案" type="lanzou" url="https://scfc.lanzout.com/ipj47311kazg" password=""/}
{cloud title="雾都虚拟备案" type="github" url="https://github.com/scfcn/wuicp" password=""/}

## 二开版本效果展示
::pic
---
src: https://ywtypic.wuxit.cn/pic/2025/10/12/68eaf5354d4b8.png
caption: 雾都虚拟备案系统首页
---
::
::pic
---
src: https://ywtypic.wuxit.cn/pic/2025/10/12/68eaf534c6db0.png
caption: 个人备案页面
---
::
::pic
---
src: https://ywtypic.wuxit.cn/pic/2025/10/12/68eaf535a1765.png
caption: 企业备案页面
---
::
::pic
---
src: https://ywtypic.wuxit.cn/pic/2025/10/12/68eaf52c370a0.png
caption: 后台管理页面
---
::

二开会不定期维护更新，加入交流Q群：[站长交流群](https://qm.qq.com/q/itnrafWpXi)

## 项目特点
### 新增功能
- 自动巡查
- 邮件提醒
- 兼容中文域名
- 后台美化
- 完善若干逻辑问题
### 新功能使用教程
#### 自动巡查
- 会在第一次申请时进行巡查，如果通过，会自动发送邮件提醒，并加入后续巡查队列
- 添加计划任务
::pic
---
src: https://ywtypic.wuxit.cn/pic/2025/10/12/68eaf52e4a687.png
caption: 自动巡查
---
::
#### 邮件提醒
- 自动发送提醒邮件至未通过审核的站长预留邮箱
- 添加计划任务
::pic
---
src: https://ywtypic.wuxit.cn/pic/2025/10/12/68eaf5304e168.png
caption: 邮件提醒
---
::

### 站点配置
::quote{icon="ph:warning-circle-duotone"}
请勿开启redis，有未知bug
::
- 数据库和邮箱配置
- 在config.php中修改
::pic
---
src: https://ywtypic.wuxit.cn/pic/2025/10/12/68eaf53316044.png
caption: config.php配置文件示例
---
::

## 点个Star!!!
如果觉得项目不错，别忘了点个免费的Star支持一下，你们的鼓励是我们最大的动力！！！ ⭐️

### 环境支持
- PHP >= 8.1
- MySQL >= 5.6
- Nginx 或 Apache
- Linux 或 Windows 服务器

### 部署方式
1. 下载源码
2. 访问http(s)://domain或ip/install.php安装
