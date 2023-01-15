import app from './index.js';
import supertest from 'supertest';
//import { faker } from '@faker-js/faker';


it('Testing to see if Jest works', () => {
  expect(true).toBe(true);
});

// it('[GET] - Call /init with success', async () => {
//   await supertest(app).get('/init').expect(204);
// });


// TODO: can be useful if we decide to use faker
/*const dummyUser = {
  username: faker.internet.userName().toLowerCase().replaceAll(/[._\s]/g, '-'),
  password: dummyPassword,
  passwordCheck: dummyPassword,
  email: faker.internet.email(),
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
};*/

beforeAll(async () => {

});

it('[GET] - Check the list of lends /api/lends with success', async () => {
    await supertest(app)
        .get('/api/lends')
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.success).toBeTruthy();
            expect(result.data.length).toBe(0);
            expect(Array.isArray(result.data)).toBeTruthy();
            expect(result.pageNumber).toBe(1);
            expect(result.pageSize).toBe(10);
            expect(result.totalPages).toBe(1);
        });
    });

it('[POST] - create a new lend /api/lends', async () => {
    await supertest(app)
        .post('/api/lends/')
        .send({
            bookId: "25a759e-9426-11ed-a1eb-0242ac120004",
            userId: "1"
        })
        .expect(201)
        .then((response) => {

            const result = response.body;
            expect(result.success).toBeTruthy();
            //expect(result.data).toHaveLength(8);
            //expect(Array.isArray(result.data)).toBeTruthy();

            const lend = result.data;
            expect(lend).toHaveProperty('id');
            expect(lend).toHaveProperty('bookId');
            expect(lend).toHaveProperty('userId');
            expect(lend).toHaveProperty('borrowingDate');
            expect(lend).toHaveProperty('expirationDate');
        });

    // Also, create a 2nd lend object, to see if the post works
    // (the 1st lend object will be edited in the next test)
    await supertest(app)
        .post('/api/lends/')
        .send({
            bookId: "35a759e-9426-11ed-a1eb-0242ac120004",
            userId: "2"
        })
        .expect(201)

});

it('[PUT] - update a lend /api/lends/id', async () => {
    const lends = await supertest(app).get('/api/lends').expect(200);
    const firstLend = lends.body.data[0];

    // use this console log to check the lend before the update.
    // This test's final result will be different but both lends will have
    // the same id.
    console.log(firstLend);

    await supertest(app)
        .put(`/api/lends/${firstLend.id}`)
        .send({
            bookId: "65a759e-9426-11ed-a1eb-0242ac120004",
            userId: 6,
            borrowingDate: "2023-01-16",
            expirationDate: "2023-02-15",
            returnedDate: "2023-02-15"
        })
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.success).toBeTruthy();
        });

    await supertest(app)
        .get(`/api/lends/${firstLend.id}`)
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.success).toBeTruthy();
            expect(result.data.bookId).toBe('65a759e-9426-11ed-a1eb-0242ac120004');
            expect(result.data.userId).toBe(6);
            expect(result.data.borrowingDate).toBe('2023-01-16');
            expect(result.data.expirationDate).toBe('2023-02-15');
            expect(result.data.returnedDate).toBe('2023-02-15');
        });
});

it('[GET] - get Lends with pagination /api/lends?pageNumber=2&pageSize=1', async () => {
    await supertest(app)
        .get('/api/lends?pageNumber=2&pageSize=1')
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.success).toBeTruthy();
            expect(result.data.length).toBe(1);
            expect(Array.isArray(result.data)).toBeTruthy();

            const lend = result.data[0];
            expect(lend).toHaveProperty('id');
            expect(lend).toHaveProperty('bookId');
            expect(lend).toHaveProperty('userId');
            expect(lend).toHaveProperty('borrowingDate');
            expect(lend).toHaveProperty('expirationDate');
            expect(lend).toHaveProperty('returnedDate');

            expect(result.pageNumber).toBe(2);
            expect(result.pageSize).toBe(1);
            expect(result.totalPages).toBe(2);
        });
});

