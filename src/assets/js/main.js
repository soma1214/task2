document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const agree = document.getElementById('agree').checked;
      
      if (!name || !email || !subject || !message || !agree) {
        alert('Please fill in all fields and agree to the terms.');
        return;
      }
      
      const alert = document.getElementById('successAlert');
      alert.classList.remove('d-none');
      alert.scrollIntoView({ behavior: 'smooth' });
      
      form.reset();
      
      setTimeout(() => {
        alert.classList.add('d-none');
      }, 5000);
    });
  }
});