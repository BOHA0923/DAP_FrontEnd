import { mockDB, requestMethodImpl } from '../mock-data';

export const environment = {
  production: true,
  mock: {
    db: mockDB,
    methods: requestMethodImpl
  }
};
