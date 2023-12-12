FROM node:20

WORKDIR /usr/app/front

COPY src src/

COPY package.json .

COPY tsconfig.json .

COPY tsconfig.app.json .

COPY angular.json .

RUN npm install

RUN npm i -g @angular/cli

ENTRYPOINT [ "ng", "serve" , "--host=0.0.0.0" ]
