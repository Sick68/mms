import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";

// Routes
import adminRoute from "./routes/adminRoute.js";
import authRoute from "./routes/authRoute.js";
import medicineRoute from "./routes/medicineRoute.js";
import supplierRoute from "./routes/supplierRoute.js";
import purchaseRoute from "./routes/purchaseRoute.js";
import salesRoute from "./routes/salesRoute.js";
import customerRoute from "./routes/cusomterRoute.js";
import reportRoute from "./routes/reportRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration - keep localhost for now, 
// but remember to add your Vercel frontend URL here later!
app.use(cors({
    origin: ["http://localhost:5173", "https://mms-xxge.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("MMS Cloud API Running...");
});

// Use Routes
app.use('/api', authRoute);
app.use("/api", medicineRoute);
app.use("/api", supplierRoute);
app.use("/api", purchaseRoute);
app.use("/api", customerRoute);
app.use("/api", salesRoute);
app.use("/api", adminRoute);
app.use("/api/report", reportRoute);

const PORT = process.env.PORT || 5000;

// Database Connection Test & Server Start
const startServer = async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ Successfully connected to Aiven MySQL Cloud!");
        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Cloud Database connection failed:", err.message);
        // We still start the server so Vercel doesn't think the build failed,
        // but the app will show errors on DB queries.
        app.listen(PORT); 
    }
};

startServer();




export default app; // CRITICAL: Export app, not db!