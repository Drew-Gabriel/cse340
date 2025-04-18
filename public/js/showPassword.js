

document.addEventListener('DOMContentLoaded', () => {
  const passwordField = document.querySelector('#account_password')
  const showPassword = document.querySelector('.show')
  showPassword.addEventListener('click', () => {
    const type = passwordField.getAttribute('type')

    if (type === 'password') {
      passwordField.setAttribute('type', 'text')
      showPassword.innerHTML = 'Hide'
    } else {
      passwordField.setAttribute('type', 'password')
      showPassword.innerHTML = 'Show'
    }
  })
})
