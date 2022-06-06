---
title: Aggregator Quick Deployment
label: CoTA
---

## Prerequisites

- Ubuntu >= 18.04
- MYSQL >= 8.0

## Dependencies

The aggregators depend on `ckb-node / cota-nft-entries-syncer / ckb-indexer`，so you must deploy these services firstly.

> ckb-node / cota-nft-entries-syncer / ckb-indexer need some time to synchronize the latest block data, please make sure the synchronization is complete before doing the other things.

### ckb-node

1. [Run a CKB Testnet Node](https://docs.nervos.org/docs/basics/guides/testnet) and [Run a CKB Mainnet Node](https://docs.nervos.org/docs/basics/guides/mainnet)

> ckb-node default url：http://localhost:8114

### cota-nft-entries-syncer

1. Create MySQL database whose name is `cota_entries`
2. Create `check_infos` table

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

3. Set a specific block number to synchronize which can help you reduce synchronization time

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

4. Clone [cota-nft-entries-syncer](https://github.com/nervina-labs/cota-nft-entries-syncer) and update `configs/config.yaml` to type the mysql url and other information.
   > `mode = wild`: quick synchronization as soon as possible，`mode = normal`: synchronization at regular intervals
5. Goto `cota-nft-entries-syncer` root directory and run `make && bin/syncer`

> If you are familiar with docker, we recommend deploying with docker, please refer to Dockerfile for details

### ckb-indexer

1. Download ckb-indexer [release](https://github.com/nervosnetwork/ckb-indexer/releases) binary
2. Run `RUST_LOG=info ./ckb-indexer -s /tmp/ckb-indexer-test`

> ckb-indexer default url：http://localhost:8116

### cota-registry-aggregator && cota-aggregator

<span style={{color: 'red', fontWeight: 'bold', fontSize: '17px'}}> ！！Please DO NOT deploy cota-aggregator and cota-registry-aggregator in one directory ！！</span>

We recommend deploying the two aggregators with docker, please refer to Dockerfile for details

Take the [cota-aggregator](https://github.com/nervina-labs/cota-aggregator) as an example:

Update Dockerfile [ENV](https://github.com/nervina-labs/cota-aggregator/blob/develop/Dockerfile#L30-L36)

```
# log level
ENV RUST_LOG info

# mysql database url
ENV DATABASE_URL mysql://root:password@localhost:3306/db_name

# maximum number of pool connections of mysql
ENV MAX_POOL 20

# cota-aggregator thread numbers
ENV THREADS 3

# ckb-indexer url
ENV CKB_INDEXER http://localhost:8116

# false for Testnet and true for Mainnet
ENV IS_MAINNET false

# Sentry monitor DSN (Can be ignored if not needed)
ENV SENTRY_DSN https://key@sentry.io/1234
```

```
# Build cota-aggregator images from the Dockerfile and run cota-aggregator via docker
docker build -t cota-aggregator .
docker run -d -p 3030:3030 -v "$(pwd)":/app/store.db cota-aggregator:latest
```

> cota-aggregator default url：http://localhost:3030

> cota-registry-aggregator default url：http://localhost:3050
