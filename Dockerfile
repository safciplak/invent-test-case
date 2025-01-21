FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build \
    && npm cache clean --force \
    && rm -rf /root/.npm

USER node

CMD ["npm", "start"]