import { app } from './app'
import { env } from './env'

// eslint-disable-next-line no-console
app.listen({ port: +env.PORT }).then(() => console.log('Server running...'))
