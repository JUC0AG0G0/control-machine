FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Hot reload (start:dev doit être défini dans ton package.json)
CMD ["npm", "run", "start:dev"]
