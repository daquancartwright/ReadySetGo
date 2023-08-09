// index.js

// Wrap the whole script with the 'DOMContentLoaded' event listener
document.addEventListener('DOMContentLoaded', (event) => {
    // Select the elements
    const headerLogo = document.querySelector('#header-logo');
    const loginLink = document.querySelector('#login');
    const registerLink = document.querySelector('#register');

    // Select the page sections
    const homePage = document.querySelector('#home-page');
    const loginPage = document.querySelector('#login-page');
    const registerPage = document.querySelector('#register-page');

    // Select the login forms
    const loginForm = document.querySelector('#login-form');
    const registerForm = document.querySelector('#register-form');

    // When the ReadySetGo is clicked, hide all sections, and show the home page 
    headerLogo.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        homePage.style.display = 'block';
    });

    // When the login link is clicked, hide all sections, and show the login page
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        loginPage.style.display = 'block';
    });

    // When the register link is clicked, hide all sections, and show the register page
    registerLink.addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        registerPage.style.display = 'block';
    });

    // Function to hide all sections so that only the selected section is displayed
    function hideAllSections() {
        homePage.style.display = 'none';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
    }

    // When the register form is submitted, collect the data and attempt to register user
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = event.target.username.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            // Make a Post req to the register route
            const response = await axios.post(`/api/users/register`, { username, email, password });
            if (response.data.message === 'User registered successfully!') {
                // Redirect to welcome page
                window.location.href = `welcome.html?username=${username}`;
            } else {
                // If registration failed, show an error message
                alert("Registration failed. Please try again.");
                console.error(response);
            }
        } catch (error) {
            // If an error occurs while making the request, show error message and clg error.
            alert("Registration failed. Please check your inputs and try again.")
            console.error(error);

        }
    });

    // When the login form is submitted, collect the data and attempt to log in user
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;

        try {
            const response = await axios.post(`/api/users/login`, { username, password });
            if (response.data.message === 'Login successful!') {
                // Store the JWT token in localStorage
                localStorage.setItem('jwtToken', response.data.token)

                // Redirect to the dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert("Login failed. Please check your credentials and try again.")
            }
        } catch (error) {
            alert("Login failed. Please check your credentials and try again.")
            console.error(error);
        }
    });
});
