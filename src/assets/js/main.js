$(document).ready(function () {
  // // UI
  navigationStick();
  actionbarStick();
  floatingActions();
  profileNavStick();
  var lastScrollTop = 0;
  $(window).scroll(function (event) {
    stickybar();
    lastScrollTop = $(this).scrollTop();
    navigationStick();
    actionbarStick();
    floatingActions();
    profileNavStick();
  });

  $(window).resize(function () {
    stickybar();
  });

  function profileNavStick() {
    if (!$("body").find(".sticky-profile-container").length) {
      return;
    } else {
      var st = $(this).scrollTop();
      var startSticky = $(".sticky-profile-container").offset().top;
      var totalStickyHeight =
        $(".sticky-profile-container").offset().top +
        $(".sticky-profile-container").height() -
        $(".sticky-profile").height();
      //console.log(st, totalStickyHeight);
      if (st > startSticky && st < totalStickyHeight) {
        $(".sticky-profile").addClass("sticky-active");
      } else if (st > totalStickyHeight) {
        $(".sticky-profile").removeClass("sticky-active");
      } else {
        $(".sticky-profile").removeClass("sticky-active");
      }
    }
  }

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

  function floatingActions() {
    if (!$("body").find(".floating-actions-container").length) {
      return;
    } else {
      var st = $(this).scrollTop() + $(this).height();
      var startSticky = $(".floating-actions-container").offset().top;
      var totalStickyHeight =
        $(".floating-actions-container").offset().top +
        $(".floating-actions-container").height();
      if (st < startSticky && st < totalStickyHeight) {
        $(".floating-actions").addClass("floating-actions-active");
      } else if (st > totalStickyHeight) {
        $(".floating-actions").removeClass("floating-actions-active");
      } else {
        $(".floating-actions").removeClass("floating-actions-active");
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
