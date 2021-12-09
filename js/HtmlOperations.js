
function setNavigationLine() {
	let start = $("#nav-CO2 .dot").get(0).getBoundingClientRect();
	let end = $("#nav-aggr .dot").get(0).getBoundingClientRect();
	$("#nav-line").css("left", start.left + 1);
	$("#nav-line").css("width", end.right - start.left - 2);
	$("#nav-line").css("top", start.top + (start.bottom - start.top)/2);
}

function switchView(view) {
	$(".view-container").css("display", "none");
	$(".nav-unit .dot").removeClass("active");
	$(`#nav-${view} .dot`).addClass("active");
	$(`#${view}-container`).css("display", "flex");
	state.currView = view;
	state.update();
}