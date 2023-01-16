## Group 4 microservices library app
App schematics
![](https://github.com/Rdxv/libraryMicroservicesG4/blob/main/img/library.png)

## Services:
 - GraphQL (acts as a gateway between the services and clients). Written in Python
 - Books (uses Mongo Atlas remote DB). Written in NodeJS. Manages the collection of books.
 - Customers (uses containerized Mongo DB). Written in Java. Manages the collection of customers
 - Lend (uses local-installed My SQL). Written in NodeJS. Aggregates data from books and customers services via graphQL to 
   create a lend. 
 
## Available features (for books, customers and lends)
   Create, list, retrieve, edit and delete
   
## How to start

TODO: will add dockerfiles for every single service and a docker-compose to containerize all services and launch them all at once. 

To start a NodeJS service, go into the corresponding directory and type the following commands:
*  ```npm install --include=dev``` (this will install dependencies, if you don't want to add dev dependencies do not add the --include part)
*  ```npm start``` (this will start the service. Stop it by pressing CTRL+C)
*  ```npm test``` (optional. this will run the tests but it's not necessary for service running. Requires dev dependencies)

To start GraphQL go into the corresponding directory and type the following commands:
* ```python -m venv venv``` (create the virtual environment for graphQL)
* ```venv\Scripts\Activate``` (activate the virtual environment)
* ```pip install -r requirements.txt``` (install all required dependencies)


 
