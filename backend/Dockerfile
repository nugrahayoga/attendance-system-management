FROM node:20-alpine

ENV HOME=/apps/backend/ \
    NODE_OPTIONS=--max-old-space-size=4096

RUN mkdir -p /apps/backend/tmp/ $HOME && apk --update add --no-cache tini

WORKDIR $HOME

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3333

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "server.js" ]