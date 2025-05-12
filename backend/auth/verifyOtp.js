import redisClient from "../connections/db/redisClient.js";


function verifyOTP() { }

verifyOTP.prototype.validateOTP = async function (req, res) {
    const { mobile, otp } = req.body;
    //create redis key
    const redisKey = `otp_attamps_${mobile}`;

    //check if redis key exists
    const redisKeyExists = await redisClient.exists(redisKey);
    if (!redisKeyExists) {
        //if redis key does not exist, set it to 1 and expire in 60 seconds
        await redisClient.set(redisKey, 1, { EX: 60 });
    }
    //get the number of attempts
    const attempts = await redisClient.get(redisKey);
    console.log('attempts',attempts)
    //if attempts are greater than 3, return error
    if (attempts > 3) {
        return res.status(429).json({ errors: "Too many attempts, please try again after 60 seconds." });
    }

    //check if otp is valid
    if (/^1\d{3}$/.test(otp) && otp === "1234") { // Replace "1234" with your actual OTP validation logic
        //if otp is valid, delete redis key
        redisClient.del(redisKey);
        return res.json({ message: "OTP verified successfully!" });
    } else {
        //if otp is invalid, increment redis key
        redisClient.incr(redisKey);
        return res.status(400).json({ errors: "Invalid OTP" });
    }
}

export default verifyOTP;