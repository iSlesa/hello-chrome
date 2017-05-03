function updateClock() {
    var now = new Date(); // current date
    months = ['January', 'February', 'March','April','May','June','July','August','September','October','November','December']; // you get the idea
    time = now.getHours() + ':' + (now.getMinutes()<10?'0':'') + now.getMinutes() ;
    date = [now.getDate(), 
                months[now.getMonth()].substring(0,3),
                now.getFullYear()].join(' ');
    document.getElementById('time').innerHTML = time;
    document.getElementById('date').innerHTML = date;
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
        $('input[name=task]').on('keypress', function(event) {
        if (event.keyCode == 13) {
            var toAdd = $('input[name=task]').val();
            $item = $("<div class='row'><div class='tick'><input type='checkbox' class='check'> </div><div class='text'> "+ toAdd + "</div> <div class='cross'> <button>&times;</button> </div></div>");
			$("#todo").append($item);
            setdata();
			$('input[name=task]').val("");
        }
    });
        $('#block').on("click","div.cross",function(){
		$(this).parent().closest("div").remove();
        setdata();
	});
        $('#block').on("click","div.tick",function(){
		if($(this).find('.check').prop('checked') === true) {
			var tr = $(this).parent().closest('div');
			tr.detach().appendTo($('#done'));
            setdata();
		}
		else{
			var tr = $(this).parent().closest('div');
			tr.detach().appendTo($('#todo'));
            setdata();
		}
	});
        readdata(print);
    };
    x.send();
});


function readdata(callback){
    chrome.storage.sync.get("data", function(result) {
        if(result.data) {
            console.log(result);
            callback(result);
        }
    });
}

function print(tasks){
    $('#todo').append(tasks.data.todo);
    $('#done').append(tasks.data.done);
    $('#done input').prop('checked',true);
}

function setdata(){
    var todo = $('#todo').html();
    var done = $('#done').html();
    chrome.storage.sync.set({ "data" : {"todo": todo, "done" : done} }, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error.");
    }
  });
}