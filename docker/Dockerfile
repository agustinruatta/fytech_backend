FROM node:20.4-alpine

USER node

WORKDIR /usr/src/app

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node .. .

EXPOSE 3100
EXPOSE 3030

CMD [ "npm", "run", "start:dev" ]
