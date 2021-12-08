
function setNavigationLine() {
	let start = $("#nav-CO2 .dot").get(0).getBoundingClientRect();
	let end = $("#nav-aggr .dot").get(0).getBoundingClientRect();
	$("#nav-line").css("left", start.left);
	$("#nav-line").css("width", end.right - start.left);
	$("#nav-line").css("top", start.top + (start.bottom - start.top)/2);
}

function switchView(view) {
	$(".view-container").css("display", "none");
	$("#" + view + "-container").css("display", "flex");
	state.currView = view;
	state.update();
}