function validateNICOnChange() {
  const nic = document.getElementById("nic").value;
  if (!validateNIC(nic)) {
    alert("Please enter a valid NIC number.");
    document.getElementById("nic").value = "";
    document.getElementById("nic").focus();
  }
}

function validatePasswordSize() {
  const password = document.getElementById("password").value;
  const notificationLabel = document.getElementById("password-notification");

  if (password.length < 8) {
    notificationLabel.style.display = "block";
  } else {
    notificationLabel.style.display = "none";
  }
}
