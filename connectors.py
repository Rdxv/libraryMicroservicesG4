from environs import Env
env = Env()
env.read_env() # read .env file, if it exists

import httpx

from asgi_correlation_id.context import correlation_id


## Get backend api urls from env
BOOKS_API_URL = env.str('BOOKS_API_URL', 'http://localhost:3001/api/books')


## Start shared httpx async client session
client = httpx.AsyncClient()


## Generic method for sending requests to rest apis handling remote and connection errors
async def send_request_to_api(method, url, params = None, data = None):
    headers = {'X-Correlation-ID': correlation_id.get()} # Pass correlation_id to backend APIs
    try:
        resp = await client.request(method, url, params = params, json = data, headers = headers)
        if resp.status_code == 200 or resp.status_code == 201:
            return resp.json()
        elif resp.status_code == 404:
            return None
        elif resp.status_code == 409:
            raise httpx.HTTPError('The backend API reports conflicting data. Record might be already stored on db')
        else:
            raise httpx.HTTPError(f"The backend API returned STATUS CODE {resp.status_code}")
    except httpx.RequestError:
        raise httpx.HTTPError('An error occurred while connecting to the backend API')


## Books api methods
async def get_book_by_id(id):
    payload = await send_request_to_api('GET', BOOKS_API_URL + '/' + str(id))
    if payload is not None:
        return payload['data'] # The book is in response.data
    return None

async def get_books(query_params = None):
    payload = await send_request_to_api('GET', BOOKS_API_URL, params = query_params)
    if payload is not None:
        return payload['data'] # The books array is in response.data
    return None

async def add_book(data):
    payload = await send_request_to_api('POST', BOOKS_API_URL, data = data)
    if payload is not None:
        return payload['data']
    return None

async def update_book(id, data):
    payload = await send_request_to_api('PUT', BOOKS_API_URL + '/' + str(id), data = data)
    if payload is not None:
        return payload['data']
    return None

async def delete_book(id):
    payload = await send_request_to_api('DELETE', BOOKS_API_URL + '/' + str(id))
    if payload is not None:
        return True
    return False





## Method to gracefully terminate httpx async client session (not really needed, asyncio should handle this)
# async def close_client_session():
#     await client.aclose()