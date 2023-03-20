const request = require("supertest");
const app = require("../src/index");

//auth routes
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

//lecturer routes
describe("\n\nGET /api/get-sessions", () => {
  describe("When user is authenticated", () => {
    test("Should respond with a 200 status code", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const response = await request(app)
        .get("/api/get-sessions")
        .set("Cookie", [token]);
      expect(response.statusCode).toBe(200);
    });

    test("200 status code should specify JSON in content type header", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const response = await request(app)
        .get("/api/get-sessions")
        .set("Cookie", [token]);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("When user is unauthoried", () => {
    test("Should respond with a 401 status code", async () => {
      const response = await request(app).get("/api/get-sessions");
      expect(response.statusCode).toBe(401);
    });

    test("401 Should come with unauthoried message", async () => {
      const response = await request(app).get("/api/get-sessions");
      expect(response.text).toEqual("Unauthorized");
    });
  });
});

describe("\n\nPOST /api/create-session", () => {
  /*
  describe("When user is authenticated, session name valid and module exists", () => {
    test("Should respond with a 201 status code", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const sessionData = { session_name: "Jest", module_id: 1 };
      const response = await request(app)
        .post("/api/create-session")
        .set("Cookie", [token])
        .send(sessionData);
      expect(response.statusCode).toBe(201);
    });

    test("201 status code should specify JSON in content type header", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const sessionData = { session_name: "Jest", module_id: 1 };
      const response = await request(app)
        .post("/api/create-session")
        .set("Cookie", [token])
        .send(sessionData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  */

  describe("When user is unauthoried", () => {
    test("Should respond with a 401 status code", async () => {
      const response = await request(app).post("/api/create-session");
      expect(response.statusCode).toBe(401);
    });

    test("401 Should come with unauthoried message", async () => {
      const response = await request(app).post("/api/create-session");
      expect(response.text).toEqual("Unauthorized");
    });
  });

  describe("When session name is empty", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const sessionData = { session_name: "", module_id: 1 };
      const response = await request(app)
        .post("/api/create-session")
        .set("Cookie", [token])
        .send(sessionData);
      expect(response.statusCode).toBe(400);
    });

    test("400 Should come with session name cannot be blank message", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const sessionData = { session_name: "", module_id: 1 };
      const response = await request(app)
        .post("/api/create-session")
        .set("Cookie", [token])
        .send(sessionData);
      expect(response.body.errors[0].msg).toEqual(
        "Session name can not be empty!"
      );
    });
  });

  describe("When module id is empty or invalid", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const sessionData = [
        { session_name: "test" },
        { session_name: "test", module_id: -1 },
      ];
      for (session in sessionData) {
        const response = await request(app)
          .post("/api/create-session")
          .set("Cookie", [token])
          .send(sessionData);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 Should come with module_id error message", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const sessionData = [
        { session_name: "test" },
        { session_name: "test", module_id: -1 },
      ];
      for (session in sessionData) {
        const response = await request(app)
          .post("/api/create-session")
          .set("Cookie", [token])
          .send(sessionData);
        expect(response.body.errors[0].msg).toEqual("Please select a module!");
      }
    });
  });
});

describe("\n\nPOST /api/search", () => {
  describe("When user is authenticated, and student being searched exists", () => {
    test("Should respond with a 200 status code", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const studentData = { student_number: "C19472842" };
      const response = await request(app)
        .post("/api/search")
        .set("Cookie", [token])
        .send(studentData);
      expect(response.statusCode).toBe(200);
    });

    test("200 status code should specify JSON in content type header", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const studentData = { student_number: "C19472842" };
      const response = await request(app)
        .post("/api/search")
        .set("Cookie", [token])
        .send(studentData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("When user is unauthoried", () => {
    test("Should respond with a 401 status code", async () => {
      const response = await request(app).post("/api/search");
      expect(response.statusCode).toBe(401);
    });

    test("401 Should come with unauthoried message", async () => {
      const response = await request(app).post("/api/search");
      expect(response.text).toEqual("Unauthorized");
    });
  });

  describe("When student number is not 9 chars long", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const studentData = [
        { student_number: "" },
        { student_number: "1234" },
        { student_number: "1234567890" },
      ];
      for (student in studentData) {
        const response = await request(app)
          .post("/api/search")
          .set("Cookie", [token])
          .send(studentData);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 Should come with student number length error message", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const studentData = [
        { student_number: "" },
        { student_number: "1234" },
        { student_number: "1234567890" },
      ];
      for (student in studentData) {
        const response = await request(app)
          .post("/api/search")
          .set("Cookie", [token])
          .send(studentData);
        expect(response.body.errors[0].msg).toEqual(
          "Student number should be 9 characters long!"
        );
      }
    });
  });

  describe("When student number searched does not exist", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const studentData = { student_number: "C99999999" };
      const response = await request(app)
        .post("/api/search")
        .set("Cookie", [token])
        .send(studentData);
      expect(response.statusCode).toBe(400);
    });

    test("400 Should come with student does not exist error message", async () => {
      const bodyData = { email: "jonathan@gmail.com", password: "password" };
      const res = await request(app).post("/api/login").send(bodyData);
      const token = res.headers["set-cookie"];
      const studentData = { student_number: "C99999999" };
      const response = await request(app)
        .post("/api/search")
        .set("Cookie", [token])
        .send(studentData);
      expect(response.body.errors[0].msg).toEqual(
        "Student does not exist in any sessions!"
      );
    });
  });
});

