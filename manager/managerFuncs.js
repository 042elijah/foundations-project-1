const { v4: uuidv4 } = require('uuid');
const managerDAO = require("./managerDAO");

//simply get array of all pending tickets
async function getAllPendingTickets ()
{
    return await managerDAO.getAllPendingTickets();
}

//alter an extant ticket's isApproved value, and also flip its isPending to false
async function putTicketApproval (ticket)
{
    let ticketIsValid = await verifyTicketForTicketApproval(ticket);
    if (!ticketIsValid.isValid) return ticketIsValid; //bad ticket, return metadata

    let cleanedTicket = cleanTicketForTicketApproval(ticket);

    let newTicket = await managerDAO.putTicketApproval(cleanedTicket); //for 
    
    return {...ticketIsValid, newTicket};
}


//a ticket needs: username, id , isApproved, plus username and id need to match a ticket in the database that isPending
//TESTED
async function verifyTicketForTicketApproval (ticket)
{
    let ticketIsValid = {};
    let {username, id, isApproved} = ticket;

    if (!ticket)
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Empty ticket!";
        return ticketIsValid;
    }
    else if (!username || !id)  //we need both these vals
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Empty username or ID!";
        return ticketIsValid;
    }
    else if (typeof isApproved !== "boolean")   //is isApproved defined & a bool
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "isApproved not declared in your ticket!";
        return ticketIsValid;
    }

    let ticketAr = await managerDAO.getAllPendingTickets(); //here we check if the ticket is actually in the database
    ticketAr.forEach((pendingTicket) =>
    {
        if (pendingTicket.username === username && pendingTicket.id === id && pendingTicket.isPending)
        {
            ticketIsValid.isValid = true;
            ticketIsValid.message = "Valid ticket, good work!"; 
        }
    });

    if (ticketIsValid.isValid) 
    {
        return ticketIsValid; //if ticketIsValid was populated by the forEach, we found the ticket, so return.
    }
    else
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Couldn't find that ticket in the database."; //otherwise, we didnt find the ticket in the db
        return ticketIsValid;
    }
    
}


//take some raw data and make sure it conforms to the specific values we want in the database
function cleanTicketForTicketApproval(ticket)
{
    let cleanedTicket = { // is this kludge? idk.
        username: ticket.username,  //USER POP
        id: ticket.id,      //USER POP
        isApproved: ticket.isApproved,    //USER POP
        manager_username: ticket.manager_username //auto popped if we passed auth, which we must have
    };

    return cleanedTicket; //we're implicitly removing unneeded data by not adding it to cleanedTicket
}

//currently just a utility func for testing.
async function deleteTicket(ticket)
{
    return await managerDAO.deleteTicket(ticket);
}

module.exports = 
{ 
    getAllPendingTickets,
    putTicketApproval,
    verifyTicketForTicketApproval,
    cleanTicketForTicketApproval,
    deleteTicket
};