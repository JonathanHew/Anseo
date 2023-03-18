const request = require("supertest");
const app = require("../src/index");
const cookieParser = require('cookie-parser')

app.use(cookieParser())

describe("\n\nPOST /api/login", () => {
  describe("When the Login email AND password are correct", () => {
    test("Should respond with a 200 status code", async () => {
      const bodyData = [{ email: "jonathan@gmail.com", password: "password" }];

      for (const body of bodyData) {
        const response = await request(app).post("/api/login").send(body);
        expect(response.statusCode).toBe(200);
      }
    });

    test("200 status code should specify JSON in content type header", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "jonathan@gmail.com", password: "password" });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    
    test("Should send token on success", async () => {
      const response = await request(app).post("/api/login").send({
        email: "jonathan@gmail.com",
        password: "password",
      });

      expect(response.headers["set-cookie"]).toBeDefined();
    });
    
  });

  describe("When the Login email OR password OR both are empty", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = [
        { email: "jonathan@gmail.com", password: "" },
        { email: "", password: "password" },
        {},
      ];

      for (const body of bodyData) {
        const response = await request(app).post("/api/login").send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 status code should specify JSON in content type header", async () => {
      const response = await request(app).post("/api/login").send({});
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("When the Login email OR password OR both are incorrect", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = [
        { email: "jonathan@gmail.com", password: "wrong_password" },
        { email: "wrong_email", password: "password" },
        { email: "wrong_email", password: "wrong_password" },
      ];

      for (const body of bodyData) {
        const response = await request(app).post("/api/login").send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 status code should specify JSON in content type header", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "wrong_email", password: "wrong_password" });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
});

describe("\n\nPOST /api/register", () => {
  /*
  describe("When a new email and valid password is registered", () => {
    test("Should respond with a 201 status code", async () => {
      const bodyData = [{ email: "jest@gmail.com", password: "password" }];

      for (const body of bodyData) {
        const response = await request(app).post("/api/register").send(body);
        expect(response.statusCode).toBe(201);
      }
    });

    test("201 status code should specify JSON in content type header", async () => {
      const response = await request(app)
        .post("/api/register")
        .send({ email: "jest@gmail.com", password: "password" });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  */

  describe("When a empty email OR empty password or both is registered", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = [
        { email: "jest@gmail.com", password: "" },
        { email: "", password: "password" },
        {},
      ];

      for (const body of bodyData) {
        const response = await request(app).post("/api/register").send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 status code should specify JSON in content type header", async () => {
      const response = await request(app).post("/api/register").send({});
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("When a used email is registered", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = [{ email: "jest@gmail.com", password: "password" }];

      for (const body of bodyData) {
        const response = await request(app).post("/api/register").send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 status code should specify JSON in content type header", async () => {
      const response = await request(app)
        .post("/api/register")
        .send([{ email: "jest@gmail.com", password: "password" }]);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("When a invalid email OR invalid password or both is registered", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = [
        { email: "invalidemail", password: "password" },
        { email: "email@gmail.com", password: "x" },
        { email: "invalidemail", password: "x" },
      ];

      for (const body of bodyData) {
        const response = await request(app).post("/api/register").send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 status code should specify JSON in content type header", async () => {
      const response = await request(app)
        .post("/api/register")
        .send([{ email: "invalidemail", password: "password" }]);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
});
