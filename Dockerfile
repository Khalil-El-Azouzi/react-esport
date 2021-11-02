FROM node:14-alpine

#default working directory
WORKDIR /app

#installing depandencies
COPY package.json .
RUN npm install --silent

#adding the app
COPY . .

#starting our app
CMD ["npm", "start"]

EXPOSE 3000
