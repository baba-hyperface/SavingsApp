import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
    );  
};

export const register = async (req, res) => {
    try {
        const { name, email, password, accountNumber, expDate } = req.body;
        console.log("registration password", password);

        if (!name || !email || !password || !accountNumber || !expDate) {
            return res.status(400).send('Invalid request data');
        }

        const userExist = await User.findOne({ email });
        console.log(userExist);
        if (!userExist) {
            const hashedPassword = await bcrypt.hash(password, 10); 
            console.log("register hash", hashedPassword);

            const data = new User({ name, email, password: hashedPassword,accountNumber,expDate,totalBalance:0,pots:[],history:[] });
            
            console.log("Data check",data);
            await data.save();
            
            res.status(201).json({ message: "Register successful", data });
        } else {
            res.status(400).send({message:'User already exists, try to login'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
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
                    await userExist.save();

                    console.log("loginsuccesss");
                    res.status(200).json({ message: 'Login successful',userid:userExist._id, accessToken });
                } else {
                    console.log("incorrect password");
                    res.status(400).send("Incorrect password");
                }
            } catch (err) {
                console.log(err);
                res.send("password comparing failed");
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
