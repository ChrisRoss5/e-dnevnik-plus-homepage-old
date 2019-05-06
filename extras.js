window.addEventListener("load", function () {
  const buttons = $(".tab-button");
  $('.text-primary').on('click', function() {
    $("html, body").animate({scrollTop: $($("#tab1-i")).position().top}, 1000);
    $(".close-sidebar")[0].click();
    if (this.textContent == "Instalacija i privatnost") {
      buttons[0].click();
    } else if (this.textContent == "Mogućnosti") {
      buttons[1].click();
    } else if (this.textContent == "Dolazi uskoro") {
      buttons[2].click();
    } else {
      buttons[3].click();
    }
    return false;
  });
});
