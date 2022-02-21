import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";


let connection: Connection
describe("Show User Profile Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
       await connection.dropDatabase();
       await connection.close()
    });

    it("should be able to return a profile's user by id", async () => {
        await request(app).post("/api/v1/users").send({    
            name: "profile",
            email: "profile@gmail.com",
            password: "1234"
        });

        const session = await request(app).post("/api/v1/sessions").send({
            email: "profile@gmail.com",
            password: "1234"
        });
        
        const { token } = session.body;

        const response = await request(app).get("/api/v1/profile").set({
           Authorization: `Bearer ${ token }`
        });

        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("created_at");
        expect(response.body).toHaveProperty("updated_at");
    });
});