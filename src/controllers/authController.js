import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefresh } from '../utils/jwt.js';


const cookieOpts = {
httpOnly: true,
sameSite: 'lax',
secure: process.env.COOKIE_SECURE === 'true',
path: '/api/auth/refresh'
};


export const register = async (req, res) => {
const { name, email, password } = req.body;
const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ message: 'Email already registered' });
const user = await User.create({ name, email, password });
const access = signAccessToken({ id: user._id, role: user.role });
const refresh = signRefreshToken({ id: user._id, role: user.role });
res.cookie('rtk', refresh, cookieOpts);
res.status(201).json({
user: { id: user._id, name: user.name, email: user.email, role: user.role },
accessToken: access
});
};


export const login = async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await user.matchPassword(password);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
const access = signAccessToken({ id: user._id, role: user.role });
const refresh = signRefreshToken({ id: user._id, role: user.role });
res.cookie('rtk', refresh, cookieOpts);
res.json({
user: { id: user._id, name: user.name, email: user.email, role: user.role },
accessToken: access
});
};


export const refresh = async (req, res) => {
const token = req.cookies?.rtk;
if (!token) return res.status(401).json({ message: 'No refresh token' });
try {
const decoded = verifyRefresh(token);
const access = signAccessToken({ id: decoded.id, role: decoded.role });
return res.json({ accessToken: access });
} catch (e) {
return res.status(401).json({ message: 'Invalid refresh token' });
}
};


export const logout = async (req, res) => {
res.clearCookie('rtk', { ...cookieOpts, maxAge: 0 });
res.json({ ok: true });
};