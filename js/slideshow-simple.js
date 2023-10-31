var SimpleSlideshow = function () {
  
	// private properties
	
	var supportCanvas;
	var slideshow;
	var slides;
	var images;
	
	var current;
	var isPrevArrow;
	var dimensions;
	
	var count;

	var delayTime = 3000; // 8000;
	var switchTime = 4000; //14000;

	var slideTimer = 0;
	
	
	/********************************* Private ************************/
	
	var initSlideshow = function() {
		
		// Testing wether the current browser supports the canvas element:
		supportCanvas = 'getContext' in document.createElement('canvas');
		
		//slides = $('#slideshow li');
		
		log("init slideshow - " + slideshow.length);
		
		slides = slideshow.find('li');
		images = slideshow.find('img');
		log("slides - " + slides.length);
		log("images - " + images.length);
		
		current = 0;
		dimensions = { width:0, height:0 };
		count = 0;
		
		switchTime = getRandomArbitary(3000, 6000);
		
		// The canvas manipulations of the images are CPU intensive,
		// this is why we are using setTimeout to make them asynchronous
		// and improve the responsiveness of the page. Delay 100ms
		setTimeout(createSlides, 100);
		
		//setTimeout(function () { resetLastPage(lastPage, lastContent); }, 1200);
		

		// NOTE: moved to "startSlideshow" to the end of "createSlides"
	}
	
	function createSlides() {
		
		if (supportCanvas) {
			
			log("canvas supported!");
			
			//$('#slideshow img').each(function() {
			images.each(function() {
				
				//alert("load slide: " + count);
				count++;
				log("count: " + count);
				if (!dimensions.width) {
					// Saving the dimensions of the first image:
					dimensions.width = this.width;
					dimensions.height = this.height;
				}

				// Rendering the modified versions of the images:
				createCanvasOverlay(this);

			});
		}

		/*
		// give arrows click functionality
		$('#slideshow .arrow').click(function() {
			isPrevArrow = ($(this).hasClass('previous'));
			clearTimeout(slideTimer);
			changeSlide();
		});
		*/

		// start slideshow
		startSlideshow();
	}

	// This function takes an image and renders
	// a version of it similar to the Overlay blending
	// mode in Photoshop.

	function createCanvasOverlay(image) {

		// NOTE: I removed the Photoshop style Overlay effect
		// for less process intensive functionality

		var canvas				= document.createElement('canvas'),
			canvasContext		= canvas.getContext("2d");

		// Make it the same size as the image
		canvas.width = dimensions.width;
		canvas.height = dimensions.height;

		// Drawing the default version of the image on the canvas:
		canvasContext.drawImage(image,0,0);

		// Inserting the canvas in the DOM, before the image:
		image.parentNode.insertBefore(canvas,image);
	}

	function changeSlide() {

		//alert("change slide");
		log("change slide");

		var li		= slides.eq(current),
		canvas		= li.find('canvas'),
		nextIndex	= 0;

		// Depending on whether this is the next or previous
		// arrow, calculate the index of the next slide accordingly.
		if (isPrevArrow) {
			nextIndex = current <= 0 ? slides.length - 1 : current - 1;
			isPrevArrow = false; // reset variable to default (false)
			//alert("PREVIOUS class");
		} else {
			nextIndex = current >= slides.length - 1 ? 0 : current + 1;
			//alert("has next class");
		}

		var next = slides.eq(nextIndex);

		if (supportCanvas) {

			// This browser supports canvas, fade it into view:
			canvas.fadeIn(function() {

				// Show the next slide below the current one:
				next.show();
				current = nextIndex;

				// Fade the current slide out of view:
				li.fadeOut(function() {
					li.removeClass('slideActive');
					canvas.hide();
					next.addClass('slideActive');
				});
			});

		} else {

			// This browser does not support canvas.
			// Use the plain version of the slideshow.
			current = nextIndex;
			next.addClass('slideActive').show();
			li.removeClass('slideActive').hide();
		}
		
		switchTime = getRandomArbitary(3000, 6000);
		
		//log("switchTime: " + switchTime);
		
		slideTimer = setTimeout(function() { changeSlide(); }, switchTime);
		
		/*$('#slideshow').delay(1000).queue(function() {
			changeSlide();
		});*/
	}

	function startSlideshow() {
		//alert("startSlideshow");
		/*
		$('.slideshow').delay(delayTime).queue(function() {
			changeSlide();
		});
		*/
		slideshow.delay(delayTime).queue(function() {
			changeSlide();
		});
		
		//var newTimer = setInterval(changeSlide, 2000);
		//setTimeout(function() { changeSlide(); }, 2000);
		//$(window).delay(2000);
		//setTimeout(startSlideshow(), 1000);
	}
	
	function getRandomArbitary (min, max) {
	    return Math.random() * (max - min) + min;
	}
	
	
	/********************************* Public ************************/
	
	// public access
	return {
		
		//shasha:"Sha Sha!",
		
		// getter setter methods
		
		setSlideshow:function(ss) {
			slideshow = ss; 
		},
		
		setSlides:function(s) {
			slides = s; 
		},
		
		setImages:function(i) {
			images = i; 
		},
		
		getSlides:function() {
			return slides;
		},
		
		// public methods
		activate:function() {
			initSlideshow();
		},
		
		deactivate:function() {
			log("deactivate");
			clearTimeout(slideTimer);
		}
	}
	
  
};

/*

// @NOTE: Implimentation

var slideshowApps;

slideshowApps = new SimpleSlideshow();
slideshowApps.setSlideshow($("#slideshow-apps"));
slideshowApps.activate();

*/
