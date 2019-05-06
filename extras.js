window.addEventListener("load", function () {
  const buttons = $(".tab-button");
  console.log(buttons)
  $('.text-primary').on('click', function() {
    console.log("HI");
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
  $("amp-social-share").on('click', function() {
    var type = $(this).attr("type")
    if (type == "email") {
      console.log("HI2");
      window.location.assign("mailto:?subject=Odli%C4%8Dna%20ekstenzija%20za%20Chrome%20%E2%80%94%20e-Dnevnik%20Plus&body=https%3A//chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe");
    } else if (type == "facebook") {
      window.location.assign("https://www.facebook.com/sharer/sharer.php?u=https%3A//chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe");
    } else if (type == "linkedin") {
      window.location.assign("https://www.linkedin.com/shareArticle?mini=true&url=https%3A//chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe&title=Odli%C4%8Dna%20ekstenzija%20za%20Chrome%20%E2%80%94%20e-Dnevnik%20Plus.&summary=Napredne%20postavke%20e-Dnevnika%20za%20u%C4%8Denike%20i%20roditelje&source=ednevnik.plus");
    } else {
      window.location.assign("https://twitter.com/home?status=Odli%C4%8Dna%20ekstenzija%20za%20Chrome%20%E2%80%94%20e-Dnevnik%20Plus%3A%0Ahttps%3A//chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe");
    }
    return false;
  });
});
