<?php
// Start the session at the beginning of the file
session_start();

// Database connection
$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $name = $_POST['real-name'];
  $nic = $_POST['nic'];
  $email = $_POST['email'];
  $password = $_POST['password'];
  $confirmPassword = $_POST['confirm-password'];

  // Check if passwords match
  if ($password !== $confirmPassword) {
    echo "<script>alert('Passwords do not match!'); window.history.back();</script>";
    exit;
  }

  // Hash the password
  // $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Prepare SQL statement
  $stmt = $conn->prepare("INSERT INTO r_user (Name, NIC, EMAIL, Password) VALUES (?, ?, ?, ?)");
  if ($stmt === false) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
  }

  // Bind parameters
  $stmt->bind_param("ssss", $name, $nic, $email, $password);

  // Execute statement
  if ($stmt->execute()) {
    // Redirect to login page
    header("Location: http://localhost/JetVoyager/JetVoyager/src/User_pages/Unregistered/Login.php");
    exit();
  } else {
    echo "<script>alert('Error: " . htmlspecialchars($stmt->error) . "'); window.history.back();</script>";
  }

  // Close statement
  $stmt->close();
}

// Close connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/Unregistered/registration.css" />
  <script src="http://localhost/JetVoyager/JetVoyager/src/User_pages/Unregistered/AccessPage.js"></script>
  <title>JetVoyager Registration</title>
</head>

<body>
  <div class="register-container">
    <div class="register-form-section">
      <h1 class="register-heading">Join JetVoyager</h1>
      <form action="registration.php" method="POST" onsubmit="validateForm(event)">
        <div class="input-group">
          <label for="real-name">Full Name</label>
          <input type="text" id="real-name" name="real-name" class="input-field" placeholder="Enter Your Name" required />
        </div>

        <div class="input-group">
          <label for="NIC">NIC</label>
          <input type="text" id="nic" name="nic" class="input-field" placeholder="Enter Your NIC" onchange="validateNICOnChange()" required />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" class="input-field" placeholder="Enter Your Email" required />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" class="input-field" placeholder="Enter Your Password" onchange="validatePasswordSize()" required />
        </div>

        <div class="input-group">
          <label for="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" name="confirm-password" class="input-field" placeholder="Confirm Your Password" required />
        </div>

        <button type="submit" class="submit-btn">Sign Up</button>
      </form>
      <p class="terms">By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
      <p class="login-redirect">Already have an account? <a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/Unregistered/Login.php">Log In</a></p>
    </div>

    <div class="register-image-section">
      <img src="http://localhost/JetVoyager/JetVoyager/images/3.png" alt="Travel">
      <p>Embark on a seamless journey <br> with JetVoyager!</p>
    </div>
  </div>
  <footer>
    <p>&copy; 2024 JetVoyager. All rights reserved.</p>
  </footer>
</body>
</html>