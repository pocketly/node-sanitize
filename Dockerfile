FROM node:18-alpine
RUN apk update && apk add make
CMD ["sh", "-c", "npm i && make test"]
