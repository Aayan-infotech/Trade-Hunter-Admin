FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Copy the build output to Nginx's public folder
COPY --from=build /usr/src/app/build /usr/share/nginx/html
# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port (2022 as you specified)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
