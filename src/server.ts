import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions').select('*')

  return transaction
})

// eslint-disable-next-line no-console
app.listen({ port: env.PORT }).then(() => console.log('Server running...'))
