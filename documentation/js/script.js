;(function( $ ) {
	"use strict";

	$( document ).on( 'ready', function() {

		var menu_id = [],
		    menu_title = [],
		    $select = $( '#navigation' );

		$( '.faq-group' ).each(function( i, el ) {
			
			var $el = $( el ),
			    id = '#' + $el.attr( 'id' ),
			    title = $el.find( 'h2' ).first().html();

			// Add Options
			$select.append( $( '<option value="'+ id +'">'+ title +'</option>' ));

			// Create anchors
			var $open = $( '<div>' ),
			    $close = $( '<div>' );

			$open.addClass( 'waypoint-anchor' ).attr( 'data-target', id );
			$close.addClass( 'waypoint-anchor' ).attr( 'data-target', id );

			$el.prepend( $open ).append( $close );
		});

		$select.on( 'change', function() {

			var $target = $( $( this ).val() ),
			    delay;

			if ( $target ) {

				delay = Math.max( Math.abs( $target.offset().top - $( window ).scrollTop() ) / 5, 500 );

				$( 'html, body' ).animate({ scrollTop: $target.offset().top - 100 }, delay );
			}

		});

		$( '.waypoint-anchor' ).waypoint(function( direction ) {

			var target = $( this.element ).data( 'target' ),
			    $target = $( target );

			$select.val( target );
		}, {
			offset : function() { return 0.5 * $( window ).height(); },
		});

		prettyPrint();

	});

})( jQuery );