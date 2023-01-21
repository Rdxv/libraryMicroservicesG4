### BOOKS SERVICE DOCKERFILE ###

## Use Node-18 on Alpine
FROM node:18-alpine


## Set working dir to app (and create it if it doesn't exist)
WORKDIR /app


## Copy package dependencies files
COPY package*.json ./


## Install required node packages
RUN npm ci --only=production # For PROD
#RUN npm install --include=dev # For DEV/TEST (Doesn't work because tests with in-memory db depend on Mongo and there's no Mongo build for Alpine)


## Copy other files (only now to take advantage of Docker layers cache
COPY . .


## Set docker arguments with defaults
ARG service_port=3001


## Set environment variables
#ENV NODE_ENV=db-test
ENV NODE_ENV=production

ENV PORT=${service_port}


## Open port to other microservices on same network (or use --expose with docker run)
EXPOSE ${service_port}


## Start the app
CMD [ "node", "index.js" ]