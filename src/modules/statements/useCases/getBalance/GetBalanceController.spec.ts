import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection
describe("Get Balance Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get user's balance", async () => {
        await request(app).post("/api/v1/users").send({    
            name: "TestBalance",
            email: "testbalance@gmail.com",
            password: "1234"
        });

        const session = await request(app).post("/api/v1/sessions").send({
            email: "testbalance@gmail.com",
            password: "1234"
        });
        
        const { token } = session.body;

        await request(app).post("/api/v1/statements/deposit").send({
            amount: 200,
            description: "testBalanceDeposit"
        }).set({ 
           Authorization: `Bearer ${ token }`
        });

        await request(app).post("/api/v1/statements/withdraw").send({
            amount: 50,
            description: "testBalanceWithdraw"
        }).set({ 
           Authorization: `Bearer ${ token }`
        });

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${ token }`
        });

        expect(response.status).toBe(200);
        expect(response.body.balance).toBe(150);
        expect(response.body).toHaveProperty("statement");    
    });
});