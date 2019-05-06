window.addEventListener("load", function () {
  const buttons = $(".tab-button");
  console.log(buttons)
  $('.text-primary').on('click', function() {
    console.log("HI");
    $("html, body").animate({scrollTop: $($("#tab1-i")).position().top}, 1000);
    $(".close-sidebar")[0].click();
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
    console.log("HII", this.attr("type"))
    if (this.attr("type") == "email") {
      console.log("HI2");
      window.location.assign("mailto:?subject=Odli%C4%8Dna%20ekstenzija%20za%20Chrome%20%E2%80%94%20e-Dnevnik%20Plus&body=https%3A//chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe");
    } else if (this.attr("type") == "facebook") {
      window.location.assign();
    } else if (this.attr("type") == "linkedin") {
      window.location.assign();
    } else {
      window.location.assign();
    }
    return false;
  });
});
