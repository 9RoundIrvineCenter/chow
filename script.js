const webAppUrl = 'https://script.google.com/macros/s/AKfycbxkcKjfeqi4NuoGJrHXQnj8Fc9STle-Ji9EIKs1jvlPk5Df5I3Ot-tCzEN51YjRFZ8/exec';

function fetchWeekStartDate() {
  fetch(webAppUrl + '?action=updateChowWeek')
    .then(response => response.text())
    .then(data => {
      document.getElementById('chowWeek').innerText = data;
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
  var nameField = document.getElementById('name');

  // Remove the header if present
  var header = document.querySelector('.apps-material-header');
  if (header) {
    header.style.display = 'none';
  }
  
  // Function to get cookie
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  // Function to set cookie
  function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  // Set name from cookie if exists
  var cookieName = getCookie('userName');
  if (cookieName) {
    nameField.value = cookieName;
  }

  // Function to show custom modal
  function showCustomModal(message) {
    var modal = document.getElementById('customModal');
    document.getElementById('modalMessage').innerText = message;
    modal.style.display = "block";

    // Close when clicking on the close button
    document.getElementsByClassName('close')[0].onclick = function() {
      modal.style.display = "none";
    }

    // Close when clicking outside of the modal
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  // Form submission event listener
  document.getElementById('chowForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = nameField.value;
    var chowTotal = document.getElementById('chowTotal').value;

    // Set cookie for name for 30 days
    setCookie('userName', name, 30);

    // Show modal immediately
    showCustomModal('Submitting your CHOW...');

    // Submit data to the sheet
    fetch(webAppUrl + '?action=submitData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `name=${encodeURIComponent(name)}&chowTotal=${encodeURIComponent(chowTotal)}`
    })
    .then(response => response.text())
    .then(data => {
      // Update modal message upon successful submission
      document.getElementById('modalMessage').innerText = 'Nice Work! 🥊';
      document.getElementById('chowForm').reset();
      
      // Hide modal after a short delay
      setTimeout(function() {
        document.getElementById('customModal').style.display = "none";
      }, 3000);
    })
    .catch(error => {
      // Handle error if needed
      document.getElementById('modalMessage').innerText = 'Error submitting your CHOW: ' + error.message;
      
      // Hide modal after a short delay
      setTimeout(function() {
        document.getElementById('customModal').style.display = "none";
      }, 3000);
    });
  });

  // Call fetchWeekStartDate to initialize the week start date on page load
  fetchWeekStartDate();
});