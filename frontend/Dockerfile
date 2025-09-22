FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Hot reload avec React
CMD ["npm", "start"]
