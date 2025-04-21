# app/Dockerfile

# ----- Stage 1: Build -----
FROM node:18-alpine AS build
RUN npm install -g pnpm
WORKDIR /usr/src/app

# <<< SỬA CÁC DÒNG COPY NÀY: Bỏ tiền tố 'app/' >>>
COPY pnpm-lock.yaml ./
COPY package.json ./

# Cài đặt TẤT CẢ dependencies
RUN pnpm install --frozen-lockfile

# <<< SỬA DÒNG COPY NÀY: Bỏ tiền tố 'app/' >>>
COPY . .

# Build ứng dụng Angular
RUN pnpm run build --configuration production

# ----- Stage 2: Serve -----
FROM nginx:stable-alpine

# Lệnh COPY ở Stage 2 vẫn giữ nguyên đường dẫn đầy đủ TỪ BÊN TRONG Stage 1
# !!! Đảm bảo 'app' khớp với outputPath trong angular.json !!!
COPY --from=build /usr/src/app/dist/app /usr/share/nginx/html

# <<< SỬA DÒNG COPY NÀY: Bỏ tiền tố 'app/' >>>
# Copy file nginx.conf TỪ context build (đã là app/)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
