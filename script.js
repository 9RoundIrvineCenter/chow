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
  var chowTotalField = document.getElementById('chowTotal');
  var form = document.querySelector('.animate-form');
  var logo = document.querySelector('.logo');
  var title = document.querySelector('.animate-title');
  var text = document.querySelector('.animate-text');

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
      modal.style.display = 'none';
    }

    // Close when clicking outside of the modal
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    }

    // Show celebration animation for all success messages
    showCelebration();
  }

  // Function to show celebration animation
  function showCelebration() {
    var celebration = document.getElementById('celebration');
    celebration.innerHTML = ''; // Clear previous animation
    var emojis = ['🎉', '🎊', '🥳', '💥', '🔥', '💪', '😍'];
    for (var i = 0; i < 100; i++) {
      var emoji = document.createElement('div');
      emoji.className = 'emoji';
      emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = Math.random() * 100 + 'vw';
      emoji.style.animationDelay = Math.random() * 2 + 's';
      celebration.appendChild(emoji);
    }
    setTimeout(function() {
      celebration.innerHTML = ''; // Remove emojis after animation
    }, 5000);
  }

  // Add input validation to prevent numbers in the name field
  nameField.addEventListener('input', function(e) {
    var value = e.target.value;
    e.target.value = value.replace(/[0-9]/g, '');
  });

  // Add focus event to form fields to move the logo, title, and text up
  document.querySelectorAll('.animate-input').forEach(function(input) {
    input.addEventListener('focus', function() {
      logo.classList.add('up');
      title.classList.add('up');
      text.classList.add('up');
      form.classList.add('up');
    });

    input.addEventListener('blur', function() {
      logo.classList.remove('up');
      title.classList.remove('up');
      text.classList.remove('up');
      form.classList.remove('up');
    });
  });

  document.getElementById('chowForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = nameField.value;
    var chowTotal = chowTotalField.value;
  
    // Set cookie for name for 30 days
    setCookie('userName', name, 30);
  
    // Show modal immediately
    showCustomModal('Submitting your CHOW...');

    // Send data to the server
    fetch('https://script.google.com/macros/s/AKfycbzaffgMUNebwuxab0kTuX-ITNjF2RuFEhruaTi0w3TTw8KvfRbl4VSOzMDeXTaDtLj1/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'submitData',
        name: name,
        chowTotal: chowTotal
      })
    })
    .then(response => response.text())
    .then(data => {
      console.log('Success:', data);
      var successMessages = [
        'Nice Work! 🥊',
        'Great Job! 🎉',
        'Well Done! 👍',
        'You Did It! 🏆',
        'Fantastic! 🌟'
      ];
      var randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
      showCustomModal(randomMessage);
      chowTotalField.value = ''; // Clear the CHOW TOTAL field
    })
    .catch((error) => {
      console.error('Error:', error);
      showCustomModal('Error submitting your CHOW. Please try again.');
    });
  });
});