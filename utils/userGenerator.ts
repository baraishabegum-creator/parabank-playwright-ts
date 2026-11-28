import { v4 as uuidv4 } from 'uuid';

export interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
}

export function generateUser(): User {
  const uuid = uuidv4().replace(/-/g, '').substring(0, 12);
  const random = Math.floor(Math.random() * 1000000);

  return {
    username: `user_${uuid}`,
    password: 'Test@123',
    firstName: `FirstName${random}`,
    lastName: `LastName${random}`,
    address: `${random} Test Street`,
    city: 'TestCity',
    state: 'CA',
    zipCode: '90001',
    phone: `555${random.toString().padStart(7, '0')}`,
    ssn: `${random.toString().padStart(9, '0')}`,
  };
}
