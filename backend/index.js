import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import verifyOtp from "./routes/verifyOtp.route.js";
import { nullByteCheck } from "./middlewares/nullByteDetection.js";
import xmlparser from "express-xml-bodyparser";
import { handleXmlParsingErrors } from "./middlewares/xxeDetection.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
}));              // Secure headers
app.use(bodyParser.json());     // JSON body parser
app.use(xmlparser({
    explicitArray: false,
    normalizeTags: true,
    trim: true,
    xmlParseOptions: {
        disallowEntities: true, // Explicitly disable entities
        rejectUnauthorized: true
    }
}));
app.use(nullByteCheck);       // Null byte detection
// Middleware to handle JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Invalid JSON format." });
    }
    next(err);
});

// Middleware to handle XML parsing errors
app.use(handleXmlParsingErrors)

// Rate limiter - max 5 OTP verifications per minute per IP
const limiter = rateLimit({
    windowMs: 5 * 1000,
    max: 5,
    message: { error: "Too many requests, try again later." },
});

// Apply rate limiting to all routes
// app.use(limiter);  

// Apply rate limiting to particular route
app.use('/verify-otp', limiter, verifyOtp);
app.get('/hello', (req, res) => {
    return res.status(200).json({ message: "Welcome to the OTP verification API" });
})


// Fallback 404
app.use((req, res) => {
    return res.status(404).json({ error: "Not Found" });
});

// Start server
app.listen(port, () => {
    console.log(`OTP API running on port ${port}`);
});

export default app;