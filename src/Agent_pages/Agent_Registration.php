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
  $location = $_POST['location'];
  $phone = $_POST['phone'];
  $email = $_POST['email'];
  $NoOfRooms = $_POST['NoOfRooms'];
  $password = $_POST['password'];
  $confirmPassword = $_POST['confirm-password'];

  // Check if passwords match
  if ($password !== $confirmPassword) {
    echo "<script>alert('Passwords do not match!'); window.history.back();</script>";
    exit;
  }

  // Hash the password
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Prepare SQL statement
  $stmt = $conn->prepare("INSERT INTO hotel_agent (Hotel_name, Location, Hotel_phone, Hotel_email,No_of_rooms, password) VALUES (?, ?, ?, ?, ?, ?)");
  if ($stmt === false) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
  }

  // Bind parameters
  $stmt->bind_param("ssssss", $name, $location, $phone, $email, $NoOfRooms, $password);

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
  <script src="http://localhost/JetVoyager/JetVoyager/src/Agent_pages/Agent_Access.js"></script>
  <title>JetVoyager Hotel Registration</title>
</head>

<body>
  <div class="register-container">
    <div class="register-form-section">
      <h1 class="register-heading">Join JetVoyager Hotel Portal</h1>
      <form action="Agent_Registration.php" method="POST" onsubmit="validateForm(event)">
        <div class="input-group">
          <label for="real-name">Hotel Name</label>
          <input type="text" id="real-name" name="real-name" class="input-field" placeholder="Enter hotel Name" required />
        </div>

        <div class="input-group">
          <label for="location">Location</label>
          <input type="text" id="location" name="location" class="input-field" placeholder="Enter hotel location" required />
        </div>

        <div class="input-group">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" name="phone" class="input-field" placeholder="Enter hotel phone" required />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" class="input-field" placeholder="Enter Your Email" required />
        </div>

        <div class="input-group">
          <label for="NoOfRooms">Number of rooms</label>
          <input type="number" id="NoOfRooms" name="NoOfRooms" class="input-field" placeholder="Enter number of rooms" required />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" class="input-field" placeholder="Enter Your Password" onchange="validatePasswordSize()" required />
          <p id="password-notification" style="display:none; color:red;">Password must be at least 8 characters long.</p>
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
<!-- 
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
    $location = $_POST['location'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $NoOfRooms = $_POST['NoOfRooms'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirm-password'];

    // Check if passwords match
    if ($password !== $confirmPassword) {
        echo "<script>alert('Passwords do not match!'); window.history.back();</script>";
        exit;
    }

    // Check password length
    if (strlen($password) < 8) {
        echo "<script>alert('Password must be at least 8 characters long!'); window.history.back();</script>";
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO hotel_agent (Hotel_name, Location, Hotel_phone, Hotel_email, No_of_rooms, password) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt === false) {
        die('Prepare failed: ' . htmlspecialchars($conn->error));
    }

    // Bind parameters
    $stmt->bind_param("ssssss", $name, $location, $phone, $email, $NoOfRooms, $hashedPassword);

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
  <script src="http://localhost/JetVoyager/JetVoyager/src/Agent_pages/Agent_Access.js"></script>
  <title>JetVoyager Hotel Registration</title>
</head>

<body>
  <div class="register-container">
    <div class="register-form-section">
      <h1 class="register-heading">Join JetVoyager Hotel Portal</h1>
      <form action="Agent_Registration.php" method="POST" onsubmit="return validateForm()">
        <div class="input-group">
          <label for="real-name">Hotel Name</label>
          <input type="text" id="real-name" name="real-name" class="input-field" placeholder="Enter hotel Name" required />
        </div>

        <div class="input-group">
          <label for="location">Location</label>
          <input type="text" id="location" name="location" class="input-field" placeholder="Enter hotel location" required />
        </div>

        <div class="input-group">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" name="phone" class="input-field" placeholder="Enter hotel phone" required />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" class="input-field" placeholder="Enter Your Email" required />
        </div>

        <div class="input-group">
          <label for="NoOfRooms">Number of rooms</label>
          <input type="number" id="NoOfRooms" name="NoOfRooms" class="input-field" placeholder="Enter number of rooms" required />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" class="input-field" placeholder="Enter Your Password" required />
          <p id="password-notification" style="display:none; color:red;">Password must be at least 8 characters long.</p>
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

  <script>
    // Password validation
    function validateForm() {
      var password = document.getElementById('password').value;
      if (password.length < 8) {
        document.getElementById('password-notification').style.display = 'block';
        return false; // Prevent form submission
      }
      return true;
    }
  </script>

</body>

</html> -->


