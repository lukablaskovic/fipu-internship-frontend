FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY dist /usr/share/nginx/html

EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
