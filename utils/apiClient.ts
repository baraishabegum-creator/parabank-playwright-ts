import { APIRequestContext } from '@playwright/test';
import { User } from '../utils/userGenerator';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080/parabank';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async getCustomer(customerId: number): Promise<string> {
    const res = await this.request.get(`${BASE_URL}/services/bank/customers/${customerId}`, {
      headers: { Accept: 'application/xml' },
    });
    return res.text();
  }

  async getCustomerAccounts(customerId: number): Promise<string> {
    const res = await this.request.get(`${BASE_URL}/services/bank/customers/${customerId}/accounts`, {
      headers: { Accept: 'application/xml' },
    });
    return res.text();
  }

  async getAccount(accountId: number): Promise<string> {
    const res = await this.request.get(`${BASE_URL}/services/bank/accounts/${accountId}`, {
      headers: { Accept: 'application/xml' },
    });
    return res.text();
  }

  async getAccountTransactions(accountId: number): Promise<string> {
    const res = await this.request.get(`${BASE_URL}/services/bank/accounts/${accountId}/transactions`, {
      headers: { Accept: 'application/xml' },
    });
    return res.text();
  }

  async registerUser(user: User): Promise<number> {
    // ParaBank has no dedicated REST register endpoint; fall back to UI registration.
    // Returns -1 to indicate API path unavailable.
    return -1;
  }
}
