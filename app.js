const { logger } = require("./util/logger");
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

-queryEmployees currently returns all data for all calls. should add seperate versions of this call that only return required data
-broadly implement stronger type checking
*/

app.use(express.json());


app.get("/", (req, res) => //======================DEFAULT
{
    res.send("Home page");
});


//============================================GENERAL ACCOUNT FUNCS
app.post("/account/register", async (req, res) =>  //======================REGISTER AN ACCOUNT
{
    logger.info("POST: account/register");

    const {username, password, name, address, role} = req.body; //destruct the stuff we want from data. doesnt matter if there's extra nonsense in there.
    let data = await accountFuncs.registerAccount({username, password, name, address, role});

    if (!data.isValid)
    {
        logger.warn(`   
            POST failed: ${data.message}`);
        res.status(400).json({ message: "User registration failed.", data});
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "User registered successfully.", data});
});


app.post("/account/login", async (req, res) => //======================LOGIN TO AN ACCOUNT
{
    logger.info("POST: account/login");

    const {username, password} = req.body;
    let data = await accountFuncs.logInToAccount({username, password});

    if (!data.isValid)
    {
        logger.warn(`u:${username}:   
            POST failed: ${data.message}`);
        res.status(400).json({ message: "User login failed.", data });
        return; //this is needed to not crash the run
    }

    res.status(200).json({ message: "User logged-in successfully.", token: data.token });
});



//==================================================================EMPLOYEE FUNCS
app.post("/account/ticket/submit", accountFuncs.authenticateToken, async (req, res) => //======================CREATE A TICKET
{
    logger.info("POST: account/ticket/submit");

    const ticket = {...req.body, username: req.user.username};
    let data = await employeeFuncs.submitTicket( ticket );

    if (!data.isValid)
    {
        logger.warn(`u:${req.user.username}:   
            POST failed: ${data.message}`);
        res.status(400).json({ message: "Ticket submission failed.", data });
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "Ticket submission success.", data });
});

app.get("/account/ticket/list", accountFuncs.authenticateToken, async (req, res) => //======================GET ALL TICKETS ASSOC W THIS ACCOUNT
{
    logger.info("GET: account/ticket/list");

    let data = await employeeFuncs.viewTickets( req.user.username );

    if (!data)
    {
        logger.warn(`u:${req.user.username}:   
            GET failed: no content gotten!`);
        res.status(400).json({ message: "Ticket get-all failed."});
        return; //this is needed to not crash the run
    }

    res.status(200).json({ message: "Ticket get-all success.", data });
});



//==================================================================MANAGER FUNCS
app.get("/manager/ticket/list", accountFuncs.authenticateToken, async (req, res) => //======================GET ALL PENDING TICKETS
{
    logger.info("GET: manager/ticket/list");

    if (req.user.role !== "manager")
    {
        logger.warn(`u:${req.user.username}:   
            GET failed, user not a manager!`);
        res.status(400).json({ message: "You're not a manager!" });
        return; //this is needed to not crash the run
    }

    let data = await managerFuncs.getAllPendingTickets();

    if (!data)
    {
        logger.warn(`   
            GET failed: no content gotten!`);
        res.status(400).json({ message: "Ticket get-all failed."});
        return; //this is needed to not crash the run
    }

    res.status(200).json({ message: "Ticket get-all success.", data });
});

app.put("/manager/ticket", accountFuncs.authenticateToken, async (req, res) => //======================UPDATE A TICKET
{
    logger.info("PUT: manager/ticket");

    if (req.user.role !== "manager")
    {
        logger.warn(`u:${req.user.username}:   
            PUT failed, user not a manager!`);
        res.status(403).json({ message: "You're not a manager!" });
        return; //this is needed to not crash the run
    }

    const ticket = {...req.body, manager_username: req.user.username}; //ticket will need: employee username, ticket id, isApproved, & manager_username (autopopped)

    let data = await managerFuncs.putTicketApproval(ticket);

    if (!data || !data.isValid)
    {
        logger.warn(`u:${req.user.username}:   
            PUT failed: ${data.message}`);
        res.status(400).json({ message: "Put ticket approval failed.", data });
        return; //this is needed to not crash the run
    }

    res.status(201).json({ message: "Put ticket approval success.", data });
});




app.listen(PORT, () => 
{
    console.log(`Server is listening on http://localhost:${PORT}`);
});