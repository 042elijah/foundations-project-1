//const { logger } = require("./util/logger");
const express = require('express');
const jwt = require('jsonwebtoken');

const accountFuncs = require("./account/accountFuncs");
const employeeFuncs = require("./employee/employeeFuncs");
const managerFuncs = require("./manager/managerFuncs");
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
//-implement jest testing for employeeFuncs.js
//-implement bcrypt on passwords
//-add functionality to tell whether use is manager or employee
//  -can probably add "role" to the jwt auth so we can just extract it
//  -or else we can add a func to account to GET a username and check their role that way
//-queryEmployees currently returns all data for all calls. should add seperate versions of this call that only return required data

app.use(express.json());


app.get("/", (req, res) => //======================DEFAULT
{
    res.send("Home page");
});


//============================================GENERAL ACCOUNT FUNCS
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



//==================================================================EMPLOYEE FUNCS
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

app.get("/account/ticket/list", accountFuncs.authenticateToken, async (req, res) => //======================CREATE A TICKET
{
    console.log("GET: account/ticket/list");

    let data = await employeeFuncs.viewTickets( req.user.id );

    if (!data)
    {
        res.status(400).json({ message: "Ticket get-all failed.", data });
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "Ticket get-all success.", data });
});



//==================================================================MANAGER FUNCS
//still need to implement check if the user is a manager. could do through middleware, or maybe add role to the jwt
app.get("/manager/ticket/list", accountFuncs.authenticateToken, async (req, res) => //======================GET ALL PENDING TICKETS
{
    console.log("GET: manager/ticket/list");

    let data = await managerFuncs.getAllPendingTickets();

    if (!data)
    {
        res.status(400).json({ message: "Ticket get-all failed.", data });
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "Ticket get-all success.", data });
});

app.put("/manager/ticket", accountFuncs.authenticateToken, async (req, res) => //======================UPDATE A TICKET
{
    console.log("PUT: manager/ticket");

    const ticket = {...req.body, manager_username: req.user.id}; //i think ticket will need: employee username, ticket id, isApproved, & manager_username (autopopped)

    let data = await managerFuncs.putTicketApproval(ticket);

    if (!data || !data.isValid)
    {
        res.status(400).json({ message: "Put ticket approval failed.", data });
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "Put ticket approval success.", data });
});




app.listen(PORT, () => 
{
    console.log(`Server is listening on http://localhost:${PORT}`);
});