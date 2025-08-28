import jwt from 'jsonwebtoken';


export const protect = (req, res, next) => {
const auth = req.headers.authorization;
if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
try {
const token = auth.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
req.user = decoded; // { id, role }
next();
} catch (e) {
return res.status(401).json({ message: 'Invalid token' });
}
};


export const requireRole = (...roles) => (req, res, next) => {
if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
next();
};