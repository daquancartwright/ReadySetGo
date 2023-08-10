document.addEventListener('DOMContentLoaded', () => {

    var addItemBtn = document.querySelector('.add-item-btn');
    var itemInput = document.querySelector('.item-input');
    var updateListBtn = document.querySelector('.update-list-btn')

    // Define currentActivity and currentItems
    var activityStates = {}
    var currentActivity;
    var currentItems = [];

    // Event Listeners
    // New Event Listener: Detecting the Enter key
    itemInput.addEventListener('keyup', (event) => {
        // Check if the key pressed was 'Enter'
        if (event.key === 'Enter') {
            // Trigger the click event on the 'Add Item' button
            addItemBtn.click();
        }
    });

    addItemBtn.addEventListener('click', () => {
        // Get the value from the item input
        const newItemText = itemInput.value;

        // Validate if the input is not empty
        if (newItemText.trim() === '') return;

        // Create an object with text and completed properties
        const newItem = {
        text: newItemText,
        completed: false
    };

        // Add the new item to the stylish list
        addItemToStylishList(newItem);

        // Add the new item to the currentItems array
        currentItems.push(newItem);

        // Clear the input field
        itemInput.value = ''

        // Update the Global state
        activityStates[currentActivity] = currentItems;
    });

    updateListBtn.addEventListener('click', async () => {
        // Make sure the current activity and items are defined
        // if (!currentActivity || currentItems.length === 0) return;
        if (currentActivity) return;
        // Define the URL for the update endpoint
        const url = `http://localhost:5500/api/activity-lists/update/${userId}/${id}`;

    
        // Make a PUT request to the update endpoint
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activity: currentActivity,
                    items: currentItems,
                }),
            });
    
            // Handle the response
            if (response.ok) {
                const updatedList = await response.json();
                console.log('List updated successfully:', updatedList);
            } else {
                const error = await response.json();
                console.error('Error updating list:', error);
            }
        } catch (err) {
            console.error('Error updating list:', err);
        }
    });

    async function fetchUserLists(userId) {
        try {
            const url = `http://localhost:5500/api/activity-lists/${userId}`;
            const response = await fetch(url);

            if (response.status === 404) {
                alert('User not found');
                return;
            }

            const lists = await response.json();
            renderLists(lists);
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }


    // Function to render the lists on the page
    function renderLists(lists) {
        // Find the container where the lists will be displayed
        const container = document.querySelector('.activity-grid');

        // Clear existing activity cards if any
        container.innerHTML = '';

        // Iterate through the lists and create HTML elements to display them
        lists.forEach(list => {
            // Create a div for each list (activity card)
            const listDiv = document.createElement('div');
            listDiv.className = 'activity-card';
            listDiv.setAttribute('data-activity', list.activity.toLowerCase());

            // Add the image for the activity
            const img = document.createElement('img');
            // Here you can map the activity to the correct image URL
            img.src = getImageUrl(list.activity);
            img.alt = list.activity;
            listDiv.appendChild(img);

            // Add the activity label
            const activityLabel = document.createElement('div');
            activityLabel.className = 'activity-label';
            const h3 = document.createElement('h3');
            h3.textContent = list.activity;
            activityLabel.appendChild(h3);
            listDiv.appendChild(activityLabel);

            // Add click listener event to the activity card
            listDiv.addEventListener('click', () => {
                // Initialize the state for each activity
                if (!activityStates[list.activity.toLowerCase()]) {
                    activityStates[list.activity.toLowerCase()] = list.items.map(item => ({ text: item, completed: false }));
                }

                // Get the customization section and make it visible
                const customizationSection = document.querySelector('.customization-section');
                customizationSection.removeAttribute('hidden');

                renderActivityList(list.activity, list.items);
            
    });

            // Add the list div to the container
            container.appendChild(listDiv);
        });
    }

    // Updated renderActivityList function
    function renderActivityList(activity, items) {
        currentActivity = activity.toLowerCase();
        // currentItems = items;

        // Check if the activity state already exists, otherwise initialize
        if (!activityStates[currentActivity]) {
            activityStates[currentActivity] = items.map(item => ({ text: item, completed: false }));
        }

        // Map items to objects with text and completed properties
        // currentItems = items.map(item => ({ text: item, completed: false }));

        // Assign the currentItems from the global state
        currentItems = activityStates[currentActivity] || [];

        // Find the container for the stylish list
        const container = document.querySelector('.item-list');

        // Clear existing items if any
        container.innerHTML = '';

        // Update the title for the stylish list
        const titleElement = document.querySelector('.stylish-list-title');
        titleElement.textContent = activity;

        // Create a list element to hold the items
        const ul = document.createElement('ul');
        container.appendChild(ul); // Add the 'ul' element to the container

        // Iterate through the items and call the new function
        currentItems.forEach(item => addItemToStylishList(item));
    }


    function addItemToStylishList(item) {
        const ul = document.querySelector('.item-list ul'); // Get the UL element
        const li = document.createElement('li');

        // Add click event listener to the list item to cross it out
        li.addEventListener('click', () => {
            li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        });

        if (item.completed) {
            li.style.textDecoration = 'line-through';
        }
    
        // Toggle completed status on click
        li.addEventListener('click', () => {
            item.completed = !item.completed;
            li.style.textDecoration = item.completed ? 'line-through' : 'none';
        });

        // Add the item text
        li.textContent = item.text;

        // Create and add the delete button
        const deleteButton = document.createElement('span');
        deleteButton.textContent = 'X';
        deleteButton.className = 'delete-button';

        // Add event listener to delete button
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            ul.removeChild(li);

            const itemIndex = activityStates[currentActivity].indexOf(item);

            if (itemIndex > -1) {
                activityStates[currentActivity].splice(itemIndex, 1); // Remove the item from the global state
            }

        });
        li.appendChild(deleteButton);

        // Add the list item to the list element
        ul.appendChild(li);
    }

    // Function to map the activity to the corresponding image URL
    function getImageUrl(activity) {
        // Mapping of activities to image URLs
        const images = {
            "Roadtrip": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9hZCUyMHRyaXB8ZW58MHx8MHx8fDA%3D&w=1000&q=80",

            "Beach": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/34/dd/60/caption.jpg?w=1200&h=-1&s=1&cx=1920&cy=1080&chk=v1_7d12105273199cc06428",

            "Hiking": "https://www.nps.gov/grte/planyourvisit/images/Hiking-NPS-Photo-J-Tobiason_3.jpg?maxwidth=1300&maxheight=1300&autorotate=false",
            
            "Fishing": "https://www.nps.gov/subjects/fishing/images/Mississippi-recreational-area-fishing-canoe-NPS.jpg?maxwidth=650&autorotate=false",
            
            "Camping": "https://epiclaketahoe.com/wp-content/uploads/2019/09/scott-goodwill-y8Ngwq34_Ak-unsplash-696x464.jpg",

            "Surfing": "https://www.daysoftheyear.com/cdn-cgi/image/dpr=1%2Cf=auto%2Cfit=cover%2Cheight=650%2Cq=40%2Csharpen=1%2Cwidth=956/wp-content/uploads/surf-day.jpg",

            "Vacation": "https://ciaobambino.com/wp-content/uploads/2015/02/caribbean-vacation-budget-tips.jpg",

            "Painting": "https://soworkshop.com/wp-content/uploads/2021/09/paint-and-sip-tips.jpg",

            "Workout": "https://www.si.com/.image/t_share/MTk0NDYwOTQ0Nzc0OTk3NTA5/workout-apps-for-men_hero.png",

            "Concert": "https://media.timeout.com/images/106016024/750/422/image.jpg",

            "Roadtrip": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9hZCUyMHRyaXB8ZW58MHx8MHx8fDA%3D&w=1000&q=80",

            "Beach": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/34/dd/60/caption.jpg?w=1200&h=-1&s=1&cx=1920&cy=1080&chk=v1_7d12105273199cc06428",

            "Fishing": "https://www.nps.gov/subjects/fishing/images/Mississippi-recreational-area-fishing-canoe-NPS.jpg?maxwidth=650&autorotate=false",

            "Picnic": "https://consettmagazine.com/wp-content/uploads/2014/04/picnic1.jpg",
            
            "Custom": "https://sunshineandravioli.net/cdn/shop/products/il_fullxfull.2304308055_rc63_2048x.jpg?v=1650203315",
        };

        return images[activity] || ''; // Return empty string if activity not found
    }

    function fetchId() {
        const token = localStorage.getItem('jwtToken')
        console.log(`JWT Token: ${token}`)
        
        return fetch('/api/users/getUserId', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            return data.userId;
        })
        .catch(error => console.error('An error occurred:', error))
    }

    // Initialize function
    async function initialize() {
        console.log('Initializing...'); // Debug log
        const userId = await fetchId();
        console.log('User ID fetched:', userId); // Debug log
        fetchUserLists(userId);
    }

    // Call the initialize function
    initialize();
});