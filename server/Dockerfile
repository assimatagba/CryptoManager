FROM node:lts

RUN mkdir -p /server/

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "npm", "start" ]