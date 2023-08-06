// Get the navigation links
const headerLogo = document.querySelector('#header-logo')
const loginLink = document.querySelector('#login');
const registerLink = document.querySelector('#register');

// Get the sections
const homePage = document.querySelector('#home-page');
const loginPage = document.querySelector('#login-page');
const registerPage = document.querySelector('#register-page');

// Get form elements
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');

// Add event listener for the h1 header logo
headerLogo.addEventListener('click', function(event) {
    event.preventDefault();
    hideAllSections();
    homePage.style.display = 'block';
});

// Add event listener for login link
loginLink.addEventListener('click', function(event) {
    event.preventDefault();
    hideAllSections();
    loginPage.style.display = 'block';
});

// Add event listener for register link
registerLink.addEventListener('click', function(event) {
    event.preventDefault();
    hideAllSections();
    registerPage.style.display = 'block';
});

// Helper function to hide all sections
function hideAllSections() {
    homePage.style.display = 'none';
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
}

// Event listener for registration form submission
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        const response = await axios.post('/api/users/register', { username, password });
        console.log(response.data.message);  // Just logging the server's response for now
    } catch (error) {
        console.error("Error registering the user:", error);
    }
});

// Event listener for login form submission
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        const response = await axios.post('/api/users/login', { username, password });
        console.log(response.data.message);  // Just logging the server's response for now
    } catch (error) {
        console.error("Error logging in:", error);
    }
});
