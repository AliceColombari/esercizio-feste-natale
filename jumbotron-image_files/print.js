$(document).ready(function () {
	var iframe = document.createElement("iframe");

	iframe.id = "printing-frame";
	iframe.name = "print-frame";
	iframe.style.display = "none";

	document.body.appendChild(iframe);

	if (navigator.userAgent.search("Firefox")) {
		setTimeout(function(){
			addHeadLinks();
		},1000);
	} else {
		addHeadLinks();
	}
});

function printSection(elementId) {
	var printSection = document.getElementById(elementId).innerHTML;
	window.frames["print-frame"].document.title = document.title;
	window.frames["print-frame"].document.body.innerHTML = printSection;
	window.frames["print-frame"].window.focus();
	window.frames["print-frame"].window.print();
}

function addHeadLinks() {
	var link = document.createElement("link");
	var preloadIcons = document.createElement("link");

	link.href = "/static/common/css/print.css";
	link.rel = "stylesheet";
	link.type = "text/css";

	preloadIcons.rel = "preload";
	preloadIcons.href = "/static/common/images/print/compare-arrows.png";
	preloadIcons.as = "image";

	frames["print-frame"].document.head.appendChild(link);
	frames["print-frame"].document.head.appendChild(preloadIcons);
}