//student routes
describe("\n\nPOST /api/sign-in", () => {
  /*
  describe("When the student number, name, session_id are all valid", () => {
    test("Should respond with a 201 status code", async () => {
      const bodyData = {
        number: "C00000004",
        name: "Jest",
        session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.statusCode).toBe(201);
    });

    test("201 status code should specify JSON in content type header", async () => {
      const bodyData = {
        number: "C00000002",
        name: "Jest",
        session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("201 status code should come with successful sign in message", async () => {
      const bodyData = {
        number: "C00000003",
        name: "Jest",
        session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        longitude: -6.2817008,
        latitude: 53.356427,
      };
      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.body.message).toEqual("The sign was successful!");
    });
  });
  */

  describe("When the student number OR name OR session_id OR combo are empty", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = [
        {
          number: "",
          name: "Jest",
          session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        },
        {
          number: "C00000005",
          name: "",
          session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        },
        {
          number: "C00000005",
          name: "Jest",
          session_id: "",
        },
        {
          number: "",
          name: "",
          session_id: "",
        },
      ];

      for (body in bodyData) {
        const response = await request(app).post("/api/sign-in").send(bodyData);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 status code should specify JSON in content type header", async () => {
      const bodyData = {
        number: "",
        name: "",
        session_id: "",
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("When the student number has already signed into the session", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = {
        number: "C00000002",
        name: "Jest",
        session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.statusCode).toBe(400);
    });

    test("400 status code should specify JSON in content type header", async () => {
      const bodyData = {
        number: "C00000002",
        name: "Jest",
        session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("400 status code should come with error message saying student has already signed in", async () => {
      const bodyData = {
        number: "C00000002",
        name: "Jest",
        session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.body.errors[0].msg).toEqual("Student already signed in!");
    });
  });

  describe("When the session is no longer active", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = {
        number: "C00000004",
        name: "Jest",
        session_id: "957aa29b-dc0f-48b6-be92-2d6eeebd884b",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.statusCode).toBe(400);
    });

    test("400 status code should specify JSON in content type header", async () => {
      const bodyData = {
        number: "C00000002",
        name: "Jest",
        session_id: "957aa29b-dc0f-48b6-be92-2d6eeebd884b",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("400 status code should come with error message saying session is no longer active", async () => {
      const bodyData = {
        number: "C00000002",
        name: "Jest",
        session_id: "957aa29b-dc0f-48b6-be92-2d6eeebd884b",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.body.errors[0].msg).toEqual(
        "Session is no longer active!"
      );
    });
  });

  describe("When the student name is not alphabetic", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = {
        number: "C00000004",
        name: "J0n@|h@n",
        session_id: "957aa29b-dc0f-48b6-be92-2d6eeebd884b",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.statusCode).toBe(400);
    });

    test("400 status code should specify JSON in content type header", async () => {
      const bodyData = {
        number: "C00000004",
        name: "J0n@|h@n",
        session_id: "957aa29b-dc0f-48b6-be92-2d6eeebd884b",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("400 status code should come with error message saying name must be aplhabetic", async () => {
      const bodyData = {
        number: "C00000005",
        name: "J0n@|h@n",
        session_id: "31ebd334-8d03-4e4d-a817-a991a53a3b4f",
        longitude: -6.2817008,
        latitude: 53.356427,
      };

      const response = await request(app).post("/api/sign-in").send(bodyData);
      expect(response.body.errors[0].msg).toEqual("Name must be alphabetic.");
    });
  });
});

describe("\n\nPOST /api/pin", () => {
  describe("When the PIN number is valid and exists", () => {
    test("Should respond with a 200 status code", async () => {
      const bodyData = {
        session_pin: "Jhr2rQ",
      };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.statusCode).toBe(200);
    });

    test("200 status code should specify JSON in content type header", async () => {
      const bodyData = {
        session_pin: "Jhr2rQ",
      };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("When the PIN number is not 6 chars long", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = [
        { session_pin: "" },
        { session_pin: "123" },
        { session_pin: "123456789" },
      ];

      for (body in bodyData) {
        const response = await request(app).post("/api/pin").send(bodyData);
        expect(response.statusCode).toBe(400);
      }
    });

    test("400 status code should specify JSON in content type header", async () => {
      const bodyData = {
        session_pin: "",
      };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("400 status code should come with error message stating PIN must be 6 chars long", async () => {
      const bodyData = {
        session_pin: "",
      };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.body.errors[0].msg).toEqual(
        "PIN Code Should be 6 characters long!"
      );
    });
  });

  describe("When the PIN number is 6 chars but does not exist", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = { session_pin: "123456" };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.statusCode).toBe(400);
    });

    test("400 status code should specify JSON in content type header", async () => {
      const bodyData = {
        session_pin: "123456",
      };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("400 status code should come with error message stating PIN does not exist", async () => {
      const bodyData = {
        session_pin: "123456",
      };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.body.errors[0].msg).toEqual(
        "PIN does not exist, Please double check and try again!"
      );
    });
  });

  describe("When the PIN number is not alphanumeric", () => {
    test("Should respond with a 400 status code", async () => {
      const bodyData = { session_pin: "123%@$" };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.statusCode).toBe(400);
    });

    test("400 status code should specify JSON in content type header", async () => {
      const bodyData = {
        session_pin: "123%@$",
      };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("400 status code should come with error stating PIN must only contain letters and numbers", async () => {
      const bodyData = {
        session_pin: "123%@$",
      };

      const response = await request(app).post("/api/pin").send(bodyData);
      expect(response.body.errors[0].msg).toEqual(
        "PIN Code should only contain letters and numbers!"
      );
    });
  });
});
