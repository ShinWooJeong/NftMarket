### Step-01 환경

```
node 12.*
node 14.*
node 16.*
```

### Step-02 Local 에서 띄울때 MariaDB, Redis 설치하기

```
docker pull redis
docker pull mariadb

docker run --name local -d -p 6379:6379 redis --requirepass "PWD"
docker run --name global -d -p 6380:6379 redis --requirepass "PWD"
docker run --name global -d -p 6380:6379 redis
docker run --name mariadb -e MYSQL_ROOT_PASSWORD=password -d -p 3306:3306 mariadb
```

### Step-03 Local DB 계정 설치하기

```
docker exec -it mariadb /bin/bash
mysql -u root -p

create database testdb;
create user 'testdb'@'%' identified by 'password';
grant all privileges on testdb.* to testdb@'%';
flush privileges;
```

### Step-04 NODE Package 설치

```
npm install
```

### Step-05 실행 설치

```
npm run start:local
npm run start:dev
npm run start:staging
npm run start:prod
```
