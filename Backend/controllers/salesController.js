import db from "../config/db.js";

export const addSales = async (req, res) => {
    const { customer_id, customer_name, medicine_id, quantity } = req.body;

    try {
        // 1. Fetch medicine details (Price and Stock)
        const [medResult] = await db.query(
            "SELECT quantity, price, name FROM medicines WHERE medicine_id = ?",
            [medicine_id]
        );

        if (medResult.length === 0) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        const medicine = medResult[0];
        if (medicine.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // 2. Fetch ALL Settings
        const [settingsResult] = await db.query("SELECT * FROM settings");
        
        const settings = {};
        settingsResult.forEach(s => { 
            settings[s.setting_key] = parseFloat(s.setting_value); 
        });

        // Calculations
        const subtotal = medicine.price * quantity;
        const taxAmount = (subtotal * (settings.tax_percentage || 0)) / 100;

        let discountAmount = 0;
        if (subtotal >= (settings.minimum_threshold_amount || 0)) {
            discountAmount = (subtotal * (settings.discount_percentage || 0)) / 100;
        }

        const finalTotal = (subtotal + taxAmount) - discountAmount;

        // 3. Identify Customer Name
        let finalCustomerName = customer_name || "Walk-in";
        if (customer_id) {
            const [custResult] = await db.query(
                "SELECT customer_name FROM customers WHERE customer_id = ?", 
                [customer_id]
            );
            if (custResult.length > 0) {
                finalCustomerName = custResult[0].customer_name;
            }
        }

        // 4. Handle Database Insertion
        const [insertResult] = await db.query(
            "INSERT INTO sales (customer_id, customer_name, medicine_id, quantity, finalTotal) VALUES (?, ?, ?, ?, ?)",
            [customer_id || null, finalCustomerName, medicine_id, quantity, finalTotal]
        );

        // 5. Deduct Stock
        await db.query(
            "UPDATE medicines SET quantity = quantity - ? WHERE medicine_id = ?",
            [quantity, medicine_id]
        );

        // 6. Send Response
        res.json({
            message: "Sale completed Successfully",
            sale_id: insertResult.insertId,
            customer_name: finalCustomerName,
            medicine: {
                name: medicine.name,
                quantity,
                price: medicine.price,
                subtotal: subtotal
            },
            tax_percent: settings.tax_percentage,
            discount_amount: discountAmount,
            finalTotal: finalTotal,
            date: new Date()
        });

    } catch (err) {
        console.error("Sales Error:", err);
        res.status(500).json({ error: err.message });
    }
};