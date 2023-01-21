### LENDS SERVICE DOCKERFILE ###

## Use Node-18 on Alpine
FROM node:18-alpine


## Set working dir to app (and create it if it doesn't exist)
WORKDIR /app


## Copy package dependencies files
COPY package*.json ./


## Install required node packages
#RUN npm install --include=dev # For DEV/TEST # Works because this service uses sqlite3 as fake in-memory db (and sqlite3 works on Alpine)
RUN npm ci --only=production # For PROD


## Copy other files (only now to take advantage of Docker layers cache
COPY . .


## Open inbound port for microservice (or user --expose with docker run)
EXPOSE 3002


## Set environment variables (overriding .env if exists)
#ENV NODE_ENV=db-test
ENV NODE_ENV=production


## Start the app
CMD [ "node", "index.js" ]