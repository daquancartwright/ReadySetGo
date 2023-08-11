document.addEventListener('DOMContentLoaded', () => {
    // Select the HTML element where the welcome message will be displayed
    const welcomeMessageElement = document.querySelector("#welcome-message");

    // Select the link to the dashboard
    const dashboardLink = document.querySelector("#dashboard-link");
    const logoutButton = document.querySelector("#logout");

    // If the username exists, display the welcome message. Otherwise, display a default message.
    welcomeMessageElement.textContent = "Welcome to ReadySetGo!";

    // Add a click event listener to the dashboard link
    dashboardLink.addEventListener("click", function() {
        console.log("User clicked on Go to Dashboard");
    });

    // Logout
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    })

    // Logout Function
    function logout() {
        // Clear user session or token (once you've set up authentication)
        localStorage.removeItem('jwtToken')       
        // Then, redirect the user to the login page or main page
        window.location.href = 'index.html'
    }
});