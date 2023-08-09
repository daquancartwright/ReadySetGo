// dashboard.js
// import jwtDecode from '../jwt-decode.min.js';


document.addEventListener('DOMContentLoaded', () => {
    var customizationSection = document.querySelector('.customization-section');
    var itemList = document.querySelector('.item-list');
    var customItemInput = document.querySelector('.custom-item-input');
    var customDropdown = document.querySelector('.custom-dropdown');
    var dropdownBtn = document.querySelector('.dropdown-btn')
    var addSelectedItemsBtn = document.querySelector('.add-selected-items-btn')
    var listTitleDisplay = document.querySelector('.list-title-display');
    var listTitleInput = document.querySelector('.list-title-input');
    var myLists = document.querySelector('#myLists')
    var logoutButton = document.querySelector('#logout')
    var activityCards = document.querySelectorAll('.activity-card')
    var stylishListTitle = document.querySelector('.stylish-list-title');
    var saveListButton = document.querySelector('.save-list-btn')
    var token = localStorage.getItem('jwtToken');
    // var decodedToken = jwtDecode(token);

    // customDropdown.style.display = 'none';

    // URL to the activity list API
    const apiUrl = "http://localhost:5500/api/activityList/";

    const activityItems = {
        camping: ['Tent', 'Stakes', 'Portable Stove', 'Flashlight', 'Bug Repellent', 'First Aid', 'Sleeping bag', 'Firestarter'],
        surfing: ['Surfboard', 'Wetsuit', 'Wax', 'Surf Leash', 'Towel', 'Water', 'Snacks', 'First Aid', 'Umbrella', 'Chair', 'Suncreen'],
        vacation: ['Passport', 'Flight Ticket', 'Camera', 'Chargers', 'Medications', 'Map', 'Sunglasses', 'Wetsuit', 'Wax'],
        hiking: ['Boots', 'Backpack', 'Map', 'Compass', 'Water', 'Snacks', 'First Aid Kit', 'Whistle'],
        painting: ['Canvas', 'Paper', 'Brushes', 'Paints', 'Easel', 'Reference Image'],
        workout: ['Workout Clothes', 'Gym Shoes', 'Water Bottle', 'Headphones', 'Towel'],
        concert: ['Tickets', 'ID', 'Portable Charger'],
        roadtrip: ['Oil Check', 'Tires Check', 'Brakes Check', 'Gas', 'Spare Tire', 'Jack', 'Jumper Cables', 'Map'],
        beach: ['Towel', 'Sunglasses', 'Beach Chair', 'Snacks', 'Boards', 'Portable Speaker', 'Cooler'],
        fishing: ['Fishing Rod', 'Bait', 'Tackle Box', 'Fishing License', 'Cooler', 'Net', 'Guidebook'],
        picnic: ['Picnic Blanket', 'Basket', 'Utensils', 'Trash Bags', 'Bug Spray'],
        custom: []
    };

    let activityLists = {
        camping: [],
        surfing: [],
        vacation: [],
        hiking: [],
        painting: [],
        workout: [],
        concert: [],
        roadtrip: [],
        beach: [],
        fishing: [],
        picnic: [],
        custom: []
    };

    let currentActivity = '';

    // Add event listeners 
    saveListButton.addEventListener('click', function() {
        // Get user input from the form
        // const userId = decodedToken.id // help me here
        const activity = document.querySelector('.list-title-display').textContent;
        const items = activityLists[currentActivity];

        // Validation for custom title

        // Call saveActivityList function with required data
        saveActivityList(userId, activity, items);
    });


    listTitleInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            
            // Preventing default behavior of Enter
            event.preventDefault();           

            // Getting the Custom Title
            const customTitle = listTitleInput.value.trim();

            listTitleDisplay.textContent = customTitle;
            stylishListTitle.textContent = customTitle;
            
            
            // Call function to update the list title display with the customized title
            updateListTitle(customTitle);
            
            
            // Clear the input field
            listTitleInput.value = '';
        }
    })

    myLists.addEventListener('click', function(event) {
        event.preventDefault();
        navigateToListsPage();
    })

    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    })

    document.querySelector('.dropdown-btn').addEventListener('click', function() {
        customDropdown.style.display = customDropdown.style.display === 'none' ? 'block' : 'none';
    });

    customItemInput.addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            addItemToList();
        }
    });

    document.addEventListener('click', (event) => {
        const activityCard = event.target.closest('.activity-card');
        if (activityCard) {
            handleActivityClick(activityCard);
        }

        if (event.target.classList.contains('add-custom-item-btn')) {
            addItemToList();
        }

        if (event.target.classList.contains('add-selected-items-btn')) {
            addSelectedItems();
        }

        // if (event.target.classList.contains('save-list-btn')) {
        //     // saveCustomizedList();
        //     // saveActivityList();
        // }

        if (event.target.classList.contains('delete-item')) {
            deleteItem(event.target);
        }
    });

    //////////////// Functions ////////////////

    function updateListTitle(title) {
        listTitleDisplay.textContent = title
        refreshItemListDisplay();
    }
    
    function navigateToListsPage() {
        // Redirect the user to the My Lists page.
        window.location.href = 'myLists.html';
    }
    
    function logout() {
        // Clear user session or token (once you've set up authentication)
        localStorage.removeItem('jwtToken')       
        // Then, redirect the user to the login page or main page
        window.location.href = 'index.html'
    }
    

    function handleActivityClick(cardElement) {
        currentActivity = cardElement.dataset.activity;

        listTitleInput.toggleAttribute('hidden', currentActivity !== 'custom');
        listTitleDisplay.textContent = currentActivity !== 'custom' ? capitalizeFirstLetter(currentActivity) : '';

        customizationSection.removeAttribute('hidden');
        refreshItemListDisplay();

        // If the activity is custom don't call displayActivityItems
        if (currentActivity !== 'custom') {
            displayActivityItems(currentActivity)
            dropdownBtn.style.display = 'inline'
            addSelectedItemsBtn.style.display = 'inline'
        } else {
            displayActivityItems(currentActivity)
            dropdownBtn.style.display = 'none'
            addSelectedItemsBtn.style.display = 'none'
        }
    }


    function displayActivityItems(activity) {
        customDropdown.innerHTML = '';
        activityItems[activity].forEach(item => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(item));
            customDropdown.appendChild(label);
        });
    }

    // Stylish list Div
    function refreshItemListDisplay() {
        itemList.innerHTML = '';

        // Get the title from the 'list-title-display' span
        const titleText = document.querySelector('.list-title-display').textContent;

        // Set the text content of the 'stylish-list-title' h2 element to the titleText
        stylishListTitle.textContent = titleText + ' List';

        // Iterate through the activity list and create list items for each
        activityLists[currentActivity].forEach(item => {
            const li = document.createElement('li');

            li.appendChild(document.createTextNode(item));

            const deleteButton = document.createElement('span');
            deleteButton.textContent = 'x';
            deleteButton.className = 'delete-item';
            li.appendChild(deleteButton);

            itemList.appendChild(li);
        });
    }

    function addItemToList() {
        const customItemValue = customItemInput.value.trim();
        if (customItemValue && !activityLists[currentActivity].includes(customItemValue)) {
            activityLists[currentActivity].push(customItemValue);
            refreshItemListDisplay();
            customItemInput.value = '';
        }
    }

    function addSelectedItems() {
        customDropdown.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const itemValue = checkbox.value;
            if (!activityLists[currentActivity].includes(itemValue)) {
                activityLists[currentActivity].push(itemValue);
            }
        });
        refreshItemListDisplay();
    }

    function deleteItem(element) {
        const itemValue = element.previousSibling.nodeValue;
        const index = activityLists[currentActivity].indexOf(itemValue);
        if (index !== -1) {
            activityLists[currentActivity].splice(index, 1);
            refreshItemListDisplay();
        }
    }

    // function saveCustomizedList() {
    //     if (currentActivity === 'custom') {
    //         const customTitle = listTitleInput.value.trim();
    //         if (!customTitle) {
    //             alert("Please enter a title for your custom list.");
    //             return;
    //         }
    //         listTitleDisplay.textContent = customTitle;
    //     }
    //     console.log('List saved for', currentActivity);
    // }

    function saveActivityList(userId, activity, items) {
        // Retrieve the token
        const token = localStorage.getItem('jwtToken')
        console.log(`JWT Token: ` + token)

        // Prepare the data
        const data = {
            userId: userId,
            activity: activity,
            items: items
        };
        
        // Check that data is logged correctly
        console.log('Activity List: ' + data)
        console.log('User id: ' + userId)
        console.log('Activity: ' + activity)
        console.log('Items: ' + items)

        // Send a POST request to the server
        fetch('/api/activity-lists/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('List Created:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
