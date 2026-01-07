# Stage 1: Build the Vite app
FROM node:24-slim AS build

WORKDIR /app

# Clean and install
COPY package*.json ./
RUN rm -rf node_modules package-lock.json && npm install

COPY . .

RUN npm run build:dev

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]
