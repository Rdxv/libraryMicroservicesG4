from ariadne import ObjectType, QueryType, MutationType, make_executable_schema, load_schema_from_path, format_error

import connectors

from custom_scalars import custom_scalars


## Define type definitions (schema) using SDL
schema = load_schema_from_path('schema.graphql')


## Initialize query type
query = QueryType()


## Initialize mutation type
mutation = MutationType()


## Books resolvers
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

book = ObjectType('Book')

@book.field('lends')
async def resolve_field_lends_in_book(obj, info):
    return await connectors.get_lends({'bookId': obj['id']})



## Lends resolvers
@query.field('lend')
async def resolve_lend(*_, id):
    return await connectors.get_lend_by_id(id)

@query.field('lends')
async def resolve_lends(*_, **arguments):
    return await connectors.get_lends(arguments)

@mutation.field('addLend')
async def resolve_add_lend(_, info, input):
    return await connectors.add_lend(input)

@mutation.field('updateLend')
async def resolve_update_lend(_, info, id, input):
    return await connectors.update_lend(id, input)

@mutation.field('deleteLend')
async def resolve_delete_lend(_, info, id):
    return await connectors.delete_lend(id)

lend = ObjectType('Lend')

@lend.field('book')
async def resolve_field_book(obj, info):
    return await connectors.get_book_by_id(str(obj['bookId']))

@lend.field('customer')
async def resolve_field_customer(obj, info):
    return await connectors.get_customer_by_id(obj['customerId'])



## Customers resolvers
@query.field('customer')
async def resolve_customer(*_, id):
    return await connectors.get_customer_by_id(id)

@query.field('customers')
async def resolve_customers(*_, **arguments):
    return await connectors.get_customers(arguments)

@mutation.field('addCustomer')
async def resolve_add_customer(_, info, input):
    return await connectors.add_customer(input)

@mutation.field('updateCustomer')
async def resolve_update_customer(_, info, id, input):
    return await connectors.update_customer(id, input)

@mutation.field('deleteCustomer')
async def resolve_delete_customer(_, info, id):
    return await connectors.delete_customer(id)

customer = ObjectType('Customer')

@customer.field('lends')
async def resolve_field_lends_in_customer(obj, info):
    return await connectors.get_lends({'customerId': obj['id']})



## Generate executable schema
executable_schema = make_executable_schema(schema, [query, mutation, book, lend, customer] + custom_scalars)