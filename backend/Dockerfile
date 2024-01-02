FROM node:latest

RUN apt-get update && \
    apt-get install -y postgresql-client

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

COPY . .
RUN npm install
RUN chmod +x init.sh

EXPOSE 8000

ENTRYPOINT [ "./init.sh" ]
# RUN npm run build
CMD npm run start:dev
