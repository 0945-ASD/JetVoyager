document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.status-dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function () {
            const id = this.getAttribute('data-id');
            const status = this.value;

            console.log(`Dropdown changed for ID: ${id}, new status: ${status}`);

            // Send AJAX request to update status
            fetch('update_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, status: status }),
            })
                .then(response => {
                    console.log(`Response status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    console.log('Response data:', data);
                    if (data.success) {
                        alert('Status updated successfully');
                    } else {
                        alert('Failed to update status: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while updating the status');
                });
        });
    });
});

// Fetch and display existing destinations
function loadDestinations() {
    fetch('/JetVoyager/src/Admin_pages/getDestinations.php')  // Fetch from the PHP file
        .then(response => response.json())  // Parse the JSON response
        .then(destinations => {
            const destinationsList = document.getElementById('destinations-list');
            destinationsList.innerHTML = '';  // Clear the current list

            // Loop through the destinations and create list items
            destinations.forEach(destination => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${destination.Destination_name} 
                    - Location: ${destination.Location} 
                    - ${destination.Destination_description} 
                    <button class="edit-destination" data-id="${destination.Destination_ID}">Edit</button>
                    <button class="delete-destination" data-id="${destination.Destination_ID}">Delete</button>
                `;
                destinationsList.appendChild(listItem);  // Append the item to the list
            });
        })
        .catch(error => console.error('Error fetching destinations:', error));  // Handle any errors
}

// Call loadDestinations when the page loads
window.addEventListener('load', loadDestinations);

// Handle Delete Destination
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('delete-destination')) {
        const id = e.target.getAttribute('data-id');  // Get the destination ID

        // Send a request to delete the destination
        fetch('/JetVoyager/src/Admin_pages/deleteDestination.php', {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())  // Parse the response
        .then(data => {
            if (data.success) {
                alert('Destination deleted successfully!');
                loadDestinations();  // Refresh the list of destinations
            } else {
                alert('Failed to delete destination.');
            }
        });
    }
});


// Handle the Add Destination form submission
document.getElementById('add-destination-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const destination = document.getElementById('destination').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('destination-description').value;

    const newDestination = { destination, location, description };

    // Send the data to the backend to be added
    fetch('/JetVoyager/src/Admin_pages/addDestination.php', {
        method: 'POST',
        body: JSON.stringify(newDestination),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Destination added successfully!');
            loadDestinations();  // Refresh the list of destinations
        } else {
            alert('Failed to add destination.');
        }
    })
    .catch(error => console.error('Error adding destination:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-destination');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const destinationId = button.getAttribute('data-id');

            if (confirm('Are you sure you want to delete this destination?')) {
                fetch('deleteDestination.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destination_id: destinationId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Destination deleted successfully');
                        location.reload();
                    } else {
                        alert('Failed to delete destination: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error deleting destination:', error);
                    alert('An error occurred. Please try again.');
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-destination');

    // Open modal when Edit button is clicked
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const destinationId = button.getAttribute('data-id');
            const destinationName = button.getAttribute('data-name');
            const location = button.getAttribute('data-location');
            const description = button.getAttribute('data-description');

            // Populate modal with existing data
            document.getElementById('destination_id').value = destinationId;
            document.getElementById('destination-name').value = destinationName;
            document.getElementById('location').value = location;
            document.getElementById('description').value = description;

            // Show modal
            document.getElementById('edit-modal').style.display = 'block';
        });
    });
});

// Close modal
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}
