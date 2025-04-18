document.addEventListener('DOMContentLoaded', () => {
  const removeList = document.querySelectorAll('.cartRemove')
  const cartLine = document.querySelectorAll('.cartLine')
  const orderLink = document.querySelector('#orderLink')
  let itemPrices = document.querySelectorAll('.cartPrice')
  let total = document.querySelector('.total')

  function TotalPrice() {
    let totalPrice = 0
    itemPrices.forEach(price => {
      price = parseFloat(price.getAttribute('data-amount'))
      totalPrice += price
    });
    total.textContent = new Intl.NumberFormat('en-us',
      {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
      .format(totalPrice)
  }
  function updateTotalPrice(data) {
    if (data.cart.length == 0) {
      total.textContent = `$0`
      return
    }
    let price = 0
    data.cart.forEach(item => {
      price += parseFloat(item.inv_price)
      total.textContent = new Intl.NumberFormat('en-us',
        {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
        .format(price)
    });
  }

  removeList.forEach((removeButton, index) => {
    removeButton.addEventListener('click', () => {
      const inv_id = removeButton.getAttribute('data-inv_id')
      const api = `/inv/remove`

      fetch(api, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inv_id: inv_id }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            cartLine[index].closest('.cartLine').remove()
            updateTotalPrice(data)
          } else {
            console.error('Failed to remove item from cart:', data.message)
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    })
  })
  TotalPrice()
})

