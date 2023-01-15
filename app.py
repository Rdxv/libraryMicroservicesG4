from environs import Env
env = Env()
env.read_env() # read .env file, if it exists

import time
from uuid import uuid4

import uvicorn
from uvicorn.protocols.utils import get_path_with_query_string

from starlette.applications import Starlette
from starlette.responses import Response
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware

from asgi_correlation_id import CorrelationIdMiddleware
from asgi_correlation_id.context import correlation_id

import structlog
from custom_logging import setup_logging

from ariadne.asgi import GraphQL
from graphql_logic import executable_schema


## Setup logging
LOG_JSON_FORMAT = env.bool('LOG_JSON_FORMAT', False)
LOG_LEVEL = env.log_level('LOG_LEVEL', 'INFO')

setup_logging(json_logs=LOG_JSON_FORMAT, log_level=LOG_LEVEL)

access_logger = structlog.stdlib.get_logger('api.access')


class CustomLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # Clear context vars
        structlog.contextvars.clear_contextvars()

        # These context vars will be added to all log entries emitted during the request
        structlog.contextvars.bind_contextvars(correlation_id=correlation_id.get())

        start_time = time.perf_counter_ns()
        # If the call_next raises an error, we still want to return our own 500 response,
        # so we can add headers to it (process time, request ID...)
        response = Response(status_code=500)
        try:
            response = await call_next(request)
        except Exception:
            structlog.stdlib.get_logger('api.error').exception('Uncaught exception')
            raise
        finally:
            process_time = time.perf_counter_ns() - start_time
            status_code = response.status_code
            url = get_path_with_query_string(request.scope)
            client_host = request.client.host
            client_port = request.client.port
            http_method = request.method
            http_version = request.scope['http_version']
            # Recreate the Uvicorn access log format, but add all parameters as structured information
            access_logger.info(
                f'''{client_host}:{client_port} - '{http_method} {url} HTTP/{http_version}' {status_code}''',
                # http={
                #     'url': str(request.url),
                #     'status_code': status_code,
                #     'method': http_method,
                #     'correlation_id': correlation_id,
                #     'version': http_version,
                # },
                network={'client': {'ip': client_host, 'port': client_port}},
                duration=process_time,
            )
            response.headers['X-Process-Time'] = str(process_time / 10 ** 9)
            return response

## Configure middlewares
middlewares_list = [
    Middleware(
        CorrelationIdMiddleware,
        header_name='X-Correlation-ID',
        generator=lambda: str(uuid4()),
        transformer=lambda _: str(uuid4())
    ),
    Middleware(CustomLoggingMiddleware)
]


## Configure Starlette app
app = Starlette(middleware = middlewares_list, debug = (LOG_LEVEL == 'DEBUG'))

## Add Ariadne to the Starlette app
app.mount("/graphql", GraphQL(executable_schema, debug = (LOG_LEVEL == 'DEBUG')))


## Run uvicorn internally if executed as a standalone script
PORT = env.int('PORT', 8000)
BIND_HOST = env.str('BIND_HOST', '0.0.0.0')

if __name__ == '__main__':
    uvicorn.run(app, host=BIND_HOST, port=PORT, log_config=None)