FROM node:latest

ENV wdir /usr/src/bot

RUN mkdir -p ${wdir}
WORKDIR ${wdir}

COPY package.json ${wdir}
RUN npm install

COPY . ${wdir}

CMD ["node", "app.js"]