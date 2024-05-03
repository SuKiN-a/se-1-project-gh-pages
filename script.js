const BACKEND_URL = "https://software-engineering-1-project.fly.dev";
// Select necessary elements from the DOM
const formOpenBtn = document.querySelector("#form-open");
const home = document.querySelector(".home");
const formContainer = document.querySelector(".form_container");
const formCloseBtn = document.querySelector(".form_close");
const signupBtn = document.querySelector("#signup");
const loginBtn = document.querySelector("#login");
const pwShowHide = document.querySelectorAll(".pw_hide");
const forgotPwLink = document.querySelector(".forgot_pw");
const forgotPwForm = document.querySelector(".forgot_password_form");
const forgotPwCancelLink = document.querySelector(
  ".forgot_password_form .cancel_link"
);
const loginForm = document.querySelector(".login_form"); // Define login form element

// Function to show the form
function showForm() {
  home.classList.add("show");
}

// Function to hide the form
function hideForm() {
  home.classList.remove("show");
  // Hide login and signup forms when closing the main form
  formContainer.classList.remove("active");
}

// Function to show login form and hide forgot password form
function showLoginForm() {
  login_form.style.display = "block";
  forgot_password_form.style.display = "none";
}

// Function to show forgot password form and hide login form
function showForgotPasswordForm() {
  login_form.style.display = "none";
  forgot_password_form.style.display = "block";
}

// Event listener for opening the form
formOpenBtn.addEventListener("click", showForm);

// Event listener for closing the form
formCloseBtn.addEventListener("click", hideForm);

// Event listener for toggling password visibility
pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    const getPwInput = icon.parentElement.querySelector("input");
    getPwInput.type = getPwInput.type === "password" ? "text" : "password";
    icon.classList.toggle("uil-eye");
    icon.classList.toggle("uil-eye-slash");
  });
});

// Event listener for switching to signup form
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
  loginForm.style.display = "none"; // Hide login form when showing signup form
});

// Event listener for switching to login form
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});

// Event listener for clicking on the "Forgot password?" link
forgotPwLink.addEventListener("click", (e) => {
  e.preventDefault();
  showForgotPasswordForm();
});

// Event listener for clicking on the "Cancel" link in the forgot password form
forgotPwCancelLink.addEventListener("click", (e) => {
  e.preventDefault();
  showLoginForm();
});

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

// login form submit handlers
document.getElementById("login_form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const params = JSON.stringify(Object.fromEntries(new FormData(e.target)));
  console.log(params);

  const res = await fetch(BACKEND_URL + "/login", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: params,
  });

  const { token } = await res.json();
  if (token == null) {
    // TODO: proper password not correct alert.
    alert("email or password was not correct.");
    return;
  }
  localStorage.setItem("token", token);
  console.log(`set token ${localStorage.getItem("token")}`);
});

document.getElementById("signup_form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const params = JSON.stringify(data);
  console.log(params);

  if (data["confirm_password"] != data["password"]) {
    alert("password and confirm password not equal");
    return;
  }

  const res = await fetch(BACKEND_URL + "/signup", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: params,
  });

  const error = await res.json();

  if (error && error["error"]) {
    alert("ERROR: " + error["error"]);
  }
});

async function createTeam(title, description, maximum_number) {
  let token = localStorage.getItem("token");
  const res = await fetch(BACKEND_URL + "/team/new", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "token": token,
      "team_name": title,
      "max_users": 0,
    }),
  });
  if (res.status != 200) {
    alert(`error: ${(await res.json()).detail.error}`)
  }
}

async function allTeams() {
  const res = await fetch(BACKEND_URL + "/team/all", {
    method: "GET",
    mode: "cors",
  });
  return await res.json();
}

/**
 * give all dates as Date objects!
 * teams should be an array of team names but the backend only implements using 1 team per event.
 */
async function createEvent(
  title, description, maximum_participants, location, teams,
  registration_start_date, registration_end_date, event_start_date, event_end_date) {
  const res = await fetch(BACKEND_URL + "/event/new", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "token": localStorage.getItem("token"),
      "event_name": title,
      "event_max": maximum_participants,
      "team_max": 1,
      "team_name": teams[0],
      "location": location,
      "status": 1,
      "event_start_time": event_start_date.toISOString(),
      "event_end_time": event_end_date.toISOString(),
      "registration_start_time": registration_start_date.toISOString(),
      "registration_end_time": registration_end_date.toISOString(),
    }),
  });
  if (res.status != 200) {
    alert(`error: ${(await res.json()).detail.error}`)
  }
}

async function joinTeam(team_name) {
  const res = await fetch(BACKEND_URL + "/team/join", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "token": localStorage.getItem("token"),
      "team_name": team_name,
    }),
  });

  if (res.status != 200) {
    alert(`error: ${(await res.json()).detail.error}`)
  }
}