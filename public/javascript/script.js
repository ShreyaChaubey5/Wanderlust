(() => {
    'use strict';

    // Get all forms with class 'needs-validation'
    const forms = document.querySelectorAll('.needs-validation');

    // Loop through each form and attach submit listener
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      }, false);
    });
  })();

