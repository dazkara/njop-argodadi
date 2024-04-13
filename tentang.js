$(document).ready(function() {
    var currentLocation = window.location.href;
    
    $('.nav_link').each(function() {
      if ($(this).attr('href') === currentLocation) {
        $(this).addClass('active');
      }
    });
  
    $('.nav_link').click(function() {
      $('.nav_link').removeClass('active');
      $(this).addClass('active');
    });
  
    if (window.location.pathname === '/tentang.html') {
      $('#tentang').addClass('active');
    }
  });
  