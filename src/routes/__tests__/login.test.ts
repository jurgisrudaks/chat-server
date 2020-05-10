import request from 'supertest';

import { app } from '../../server';

import { expect } from 'chai';

describe('POST /login', () => {
  const agent = request.agent(app);

  it('should return 200 with username and token', (done) => {
    return agent
      .post('/login')
      .send({
        username: 'tester-1',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.error).to.be.false;
        expect(res.body.username).to.equal('tester-1');
        expect(res.body.token).to.not.be.undefined;

        done();
      });
  });

  it('should return 401 if username already taken', (done) => {
    return agent
      .post('/login')
      .send({
        username: 'tester-2',
      })
      .expect(200)
      .end((firstLoginErr, firstLoginRes) => {
        if (firstLoginErr) return done(firstLoginErr);

        expect(firstLoginRes.error).to.be.false;

        agent
          .post('/login')
          .send({
            username: 'tester-2',
          })
          .expect(401)
          .end((secondLoginErr, res) => {
            if (secondLoginErr) throw secondLoginErr;

            expect(res.error).not.to.be.undefined;
            expect(res.body.error).not.to.be.undefined;
            expect(res.body.error.message).not.to.be.undefined;

            done();
          });
      });
  });

  it('should return 400 if username is not valid', (done) => {
    return agent
      .post('/login')
      .send({
        username: 't1',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.error).not.to.be.undefined;
        expect(res.body.error).not.to.be.undefined;
        expect(res.body.error.message).not.to.be.undefined;

        done();
      });
  });
});
