FROM node:14.7

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8080

CMD [ "node", "src/index.js" ]
