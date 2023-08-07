document.addEventListener('DOMContentLoaded', () => {
    const customizationSection = document.querySelector('.customization-section');
    const itemList = document.querySelector('.item-list');
    const customItemInput = document.querySelector('.custom-item-input');
    const customDropdown = document.querySelector('.custom-dropdown');
    const listTitleDisplay = document.querySelector('.list-title-display');
    const listTitleInput = document.querySelector('.list-title-input');

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

        if (event.target.classList.contains('save-list-btn')) {
            saveCustomizedList();
        }

        if (event.target.classList.contains('delete-item')) {
            deleteItem(event.target);
        }
    });

    function handleActivityClick(cardElement) {
        currentActivity = cardElement.dataset.activity;

        listTitleInput.toggleAttribute('hidden', currentActivity !== 'custom');
        listTitleDisplay.textContent = currentActivity !== 'custom' ? capitalizeFirstLetter(currentActivity) : '';

        customizationSection.removeAttribute('hidden');
        refreshItemListDisplay();
        displayActivityItems(currentActivity);
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

    function refreshItemListDisplay() {
        itemList.innerHTML = '';
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
