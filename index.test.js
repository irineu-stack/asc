const request = require("supertest");
const app = require("./index.js");


var sessionCookie = ""
describe("test", () => {
  it("login", async () => {
    // login com credencias incorretas 
    // var res = await request(app)
    //   .post('/login')
    //   .send({ cpf: "12312312300", password: "123" })

    // console.log(res.body)

    // login com credencias corretas 
    var res = await request(app)
      .post('/login')
      .send({ cpf: "12312312300", password: "123456" })

 
    // guarda o cookie da sessão para as proximas requisição
    sessionCookie = res.header["set-cookie"][0].split("connect.sid=")[1].split(";")[0]
  });







  it("search", async () => {
    var res = await request(app).get("/search/GRU").set("Cookie", ["connect.sid=" + sessionCookie])
    expect(res.body.map((a) => a.id).indexOf("GUARULHOS_GRU_CITY")).not.toBe(-1)

    var res = await request(app).get("/search/gru").set("Cookie", ["connect.sid=" + sessionCookie])
    expect(res.body.map((a) => a.id).indexOf("GUARULHOS_GRU_CITY")).not.toBe(-1)

    var res = await request(app).get("/search/GUARULHOS").set("Cookie", ["connect.sid=" + sessionCookie])
    expect(res.body.map((a) => a.id).indexOf("GUARULHOS_GRU_CITY")).not.toBe(-1)

    var res = await request(app).get("/search/guarulhos").set("Cookie", ["connect.sid=" + sessionCookie])
    expect(res.body.map((a) => a.id).indexOf("GUARULHOS_GRU_CITY")).not.toBe(-1)

    var res = await request(app).get("/search/gua").set("Cookie", ["connect.sid=" + sessionCookie])
    expect(res.body.map((a) => a.id).indexOf("GUARULHOS_GRU_CITY")).not.toBe(-1)

    var res = await request(app).get("/search/brasil").set("Cookie", ["connect.sid=" + sessionCookie])
    expect(res.body.map((a) => a.id).indexOf("GUARULHOS_GRU_CITY")).not.toBe(-1)
  });






  it("find voo", async () => {
    var res = await request(app).get("/findVoo/Guarulhos%2C%20GRU%20-%20Brasil/Lisboa%2C%20LIS%20-%20Portugal/25%2F11%2F2025").set("Cookie", ["connect.sid=" + sessionCookie])

    res.body.forEach(function (voo) {
      expect(voo.origin).toBe("Guarulhos, GRU - Brasil")
      expect(voo.destino).toBe("Lisboa, LIS - Portugal")
      expect(voo.ida).toBe("25/11/2025")
    })

  });



  it("get seats", async () => {
    var res = await request(app).get("/getseats/LA158").set("Cookie", ["connect.sid=" + sessionCookie])
    expect(res.body).toEqual({ "A0": false, "A1": false, "A2": false, "A3": false, "A4": true, "A5": true, "A6": true, "A7": true, "A8": false, "A9": true, "A10": true, "A11": true, "B0": true, "B1": true, "B2": true, "B3": false, "B4": true, "B5": false, "B6": false, "B7": true, "B8": false, "B9": true, "B10": true, "B11": false, "C0": false, "C1": false, "C2": false, "C3": true, "C4": true, "C5": false, "C6": true, "C7": false, "C8": false, "C9": false, "C10": true, "C11": false, "D0": false, "D1": true, "D2": true, "D3": true, "D4": true, "D5": false, "D6": true, "D7": false, "D8": true, "D9": false, "D10": false, "D11": false, "E0": true, "E1": true, "E2": false, "E3": false, "E4": false, "E5": true, "E6": false, "E7": true, "E8": false, "E9": false, "E10": true, "E11": false, "F0": false, "F1": false, "F2": false, "F3": true, "F4": false, "F5": true, "F6": true, "F7": true, "F8": true, "F9": true, "F10": true, "F11": false })
  });


  it("tickets", async () => {
    var res = await request(app).post("/finish/LA158")
      .send({
        "origem": "Guarulhos, GRU - Brasil",
        "destino": "Lisboa, LIS - Portugal",
        "start": "09:45",
        "end": "16:45",
        "id": "LA158",
        "assento": "D3",
        "ida": "25/05/2024",
        "payType": "card",
        "nome": "Denilson Costa Oliveira",
        "cpf": "12312312300",
        "tel": "77981495226",
        "password": "123456",
        "nascimento": "25-04-1995"
      }).set("Cookie", ["connect.sid=" + sessionCookie])

    var res = await request(app).get('/getTickets').set("Cookie", ["connect.sid=" + sessionCookie])

    expect(res.body[0].origem).toBe("Guarulhos, GRU - Brasil")
    expect(res.body[0].destino).toBe("Lisboa, LIS - Portugal")
    expect(res.body[0].ida).toBe("25/05/2024")
  });



  it("checkin", async () => {
    // apenas pega o ticketId 
    var res = await request(app).get("/getTickets").set("Cookie", ["connect.sid=" + sessionCookie])
    var ticketId = res.body[0].ticketId


    var res = await request(app).get("/checkin/" + ticketId).set("Cookie", ["connect.sid=" + sessionCookie])
    
    var res = await request(app).get("/getTickets").set("Cookie", ["connect.sid=" + sessionCookie])
    expect(res.body[0].status).toBe("confirmed")
    expect(res.body[0].origem).toBe("Guarulhos, GRU - Brasil")
    expect(res.body[0].destino).toBe("Lisboa, LIS - Portugal")
    expect(res.body[0].ida).toBe("25/05/2024")
    
  })




});
