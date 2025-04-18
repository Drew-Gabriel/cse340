document.addEventListener('DOMContentLoaded', () => {
  const addCartButtons = document.querySelectorAll('.addCart')
  let badge = document.querySelector('.badge')
  let notice = document.querySelector('.notice')
  let total = document.querySelector('.total')
  // if (localStorage.getItem('badgeCount')) {
  //   badge.textContent = localStorage.getItem('badgeCount') || ''
  // }
  addCartButtons.forEach(addButton => {
    const inv_id = addButton.getAttribute('inv_id')
    addButton.addEventListener('click', () => {
      const api = `/inv/addtocart/`

      fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inv_id: inv_id,
          quantity: 1,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.cart.length) {
            badge.textContent = data.cart.length
            notice.style.display = 'block'
            notice.textContent = `${data.inv_make} ${data.inv_model} has been added to cart`
            setTimeout(() => {
              notice.style.display = 'none';
            }, 3000)
          } else {
            console.error('Failed to add item to cart:', data.message)
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    })
  })
})



