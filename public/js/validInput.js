const inputs = document.querySelectorAll('input')

inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.validity.valid) {
      input.style.borderColor = "green"
    } else {
      input.style.borderColor = "red"
    }
  })
});