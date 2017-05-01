// chrome.identity.getProfileUserInfo(function(userInfo){ 
// 	console.log(userInfo); //console.log(userInfo.id); 
// });

function updateClock() {
    var now = new Date(); // current date
    months = ['January', 'February', 'March','April','May','June','July','August','September','October','November','December']; // you get the idea
    time = now.getHours() + ':' + (now.getMinutes()<10?'0':'') + now.getMinutes() ; // again, you get the idea
    // a cleaner way than string concatenation
    date = [now.getDate(), 
                months[now.getMonth()].substring(0,3),
                now.getFullYear()].join(' ');

    // set the content of the element with the ID time to the formatted string
    document.getElementById('time').innerHTML = time;
    document.getElementById('date').innerHTML = date;
    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}

chrome.identity.getAuthToken({
    interactive: true
}, function(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    var x = new XMLHttpRequest();
    x.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
    x.onload = function() {
        var obj = JSON.parse(x.response);
        var greet = "Hello, "+obj.given_name+"!";
        document.getElementById('greeting').innerHTML= greet;
        updateClock();
    };
    x.send();
});