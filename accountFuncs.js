const { v4: uuidv4 } = require('uuid');
const accountDAO = require("./accountDAO");

const accountList = [];


//=======================================register a new account
function registerAccount (account) 
{
    //first check to see if account data is valid
    let accountIntegrity = verifyAccountToRegister(account); //verifyAccountToRegister returns metadata about the account data's validity/integrity
    if (accountIntegrity.integrity == false) return {account, accountIntegrity}; //something is wrong with the data, return message about bad integrity

    account.id = uuidv4();

    if (account.role !== "manager") account.role = "employee";

    accountList.push(account);

    accountDAO.registerAccount(account); //pass the account to the accountDAO, which will POST to the DynamoDB

    accountIntegrity.integrityMessage = "You're registered!"; //confirmation message

    return {account, accountIntegrity}; //account registered successfully
}


//=======================================login to an account
function logInToAccount (account) 
{
    //first check to see if account data is valid
    let accountIntegrity = verifyAccountToLogIn(account); //verifyAccountToLogIn returns metadata about the account data's validity/integrity
    if (accountIntegrity.integrity == false) return {account, accountIntegrity}; //something is wrong with the data, return message about bad integrity


     //TODO: later we're going to be adding some JWT token stuff here. not for now though


     accountIntegrity.integrityMessage = "You're logged in!" //confirmation message

    return {account, accountIntegrity}; //account registered successfully
}



//checks whether the paramd account is valid to add as a new user
function verifyAccountToRegister(account) //TODO: implement better checking. data validity and that kind of thinkg
{ 
    let accountIntegrity = {};

    if (!account.username || !account.password)
    {
        accountIntegrity.integrity = false;
        accountIntegrity.integrityMessage = "Missing username or password.";
    }
    else
    {
        let foundAccount = accountList.find((extantAccount) => extantAccount.username === account.username);

        if (!foundAccount)
        {
            accountIntegrity.integrity = false;
            accountIntegrity.integrityMessage = "Username taken!";
        }
        else accountIntegrity.integrity = true;
    }

    return accountIntegrity;
}

//checks whether the paramd account is valid to login to
function verifyAccountToLogIn(account) //TODO: implement better checking. data validity and that kind of thinkg
{ 
    let accountIntegrity = {}
    
    if (!account.username || !account.password) //check to see if account has username and password
    {
        accountIntegrity.integrity = false;
        accountIntegrity.integrityMessage = "Missing username or password.";
    }
    else //check to see if account exists in database
    {
        let foundAccount = accountList.find((extantAccount) => extantAccount.username === account.username); //look for our username in the accountlist. if we find it, save it as foundAccount
        
        if (!foundAccount)
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
    logInToAccount,
    getBigDude
};