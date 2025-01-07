document.addEventListener("DOMContentLoaded", () => {
  // Handle Edit Destination button click
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("edit-destination")) {
      const button = e.target;

      // Extract data attributes from the clicked button
      const destinationId = button.getAttribute("data-id");
      const destinationName = button.getAttribute("data-name");
      const location = button.getAttribute("data-location");
      const description = button.getAttribute("data-description");

      // Populate the modal form fields with the existing data
      document.getElementById("destination_id").value = destinationId;
      document.getElementById("destination-name").value = destinationName;
      document.getElementById("location").value = location;
      document.getElementById("description").value = description;

      // Show the modal
      document.getElementById("edit-modal").style.display = "block";
    }
  });

  // Handle modal close
  document.getElementById("close-modal").addEventListener("click", closeModal);

  function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
  }

  // Handle Edit Destination form submission
  document
    .getElementById("edit-destination-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const destinationId = document.getElementById("destination_id").value;
      const destinationName = document.getElementById("destination-name").value;
      const location = document.getElementById("location").value;
      const description = document.getElementById("description").value;

      // Create the data object to send
      const updatedDestination = {
        destination_id: destinationId,
        name: destinationName,
        location: location,
        description: description,
      };

      // Send the updated data to the server
      fetch("/JetVoyager/src/Admin_pages/editDestination.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDestination),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Destination updated successfully!");
            closeModal();
            loadDestinations(); // Refresh the destinations list
          } else {
            alert("Failed to update destination: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error updating destination:", error);
          alert("An error occurred. Please try again.");
        });
    });
});

function showLocation(location) {
  alert("You clicked on the location: " + location);
  // You can add additional logic here, like opening a map or redirecting to another page.
}
