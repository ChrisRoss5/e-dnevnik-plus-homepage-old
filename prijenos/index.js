window.onload = () => {

  let form = document.getElementsByClassName("form")[0];
  let loginBox = document.getElementsByClassName("login-form")[0];
  let usernameBox = document.getElementById("username");
  let passwordBox = document.getElementById("password");
  let finishedBox = document.getElementById("finished");
  let submit = document.getElementsByTagName("button")[0];
  let check1 = document.getElementById("check1");
  let progressMsg1 = check1.firstElementChild;
  let check2 = document.getElementById("check2");
  let progressMsg2 = check2.firstElementChild;
  let formHeight = 168;

  submit.onclick = startProgress;
  document.body.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      startProgress();
    }
  });

  function startProgress() {
    reset();

    setTimeout(() => {
      loginBox.style.minHeight = 168 + "px";
      formHeight = 215;

      const payload = JSON.stringify({
        "username": usernameBox.value,
        "password": passwordBox.value
      });

      disableButton(submit);
      progressMessage(check1, progressMsg1, formHeight + "px");
      login(payload)
    }, 10);
  }

  function reset() {
    check1.style.opacity = check2.style.opacity = 0;
    progressMsg1.style.left = progressMsg2.style.left = "-25px";
    check1.title = check2.title = "Učitava se...";
    check1.className = check2.className = "";
    finishedBox.style.height = finishedBox.style.opacity = 0;
    finishedBox.textContent = "";
    finishedBox.className = "";
  }

  function login(payload) {
    let loginRequest = new XMLHttpRequest();
    loginRequest.open("POST", "https://e-dnevnik-plus.firebaseapp.com/prijava", true);
    loginRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    loginRequest.send(payload);
    loginRequest.onload = () => {

      check1.title = "[" + loginRequest.status + "] " + loginRequest.responseText;

      if (loginRequest.status == 201) {

        formHeight += 45;
        progressMessage(check2, progressMsg2, formHeight + "px");
        successMessage(check1);
        encrypt(payload);

      } else {
        errorMessage(check1, loginRequest.responseText);
      }
    }
  }

  function encrypt(payload) {
    let ecryptionRequest = new XMLHttpRequest();
    ecryptionRequest.open("POST", "https://e-dnevnik-plus.firebaseapp.com/enkriptor", true);
    ecryptionRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    ecryptionRequest.send(payload);
    ecryptionRequest.onload = () => {

      let response = ecryptionRequest.responseText;
      check2.title = "[" + ecryptionRequest.status + "] " + "Podaci su uspješno enkriptirani.";

      if (ecryptionRequest.status == 200) {

        successMessage(check2);
        finished(true, "PRIJENOS JE USPJEŠNO ZAVRŠEN");
        copyToClipboard(response);
        console.log(response)

      } else {
        errorMessage(check2, response);
      }
    };
  }

  function progressMessage(el1, el2, h) {
    let message = el2.innerHTML.replace(/\./g, '');
    let loading = window.setInterval(() => {
      if (el1.title != "Učitava se...") {
        el2.innerHTML = message + "...";
        clearInterval(loading);
        return false;
      }
      if (el2.innerHTML.substr(el2.innerHTML.length - 3) == "...") {
        el2.innerHTML = message;
      } else {
        el2.innerHTML += ".";
      }
    }, 100);

    form.style.minHeight = h;
    el1.style.opacity = 1;
    el2.style.left = 0;
  }

  function successMessage(el) {
    el.classList.add("success");
  }

  function errorMessage(el, message) {
    el.classList.add("error");
    finished(false, message);
  }

  function finished(success, message) {
    form.style.minHeight = formHeight + 50 + "px";
    finishedBox.style.height = "46px";
    finishedBox.style.opacity = 1;

    setTimeout(() => {
      finishedBox.classList.add(success ? "successfulFinish" : "badFinish");
      finishedBox.innerHTML = message;
    }, 250);

    enableButton(submit);
  }

  function disableButton(button) {
    button.disabled = true;
    button.style.color = "transparent";
    setTimeout(() => {
      button.textContent = "pričekajte...";
      button.style.backgroundColor = "#235694";
      button.style.color = "#FFFFFF";
    }, 150);
  }

  function enableButton(button) {
    button.disabled = false;
    button.style.color = "transparent";
    setTimeout(() => {
      button.textContent = "GENERIRAJ";
      button.style.backgroundColor = "rgb(97, 193, 248)";
      button.style.color = "#FFFFFF";
    }, 150);
  }

  function copyToClipboard(text) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }

}