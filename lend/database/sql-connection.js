import knex from 'knex'

const sqlConnection = async function(logger) {
    try {
        await knex({
            client: 'mysql',
            connection: {
                port: process.env.SQL_PORT ?? 3306,
                host: process.env.SQL_HOST ?? 'localhost',
                user: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                database: process.env.SQL_DBNAME
            },
            log: {
                warn(message) {
                    logger.warn(message)
                },
                error(message) {
                    logger.error(message)
                },
                deprecate(message) {
                    logger.warn(message)
                },
                debug(message) {
                    logger.debug(message)
                },
            }
        });
        logger.info('Connected to SQL DB');

    } catch (error) {
        logger.error(error);
    }


}
// Exports
export default sqlConnection;