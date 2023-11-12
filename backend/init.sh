#!/bin/sh
until pg_isready -h postgres -p 5432 -U postgres
do
    echo "Waiting for postgres..."
    sleep 1
done

 
npx prisma migrate dev --name dev --preview-feature
npx prisma generate
npx prisma db seed 
exec "$@"