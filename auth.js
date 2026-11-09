// Sign in and sign up windows. Accounts are saved in this browser with localStorage:
//   "catalystUsers" = every account (with password)    "catalystUser" = the person signed in now

const PASSWORD_FIELDS = ["signInPassword", "signUpPassword", "signUpConfirm"];

function makeModalsHtml() {
    let townships = '<option value="">Not listed / not in Yangon</option>';
    TOWNSHIP_NAMES.forEach((name) => {
        townships += `<option value="${name}">${name}</option>`;
    });

    return `
    <dialog id="signinModal" class="auth-modal" aria-labelledby="signInTitle">
        <div class="auth-art auth-art-signin">
            <span class="auth-art-tag">CATALYST Yangon</span>
            <h3>Welcome back to your health portal</h3>
            <p>Appointments, hospitals and trusted health facts in one place.</p>
        </div>
        <form id="signInForm" class="auth-form">
            <button type="button" class="auth-close" aria-label="Close">&times;</button>
            <h2 id="signInTitle">Sign in</h2>
            <p class="auth-sub">Enter your email and password to open your account.</p>
            <label class="auth-label" for="signInEmail">Email address</label>
            <input class="auth-input" type="email" id="signInEmail" autofocus placeholder="you@example.com" autocomplete="email" required>
            <label class="auth-label" for="signInPassword">Password</label>
            <input class="auth-input" type="password" id="signInPassword" placeholder="Your password" autocomplete="current-password" required>
            <label class="auth-check"><input type="checkbox" id="signInShow"> Show password</label>
            <button type="submit" class="auth-submit">Sign In</button>
            <div id="signInMessage" class="auth-message" role="status" hidden></div>
            <p class="auth-switch">New to CATALYST? <a href="#" class="signup-link">Create an account</a></p>
        </form>
    </dialog>

    <dialog id="signupModal" class="auth-modal" aria-labelledby="signUpTitle">
        <div class="auth-art auth-art-signup">
            <span class="auth-art-tag">Join CATALYST</span>
            <h3>Your health information in one place</h3>
            <p>Create a free account and keep your details ready when you need them.</p>
        </div>
        <form id="signUpForm" class="auth-form">
            <button type="button" class="auth-close" aria-label="Close">&times;</button>
            <h2 id="signUpTitle">Create account</h2>
            <p class="auth-sub">It only takes a minute.</p>
            <label class="auth-label" for="signUpName">Full name</label>
            <input class="auth-input" type="text" id="signUpName" autofocus placeholder="Your full name" autocomplete="name" required>
            <label class="auth-label" for="signUpEmail">Email address</label>
            <input class="auth-input" type="email" id="signUpEmail" placeholder="you@example.com" autocomplete="email" required>
            <label class="auth-label" for="signUpTownship">Yangon township (optional)</label>
            <select class="auth-input" id="signUpTownship">${townships}</select>
            <label class="auth-label" for="signUpPassword">Password (at least 8 characters)</label>
            <input class="auth-input" type="password" id="signUpPassword" minlength="8" autocomplete="new-password" required>
            <label class="auth-label" for="signUpConfirm">Confirm password</label>
            <input class="auth-input" type="password" id="signUpConfirm" minlength="8" autocomplete="new-password" required>
            <label class="auth-check"><input type="checkbox" id="signUpShow"> Show passwords</label>
            <button type="submit" class="auth-submit">Sign Up</button>
            <div id="signUpMessage" class="auth-message" role="status" hidden></div>
            <p class="auth-switch">Already have an account? <a href="#" class="signin-link">Sign in</a></p>
            <p class="auth-note">School project: accounts are saved only in this browser. Do not use a real password. <a href="privacy-policy.html">Privacy Policy</a></p>
        </form>
    </dialog>`;
}

function showAuthMessage(id, text, isError) {
    const box = document.getElementById(id);

    box.textContent = text;
    box.className = isError ? "auth-message error" : "auth-message success";
    box.hidden = false;
}

function resetModal(dialog) {
    dialog.querySelector("form").reset();
    dialog.querySelector(".auth-message").hidden = true;
    dialog.querySelector(".auth-submit").disabled = false;

    // "Show password" turns the fields into text, so turn them back
    PASSWORD_FIELDS.forEach((id) => {
        const field = dialog.querySelector("#" + id);
        if (field != null) {
            field.type = "password";
        }
    });
}

function openAuthModal(which) {
    const signIn = document.getElementById("signinModal");
    const signUp = document.getElementById("signupModal");

    if (signIn == null) {
        return;
    }
    closeMenu();

    const toOpen = which == "signup" ? signUp : signIn;
    const toClose = which == "signup" ? signIn : signUp;

    if (toClose.open) {
        toClose.close();
    }
    if (!toOpen.open) {
        toOpen.showModal();
    }
}

