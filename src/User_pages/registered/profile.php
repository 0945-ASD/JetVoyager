<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    <link rel="stylesheet" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.css">
</head>

<body>
    <header>
        <a class="logo" href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/homePage.php">JetVoyager</a>
        <div class="navbar">
            <ul class="nav-links">
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/bookTours.php" onclick="showFeature('book-tours'); return false;">Book Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/manageTours.php" onclick="showFeature('manage-tours'); return false;">Manage Tours</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/tourHistory.php" onclick="showFeature('tour-history'); return false;">Tour History</a></li>
                <li><a href="http://localhost/JetVoyager/JetVoyager/src/User_pages/registered/profile.php" onclick="showFeature('profile'); return false;">Profile</a></li>
            </ul>
        </div>
    </header>
    <main>
        <div id="profile" class="main-content">
            <h2>Your Profile</h2>
            <div class="profile-details">
                <p><strong>Name:</strong> <span id="profile-name">John Doe</span></p>
                <p><strong>NIC:</strong> <span id="profile-NIC">1234567890123</span></p>
                <p><strong>Email:</strong> <span id="profile-email">john.doe@example.com</span></p>
                <p><strong>Phone:</strong> <span id="profile-phone">123-456-7890</span></p>
                <p><strong>Password:</strong> <span id="profile-Password">ASkorhbeu7i</span></p>

                <button class="edit-button" onclick="openModal()">Edit Profile</button>
            </div>
        </div>

        <div class="modal" id="edit-modal">
            <div class="modal-content">
                <h3>Edit Profile</h3>
                <label for="edit-name">Name:</label>
                <input type="text" id="edit-name" value="John Doe">

                <label for="edit-NIC">NIC:</label>
                <input type="text" id="edit-NIC" value="1234567890123">

                <label for="edit-email">Email:</label>
                <input type="email" id="edit-email" value="john.doe@example.com">

                <label for="edit-phone">Phone:</label>
                <input type="tel" id="edit-phone" value="123-456-7890">

                <label for="edit-Password">Password:</label>
                <input type="password" id="edit-Password" value="ASkorhbeu7i">


                <button class="save-button" onclick="saveChanges()">Save</button>
                <button class="cancel-button" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    </main>

    <footer>
        © 2024 JetVoyager. All Rights Reserved.
    </footer>


    <script>
        function openModal() {
            document.getElementById('edit-modal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('edit-modal').style.display = 'none';
        }

        function saveChanges() {
            const name = document.getElementById('edit-name').value;
            const NIC = document.getElementById('edit-NIC').value;
            const email = document.getElementById('edit-email').value;
            const phone = document.getElementById('edit-phone').value;
            const Password = document.getElementById('edit-Password').value;


            // Update the profile details
            document.getElementById('profile-name').innerText = name;
            document.getElementById('profile-NIC').innerText = NIC;
            document.getElementById('profile-email').innerText = email;
            document.getElementById('profile-phone').innerText = phone;
            document.getElementById('profile-Password').innerText = Password;

            // Close the modal
            closeModal();
        }
    </script>
</body>

</html>


<!--future references-->

<!-- function saveChanges() {
    const name = document.getElementById('edit-name').value;
    const NIC = document.getElementById('edit-NIC').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    const Password = document.getElementById('edit-Password').value;

    console.log({ name, NIC, email, phone, Password });  // Debugging line

    // Update the profile details
    document.getElementById('profile-name').innerText = name;
    document.getElementById('profile-NIC').innerText = NIC;
    document.getElementById('profile-email').innerText = email;
    document.getElementById('profile-phone').innerText = phone;
    document.getElementById('profile-Password').innerText = Password;

    // Close the modal
    closeModal();
} -->
