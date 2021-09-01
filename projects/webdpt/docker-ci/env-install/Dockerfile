# 安裝相依套件
FROM        node:10.13.0 AS build_base
RUN         mkdir -p /build
WORKDIR     /build
COPY        package.json ./
RUN         mkdir -p ./projects
COPY        ./projects/ng-quicksilver.tar.gz ./projects/
RUN         npm install

# Build 專案
FROM        build_base AS builder
LABEL       maintainer="DAP平台中心"
WORKDIR     /build
COPY        . .
RUN         npm run build-prod

# 打包專案
FROM        registry.digiwincloud.com.cn/base/digiwin_alpine_nginx:1.12.1
ENV         buildfile=./buildfile
COPY        --from=builder /build/dist/ /usr/share/nginx/html/
ADD         ${buildfile}/nginx.conf /etc/nginx/
ADD         ${buildfile}/default.conf /etc/nginx/conf.d/
ADD         ${buildfile}/frontendShell.sh /usr/share/nginx/html/
ADD         ${buildfile}/dockerEnv.sh /usr/share/nginx/html/
RUN         chmod +x /usr/share/nginx/html/frontendShell.sh
RUN         chmod +x /usr/share/nginx/html/dockerEnv.sh
WORKDIR     /usr/share/nginx/html
EXPOSE      80
ENTRYPOINT ["/usr/share/nginx/html/frontendShell.sh"]
