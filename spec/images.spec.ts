import app from '@server';
import supertest from 'supertest';

import { Response, SuperTest, Test } from 'supertest';
import {pErr} from '@shared';
import {OK} from 'http-status-codes';
const baseUrl = '/images/';

describe('Images Routes', () => {

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });
    describe('GET /', () => {
        it('returns status code 200', (done) => {
            agent.get(baseUrl)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    done();
                });
        });
    });
});
