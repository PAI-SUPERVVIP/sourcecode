FROM node:20-alpine

# สร้าง working directory
WORKDIR /app

# คัดลอก package ก่อน (ให้ cache ทำงาน)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --omit=dev

# คัดลอกไฟล์ทั้งหมด
COPY . .

# Railway ใช้ PORT จาก environment
ENV PORT=3000

# เปิดพอร์ต
EXPOSE 3000

# รันแบบ production
CMD ["node", "server.js"]
