---
title: GitHub Actions 实现雨云自动签到
date: 2025-10-06 12:33:00
type: tech
categories: [技术干货]
tags: [GitHub, 雨云自动签到, Python]
description: 利用GitHub Actions实现雨云自动签到，通过配置Secrets和启用工作流，实现定时运行Python脚本完成登录、验证码识别和签到，每日UTC+8 12点自动执行，失败会重试。
recommend: 20
image: https://s3.qixz.cn/ywty/2026/04/26/69edf5930eab0.webp
---

## 1. 项目背景

国庆放假期间，我在各大技术交流群中发现了一个[雨云自动签到项目](https://github.com/SerendipityR-2022/Rainyun-Qiandao)，该项目可以实现雨云平台的自动签到功能，无需手动操作即可获取每日签到奖励。

::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf6467f577.png
caption: 项目截图
---
::

## 2. 技术改进

### 2.1 改进思路
原项目需要部署到服务器，存在环境配置复杂、内存占用高等问题。我注意到项目使用Python脚本开发，因此想到利用**GitHub Actions**来定时执行脚本，这样既无需维护服务器，又能实现自动化签到功能。

### 2.2 开发过程
1. **项目重构**：将项目克隆到本地，删除依赖Java的旧版本
2. **版本兼容修复**：发现Chrome浏览器与ChromeDriver版本不兼容，从[Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/)下载141版本进行替换
3. **功能验证**：修复版本问题后，成功实现浏览器自动打开、登录、验证码识别和签到功能
4. **GitHub Actions配置**：借助AI生成Workflows模板，经过多次调试和修复，最终实现了GitHub Actions自动运行

## 3. 使用教程

### 3.1 步骤1：Fork项目仓库

首先，访问我的[Rainyun-Qiandao仓库](https://github.com/scfcn/Rainyun-Qiandao/)，点击右上角的"Fork"按钮将项目Fork到你的GitHub账户，可以为Fork的仓库取一个好听的名字。

::alert{type="info"}
如果觉得这个项目有用，不妨给我点个Star⭐，这是对我最大的鼓励！
::

::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf65a6899b.png
caption: Fork仓库示例
---
::

### 3.2 步骤2：配置登录信息

为了保护你的账户安全，我们需要在GitHub Secrets中配置登录信息，这样即使仓库是公开的，也不会泄露你的密码：

::alert{type="warning"}
请务必使用GitHub Secrets存储敏感信息，不要在代码中明文显示你的账户密码！
::

1. 进入你Fork的仓库页面
2. 点击右上角的`Settings`
3. 在左侧导航栏中选择`Secrets and variables` → `Actions`
4. 点击右上角的`New repository secret`
5. 创建两个秘密：
   - `RAINYUN_USER`：你的雨云账户用户名
   - `RAINYUN_PASS`：你的雨云账户密码

::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf6506ffbd.png
caption: 配置Secrets示例
---
::

::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf63c2546b.pngg
caption: 创建Secret示例
---
::

### 3.3 步骤3：启用GitHub Actions工作流

1. 转到仓库的`Actions`页面
2. 点击`I understand my workflows, go ahead and enable them`按钮启用工作流
3. 在左侧工作流列表中选择`Rainyun 自动签到`
4. 点击右侧的`Run workflow`按钮，选择`Run workflow`来手动触发第一次运行

::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf630c1e82.png
caption: 启用工作流示例1
---
::
::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf631009c8.png
caption: 启用工作流示例2
---
::
::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf631b5e0d.png
caption: 启用工作流示例3
---
::

### 3.4 步骤4：验证签到结果

当工作流运行完成后，如果出现以下字样，表示签到成功：

::alert{type="success"}
恭喜！签到成功！<span style="color: red;">Congratulations</span>
::

::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf630a0d79.png
caption: 签到成功示例
---
::

## 4. 注意事项

### 4.1 运行机制
- **运行时间**：工作流运行时间可能较长，因为需要启动浏览器并进行验证码识别
- **验证码识别**：验证码识别成功率约为48.3%，如果失败会自动重试
- **自动运行时间**：每日自动运行时间为UTC+8的12点，可能会有30分钟左右的偏差，这是正常现象

### 4.2 常见问题
- **运行失败**：如果工作流运行失败，可以查看运行日志排查问题，常见原因包括账户信息错误、验证码识别多次失败等
- **手动触发**：除了自动运行外，你也可以随时手动触发工作流运行
- **修改运行时间**：可以在`.github/workflows/rainyun-qiandao.yml`文件中修改`schedule`字段来调整自动运行时间

## 5. 鸣谢

感谢以下个人和平台对本项目的支持（排名不分先后）：

- **原项目作者**：[SerendipityR-2022](https://github.com/SerendipityR-2022/Rainyun-Qiandao)，提供了项目的基础架构
- **GitHub Actions**：提供了免费的定时运行平台
- **Trae CN**：[https://www.trae.cn/](https://www.trae.cn/)，提供程序修改支持

## 6. 附加内容

### 6.1 每日一图（来自哲风）

::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edf5930eab0.webp
caption: 中秋快乐
---
::

::quote
中Cia快llo～(∠・ω< )⌒☆
::