function togglePasswords(checkbox, ids) {
    ids.forEach((id) => {
        document.getElementById(id).type = checkbox.checked ? "text" : "password";
    });
}

function isGoodEmail(email) {
    return email.includes("@") && email.includes(".") && email.indexOf("@") > 0 && !email.includes(" ");
}

function signIn(event) {
    event.preventDefault();

    const email = document.getElementById("signInEmail").value.trim().toLowerCase();
    const password = document.getElementById("signInPassword").value;

    if (!isGoodEmail(email)) {
        showAuthMessage("signInMessage", "Please type a correct email address, for example you@example.com.", true);
        return;
    }
    if (password == "") {
        showAuthMessage("signInMessage", "Please type your password.", true);
        return;
    }

    const found = getUsers().find((person) => person.email == email);

    if (found == undefined) {
        showAuthMessage("signInMessage", "No account was found for this email. Please sign up first.", true);
        return;
    }
    if (found.password != password) {
        showAuthMessage("signInMessage", "Incorrect password. Please try again.", true);
        return;
    }

    // Save only the details that the pages need (never the password)
    const user = {
        name: found.name,
        email: found.email,
        township: found.township,
        joined: found.joined,
        joinedDate: found.joinedDate
    };
    localStorage.setItem("catalystUser", JSON.stringify(user));

    const firstName = found.name.split(" ")[0];
    saveFlash(`You have successfully logged in. Welcome back, ${firstName}!`, "success");

    // Show the success message first, then open the account page
    showAuthMessage("signInMessage", `\u2714 Login successful! Welcome back, ${firstName}. Opening your account...`, false);
    document.querySelector("#signInForm .auth-submit").disabled = true;
    setTimeout(() => {
        window.location.href = "account.html";
    }, 1500);
}

function signUp(event) {
    event.preventDefault();

    const name = document.getElementById("signUpName").value.trim();
    const email = document.getElementById("signUpEmail").value.trim().toLowerCase();
    const township = document.getElementById("signUpTownship").value;
    const password = document.getElementById("signUpPassword").value;
    const confirmPassword = document.getElementById("signUpConfirm").value;

    if (name.length < 2) {
        showAuthMessage("signUpMessage", "Please type your full name.", true);
        return;
    }
    if (!isGoodEmail(email)) {
        showAuthMessage("signUpMessage", "Please type a correct email address, for example you@example.com.", true);
        return;
    }
    if (password.length < 8) {
        showAuthMessage("signUpMessage", "Your password needs at least 8 characters.", true);
        return;
    }
    if (password != confirmPassword) {
        showAuthMessage("signUpMessage", "The two passwords are not the same. Please try again.", true);
        return;
    }

    const users = getUsers();
    if (users.some((person) => person.email == email)) {
        showAuthMessage("signUpMessage", "This email already has an account. Please sign in.", true);
        return;
    }

    users.push({
        name: name,
        email: email,
        township: township,
        password: password,
        joined: new Date().toLocaleDateString(),
        joinedDate: new Date().toISOString()
    });
    localStorage.setItem("catalystUsers", JSON.stringify(users));

    showAuthMessage("signUpMessage", "\u2714 Account created successfully! Opening the sign in window...", false);
    document.querySelector("#signUpForm .auth-submit").disabled = true;
    setTimeout(() => {
        openAuthModal("signin");
        document.getElementById("signInEmail").value = email;
        showAuthMessage("signInMessage", "Your account is ready. Please sign in with your password.", false);
        document.getElementById("signInPassword").focus();
    }, 1200);
}

// Make every link with the given class open the given window
function linkToModal(className, which) {
    const links = document.getElementsByClassName(className);

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function (event) {
            event.preventDefault();
            openAuthModal(which);
        });
    }
}

function setupAuthModals() {
    document.body.insertAdjacentHTML("beforeend", makeModalsHtml());

    const dialogs = document.getElementsByClassName("auth-modal");
    for (let i = 0; i < dialogs.length; i++) {
        const dialog = dialogs[i];

        dialog.querySelector(".auth-close").addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (event) => {
            if (event.target == dialog) {
                dialog.close();
            }
        });
        dialog.addEventListener("close", () => resetModal(dialog));
    }

    linkToModal("signin-link", "signin");
    linkToModal("signup-link", "signup");

    document.getElementById("signInShow").addEventListener("change", function () {
        togglePasswords(this, ["signInPassword"]);
    });
    document.getElementById("signUpShow").addEventListener("change", function () {
        togglePasswords(this, ["signUpPassword", "signUpConfirm"]);
    });
    document.getElementById("signInForm").addEventListener("submit", signIn);
    document.getElementById("signUpForm").addEventListener("submit", signUp);
}

// A signed in person does not need the windows
if (getCurrentUser() == null) {
    setupAuthModals();
}
