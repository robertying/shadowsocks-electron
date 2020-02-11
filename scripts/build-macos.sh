#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BUILD_DIR=$DIR/build
mkdir -p $BUILD_DIR
cd $BUILD_DIR

CPU=4

brew update && brew install automake autoconf libtool git python wget

git clone https://github.com/shadowsocks/shadowsocks-libev
cd shadowsocks-libev
git submodule init && git submodule update

ver=4.31
wget http://dist.schmorp.de/libev/libev-$ver.tar.gz
tar zxf libev-$ver.tar.gz
cd libev-$ver
./configure --prefix=$BUILD_DIR/libev --disable-shared
LDFLAGS=-static make -j$CPU
make install
cd ..

ver=2.16.4
wget https://tls.mbed.org/download/mbedtls-$ver-gpl.tgz
tar zxf mbedtls-$ver-gpl.tgz
cd mbedtls-$ver
CFLAGS="-O2 -fPIC" LDFLAGS=-static make -j$CPU
make DESTDIR=$BUILD_DIR/mbedtls install
cd ..

ver=8.43
wget https://ftp.pcre.org/pub/pcre/pcre-$ver.tar.gz
tar zxf pcre-$ver.tar.gz
cd pcre-$ver
./configure --prefix=$BUILD_DIR/pcre --disable-shared --enable-utf8 --enable-unicode-properties
make -j$CPU && make install
cd ..

ver=1.0.18
wget https://download.libsodium.org/libsodium/releases/libsodium-$ver.tar.gz
tar zxf libsodium-$ver.tar.gz
cd libsodium-$ver
./configure --prefix=$BUILD_DIR/libsodium --disable-shared
make -j$CPU && make install
cd ..

ver=1.15.0
wget https://github.com/c-ares/c-ares/releases/download/cares-1_15_0/c-ares-$ver.tar.gz
tar zxf c-ares-$ver.tar.gz
cd c-ares-$ver
./buildconf
autoconf configure.ac
./configure --prefix=$BUILD_DIR/c-ares --disable-shared
make -j$CPU && make install
cd ..

./autogen.sh
./configure --prefix=$BUILD_DIR/shadowsocks-libev --disable-documentation \
--with-pcre=$BUILD_DIR/pcre --with-mbedtls=$BUILD_DIR/mbedtls --with-sodium=$BUILD_DIR/libsodium --with-cares=$BUILD_DIR/c-ares --with-ev=$BUILD_DIR/libev
make -j$CPU && make install
cd ..

cd ..
