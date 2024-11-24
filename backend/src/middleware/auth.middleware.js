import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {

    let token = req.cookies.jwt;

    if (!token) {
        return res.status(500).json({ error: "Unauthorized - No token provided" });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(500).json({ error: "Unauthorized - User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: "Unauthorized - Invalid token" });
    }
};  
