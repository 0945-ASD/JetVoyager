<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve form data
  $email = isset($_POST['email']) ? $_POST['email'] : '';
  $name = isset($_POST['name']) ? $_POST['name'] : '';
  $phone = isset($_POST['phone']) ? $_POST['phone'] : '';
  $message = isset($_POST['message']) ? $_POST['message'] : '';

  // Check if all fields are filled
  if (empty($email) || empty($name) || empty($phone) || empty($message)) {
    die("All fields are required.");
  }

  // Prepare and bind the SQL statement
  $stmt = $conn->prepare("INSERT INTO contact_form (email, name, phone, message, status) VALUES (?, ?, ?, ?, ?)");
  if ($stmt === false) {
    die("Error preparing statement: " . $conn->error);
  }

  $status = 'pending'; // Default status for new messages
  $stmt->bind_param("sssss", $email, $name, $phone, $message, $status);

  // Execute the query and handle the result
  if ($stmt->execute()) {
    // echo "Message submitted successfully!";
  } else {
    echo "Error: " . $stmt->error;
  }

  // Close the connection
  $stmt->close();
  $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <title>Contact Us</title>
  <link rel="stylesheet" href="http://localhost/JetVoyager/src/User_pages/Unregistered/HomePage.css">
  <link rel="stylesheet" href="http://localhost/JetVoyager/src/User_pages/Unregistered/ContactUs.css">
</head>

<body>

  <!-- Navigation Bar -->
  <header>
    <nav>
      <div class="logo">JetVoyager</div>
      <ul class="nav-links">
        <li><a href="http://localhost/JetVoyager/src/User_pages/Unregistered/HomePage.html">Home</a></li>
        <li><a href="http://localhost/JetVoyager/src/User_pages/Unregistered/Destination.html">Destinations</a></li>
        <li><a href="http://localhost/JetVoyager/src/User_pages/Unregistered/aboutUs.html">About Us</a></li>
        <li><a href="http://localhost/JetVoyager/src/User_pages/Unregistered/ContactUs.php">Contact</a></li>
      </ul>
      <div class="button-container">
        <button class="cta-button"><a href="http://localhost/JetVoyager/src/User_pages/Unregistered/Login.php">Login</a></button>
        <button class="cta-button"><a href="http://localhost/JetVoyager/src/User_pages/Unregistered/registration.php">Register</a></button>
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
          <img src="http://localhost/JetVoyager/images/1.png" alt="Contact Us" width="300px" height="300px" />
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

          <form id="contact-form" action="" method="POST">
            <label for="name">Name:</label>
            <input type="text" name="name" placeholder="Your Full Name" required>
            <br>
            <label for="email">Email:</label>
            <input type="email" name="email" placeholder="yourname@example.com" required>
            <br>
            <label for="phone">Phone Number:</label>
            <input type="tel" name="phone" placeholder="xxxxxxxxxx" required>
            <br>
            <label for="message">Your Message:</label>
            <textarea name="message" rows="5" required placeholder="Type your message here"></textarea>
            <button class="cta-button" type="submit">Submit</button>
          </form>

        </div>
      </div>
    </section>
  </main>

  <script>
    // Contact Form Validation
    function validateContactForm() {
      var email = document.querySelector('input[name="email"]').value;
      var name = document.querySelector('input[name="name"]').value;
      var phone = document.querySelector('input[name="phone"]').value;

      var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      var nameRegex = /^[a-zA-Z\s]+$/;
      

      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
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
