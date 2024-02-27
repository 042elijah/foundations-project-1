//const { logger } = require("./util/logger");
const express = require('express');
const jwt = require('jsonwebtoken');

const accountFuncs = require("./accountFuncs");
const employeeFuncs = require("./employeeFuncs");
const managerFuncs = require("./managerFuncs");
const app = express();
const PORT = 3000;

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
//-implement JWT auth

app.use(express.json());


app.get("/", (req, res) => //======================DEFAULT
{
    res.send("Home page");
});


app.post("/account/register", async (req, res) =>  //======================REGISTER AN ACCOUNT
{
    console.log("POST: account/register");

    const {username, password, name, address, role} = req.body; //destruct the stuff we want from data. doesnt matter if there's extra nonsense in there.
    let data = await accountFuncs.registerAccount({username, password, name, address, role});

    if (!data.isValid)
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
    let data = await accountFuncs.logInToAccount({username, password});

    if (!data.isValid)
    {
        res.status(400).json({ message: "User login failed.", data });
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "User logged-in successfully.", token: data.token });
});


app.post("/account/ticket/submit", accountFuncs.authenticateToken, async (req, res) => //======================CREATE A TICKET
{
    console.log("POST: account/ticket/submit");

    const ticket = {...req.body, username: req.user.id};
    let data = await employeeFuncs.submitTicket( ticket );

    if (!data.isValid)
    {
        res.status(400).json({ message: "Ticket submission failed.", data });
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "Ticket submission success.", data });
});

app.listen(PORT, () => 
{
    console.log(`Server is listening on http://localhost:${PORT}`);
});