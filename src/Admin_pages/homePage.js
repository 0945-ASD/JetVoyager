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