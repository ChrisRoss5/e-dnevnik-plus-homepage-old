const buttons = $(".tab-button")[0];
console.log(buttons)
$(document).ready(function() {
  $('.text-primary display-7').on('click', function() {
    $("html, body").animate({scrollTop: $($("#tab1-i")).position().top}, 1000);
    if (this.textContent == "Instalacija i privatnost") {
      buttons[1].click();
    } else if (this.textContent == "Mogućnosti") {
      buttons[2].click();
    } else if (this.textContent == "Dolazi uskoro") {
      buttons[3].click();
    } else {
      buttons[4].click();
    }
  });
});
