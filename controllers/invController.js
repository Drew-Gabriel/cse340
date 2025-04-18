const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { body } = require("express-validator")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let cart = utilities.cartIcon()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    cart
  })
}

/* ***************************
 *  Build by inventory id view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryDetailsById(inv_id)
  const display = await utilities.buildDetailDisplay(data)
  let nav = await utilities.getNav()
  let cart = utilities.cartIcon()
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: className,
    nav,
    display,
    cart
  })
}

/* ***************************
  Build Inventoey management view
 * ************************** */
invCont.createInvManagement = async (req, res, next) => {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  let inventory = await invModel.getInventory()
  res.render('./inventory/management', {
    title: 'Inventory Management',
    nav,
    inventory: inventory,
    classificationList,
  })
}

/* ***************************
  Build Inventoey management view
 * ************************** */
invCont.addClassificationView = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render('./inventory/add-classification', {
    title: 'Add Classification',
    nav,
    errors: null,
  })
}

/* ***************************
  Insert new Classification into classification table
 * ************************** */
invCont.insertIntoClassTable = async (req, res, next) => {
  // const { classification_name } = req.body
  const insert = await invModel.insertClassification(classification_name)
  let nav = await utilities.getNav()
  if (insert.rowCount > 0) { // This checks if the insert was sucessful by checking the rowcount, if its 1 then the query was sucessful but if there is no rowCount then the query did not run.
    req.flash("notice", `New classification "${classification_name}" has been added`)
    res.status(201).render('./inventory/management', {
      title: 'Inventory Management',
      nav,
      errors: null
    })
  } else {
    req.flash("notice", `Sorry, Adding ${classification_name} was not sucesssful! Please try again`)
    res.status(501).render("./inventory/add-classification", {
      nav,
      title: "Add Classification",
      errors: null
    })
  }
}

/* ***************************
  Add Vehicle View
 * ************************** */
invCont.createAddVehicle = async (req, res, next) => {
  let nav = await utilities.getNav()
  let inventory = await utilities.buildClassificationList()
  res.render('./inventory/add-inventory', {
    nav,
    title: 'Add Vehicles',
    errors: null,
    inventory
  })
}

/* ***************************
 *  Insert Vehicle into Database
 * ************************** */
invCont.insertIntoInvTable = async (req, res, next) => {
  const { classification_id, inv_make, inv_model,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color } = req.body // extracts all needed information from the request body
  const insert = await invModel.insertIntoInvTable(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color)
  if (insert.rowCount > 0) { // checks if the query was sucessful by checking for the row count in the returend query 
    req.flash("notice", `${inv_make} ${inv_model} has been sucessfully added!`)
    res.redirect('/inv')
  } else {
    req.flash("notice", 'Something went wrong') // if the query was not sucessful, flash a message to the user
    res.render('./inventory/add-inventory', {
      nav,
      title: 'Add Vehicles',
      errors: null,
      classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
  Delete Inventory
 * ************************** */
invCont.DeleteInvView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let inv_id = req.params.invId
  let invDetailsReq = await invModel.getInventoryDetailsById(inv_id)
  let invDetails = invDetailsReq[0]

  res.render('./inventory/delete-inventory', {
    nav,
    title: 'Delete Inventory',
    errors: null,
    invDetails,
  })
}

/* ***************************
  Delete Inventory
 * ************************** */
invCont.deleteInvItem = async function (req, res, next) {
  const { inv_make, inv_model, inv_id } = req.body
  let deleteInv = await invModel.deleteInvItem(inv_id)
  if (deleteInv.rowCount > 0) {
    req.flash('notice', `${inv_make} ${inv_model} was sucessfully deleted`)
    res.redirect('/inv')
  } else {
    req.flash('notice', 'Error in deletion, please try again')
    res.redirect('/inv/delete/inv_id')
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const response = await invModel.getInventoryDetailsById(inv_id)
  const itemData = response[0]
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update inventory data
 * ************************** */
invCont.updateInventoryData = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body

  const updateData = await invModel.updateInventoryTable(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id)

  if (updateData.rowCount > 0) {
    req.flash('notice', `${inv_make} ${inv_model} has been updated!`)
    res.redirect('/inv')
  } else {
    let nav = utilities.getNav()
    req.flash('notice', 'Error in update, please try again')
    res.render('./inventory/edit-inventory', {
      nav,
      title: `Edit ${inv_make} ${inv_model}`,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id,
      errors: null,
    })
  }
}

invCont.getCartInfoJSON = async (req, res, next) => {
  const inventory_id = parseInt(req.params.Id)
  const response = await invModel.getInventoryDetailsById(inventory_id)
  const invData = response[0]

  if (invData.inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.storeCartData = async (req, res, next) => {
  const { inv_id, quantity } = req.body;
  const invItem = await invModel.getInventoryDetailsById(inv_id)
  if (!invItem || invItem.length === 0) {
    return res.status(404).json({ message: 'Item not found' })
  }
  const invData = invItem[0]
  const { inv_make, inv_model, inv_price, inv_thumbnail, inv_color } = invData
  const cartItem = {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_thumbnail,
    inv_color,
    quantity
  }
  req.session.cart = req.session.cart || []
  req.session.cart.push(cartItem)
  res.status(200).json({
    cart: req.session.cart,
    inv_make: inv_make,
    inv_model: inv_model,
    // total: total
  })
};
invCont.getCartView = async (req, res, next) => {
  const cart = req.session.cart || []
  const nav = await utilities.getNav()
  const cartView = utilities.getCartView(cart)
  res.render('./inventory/cart', {
    nav,
    title: 'Cart',
    cartView,
  })
}

invCont.removeCartItem = async (req, res, next) => {
  const { inv_id } = req.body;
  // Find and remove the item from the session cart
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.inv_id !== inv_id);
    res.status(200).json({ status: 'success', message: 'Item removed from cart', cart: req.session.cart });
  } else {
    res.status(404).json({ status: 'error', message: 'Cart not found' });
  }
}

invCont.placeOrder = async (req, res, next) => {
  try {
    const { account_id } = res.locals.accountData;
    const cart = req.session.cart || [];
    if (!cart.length) { // check if an order was placed on an empty cart
      return res.redirect('/inv/orderconfirmation')
      // res.send('empty cart')
    }
    // Process each item in the cart sequentially
    for (const item of cart) {
      await invModel.InsertOrderInTable(account_id, parseInt(item.inv_id));
    }
    delete req.session.cart
    req.session.orderPlaced = true
    res.redirect('/inv/orderconfirmation');
  } catch (error) {
    console.error('Error placing order:', error);
    next(error); // Pass the error to the error-handling middleware
  }
};

invCont.orderConfirmationView = async (req, res, next) => {
  const nav = await utilities.getNav()
  const { account_firstname } = res.locals.accountData
  res.render('./inventory/order-confirmation', {
    nav,
    title: 'Order Confirmation',
    account_firstname
  })
}

invCont.checkPlacedOrder = async (req, res, next) => {
  if (req.session.orderPlaced) {
    req.session.orderPlaced = false
    return next()
  } else {
    let nav = await utilities.getNav()
    res.render('./errors/no-placed-order', {
      title: "No Order Placed",
      nav,
    })
  }
}

module.exports = invCont