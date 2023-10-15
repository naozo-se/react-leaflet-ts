# イメージ指定
ARG NODE_IMAGE_TAG
FROM node:$NODE_IMAGE_TAG

# パッケージ追加
RUN apt-get update && \
    apt-get install -y vim curl

# パラメータ変数
ARG WORKDIR
ARG TIMEZONE

# サーバーパッケージインストール
RUN npm install -g serve

# すべてのファイルをnodeユーザーのものに
RUN mkdir -p $WORKDIR
RUN chown -R node:node $WORKDIR

# ユーザー切り替え
USER node

# 作業ディレクトリ変更
WORKDIR $WORKDIR

# 内部ポート明示
EXPOSE 3000
