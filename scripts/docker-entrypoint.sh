#!/bin/sh
set -e

# 这个脚本用于教学项目的一体化 Docker 容器：
# 1. 启动容器内的 MySQL 兼容数据库服务
# 2. 初始化学生管理系统需要的数据库
# 3. 执行 Prisma 同步
# 4. 启动 Next.js 开发服务

MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-password}"
MYSQL_DATABASE="${MYSQL_DATABASE:-student_db}"
MYSQL_USER="${MYSQL_USER:-student}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-studentpass}"
DATABASE_URL="${DATABASE_URL:-mysql://root:${MYSQL_ROOT_PASSWORD}@127.0.0.1:3306/${MYSQL_DATABASE}}"

export MYSQL_ROOT_PASSWORD MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD DATABASE_URL

MYSQL_SOCKET="/run/mysqld/mysqld.sock"

mkdir -p /run/mysqld /var/lib/mysql
chown -R mysql:mysql /run/mysqld /var/lib/mysql

if [ ! -d /var/lib/mysql/mysql ]; then
  echo "Initializing database files..."
  mariadb-install-db --user=mysql --datadir=/var/lib/mysql --skip-test-db >/dev/null
fi

echo "Starting database service..."
mariadbd \
  --user=mysql \
  --datadir=/var/lib/mysql \
  --bind-address=0.0.0.0 \
  --socket="${MYSQL_SOCKET}" &

MYSQL_PID="$!"

cleanup() {
  if kill -0 "${MYSQL_PID}" 2>/dev/null; then
    kill "${MYSQL_PID}"
    wait "${MYSQL_PID}" || true
  fi
}

trap cleanup INT TERM

echo "Waiting for database service..."
i=0
until mysqladmin --socket="${MYSQL_SOCKET}" ping --silent; do
  i=$((i + 1))
  if [ "${i}" -gt 60 ]; then
    echo "Database service did not become ready in time."
    exit 1
  fi
  sleep 1
done

run_mysql_as_root() {
  if mysql --protocol=socket --socket="${MYSQL_SOCKET}" -uroot "$@" 2>/dev/null; then
    return 0
  fi

  mysql --protocol=socket --socket="${MYSQL_SOCKET}" -uroot -p"${MYSQL_ROOT_PASSWORD}" "$@"
}

echo "Preparing application database..."
run_mysql_as_root <<SQL
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
FLUSH PRIVILEGES;
SQL

echo "Generating Prisma client..."
pnpm prisma:generate

echo "Synchronizing database tables..."
pnpm prisma:db:push

echo "Starting Next.js application..."
exec pnpm dev --hostname 0.0.0.0 --port 3000
