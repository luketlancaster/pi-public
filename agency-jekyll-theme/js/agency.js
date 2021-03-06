/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

fields = {};

fb = new Firebase("https://weddin.firebaseio.com/attendees");

$('#form_button').click(function(event) {
  event.preventDefault();
  $('#contactForm').find("input").each(function() {
    return fields[this.name] = $(this).val();
  });
  fields.message = $("#message").val();
  return $.ajax({
    dataType: 'jsonp',
    url: 'https://getsimpleform.com/messages/ajax?form_api_token=737d286e909632d0d32d9f283c87cfc0',
    data: {
      name: fields.name,
      email: fields.email,
      attending: fields.attending,
      number: fields.number,
      message: fields.message
    }
  }).done(function() {
    fb.push(fields);
    $("#form_button").text("Thanks!");
    $("#email").val('');
    $("#name").val('');
    $("#attending").val('');
    $("#number").val('');
    $("#message").val('');
  });
});


// $(window).scroll(function() {
//   $(".timeline-block").each( function() {
//       if( $(window).scrollTop() > $(this).offset().top - 200 && $(this).hasClass('hidden')) {
//         $(this).toggleClass('hidden');
//         $(this).addClass('slideInUp');
//         console.log("hide")
//       } else {
//         $(this).addClass('opacity',0);
//       }
//   });
// });

$('div.modal').on('show.bs.modal', function() {
	var modal = this;
	var hash = modal.id;
	window.location.hash = hash;
	window.onhashchange = function() {
		if (!location.hash){
			$(modal).modal('hide');
		}
	}
});
