FROM node:18.17.0

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

COPY ./public/emails.csv ./dist/routes/public/

EXPOSE 5000

CMD ["npm", "start"]