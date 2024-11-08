var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session')

var search = require("./includes/search.js").search;
var findVoo = require("./includes/voo.js").findVoo;

var tickets = []





var users = [{
    nome: "Denilson Costa Oliveira",
    cpf: "12312312300",
    tel: "77981495226",
    password: "senai",
    nascimento: "25-04-1995"
}]

function addTickets(d) {
    d.cod = "No horário"
    d.status = d.payType == "card" ? "ok" : "pay"
    if (d.payType != "card") d.cod = "aguardando pagamento".toUpperCase()
    d.duration = "2h 30min"
    d.aeronave = "airbus a320"

    d.ticketId = (Math.random() + 1).toString(36).substring(7).toUpperCase()
    tickets.push(d)
}

function getSeats() {
    var r = {}
    for (let col = 0; col < 6; col++) {
        for (let row = 0; row < 12; row++) {
            r[["A", "B", "C", "D", "E", "F"][col] + row] = parseInt(Math.random() * 2) == 1;
        }
    }
    return r
}


function getPix() {
    return { url: "imgs/pix.png" }
}

function getBoleto() {
    return { url: "imgs/boleto.png" }
}

function getTickets() {
    return tickets
}

function getTicket(id) {
    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].ticketId == id) return tickets[i]
    }
}

function editTicket(id, data) {
    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].ticketId == id) {
            tickets[i] = {...tickets[i], ...data}
            break
        }
    }
    
}

function cancelTicket(id) {
    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].ticketId == id) {
            tickets.splice(i, 1);
            break
        }
    }
    
}



function checkin(id) {
    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].ticketId == id) {
            tickets[i].status = "confirmed"
            break
        }
    }

    return {success: true}
}

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


app.use(express.static('.'))


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 7 * 24 * 60 * 1000 }}))



app.post('/login', function (req, res) {
    for (let i = 0; i < users.length; i++) {
        if (req.body.cpf == users[i].cpf && req.body.password == users[i].password) {
            req.session.isLogged = true
            req.session.user = users[i]
            console.log(users[i], "login")
            break
        }
    }
    res.redirect("/");
});


var c = 0;
app.all('*', function (req, res, next) {
    c++

    if(!req.session.isLogged) {
        res.send({success: false, msg: "unauthorized"})
    } else {
        next();
    }
    
});

// var lastC = 0
// setInterval(function () {
//     console.log((c - lastC) + "/s")
//     lastC = c
// }, 100)



app.get('/getUser', function (req, res) {
    res.send(req.session.user);
});




app.get('/search/:query', function (req, res) {
    res.send(search(req.params.query));
});


app.get('/findVoo/:origem/:destino/:ida', function (req, res) {
    res.send(findVoo(req.params.origem, req.params.destino, req.params.ida));
});


app.get('/getseats/:id', function (req, res) {
    res.send(getSeats(req.params.id));
});

app.get('/getPix', async function (req, res) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send(getPix());
});

app.get('/getBoleto', async function (req, res) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send(getBoleto());
});


app.post('/finish/:id', function (req, res) {
    var id = req.params.id
    console.log(req.body)
    addTickets(req.body)
    res.send({ success: true });
});

app.get('/getTickets', function (req, res) {
    res.send(getTickets());
});


app.get('/getTicket/:id', function (req, res) {
    res.send(getTicket(req.params.id));
});






app.post('/editTicket/:id', function (req, res) {
    editTicket(req.params.id, req.body)

    res.send({success: true});
});

app.get('/cancelTicket/:id', function (req, res) {
    cancelTicket(req.params.id)

    res.send({success: true});
});




app.get('/segundavia', function (req, res) {
    res.download("imgs/test.pdf");
});

app.get('/checkin/:id', function (req, res) {
    var ticketId = req.params.id
    res.send(checkin(ticketId))
});

app.get('/downloadboardingpass', function (req, res) {
    res.download("imgs/test.pdf");
});


app.get('/logout', function (req, res) {
    req.session.isLogged = false
    req.session.user = {}

    res.redirect("/");
});


app.listen(80);

module.exports = app