
function switchView(view) {
	$(".view-container").css("display", "none");
	$(".nav-unit .dot").removeClass("active");
	$(`#nav-${view} .dot`).addClass("active");
	$(`#${view}-container`).css("display", "flex");
	state.currView = view;
	state.update();
}