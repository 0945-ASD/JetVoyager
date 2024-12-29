document.addEventListener("DOMContentLoaded", () => {
  const supportTableBody = document.querySelector("#support-table tbody");

  // Listen for changes in the dropdown
  supportTableBody.addEventListener("change", (e) => {
      if (e.target.classList.contains("status-dropdown")) {
          const status = e.target.value;
          const id = e.target.getAttribute("data-id");

          // Send the new status to the backend
          fetch("http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=jetvoyager_db&table=contact_form", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, status }),
          })
              .then((response) => response.json())
              .then((data) => {
                  if (data.success) {
                      alert("Status updated successfully!");
                  } else {
                      alert("Failed to update status: " + data.message);
                  }
              })
              .catch((error) => {
                  console.error("Error updating status:", error);
                  alert("An error occurred while updating the status.");
              });
      }
  });
});
