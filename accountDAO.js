const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({region: 'us-east-2'});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = 'foundations-project-1-database';


async function registerAccount (account) //=============================ADD NEW ACCOUNT
{
    const command = new PutCommand({
        TableName,
        Item: account
    });

    try
    {
        const data = await documentClient.send(command);
        return data;
    } 
    catch (err) 
    {
        console.error(`registerAccount(account) failed: ${err}`);
    }
    return null;
}

async function queryEmployee(username) //=============================RETRIEVE AN EMPLOYEE BY THEIR USERNAME
{
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: { "#username": "username", },
        ExpressionAttributeValues: { ":username": username },
    });

    try
    {
        const data = await documentClient.send(command);

        let foundAccount = data.Items.find((account) => account.role === "employee"); //this is bad code, this should be handled by a scan instead, or i should seperate employees and tickets into seperate tables

        return foundAccount;
    } 
    catch (err) 
    {
        console.error(`registerAccount(account) failed: ${err}`);
    }
    return null;
}


module.exports = 
{ 
    registerAccount, 
    queryEmployee 
};