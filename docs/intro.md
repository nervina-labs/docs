---
sidebar_position: 1
---

# 概述

## 1. 准备工作

### 1.1 注册

在使用 open API 前，首先需要在金色传说（主网环境：[https://v.mibao.net/](https://v.mibao.net) ，测试网环境：[https://staging.nervina.c](https://staging.nervina.cn)[n](https://staging.nervina.cn) ）上进行注册，该帐号将会成为通过 open API 设计和发行秘宝的创作者，相关数据可以通过在金色传说平台登录该帐号进行查看。

- 测试环境请求地址为：[https://goldenlegend.staging.nervina.cn/api/v1/](https://goldenlegend.staging.nervina.cn/api/v1/)
- 正式环境请求地址为：[https://goldenlegend.nervina.cn/api/v1/](https://goldenlegend.nervina.cn/api/v1/)

- 创作者平台正式环境：[https://v.mibao.net/](https://v.mibao.net)

- 创作者平台测试环境：[https://staging.nervina.cn](https://staging.nervina.cn)

- 秘宝账户正式环境：[https://mibao.net/explore](https://mibao.net/explore)

- 秘宝账户测试环境：[https://wallet.staging.nervina.cn](https://wallet.staging.nervina.cn)

### 1.2 设置公开信息

完成注册后，必须首先设置创作者（issuer）公开信息才可以进行后续操作。这里设置的公开信息会在链上公开存储，上链操作由金色传说平台自动完成，设计和发行秘宝均置后于该步骤，因此注册后必须执行此操作。

### 1.3 申请 open API 的 key 和 secret

open API 的鉴权需要响应的 key-secret，在完成上述两步操作之后，可以发送邮件到 biz@nervina.io 进行申请，内容必须包含要申请 key-secret 的帐号的注册邮箱。

### 1.4 能量点充值

在金色传说平台设计和分发秘宝都需要消耗能量点（设计秘宝消耗 1 能量点；每分发一个秘宝消耗 1 能量点）；在进行创作和发行前需要进行能量点充值。

完成上述操作后，即可通过 open API 在金色传说平台进行操作。


