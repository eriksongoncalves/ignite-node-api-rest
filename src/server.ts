import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'Hello World'
})

// eslint-disable-next-line no-console
app.listen({ port: 3333 }).then(() => console.log('Server running...'))
