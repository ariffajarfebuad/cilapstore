# Tahap 1: Build aplikasi React
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Tahap 2: Sajikan aplikasi dengan Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# Tambahkan konfigurasi Nginx untuk menangani routing React
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]