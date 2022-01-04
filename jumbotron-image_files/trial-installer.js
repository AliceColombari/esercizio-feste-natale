var urlQuery = window.location.href.split("sourceid=");
var now = new Date();
var time = now.getTime();
	time += 30*3600 * 1000*24;
	now.setTime(time);

var hostName = window.location.hostname;
var pathName = location.pathname;

var source_id_cdgs = "";				// Value of source id, could be from query string, cookie, referrer. Its value finally could be for CDGS or CDSTD

var cdgsId 	= "cdgs2021";				// Default CDGS product id, this SHOULD be updated for every CDGS new trial
var cdstdId = "cdstd2021";				// Default CDSTD product id, this SHOULD be updated for every CDSTD new trial

var elementid = "";						// Default id of trial button
var cookieName = "";					// Default cookie name
var prodId = "";						// Default product id, this will be overwrite by CDGS or CDSTD product id
var product = {};						// Default product config

/* Customize paramteters for CorelDRAW Standard, cdstd */
if (pathName.search("/coreldraw/standard/") > 0) {
	elementid = "cds-trial";			// id of CorelDRAW Standard trial button
	cookieName = "source_id_cdstd";		// Cookie name of CorelDRAW Standard
	prodId = cdstdId;				    // Updated default prodId to be CDSTD product id
}else{
	elementid = "cdgs-trial";			// Default id of CDGS trial button
	cookieName = "source_id_cdgs";		// Default cookie name of CDGS
	prodId = cdgsId;				    // Updated default prodId to be CDGS product id
}
/* product config */
product = {								// Product config for CDGS or CDSTD
	"seo": prodId + "-xx-seo",			// ex: product["seo"] = "cdgs2021-xx-seo"
	"ppc": prodId + "-xx-ppc_brkws"		// ex: product["ppc"] = "cdgs2021-xx-ppc_brkws"
};

/* Get cookie from source_id_cdstd or source_id_cdgs */
var siteCookie = document.cookie.match('(?:^|;) ?' + cookieName + '=([^;]*)(?:;|$)');
if(siteCookie){
	source_id_cdgs = siteCookie[1];
}

var ref = document.referrer;
var req = new XMLHttpRequest();
req.open('GET', "/geolookup.html", false);
req.send(null);
var countryCode = (req.getResponseHeader('true-client-country-4js') == null ? "US": req.getResponseHeader('true-client-country-4js').toUpperCase());

var euCountries = [  "AD", "AL","AT", "AX", "BA","BE","BG","BY","CH","DE","DK","EE","EU", "FI","FO","FR", "FX","GB","GG","GI","GR","HR","HU","IE","IM","IS","IT","JE","LI","LT","LU","LV","MC","MD","ME","MK","MT","NL","NO","PT","RO","RS","SE","SI","SJ","SK","SM","UA","VA"];

var installerServerPath = "https://installer.corel.com/get_dwnld.cgi";
if(hostName.indexOf("dev.") > -1){
	installerServerPath = "https://dev.installer.public.corel.net/get_dwnld.cgi";
}else if(hostName.indexOf("stg.") > -1){
	installerServerPath = "https://stg.installer.public.corel.net/get_dwnld.cgi";
}else if(hostName.indexOf("local.") > -1){
	installerServerPath = "http://127.0.0.1/get_dwnld.cgi";
}

/* Check if trial button exists */
var trialElement = document.getElementById(elementid);
var trialElementFlag = false;
if (typeof trialElement === 'undefined' || trialElement === null) {    
}else{
	trialElementFlag = true;	
}

