const { serviceregisterUser, serviceloginUser, servicecreateUserRead, serviceupdateUser, servicedeleteUser, serviceFilterUser, servicesortUser, servicegetUserById } = require('../services/service');

// user testing for login
describe('User services', () => {
  describe('serviceregisterUser', () => {
    test('should register a new user', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      };
      const res = {
        json: jest.fn(),
      };
      await serviceregisterUser(req, res);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
      });
    });
  });

  describe('serviceserviceloginUser', () => {
    test('should login an existing user with correct credentials', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      };
      const res = {
        json: jest.fn(),
      };
      const result = await serviceloginUser(req, res);
      expect(result).toEqual({
        status: 200,
        message: '',
        data: {
          token: expect.any(String),
          data: {
            todos: {},
          },
          data: [],
        },
      });
    });

    test('should fail to login a non-existing user', async () => {
      const req = {
        body: {
          username: 'nonexistinguser',
          password: 'testpassword',
        },
      };
      const res = {
        json: jest.fn(),
      };
      const result = await serviceloginUser(req, res);
      expect(result).toEqual({
        status: 401,
        message: 'Invalid username or password',
        data: '',
      });
    });

    test('should fail to login an existing user with incorrect password', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'wrongpassword',
        },
      };
      const res = {
        json: jest.fn(),
      };
      const result = await serviceloginUser(req, res);
      expect(result).toEqual({
        status: 401,
        message: 'Password Mismatch',
        data: '',
      });
    });
  });
});
const fs = require('fs');
const helperfunction = require('../utils/util');
// user testing for create and read
describe('servicecreateUserRead', () => {
  const req = {
    params: {
      id: 'create',
      id: 'read',
    },
    body: {
      title: 'Test task',
      description: 'This is a test task',
      priority: 'low',
      dueDate: '2023-04-30',
      comments: 'This is a test comment',
    },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const username = 'testuser';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task and return status 201', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    jest.spyOn(helperfunction, 'readUserData').mockReturnValue([]);
    jest.spyOn(helperfunction, 'writeUserData').mockImplementation(() => {});

    servicecreateUserRead({ ...req, params: { id: 'create' } }, res, username);

    expect(fs.existsSync).toHaveBeenCalledWith(`${username}.json`);
    expect(fs.writeFileSync).toHaveBeenCalledWith(`${username}.json`, '[]');
    expect(helperfunction.readUserData).toHaveBeenCalledWith(username);
    expect(helperfunction.writeUserData).toHaveBeenCalledWith(username, [{ id: 1, ...req.body, timestamp: expect.any(Number) }]);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: 'Task created successfully' });
  });

  it('should read tasks and return status 202', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(helperfunction, 'readUserData').mockReturnValue([{ id: 2, ...req.body, timestamp: Date.now() }]);
    jest.spyOn(helperfunction, 'pagination').mockReturnValue([{ id: 2, ...req.body, timestamp: expect.any(Number) }]);
    
    servicecreateUserRead({ ...req, params: { id: 'read' } }, res, username);

    expect(fs.existsSync).toHaveBeenCalledWith(`${username}.json`);
    expect(helperfunction.readUserData).toHaveBeenCalledWith(username);
    expect(helperfunction.pagination).toHaveBeenCalledWith(req, res, [{ id: 2, ...req.body, timestamp: expect.any(Number) }]);
    expect(res.send).toHaveBeenCalledWith([{ id: 2, ...req.body, timestamp: expect.any(Number) }]);
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.send).toHaveBeenCalledWith({ message: 'Task read successfully' });
  });

  it('should return "no task available create a task" when creating a task and no file exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    servicecreateUserRead(req, res, username);

    expect(fs.existsSync).toHaveBeenCalledWith(`${username}.json`);
    expect(res.send).toHaveBeenCalledWith('no task available create a task');
  });

  it('should return "no task available" when reading tasks and the file exists but is empty', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(helperfunction, 'readUserData').mockReturnValue([]);

    servicecreateUserRead({ ...req, params: { id: 'read' } }, res, username);

    expect(fs.existsSync).toHaveBeenCalledWith(`${username}.json`);
    expect(helperfunction.readUserData).toHaveBeenCalledWith(username);
    expect(res.send).toHaveBeenCalledWith('no task available');
  });
});
// user testing for updating
describe('serviceupdateUser', () => {
  const req = {
    params: {
      id: '1'
    },
    body: {
      name: 'John Doe',
      age: 30,
    },
  };

  const res = {
    send: jest.fn(),
    status: jest.fn(() => res),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send "no task available create a task" if file does not exist', () => {
    fs.existsSync.mockReturnValueOnce(false);

    serviceupdateUser(req, res, 'username');

    expect(fs.existsSync).toHaveBeenCalledWith('username.json');
    expect(res.send).toHaveBeenCalledWith('no task available create a task');
  });

  it('should send "no task available" if userData is an empty array', () => {
    fs.existsSync.mockReturnValueOnce(true);
    helperfunction.readUserData.mockReturnValueOnce([]);

    serviceupdateUser(req, res, 'username');

    expect(fs.existsSync).toHaveBeenCalledWith('username.json');
    expect(helperfunction.readUserData).toHaveBeenCalledWith('username');
    expect(res.send).toHaveBeenCalledWith('no task available');
  });

  it('should update user data and send "Task updated successfully" if user is found', () => {
    const userData = [
      { id: '1', name: 'Jane Doe', age: 25 },
      { id: '2', name: 'Bob Smith', age: 40 },
    ];

    fs.existsSync.mockReturnValueOnce(true);
    helperfunction.readUserData.mockReturnValueOnce(userData);

    serviceupdateUser(req, res, 'username');

    expect(fs.existsSync).toHaveBeenCalledWith('username.json');
    expect(helperfunction.readUserData).toHaveBeenCalledWith('username');
    expect(res.send).toHaveBeenCalledWith('userupdated');
    expect(helperfunction.writeUserData).toHaveBeenCalledWith('username', [
      { id: '1', name: 'John Doe', age: 30 },
      { id: '2', name: 'Bob Smith', age: 40 },
    ]);
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.send).toHaveBeenCalledWith({ message: 'Task updated successfully' });
  });

  it('should send a 404 status code and "user not found" message if user is not found', () => {
    const userData = [
      { id: '2', name: 'Bob Smith', age: 40 },
    ];

    fs.existsSync.mockReturnValueOnce(true);
    helperfunction.readUserData.mockReturnValueOnce(userData);

    serviceupdateUser(req, res, 'username');

    expect(fs.existsSync).toHaveBeenCalledWith('username.json');
    expect(helperfunction.readUserData).toHaveBeenCalledWith('username');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('user not found');
  });
});
// user testing for deleting
describe('servicedeleteUser function', () => {
  const req = { params: { id: 123 } };
  const res = {
    send: jest.fn(),
    status: jest.fn(() => res),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send "no task available create a task" response if the user data file does not exist', () => {
    const username = 'nonexistentuser';
    fs.existsSync = jest.fn().mockReturnValue(false);
    servicedeleteUser(req, res, username);
    expect(res.send).toHaveBeenCalledWith('no task available create a task');
  });

  it('should send "no task available" response if the user has no tasks', () => {
    const username = 'emptyuser';
    fs.existsSync = jest.fn().mockReturnValue(true);
    helperfunction.readUserData = jest.fn().mockReturnValue([]);
    servicedeleteUser(req, res, username);
    expect(res.send).toHaveBeenCalledWith('no task available');
  });

  it('should send "userupdated" response and delete the task if the task is found', () => {
    const username = 'userwithtasks';
    fs.existsSync = jest.fn().mockReturnValue(true);
    helperfunction.readUserData = jest.fn().mockReturnValue([{ id: 123 }]);
    helperfunction.writeUserData = jest.fn();
    servicedeleteUser(req, res, username);
    expect(helperfunction.writeUserData).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith('userupdated');
  });

  it('should send 404 response if the user is not found', () => {
    const username = 'userwithtasks';
    fs.existsSync = jest.fn().mockReturnValue(true);
    helperfunction.readUserData = jest.fn().mockReturnValue([{ id: 456 }]);
    servicedeleteUser(req, res, username);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('user not found');
  });

  it('should send 202 response with "Task deleted successfully" message after the task is deleted', () => {
    const username = 'userwithtasks';
    fs.existsSync = jest.fn().mockReturnValue(true);
    helperfunction.readUserData = jest.fn().mockReturnValue([{ id: 123 }]);
    helperfunction.writeUserData = jest.fn();
    servicedeleteUser(req, res, username);
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.send).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
  });
});
// test to filter

