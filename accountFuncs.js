const { v4: uuidv4 } = require('uuid');
const accountDAO = require("./accountDAO");

const accountList = [];


//=======================================REGISTER A NEW ACCOUNT
//=====================================================================================================================
async function registerAccount (account) 
{
    //first check to see if account data is valid
    let accountIntegrity = await verifyAccountToRegister(account); //verifyAccountToRegister(account) will return metadata about the account's validity/integrity
    if (accountIntegrity.integrity == false) return {account, accountIntegrity}; //something is wrong with the data, return a message about bad integrity

    account = cleanAccountToRegister(account); //add id and role(if needed), and wash off unneeded params

    accountDAO.registerAccount(account); //pass the account to the accountDAO, which will POST to the DynamoDB

    accountIntegrity.integrity = true; //confirmation
    accountIntegrity.integrityMessage = "You're registered!"; //confirmation message

    return {account, accountIntegrity}; //account registered successfully
}

//checks whether the paramd account is valid to add as a new user
async function verifyAccountToRegister(account) //TODO: implement better checking. data validity and that kind of thinkg
{ 
    let accountIntegrity = {};

    if (!account.username || !account.password) //must have username and password, otherwise fail
    {
        accountIntegrity.integrity = false;
        accountIntegrity.integrityMessage = "Missing username or password.";
    }
    else
    {
        let foundAccount = await accountDAO.queryEmployee(account.username); //look for username in database

        if (foundAccount) //if we found an entry with that username, it's taken. fail.
        {
            accountIntegrity.integrity = false;
            accountIntegrity.integrityMessage = "Username taken!";
        }
        else accountIntegrity.integrity = true;
    }

    return accountIntegrity;
}

//takes an account and washes off extra data + adds needed data to be registered to the database
//expects the params that do exist and are needed to be valid. verifyAccountToRegister(account) handles that part.
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
    let accountIntegrity = await verifyAccountToLogIn(account); //verifyAccountToLogIn returns metadata about the account data's validity/integrity
    if (accountIntegrity.integrity == false) return {account, accountIntegrity}; //something is wrong with the data, return message about bad integrity

     //TODO: later we're going to be adding some JWT token stuff here. not for now though

    accountIntegrity.integrity = true; //confirmation
    accountIntegrity.integrityMessage = "You're logged in!" //confirmation message

    return {account, accountIntegrity}; //account registered successfully
}

//checks whether the paramd account is valid to login to
async function verifyAccountToLogIn(account) //TODO: implement better checking. data validity and that kind of thinkg
{ 
    let accountIntegrity = {}
    
    if (!account.username || !account.password) //check to see if account has username and password
    {
        accountIntegrity.integrity = false;
        accountIntegrity.integrityMessage = "Missing username or password.";
    }
    else //check to see if account exists in database
    {
        let foundAccount = await accountDAO.queryEmployee(account.username); //look for our username in the database. if we find it, save it as foundAccount
        
        if (!foundAccount) //if foundAccount is empty, that account name doesnt exist in the db. fail.
        {
            accountIntegrity.integrity = false;
            accountIntegrity.integrityMessage = "No such username registered.";
        } 

        else accountIntegrity.integrity = true; //passed all checks: account is good to add
    }
    return accountIntegrity;
}


async function getBigDude()
{
    let data = await accountDAO.queryEmployee("bigdude1000");
    console.log(data);
    return data;
}

module.exports =
{
    registerAccount,
    verifyAccountToRegister,
    cleanAccountToRegister,
    logInToAccount,
    verifyAccountToLogIn,
    getBigDude
};