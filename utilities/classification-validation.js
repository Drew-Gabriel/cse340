const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require('../models/inventory-model')
const validate = {}

/*  **********************************
  *  Classisfication Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  // Classification name Validation
  return [
    body("classification_name")
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 2 })
      .matches(/^[a-zA-Z0-9]+$/, 'i')
      .withMessage('Classification name is required and should meet expression requirements')
      .custom(async (classification_name) => {
        const nameExists = await invModel.checkExistingName(classification_name)
        if (nameExists) {
          throw new Error('Classification name already exists')
        }
      })
  ]
}

/*  **********************************
  *  Check Data Validation Rules
  * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render('./inventory/add-classification', {
      errors,
      title: 'Add Classification',
      classification_name,
      nav,
    })
    return
  }
  next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    // Select Category must not be empty
    body("classification_id")
      .notEmpty()
      .trim(),

    // Make should not be empty and must not be below three charaters
    body("inv_make")
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Make is required with an minimum of 3 Charaters'),

    // Model should not be empty and must not be below three charaters
    body("inv_model")
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Model is required with an minimum of 3 Charaters'),

    // Description is required and should not be empty
    body("inv_description")
      .notEmpty()
      .trim()
      .withMessage("Description must not be empty"),

    // Price must not be empty and should only integers and decimals
    body("inv_price")
      .notEmpty().withMessage('Price is required')
      .isNumeric() // must be a numeric value
      .matches(/^(\d*\.\d+|\d+)$/).withMessage('Price must be a decimal or whole number'),

    // Year must not be empty, must be a number and must be 4 digits in length
    body('inv_year')
      .notEmpty().withMessage('Year is required')
      .matches(/^\d{4}$/).withMessage('Year must be a 4-digit whole number'),

    body("inv_miles")
      .notEmpty().withMessage('Miles is required')
      .isNumeric().withMessage('Miles must be a numeric value')
      .matches(/^\d+$/).withMessage('Miles must be a whole number'),

    body("inv_color")
      .notEmpty().withMessage('Color must not be empty')
      .trim(),
    
    body('inv_image')
      .notEmpty()
      .trim()
      .withMessage('Image path is required'),
    
    body('inv_thumbnail')
      .notEmpty()
      .trim()
      .withMessage('Thumbnail path is required'),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color } = req.body

  const nav = await utilities.getNav()
  const inventory = await utilities.buildClassificationList(classification_id)
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.render("./inventory/add-inventory", {
      errors,
      nav,
      title: "Add Inventory",
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inventory
    })
    return
  } else {
    next()
  }
}

validate.checkEditData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color, inv_id } = req.body

  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(classification_id)
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.render("./inventory/edit-inventory", {
      errors,
      nav,
      title: "Add Inventory",
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classificationList,
      inv_id
    })
    return
  } else {
    next()
  }
}




module.exports = validate