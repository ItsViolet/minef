let l;
function main() {
    var myHeaders = new Headers();
    myHeaders.append("key", "ThePriests");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    var res = null;
    fetch("http://mc.syrinx.life:21936/v1/server", requestOptions)
        .then(response => response.text())
        .then(result => {
            var e = JSON.parse(result);
            l = e.health.uptime;
            document.getElementById('a').innerText = l;
            document.getElementById('uptime').innerText = "Time online: " + new Date(e.health.uptime * 1000).toISOString().substr(11, 8) + "s";
            setInterval(()=>{
                document.getElementById('a').innerText = parseInt(document.getElementById('a').innerHTML)+1;
                document.getElementById('uptime').innerText = "Time online: " + new Date(parseInt(document.getElementById('a').innerHTML) * 1000).toISOString().substr(11, 8) + "s";
            },1000);
            document.getElementById('oplayers').innerText = "Players online: " + e.onlinePlayers;
            document.getElementById('on').innerText = "Server status: ONLINE";
            document.getElementById('kk').style.visibility = "visible";
        })
        .catch(error => {
            document.getElementById('on').innerText = "Server status: OFFLINE";

            return;
        });
    fetch("http://mc.syrinx.life:21936/v1/players", requestOptions)
        .then(response => response.text())
        .then(result => {
            var e = JSON.parse(result);
            document.getElementById('onp').innerHTML = "";
            console.log(e);
            
            e.map(val => {
                document.getElementById('onp').innerHTML += ("<h3 onclick=\"inv('" + val.uuid + "');\" id='" + val.uuid + "'>- " + val.displayName + "</h3>")});
            if (e.length == 0) document.getElementById('onp').innerHTML += ("<h3>No players active!</h3>");

        })
        .catch(error => console.log('error', error));

        if (document.getElementById('b').innerHTML == "0") {
            setInterval(main, 5000);
            document.getElementById('b').innerText = "1"
        }

}

function inv(uuid) {
    var myHeaders = new Headers();
    myHeaders.append("key", "ThePriests");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("http://mc.syrinx.life:21936/v1/players/"+uuid, requestOptions)
        .then(response => response.text())
        .then(r => {
            var result = JSON.parse(r);
            var k = "";
            k+=("<p style='font-size:10px;'>OP? "+(result.op ? "Yeah!": "Nope!")+"</p>");
            k+=("<p style='font-size:10px;'>Health: "+(result.health/2)+"</p>");
            k+=("<p style='font-size:10px;'>Saturation: "+(result.hunger/2)+"</p>");
            k+=("<p style='font-size:10px;'>Dimension: "+(result.dimension)+"</p>");
            k+="<p>Inventory:</p>";
            document.getElementById(uuid).innerHTML += k;
        }).then(v=>{
    fetch("http://mc.syrinx.life:21936/v1/players/" + uuid + "/919fb6ef-9df0-4028-82c1-c3e301a1c008/inventory", requestOptions)
        .then(response => response.text())
        .then(result => {
            var e = JSON.parse(result);
            var l = "<table><tr><th>Slot ID</th><th>Item ID</th><th>Count</th></tr>"
            e.map(val => {
                l += "<tr><td>" + val.slot + "</td><td>" + val.id + "</td><td>" + val.count + "</td></tr>";
            })
            l += "</table>"
            document.getElementById(uuid).innerHTML += l;
            document.getElementById(uuid).onclick = null;
        })
        .catch(error => console.log('error', error));})
    
}

function exec(command, x = true) {
    var myHeaders = new Headers();
    myHeaders.append("key", "ThePriests");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("command", command);
    urlencoded.append("time", "1");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    var blacklist = ['clear', 'ban', 'give', 'kill']
    console.log(blacklist)
    console.log(command)
    if (blacklist.includes(command.trim().split(" ")[0])){alert("You are not rich enough boi pay me 1 trillion dollars first");return;}
    fetch("http://mc.syrinx.life:21936/v1/server/exec", requestOptions)
        .then(response => response.text())
        .then(result => { if (x) alert("Success\n" + result); else return 0 })
        .catch(error => { if (x) alert("Error! " + error); else return 1 });
}

function backupx() {
    var headers = {
        'key': 'ThePriests',
        'Accept': 'application/zip'
    };
    $.ajax({
        url: "http://mc.syrinx.life:21936/v1/worlds/download",
        type: 'GET',
        dataType: 'binary',
        headers: headers,
        processData: false,
        success: function(blob) {
            var windowUrl = window.URL || window.webkitURL;
            var url = windowUrl.createObjectURL(blob);
            anchor.prop('href', url);
            anchor.prop('download', fileName);
            anchor.get(0).click();
            windowUrl.revokeObjectURL(url);
        }
    });
}