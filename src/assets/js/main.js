$(document).ready(function () {
  // // UI
  $(window).scroll(function () {
    $("#sidebar").stickySidebar({
      topSpacing: 30,
      resizeSensor: "true",
      minWidth: 992,
    });
  });
});
