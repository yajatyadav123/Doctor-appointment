import jwt from 'jsonwebtoken';

const authdoctor = async (req, res, next) => {
    try {

        console.log("========== AUTH DOCTOR ==========");

        console.log("HEADERS:", req.headers);

        const { dtoken } = req.headers;

        if (!dtoken) {
            console.log("NO TOKEN RECEIVED");

            return res.json({
                success: false,
                message: "Not authorized. Login Again"
            });
        }

        console.log("TOKEN RECEIVED:", dtoken);

        const token_decode = jwt.verify(
            dtoken,
            process.env.JWT_SECRET
        );

        console.log("DECODED TOKEN:", token_decode);

        req.doctorId = token_decode.id;

        console.log("DOCTOR ID:", req.doctorId);

        next();

    } catch (error) {

        console.log("AUTH ERROR:", error.message);

        return res.json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authdoctor;