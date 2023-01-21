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


## Open inbound port for microservice (or user --expose with docker run)
EXPOSE 3001


## Set environment variables (overriding .env if exists). Only options "production" for PROD or "db-test" for testing app with external/real db 
#ENV NODE_ENV=db-test
ENV NODE_ENV=production


## Start the app
CMD [ "node", "index.js" ]