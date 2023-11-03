FROM node

RUN apt-get update && \
    apt-get install -y postgresql-client

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

COPY . .

RUN chmod +x init.sh

EXPOSE 8000

ENTRYPOINT [ "./init.sh" ]
CMD npm run start:dev 