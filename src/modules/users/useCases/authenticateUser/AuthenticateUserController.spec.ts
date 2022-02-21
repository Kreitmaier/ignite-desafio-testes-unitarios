import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection
describe("Authenticate User Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to authenticate an user", async () => {
        await request(app).post("/api/v1/users").send({
            name: "autenticateUserTest",
            email: "authenticateusertest@gmail.com",
            password: "1234"
        });

        const response = await request(app).post("/api/v1/sessions").send({
            email: "authenticateusertest@gmail.com",
            password: "1234"
        });

        expect(response.body).toHaveProperty("user");
        expect(response.body).toHaveProperty("token");
    });
});