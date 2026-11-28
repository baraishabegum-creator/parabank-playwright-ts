import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080/parabank';

test.describe('ParaBank REST API', () => {
  test('GET /services/bank/customers/{id} returns customer XML', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/services/bank/customers/12212`, {
      headers: { Accept: 'application/xml' },
    });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<customer>');
    expect(body).toContain('<firstName>John</firstName>');
    expect(body).toContain('<lastName>Smith</lastName>');
  });

  test('GET /services/bank/customers/{id}/accounts returns account list XML', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/services/bank/customers/12212/accounts`, {
      headers: { Accept: 'application/xml' },
    });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<accounts>');
    expect(body).toContain('<account>');
    expect(body).toContain('<type>CHECKING</type>');
  });

  test('GET /services/bank/accounts/{id} returns account details', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/services/bank/accounts/12345`, {
      headers: { Accept: 'application/xml' },
    });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<id>12345</id>');
    expect(body).toContain('<type>CHECKING</type>');
  });

  test('GET /services/bank/accounts/{id}/transactions returns transaction list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/services/bank/accounts/12345/transactions`, {
      headers: { Accept: 'application/xml' },
    });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<transactions>');
    expect(body).toContain('<transaction>');
  });

  test('GET /services/bank/customers/{nonexistent} returns error', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/services/bank/customers/999999999`, {
      headers: { Accept: 'application/xml' },
    });
    expect(res.status()).not.toBe(200);
  });
});
