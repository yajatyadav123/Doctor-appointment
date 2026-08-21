import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {

        console.log("HEADERS:", req.headers);

        const { token } = req.headers;

        if (!token) {
            return res.json({
                success: false,
                message: "Not authorized. Login Again"
            });
        }

        console.log("TOKEN RECEIVED:", token);

        const token_decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED TOKEN:", token_decode);

        req.userId = token_decode.id;

        next();

    } catch (error) {

        console.log("AUTH ERROR:", error);

        return res.json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authUser;