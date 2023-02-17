const knex = require('knex');
const knexCache = require('../lib/knexCache');

const knexConfig = {
  client: 'pg',
  connection: {
    uri: null,
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password: '',
    database: 'postgres',
    ssl: false,
    charset: 'utf8',
  },
}

const knexInstance = knex(knexConfig);

knexCache(knex);

async function test() {
  const response = await knexInstance.select(1).limit(1).cache('key');
  console.log(response);
  const response2 = await knexInstance.select(1).limit(1).cache('key');
  console.log(response2);
  const response3 = await knexInstance.select(1).limit(1).invalidate('key');
  console.log(response3);
  const response4 = await knexInstance.select(1).limit(1).cache('key');
  console.log(response4);
  await knexInstance.destroy();
}

test();
