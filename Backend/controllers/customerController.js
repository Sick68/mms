import db from "../config/db.js";

// Add customer
export const addCustomerDetails = async (req, res) => {
    try {
        const { customer_name, contact, created_at } = req.body;
        // Use await instead of callback
        await db.query(
            "INSERT INTO customers(customer_name, contact, created_at) VALUES(?,?,?)",
            [customer_name, contact, created_at]
        );
        res.json({ message: "Customer Added Successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Get the full list for the Search Bar (The "Registry")
export const getCustomersList = async (req, res) => {
    try {
        // Destructure [result] to get the rows
        const [result] = await db.query("SELECT customer_id, customer_name, contact FROM customers");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Fetch history using the Unique ID
export const getPurchaseHistory = async (req, res) => {
    try {
        const { customer_id } = req.params;
        // Updated to use lowercase table names for Aiven/Linux compatibility
        const [result] = await db.query(
            `SELECT s.sale_id, m.name AS medicine_name, s.quantity, s.finalTotal, s.date
             FROM sales s
             JOIN medicines m ON s.medicine_id = m.medicine_id
             WHERE s.customer_id = ? 
             ORDER BY s.date DESC`,
            [customer_id]
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};