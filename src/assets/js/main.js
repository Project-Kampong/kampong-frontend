$(document).ready(function () {
  // // UI
  navigationStick();
  var lastScrollTop = 0;
  $(window).scroll(function (event) {
    stickybar();
    lastScrollTop = $(this).scrollTop();
    navigationStick();
    actionbarStick();
  });

  $(window).resize(function () {
    stickybar();
  });

  function actionbarStick() {
    if (!$("body").find(".editing-active").length) {
      return;
    } else {
      var st = $(this).scrollTop();
      var startSticky = $(".editing-active").offset().top;
      var totalStickyHeight =
        $(".editing-active").offset().top + $(".editing-active").height();
      if (st > startSticky && st < totalStickyHeight) {
        $(".action-container").addClass("sticky-active");
      } else if (st > totalStickyHeight) {
        $(".action-container").removeClass("sticky-active");
      } else {
        $(".action-container").removeClass("sticky-active");
      }
    }
  }

  function navigationStick() {
    if (!$("body").find(".navigation-container").length) {
      return;
    } else {
      var st = $(this).scrollTop();
      var startSticky = $(".navigation-container").offset().top;
      if (st > startSticky) {
        $(".sticky-navigation").addClass("sticky-active");
      } else {
        $(".sticky-navigation").removeClass("sticky-active");
      }
    }
  }

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
