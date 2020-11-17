// Initialize global variables.
let dictionary;

//import json data.
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myObj = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", "data.json", true);
xmlhttp.send();

xmlhttp.onload = function() {
    dictionary = new Dictionary(myObj);
    document.getElementById("button").innerHTML = "Generate!";
};

// Button function.
function generate_haiku() {
    if (document.getElementById("button").innerHTML == "Generate!") {
        var haiku = [dictionary.parse_template(5),
                     dictionary.parse_template(7),
                     dictionary.parse_template(5)];
		
		if (haiku[2].endsWith("&comma;")) {
			haiku[2] = str = haiku[2].slice(0, -7) + ".";
		}
		
        document.getElementById("text").innerHTML = haiku.join("<br>");
    }
}
