---
title: 关于 CoTA 你需要知道的
label: CoTA Intro
---

## 什么是 CoTA

CoTA 全称 Compact Token Aggregator Standard，基于 Nervos CKB Cell 模型设计的 Token 管理协议。简单来说，CoTA 就是给每个用户维护一颗专属的默克尔树（SMT），树上的叶子节点代表了 NFT 资产的数据和状态，NFT 的转让和信息更新只是叶子节点数据的更新，并不触发 Cell 所有权的变更，有点像每个用户都有一个微型的账本，记账的过程就是叶子节点更新的过程。

CoTA Cell 维护的微型账本类似于以太坊的账户模型，但是所不同的是 CoTA Cell 本身的所有权由用户的 lock 决定，关于 NFT 的任何操作都必须由用户签名解锁 lock 才能进行，而且用户可以同时给多个不同的用户转让多个不同的 NFT。

那么 CoTA Cell 是如何管理用户的 NFT 资产呢？就是上面提到的默克尔树（SMT），SMT 是常用默克尔树的变种，也称稀疏默克尔树，它的特点是可以验证某个叶子是否在树上，也可以验证某个叶子是否不在树上。用户的 NFT 信息存储在 SMT 的叶子节点中，用户 A 要给用户 B 转让 NFT 时，需要在 A 的树上删掉代表该 NFT 的叶子节点数据，同时需要在 B 的树上增加代表该 NFT 的叶子节点数据，那么这里就需要两步操作，一步操作是用户 A 先提交一个转出 NFT 的证明（Withdraw），另一步操作是用户 B 提交一个将 NFT 收下的证明（Claim）。

这里出现了一个新的名词，为什么是提交证明呢？简单来说，要验证某个叶子节点数据是否在或者不在默克尔树上，需要给出一个密码学证明，任何人都可以通过这个证明、要验证的叶子节点数据和根哈希三者来验证，这个验证可以发生在链上（智能合约），也可以发生在链下。

至此，我们可以简单描述一下一个 NFT 的转让过程了，首先发送方需要提交一个交易，该交易包含了删掉（发送给别人）某个 NFT 叶子后的默克尔树根哈希、密码学证明以及该 NFT 的相关信息（包含接收者地址），当这笔交易上链后，那么发送者就不再拥有这个 NFT 了。此时接收方只是知道了发送方给他转让了一个 NFT，但是这个 NFT 还没有在他自己的默克尔树上，那么他就还需要提交一个交易，该交易包含了拥有这个 NFT 叶子后的默克尔树根哈希、密码学证明以及该 NFT 的相关信息，同时他还需要给出发送方删掉这个 NFT 的密码学证明，也就是在这个交易中智能合约既要验证接收方有权收下一个 NFT，也要验证发送方确实给接收方转让了这个 NFT。所以整个过程是需要两步：发送方先转出，接收方再收下。

明白了 NFT 的转让过程，我们再来简单描述一下 NFT 的铸造和分发过程，首先发行方需要先定义一个系列（collection）的 NFT 的信息，比如 NFT 的名称、描述、多媒体链接地址等等，然后发行方就可以按照 id （用于表示 NFT 唯一性的 ID）递增的方式依次给其他人分发 NFT 了，分发的过程本质上就是 withdraw 的过程，只不过发行是可以凭空造出来 NFT，然后 withdraw 给别人，而 NFT 的转让则需要发送方要先拥有这个 NFT 才行。

如果每次 NFT 转让都必须先收下然后再转出，确实显得麻烦，为此 CoTA 在智能合约层面支持收下和转出在一步完成，简单说就是用户 A 给用户 B 转让了一个 NFT，也就是用户 A 提交了 withdraw 交易，如果此时用户 B 想把这个 NFT 转给用户 C，那么他可以选择先 claim 这个 NFT，然后再 withdraw 这个 NFT 给用户 C，当然他也可以直接 transfer 这个 NFT 给用户 C，这里的 transfer 其实就是把 claim 和 withdraw 合并为一个操作了。

## 为什么 CoTA Cell 需要注册

