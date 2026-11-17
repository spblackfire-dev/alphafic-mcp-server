FROM node:20-alpine

WORKDIR /app

COPY package.json catalog.json index.js ./

RUN chmod +x index.js

ENTRYPOINT ["node", "index.js"]
