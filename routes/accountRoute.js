const express = require('express')
const router = new express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')
// const { route } = require('./static')

/* Get the Login in view for the Application */
router.get('/login', utilities.handleErrors(accountController.buildLogin))

/* Gets the Registration view for the Application */
router.get('/register', utilities.handleErrors(accountController.buildRegister))

/* Gets the Account view for the Application */
router.get('/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.getAccountView))

// Route for updating account information
router.get('/update/:id',
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountView)
)

router.get('/logout', 
  utilities.checkLogin,
  utilities.handleErrors(accountController.logout)
)

/* Procesess the registration process */
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process Account information update
router.post(
  '/update',
  utilities.checkLogin,
  regValidate.editRules(),
  regValidate.checkEditData,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// Process password change
router.post(
  '/password',
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePasswordData)
)

module.exports = router