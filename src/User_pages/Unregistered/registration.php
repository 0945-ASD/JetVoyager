<?php
// Database connection
// $servername = "localhost";
// $username = "root";
// $password = "";
// $dbname = "jetvoyager";

$conn = new mysqli('localhost', 'root', '', 'jetvoyager_db');

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = mysqli_real_escape_string($conn, $_POST['real-name']);
  $nic = mysqli_real_escape_string($conn, $_POST['nic']);
  $email = mysqli_real_escape_string($conn, $_POST['email']);
  $password = mysqli_real_escape_string($conn, $_POST['password']);
  $confirmPassword = mysqli_real_escape_string($conn, $_POST['confirm-password']);

  // Check if passwords match
  if ($password !== $confirmPassword) {
    echo "<script>alert('Passwords do not match!'); window.history.back();</script>";
    exit;
  }

  // Hash the password
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Insert user into database
  $sql = "INSERT INTO r_user (Name, NIC, EMAIL, Password) VALUES ('$name', '$nic', '$email', '$hashedPassword')";
  if ($conn->query($sql) === TRUE) {
    // Redirect to home page upon success
    header("Location: http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/Login.php");
    exit;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

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
  <title>JetVoyager Registration</title>
  <script>
    function validateForm(event) {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        event.preventDefault();
      }
    }
  </script>
</head>

<body>
  <div class="register-container">
    <div class="register-form-section">
      <h1 class="register-heading">Join JetVoyager</h1>
      <form action="userRegister.php" method="POST" onsubmit="validateForm(event)">
        <div class="input-group">
          <label for="real-name">Full Name</label>
          <input type="text" id="real-name" name="real-name" class="input-field" placeholder="Enter Your Name" required />
        </div>

        <div class="input-group">
          <label for="NIC">NIC</label>
          <input type="text" id="nic" name="nic" class="input-field" placeholder="Enter Your NIC" required />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" class="input-field" placeholder="Enter Your Email" required />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" class="input-field" placeholder="Enter Your Password" required />
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