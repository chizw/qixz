---
title: 解决Twikoo获取QQ昵称失败：修改twikoo.min.js配置指南
date: 2026-02-23 12:00:00
type: tech
categories: [技术干货]
tags: [Twikoo, 教程]
description: 本文介绍如何通过修改twikoo.min.js文件来解决无法获取QQ昵称的问题，帮你快速恢复评论系统的正常使用。
image: https://s3.qixz.cn/ywty/2026/04/26/69edf07974ac7.webp
---

# 解决Twikoo获取QQ昵称失败

::alert{type="warning"}
在使用Twikoo作为博客评论系统时，发现评论只显示QQ号而非昵称，查询官方issue后发现原来的API接口已失效。
::

## 问题原因

Twikoo使用QQ号码获取用户昵称时，需要调用青桔大佬的API接口。然而，由于站点变动，旧的API接口已失效，导致评论时只能显示QQ号码而非昵称。

## 解决方案

修改`twikoo.min.js`文件，修改API接口和相关JSON解析代码来解决昵称获取问题。

### 步骤一：定位配置文件

::tip[推荐使用 jsdmirror CDN 节点在国内访问较快]{tip="国内推荐 jsdmirror 或 xnet.ren"}

找到官方的`twikoo.min.js`文件，这里给出几个URL：

::copy{prompt="CDN URL 示例" code="https://cdn.xnet.ren/npm/twikoo@1.6.44/dist/twikoo.min.js"}

::copy{prompt="CDN URL 示例" code="https://cdn.jsdmirror.com/npm/twikoo@1.6.44/dist/twikoo.min.js"}

::copy{prompt="CDN URL 示例" code="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js"}

### 步骤二：修改代码

打开配置文件，修改以下代码：

::folding{title="点击查看需要修改的代码"}
```javascript
getQQNick: function(e) {
  var t = this
  , n = "https://api.qjqq.cn/api/qqinfo?qq=".concat(e)
  , r = new XMLHttpRequest;
  r.onreadystatechange = function() {
    if (4 === r.readyState && 200 === r.status) {
      var e = JSON.parse(r.responseText);
      t.metaData.nick = e.name,
      t.updateMeta()
    }
  }
  ,
  r.open("GET", n),
  r.send()
}
```
::

其中需要修改两处：

1. API地址替换为 :tip[需要前往 青桔API 注册获取key]{tip="https://api.nsuuu.com/ 注册后获取免费key"}

   - `https://api.qjqq.cn/api/qqinfo?qq=` → `https://v1.nsuuu.com/api/qqname?key=你的key&qq=`

2. JSON解析路径

   - `e.name` → `e.data.nick`

::link-card
---
title: 修改后的 twwikoo.min.js (不含key)
icon: https://github.com/favicon.ico
link: https://gist.github.com/scfcn/b9de4cc9affcd47fdc30461e849a1992
description: GitHub Gist 公开代码，点击查看完整代码
---
::

### 步骤三：验证效果

修改完成后，引入修改后的`twikoo.min.js`文件，重新部署你的博客，刷新缓存，输入QQ号，回车后查看昵称是否正常显示。

## 常见问题

::folding{title="Q1：修改后仍然无法获取昵称"}
请检查：
1. 文件格式是否正确（确保是有效的JSON）
2. API KEY是否正确
3. 网络连接是否正常
::

::folding{title="Q2：如何自定义API接口"}
如果你有自己的QQ昵称获取接口，可以修改`api`参数为你自己的接口地址。
::

## 总结

通过修改`twikoo.min.js`文件，将API接口替换为青桔API，即可解决无法获取QQ昵称的问题。同时，也提醒用户在使用自定义API接口时，要确保接口的稳定性和可用性。

希望这篇文章能帮助你快速恢复评论系统的正常使用。

## 每日一图
::pic
---
src: https://s3.qixz.cn/ywty/2026/04/26/69edefddccb59.webp
caption: 李诗雅
---
::

::quote
#icon
💬
#default
李诗雅我老婆，美得不可方物，每天只想盯着她看一万遍。
::