it('[DELETE] - delete a lend /api/lends/id', async () => {
    const lends = await supertest(app).get('/api/lends').expect(200);
    const firstLend = lends.body.data[0];

    // use this console log to check the lend before the update.
    // This test's final result will be different but both lends will have
    // the same id.
    console.log(firstLend);

    await supertest(app)
        .delete(`/api/lends/${firstLend.id}`)
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.success).toBeTruthy();
        });

    await supertest(app)
        .get(`/api/lends/${firstLend.id}`)
        .expect(404)
        .then((response) => {
            const result = response.body;
            expect(result.success).toBeFalsy();
        });

});

/*
it('[GET] - Check the list of books /api/books with success', async () => {
  await supertest(app)
    .get('/api/books')
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
      expect(result.data.length).toBeGreaterThan(1);
      expect(Array.isArray(result.data)).toBeTruthy();

      const user = result.data.shift();

      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('surname');
      expect(user).toHaveProperty('author');
      expect(user).toHaveProperty('active');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('lastLogin');
      expect(user).toHaveProperty('_v1');

      expect(typeof user.active === 'boolean').toBeTruthy();
      expect(typeof user.author === 'boolean').toBeTruthy();
      expect(user.lastLogin).toBeNull();

      expect(user).not.toHaveProperty('isAdmin');
      expect(user).not.toHaveProperty('password');
    });
});

it('[GET] - Fail to Call /api/users without Bearer', async () => {
  await supertest(app)
    .get('/api/users')
    .expect(401)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(2001);
      expect(result.error).toBe('Unauthorized');
    });
});

it('[GET] - Call /api/users/:id with success', async () => {
  await supertest(app)
    .get(`/api/users/${firstUser._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      const result = response.body;

      expect(result.success).toBeTruthy();
      expect(result.data.length).toBe(1);
      expect(Array.isArray(result.data)).toBeTruthy();

      const user = result.data.shift();

      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('surname');
      expect(user).toHaveProperty('author');
      expect(user).toHaveProperty('active');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('lastLogin');
      expect(user).toHaveProperty('_v1');

      expect(typeof user.active === 'boolean').toBeTruthy();
      expect(typeof user.author === 'boolean').toBeTruthy();

      expect(user).not.toHaveProperty('isAdmin');
      expect(user).not.toHaveProperty('password');
    });
});

it('[GET] - Fail to Call /api/users/:id without Bearer', async () => {
  await supertest(app)
    .get('/api/users/it-does-not-matter ')
    .expect(401)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(2001);
      expect(result.error).toBe('Unauthorized');
    });
});

it('[GET] - Fail to Call /api/users/:id', async () => {
  await supertest(app)
    .get('/api/users/it-does-not-matter-the-id')
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeFalsy();
    });
});

it('[POST] - Create a new user /api/users/register with success', async () => {
  await supertest(app)
    .post('/api/users/register')
    .set('Authorization', `Bearer ${token}`)
    .send(dummyUser)
    .expect(201)
    .then((response) => {
      const result = response.body;

      expect(result.success).toBeTruthy();
      expect(result.data).toHaveLength(1);
      expect(Array.isArray(result.data)).toBeTruthy();

      const user = result.data.shift();

      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('surname');
      expect(user).toHaveProperty('author');
      expect(user).toHaveProperty('active');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('lastLogin');
      expect(user).toHaveProperty('_v1');

      expect(user.password).not.toBe(dummyUser.password);

      expect(typeof user.active === 'boolean').toBeTruthy();
      expect(user.active).toBeTruthy();

      expect(typeof user.author === 'boolean').toBeTruthy();
      expect(user.author).not.toBeTruthy();

      expect(user.lastLogin).toBeNull();
      expect(user.createdAt).not.toBeNull();

      expect(user).not.toHaveProperty('isAdmin');
      expect(user).not.toHaveProperty('password');
    });
});

it('[GET] - Call /api/posts with success', async () => {
  await supertest(app)
    .get('/api/posts')
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
      expect(result.data.length).toBeGreaterThan(1);
      expect(Array.isArray(result.data)).toBeTruthy();

      const post = result.data.shift();
      expect(post).toHaveProperty('_id');
      expect(post).toHaveProperty('author');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('public');
      expect(post).toHaveProperty('date');
      expect(post).toHaveProperty('updated');
      expect(post).toHaveProperty('_v1');
      expect(post.public).toBeTruthy();

      const author = post.author;
      expect(author).toHaveProperty('_id');
      expect(author).toHaveProperty('username');
      expect(author).toHaveProperty('email');

      expect(Object.keys(author)).toHaveLength(3);
    });
});

it('[GET] - Call /api/posts/outdated', async () => {
  await supertest(app)
    .get('/api/posts/outdated')
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
      expect(result.data.length).toBeGreaterThan(1);
      expect(Array.isArray(result.data)).toBeTruthy();

      const post = result.data.shift();
      expect(post).toHaveProperty('_id');
      expect(post).toHaveProperty('author');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('public');
      expect(post).toHaveProperty('date');
      expect(post).toHaveProperty('updated');
      expect(post).toHaveProperty('_v1');
      expect(post.public).not.toBeTruthy();

      const author = post.author;
      expect(author).toHaveProperty('_id');
      expect(author).toHaveProperty('username');
      expect(author).toHaveProperty('email');

      expect(Object.keys(author)).toHaveLength(3);
    });
});

it('[GET] - Call /api/posts/:id', async () => {
  const posts = await supertest(app).get('/api/posts').expect(200);
  const firstPost = posts.body.data[0];

  await supertest(app)
    .get(`/api/posts/${firstPost._id}`)
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
      expect(result.data).toHaveLength(1);
      expect(Array.isArray(result.data)).toBeTruthy();

      const post = result.data.shift();
      expect(post).toHaveProperty('_id');
      expect(post).toHaveProperty('author');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('public');
      expect(post).toHaveProperty('date');
      expect(post).toHaveProperty('updated');
      expect(post).toHaveProperty('_v1');

      expect(post._id).toBe(firstPost._id);

      const author = post.author;
      expect(author).toHaveProperty('_id');
      expect(author).toHaveProperty('username');
      expect(author).toHaveProperty('email');

      expect(Object.keys(author)).toHaveLength(3);
    });
});

it('[GET] - get all post by date /api/posts?date=2021-10-01', async () => {
  await supertest(app)
    .get('/api/posts?date=2021-10-01')
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
      expect(result.data.length).toBeGreaterThan(1);
      expect(Array.isArray(result.data)).toBeTruthy();

      const post = result.data.shift();
      expect(post).toHaveProperty('_id');
      expect(post).toHaveProperty('author');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('public');
      expect(post).toHaveProperty('date');
      expect(post).toHaveProperty('updated');
      expect(post).toHaveProperty('_v1');

      expect(new Date(post.updated).getTime()).toBeGreaterThan(new Date('2021-10-01').getTime());

      const author = post.author;
      expect(author).toHaveProperty('_id');
      expect(author).toHaveProperty('username');
      expect(author).toHaveProperty('email');

      expect(Object.keys(author)).toHaveLength(3);
    });
});

it('[GET] - Fail to get all post by date /api/posts?date=2023-10-01', async () => {
  await supertest(app)
    .get('/api/posts?date=2023-10-01')
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
      expect(result.data).toHaveLength(0);
      expect(Array.isArray(result.data)).toBeTruthy();
    });
});

it('[POST] - create a new post /api/posts', async () => {
  await supertest(app)
    .post('/api/posts/')
    .set('Authorization', `Bearer ${token}`)
    .send({
      user: `${firstUser.username}`,
      date: '2022-05-20',
      title: 'Corso Node',
      content: 'Lorem ipsum',
    })
    .expect(201)
    .then((response) => {
      const result = response.body;

      expect(result.success).toBeTruthy();
      expect(result.data).toHaveLength(1);
      expect(Array.isArray(result.data)).toBeTruthy();

      const post = result.data.shift();
      expect(post).toHaveProperty('_id');
      expect(post).toHaveProperty('author');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('public');
      expect(post).toHaveProperty('date');
      expect(post).toHaveProperty('updated');
      expect(post).toHaveProperty('_v1');

      const author = post.author;
      expect(author).toHaveProperty('_id');
      expect(author).toHaveProperty('username');
      expect(author).toHaveProperty('email');

      expect(author.username).toBe(firstUser.username);

      expect(Object.keys(author)).toHaveLength(3);
    });
});

it('[POST] - fail to create a new post /api/posts without auth', async () => {
  await supertest(app)
    .post('/api/posts/')
    .expect(401)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(2001);
      expect(result.error).toBe('Unauthorized');
    });
});

it('[POST] - fail to create a new post with a wrong user /api/posts', async () => {
  await supertest(app)
    .post('/api/posts/')
    .set('Authorization', `Bearer ${token}`)
    .send({
      user: `dummy-username-fake`,
      date: '2022-05-20',
      title: 'Corso Node',
      content: 'Lorem ipsum',
    })
    .expect(404)
    .then((response) => {
      const result = response.body;
      expect(result.error).toBe('User does not exist');
    });
});

it('[POST] - create a new post with current user /api/posts', async () => {
  const response = await supertest(app)
    .post('/api/login')
    .send({
      email: dummyUser.email,
      password: dummyUser.password,
    })
    .expect(200);
  expect(response.body.success).toBeTruthy();

  token = response.body.data[0].token;

  await supertest(app)
    .post('/api/posts/')
    .set('Authorization', `Bearer ${token}`)
    .send({
      date: '2022-05-20',
      title: 'Corso Node',
      content: 'Lorem ipsum',
    })
    .expect(201)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
      expect(Array.isArray(result.data)).toBeTruthy();
      expect(result.data).toHaveLength(1);

      const post = result.data.shift();
      expect(post).toHaveProperty('_id');
      expect(post).toHaveProperty('author');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('public');
      expect(post).toHaveProperty('date');
      expect(post).toHaveProperty('updated');
      expect(post).toHaveProperty('_v1');

      const author = post.author;
      expect(author).toHaveProperty('_id');
      expect(author).toHaveProperty('username');
      expect(author).toHaveProperty('email');

      expect(author.username).toBe(dummyUser.username);

      expect(Object.keys(author)).toHaveLength(3);
    });
});

it('[PUT] - update a post /api/posts/:id', async () => {
  const posts = await supertest(app).get('/api/posts').expect(200);
  const firstPost = posts.body.data[0];

  await supertest(app)
    .get(`/api/posts/${firstPost._id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Updated title',
      content: 'Updated content',
      public: true,
    })
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
    });
});

it('[PUT] - fail to update a post /api/posts/:id', async () => {
  await supertest(app)
    .put('/api/posts/what-an-id')
    .expect(401)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(2001);
      expect(result.error).toBe('Unauthorized');
    });
});

it('[PUT] - Call /api/users/:id/password-update as admin', async () => {
  const response = await supertest(app)
    .post('/api/login')
    .send({
      email: 'admin@admin.local',
      password: 'qwerty123!',
    })
    .expect(200);
  expect(response.body.success).toBeTruthy();
  token = response.body.data[0].token;

  await supertest(app)
    .put(`/api/users/${firstUser._id}/password-update`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      //current: 'password', // not needed for admin
      password: 'new-password',
      passwordCheck: 'new-password',
    })
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeTruthy();
      expect(result.data).toBe('Password updated.');
    });
});

it('[PUT] - fail passwordCheck /api/users/:id/password-update', async () => {
  await supertest(app)
    .put(`/api/users/${firstUser._id}/password-update`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      current: 'password',
      password: 'new-password',
      passwordCheck: 'new-password1233',
    })
    .expect(400)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeFalsy();
      expect(result.errors).toBe('Error: Passwords do not match');
    });
});

it('[PUT] - fail auth /api/users/:id/password-update', async () => {
  await supertest(app)
    .put(`/api/users/${firstUser._id}/password-update`)
    .send({
      current: 'password',
      password: 'new-password',
      passwordCheck: 'new-password',
    })
    .expect(401)
    .then((response) => {
      const result = response.body;
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(2001);
      expect(result.error).toBe('Unauthorized');
    });
});

*/
