interface User {
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
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const uniqueId = `${timestamp}${random}`;

  return {
    username: `user${uniqueId}`,
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
