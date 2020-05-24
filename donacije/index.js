window.onload = main;

function main() {
  let stepDown = document.getElementsByClassName("stepDown")[0];
  let stepUp = document.getElementsByClassName("stepUp")[0];
  let amount = document.getElementById("amount");
  let total = document.getElementById("total");
  let totalContainer = document.getElementById("totalContainer");
  let comment = document.getElementById("comment");
  let username = document.getElementById("username");
  let donateBtn = document.getElementsByClassName("donate")[0];
  let donationsContainer = document.getElementsByClassName("donations")[0];

  stepDown.onclick = stepClicked;
  stepUp.onclick = stepClicked;
  amount.oninput = amountEdited;
  donateBtn.onclick = donate;

  if (location.hash.includes("hvala")) {
    let ty = document.getElementsByClassName("thanks")[0];
    ty.style.display = "block";
    setTimeout(() => { ty.classList.add("thanksVisible"); }, 50);
  }

  let donationsXhr = new XMLHttpRequest();
  donationsXhr.responseType = 'json';
  donationsXhr.open("GET", "https://storage.googleapis.com/e-dnevnik-plus.appspot.com/donacije.json");
  donationsXhr.send();
  donationsXhr.onload = donationsLoaded;

  function donationsLoaded() {
    let donations = donationsXhr.response;
    let keys = donations && Object.keys(donations).sort().reverse(), i = 0;
    if (!keys) {
      let empty = document.createElement("div");
      empty.classList.add("emptyDonations");
      empty.textContent = "Nema donacija, budite prvi!";
      donationsContainer.appendChild(empty);
      return false;
    }

    (function addDonation() {
      let key = keys[i];
      let data = donations[key];
      let username = data.username ? data.username + " je donirao/la" : "Anonimna osoba je donirala";
      let date = new Date(parseInt(key));
      let donation = document.createElement("div");
      let title = document.createElement("div");
      let titleUser = document.createElement("div");
      let dateContainer = document.createElement("div");
      let comment = document.createElement("div");

      donation.className = "donation";
      title.className = "boxTitle";
      titleUser.className = "titleUser";
      comment.className = "comment";
      dateContainer.className = "donationDate";

      titleUser.innerHTML = username + " &nbsp" + "☕".repeat(parseInt(data.coffees));
      dateContainer.textContent = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(". ") + ".";
      comment.textContent = data.comment;

      title.appendChild(dateContainer);
      title.appendChild(titleUser);
      donation.appendChild(title);

      if (data.comment) {
        donation.appendChild(comment);
      } else {
        title.style.border = title.style.padding = "none";
        title.style.margin = titleUser.style.margin = 0;
      }

      donationsContainer.appendChild(donation);

      ++i != keys.length && i < 10 && setTimeout(addDonation, 250);
    })();
  }

  function amountEdited() {
    let newAmount = parseInt(this.textContent.replace(/\D+/g, ""));
    newAmount = newAmount <= 1000 && newAmount || 1000;
    this.textContent = newAmount;
    total.textContent = newAmount * 3;
  }

  function stepClicked() {
    let raise = this == stepUp;
    let currentAmount = parseInt(amount.textContent);
    if (currentAmount > 999 && raise) {return false;}

    totalContainer.style.opacity = amount.style.opacity = 0;
    totalContainer.style.transform = "translateY(" + (raise ? "" : "-") + "10px)";
    amount.style.transform = "translateX(" + (raise ? "-" : "") + "10px)";

    setTimeout(() => {
      let newAmount = parseInt(amount.textContent) + (raise ? 1 : -1);
      amount.textContent = newAmount;
      total.textContent = newAmount * 3;
      totalContainer.style.transition = amount.style.transition = "0ms";
      totalContainer.style.transform = "translateY(" + (raise ? "-" : "") + "10px)";
      amount.style.transform = "translateX(" + (raise ? "" : "-") + "10px)";
      setTimeout(() => {
        totalContainer.style.transition = amount.style.transition = "350ms";
        totalContainer.style.transform = "translateY(0)";
        amount.style.transform = "translateX(0)";
        totalContainer.style.opacity = amount.style.opacity = 1;
      }, 50);
    }, 350);
  }


  function donate() {
    let timestamp = Date.now();
    let overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);

    /* https://developer.paypal.com/docs/paypal-payments-standard/integration-guide/Appx-websitestandard-htmlvariables/ */

    let queryStringParams = {
      image_url: "https://ednevnik.plus/assets/images/paypal-logo.png",
      cmd: "_donations",
      business: "kristijan.ros@gmail.com",
      amount: total.textContent,
      currency_code: "EUR",
      lc: "en-HR",
      custom: timestamp,
      charset: "utf-8",
      no_shipping: 1,
      no_note: 1,
      return: "ednevnik.plus/donacije#hvala",
      notify_url: "https://e-dnevnik-plus.firebaseapp.com/paypal-success",
      cancel_return: "https://ednevnik.plus/donacije"
    }

    /* Firebase */
    let userInfoUrl = "https://e-dnevnik-plus.firebaseapp.com/pending-donations";
    let userInfoXhr = new XMLHttpRequest();
    let userInfo = URIencoder({
      ime: username.value,
      komentar: comment.value,
      coffees: amount.textContent,
      id: timestamp
    });
    userInfoXhr.open('POST', userInfoUrl);
    userInfoXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    userInfoXhr.send(userInfo);

    /* Spreadsheet */
    let mailUrl = "https://script.google.com/macros/s/AKfycbw5Fs3Y-Ht3Cs3PMdQhpUW_-Xd_poar4w5C3ae1SmNnfTIUKbwm/exec";
    let mailXhr = new XMLHttpRequest();
    let data = URIencoder({
      "Ime: ": username.value,
      "Komentar: ": comment.value,
      "Kava: ": amount.textContent,
      formDataNameOrder: '["Komentar: ","Ime: "]',
      formGoogleSend: "",
      formGoogleSheetName: "responses"
    });

    mailXhr.open('POST', mailUrl);
    mailXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    mailXhr.send(data);

    setTimeout(() => {
      location.href = "https://www.paypal.com/cgi-bin/webscr?" + URIencoder(queryStringParams);
    }, 500);
  }
}

function URIencoder(data) {
  return Object.keys(data).map((k) => {
    return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
  }).join('&')
}
