import db from "../config/db.js";

export const getMedicines = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM medicines");
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addMedicines = async (req, res) => {
    const { name, category, batch_number, price, quantity, expiry_date } = req.body;
    try {
        await db.query(
            "INSERT INTO medicines(name, category, batch_number, price, quantity, expiry_date) VALUES (?, ?, ?, ?, ?, ?)",
            [name, category, batch_number, price, quantity, expiry_date]
        );
        res.json({ message: "Medicine added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateMedicines = async (req, res) => {
    const { medicine_id } = req.params;
    const { category, batch_number, price, quantity, expiry_date } = req.body;
    try {
        const [result] = await db.query(
            "UPDATE medicines SET category=?, batch_number=?, price=?, quantity=?, expiry_date=? WHERE medicine_id=?",
            [category, batch_number, price, quantity, expiry_date, medicine_id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Not found" });
        res.json({ message: "Updated Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteMedicines = async (req, res) => {
    const { medicine_id } = req.params;
    try {
        const [result] = await db.query(
            "DELETE FROM medicines WHERE medicine_id = ?",
            [medicine_id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Not found" });

        res.json({ message: "Medicine Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getLowQuantityMedicines = async (req, res) => {
    try {
        // Step 1: Get threshold from settings
        const [settingResult] = await db.query(
            "SELECT setting_value FROM settings WHERE setting_key = 'low_stock_threshold'"
        );

        if (!settingResult[0]) 
            return res.status(404).json({ message: "low_stock setting not found" });

        const threshold = parseInt(settingResult[0].setting_value);

        // Step 2: Get medicines below threshold
        const [medicines] = await db.query(
            "SELECT * FROM medicines WHERE quantity < ?",
            [threshold]
        );
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getNearExpiryMedicines = async (req, res) => {
    try {
        const [result] = await db.query(
            "SELECT * FROM medicines WHERE expiry_date <= CURDATE() + INTERVAL 30 DAY"
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};