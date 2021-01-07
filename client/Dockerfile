FROM node:lts
RUN mkdir -p /application/
WORKDIR /application
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
