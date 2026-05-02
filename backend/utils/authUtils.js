import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { generateToken } from './tokenUtils.js';

export const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email }).select('+password');
    } catch (error) {
        console.error('Error en findUserByEmail:', error);
        return null;
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('Error en comparePassword:', error);
        return false;
    }
};

export const updateUserToken = async (userId, role) => {
    try {
        const token = generateToken(userId, role);
        await User.findByIdAndUpdate(userId, { token });
        return token;
    } catch (error) {
        console.error('Error en updateUserToken:', error);
        return null;
    }
};

export const clearUserToken = async (userId) => {
    try {
        await User.findByIdAndUpdate(userId, { token: null });
        return true;
    } catch (error) {
        console.error('Error en clearUserToken:', error);
        return false;
    }
};

export const getUserById = async (userId) => {
    try {
        return await User.findById(userId);
    } catch (error) {
        console.error('Error en getUserById:', error);
        return null;
    }
};

export const createUser = async (userData) => {
    try {
        const { email, password, name, role } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'DOWNLOADER'
        });
        
        return user;
    } catch (error) {
        console.error('Error en createUser:', error);
        return null;
    }
};

export const checkExistingUser = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        console.error('Error en checkExistingUser:', error);
        return null;
    }
};