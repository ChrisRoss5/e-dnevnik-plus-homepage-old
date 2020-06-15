window.onload = main;

function main() {
  let stepDown = document.getElementsByClassName("stepDown")[0];
  let stepUp = document.getElementsByClassName("stepUp")[0];
  let amount = document.getElementById("amount");
  let total = document.getElementById("total");
  let totalContainer = document.getElementById("totalContainer");
  let comment = document.getElementById("comment");
  let username = document.getElementById("username");
  let donationsContainer = document.getElementsByClassName("donations")[0];
  let donatePaypal = document.getElementById("donate");
  let donateIBAN = document.getElementById("iban");
  let quantity = 1;

  stepDown.onclick = stepClicked;
  stepUp.onclick = stepClicked;
  amount.oninput = amountEdited;
  donatePaypal.onclick = donate;
  donateIBAN.onclick = copyIban;

  if (location.hash.includes("hvala")) {
    let ty = document.getElementsByClassName("thanks")[0];
    ty.style.display = "block";
    setTimeout(() => { ty.classList.add("thanksVisible"); }, 50);
  }

  let donationsXhr = new XMLHttpRequest();
  donationsXhr.open("GET", "https://storage.googleapis.com/e-dnevnik-plus.appspot.com/donacije.json");
  donationsXhr.send();
  donationsXhr.onload = donationsLoaded;

  function donationsLoaded() {
    let donations = donationsXhr.response && JSON.parse(donationsXhr.response);
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
    newAmount = newAmount <= 10000 && newAmount || 10000;
    this.textContent = newAmount;
    total.textContent = (newAmount * 10).toFixed(0);
  }

  function stepClicked() {
    let raise = this == stepUp;
    let currentAmount = parseInt(amount.textContent);

    quantity = parseInt(amount.textContent) + (raise ? 1 : -1);

    if (currentAmount > 9999 && raise) {
      return false;
    }
    if (!raise && quantity < 1) {
      quantity = 1;
      return false;
    }

    totalContainer.style.opacity = amount.style.opacity = 0;
    totalContainer.style.transform = "translateY(" + (raise ? "" : "-") + "10px)";
    amount.style.transform = "translateX(" + (raise ? "-" : "") + "10px)";

    setTimeout(() => {

      let newAmount = quantity;
      amount.textContent = newAmount;
      total.textContent = (newAmount * 10).toFixed(0);
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

  function sendInputs() {
    let mailUrl = "https://script.google.com/macros/s/AKfycbw5Fs3Y-Ht3Cs3PMdQhpUW_-Xd_poar4w5C3ae1SmNnfTIUKbwm/exec";
    let mailXhr = new XMLHttpRequest();
    let data = URIencoder({
      "Ime: ": username.value,
      "Komentar: ": comment.value,
      "Kava: ": amount.textContent,
      formDataNameOrder: '["Kava: ","Komentar: ","Ime: "]',
      formGoogleSend: "",
      formGoogleSheetName: "responses"
    });

    mailXhr.open('POST', mailUrl);
    mailXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    mailXhr.send(data);
  }

  function copyIban() {
    const iban = "HR1123400093112950706";

    if (!navigator.clipboard) {
      var textArea = document.createElement("textarea");
      textArea.value = iban;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textArea);
      return;
    }

    navigator.clipboard.writeText(iban).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });

    donateIBAN.textContent = "Kopirano!";
    donateIBAN.style.color = "green";
    setTimeout(() => {
      donateIBAN.textContent = "Kopiraj IBAN";
      donateIBAN.style.color = "black";
    }, 2000);

    sendInputs();
  }

  function donate() {
    donatePaypal.removeEventListener("click", donate);

    let timestamp = Date.now();
    let overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);

    /* https://developer.paypal.com/docs/paypal-payments-standard/integration-guide/Appx-websitestandard-htmlvariables/ */

    let queryStringParams = {
      image_url: "https://ednevnik.plus/assets/images/paypal-logo.png",
      cmd: "_xclick",
      business: "kristijan.ros@gmail.com",
      amount: parseFloat(total.textContent) / 6.6,
      currency_code: "USD",
      item_name: "Broj kava: " + quantity,
      lc: "en-HR",
      custom: timestamp,
      charset: "utf-8",
      no_shipping: 1,
      no_note: 1,
      return: "https://ednevnik.plus/donacije#hvala",
      notify_url: "https://e-dnevnik-plus.firebaseapp.com/paypal-success",
      cancel_return: "https://ednevnik.plus/donacije"
    }

    //location.href = "https://www.paypal.com/cgi-bin/webscr?" + URIencoder(queryStringParams);

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

    sendInputs();

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
