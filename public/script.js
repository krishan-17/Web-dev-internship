

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
    initPasswordToggles();
    initLiveValidation();
    initFormSubmit();
});

 // HASH-BASED CLIENT-SIDE ROUTING

function initRouter() {
    const sections = Array.from(document.querySelectorAll("[data-section]"));
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const validRoutes = sections.map((s) => s.id);

    function showRoute(route) {
        const target = validRoutes.includes(route) ? route : "about";

           sections.forEach((section) => {
            section.classList.toggle("hidden", section.id !== target);
            });

                   navLinks.forEach((link) => {
                      link.classList.toggle("active-link", link.dataset.route === target);
              });

        // Whenever the user lands on the Users route, refresh the list
        if (target === "users") {
            loadUsers();
        }
    }

    function routeFromHash() {
        const route = window.location.hash.replace("#", "") || "about";
        showRoute(route);
    }

    window.addEventListener("hashchange", routeFromHash);
    routeFromHash(); // run once on initial load
}


   //     SHOW / HIDE PASSWORD FIELDS



function initPasswordToggles() {
    document.querySelectorAll(".toggle-password").forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = document.getElementById(btn.dataset.toggle);
              if (!input) return;
            const isHidden = input.type === "password";
                input.type = isHidden ? "text" : "password";
                        btn.textContent = isHidden ? "🙈" : "👁";
            btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
        });
    });
}


   // LIVE VALIDATION + PASSWORD STRENGTH 

const validators = {
    username(value) {
        if (!value.trim()) return "Username is required";
        if (value.trim().length < 3) return "Username must be at least 3 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) return "Only letters, numbers and underscores are allowed";
        return "";
    },
    email(value) {
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address";
        return "";
    },
    age(value) {
        if (!value.toString().trim()) return "Age is required";
        const age = Number(value);
        if (!Number.isInteger(age) || age < 13 || age > 100) return "Age must be between 13 and 100";
        return "";
    },
    password(value) {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
            return "Use upper & lower case letters and at least one number";
        }
        return "";
    },
    confirmPassword(value, form) {
        const password = form.password.value;
        if (!value) return "Please confirm your password";
        if (value !== password) return "Passwords do not match";
        return "";
    },
};

function passwordStrength(value) {
    let score = 0;
    if (value.length >= 6) score++;
    if (value.length >= 10) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

      if (!value) return { label: "", textColor: "text-gray-400" };
    if (score <= 1) return { label: "Weak", textColor: "text-red-500" };
    if (score === 2) return { label: "Fair", textColor: "text-orange-500" };
          if (score === 3) return { label: "Medium", textColor: "text-yellow-600" };
    if (score === 4) return { label: "Strong", textColor: "text-green-600" };
             return { label: "Very strong", textColor: "text-emerald-600" };
}

function initLiveValidation() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const fields = ["username", "email", "age", "password", "confirmPassword"];

    fields.forEach((name) => {
        const input = form[name];
        if (!input) return;
        input.addEventListener("input", () => {
            validateField(form, name);
            if (name === "password") {
                updatePasswordStrength(input.value);
                // Re-check confirm password whenever the password itself changes
                if (form.confirmPassword.value) validateField(form, "confirmPassword");
            }
        });
        input.addEventListener("blur", () => validateField(form, name));
    });
}

function validateField(form, name) {
    const input = form[name];
    const errorEl = document.getElementById(`${name}-error`);
    const message = validators[name](input.value, form);

    if (message) {
        input.classList.add("field-invalid");
        input.classList.remove("field-valid");
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove("hidden");
        }
    } else {
        input.classList.remove("field-invalid");
        input.classList.add("field-valid");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.add("hidden");
        }
    }
    return !message;
}

function updatePasswordStrength(value) {
    const text = document.getElementById("passwordStrengthText");
    if (!text) return;

    const { label, textColor } = passwordStrength(value);
    text.textContent = label ? `Password strength: ${label}` : "\u00A0";
    text.className = `text-xs mt-1.5 font-medium ${textColor || "text-gray-400"}`;
}


   // FORM SUBMISSION (no page reload)

