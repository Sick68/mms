import db from "../config/db.js";

// Add Purchase
export const addPurchase = async (req, res) => {
    const { supplier_id, medicine_id, quantity, price } = req.body;

    try {
        // 1. Insert into purchase table
        const [result] = await db.query(
            "INSERT INTO purchases (supplier_id, medicine_id, quantity, price) VALUES(?, ?, ?, ?)",
            [supplier_id, medicine_id, quantity, price]
        );

        // 2. Update stock in medicine
        await db.query(
            "UPDATE medicines SET quantity = quantity + ? WHERE medicine_id = ?",
            [quantity, medicine_id]
        );

        // Send back the purchase_id (insertId) so the frontend can show the invoice
        res.json({ 
            message: "Purchase recorded and Quantity updated", 
            purchase_id: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Make Invoice
export const makeInvoice = async (req, res) => {
    const { purchase_id } = req.params;

    const query = `
    SELECT 
        p.purchase_id,
        p.date,
        s.supplier_id,
        s.name AS supplier_name,
        s.contact AS supplier_contact,
        s.address AS supplier_address,
        m.medicine_id,
        m.name AS medicine_name,
        m.batch_number,
        p.quantity,
        p.price
    FROM purchases p
    JOIN medicines m ON p.medicine_id = m.medicine_id
    JOIN suppliers s ON p.supplier_id = s.supplier_id
    WHERE p.purchase_id = ?`;

    try {
        const [result] = await db.query(query, [purchase_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Purchase not found" });
        }

        const supplierInfo = {
            supplier_id: result[0].supplier_id,
            name: result[0].supplier_name,
            contact: result[0].supplier_contact,
            address: result[0].supplier_address,
        };

        let grandTotal = 0;
        const items = result.map(row => {
            const total = row.quantity * row.price;
            grandTotal += total;
            return {
                medicine_name: row.medicine_name,
                quantity: row.quantity,
                unit_price: row.price,
                total: total
            };
        });

        res.json({
            invoice_id: result[0].purchase_id,
            date: result[0].date,
            supplier: supplierInfo,
            items: items,
            grand_total: grandTotal
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};