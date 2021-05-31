FROM node:12-alpine
WORKDIR /app
COPY package.json /app/package.json
RUN apk --no-cache add --virtual builds-deps build-base python
#RUN npm install --only=prod
RUN npm install
EXPOSE 8080
USER node
CMD npm run dev