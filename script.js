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
  var nameField = document.getElementById('name');
  var chowTotalField = document.getElementById('chowTotal');
  var form = document.querySelector('.animate-form');
  var logo = document.querySelector('.logo');
  var title = document.querySelector('.animate-title');
  var text = document.querySelector('.animate-text');
  var disclaimer = document.querySelector('.disclaimer-text');
  var chowWeekElement = document.getElementById('chowWeek'); // Get the element to display chowWeek

  // Set the CHOW week on the client side
  var chowWeek = getFormattedWeekStartDate();
  chowWeekElement.innerText = chowWeek;

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

  // Generate a unique user ID if not already set
  var userId = getCookie('userId');
  if (!userId) {
    userId = 'user-' + Math.random().toString(36).substr(2, 9);
    setCookie('userId', userId, 365); // Set cookie for 1 year
  }

  // Set name from cookie if exists
  var cookieName = getCookie('userName');
  if (cookieName) {
    nameField.value = cookieName;
  }

  // Function to show custom modal
  function showCustomModal(message, showCelebration) {
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
    if (showCelebration) {
      showCelebrationAnimation();
    }
  }

  // Function to show celebration animation
  function showCelebrationAnimation() {
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
    }, 3000);
  }

  // Add input validation to prevent numbers in the name field
  nameField.addEventListener('input', function(e) {
    var value = e.target.value;
    e.target.value = value.replace(/[0-9]/g, '');
  });

  // Detect iOS devices
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Add focus event to form fields to move the logo, title, text, and disclaimer up
  document.querySelectorAll('.animate-input').forEach(function(input) {
    input.addEventListener('focus', function() {
      if (isIOS) {
        logo.classList.add('ios-up');
        title.classList.add('ios-up');
        text.classList.add('ios-up');
        disclaimer.classList.add('ios-up');
        form.classList.add('ios-up');
      } else {
        logo.classList.add('up');
        title.classList.add('up');
        text.classList.add('up');
        disclaimer.classList.add('up');
        form.classList.add('up');
      }

      // Adjust viewport to prevent scrolling too much upward
      setTimeout(function() {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });

    input.addEventListener('blur', function() {
      if (isIOS) {
        logo.classList.remove('ios-up');
        title.classList.remove('ios-up');
        text.classList.remove('ios-up');
        disclaimer.classList.remove('ios-up');
        form.classList.remove('ios-up');
      } else {
        logo.classList.remove('up');
        title.classList.remove('up');
        text.classList.remove('up');
        disclaimer.classList.remove('up');
        form.classList.remove('up');
      }
    });
  });

  document.getElementById('chowForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = nameField.value;
    var chowTotal = chowTotalField.value;
  
    // Client-side validation
    if (!name) {
      showCustomModal('Name is required.', false);
      return;
    }
    if (isNaN(chowTotal) || chowTotal === '') {
      showCustomModal('CHOW Total must be a number.', false);
      return;
    }
  
    var lastSubmissionDate = localStorage.getItem('lastSubmissionDate');
    var today = new Date().toISOString().split('T')[0];
  
    if (lastSubmissionDate === today) {
      showCustomModal('You have already submitted your CHOW today. Please try again tomorrow.', false);
      return;
    }
  
    setCookie('userName', name, 30);
  
    var successMessages = [
      'Nice Work! 🥊',
      'Great Job! 🎉',
      'Well Done! 👍',
      'You Did It! 🏆',
      'Fantastic! 🌟'
    ];
    var randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
    showCustomModal(randomMessage, true);
    chowTotalField.value = ''; // Clear after validation
  
    localStorage.setItem('lastSubmissionDate', today);
  
    fetch('https://script.google.com/macros/s/AKfycbzaffgMUNebwuxab0kTuX-ITNjF2RuFEhruaTi0w3TTw8KvfRbl4VSOzMDeXTaDtLj1/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'submitData',
        userId: userId,
        name: name,
        chowTotal: chowTotal
      })
    })
    .then(response => response.text())
    .then(data => {
      console.log('Success:', data);
      if (data.startsWith('Error:')) {
        showCustomModal(data, false);
        localStorage.removeItem('lastSubmissionDate');
        chowTotalField.value = chowTotal;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      showCustomModal('Error submitting your CHOW. Please try again.', false);
      localStorage.removeItem('lastSubmissionDate');
      chowTotalField.value = chowTotal;
    });
  });
});