describe('serviceFilterUser function', () => {
  const req = { params: { id1: 'key', id2: 'value' } };
  const res = {
    send: jest.fn(),
    json: jest.fn(),
    status: jest.fn(() => res),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send "no task available create a task" response if the user data file does not exist', () => {
    const username = 'nonexistentuser';
    fs.existsSync = jest.fn().mockReturnValue(false);
    serviceFilterUser(req, res, username);
    expect(res.send).toHaveBeenCalledWith('no task available create a task');
  });

  it('should send "no task available" response if the user has no tasks', () => {
    const username = 'emptyuser';
    fs.existsSync = jest.fn().mockReturnValue(true);
    helperfunction.readUserData = jest.fn().mockReturnValue([]);
    serviceFilterUser(req, res, username);
    expect(res.send).toHaveBeenCalledWith('no task available');
  });

  it('should send "no filtered task available" response if no matching tasks are found', () => {
    const username = 'userwithtasks';
    fs.existsSync = jest.fn().mockReturnValue(true);
    helperfunction.readUserData = jest.fn().mockReturnValue([{ id: 123, key: 'differentvalue' }]);
    serviceFilterUser(req, res, username);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'no filtered task avalable' });
  });

  it('should send paginated filtered data if matching tasks are found', () => {
    const username = 'userwithtasks';
    fs.existsSync = jest.fn().mockReturnValue(true);
    helperfunction.readUserData = jest.fn().mockReturnValue([{ id: 123, key: 'value' }, { id: 456, key: 'value' }]);
    helperfunction.pagination = jest.fn().mockReturnValue('paginated data');
    serviceFilterUser(req, res, username);
    expect(helperfunction.pagination).toHaveBeenCalledWith(req, res, [{ id: 123, key: 'value' }, { id: 456, key: 'value' }]);
    expect(res.send).toHaveBeenCalledWith('paginated data');
  });
});
// test for getuserbuy id
describe('servicegetUserById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it('should return "no task available create a task" if the user file does not exist', () => {
  //   fs.existsSync.mockReturnValue(false);
  //   const req = { params: { id: 1 } };
  //   const res = { send: jest.fn() };
  //   const username = 'testuser';
  //   servicegetUserById(req, res, username);
  //   expect(fs.existsSync).toHaveBeenCalledWith('testuser.json');
  //   expect(res.send).toHaveBeenCalledWith('no task available create a task');
  //   expect(res.status).not.toHaveBeenCalled();
  // });

  // it('should return "no task available" if the user file exists but is empty', () => {
  //   fs.existsSync.mockReturnValue(true);
  //   helperfunction.readUserData.mockReturnValue([]);
  //   const req = { params: { id: 1 } };
  //   const res = { send: jest.fn() };
  //   const username = 'testuser';
  //   servicegetUserById(req, res, username);
  //   expect(fs.existsSync).toHaveBeenCalledWith('testuser.json');
  //   expect(helperfunction.readUserData).toHaveBeenCalledWith('testuser');
  //   expect(res.send).toHaveBeenCalledWith('no task available');
  //   expect(res.status).not.toHaveBeenCalled();
  // });

  // it('should return the user data if the user with the given ID exists', () => {
  //   fs.existsSync.mockReturnValue(true);
  //   helperfunction.readUserData.mockReturnValue([{ id: 1, name: 'John Doe' }]);
  //   const req = { params: { id: 1 } };
  //   const res = { json: jest.fn() };
  //   const username = 'testuser';
  //   servicegetUserById(req, res, username);
  //   expect(fs.existsSync).toHaveBeenCalledWith('testuser.json');
  //   expect(helperfunction.readUserData).toHaveBeenCalledWith('testuser');
  //   expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'John Doe' });
  //   expect(res.status).not.toHaveBeenCalled();
  // });

  it('should return a 404 error if the user with the given ID does not exist', () => {
    fs.existsSync.mockReturnValue(true);
    helperfunction.readUserData.mockReturnValue([{ id: 2, name: 'Jane Smith' }]);
    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const username = 'testuser';
    servicegetUserById(req, res, username);
    expect(fs.existsSync).toHaveBeenCalledWith('testuser.json');
    expect(helperfunction.readUserData).toHaveBeenCalledWith('testuser');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('user not found');
  });

  it('should send a "Task read successfully" message with a 202 status', () => {
    fs.existsSync.mockReturnValue(true);
    helperfunction.readUserData.mockReturnValue([{ id: 1, name: 'John Doe' }]);
    const req = { params: { id: 1 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };
    const username = 'testuser';
    servicegetUserById(req, res, username);
    expect(fs.existsSync).toHaveBeenCalledWith('testuser.json');
    expect(helperfunction.readUserData).toHaveBeenCalledWith('testuser');
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'John Doe' });
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.send).toHaveBeenCalledWith({ message: 'Task read successfully' });
  });
});
