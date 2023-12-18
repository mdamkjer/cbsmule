document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const friendsList = document.getElementById('friends-list');

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        // Call a function to fetch and display friends based on the search term
        fetchFriends(searchTerm);
    });

    // Function to fetch and display friends based on the search term
    const fetchFriends = (searchTerm) => {
        // Replace the URL with your actual backend endpoint for fetching friends
        fetch(`/api/friends?search=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                displayFriends(data.friends);
            })
            .catch(error => {
                console.error('Error fetching friends:', error);
            });
    };

    // Function to display friends in the friends list
    const displayFriends = (friends) => {
        // Clear the existing friends list
        friendsList.innerHTML = '';

        // Create and append list items for each friend
        friends.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.textContent = friend.username;
            friendsList.appendChild(listItem);
        });
    };
});
