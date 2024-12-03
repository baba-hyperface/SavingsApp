import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';
import {} from "dotenv/config";
import { faker } from '@faker-js/faker'; // For generating dummy data
import { pipeline } from 'stream/promises';

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
            const hashedPassword = await bcrypt.hash(password, 1);
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
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // true in production
                        sameSite: 'None',
                        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
                        path: '/',
                    });

                    res.cookie('role', role, {
                        httpOnly: true, // Accessible to JavaScript if needed
                        secure: process.env.NODE_ENV === 'production', // true in production
                        sameSite: 'None',
                        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
                        path: '/',
                    });

                    res.status(200).json({
                        message: 'Login successful',
                        userid: userExist._id,
                        accessToken,
                        role: userExist.role
                    });
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
 

 export const checklogin = (req, res) => {
    const token = req.cookies.accessToken; // Access the httpOnly cookie
    if (!token) {
        return res.status(401).json({ isAuthenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = decoded;

        res.json({
            isAuthenticated: true,
            user: decoded,
            role: role, // Send the role in the response
        });
    } catch (err) {
        res.status(401).json({ isAuthenticated: false });
    }
};

export const generateUsers = async (req, res) => {

    let accountNumber = 100000;
    try {
        const { count = 1000000 } = req.body; // Total number of users to create
        const batchSize = 10000; // Number of users per batch
        const hashedPassword = '$2a$10$eW5G8s9b4VhojYqNYy.FhOw8JZI4PYnAhLfW9fke69ZHy2lBOHQJK'; // Pre-hashed password

        console.time("User Generation and Insertion"); // Start timer

        // Helper functions to generate unique emails and account numbers
        const uniqueEmails = new Set();
        const uniqueAccountNumbers = new Set();

        // const generateUniqueEmail = () => {
        //     let email;
        //     do {
        //         email = faker.internet.email();
        //     } while (uniqueEmails.has(email));
        //     uniqueEmails.add(email);
        //     return email;
        // };
        const generateUniqueEmail = (index) => `user${index}@example.com`;

        

        // const generateUniqueAccountNumber = () => {
        //     let accountNumber;
        //     do {
        //         accountNumber = faker.number.int({ min: 100000, max: 999999 });
        //     } while (uniqueAccountNumbers.has(accountNumber));
        //     uniqueAccountNumbers.add(accountNumber);
        //     return accountNumber;
        // };
        const generateUniqueAccountNumber = () => accountNumber++;


        let totalInserted = 0; // Counter for successfully inserted users
        // Stream-based batch generation and insertion
        await pipeline(
            // Generate batches of users
            async function* generateUsers() {
                for (let i = 1; i < count; i += batchSize+1) {
                    const users = [];
                    for (let j = 1; j < Math.min(batchSize+1, count - i+1); j++) {
                        users.push({
                            name: faker.person.fullName(),
                            email: generateUniqueEmail(i+j),
                            password: hashedPassword,
                            accountNumber: generateUniqueAccountNumber(),
                            expDate: faker.date.future(),
                            totalBalance: faker.number.int({ min: 100, max: 100000 }),
                            pots: [],
                            history: [],
                            role: 'user',
                        });
                    }
                    yield users;
                }
            },
            // Insert each batch into the database
            async function* insertBatches(source) {
                for await (const batch of source) {
                    try {
                        const result = await User.collection.insertMany(batch, { ordered: false });
                        totalInserted += result.insertedCount;
                        console.log(`Inserted ${result.insertedCount} users`);
                    } catch (error) {
                        console.error("Batch insert error:", error.message);
                    }
                }
            }
        );

        console.timeEnd("User Generation and Insertion"); // End timer

        res.status(201).json({ message: `${totalInserted+10000} users created successfully` });
    } catch (err) {
        console.error("Error during user generation:", err);
        res.status(500).send({ message: 'Internal server error', error: err.message });
    }
};

export const deleteLastMillionUsers = async (req, res) => {
    try {
        // Fetch the last 1 million users based on their `_id` (newest first)
        const lastMillionUsers = await User.find()
            .sort({ _id: -1 }) // Sort by `_id` in descending order
            .limit(1000000)    // Limit to 1 million users
            .select('_id');    // Fetch only the `_id` field to reduce memory usage

        // Extract the IDs of these users
        const userIds = lastMillionUsers.map(user => user._id);

        // Delete all users whose `_id` is in the list
        const result = await User.deleteMany({ _id: { $in: userIds } });

        // Respond with the number of deleted users
        res.status(200).json({ message: `${result.deletedCount} users deleted successfully.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
