import db from "../config/db.js";
import bcrypt from "bcrypt";

// ==== USER MANAGEMENT =====//

// Add User
export const addUsers = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashpassword = await bcrypt.hash(password, 10);

        // Use await instead of callback
        await db.query(
            "INSERT INTO users (username, password, role) VALUES (?,?,?)",
            [username, hashpassword, role]
        );
        
        res.json({ message: "User added Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User
export const getUser = async (req, res) => {
    try {
        // Use [result] to get the rows array
        const [result] = await db.query("SELECT user_id, username, role FROM users");
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Role
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const [result] = await db.query(
            "UPDATE users SET role = ? WHERE user_id = ?",
            [role, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Role update Successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete User
export const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User Deleted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======= System Configuration =======

// Get settings
export const getSetting = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM settings");
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Settings
export const updateSettings = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        
        const [result] = await db.query(
            "UPDATE settings SET setting_value = ? WHERE setting_key = ?",
            [value, key]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Setting not found!" });
        }
        res.json({ message: "Setting updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};