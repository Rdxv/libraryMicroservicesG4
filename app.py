import uvicorn

from ariadne import QueryType, MutationType, make_executable_schema, load_schema_from_path, format_error
from ariadne.asgi import GraphQL
from graphql import GraphQLError

import connectors

from custom_scalars import custom_scalars


## Define type definitions (schema) using SDL
my_schema = load_schema_from_path('schema.graphql')


## Initialize query type
query = QueryType()


## Initialize mutation type
mutation = MutationType()


## Define resolversve
@query.field('book')
async def resolve_book(*_, id):
    return await connectors.get_book_by_id(id)

@query.field('books')
#async def resolve_books(*_, pageNumber=None, pageSize=None, title=None, year=None, author=None, publisher=None, genre=None, available=None):
async def resolve_books(*_, **arguments):
    return await connectors.get_books(arguments)

@mutation.field('addBook')
async def resolve_add_book(_, info, input):
    return await connectors.add_book(input)

@mutation.field('updateBook')
async def resolve_update_book(_, info, id, input):
    return await connectors.update_book(id, input)

@mutation.field('deleteBook')
async def resolve_delete_book(_, info, id):
    return await connectors.delete_book(id)



## Initialize app
schema = make_executable_schema(my_schema, [query, mutation] + custom_scalars)
app = GraphQL(schema)



## Run uvicorn internally if executed as a standalone script
if __name__ == "__main__":
    uvicorn.run("app:app", host = "127.0.0.1", port = 8000)