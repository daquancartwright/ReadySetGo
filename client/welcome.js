// Select the HTML element where the welcome message will be displayed
const welcomeMessageElement = document.querySelector("#welcome-message");

// Select the link to the dashboard
const dashboardLink = document.querySelector("#dashboard-link");

// Function to get URL parameters
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
}

// Get the username from URL parameters
const username = getURLParameter('username');

// If the username exists, display the welcome message. Otherwise, display a default message.
if (username) {
    welcomeMessageElement.textContent = `Welcome to ReadySetGo, ${username}!`;
} else {
    welcomeMessageElement.textContent = "Welcome to ReadySetGo!";
}

// Add a click event listener to the dashboard link
dashboardLink.addEventListener("click", function() {
    console.log("User clicked on Go to Dashboard");
});
