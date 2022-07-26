function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  exdays = exdays || 365;
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = `${cname}=${encodeURIComponent(cvalue)};${expires};path=/`;
}


function getCookie(cname) {
  var name = cname.trimStart() + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");

  let cookie = ca.find((row) => row.trim().startsWith(name));
  return cookie == undefined ? "" : cookie.split("=")[1];
}


function updateSliderLabel(slider) {
  let label = slider.labels[0];
  let lblstr = label.htmlFor;
  let lblvalue = slider.value;
  let extra = "";

  if (lblstr == "ratio") {
    extra = `(${rad2deg(toAngle(lblvalue))
      .toFixed(1)
      .padStart(4, "0")}Â° âŸº ${toLength(lblvalue).toFixed(2)})`;
    lblvalue = (+lblvalue).toFixed(2);
  } else {
    lblvalue = lblvalue.padStart(2, "0");
    extra = "&#9634;";
  }

  label.innerHTML = `${lblstr} = ${lblvalue} ${extra}`;
}


function setSlider(gCookie, sCookie, selector = "body") {
  let cookies = gCookie("squares_cookies") || JSON.stringify(["0", "4", "0"]);
  let [val, val2, val3] = JSON.parse(cookies);
  let slider = document.querySelector("#ratio");
  let slider2 = document.querySelector("#sqr");
  let variation = document.querySelectorAll('input[name="squarePoint"]');

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const w = urlParams.get("w") || "800";
  const h = urlParams.get("h") || "600";

  let r = document.querySelector(":root");
  r.style.setProperty("--wsvg", `${w}px`);

  const svg = d3
    .select(selector)
    .append("svg")
    .lower()
    .attr("style", "border: 3px solid gray")
    .attr("width", w)
    .attr("height", h);

  slider.value = val;
  slider2.value = val2;
  variation[val3].checked = true;
  var vari = val3;

  variation.forEach((elem) => {
    elem.addEventListener("click", function (event) {
      vari = event.target.value;
      let p = [slider.value, slider2.value, vari];
      drawSqrs(svg, ...p);
      sCookie("squares_cookies", JSON.stringify(p), 365);
    });
  });

  slider.addEventListener("input", () => {
    let p = [slider.value, slider2.value, vari];
    updateSliderLabel(slider);
    drawSqrs(svg, ...p);
    sCookie("squares_cookies", JSON.stringify(p), 365);
  });

  slider2.addEventListener("input", () => {
    let p = [slider.value, slider2.value, vari];
    updateSliderLabel(slider2);
    drawSqrs(svg, ...p);
    sCookie("squares_cookies", JSON.stringify(p), 365);
  });

  updateSliderLabel(slider);
  updateSliderLabel(slider2);
  drawSqrs(svg, val, val2, vari);
}


function drawSqrs(svg, ratio, n, variation) {
  const [width, height] = [svg.attr("width"), svg.attr("height")];
  let ang = toAngle(ratio);
  let len = toLength(ratio);

  let p = [width / 2, height / 2];
  let side = width / 10;
  let trans;
  switch (+variation) {
    case 0:
      trans = "";
      break;
    case 1:
      trans = `translate(${side},0)`;
      break;
    case 2:
      trans = `translate(${side},${side})`;
      break;
    case 3:
      trans = `translate(0,${side})`;
      break;
  }

  const colors = ["red", "yellow", "blue", "green", "magenta"];

  svg.selectAll("g").remove();

  let g = svg.append("g").attr("transform", `translate(${p[0]}, ${p[1]})`);

  for (let i = 0; i < n; i++) {
    g.append("rect")
      .attr("fill", colors[i % colors.length])
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", side)
      .attr("height", side)
      .attr("opacity", 0.7);
    g = g
      .append("g")
      .attr("transform", `${trans} scale(${len}) rotate(${rad2deg(ang)})`);
  }
}


function dragAndSave(id) {
  if (screen.width <= 800) return;

  var positions = JSON.parse(localStorage.positions || "{}");

  if (positions[id]) $(id).css(positions[id]);

  $(id).draggable({
    scroll: true,
    stop: function (event, ui) {
      let positions = JSON.parse(localStorage.positions || "{}");
      positions[id] = ui.position;
      localStorage.positions = JSON.stringify(positions);
    },
  });
}