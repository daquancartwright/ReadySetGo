// let userId;

document.addEventListener('DOMContentLoaded', () => {

    
    var addItemBtn = document.querySelector('.add-item-btn');
    var itemInput = document.querySelector('.item-input');
    var updateListBtn = document.querySelector('.update-list-btn');
    var logoutButton = document.querySelector('#logout');
    const headerLogo = document.querySelector('#header-logo');

    // Define currentActivity and currentItems
    var activityStates = {}
    var currentItems = [];
    var currentActivity;
    var currentActivityId;

    // Event Listeners

    // When the ReadySetGo is clicked, hide all sections, and show the home page 
    headerLogo.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'dashboard.html'
    });

    // Logout
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    })

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
        if (!currentActivity) return;

        // alert(currentActivityId)
        const userId = await fetchId();
        const activityId = currentActivityId;

        // Define the URL for the update endpoint
        const url = `http://localhost:5500/api/activity-lists/update/${userId}/${activityId}`;
    
        // Make a PUT request to the update endpoint
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activity: currentActivity,
                    items: currentItems.map(item => item.text),
                }),
            });
    
            // Handle the response
            if (response.ok) {
                const updatedList = await response.json();
                alert(`${currentActivity} List updated successfully:`, updatedList)
                // console.log('List updated successfully:', updatedList);
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
    
            // Check if response is not OK
            if (!response.ok) {
                console.error(`Error fetching lists: ${response.statusText}`);
                return;
            }
    
            const lists = await response.json();
    
            // Check if lists is an array
            if (!Array.isArray(lists)) {
                console.error('Error fetching lists: Response is not an array');
                return;
            }
    
            // Collect the List ID's
            lists.forEach(list => {
                list.id = list.id // Save the ID in the list object
                const activityId = list.id;
            })
            renderLists(lists);
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }
    
    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Logout Function
    function logout() {
        // Clear user session or token (once you've set up authentication)
        localStorage.removeItem('jwtToken')       
        // Then, redirect the user to the login page or main page
        window.location.href = 'index.html'
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
            listDiv.setAttribute('data-activity', list.activity);

            // Create a delete button for each activity card
            const deleteListBtn = document.createElement('span');
            deleteListBtn.className = 'delete-list-button';
            deleteListBtn.textContent = 'X';

            // Add click listener to the delete button
            deleteListBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteList(currentActivityId)
                location.reload();
            })

            // Append the delete button to the activity-card
            listDiv.appendChild(deleteListBtn)


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
                // Assign the activityId here
                currentActivityId = list.id
                // Initialize the state for each activity
                if (!activityStates[list.activity]) {
                    activityStates[list.activity] = list.items.map(item => ({ text: item, completed: false }));
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
        currentActivity = activity;
        // currentActivityId = activity.id;
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

            "Grocery shopping": "https://www.mashed.com/img/gallery/the-best-worst-days-to-grocery-shop/intro-1679673392.jpg",
            
            "Custom": "https://sunshineandravioli.net/cdn/shop/products/il_fullxfull.2304308055_rc63_2048x.jpg?v=1650203315",

            "Wedding": "https://assets.vogue.com/photos/6457fe35c943a2672e3e6c65/4:3/pass/undefined", 

            "Gardening": "https://media.cnn.com/api/v1/images/stellar/prod/230405132308-01-gardening-stock.jpg?c=16x9&q=h_720,w_1280,c_fill", 

            "Movie night": "https://blog.zulily.com/wp-content/uploads/2021/04/AdobeStock_289927915-1280x640.jpeg", 

            "Game night": "https://cms-tc.pbskids.org/parents/expert-tips-and-advice/bringing-back-family-game-night-hero.jpg", 

            "Amusement park": "https://di-uploads-pod16.dealerinspire.com/toyotaofnorthcharlotte/uploads/2019/07/Charlotte-theme-parks.jpg", 

            "Karaoke": "https://d39l2hkdp2esp1.cloudfront.net/img/photo/247928/247928_00_2x.jpg", 

            "Wedding": "https://assets.vogue.com/photos/6457fe35c943a2672e3e6c65/4:3/pass/undefined", 

            "School": "https://www.census.gov/programs-surveys/sis/_jcr_content/root/responsivegrid/responsivegrid_790112278/imagecore.coreimg.80.1280.png/1655294875001/sis-hero-image.png", 
        };

        return images[activity] || ''; // Return empty string if activity not found
    }

    function fetchId() {
        const token = localStorage.getItem('jwtToken')
        
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

    function deleteList(id) {
        return fetch(`/api/activity-lists/delete/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete the list');
            }
            return response.json();
        })
        .catch(error => {
            console.error('An error occurred', error)
        })
        // .then(() => {
        //     document.getElementById(id).remove();
        // });
    }

    // Initialize function
    async function initialize() {
        console.log('Initializing...'); // Debug log
        const userId = await fetchId();
        // console.log('User ID fetched:', userId); // Debug log
        fetchUserLists(userId);
    }

    // Call the initialize function
    initialize();
});
