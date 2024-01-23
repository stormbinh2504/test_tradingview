$(document).ready(function () {
  console.log("đã zô");
  setInterval(function () {
    $(".theme-dark body .context-menu").ready(function () {
      $(".theme-dark body .context-menu tr").each(function (index) {
        if (!$(this).find($("td span")).hasClass("tr-menu-order")) {
          if ($(this).find($("td span")).hasClass("text-buy")) {
            $(".theme-dark body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-sell")) {
            $(".theme-dark body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-order")) {
            $(".theme-dark body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-setting-order")) {
            $(".theme-dark body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-setting-position")) {
            $(".theme-dark body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
        }
      });
    });
    $(".theme-light body .context-menu").ready(function () {
      $(".theme-light body .context-menu tr").each(function (index) {
        if (!$(this).find($("td span")).hasClass("tr-menu-order")) {
          if ($(this).find($("td span")).hasClass("text-buy")) {
            $(".theme-light body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-sell")) {
            $(".theme-light body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-order")) {
            $(".theme-light body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-setting-order")) {
            $(".theme-light body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-setting-position")) {
            $(".theme-light body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
        }
      });
    });
    $(".theme-blue body .context-menu").ready(function () {
      $(".theme-blue body .context-menu tr").each(function (index) {
        if (!$(this).find($("td span")).hasClass("tr-menu-order")) {
          if ($(this).find($("td span")).hasClass("text-buy")) {
            $(".theme-blue body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-sell")) {
            $(".theme-blue body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-order")) {
            $(".theme-blue body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-setting-order")) {
            $(".theme-blue body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
          if ($(this).find($("td span")).hasClass("text-setting-position")) {
            $(".theme-blue body .context-menu tr")
              .eq(index)
              .addClass("tr-menu-order");
          }
        }
      });
    });
  }, 10);
});
