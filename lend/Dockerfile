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


## Set docker arguments with defaults
ARG service_port=3002


## Set environment variables
#ENV NODE_ENV=db-test
ENV NODE_ENV=production

ENV PORT=${service_port}


## Open port to other microservices on same network (or use --expose with docker run)
EXPOSE ${service_port}


## Start the app
CMD [ "node", "index.js" ]