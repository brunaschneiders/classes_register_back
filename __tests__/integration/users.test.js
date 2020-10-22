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
      password: '1234',
    });

    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('type');
    expect(user).toHaveProperty('username');
    expect(user.name).toBe('Bruna');
    expect(user.type).toBe('Admin');
    expect(user.username).toBe('bruna');
  });

  it('should create a account', async () => {
    expect.assertions(20);
    const userSuccess = {
      name: 'Bruna',
      type: 'Admin',
      username: 'bruna',
      password: '1234',
    };

    const responseSuccess = await request(app).post('/users').send(userSuccess);

    expect(responseSuccess.body).toHaveProperty('success');
    expect(responseSuccess.body).toHaveProperty('message');
    expect(responseSuccess.body).toHaveProperty('user');
    expect(responseSuccess.body.user).toHaveProperty('uid');
    expect(responseSuccess.body.user).toHaveProperty('name');
    expect(responseSuccess.body.user).toHaveProperty('type');
    expect(responseSuccess.body.user).toHaveProperty('username');
    expect(responseSuccess.body.user).toHaveProperty('password_hash');
    expect(responseSuccess.status).toBe(200);
    expect(responseSuccess.body.success).toBe(true);
    expect(responseSuccess.body.message).toBe(
      'Usuário cadastrado com sucesso!'
    );
    expect(responseSuccess.body.user.name).toBe('Bruna');
    expect(responseSuccess.body.user.type).toBe('Admin');
    expect(responseSuccess.body.user.username).toBe('bruna');

    const userError = {
      na: 'Bruna',
      ty: 'Admin',
      usern: 'bruna',
      passwo: '1234',
    };

    const responseError = await request(app).post('/users').send(userError);
    expect(responseError.body).toHaveProperty('success');
    expect(responseError.body).toHaveProperty('message');
    expect(responseError.body).toHaveProperty('error');
    expect(responseError.status).toBe(404);
    expect(responseError.body.success).toBe(false);
    expect(responseError.body.message).toBe(
      'Não foi possível cadastrar o Usuário. Por favor, revise os dados e tente novamente.'
    );
  });

  it('should bring all the users from the DB', async () => {
    expect.assertions(11);

    await User.create({
      name: 'Bruna',
      type: 'Admin',
      username: 'bruna',
      password: '1234',
    });

    const responseSuccess = await request(app).get('/users');

    expect(responseSuccess.body).toHaveProperty('success');
    expect(responseSuccess.body).toHaveProperty('data');
    expect(responseSuccess.body.data).toHaveProperty('profiles');
    expect(responseSuccess.body.data.profiles).toBeInstanceOf(Array);
    expect(responseSuccess.body.data.profiles[0]).toHaveProperty('uid');
    expect(responseSuccess.body.data.profiles[0]).toHaveProperty('description');
    expect(responseSuccess.body.data.profiles[0]).toHaveProperty('createdAt');
    expect(responseSuccess.body.data.profiles[0]).toHaveProperty('updatedAt');
    expect(responseSuccess.body).toHaveProperty('message');
    expect(responseSuccess.status).toBe(200);
    expect(responseSuccess.body.message).toBe('Perfis encontrados com sucesso');
  });
});
