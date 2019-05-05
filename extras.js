document.addEventListener("DOMContentLoaded", function() {
  console.log("HELLO")
  const buttons = $(".tab-button")[0];
  console.log(buttons)
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
    return false;
  });
  $("amp-social-share").on('click', function() {
    if (this.type == "email") {
      window.location.assign("mailto:?subject=Odli%C4%8Dna%20ekstenzija%20za%20Chrome%20%E2%80%94%20e-Dnevnik%20Plus&body=https%3A//chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe");
    }
    return false;
  });
});
