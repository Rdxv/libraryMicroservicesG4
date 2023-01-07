// Import and load dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import pino logger
import pino from 'pino';

// Import pino-http for express logging
import pinoHttp from 'pino-http';


// Create logger
const logger = pino({
	level: process.env.LOG_LEVEL || 'info', // Set LOG_LEVEL to change level
	formatters: {
		level: (label, number) => { return { level: label ?? number } }
	}
});


// Create logging middleware
const loggingMiddleware = pinoHttp({
	// Reuse an existing logger instance
    logger: logger,

    // Define a custom request id function
    genReqId: function (req, res) {
        const correlationId = req.get('X-Correlation-ID') ?? 'NO-ID';
        return correlationId;
    },

    // Define a custom logger level
    customLogLevel: function (req, res, err) {
        if (res.statusCode !== 404 && res.statusCode >= 400 && res.statusCode < 500) { // a 404 is just normal behaviour and doesn't need a warning
            return 'warn'
        } else if (res.statusCode >= 500 || err) {
            return 'error'
        }
        return 'info' // Default level = info
    },
	
    // Override attribute keys for the log object
    customAttributeKeys: {
    //    req: 'request',
    //    res: 'response',
        err: 'error', // Rename err to error
		reqId: 'correlationId' // Rename reqId as correlationId
    },
	
	// Override default serializers
	serializers: { // Disable default output for res & req (too verbose)
		req: (req) => undefined,
		res: (res) => undefined
	},

    // Define additional custom log properties
    customProps: function (req, res) { // In our case, re-define res & req (as request & response) with verbosity related to log level and status code
		var request, response;
		
		if ( process.env.LOG_LEVEL !== 'debug' && res.statusCode < 500 ) {
			request = {
				id: req.id,
				method: req.method,
				url: req.url,
				remoteAddress: req.socket.remoteAddress
			};
			response = {
				statusCode: res.statusCode
			}
		} else {
			request = pinoHttp.stdSerializers.req(req);
			response = pinoHttp.stdSerializers.res(res);
		}
		
        return {
			request: request,
			response: response
        }
    }
});


// Exports
export {
    logger,
	loggingMiddleware
}