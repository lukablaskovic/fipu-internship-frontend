FROM nginx:alpine

COPY ./dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
RUN ln -snf /usr/share/zoneinfo/Europe/Berlin /etc/localtime && echo Europe/Berlin > /etc/timezone

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
