const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({region: 'us-east-2'});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = 'foundations-project-1-database';


async function putTicket (ticket) //=============================ADD NEW TICKET
{
    const command = new PutCommand({
        TableName,
        Item: ticket
    });

    try
    {
        const data = await documentClient.send(command);
        return data;
    } 
    catch (err) 
    {
        console.error(`putTicket(ticket) failed: ${err}`);
    }
    return null;
}

async function queryTickets (username) //=============================RETRIEVE ALL TICKETS BY EMPLOYEE'S USERNAME
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

        let ticketsAr = [];
        for (let i = 0; i < data.Items.length; i++)
            if(data.Items[i].role === "ticket")
                ticketsAr.push({ ...(data.Items[i]) }); //here, im trying to shallow copy the Item. Don't know if this is needed or if it works.

        return ticketsAr;
    } 
    catch (err) 
    {
        console.error(`queryTickets(username) failed: ${err}`);
    }
    return null;
}


module.exports = 
{ 
    putTicket,
    queryTickets
};