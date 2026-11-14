
const SUPABASE_URL = "https://jleplbdmoqkkisykzmxx.supabase.co";
const SUPABASE_KEY = "sb_publishable_sW0FRbmYZ3rgVy4gXiBGRA_63U8CzVL";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("SSOHorsepedia connected to Supabase!");

// SWITCH TO SIGN UP
function showSignup() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";

    document.getElementById("login-tab").classList.remove("active");
    document.getElementById("signup-tab").classList.add("active");

    showMessage("");
}

// SWITCH TO LOGIN
function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";

    document.getElementById("signup-tab").classList.remove("active");
    document.getElementById("login-tab").classList.add("active");

    showMessage("");
}

// CREATE ACCOUNT
async function signup() {
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!username || !email || !password) {
        return showMessage("Please fill in all fields!");
    }

    if (password.length < 6) {
        return showMessage("Password must be at least 6 characters.");
    }

    showMessage("Creating your account...");

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { username: username }
            }
        });

        if (error) {
            return showMessage(error.message);
        }

        if (data.session) {
            showProfile(username);
            showMessage("Your account has been created!");
        } else {
            showMessage("Account created! Check your email to confirm it.");
        }

    } catch (error) {
        showMessage("Something went wrong: " + error.message);
        console.error(error);
    }
}

// LOG IN
async function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        return showMessage("Please enter your email and password.");
    }

    showMessage("Logging in...");

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            return showMessage(error.message);
        }

        showProfile(data.user.user_metadata.username || email);

    } catch (error) {
        showMessage("Something went wrong: " + error.message);
        console.error(error);
    }
}

// LOG OUT
async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        return showMessage(error.message);
    }

    document.getElementById("profile").style.display = "none";
    document.getElementById("login-form").style.display = "block";

    showMessage("You have logged out.");
}

// SHOW PROFILE
function showProfile(username) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("profile").style.display = "block";

    document.getElementById("profile-username").textContent = username;
}

// DISPLAY MESSAGES
function showMessage(message) {
    document.getElementById("auth-message").textContent = message;
}

// RESTORE LOGIN WHEN WEBSITE OPENS
async function checkLogin() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    if (data.session) {
        const user = data.session.user;

        showProfile(
            user.user_metadata.username || user.email
        );
    }
}

checkLogin();
