document
  .getElementById('contactForm')
  .addEventListener('submit', function (event) {
    event.preventDefault()

    emailjs
      .send('service_r6df6y9', 'template_7afeu2h', {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value,
      })
      .then(
        function (response) {
          console.log('SUCCESS!', response.status, response.text)
        },
        function (error) {
          console.log('FAILED...', error)
        }
      )
  })
