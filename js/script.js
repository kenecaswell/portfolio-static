/* Author: 
	K.C. Dameron
	12/8/2012
*/

/* ***************************************************** */
/*							VARIABLES					 				*/
/* ***************************************************** */
var normalTitle;
var currentPageNum, currentSortNum;
var curSection, curNav, curSortNav;

var work, workLength, workOn, workSortOn, workSortHash;

var portfolioOn, curPortfolioName, curPortfolio;
var portfolioHTML, portfolioLoaded;
var portfolioSlideshows;

var sw, sh;	
var bgSlideshow;

var blendCanvas, bgCanvas;
var blendCanvasContext, bgCanvasContext;


/* ***************************************************** */
/*							LISTENERS					 				*/
/* ***************************************************** */

/*
// check for IE
if (document.attachEvent) {
	// ensure firing before onload,
	// maybe late but safe also for iframes
	document.attachEvent("onreadystatechange", DOMContentLoaded);
	
	// A fallback to window.onload, that will always work
	window.attachEvent( "onload", jQuery.ready );
	
}
*/
$(document).ready(function() {
	
	$("#loader").show();
	//jQuery.ready();
	
});



// check for IE
if (window.attachEvent && !window.addEventListener) {
	window.attachEvent("onload", function() { init(); });
	
	window.attachEvent("resize", function() { resize(); });
	
} else {

	/* this doesn't work in IE8/IE7 */
	window.onload = function () { init(); }
	
	/* this doesn't work in IE8/IE7 */
	window.onresize = function() { resize(); }
}
	
/*
// window.onload W3C cross-browser with a fallback
function addLoadEvent(func) {
  if (window.addEventListener)
    window.addEventListener("load", func, false);
  else if (window.attachEvent)
    window.attachEvent("onload", func);
  else { // fallback
    var old = window.onload;
    window.onload = function() {
      if (old) old();
      func();
    };
  }
}
*/


/*
$(window).resize(function() {
	
	// confirm window was actually resized
	if ($(window).height()!= sh || $(window).width() != sw) {
		resize();
	}
});
*/

// // this check is for IE 8 and below
// if (!window.addEventListener) {
//     window.attachEvent("orientationchange", orientationHandler);
// } else {
//     window.addEventListener("orientationchange", orientationHandler, false);
// }

/* ***************************************************** */
/*							FUNCTIONS					 				*/
/* ***************************************************** */

function init() {
	
	$("#loader").hide();
	
	//log("INIT CrashShop Website");
	// Debooger.setContainer(document.getElementById('debug'));
	
	//log("window onload - isMobile: " + isMobile);
	
	// set init vars
	normalTitle = document.getElementsByTagName("title")[0].innerHTML;
	
	// don't set currentPageNum so if the user loads #home, loadNewPage with be triggered
	//currentPageNum = 0; 
	currentSortNum = 0;
	curSection = $("#home");
	curNav = $("#homeLink");
	curSortNav = $("#allSort");
	curSortNav.addClass("navLinkHighlight");
	
	// make a list of work
 	work = $('#gallery').find('li');
	workLength = work.length;

	// setup close button
	$('#portfolio-close').bind('click', function () {
		
		switch (currentSortNum) {
			// if we came directly to this portfolio piece
			case 0:
				window.location.hash = "#work";
				break;
			// otherwise, just go back
			default:
				history.go(-1);
				break;
		}
		
	});
	
	// http://introblogger.blogspot.com/2010/07/image-mouseover-fadegreyscale-effect.html
	$(".social-media").hover(function() {
		log("hover over social-media");
		$(this).stop();
		var color = $(this).find('.color');
		color.animate({"opacity": "1"}, "fast");
		//color.fadeIn('slow');
	},function() {
		$(this).stop();
		log("hover OUT social-media");
		var color = $(this).find('.color');
		color.animate({"opacity": "0"}, "fast");
		//color.fadeOut('slow');
	});
	
	
	//http://jqueryfordesigners.com/enabling-the-back-button/
	$(window).bind('hashchange', hashChange);
	
	// force hash change
	$(window).trigger("hashchange");
	
	
	//createBlendedBg();
	
	resize();
	// 
	// bgSlideshow = new SimpleSlideshow();
	// bgSlideshow.setSlideshow($("#bg"));
	// bgSlideshow.activate();
	// 
	// 
	// $("#bg-slideshow").responsiveSlides({
	// 	auto: true,
	// 	pager: false,
	// 	nav: false,
	// 	speed: 1000
	// });
	// 
	
	
}

