const { v4: uuidv4 } = require('uuid');
//const jwt = require('jsonwebtoken');
const managerDAO = require("./managerDAO");

//const date = new Date();

async function getAllPendingTickets ()
{
    return await managerDAO.getAllPendingTickets();
}

async function putTicketApproval (ticket)
{
    let ticketIsValid = await verifyTicketForTicketApproval(ticket);
    if (!ticketIsValid.isValid) return ticketIsValid; //bad ticket, return metadata

    let cleanedTicket = cleanTicketForTicketApproval(ticket);

    let newTicket = await managerDAO.putTicketApproval(cleanedTicket); //for 
    
    return {...ticketIsValid, newTicket};
}

async function verifyTicketForTicketApproval (ticket)
{
    let ticketIsValid = {};
    let {username, id, isApproved} = ticket;

    if (!ticket)
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Empty ticket!";
    }
    else if (!username || !id)
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Empty username or ID!";
    }
    else if (typeof isApproved != "boolean")
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "isApproved not declared in your ticket!";
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

    if (ticketIsValid.isValid) return ticketIsValid; //if ticketIsValid was populated by the forEach, we found the ticket, so return.
    
    ticketIsValid.isValid = false;
    ticketIsValid.message = "Couldn't find that ticket in the database."; //otherwise, we didnt find the ticket in the db
    
    return ticketIsValid;
}

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

module.exports = 
{ 
    getAllPendingTickets,
    putTicketApproval
};