FROM node:20

WORKDIR /usr/app/back

COPY src src/

COPY public public/

COPY package.json .

COPY tsconfig.json .

RUN npm install

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]