function hashChange() {
	var hash = window.location.hash || '#home';
	log("hash listener!!!!!! - " + hash);
	updatePage(hash);
	
	_gaq.push(['_trackPageview',location.pathname + location.search + location.hash]);
}


	function updatePage(hashName) {

		var pageTitle;
		var newPageNum = currentPageNum;
		var newSortNum = currentSortNum;

		log("updatePage: " + hashName);
		
		// hashes are hardcoded
		if (hashName == "#home") {
			newPageNum = 1;
			pageTitle = " | Home";
			
		} else if (hashName == "#work") {
			newPageNum = 2;
			pageTitle = " | Work";
			workSortOn = false;
			
			// load content if it hasn't been loaded yet
			loadPortfolioContent(false);
			
		} else if (hashName == "#about") {
			newPageNum = 3;
			pageTitle = " | About";
			
		} else if (hashName.substring(1,6) == "work-") {
			
			log("-hash is a sorting hash-");
			
			workSortOn = true;
			currentPageNum = 4;
			
			var sortHash = hashName.substring(6,hashName.length);
			//log("sort hash: " + sortHash);
			if (sortHash == "all") {
				newSortNum = 1;
				pageTitle = " | Work";
			} else if (sortHash == "web") {
				newSortNum = 2;
				pageTitle = " | Work - Websites";
			} else if (sortHash == "prototypes") {
				newSortNum = 3;
				pageTitle = " | Work - Prototypes";
			} else if (sortHash == "video") {
				newSortNum = 4;
				pageTitle = " | Work - Videos";
			}
			
			log("**currentSortNum vs newSortNum** --- " + currentSortNum + ", " + newSortNum);
			if (currentSortNum != newSortNum) {
				
				currentSortNum = newSortNum;
				//log("new sort num: " + newSortNum);
				
				// deselect current nav (before we reset it)
				curSortNav.removeClass("navLinkHighlight");
				
				document.title = normalTitle + pageTitle;
				log("change sorting!!!!!!");
				changeSortSection();
				if (workOn) return;
			}
			
			// load Work Page if it isn't loaded
			if (!workOn) {
				log("**load work from sorting case**");
				newPageNum = 2;
				currentSortNum = 0;
				
				// NOTE: At the end of this function we call loadNewPage,
				// because we've set "workSortOn," when loading work, we 
				// will call UpdatePage() again
			}
			
		} else if (hashName.substring(0,10) == "#portfolio") {
			
			// set currentPageNum to 5 (portfolio) so we know we are not still on 2 (work)
			currentPageNum = 5;
			//currentSortNum = 99; // change currentSortNum, so we know we are not still on 4 (work sort)
			
			// if portfolio content hasn't been loaded yet
			if (!portfolioLoaded) {
				loadPortfolioContent(true);
				return;
			}
			
			loadPortfolio(hashName);
			return;
		}

		document.title = normalTitle + pageTitle;

		// swith page (only if it's different than before)
		if (currentPageNum != newPageNum) {
			currentPageNum = newPageNum;
			
			var delayTime = 0;
			// Fade out portfolio if necessary
			if (portfolioOn) {
				delayTime = 250;
				closePortfolio();
			}
			
			// FADE OUT CURRENT CONTENT
			curSection.delay(delayTime).fadeOut('fast', function () {
				curNav.removeClass("navLinkHighlight");
				loadNewPage();
			});
			
			// track click
			//var pageName = pageTitle.substring(3, pageTitle.length);
			//_gaq.push(['_trackEvent', 'Pages', 'Click', pageName]);
		}
		
	}

