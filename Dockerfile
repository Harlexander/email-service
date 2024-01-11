FROM node:18.17.0

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

EXPOSE 5000

CMD ["npm", "start"]