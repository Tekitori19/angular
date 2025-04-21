# pofolio-node/Dockerfile

FROM node:18-slim # Hoặc node:18 (Đã bao gồm build tools nếu cần)

# ... (Cài đặt build tools nếu dùng image slim và chưa có) ...
# RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY package.json ./

# --- DÒNG QUAN TRỌNG ---
# Chạy install với --unsafe-perm để cho phép các script build chạy đúng quyền root
RUN pnpm install --prod --frozen-lockfile --unsafe-perm

COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]