function loadNewPage() {
	
	// HASH
	// http://benalman.com/projects/jquery-bbq-plugin/
	// http://stackoverflow.com/questions/5423103/create-a-website-with-jquery-that-doesnt-refresh-but-the-back-button-still-work
	
	// PUSHSTATE/HTML5
	// http://stackoverflow.com/questions/4015613/good-tutorial-for-using-html5-history-api-pushstate
	// http://stackoverflow.com/questions/824349/modify-the-url-without-reloading-the-page
	// http://blog.dcoinc.net/?p=398
	
	//Debooger.append("**LoadPage: " + currentPageNum);
	log("**LoadPage: " + currentPageNum);
	
	workOn = false;
	
	// LOAD HOME
	if (currentPageNum == 1) {
		
		curSection = $('#home');
		curNav = $("#homeLink");
		
		$('#home').fadeIn('slow', function () { });
		
		//$('#bgImage img').fadeTo('slow', 1);
		$('#bgTexture').fadeTo('slow', 1);
		
	// LOAD WORK
	} else if (currentPageNum == 2) {
		
		workOn = true;
		
		curSection = $('#work');
		curNav = $("#workLink");
		curNav.addClass("navLinkHighlight");
		
		// reset sort nav to all
		curSortNav.removeClass("navLinkHighlight");
		curSortNav = $("#allSort");
		curSortNav.addClass("navLinkHighlight");
		
		// hide gallery
		$('#gallery').hide();
		
		// fade in work (nav will show)
		$('#work').fadeIn('slow', function () { });
		
		// make sure bg is on
		//$('#bgImage img').fadeTo('slow', 1);
		$('#bgTexture').fadeTo('slow', 1);
		
		// jump to 'updatePage' if we are loading a portfolio piece
		if (workSortOn) {
			log("load sorted work page");
			updatePage(window.location.hash);
			return;
		}
		
		// hide each item, then fade it with a slight delay
		work.each(function(i) {
			$(this).hide();
			$(this).delay(i * 125 + 250).fadeTo('slow', 1.0);
			// make gallery visible once all items are hidden
			if (i == workLength - 1) $('#gallery').show();
		});
		
	// LOAD ABOUT
	} else if (currentPageNum == 3) {
		
		curSection = $('#about');
		curNav = $("#aboutLink");
		curNav.addClass("navLinkHighlight");

		$('#about').fadeIn('slow', function () {
			
		});
		
		//$('#bgImage img').fadeTo('slow', .5);
		$('#bgTexture').fadeTo('slow', .25);
	}
	
}

function changeSortSection() {
	
	// ALL WORK
	if (currentSortNum == 1) {
		
		curSortNav = $("#allSort");
		curSortNav.addClass("navLinkHighlight");
		
		// hide everything
		$('#gallery').fadeOut('fast', function () {
			work.each(function(i) {
				$(this).hide();
				// fade in every item
				$(this).delay(i * 125 + 500).fadeTo('slow', 1.0);
				
				// only call this once
				if (i == workLength - 1) $('#gallery').show();
			});
	
		});
		
	// LOAD WEBSITES
	} else if (currentSortNum == 2) {
		
		curSortNav = $("#webSort");
		curSortNav.addClass("navLinkHighlight");
		
		// hide everything
		$('#gallery').fadeOut('fast', function () {
			work.each(function(i) {
				$(this).hide();
				if (i == workLength - 1) $('#gallery').show();
			});
			
			// fade in what you want
			$('.web-item').each(function(index, elem) {
				$(this).delay(index * 125 + 500).fadeTo('slow', 1.0);
			});
		});
		
	// LOAD PROTOTYPE PORTFOLIO
	} else if (currentSortNum == 3) {
		
		curSortNav = $("#protoSort");
		curSortNav.addClass("navLinkHighlight");
		
		$('#gallery').fadeOut('fast', function () {
			work.each(function(i) {
				$(this).hide();
				if (i == workLength - 1) $('#gallery').show();
			});
			
			// fade in what you want
			$('.proto-item').each(function(index, elem) {
				$(this).delay(index * 125 + 500).fadeTo('slow', 1.0);
			});
		});
		
	// LOAD VIDEO PORTFOLIO
	} else if (currentSortNum == 4) {
		
		curSortNav = $("#videoSort");
		curSortNav.addClass("navLinkHighlight");
		
		$('#gallery').fadeOut('fast', function () {
			work.each(function(i) {
				$(this).hide();
				if (i == workLength - 1) $('#gallery').show();
			});
			
			// fade in what you want
			$('.video-item').each(function(index, elem) {
				$(this).delay(index * 125 + 500).fadeTo('slow', 1.0);
			});
		});
		
	}
}


