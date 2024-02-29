const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({region: 'us-east-2'});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = 'foundations-project-1-database';


async function getAllPendingTickets ()
{
    const command = new QueryCommand({  //returns all tickets. need to parse out nonpending ones locally.
        TableName,
        IndexName: "PendingRoleIndex",
        KeyConditionExpression: "#key = :value",
        ExpressionAttributeNames: { "#key": "role" },
        ExpressionAttributeValues: { ":value": 'ticket' } 
    });
    //jesus f christ why is this syntax such a pain

    try
    {
        const data = await documentClient.send(command);

        let ticketsAr = [];
        for (let i = 0; i < data.Items.length; i++)
            if(data.Items[i].isPending)
                ticketsAr.push({ ...(data.Items[i]) }); //here, im trying to shallow copy the Item. Don't know if this is needed or if it works.

        return ticketsAr;
    } 
    catch (err) 
    {
        console.error(`getAllPendingTickets() failed: ${err}`);
    }
    return null;
}


async function putTicketApproval (ticket) //=============================ADD NEW ACCOUNT
{
    const command = new UpdateCommand({
        TableName,
        Key: {
            username: ticket.username,
            id: ticket.id
        },
        UpdateExpression: "SET isPending=:value1, isApproved=:value2, manager_username=:value3",
        ExpressionAttributeValues: {
            ":value1": false,
            ":value2": ticket.isApproved,
            ":value3": ticket.manager_username
        },
        ReturnValues: "ALL_NEW"
    });

    try
    {
        const data = await documentClient.send(command);
        return data;
    } 
    catch (err) 
    {
        console.error(`putTicketApproval () failed: ${err}`);
    }
    return null;
}

async function deleteTicket(ticket)
{
    const command = new DeleteCommand({
        TableName,
        Key: {
          username: ticket.username,
          id: ticket.id
        },
      });
    
      const data = await documentClient.send(command);
      return data;
}


module.exports = 
{ 
    getAllPendingTickets,
    putTicketApproval,
    deleteTicket
};