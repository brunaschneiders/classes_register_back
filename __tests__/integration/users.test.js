import request from 'supertest';
import app from '../../src/app';

import truncate from '../utils/truncate';

import User from '../../src/app/models/User';

describe('tests relatives to users', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should create a user', async () => {
    expect.assertions(6);
    const user = await User.create({
      name: 'Bruna',
      type: 'Admin',
      username: 'bruna',
      password: '123456',
    });


    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('type');
    expect(user).toHaveProperty('username');
    expect(user.name).toBe('Bruna');
    expect(user.type).toBe('Admin');
    expect(user.username).toBe('bruna');
  });

  it('should create account', async () => {
    expect.assertions(8);
    const user = {
      name: 'Bruna',
      type: 'Admin',
      username: 'bruna',
      password: '123456',
    };

    const response = await request(app).post('/user').send(user);

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('uid');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('type');
    expect(response.body.user).toHaveProperty('username');
    expect(response.body.user.name).toBe('Bruna');
    expect(response.body.user.type).toBe('Admin');
    expect(response.body.user.username).toBe('bruna');
  });
});
