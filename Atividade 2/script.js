// Create button that adds one circle to the screen
var button_add = document.createElement("button");
button_add.innerHTML = "Add circle";
button_add.style = "display: block; margin: 5% auto;"

// Create button that prints DOM
var button_dom = document.createElement("button");
button_dom.innerHTML = "Print DOM"
button_dom.style = "display: block; margin: 5% auto;"

// Create body
var body = document.getElementsByTagName("body")[0];

// Add buttons to body
body.appendChild(button_add);
body.appendChild(button_dom);

// Create 1 circle with random color per click
var counter = 0;
button_add.addEventListener("click", function() {
    var circle_div = document.createElement("div");
    
    circle_div.setAttribute("id", "circle" + counter);
    circle_div.innerHTML = " ";
    circle_div.style = "width: 130px; height: 130px; border-radius: 50%; float: left; margin: 5px; border-style: solid; border-width: thin;";

    var color = (Math.floor(Math.random() * 16777215)).toString(16);
    circle_div.style.backgroundColor = "#" + color;
    
    body.appendChild(circle_div);
    counter++;
});

// Delete clicked circle
document.addEventListener('click', function(e){
    for(const x of Array(counter).keys()){
        if(e.target && e.target.id == ('circle' + x)){
            document.getElementById(e.target.id).style.display = "none";
        }
    }
});