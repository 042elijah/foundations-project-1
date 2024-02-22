const { v4: uuidv4 } = require('uuid');

const accountList = [];

function registerAccount (account) 
{
    //first check to see if account data is valid
    let {integrity, integrityMessage} = verifyAccountToRegister(account); //verifyAccountToRegister returns metadata about the account data's validity/integrity
    if (integrity == false)  
        return {integrity, integrityMessage}; //something is wrong with the data, return message about bad integrity

    account.id = uuidv4();
    if (account.role !== "manager")
        account.role = "employee";

    accountList.push(account);

    account.integrity = true;

    return account; //account registered successfully
}

function logInToAccount (account) 
{
    //first check to see if account data is valid
    let {integrity, integrityMessage} = verifyAccountToLogIn(account); //verifyAccountToLogIn returns metadata about the account data's validity/integrity
    if (integrity == false) 
        return {integrity, integrityMessage}; //something is wrong with the data, return message about bad integrity

     //TODO: later we're going to be adding some session stuff here. not for now though

    account.integrity = true;
    account.integrityMessage = "You're logged in!"

    return account;
}



function verifyAccountToRegister(account) //TODO: implement better checking. data validity and that kind of thinkg
{ 
    if (!account.username || !account.password)
    {
        account.integrity = false;
        account.integrityMessage = "Missing username or password."
    }
    else account.integrity = true;

    return account;
}

function verifyAccountToLogIn(account) //TODO: implement better checking. data validity and that kind of thinkg
{ 
    if (!account.username || !account.password) //check to see if account has username and password
    {
        account.integrity = false;
        account.integrityMessage = "Missing username or password."
    }
    else //check to see if account exists in database
    {
        console.log("2");
        let foundAccount = accountList.find((extantAccount) => extantAccount.username === account.username); //look for our username in the accountlist. if we find it, save it as foundAccount
        console.log("2.5");
        if (typeof foundAccount === 'undefined')
        {
            account.integrity = false;
            account.integrityMessage = "No such username registered."
        } 
        else account.integrity = true;
    }
    console.log("3");
    return account;
}

module.exports ={
    registerAccount,
    logInToAccount
};