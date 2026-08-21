import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
    try {

        const { atoken } = req.headers;

        console.log("========== ADMIN AUTH ==========");
        console.log("Token received:", atoken ? "YES" : "NO");

        if (!atoken) {
            return res.json({
                success: false,
                message: "NO TOKEN RECEIVED"
            });
        }

        const decoded = jwt.verify(
            atoken,
            process.env.JWT_SECRET
        );

        console.log("Decoded token:", decoded);

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.json({
                success: false,
                message: "INVALID ADMIN EMAIL IN TOKEN"
            });
        }

        console.log("ADMIN AUTH SUCCESS");

        next();

    } catch (error) {

        console.log("JWT ERROR:", error.message);

        return res.json({
            success: false,
            message: "JWT ERROR: " + error.message
        });
    }
};

export default authAdmin;