function initFormSubmit() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const fields = ["username", "email", "age", "password", "confirmPassword"];
    const banner = document.getElementById("formBanner");
    const submitBtn = document.getElementById("submitBtn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Run full client-side validation before hitting the server
        const results = fields.map((name) => validateField(form, name));

        if (results.includes(false)) {
            showBanner(banner, "Please fix the highlighted fields before submitting.", false);
            const firstInvalid = fields.find((name) => !!document.getElementById(`${name}-error`)?.textContent);
            if (firstInvalid) form[firstInvalid].focus();
            return;
        }

        const payload = {
            username: form.username.value.trim(),
            email: form.email.value.trim(),
            age: form.age.value,
            password: form.password.value,
            confirmPassword: form.confirmPassword.value,
        };

        submitBtn.disabled = true;
        submitBtn.textContent = "Registering…";

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                // Show server-side errors too (defense in depth)
                Object.entries(data.errors || {}).forEach(([name, message]) => {
                    const errorEl = document.getElementById(`${name}-error`);
                    if (errorEl) {
                        errorEl.textContent = message;
                        errorEl.classList.remove("hidden");
                    }
                });
                showBanner(banner, "Registration failed. Please check the form.", false);
            } else {
                showBanner(banner, `✅ ${data.user.username} registered successfully!`, true);
                form.reset();
                fields.forEach((name) => {
                    form[name].classList.remove("field-valid", "field-invalid");
                    const errorEl = document.getElementById(`${name}-error`);
                    if (errorEl) errorEl.classList.add("hidden");
                });
                updatePasswordStrength("");
                loadUsers(); // refresh cached users list in the background
            }
        } catch (err) {
            showBanner(banner, "Network error — please try again.", false);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Register";
        }
    });
}

function showBanner(banner, message, success) {
    if (!banner) return;
    banner.textContent = message;
    banner.classList.remove("hidden", "bg-green-50", "border-green-200", "text-green-700", "bg-red-50", "border-red-200", "text-red-700");
    banner.classList.add("border", success ? "bg-green-50" : "bg-red-50", success ? "border-green-200" : "border-red-200", success ? "text-green-700" : "text-red-700");
}

   //   DYNAMIC USERS LIST (fetched via API, rendered without reload)

async function loadUsers() {
    const content = document.getElementById("usersContent");
    const countEl = document.getElementById("usersCount");
    if (!content) return;

    try {
        const res = await fetch("/api/users");
        const data = await res.json();
        const users = data.users || [];

        countEl.textContent = `${users.length} user${users.length !== 1 ? "s" : ""}`;

        if (users.length === 0) {
            content.innerHTML = `
                <div class="text-center py-10">
                    <p class="text-gray-400 text-sm mb-4">No users registered yet.</p>
                    <a href="#register" data-route="register" class="nav-link bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm btn">Register Now</a>
                </div>`;
            return;
        }

        const rows = users
            .map(
                (user, i) => `
                <tr class="border-t ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50">
                    <td class="px-4 py-3 text-gray-400">#${user.id}</td>
                    <td class="px-4 py-3 font-medium text-gray-800">${escapeHtml(user.username)}</td>
                    <td class="px-4 py-3 text-gray-500">${escapeHtml(user.email)}</td>
                    <td class="px-4 py-3 text-gray-600">${escapeHtml(String(user.age))}</td>
                </tr>`
            )
            .join("");

        content.innerHTML = `
            <div class="overflow-x-auto rounded-lg border">
                <table class="w-full text-sm">
                    <thead class="bg-indigo-600 text-white text-left">
                        <tr>
                            <th class="px-4 py-3 font-medium">ID</th>
                            <th class="px-4 py-3 font-medium">Username</th>
                            <th class="px-4 py-3 font-medium">Email</th>
                            <th class="px-4 py-3 font-medium">Age</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
    } catch (err) {
        content.innerHTML = `<p class="text-red-500 text-sm text-center py-10">Could not load users. Please try again.</p>`;
    }
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
