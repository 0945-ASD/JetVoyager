document.addEventListener("DOMContentLoaded", () => {
    const supportTableBody = document.querySelector("#support-table tbody");
  
    // Fetch messages from the backend
    fetch("http://localhost/JetVoyager/JetVoyager/src/Admin_pages/homePage.php")
      .then((response) => response.json())
      .then((data) => {
        supportTableBody.innerHTML = data
          .map(
            (message) => `
                  <tr>
                      <td>${message.id}</td>
                      <td>${message.name}</td>
                      <td>${message.email}</td>
                      <td>${message.phone || "N/A"}</td>
                      <td>${message.message}</td>
                      <td>${message.created_at}</td>
                      <td>
                          <select class="status-dropdown" data-id="${message.id}">
                              <option value="pending" ${
                                message.status === "pending" ? "selected" : ""
                              }>Pending</option>
                              <option value="reviewed" ${
                                message.status === "reviewed" ? "selected" : ""
                              }>Reviewed</option>
                              <option value="resolved" ${
                                message.status === "resolved" ? "selected" : ""
                              }>Resolved</option>
                          </select>
                      </td>
                  </tr>
              `
          )
          .join("");
      })
      .catch((error) => {
        console.error("Error fetching support messages:", error);
      });
  
    // Update status in the backend
    supportTableBody.addEventListener("change", (e) => {
      if (e.target.classList.contains("status-dropdown")) {
        const status = e.target.value;
        const id = e.target.getAttribute("data-id");
  
        fetch("http://localhost/JetVoyager/JetVoyager/src/Admin_pages/homePage.php", {
          method: "POST",
          supportTableBody: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, status }),
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
          })
          .catch((error) => {
            console.error("Error updating status:", error);
          });
      }
    });
  });