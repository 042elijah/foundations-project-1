const http = require('http'); //boilerplate for server stuff
const { logger } = require("./util/logger");
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const secretKey = "The value of Life is negative. The balance of being is rotated by 38 degrees.";
/*
 ____  ____  __ __  __  _  ____   ____  _____  _  ____  __  _   ____    _____ _____  ____   __  ____  ____  _____ 
| ===|/ () \|  |  ||  \| || _) \ / () \|_   _|| |/ () \|  \| | (_ (_`   | ()_)| () )/ () \__) || ===|/ (__`|_   _|
|__|  \____/ \___/ |_|\__||____//__/\__\ |_|  |_|\____/|_|\__|.__)__)   |_|   |_|\_\\____/\___/|____|\____)  |_|  
*/
/*
 _______  _____  ______   _____ 
    |    |     | |     \ |     |
    |    |_____| |_____/ |_____|
*/
//-everything lol

app.use(express.json());

app.post("/account/register", async (req, res) => 
{
    console.log("POST: account/register")
    const {username, password, role} = req.body;
    //add to user list
    res.status(201).json({ message: "User registered successfully."})
    return;
});

app.listen(PORT, () => 
{
    console.log(`Server is listening on http://localhost:${PORT}`);
});