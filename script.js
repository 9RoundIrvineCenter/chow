function getFormattedWeekStartDate() {
  var today = new Date();
  var firstDayOfWeek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1); // Monday as first day
  var weekStartDate = new Date(today.setDate(firstDayOfWeek));
  
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var month = monthNames[weekStartDate.getMonth()];
  var day = weekStartDate.getDate();
  
  var daySuffix = function(day) {
    if (day >= 11 && day <= 13) {
      return day + 'th';
    }
    switch (day % 10) {
      case 1:  return day + 'st';
      case 2:  return day + 'nd';
      case 3:  return day + 'rd';
      default: return day + 'th';
    }
  };

  return month + ' ' + daySuffix(day) + ' Week';
}

document.addEventListener('DOMContentLoaded', function() {
  // Set the CHOW week on the client side
  var chowWeek = getFormattedWeekStartDate();
  document.getElementById('chowWeek').innerText = chowWeek;
  
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

  document.getElementById('chowForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = nameField.value;
    var chowTotal = document.getElementById('chowTotal').value;
  
    // Set cookie for name for 30 days
    setCookie('userName', name, 30);
  
    // Show modal immediately
    showCustomModal('Submitting your CHOW...');
  });
});