const http = require('http');




var MAX_SIMULTANEOUS  = 1000


var lastCountSuccess = 0
setInterval(function () {
    console.log((countSuccess - lastCountSuccess) + "/s", simultaneousCount)
    lastCountSuccess = countSuccess
}, 1000)



var simultaneousCount = 0
var countSuccess = 0
setInterval(function () {
    if (simultaneousCount > MAX_SIMULTANEOUS) return

    for (let _ = 0; _ < 10; _++) {
        simultaneousCount++
        http.get('http://localhost/findVoo/Guarulhos%2C%20GRU%20-%20Brasil/Lisboa%2C%20LIS%20-%20Portugal/25%2F11%2F2025', (res) => {
            // console.log(res.statusCode)
            countSuccess++
            simultaneousCount--
          }).on("error", (err) => {
            simultaneousCount--
            console.log("Error: " + err.message);
          });
    }

})




