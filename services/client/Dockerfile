#FROM node:12-alpine
#WORKDIR /front
#COPY package.json /front/package.json
#RUN npm install
#RUN npm run build
FROM nginx:1.16.0-alpine
#COPY --from=build /front/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]