FROM node

WORKDIR /usr/src/app

COPY ./nextjs/ .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
