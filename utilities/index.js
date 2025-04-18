const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h3>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h3>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += `<input type="button" id="submit" class="addCart" inv_id=${vehicle.inv_id} name="addCart" value="Add to Cart">`
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the view for the Vehicles Detail
* ************************************ */
Util.buildDetailDisplay = async function (data) {
  let display
  if (data.length > 0) {
    data.forEach(item => {
      display = `
    <div class="detail-grid"> 
    <img src="${item.inv_image}" alt="${item.inv_make} ${item.inv_name}"/>
    <div class="detail-info"> 
    <h2> ${item.inv_make} ${item.inv_model} Details </h2>
    <p class="price"><span> Price: </span> $${new Intl.NumberFormat('en-US').format(item.inv_price)} </p>
    <p class="description"><span> Description: </span> ${item.inv_description} </p>
    <p class="color"><span> Color: </span> ${item.inv_color} </p>
    <p class="miles"><span> Miles: </span> ${new Intl.NumberFormat('en-US').format(item.inv_miles)} </p>
    </div>
    </div>`
    })
  } else {
    display = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return display
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    res.locals.accountData = ''
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.session.redirectTo = req.originalUrl // save the original url in the session
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Admin
 * ************************************ */
Util.checkAdmin = (req, res, next) => {
  if (res.locals.accountData.account_type === 'Admin' || res.locals.accountData.account_type === 'Employee') {
    next()
  }
  else {
    req.flash("notice", "You are not authorized to view this page.")
    res.redirect("/account/login")
  }
}

Util.cartIcon = () => {
  let cart = ` <div class="cart-icon">
      <a class="cartLink" href="/inv/cartView"><img src="/images/site/shopping-cart.png" alt=""></a>
      <span class="badge"></span>
</div> `
  return cart
}

Util.getCartView = (receivedCart) => {

  let display = `<div class="cartItems">`
  display += `<div class="cartHead">`
  display += '<h3>Image</h3>'
  display += '<h3>Product</h3>'
  display += '<h3>Price</h3> </div>'
  display += '<div class="cartBody">'
  receivedCart.forEach(item => {
    display += `
    <p class="cartLine">
    <span class="cartImg"> <img src="${item.inv_thumbnail}" alt="${item.inv_make} ${item.inv_model}"> </span>
    <span class="cartProd">${item.inv_make} ${item.inv_model}</span>
    <span class="priceRemove">
    <span data-amount=${item.inv_price} class="cartPrice">${new Intl.NumberFormat('en-us', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(item.inv_price, 0)}</span>
    <span class="cartRemove" data-inv_id=${item.inv_id}>❌</span>
    </span>
    `
  })
  display += '</div>'
  display += '</div>'
  return display;
}


module.exports = Util
