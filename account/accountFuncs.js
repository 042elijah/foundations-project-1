const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const accountDAO = require("./accountDAO");
const { secretKey } = require("../secretKey");

//=======================================REGISTER A NEW ACCOUNT
//=====================================================================================================================
async function registerAccount (account) 
{
    //first check to see if account data is valid
    let accountIsValid = await verifyAccountToRegister(account); //verifyAccountToRegister(account) will return metadata about the account's validity/integrity
    if (!accountIsValid.isValid ) return accountIsValid; //something is wrong with the data, return a message about bad integrity

    account = cleanAccountToRegister(account); //add id and role(if needed), and wash off unneeded params

    accountDAO.registerAccount(account); //pass the account to the accountDAO, which will POST to the DynamoDB

    accountIsValid.isValid  = true; //confirmation
    accountIsValid.message = "You're registered!"; //confirmation message

    return accountIsValid; //account registered successfully
}

//checks whether the paramd account is valid to add as a new user
//TESTED
async function verifyAccountToRegister(account) //TODO: implement better checking. data validity and that kind of thinkg
{ 
    let accountIsValid = {};

    if (!account.username || !account.password) //must have username and password, otherwise fail
    {
        accountIsValid.isValid  = false;
        accountIsValid.message = "Missing username or password.";
    }
    else
    {
        let foundAccount = await accountDAO.queryEmployee(account.username); //look for username in database

        if (foundAccount) //if we found an entry with that username, it's taken. fail.
        {
            accountIsValid.isValid = false;
            accountIsValid.message = "Username taken!";
        }
        else accountIsValid.isValid  = true;
    }

    return accountIsValid;
}


//takes an account and washes off extra data + adds needed data to be registered to the database
//expects the params that do exist and are needed to be valid. verifyAccountToRegister(account) handles that part.
//TESTED
function cleanAccountToRegister(account) 
{
    let cleanedAccount = {username: account.username, password: account.password};
    
    cleanedAccount.address = account.address; //this still works if these params arent there
    cleanedAccount.name = account.name;

    cleanedAccount.id = uuidv4(); 
    cleanedAccount.role = account.role === "manager" ? "manager" : "employee"; //add id and role to account

    return cleanedAccount; //we're implicitly removing unneeded data by not adding it to cleanedAccount
}



//=======================================LOGIN TO AN ACCOUNT
//=====================================================================================================================
async function logInToAccount (account) 
{
    //first check to see if account data is valid
    let accountIsValid = await verifyAccountToLogIn(account); //verifyAccountToLogIn returns metadata about the account data's validity/integrity
    if (accountIsValid.isValid == false) return accountIsValid; //something is wrong with the data, return message about bad integrity

    const token = jwt.sign(
        { id: account.username },
        secretKey,
        { expiresIn: "60m" }
    );

    accountIsValid.isValid = true; //confirmation
    accountIsValid.isValid = "You're logged in!" //confirmation message

    return {...accountIsValid , token}; //account registered successfully
}


//checks whether the paramd account is valid to login to
//TESTED
async function verifyAccountToLogIn(account) //TODO: implement better checking. data validity and that kind of thing
{ 
    let accountIsValid = {};
    
    if (!account.username || !account.password) //check to see if account has username and password
    {
        accountIsValid.isValid  = false;
        accountIsValid.message = "Missing username or password.";
    }
    else //check to see if account exists in database
    {
        let foundAccount = await accountDAO.queryEmployee(account.username); //look for our username in the database. if we find it, save it as foundAccount
        
        if (!foundAccount) //if foundAccount is empty, that account name doesnt exist in the db. fail.
        {
            accountIsValid.isValid = false;
            accountIsValid.message = "No such username registered.";
        } 
        else if (account.username !== foundAccount.username || account.password !== foundAccount.password) //if foundAccount is empty, that account name doesnt exist in the db. fail.
        {
            accountIsValid.isValid = false;
            accountIsValid.message = "Username and password don't match!";
        } 
        else 
        {
            accountIsValid.isValid = true; //passed all checks: account is good to add
            accountIsValid.message = "Username found.";
            console.log("-authed-");
        }
    }
    return accountIsValid;
}

//middleware
//compare request token to held token. returns tokenValidity object like {isValid: bool, validityMessage: string}
function authenticateToken(req, res, next) 
{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token)
    {
        res.status(401).json({ message: "Unauthorized Access", token });
        return;
    }

    jwt.verify(token, secretKey, (err, user) => {
        if(err)
        {
            res.status(403).json({ message: "Forbidden Access" });
            return;
        }
        req.user = user;
        next();
    });
}

module.exports =
{
    registerAccount,
    verifyAccountToRegister,
    cleanAccountToRegister,
    logInToAccount,
    verifyAccountToLogIn,
    authenticateToken
};