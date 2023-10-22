FROM nginx:alpine

# Copy the build output from your local file system
COPY ./dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
