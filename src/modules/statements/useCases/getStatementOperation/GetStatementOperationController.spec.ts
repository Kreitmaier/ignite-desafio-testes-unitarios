import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Get Statement Operation Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get statement operation by id_statement", async () => {
        await request(app).post("/api/v1/users").send({    
            name: "TestGetStatementOperation",
            email: "testgetstatementoperation@gmail.com",
            password: "1234"
        });

        const session = await request(app).post("/api/v1/sessions").send({
            email: "testgetstatementoperation@gmail.com",
            password: "1234"
        });
        
        const { token } = session.body;

        const statement = await request(app).post("/api/v1/statements/deposit").send({
            amount: 200,
            description: "StatementOperationTest"
        }).set({ 
           Authorization: `Bearer ${ token }`
        });

        const response = await request(app).get(`/api/v1/statements/${statement.body.id}`).set({
            Authorization: `Bearer ${ token }`
        });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(statement.body.id);
    });
});

