FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install && npm list
RUN npm install bootstrap-icons



COPY . .

RUN npm run build

ENV NODE_ENV production

#CMD [ "npx", "serve", "build" ]
CMD ["npm", "start"]