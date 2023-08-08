// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // Constants for selectors used throughout the code
    const customizationSection = document.querySelector('.customization-section');
    const itemList = document.querySelector('.item-list');
    const customItemInput = document.querySelector('.custom-item-input');
    const customDropdown = document.querySelector('.custom-dropdown');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const listTitleDisplay = document.querySelector('.list-title-display');
    const listTitleInput = document.querySelector('.list-title-input');
    const stylishListTitle = document.querySelector('.stylish-list-title'); // New constant
    const myLists = document.querySelector('#myLists');
    const logoutButton = document.querySelector('#logout');

    
    // Setup Event Listeners
    setupEventListeners();

    function setupEventListeners() {
        listTitleInput.addEventListener('keypress', handleListTitleKeyPress);
        myLists.addEventListener('click', navigateToListsPage);
        logoutButton.addEventListener('click', logout);
        dropdownBtn.addEventListener('click', toggleDropdown);
        customItemInput.addEventListener('keyup', handleCustomItemInput);
        document.addEventListener('click', handleDocumentClick);
    }

    function handleListTitleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const customTitle = listTitleInput.value.trim();
            listTitleDisplay.textContent = customTitle;
            stylishListTitle.textContent = customTitle; // Using constant
            updateListTitle(customTitle);
            listTitleInput.value = '';
        }
    }

    function handleCustomItemInput(event) {
        if (event.key === 'Enter') {
            addItemToList();
        }
    }

    // Stylish list Div
    function refreshItemListDisplay() {
        itemList.innerHTML = '';

        // Get the title from the 'list-title-display' span
        const titleText = document.querySelector('.list-title-display').textContent;

        // Select the 'stylish-list-title' h2 element
        const stylishListTitle = document.querySelector('.stylish-list-title');

        // Set the text content of the 'stylish-list-title' h2 element to the titleText
        stylishListTitle.textContent = titleText+' List';

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

    function saveCustomizedList() {
        if (currentActivity === 'custom') {
            const customTitle = listTitleInput.value.trim();
            if (!customTitle) {
                alert("Please enter a title for your custom list.");
                return;
            }
            listTitleDisplay.textContent = customTitle;
        }
        console.log('List saved for', currentActivity);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});