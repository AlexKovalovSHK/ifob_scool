# 1️⃣ build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2️⃣ nginx stage
FROM nginx:alpine
# чистим старую html
RUN rm -rf /usr/share/nginx/html/*
# копируем собранный фронт из build stage
COPY --from=build /app/dist /usr/share/nginx/html
# копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