function loadPortfolioContent(fromStart) {
	
	if (fromStart) $("#loader").show();
	
	// load portfolio content if it hasn't been loaded already
	if (!portfolioLoaded) {
		// load portfolio html page
		$.ajax({
			url: "portfolio.html",
			dataType:'html',
			cache: false,
			success: function(html) {
				log("** Portfolio Page is loaded **");
				$("#loader").hide();
				portfolioLoaded = true;
				portfolioHTML = html;
				
				// load portfolio
				if (fromStart) loadPortfolio(window.location.hash);
			},
			error: function () {
				// alert("page didn't load");
				log("** Portfolio Page failed to load **");
			}
		});
	}
}


function loadPortfolio(hashName) {
	
	workOn = false;
	portfolioOn = true;
	
	var s1Index = hashName.indexOf('/');
	var s2Index = hashName.lastIndexOf('/');
	var diff = s2Index - s1Index;
	var curSort = hashName.substr(s1Index + 1, diff);
	curPortfolioName = hashName.substr(hashName.lastIndexOf('/') + 1, hashName.length);
	
	//log("curSort: " + curSort);
	//log("itemName: " + itemName);
	
	// load content if it hasn't been loaded yet
	loadPortfolioContent();
	
	
	// get content
	$('#portfolio-content').append(portfolioHTML);
	curPortfolio = $('#' + curPortfolioName); //.clone().html();
	
	log(portfolioHTML);
	
	//var selectedContent = $('#portfolio-content', $('#' + curPortfolioName)).clone().html();
	$('#portfolio-content').empty();
	$('#portfolio-content').append(curPortfolio);
	curPortfolio.hide();
	
	// FADE OUT CURRENT CONTENT
	// curSection.addClass("slide-left");
	// 	curSection.css('margin-left', "-100px");
	curSection.fadeOut('fast', function () {
		curNav.removeClass("navLinkHighlight");
		// $("#workLink").addClass("navLinkHighlight");
		// show portfolio div
		$('#portfolio').css("margin-top", "30px");
		$('#portfolio').css("margin-bottom", "30px");
		$('#portfolio').show();
		
		// fade in cur portfolio piece after 500ms delay
		curPortfolio.fadeIn('slow', function () {
			
			var orbit = $(this).find('.portfolio-slides');
			orbit.orbit({
				animation: 'fade',                  // fade, horizontal-slide, vertical-slide, horizontal-push
				animationSpeed: 800,                // how fast animtions are
				timer: true,                        // true or false to have the timer
				advanceSpeed: 4000,                 // if timer is enabled, time between transitions
				directionalNav: true,               // manual advancing directional navs
				slideNumber: false
			});
			
		});
	});
	
	//var titleName = $('#web' + curWebId).find(".web-item-name").text();
	//var pageTitle = " | Work - " + titleName;
	
	//document.title = normalTitle + pageTitle;
	
	/*
		// stay on websites page
		newPageNum = currentPageNum;
		
		// update title
		curWebId = hashName.substring(4,6);
		var webName = $('#web' + curWebId).find(".web-item-name").text();
		pageTitle = " | Websites - " + webName;
		
		// load website 
		if (!popupOn) loadWebsite(curWebId);
		// else popup is already up and we are using the arrows to navigate between websites
		*/
}

function closePortfolio() {
	
	portfolioOn = false;
	
	// fade in cur portfolio piece after 500ms delay
	curPortfolio.fadeOut('fast', function () {
		$('#portfolio').hide();
		$('#portfolio-content').empty();
	});
}



