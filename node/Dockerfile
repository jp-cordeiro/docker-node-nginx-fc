#builder
FROM node:18 as builder

WORKDIR /usr/src/app

COPY . .
RUN npm install

#image prod
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .

EXPOSE 3000

CMD ["node","index.js"]