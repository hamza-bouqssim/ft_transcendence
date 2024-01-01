FROM node:latest

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

COPY . .

RUN npm install

EXPOSE 3000
# RUN npm run build

RUN npm run build

CMD [ "npm", "run", "start"]
