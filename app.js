//const { logger } = require("./util/logger");
const express = require('express');
const jwt = require('jsonwebtoken');

const accountFuncs = require("./accountFuncs");
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


app.get("/", (req, res) => //======================DEFAULT
{
    res.send("Home page");
});


app.post("/account/register", async (req, res) =>  //======================REGISTER AN ACCOUNT
{
    console.log("POST: account/register");

    const {username, password, name, address, role} = req.body; //destruct the stuff we want from data. doesnt matter if there's extra nonsense in there.
    let data = accountFuncs.registerAccount({username, password, name, address, role});

    if (data.accountIntegrity.integrity == false)
    {
        res.status(400).json({ message: "User registration failed.", data});
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "User registered successfully.", data});
});


app.post("/account/login", async (req, res) => //======================LOGIN TO AN ACCOUNT
{
    console.log("POST: account/login");

    const {username, password} = req.body;
    let data = accountFuncs.logInToAccount({username, password});

    if (data.accountIntegrity.integrity == false)
    {
        res.status(400).json({ message: "User login failed.", data});
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "User logged-in successfully.", data});
});

app.post("/bigdude", async (req, res) => //======================TEST: GET BIG DUDE 1000
{
    console.log("GET: BIG DUDE");

    let data = await accountFuncs.getBigDude();

    if (!data)
    {
        res.status(400).json({ message: "GET failed.", data});
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "WE GOT BIG DUDE!", data});
});


app.listen(PORT, () => 
{
    console.log(`Server is listening on http://localhost:${PORT}`);
});