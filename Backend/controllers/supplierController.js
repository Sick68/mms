import db from "../config/db.js"

// Add Supplier
export const addSupplierDetails = async (req, res) => {
    try {
        const { name, contact, address } = req.body;
        // Replaced callback with await
        await db.query(
            "INSERT INTO suppliers (name, contact, address) VALUES (?, ?, ?)",
            [name, contact, address]
        );
        res.json({ message: "Supplier added Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

// Get All Suppliers
export const getSupplier = async (req, res) => {
    try {
        // Destructured [result] to get the data rows
        const [result] = await db.query("SELECT * FROM suppliers");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

// Update Supplier Info
export const UpdateSupplierInfo = async (req, res) => {
    try {
        const { supplier_id } = req.params;
        const { name, contact, address } = req.body;

        const [result] = await db.query(
            "UPDATE suppliers SET name=?, contact=?, address=? WHERE supplier_id = ?",
            [name, contact, address, supplier_id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Not found" });

        res.json({ message: "Supplier Update Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

// Get Supplier Purchase History
export const getSupplierPurchases = async (req, res) => {
    try {
        const { supplier_id } = req.params;

        const query = `
            SELECT p.purchase_id, m.name AS medicine_name, p.quantity, p.price, p.date
            FROM purchases p
            JOIN medicines m ON p.medicine_id = m.medicine_id
            WHERE p.supplier_id = ?
            ORDER BY p.date DESC
        `;
        
        const [result] = await db.query(query, [supplier_id]);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};