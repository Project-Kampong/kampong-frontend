$(document).ready(function () {
  // // UI
  var lastScrollTop = 0;
  $(window).scroll(function (event) {
    stickybar();
    lastScrollTop = $(this).scrollTop();
  });

  $(window).resize(function () {
    stickybar();
  });

  function stickybar() {
    if (!$("body").find(".sidebar__inner").length) {
      return;
    } else {
      var imageWidth = $(".sidebar__inner").width();
      if ($(window).width() > 992) {
        var st = $(this).scrollTop();
        var startSticky = $("#main-container").offset().top;
        var current_height = $(".sidebar__inner").height() + st;
        var max_height =
          $("#main-container").offset().top + $("#main-container").height();
        if (st >= startSticky - 30 && current_height <= max_height) {
          $(".sidebar__inner").css({
            position: "fixed",
            top: 30 + "px",
            width: imageWidth + "px",
          });
        } else if (current_height >= max_height) {
          console.log("smaller");
          $(".sidebar__inner").css({
            position: "relative",
            top: max_height - $(".sidebar__inner").height() + "px",
          });
        } else {
          $(".sidebar__inner").css({
            position: "relative",
            top: 0,
          });
        }
      } else {
        $(".sidebar__inner").css({
          position: "relative",
          top: 0,
          width: "100%",
        });
      }
    }
  }
});
