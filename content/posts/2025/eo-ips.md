---
title: EO官方IP段API使用教程
date: 2025-07-21 10:12:00
type: tech
categories: [技术干货]
recommend: 11
updated: 2026-01-02 12:00:00
tags: [EdgeOne, 教程]
description: EdgeOne 提供官方 API `https://api.edgeone.ai/ips` 获取全球回源节点 IP 段，支持 IPv4/IPv6，可通过参数筛选版本和区域。用户可通过 curl 获取并保存，用于防火墙白名单配置，建议自动化更新以应对动态调整的 IP。注意关闭源站防护功能，确保 IP 格式正确。
image: https://s3.qixz.cn/ywty/2026/06/20/img_eo-ips.svg
---

## EdgeOne 官方 IP 段 API 使用教程：轻松获取回源节点 IP

EdgeOne 作为腾讯云推出的边缘安全加速平台，提供了全球分布的回源节点网络。为了确保源站安全，我们通常需要将这些回源节点的 IP 地址加入防火墙白名单。本文将详细介绍如何通过 EdgeOne 官方 API 获取这些 IP 段，并分享一些实用技巧。

## 一、API 基本介绍

EdgeOne 提供了简单的 HTTP API 来获取其全球回源节点 IP 列表：

- **API 地址**: `https://api.edgeone.ai/ips`
- **响应格式**: UTF-8 编码的纯文本，每行一个 IP 段
- **支持协议**: 同时包含 IPv4 和 IPv6 地址

## 二、基础使用方法

### 1. 获取全部 IP 段

只需通过浏览器或命令行工具访问 API 地址即可：

```bash
curl https://api.edgeone.ai/ips
```

响应示例：
```
203.107.1.1/24
2408:4000::/32
...
```

### 2. 命令行获取并保存到文件

```bash
curl -s https://api.edgeone.ai/ips > edgeone_ips.txt
```

## 三、高级筛选功能

API 支持通过查询参数筛选特定类型的 IP 地址：

### 1. 按 IP 版本筛选

| 参数     | 值  | 说明                     |
|----------|-----|--------------------------|
| version  | v4  | 仅获取 IPv4 地址         |
| version  | v6  | 仅获取 IPv6 地址         |

示例（获取所有 IPv6 地址）：
```bash
curl "https://api.edgeone.ai/ips?version=v6"
```

### 2. 按区域筛选

| 参数     | 值              | 说明                           |
|----------|-----------------|--------------------------------|
| area     | mainland-china  | 仅获取中国大陆区域的 IP        |
| area     | overseas        | 获取非中国大陆区域的 IP        |
| area     | global          | 获取全球所有区域的 IP（默认）  |

示例（获取中国大陆区域的 IPv4 地址）：
```bash
curl "https://api.edgeone.ai/ips?version=v4&area=mainland-china"
```

## 四、自动化更新建议

由于 EdgeOne 的回源节点 IP 会动态调整，建议：

1. **每小时检查更新**：设置定时任务每小时获取一次最新 IP 列表
2. **自动更新防火墙规则**：将获取的 IP 自动同步到源站防火墙
3. **变更检测**：比较新旧 IP 列表，只更新有变化的部分

示例 cron 任务（每小时执行一次）：
```bash
0 * * * * /usr/bin/curl -s https://api.edgeone.ai/ips > /etc/edgeone_ips.txt && systemctl reload firewall
```

## 五、注意事项

1. **与源站防护功能互斥**：使用此 API 前，请确保已关闭 EdgeOne 的源站防护功能
2. **IP 段格式**：返回结果为 CIDR 格式，确保防火墙支持此类格式
3. **服务区域匹配**：建议根据站点服务区域选择对应区域的 IP（如仅服务中国大陆用户，只需获取 mainland-china 区域的 IP）

## 六、实际应用案例

### 1. Nginx 白名单配置

获取 IP 列表后，可以更新 Nginx 配置：

```nginx
allow 203.107.1.1/24;
allow 2408:4000::/32;
deny all;
```

### 2. iptables 防火墙规则

```bash
# 清空旧规则
iptables -F EDGEONE_WHITELIST

# 添加新规则
while read -r ip; do
    iptables -A EDGEONE_WHITELIST -s "$ip" -j ACCEPT
done < edgeone_ips.txt
```

## 七、常见问题

**Q：为什么需要定期更新 IP 列表？**

A：EdgeOne 会根据网络状况和节点部署情况动态调整回源节点，IP 地址会相应变化。不及时更新可能导致回源失败。

**Q：如何验证 API 返回的 IP 是否有效？**

A：可以通过 `ping` 或 `traceroute` 测试这些 IP 的可达性，确认它们确实属于 EdgeOne 网络。

**Q：是否可以使用 DNS 查询替代 API？**

A：不建议。API 提供的是权威的、最新的 IP 列表，而 DNS 查询可能不完整或滞后。
