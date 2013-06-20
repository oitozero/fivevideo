/* =========================================================
 * fivevideo.js v0.0.1
 * http://github.com/pmpsampaio/fivevideo
 * =========================================================
 * Copyright 2013 Pedro Sampaio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

/* =========================================================
	
	Tag Video 
	
	Attributtes:
	
	autoplay: 	specifies that the video will start playing as soon as it is ready
	controls: 	specifies that video controls should be displayed
	height: 	sets the height of the video player
	loop: 		specifies that the video will start over again, every time it is finished
	muted: 		specifies that the audio output of the video should be muted
	poster: 	specifies an image to be shown while the video is downloading, or until the user hits the play button
	preload: 	specifies if and how the author thinks the video should be loaded when the page loads
	src: 		specifies the URL of the video file
	width: 		sets the width of the video player
	
	Events:
	timeupdate: 
	ended:  	

 * ========================================================= */

(function( $ ){
	
	$.fivevideo = function( el, options ) {

		this.$el = $(el);
		this.options = options;
        
        this.$el.data("fivevideo", this);
        this.init();
    };

    $.fivevideo.prototype = {
        
        init: function () {
        	var base = this,
        		settings,
        		$el = base.$el;
			
			var video = $el[0];

        	base.settings = settings = $.extend({}, base.defaults, base.options);

        	// setting video width
        	if(base.settings.width){
        		$el.css("width", base.settings.width);
        	}
        	// setting video height
        	if(base.settings.height){
        		$el.css("height", base.settings.height);
        	}

        	// elements
        	$el.wrapper			= $('<div class="fivevideo"></div>');
			$el.controls 		= $('<div class="fivevideo-controls"></div>');
			$el.play 			= $('<a class="fivevideo-play-button">'+base.settings.playContent+'</a>');
			$el.sound 			= $('<a class="fivevideo-sound-button">'+base.settings.soundOnContent+'</a>');
			$el.progressbar 	= $('<div class="fivevideo-progressbar"></div>');
			$el.seeker 			= $('<div class="fivevideo-progressbar-seeker"></div>');
			$el.tag 			= $('<a class="fivevideo-tag">'+base.settings.tagContent+'</a>');
			
			// style
			$el.wrapper.css("position", "relative");
			$el.wrapper.css("cursor", "pointer");
			$el.progressbar.css("background-color", base.settings.progressbarBackgroundColor);
			$el.seeker.css("bottom", "0px");
			$el.seeker.css("height", base.settings.progressbarHeight);
			$el.seeker.css("-webkit-transition", "all .3s ease-out");
			$el.seeker.width("0%");
			$el.seeker.css("background-color", base.settings.progressbarForegroundColor);

			// adding elemnts to DOM
			$el.wrapAll(
				$el.wrapper
					.css("width", $el.css("width"))
					.css("height", $el.css("height"))
					.bind('click', function(){
						if(video.paused) {
							video.play();
							$el.play.html(base.settings.pauseContent);
					   	}
					   	else {
						  	video.pause();
						  	$el.play.html(base.settings.playContent);
					   	}
					   	return false;
					})
			);

			$el.after($el.progressbar.append($el.seeker));
			$el.after($("<div class='fivevideo-play'></div>")
    			.append(
    				$el.play.bind('click', function(){
    					//Play/Pause control clicked
    					if(video.paused) {
							video.play();
						  	$(this).html(base.settings.pauseContent);
					   	}
					   	else {
						  	video.pause();
						  	$(this).html(base.settings.playContent);
					   	}
					   	return false;
    				})
    			));
			$el.after($("<div class='fivevideo-sound'></div>")
    			.append(
    				$el.sound.bind('click', function(e){
    					//Sound On/Off control clicked
    					if(!video.paused){
							if(video.muted === false) {
								video.muted = true;
							  	$(this).html(base.settings.soundOffContent);
						   	}
						   	else {
							  	video.muted = false;
							  	$(this).html(base.settings.soundOnContent);
						   	}
						}
						return false;
    				})
    			));
			
			if(base.settings.tag === true){
				$el.after($("<div></div>")
	    			.append(
	    				$el.tag
	    			));
			}

			$el.parent().hover(
			  	function () {
			  		if(base.settings.sticky === false){
			  			$el.play.fadeTo('slow', 1.0);
			    		$el.sound.fadeTo('slow', 1.0);
				    	$el.seeker.animate({
						    height: base.settings.progressbarHeightHover
						  }, 100, function() {
						    // Animation complete.
						  });
			    	}
			  	},
			  	function () {
			  		if(base.settings.sticky === false){
			  			$el.play.fadeTo('slow', 0.0);
			    		$el.sound.fadeTo('slow', 0.0);
			    	
				    	$el.seeker.animate({
						    height: base.settings.progressbarHeight
						  }, 100, function() {
						    // Animation complete.
						  });
			    	}
			  	}
			);

			// Video timeupdate event (progress)
			video.addEventListener('timeupdate',function(e) {
				var s=e.target.currentTime;
			  	var t=e.target.duration;
			  	$el.seeker.width(s/t*100+"%");
			}, true);
			// Video ended event
			video.addEventListener('ended',function(e) {
			  	$el.play.html(base.settings.playContent);
			}, true);

			// style
			$el.play.css("position", "absolute");
			$el.play.css("bottom", "0");
			$el.play.css("left", "0");
			$el.sound.css("position", "absolute");
			$el.sound.css("bottom", "0");
			$el.sound.css("right", "0");
			$el.tag.css("position", "absolute");
			$el.tag.css("top", "0");
			$el.tag.css("right", "0");

			if(base.settings.sticky === false){
				$el.play.hide();
				$el.sound.hide();
			}
		},
		defaults: {
			playContent: 'PLAY',
			pauseContent: 'PAUSE',
			soundOnContent: 'ON',
			soundOffContent: 'OFF',
			progressbarHeight: '2px',
			progressbarHeightHover: '6px',
			progressbarBackgroundColor: '#000000',
			progressbarForegroundColor: '#ff0000',
			tag: false,
			tagContent: 'VIDEO',
			sticky: false
        }
	};

	$.fn.fivevideo = function(options) {
		return this.each(function(index, value) {
       		if(typeof options == 'string' && options === 'play'){
       			this.play();
       		}
       		else if(typeof options == 'string' && options === 'pause'){
       			this.pause();
       		}
       		else{
       			new $.fivevideo(this, options);	
       		}
    	});
    };

})( jQuery );