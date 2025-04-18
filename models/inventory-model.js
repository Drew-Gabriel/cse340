const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  } catch (error) {
    console.error("getclassifications error " + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***********************
 * Get all inventory Details
* *************************** */
async function getInventoryDetailsById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory
      WHERE inv_id = $1`, [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error(`getinventorydetailsbyid ${error}`)
  }
}

/*  **********************************
  *  Check if classification name exist
  * ********************************* */
async function checkExistingName(classification_name) {
  try {
    const sql = `SELECT * FROM classification WHERE classification_name = $1`
    const name = await pool.query(sql, [classification_name])
    return name.rowCount
  } catch (error) {
    return error.message
  }
}

/*  **********************************
  *  Insert classifications
  * ********************************* */
async function insertClassification(classification_name) {
  try {
    const sql = `INSERT INTO classification (classification_name) VALUES ($1)`;
    const insert = await pool.query(sql, [classification_name])
    return insert
  } catch (error) {
    return error.message
  }
}

async function insertIntoInvTable(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color) {
  try {
    const sql = `INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

    const values = [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color]
    let result = await pool.query(sql, values)
    return result;
  } catch (error) {
    return error.message;
  }
}

/*  **********************************
  *  Insert classifications
  * ********************************* */
async function getInventory() {
  try {
    const sql = `SELECT * FROM inventory`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    return error.message
  }
}

/*  **********************************
  *  Delete Inventory Items
  * ********************************* */
async function deleteInvItem(inv_id) {
  try {
    const sql = `DELETE FROM inventory WHERE inv_id = $1`
    const result = await pool.query(sql, [inv_id])
    return result
  } catch (error) {
    return error.message
  }
}

async function updateInventoryTable(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id) {
  try {
    const sql = `UPDATE inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11`;
    // Execute the SQL query with the provided parameters
    const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id]);
    return result;
  } catch (error) {
    return error.message;
  }
}

async function InsertOrderInTable(account_id, inv_id) {
  try {
    const sql = `INSERT INTO "order" (account_id, inv_id) VALUES ($1, $2)`
    const result = await pool.query(sql, [account_id, inv_id])
    return result
  } catch (error) {
    throw new Error('Error in insert', error)
  }
}



module.exports = { getClassifications, getInventoryByClassificationId, getInventoryDetailsById, checkExistingName, insertClassification, insertIntoInvTable, getInventory, deleteInvItem, updateInventoryTable, InsertOrderInTable }



