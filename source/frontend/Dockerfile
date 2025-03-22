FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install && npm list
RUN npm install bootstrap-icons
RUN npm install react-datepicker
RUN npm install react react-dom leaflet prop-types react-leaflet
RUN npm install leaflet-react


COPY . .

RUN npm run build

ENV NODE_ENV production

#CMD [ "npx", "serve", "build" ]
CMD ["npm", "start"]