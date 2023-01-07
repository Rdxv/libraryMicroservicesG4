import knex from 'knex'

const fakeSqlConnection = async function(logger) {
    try {
        await knex({
            client: 'better-sqlite3',
            connection: {
                filename: ":memory:"
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
export default fakeSqlConnection;
