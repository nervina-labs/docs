---
title: Aggregator 快速部署
label: CoTA
---

## 快速部署

Aggregator 依赖 `ckb-node / cota-nft-entries-syncer / ckb-indexer`，所以需要先部署这些服务

>  ckb-node / cota-nft-entries-syncer / ckb-indexer 需要区块同步到最新高度才能保证数据是完整准确的，区块同步需要一定的时间，根据计算机配置不同，时间在大概在10个小时以内

### ckb-node

1. 启动 ckb node，参考 [Run a CKB Testnet Node](https://docs.nervos.org/docs/basics/guides/testnet) 和 [Run a CKB Mainnet Node](https://docs.nervos.org/docs/basics/guides/mainnet)

> ckb-node 默认的访问地址为：http://localhost:8114

### cota-nft-entries-syncer

1. 创建 MySQL 数据库，名称推荐 `cota_entries`
2. 创建 `check_infos` 表
  ```
  USE cota_entries;
  CREATE TABLE IF NOT EXISTS check_infos (
      id bigint NOT NULL AUTO_INCREMENT,
      check_type tinyint unsigned NOT NULL,
      block_number bigint unsigned NOT NULL,
      block_hash char(64) NOT NULL,
      created_at datetime(6) NOT NULL,
      updated_at datetime(6) NOT NULL,
      PRIMARY KEY (id),
      KEY index_check_infos_on_block_number (block_number)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ```
3. 指定同步的起始高度（从 CoTA 合约部署的区块高度开始，减少不必要的区块同步，缩短同步时间）
  - Testnet
    ```
    insert into check_infos (check_type, block_number, block_hash, created_at, updated_at) values (0, 4163980, 'ab6d9453628ee854062615acf05f899e8c84e4e61d417d0b13bbed128a862e23', now(), now());
    insert into check_infos (check_type, block_number, block_hash, created_at, updated_at) values (1, 4163980, 'ab6d9453628ee854062615acf05f899e8c84e4e61d417d0b13bbed128a862e23', now(), now());
    ```
  - Mainnet
    ```
    insert into check_infos (check_type, block_number, block_hash, created_at, updated_at) values (0, 6726760, 'ae0c5cf348cf8414c779eba137e4034d80b9c791a4806ee47bc7a4cc016613df', now(), now());
    insert into check_infos (check_type, block_number, block_hash, created_at, updated_at) values (1, 6726760, 'ae0c5cf348cf8414c779eba137e4034d80b9c791a4806ee47bc7a4cc016613df', now(), now());
    ```
4. Clone [cota-nft-entries-syncer](https://github.com/nervina-labs/cota-nft-entries-syncer) 代码，更新 `configs/config.yaml` 文件，填入 MySQL 数据库访问地址等信息，其中 `mode = wild` 为快速同步数据，`mode = normal` 为每隔一秒定时同步数据
5. 进到 `cota-nft-entries-syncer` 根目录，执行 `make && bin/syncer` 部署

> 如果你熟悉 Docker，也可以使用 Docker 部署 cota-nft-entries-syncer，详情参考 Dockerfile

### ckb-indexer

1. 下载 ckb-indexer [release](https://github.com/nervosnetwork/ckb-indexer/releases) 包
2. 执行 `RUST_LOG=info ./ckb-indexer -s /tmp/ckb-indexer-test`

> ckb-indexer 默认的访问地址为：http://localhost:8116

### cota-registry-aggregator && cota-aggregator

1. 下载 cota-registry-aggregator [release](https://github.com/nervina-labs/cota-registry-aggregator/releases) 包，执行
```
RUST_LOG=info DATABASE_URL=mysql://root:password@localhost:3306/cota_entries CKB_INDEXER=http://localhost:8116 ./cota-registry-aggregator
```

> cota-registry-aggregator 默认的访问地址为：http://localhost:3050

2. 下载 cota-aggregator [release](https://github.com/nervina-labs/cota-aggregator/releases) 包，执行
```
RUST_LOG=info DATABASE_URL=mysql://root:password@localhost:3306/cota_entries CKB_INDEXER=http://localhost:8116 ./cota-aggregator
```

> cota-aggregator 默认的访问地址为：http://localhost:3030

> 如果你熟悉 Docker，也可以使用 Docker 部署 Aggregator，详情参考 Dockerfile