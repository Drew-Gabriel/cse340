const accountModel = require('../models/account-model')
const utilities = require('../utilities')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.")
  res.render("account/login", {
    title: "Login",
    errors: null,
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */ 
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      const redirectTo = req.session.redirectTo || '/account'
      res.redirect(redirectTo)
      delete req.session.redirectTo
      return
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function getAccountView(req, res) {
  let nav = await utilities.getNav()
  res.render('./account/account', {
    title: "Account",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Create Account Update View
 * ************************** */
async function updateAccountView(req, res) {
  let nav = await utilities.getNav()
  const account_id = req.params.id;
  const accountData = await accountModel.getAccountById(account_id)
  res.render('./account/update-account', {
    title: "Edit Account",
    nav,
    errors: null,
    accountData,
  })
}

/* ***************************
 *  Update Account Information
 * ************************** */
async function updateAccountInfo(req, res) {
  // checks if the firstname exist in the request body signifying that this is the request from the Edit account not the Edit password
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const accountData = await accountModel.updateAccountTable(account_id, account_firstname, account_lastname, account_email)

  if (accountData.rowCount == 1) {
    req.flash('notice', 'Information Sucessfully Updated')
    res.redirect('/account/')
  } else {
    req.flash('notice', 'Error in update, try again')
    res.render('./account/update-account', {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* **************************
 *  Update Password
 * ************************** */
async function updatePasswordData(req, res) {
  const { account_id, account_password } = req.body
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the Update.')
    res.status(500).render("account/update-inventory", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }
  const updatePassword = await accountModel.updatePassword(account_id, hashedPassword)
  if (updatePassword.rowCount > 0) {
    req.flash('notice', 'Password Changed Successfully')
    res.redirect('/account/')
  }
}

/* **************************
 * Logout
 * ************************** */
function logout(req, res, next) {
  res.clearCookie("jwt");
  return res.redirect("/");
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, updateAccountView, updateAccountInfo, getAccountView, updatePasswordData, logout }
