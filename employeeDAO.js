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




module.exports = 
{ 
    putTicket
};