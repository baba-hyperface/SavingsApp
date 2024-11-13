import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id,role:user.role, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );  
};

export const register = async (req, res) => {
    try {
        const { name, email, password, accountNumber, expDate,role } = req.body;
        console.log("registration password", password);
        
        if (!name || !email || !password || !accountNumber || !expDate) {
            return res.status(400).send({message:'Invalid request data'});
        }

        const userExist = await User.findOne({ email });
        console.log(userExist);
        if (!userExist) {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("register hash", hashedPassword);
            const newuser={name,email,password:hashedPassword,accountNumber,expDate,totalBalance:0,pots:[],history:[]};
            if(role){
                newuser.role=role;
            }
            const data = new User( newuser );
            
            console.log("Data check",data);
            await data.save();
            
            res.status(201).json({ message: "Register successful", data });
        } else {
            res.status(400).send({message:'User already exists, try to login'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({message:"Internal server error"});
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(password,email);

        if (!email || !password) {
            return res.status(400).send("Email and password required");
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            try {

                const passCheck = await bcrypt.compare(password , userExist.password);

                if (passCheck) {
                    const accessToken = generateToken(userExist);

                    const role=userExist.role;
                    await userExist.save();

                    res.cookie('accessToken', accessToken, {
                        httpOnly: true, // Ensures cookie is not accessible via JavaScript
                        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
                        sameSite: 'strict', // Prevents cookie from being sent in cross-origin requests
                        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 12 hours
                    });
                    
                    res.cookie('role', role, {
                        httpOnly: false, // Allows JavaScript to access this cookie if needed
                        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
                        sameSite: 'strict', // Prevents cookie from being sent in cross-origin requests
                        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30days
                    });
                    
                    res.status(200).json({ message: 'Login successful',userid:userExist._id, accessToken });
                } else {
                    console.log("incorrect password");
                    res.status(400).send({message:"Incorrect password check"});
                }
            } catch (err) {
                console.log(err);
                res.send({message:"password comparing failed"});
            }
        } else {
            console.log("user does not exist");
            res.status(400).send('User does not exist, try to register');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};


export const logout = (req, res) => {
    
    res.clearCookie('accessToken', {
        httpOnly: true,  // Ensures cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'strict', // Cookie is sent only from the same domain
        path: '/', // Path where the cookie is set (root of the domain)
    });
 
    res.status(200).send("Logged out successfully");
 };
 