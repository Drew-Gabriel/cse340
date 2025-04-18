// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const validateInv = require('../utilities/classification-validation')


// Route to the inventory management page
router.get('/',
  utilities.checkAdmin,
  utilities.handleErrors(invController.createInvManagement))
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to the inventory detail page
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))
// Route to add vehicle page
router.get('/addvehicle',
  utilities.checkAdmin,
  utilities.handleErrors(invController.createAddVehicle))
//  Route to add classification page
router.get('/addclassification',
  utilities.checkAdmin,
  utilities.handleErrors(invController.addClassificationView))
// Delete Route for Inventory page
router.get('/delete/:invId',
  utilities.checkAdmin,
  utilities.handleErrors(invController.DeleteInvView))

router.get('/placeorder/',
  utilities.checkLogin,
  utilities.handleErrors(invController.placeOrder))

// router.get('/getcart',
//   invController.getCart)

// Post request to the inventory detail page
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Get cart data
router.get('/cart/:Id', utilities.handleErrors(invController.getCartInfoJSON))

router.get('/cartView', utilities.handleErrors(invController.getCartView))

router.get('/orderconfirmation',
  utilities.checkLogin,
  utilities.handleErrors(invController.checkPlacedOrder),
  utilities.handleErrors(invController.orderConfirmationView))



// Post request to the add classification page
router.post('/addclassification',
  validateInv.classificationRules(),
  utilities.handleErrors(validateInv.checkClassificationData),
  utilities.handleErrors(invController.insertIntoClassTable),
)
// Post request to add vehicle to a classification page
router.post('/addvehicle',
  validateInv.inventoryRules(),
  utilities.handleErrors(validateInv.checkInventoryData),
  utilities.handleErrors(invController.insertIntoInvTable))

// Post request to delete inventory 
router.post('/',
  utilities.handleErrors(invController.deleteInvItem))

router.post('/update',
  validateInv.inventoryRules(),
  validateInv.checkEditData,
  utilities.handleErrors(invController.updateInventoryData))

router.post('/addtocart/', invController.storeCartData)

// router.post('/inv/placeorder',
//   utilities.checkLogin,
//   invController.placeOrder)

router.delete('/remove/', invController.removeCartItem)




module.exports = router;