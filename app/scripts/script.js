;(function( $ ) {
	"use strict";

	$( document ).on( 'ready', function() {

		var $window = $( window ),
		    $body = $( 'body' ),
		    drew = {
		    	headerFloatingHeight : 60,
		    };

		/**
		 * =======================================
		 * Function: Detect Mobile Device
		 * =======================================
		 */
		// source: http://www.abeautifulsite.net/detecting-mobile-devices-with-javascript/
		var isMobile = {
			Android: function() {
				return navigator.userAgent.match( /Android/i );
			},
			BlackBerry: function() {
				return navigator.userAgent.match( /BlackBerry/i );
			},
			iOS: function() {
				return navigator.userAgent.match( /iPhone|iPad|iPod/i );
			},
			Opera: function() {
				return navigator.userAgent.match( /Opera Mini/i );
			},
			Windows: function() {
				return navigator.userAgent.match( /IEMobile/i );
			},
			any: function() {
				return ( isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() );
			},
		};

		/**
		 * =======================================
		 * Function: Resize Background
		 * =======================================
		 */
		var resizeBackground = function() {

			$( '.section-background video, .section-background img, .two-cols-description-image img' ).each(function( i, el ) {
				var $el       = $( el ),
				    $section  = $el.parent(),
				    min_w     = 300,
				    el_w      = el.tagName == 'VIDEO' ? el.videoWidth : el.naturalWidth,
				    el_h      = el.tagName == 'VIDEO' ? el.videoHeight : el.naturalHeight,
				    section_w = $section.outerWidth(),
				    section_h = $section.outerHeight(),
				    scale_w   = section_w / el_w,
				    scale_h   = section_h / el_h,
				    scale     = scale_w > scale_h ? scale_w : scale_h,
				    new_el_w, new_el_h, offet_top, offet_left;

				if ( scale * el_w < min_w ) {
					scale = min_w / el_w;
				};

				new_el_w = scale * el_w;
				new_el_h = scale * el_h;
				offet_left = ( new_el_w - section_w ) / 2 * -1;
				offet_top  = ( new_el_h - section_h ) / 2 * -1;

				$el.css( 'width', new_el_w );
				$el.css( 'height', new_el_h );
				$el.css( 'marginTop', offet_top );
				$el.css( 'marginLeft', offet_left );
			});

		};

		/**
		 * =======================================
		 * Detect Mobile Device
		 * =======================================
		 */
		if ( isMobile.any() ) {
			// add identifier class to <body>
			$body.addClass( 'mobile-device' );
			// remove all element with class "remove-on-mobile-device"
			$( '.remove-on-mobile-device' ).remove();
		};

		/* =======================================
		 * Slideshow Background
		 * =======================================
		 */
		if ( $.fn.responsiveSlides ) {
			$body.on( 'pageStart', function() {
				$( '.section-background-slideshow' ).responsiveSlides({
					speed : $( this ).data( 'speed' ) ? $( this ).data( 'speed' ) : 800,
					timeout : $( this ).data( 'timeout' ) ? $( this ).data( 'timeout' ) : 4000,
				});
			});
		};

		/* =======================================
		 * Video Embed Async Load
		 * =======================================
		 */
		$body.on( 'pageStart', function() {
			$( '.video-async' ).each( function( i, el ) {
				var $el = $( el ),
				    source = $el.data( 'source' ),
				    video = $el.data( 'video' ),
				    color = $el.data( 'color' );

				if ( source == 'vimeo' ) {
					$el.attr( 'src', '//player.vimeo.com/video/' + video + ( color ? '?color=' + color : '' ) );
				} else if ( source == 'youtube' ) {
					$el.attr( 'src', '//www.youtube.com/embed/' + video + '?rel=0' );
				}

			});
		});

		/* =======================================
		 * Resize Video Background
		 * =======================================
		 */
		$window.on( 'resize', function() {
			resizeBackground();
		});
		/**
		 * =======================================
		 * Initiate Stellar JS
		 * =======================================
		 */
		if ( $.fn.stellar && ! isMobile.any() ) {
			$.stellar({
				responsive: true,
				horizontalScrolling: false,
				hideDistantElements: false,
				verticalOffset: 0,
				horizontalOffset: 0,
			});
		};

		/**
		 * =======================================
		 * Numbers (Counter Up)
		 * =======================================
		 */
		if ( $.fn.counterUp ) {
			$( '.counter-up' ).counterUp({
				time: 1000,
			});
		};

		/**
		 * =======================================
		 * Scroll Spy
		 * =======================================
		 */
		var toggleHeaderFloating = function() {
			// Floating Header
			if ( $window.scrollTop() > 80 ) {
				$( '.header-section' ).addClass( 'floating' );
			} else {
				$( '.header-section' ).removeClass( 'floating' );
			};
		};

		$window.on( 'scroll', toggleHeaderFloating );

		/**
		 * =======================================
		 * One Page Navigation
		 * =======================================
		 */
		if ( $.fn.onePageNav ) {
			$( '#header-nav' ).onePageNav({
				scrollSpeed : 1000,
				begin : function() {
					$( '#navigation' ).collapse( 'toggle' );
				},
			});
		};

		/**
		 * =======================================
		 * Animations
		 * =======================================
		 */
		if ( $body.hasClass( 'enable-animations' ) && ! isMobile.any() ) {
			var $elements = $( '*[data-animation]' );

			$elements.each( function( i, el ) {

				var $el = $( el ),
				    animationClass = $el.data( 'animation' );

				$el.addClass( animationClass );
				$el.addClass( 'animated' );
				$el.addClass( 'wait-animation' );

				$el.one( 'inview', function() {
					$el.removeClass( 'wait-animation' );
					$el.addClass( 'done-animation' );
				});
			});
		};

		/**
		 * =======================================
		 * Anchor Link
		 * =======================================
		 */
		$body.on( 'click', 'a.anchor-link', function( e ) {
			e.preventDefault();

			var $a = $( this ),
			    $target = $( $a.attr( 'href' ) );

			if ( $target.length < 1 ) return;

			$( 'html, body' ).animate({ scrollTop: Math.max( 0, $target.offset().top - drew.headerFloatingHeight ) }, 1000 );
		});

		/**
		 * =======================================
		 * Google Maps
		 * =======================================
		 */
		if ( typeof Maplace == 'function' && $( '#gmap' ) ) {
			new Maplace( gmap_options ).Load();
		};

		/**
		 * =======================================
		 * Countdown
		 * =======================================
		 */
		if ( $.fn.countdown ) {
			$( '.countdown' ).each( function( i, el ) {
				var $el = $ ( el ),
				    date = $el.data( 'countdown' ),
				    format = $el.html();

				$el.countdown( date, function( e ) {
					$( el ).html( e.strftime( format ) );
				});
				$el.show();
			});
		};

		/**
		 * =======================================
		 * Form AJAX
		 * =======================================
		 */
		$( 'form' ).each( function( i, el ) {

			var $el = $( this );

			if ( $el.hasClass( 'form-ajax-submit' ) ) {

				$el.on( 'submit', function( e ) {
					e.preventDefault();

					var $alert = $el.find( '.form-validation' ),
					    $submit = $el.find( 'button' ),
					    action = $el.attr( 'action' );

					// button loading
					$submit.button( 'loading' );

					// reset alert
					$alert.removeClass( 'alert-danger alert-success' );
					$alert.html( '' );

					$.ajax({
						type     : 'POST',
						url      : action,
						data     : $el.serialize() + '&ajax=1',
						dataType : 'JSON',
						success  : function( response ) {

							// custom callback
							$el.trigger( 'form-ajax-response', response );

							// error
							if ( response.status == 'error' ) {
								$alert.html( response.message );
								$alert.addClass( 'alert-danger' ).fadeIn( 500 );
							}
							// success
							else if ( response.status == 'error' ) {
								$el.trigger( 'reset' );
								$alert.addClass( 'alert-success' ).fadeIn( 500 );
								$alert.html( response.message );
							}
							else {
								$alert.addClass( 'alert-' + response.status ).fadeIn( 500 );
							}

							// reset button
							$submit.button( 'reset' );
						},
					})
				});
			};
		});

		/* =======================================
		 * Preloader
		 * =======================================
		 */
		if ( $.fn.jpreLoader && $body.hasClass( 'enable-preloader' ) ) {

			$body.jpreLoader({
				showSplash : false,
				// autoClose : false,
			}, function() {
				$body.trigger( 'pageStart' );
			});

			$body.on( 'pageStart', function() {
				$body.addClass( 'done-preloader' );
			});

		} else {
			$body.trigger( 'pageStart' );
		};

		$window.trigger( 'resize' );
		$window.trigger( 'scroll' );

	});

})( jQuery );
