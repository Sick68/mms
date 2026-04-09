import db from "../config/db.js"

export const dailySalesReport = async (req, res) => {
    // Uses the provided date or defaults to today's date
    const date = req.query.date || new Date().toISOString().split('T')[0]; 

    try {
        const [result] = await db.query(
            `SELECT 
                s.sale_id, 
                s.date, 
                COALESCE(c.customer_name, s.customer_name, 'Walk-in') AS customer_name, 
                m.name AS medicine_name, 
                s.quantity, 
                s.finalTotal
             FROM sales s 
             LEFT JOIN customers c ON s.customer_id = c.customer_id
             JOIN medicines m ON s.medicine_id = m.medicine_id
             WHERE DATE(s.date) = ?`,
             [date]
        );
        res.json(result);
    } catch (err) {
        console.error("Daily Report Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const monthlySalesReport = async (req, res) => {
    const month = req.query.month || new Date().getMonth() + 1;
    const year = req.query.year || new Date().getFullYear();

    try {
        const [result] = await db.query(
            `SELECT s.sale_id, s.date, c.customer_name, m.name AS medicine_name, s.quantity, s.finalTotal
             FROM sales s
             JOIN customers c ON s.customer_id = c.customer_id
             JOIN medicines m ON s.medicine_id = m.medicine_id
             WHERE MONTH(s.date) = ? AND YEAR(s.date) = ?`,
            [month, year]
        );
        res.json(result);
    } catch (err) {
        console.error("Monthly Report Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const stockReport = async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT m.medicine_id, m.name, m.quantity, m.price
             FROM medicines m`
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const expiryReport = async (req, res) => {
    const threshold = 30;
    try {
        const [result] = await db.query(
            `SELECT medicine_id, name, expiry_date
             FROM medicines
             WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)`,
            [threshold]
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}