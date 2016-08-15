/**
 * Main JS file for Privado
 */


// Preloader

  $(window).load(function(){
        $('.loader').fadeOut();    
        $('#preloader').delay(350).fadeOut('slow');    
        $('body').delay(350);   

    });

// Global document ready function

jQuery(document).ready(function($) {
     "use strict";

      var $postContent = $(".post-content");
      $postContent.fitVids();

   // Off canvas Navigation Menu 
    $('#nav-expander').on('click',function(e){
        e.preventDefault();
        $('body').toggleClass('nav-expanded');
        $('#nav-expander').toggleClass('active');
    });
    $('#nav-close').on('click',function(e){
        e.preventDefault();
        $('body').removeClass('nav-expanded');
    });


    //update header content opacity while scrolling

      $(document).on('scroll', function(){
          var top = $(this).scrollTop();
              var newOpacity = 1 - top / 400;
              $(".header-content").css('opacity', newOpacity);;
      })

    // Scroll to Blog

        $('a.scroll-down').click(function() {
        $('html, body').animate({ scrollTop:$('#blog-list').offset().top }, 500);
        return false;
    });

    // Scroll to Blog Comments

        $('a.scroll-to-comments').click(function() {
        $('html, body').animate({ scrollTop:$('#disqus_thread').offset().top }, 500);
        return false;
    });

});

  // Instagram Feed
  if ($('#instafeed').length > 0) {
      var userFeed = new Instafeed({
          get: 'user',
          userId: 289479014, // Replace with your own userId
          accessToken: '289479014.467ede5.ba210a7224664bd7b41d519d14d74cd3', // Replace with your own accessToken
          limit: 8
      });
      userFeed.run();
  };


// Next & Previous Posts Workaround

$(function(){
  var NextPrevLinksModule = function(){
    var curr,
        $prevLink,
        $nextLink;

    return {
      init: function(){
        curr = $('#curr-post-uuid').html();
        $prevLink = $('.prev-post');
        $nextLink = $('.next-post');

        $prevLink.hide();
        $nextLink.hide();

        this.parseRss();
      },
      // creates previous and next links
      createLinks: function(items){
        for (var i = 0; i < items.length; i++){
          var uuid = $(items[i]).find('guid').text();
          if (uuid === curr){
            if (i < items.length-1){
              $prevLink.attr('href', $(items[i+1]).find('link').text());
              $prevLink.show();
            }
            if (i > 0){
              $nextLink.attr('href', $(items[i-1]).find('link').text());
              $nextLink.show();
            }
          }
        }
      },
      // iteratively parses rss feeds to generate posts object
      parseRss: function(page, items, lastId){
        self = this;
        page = page || 1;
        items = items || undefined;
        lastId = lastId || '';
        $.get('/rss/' + page, function(data){
          var posts = $(data).find('item');
          var currId;
          if (posts.length > 0) currId = $(posts[0]).find('guid').text();

          if (currId === lastId){
            // if this page has already been parsed, create links
            self.createLinks(items);
          } else {
            // if not, continue parsing posts
            items = items ? items.add(posts) : posts;
            lastId = currId;
            self.parseRss(page+1, items, lastId);
          }
        });
      }
    };
  }();

  NextPrevLinksModule.init();

});
