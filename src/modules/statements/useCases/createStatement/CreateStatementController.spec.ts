import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection
describe("Create Statement Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new statement deposit", async () => {
        await request(app).post("/api/v1/users").send({    
            name: "TestStatementDeposit",
            email: "teststatementdeposit@gmail.com",
            password: "1234"
        });

        const session = await request(app).post("/api/v1/sessions").send({
            email: "teststatementdeposit@gmail.com",
            password: "1234"
        });
        
        const { token } = session.body;

        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100,
            description: "testDeposit"
        }).set({ 
           Authorization: `Bearer ${ token }`
        });
        
        expect(response.status).toBe(201);
        expect(response.body.description).toBe("testDeposit");
        expect(response.body.amount).toBe(100);
        expect(response.body.type).toBe("deposit");
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("user_id");
        expect(response.body).toHaveProperty("created_at");
        expect(response.body).toHaveProperty("updated_at");
    });

    it("should be able to create a new statement withdraw", async () => {
        await request(app).post("/api/v1/users").send({    
            name: "TestStatementWithdraw",
            email: "teststatementwithdraw@gmail.com",
            password: "1234"
        });

        const session = await request(app).post("/api/v1/sessions").send({
            email: "teststatementwithdraw@gmail.com",
            password: "1234"
        });
        
        const { token } = session.body;

        await request(app).post("/api/v1/statements/deposit").send({
            amount: 200,
            description: "testDepositWithdraw"
        }).set({ 
           Authorization: `Bearer ${ token }`
        });

        const response = await request(app).post("/api/v1/statements/withdraw").send({
            amount: 50,
            description: "testWithdraw"
        }).set({ 
           Authorization: `Bearer ${ token }`
        });
                
        expect(response.status).toBe(201);
        expect(response.body.description).toBe("testWithdraw");
        expect(response.body.amount).toBe(50);
        expect(response.body.type).toBe("withdraw");
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("user_id");
        expect(response.body).toHaveProperty("created_at");
        expect(response.body).toHaveProperty("updated_at");
    });
});