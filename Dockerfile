FROM nginx

# Remove default server definition
RUN rm /etc/nginx/conf.d/default.conf

# Copy the main configuration file to the proper location
COPY nginx.conf /etc/nginx/nginx.conf

# Copy your site's assets
COPY dist /usr/share/nginx/html

EXPOSE 3000

# Start Nginx with foreground option
CMD ["nginx", "-g", "daemon off;"]
