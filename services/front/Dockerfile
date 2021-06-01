FROM node:12-alpine
WORKDIR /front
COPY package.json /front/package.json
RUN apk --no-cache add --virtual builds-deps build-base python
#RUN npm install --only=prod
RUN npm install
EXPOSE 8080
CMD npm run build