<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/Unregistered/registration.css" />
  <script src="./accessPages.js"></script>
  <title>JetVoyager Registration</title>
</head>

<body onload="toggleFields()">
  <!-- <p class="register-logo"><a href="../../../homePage.html">JetVoyager</a></p> -->

  <div class="register-container">
    <div class="register-form-section">
      <span class="register-heading">Join JetVoyager</span>

      <div class="form-wrapper">
        <form action="./userRegister.php" method="POST">

          <div class="input-group">
            <label for="real-name">Full Name</label>
            <input type="text" id="real-name" name="real-name" class="input-field" placeholder="Enter Your Name" required />
          </div>

          <div class="input-group" id="nic-field">
            <label for="NIC">NIC</label>
            <input type="text" id="nic" name="nic" class="input-field" placeholder="Enter Your NIC" onchange="validateNICOnChange()" />
          </div>

          <div class="input-group" id="subject-field" style="display: none;">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" class="input-field" placeholder="Enter Your Subject" />
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

          <input type="submit" value="Sign Up" class="submit-btn" />
        </form>

        <p class="terms">By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
      </div>

      <div class="login-redirect">
        Already have an account? <a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/Unregistered/Login.php">Log In</a>
      </div>
    </div>

    <div class="register-image-section">
      <img src="http://localhost/JetVoyager/JetVoyager/images/3.png" alt="Travel" />
      <p>Embark on a seamless journey <br> with JetVoyager!</p>
    </div>
  </div>
  <footer>
    <p>&copy; 2024 JetVoyager. All rights reserved.</p>
  </footer>
</body>

</html>