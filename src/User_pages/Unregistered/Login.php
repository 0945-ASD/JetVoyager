<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $type = $_POST['types'];
  $email = $_POST['email'];
  $passwd = $_POST['password'];

  // Use a relative path to include the config.php file
  include("../../config.php");

  if ($type === "Traveller") {
    $query = $conn->prepare("SELECT * FROM r_user WHERE EMAIL = ? AND Password = ?");
    $query->bind_param("ss", $email, $passwd);

    if ($query->execute()) {
      $result = $query->get_result();

      if ($result->num_rows > 0) {
        $_SESSION['user-email'] = $email;
        $_SESSION['user-pswd'] = $passwd;
        header('Location: ../registered/homePage.php');
        exit();
      } else {
        header('Location: Login.php?error=invalid');
        exit();
      }
    } else {
      echo "Error: " . $query->error;
    }

    $query->close();
  } else if ($type === "Agent") {
    $query = $conn->prepare("SELECT * FROM tour_guides WHERE email = ? AND password = ?");
    $query->bind_param("ss", $email, $passwd);

    if ($query->execute()) {
      $result = $query->get_result();

      if ($result->num_rows > 0) {
        $_SESSION['user-email'] = $email;
        $_SESSION['user-pswd'] = $passwd;
        header('Location: ../../Agent_pages/homePage.html');
        exit();
      } else {
        header('Location: ../../User_pages/Unregistered/HomePage.html');
        exit();
      }
    } else {
      echo "Error: " . $query->error;
    }

    $query->close();
  } else {
    echo "Invalid User type";
  }

  $conn->close();
  exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="Login.css" />
  <script>
    window.onload = function() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('error') && urlParams.get('error') === 'invalid') {
        document.getElementById('error-msg').style.display = 'block';
      }
    };
  </script>
  <title>JetVoyager - Log in</title>
</head>

<body>
  <div class="main-container">
    <div class="login-methods">
      <h1>Log in</h1>

      <div class="login-form">
        <form action="login.php" method="POST">
          <div class="input-container">
            <label for="type">Log in As</label>
            <select name="types" id="types">
              <option value="Traveller" default>Traveller</option>
              <option value="Agent">Agent</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div class="input-container">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter Your Email" required />
          </div>

          <div class="input-container">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter Your Password" required />
            <span id="togglePassword" class="eye-icon"></span>
            <label id="error-msg" style="display: none; color: red;">*Invalid username or password</label>
          </div>

          <button type="submit" class="login-btn">Log In</button>
        </form>
      </div>

      <hr />

      <p>Don't have an account? <a href="registration.php">Sign up here</a></p>
    </div>

    <div class="login-image">
      <img src="http://localhost/JetVoyager/JetVoyager/images/1.png" alt="Travel and Tours" />
    </div>
  </div>

  <script>
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password');

    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
    });
  </script>
  <footer>
    <p>&copy; 2024 JetVoyager. All rights reserved.</p>
  </footer>
</body>

</html>