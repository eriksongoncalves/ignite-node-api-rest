import request from 'supertest'
import { execSync } from 'node:child_process'
import {
  beforeAll,
  afterAll,
  it,
  describe,
  expect,
  beforeEach,
  afterEach
} from 'vitest'

import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
  })

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all')
  })

  it('should be able to create a new transction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({ title: 'New transaction', amount: 5000, type: 'credit' })
      .expect(201)
  })

  it('should be able to list all transctions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ title: 'New transaction', amount: 5000, type: 'credit' })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000
      })
    ])
  })

  it('should be able to get a specific transction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ title: 'New transaction', amount: 5000, type: 'credit' })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const transactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(transactionResponse.body.transactions).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000
      })
    )
  })

  it('should be able to list all transctions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ title: 'New transaction', amount: 5000, type: 'credit' })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000
      })
    ])
  })

  it('should be able to get the summary', async () => {
    const createCreditTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ title: 'Credit transaction', amount: 5000, type: 'credit' })
      .expect(201)

    const cookies = createCreditTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({ title: 'Debit transaction', amount: 2000, type: 'debit' })
      .expect(201)

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual([
      expect.objectContaining({
        amount: 3000
      })
    ])
  })
})