function createBlendedBg() {
	
	log("create blended bg");
	
	// create blend canvas
	blendCanvas = document.createElement("canvas");
	blendCanvas.className = "blend-canvas";
	blendCanvas.id = "blend-canvas";
	
	blendCanvasContext = blendCanvas.getContext("2d");
	var texture = $('#bgTexture'); //document.getElementById("bgTexture");
	blendCanvasContext.drawImage(texture,0,0);
	
	// create bg canvas
	bgCanvas = document.createElement("canvas");
	bgCanvas.className = "bg-canvas";
	bgCanvas.id = "bg-canvas";
	
	bgCanvasContext = bgCanvas.getContext("2d");
	var bgImg = document.getElementById("bgImage");
	bgCanvasContext.drawImage(bgImg,0,0);
	
	// add bgCanvas to DOM
	var bg = document.getElementById("bg");
	bg.appendChild(bgCanvas);
	
	// blend
	blendCanvasContext.blendOnto(bgCanvasContext,'multiply');
}

/* ==========================	SCREEN ORIENTATION ============================== */
// 
// function orientationHandler() {
// 	var angle = window.orientation;
// 	log("orientation handler: " + angle);
// 	//if (angle == 0) window.scrollTo(0, 0);
// 	//resize();
// }

/* ============================== SCREEN RESIZE ============================== */

function resize() {
	
	//Debooger.trace("RESIZE");
	
	//sw = $(window).width();
	//sh = $(window).height(); // on iphone is topbar height short
	sw = window.innerWidth;
	sh = window.innerHeight; // refreshes bg when topbar is scroll off page, but works
	/**/
	var w = 1600; // 1024;
	var h = 900; //768;
	
	var xRatio = sw / w; //1600; //1200;
	var yRatio = sh / h; //980; //800;
	var scaleRatio;
	var contentRatio;
	
	// set scale ratio to BIGGER size
	if (xRatio >= yRatio) scaleRatio = xRatio; // + .5;	// to allow parallax, add .5 to ratio
	else scaleRatio = yRatio; // + .5;  						// to allow parallax, add .5 to ratio
	
	// set scale ratio to SMALLER size
	if (xRatio >= yRatio) contentRatio = yRatio;
	else contentRatio = xRatio;
	
	log("sw = " + sw);
	
	// set new width and height
	/**/
	var bgImage = document.getElementById("bgImage");
	var bgTexture = document.getElementById("bgTexture");
	var bgImgW = scaleRatio * w;
	var bgImgH = scaleRatio * h;
	bgImage.style.width = bgImgW + "px";
	bgImage.style.height = bgImgH + "px";
	bgTexture.style.width = bgImgW + "px";
	bgTexture.style.height = bgImgH + "px";
	//bgCanvas.style.width = bgImgW + "px";
	//bgCanvas.style.height = bgImgH + "px";
	
	//var bgH = $('#bg').height();
	//var bgW = $('#bg').width();
	//log(bgW + " : " + bgH);
	$('#bg').css("top", ((bgImgH - sh) * -0.5) + "px");
	$('#bg').css("left", ((bgImgW - sw) * -0.5) + "px");
	
	/*	
	var bg = document.getElementById("bg");
	var bgW = scaleRatio * w;
	var bgH = scaleRatio * h;
	bg.style.width = bgW + "px";
	bg.style.height = bgH + "px";
	bg.style.top = ((bgH - sh) * -0.5) + "px";
	bg.style.left = ((bgW - sw) * -0.5) + "px";
	*/
	/* USE: <body onload="resize()" onresize="resize()"> */
	
}







/* ***************************************************** */
/*						UTILITIES						  			 */
/* ***************************************************** */
	
function getRandomArbitary (min, max) {
    return Math.random() * (max - min) + min;
}


function cleanWhitespace(node) {
	for (var i = 0; i < node.childNodes.length; i++) {
		var child = node.childNodes[i];
		if (child.nodeType == 3 && !/\S/.test(child.nodeValue)) {
			node.removeChild(child);
			i--;
		}
		
		if (child.nodeType == 1) {
			cleanWhitespace(child);
		}
	}
	return node;
}

function logError(msg){
	try {
		console.log(msg);
	} catch (error) {
		throw new Error(msg);
	}
}

function log(msg){
	try {
		console.log(msg);
	} catch (error) { 
		alert('console log is causing an error');
	}
}
