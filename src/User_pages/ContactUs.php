<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
    rel="stylesheet">
  <title>Contact Us</title>
  <!-- Import the common HomePage CSS -->
  <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/HomePage.css">
  <!-- Contact Us specific CSS -->
  <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/ContactUs.css">
</head>

<body>

  <!-- Navigation Bar -->
  <header>
        <nav>
            <div class="logo">JetVoyager</div>
            <ul class="nav-links">
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/HomePage.html">Home</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/aboutUs.html">About Us</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/Destination.html">Destinations</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/ContactUs.php">Contact</a></li>
            </ul>
            <div class="button-container">
                <button class="cta-button" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/Login.php">Login</button>
                <button class="cta-button" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registration.php">Register</button>
                <button class="cta-button">Book Now</button>
            </div>

        </nav>
    </header>

  <!-- Contact Us Section -->
  <main>
    <section class="contact-us">
    <h1>Contact Us</h1>

      <div class="container">
        <!-- Left Section: Contact Details -->
        <div class="contact-details">
          <img src="http://localhost/JetVoyager/JetVoyager/images/1.png" alt="Contact Us" width="300px" height="300px" />
          <div class="contactUs_page_description">
            <i>We are here to assist you with your travel needs. Whether you have questions, require support, or want to share your feedback, our team at JetVoyager is eager to help. Feel free to contact us through the form below, or reach out via email or phone. We aim to respond promptly and ensure your travel experience is exceptional.</i>
          </div>
          <p><strong>Email:</strong> <i>support@jetvoyager.com</i></p>
          <p><strong>Phone:</strong> +94 77 1234 567 / +94 77 9876 543</p>
          <p><strong>Address:</strong> 789 Voyager Avenue, Colombo, Sri Lanka</p>
        </div>

        <!-- Right Section: Contact Form -->
        <div class="contact-form">
          <h2>Send Us a Message</h2>

          <form id="contact-form" action="contactUs_insert.php" method="POST">
            <label for="ID">Contacting ID:</label>
            <input type="text" name="ID" placeholder="Enter any number you prefer" required>
            <br>
            <label for="name">Name:</label>
            <input type="text" name="name" placeholder="Your Full Name" required>
            <br>
            <label for="phone">Phone Number:</label>
            <input type="tel" name="phone" placeholder="+xx xxxxxxxxx" required>
            <br>
            <label for="message">Your Message:</label>
            <textarea name="message" rows="5" required placeholder="Type your message here"></textarea>
            <button class="cta-button" type="submit">Submit</button>
          </form>

          <!-- Delete Form -->
          <h2>Delete a Message</h2>
          <form id="delete-form" action="message_delete.php" method="POST">
            <label for="deleteID">Enter ID to Delete:</label>
            <input type="text" name="ID" placeholder="Enter the message ID">
            <button class="cta-button" type="submit">Delete</button>
          </form>

          <!-- Edit Form -->
          <h2>Edit a Message</h2>
          <form id="edit-form" action="message_edit.php" method="POST">
            <label for="editID">Enter ID to Edit:</label>
            <input type="text" name="ID" placeholder="Enter the message ID" required>
            <br>
            <label for="name">Enter New Name:</label>
            <input type="text" name="name" placeholder="Enter the new name" required>
            <br>
            <label for="phone">Enter New Phone Number:</label>
            <input type="tel" name="phone" placeholder="Enter the new phone number" required>
            <br>
            <label for="message">Enter New Message:</label>
            <textarea name="message" rows="5" required placeholder="Enter the new message"></textarea>
            <button class="cta-button" type="submit">Edit</button>
          </form>

        </div>
      </div>
    </section>
  </main>

  <!-- Display Messages
  <section class="message-display">
    <h2>Messages Received</h2> -->
<!-- 
    <?php
    // Database connection
    $conn = new mysqli('localhost', 'root', '', 'jet_voyager');

    // Check connection
    if ($conn->connect_error) {
      die('Connection Error: ' . $conn->connect_error);
    }

    // SQL query to select messages
    $sql = "SELECT m_ID, m_name, m_con_num, m_message FROM message";
    $result = $conn->query($sql);

    if ($result === false) {
      echo "Error: " . $conn->error;
    } else {
      if ($result->num_rows > 0) {
        echo "<table border='1'>";
        echo "<tr><th>ID</th><th>Name</th><th>Contact Number</th><th>Message</th></tr>";

        while ($row = $result->fetch_assoc()) {
          echo "<tr>";
          echo "<td>" . $row["m_ID"] . "</td>";
          echo "<td>" . $row["m_name"] . "</td>";
          echo "<td>" . $row["m_con_num"] . "</td>";
          echo "<td>" . $row["m_message"] . "</td>";
          echo "</tr>";
        }

        echo "</table>";
      } else {
        echo "No messages found.";
      }
    }
    $conn->close();
    ?>
  </section> -->

  <script>
    // Contact Form Validation
    function validateContactForm() {
      var id = document.querySelector('input[name="ID"]').value;
      var name = document.querySelector('input[name="name"]').value;
      var phone = document.querySelector('input[name="phone"]').value;

      var idRegex = /^[0-9]+$/;
      var nameRegex = /^[a-zA-Z\s]+$/;
      var phoneRegex = /^\+\d{2} \d{9}$/;

      if (!idRegex.test(id)) {
        alert("ID can only contain numbers.");
        return false;
      }
      if (!nameRegex.test(name)) {
        alert("Name can only contain letters and spaces.");
        return false;
      }
      if (!phoneRegex.test(phone)) {
        alert("Phone Number must be in the format '+xx xxxxxxxxx'.");
        return false;
      }

      return true;
    }

    document.getElementById('contact-form').addEventListener('submit', function (event) {
      if (!validateContactForm()) {
        event.preventDefault();
      } else {
        alert('You have submitted your message successfully!');
      }
    });
  </script>

</body>

</html>