上面简单描述了 NFT 的转让和铸造发行过程，这其中还有一个很重要的问题没有提及，就是发送者在给接收者转让 NFT 的时候，指定的是接收者的地址，那么如果接收者用这个地址连续多次收下这个 NFT 的话，就意味着出现了双花，因此我们需要保证每一个接收方都必须有且只有一个 CoTA Cell，也就是说一个地址可以有多个 Cell，但是只能有一个 CoTA Cell，他在接收 NFT 时只能用这个 CoTA Cell，那么如何保证一个地址只能有唯一的 CoTA Cell 呢？

道理其实也很简单，就是用一个链上全局状态表记录下每个地址是否注册过 CoTA Cell，如果没有注册，那么不允许他铸造发行和转让 NFT，如果注册了，那么就不允许再次注册，而链上全局状态表也是一个默克尔树，每一个注册过的地址都会有一个叶子节点跟它一一对应，利用上面提到的存在和不存在证明，就可以保证每个地址只有一个 CoTA Cell。

## 为什么需要链外的 Aggregator 服务

上面提到了每一次发交易都需要提交密码学证明、根哈希以及叶子节点数据，为了尽量减少链上空间的占用，只会将最新的根哈希放置到 Live Cell 的 data 字段中，而密码学证明和叶子节点数据都在 Witness （类似比特币，Witness 最开始是放置签名数据，本身不占用交易大小，现在相当于扩展了 Witness 的用途）中，既然链上 Cell data 中只有根哈希，那么就需要一个链外的服务不停地回溯历史交易，从 Witness 中解析并保存过往所有的叶子节点数据，当需要某个叶子数据的验证证明时，就可以根据整棵树的叶子节点来生成。换句话说就是需要一个链外的服务保存最新完整的默克尔树，在每次用户发交易的时候，帮他生成密码学证明，以便合约验证交易的合法性。

Aggregator 就是这样的服务，同样的注册过程也是更新和验证默克尔树的过程，所以也需要一个 aggregator，因此就是有两个 aggregator 服务，一个服务于注册流程（registry-cota-aggregator），一个服务于 NFT 的铸造分发和转让（cota-aggregator）。

## 如何获取 NFT 信息

对于一个发行方来说，他可能希望能看到所有的发行记录，而对于持有人来说，他可能希望看到他所拥有的 NFT，不管这个 NFT 是否已收下（claim）等等，为了满足这部分需求，aggregator 除了帮助交易构造者生成密码学证明，还提供了更多的数据查询 RPC，例如根据地址查询所拥有的 NFT 等，更多的 RPC 详情请参考 [Aggregator RPC APIs](https://github.com/nervina-labs/cota-aggregator#apis)

## 如何快速上手 CoTA NFT 开发

### 合约部署信息

目前 CoTA 合约已经部署到测试网和主网，可以参考具体的[部署信息](https://developer.mibao.net/docs/develop/cota/deployment)，如果你对智能合约规则和原理感兴趣，也可以参考 [CoTA 合约规则](https://developer.mibao.net/docs/develop/cota/script-rule)

### Aggregator

目前支持注册和 NFT 铸造分发转让的 Aggregator 都已经发布上线，我们提供了公共的 RPC 服务供开发者调试和测试，详细的 RPC 地址可以参考 [Aggregator public url](https://github.com/nervina-labs/cota-sdk-js#public-aggregator-rpc-url-as-blow-can-be-used-to-develop-and-test)，对于正式运行在主网环境的 Aggregator，我们强烈建议开发者自行部署一套，部署方式可以参考 [cota-aggregator](https://github.com/nervina-labs/cota-aggregator#quick-start) 和 [registry-cota-aggregator](https://github.com/nervina-labs/cota-registry-aggregator#quick-start)。

### SDK

目前我们提供 JS SDK 供开发者用来实现与链相关的所有交互，包括注册 CoTA Cell 和铸造分发转让以及更新 NFT 等操作，SDK 依赖 Aggregator 服务，在开发和测试阶段可以使用公共 RPC 服务，对于主网环境，我们强烈建议自行部署一套。对于 CoTA NFT 相关的所有操作 SDK 都提供了相应的 [example](https://github.com/nervina-labs/cota-sdk-js/tree/develop/example) 供开发者参考。

### CKB 相关的知识

由于 CoTA 是基于 Nervos CKB 开发的 NFT 协议，所以对于开发者来说还需要稍微熟悉一下 CKB 的基础知识，详细参考 [CKB Docs](https://docs.nervos.org/)
