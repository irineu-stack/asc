const request = require("supertest");
const app = require("./index.js");

describe("Space test suite", () => {
  it("tests /destinations endpoints", async () => {
    // const response = await request(app).get("/getUsers");
    // console.log(response.body)


    var res = await request(app).post("/login")
    .send({cpf: '12312312300'})
    .send({password: '123456'})

    console.log(res.body)
    res = await request(app).get("/getUsers");
    console.log(res.body)

    // expect(response.body).toEqual(["Mars", "Moon", "Earth", "Mercury", "Venus", "Jupiter"]);
    // expect(response.body).toHaveLength(6);
    // expect(response.statusCode).toBe(200);
    // // Testing a single element in the array
    // expect(response.body).toEqual(expect.arrayContaining(["Earth"]));
  });

});

