FROM node:22

WORKDIR /usr/src/app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Сборка проекта + генерация Prisma Client под нужную платформу
RUN npm run build && \
    npm run prisma:generate

EXPOSE 3000

CMD ["npm", "start"]
