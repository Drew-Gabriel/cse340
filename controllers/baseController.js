const utilities = require("../utilities/")
const baseController = {}

/* ***************
This function builds  the home view
**************** */

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

/* ***************
This function creates an intentional 500 Error
**************** */
baseController.createError = async function(req, res) {
  // This functions attempts to create the home view but  the comments out the nav so it can create a "nav not defined error" and this can be caught by the error handler and display the error view with the appropriate error message
  // const nav = await utilities.getNav() // commented out nav
  res.render("index", {title: "Home", nav})
}


module.exports = baseController
