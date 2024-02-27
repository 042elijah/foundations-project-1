const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const employeeDAO = require("./employeeDAO");

const date = new Date();

async function submitTicket (ticket) 
{
    let ticketIsValid = await verifyTicketToSubmit(ticket);
    if (!ticketIsValid.isValid ) return ticketIsValid;

    let cleanedTicket = cleanTicketToAdd(ticket);
    let putTicketData = employeeDAO.putTicket(cleanedTicket);

    return {...cleanedTicket, ...ticketIsValid, ...putTicketData};
}


function verifyTicketToSubmit (ticket)
{
    let ticketIsValid = {};

    if (!ticket)
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Empty ticket!";
    }
    else
    {
        ticketIsValid.isValid = true;
        ticketIsValid.message = "This is a valid ticket.";
    }

    return ticketIsValid;
}

function cleanTicketToAdd(ticket) 
{
    let cleanedTicket = { // is this kludge? idk.
        username: ticket.username,  //should be autopopped if we passed authentication
        amount: ticket.amount,      //must be number > 0    USER POP
        description: ticket.description,    //falsy is ok for this one  USER POP
        type: ticket.type,          //falsy is ok for this one  USER POP
        id: uuidv4(), 
        date: date.getTime()/1000,
        isApproved: false,
        isPending: true,
        role: "ticket",
        manager_username: null
    };

    return cleanedTicket; //we're implicitly removing unneeded data by not adding it to cleanedTicket
}


async function viewTickets ()
{

}


module.exports =
{
    submitTicket,
    viewTickets
};