if (ref.match(/^https?:\/\/www\.google\.([^\/]+)(\/|$)/i)){
	source_id_cdgs = product["seo"];
    if(((window.location.href.search("gclid=")) >0)){
        source_id_cdgs = product["ppc"];
        if(urlQuery.length>1) {
			if((urlQuery[1].search("&")) >0){
				var sub_urlQuery= urlQuery[1].split("&");
				source_id_cdgs = sub_urlQuery[0];
			}else{
				source_id_cdgs = urlQuery[1];
			}
		}
    }
    
	// If source_id_cdgs or source_id_cdstd cookie exists, use its value to overwrite seo related source id
	if(siteCookie){
		source_id_cdgs = siteCookie[1];
    }else{	// source_id_cdgs or source_id_cdstd cookie DOES NOT exist, use seo related source id, and create a cookie
		document.cookie = cookieName + '=' + source_id_cdgs + '; expires=' + now.toUTCString() + '; path=/';
	}
}else if(urlQuery.length>0 && ((window.location.href.search("sourceid=")) >0)){
    if((urlQuery[1].search("&")) >0){
		var sub_urlQuery= urlQuery[1].split("&");
		source_id_cdgs = sub_urlQuery[0];
    }else{
		source_id_cdgs = urlQuery[1];
    }

    // source_id_cdgs or source_id_cdstd cookie exists, use its value to overwrite query string related source id
    if(siteCookie){
		if(prodId.indexOf("cdgs", 0) == 0){	//This replace logic only works for CDGS, unrequired for CDSTD
			if(euCountries.indexOf(countryCode) >-1 ){
				source_id_cdgs = source_id_cdgs.replace("-rw", "-emea");
			}
		}
        if(source_id_cdgs.indexOf("control2") > -1 || source_id_cdgs.indexOf("ipp2") > -1){
			document.cookie = cookieName + '=' + source_id_cdgs + '; expires=' + now.toUTCString() + '; path=/';
		}else{
			source_id_cdgs = siteCookie[1];
        }
    }else{
		if(prodId.indexOf("cdgs", 0) == 0){	//This replace logic only works for CDGS, unrequired for CDSTD
			if(euCountries.indexOf(countryCode) >-1 && (source_id_cdgs.indexOf("control2") > -1 || source_id_cdgs.indexOf("ipp2") > -1)){
				source_id_cdgs = source_id_cdgs.replace("-rw", "-emea");
			}
		}
		document.cookie = cookieName+ '=' + source_id_cdgs + '; expires=' + now.toUTCString() + '; path=/';
    }
}
//Hardcoded logic to replace cdstd to be cdgs in every page except CorelDRAW Standard product page
if (pathName.search("/coreldraw/standard/") > 0) {
}else{
	if(source_id_cdgs.indexOf("cdstd", 0) == 0){
		source_id_cdgs = source_id_cdgs.replace(cdstdId, cdgsId);
	}
}

/* Check if user is using MAC OS */
function isMac() {
	result = false;
	if (window.navigator.userAgent.indexOf("Mac") != -1) {
		result = true;
	}
	return result;
}

// Only run this when user is not using MAC OS
if (!isMac() && pathName.indexOf("/coreldraw/mac/") == -1) {
	if(source_id_cdgs){
		$(document).ready(function(){$.getJSON(installerServerPath, {"source_id": source_id_cdgs}, function(data_dwn){if(data_dwn.download_url != "NONE"){if(trialElementFlag){document.getElementById(elementid).href = data_dwn.download_url;}
		document.cookie = 'stub-trk-param=' + data_dwn.stub_trk_param + '; expires=' + now.toUTCString() + '; path=/';}})});
	}
}

/* Following Mac related logic is only executed when page includes cdgs\include\trials\cdgs\en.html this kind of page, en could be other language, ex: br, de, etc. */
var runOnce = false;
function replaceForMac() {
	if (!runOnce && isMac()) {
		var trialLink = "https://www.corel.com/akdlm/6763/downloads/free/trials/GraphicsSuite/2021/5gu8DC39/CDGS2021.dmg";
			
		// update all of the trial download links on the page
		$(".cdgs-trial").attr("href", trialLink);
		
		// update all the GA tracking parameters on the page
		$(".cdgs-trial").attr("data-track-attr-productsku", "ESDCDGS2021MAM");
			
		// update any learn more buttons to point to Mac product page
		var productLink = $(".cdgs-product").attr("href");
		$(".cdgs-product").attr("href", productLink + "mac/");
			
		// switch the "are you looking for" links
		$(".cdgs-mac-product").hide();
		$(".cdgs-win-product").show();
	}
	runOnce = true;
}