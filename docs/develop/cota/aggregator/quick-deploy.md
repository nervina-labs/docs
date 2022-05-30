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
    insert into check_infos (check_type, block_number, block_hash, created_at, updated_at) values (0, 6558909, '6ad3c5479c343a2a160332b6dd3d502f2a8eab7f6fd69fc4c20b52bb99ff3dfa', now(), now());
    insert into check_infos (check_type, block_number, block_hash, created_at, updated_at) values (1, 6558909, '6ad3c5479c343a2a160332b6dd3d502f2a8eab7f6fd69fc4c20b52bb99ff3dfa', now(), now());
    ```
4. Clone [cota-nft-entries-syncer](https://github.com/nervina-labs/cota-nft-entries-syncer) 代码，更新 `configs/config.yaml` 文件，填入 MySQL 数据库访问地址等信息，其中 `mode = wild` 为快速同步数据，`mode = normal` 为每隔一秒定时同步数据
5. 进到 `cota-nft-entries-syncer` 根目录，执行 `make && bin/syncer` 部署

> 如果你熟悉 Docker，也可以使用 Docker 部署 cota-nft-entries-syncer，详情参考 Dockerfile

### ckb-indexer

1. 下载 ckb-indexer [release](https://github.com/nervosnetwork/ckb-indexer/releases) 包
2. 执行 `RUST_LOG=info ./ckb-indexer -s /tmp/ckb-indexer-test`

> ckb-indexer 默认的访问地址为：http://localhost:8116

### cota-registry-aggregator && cota-aggregator

<span style={{color: 'red', fontWeight: 'bold', fontSize: '17px'}}> ！！请不要将 cota-aggregator 和 cota-registry-aggregator 部署到同一个目录下，否则两者的 rocks db 文件会冲突！！</span>

建议这两个 aggregator 采用 Docker 部署，Dockerfile 分别见相应的项目根目录

以 [cota-aggregator](https://github.com/nervina-labs/cota-aggregator) 为例： 

配置 Dockerfile 中的 [ENV](https://github.com/nervina-labs/cota-aggregator/blob/develop/Dockerfile#L30-L36)

```
# 日志级别
ENV RUST_LOG info

# mysql 数据库访问 url
ENV DATABASE_URL mysql://root:password@localhost:3306/db_name

# mysql 线程池最大连接数
ENV MAX_POOL 20

# cota-aggregator 线程数量
ENV THREADS 3

# ckb-indexer 访问 url
ENV CKB_INDEXER http://localhost:8116

# 是否是主网，false 表示 Testnet，true 表示 Mainnet
ENV IS_MAINNET false

# Sentry 监控地址，如果不需要可以忽略
ENV SENTRY_DSN https://key@sentry.io/1234
```

```
# Build cota-aggregator images from the Dockerfile and run cota-aggregator via docker
docker build -t cota-aggregator .
docker run -d -p 3030:3030 -v "$(pwd)":/app/store.db cota-aggregator:latest
```

> cota-aggregator 默认的访问地址为：http://localhost:3030

> cota-registry-aggregator 默认的访问地址为：http://localhost:3050
