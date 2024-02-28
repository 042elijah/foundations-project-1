const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const employeeDAO = require("./employeeDAO");

const date = new Date();


async function submitTicket (ticket) //===============================POST NEW TICKET
{
    let ticketIsValid = await verifyTicketToSubmit(ticket);
    if (!ticketIsValid.isValid ) return ticketIsValid; //bad ticket, return fail-state metadata

    let cleanedTicket = cleanTicketToAdd(ticket);
    let putTicketData = employeeDAO.putTicket(cleanedTicket);

    return {...cleanedTicket, ...ticketIsValid, ...putTicketData}; //just return everything, idc
}


function verifyTicketToSubmit (ticket)
{
    let ticketIsValid = {};

    if (!ticket)
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Empty ticket!";
    }
    else if (!ticket.amount || ticket.amount < 0)
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Invalid reimbursement amount!";
    }
    else if (!ticket.description)
    {
        ticketIsValid.isValid = false;
        ticketIsValid.message = "Empty description field!";
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
        description: ticket.description,    //cannot be falsy, already checked. USER POP
        type: ticket.type,          //falsy is ok for this one  USER POP
        id: uuidv4(), 
        date: date.getTime()/1000,
        isApproved: false,
        isPending: true,
        role: "ticket",
        manager_username: ""
    };

    return cleanedTicket; //we're implicitly removing unneeded data by not adding it to cleanedTicket
}


async function viewTickets (username) //===============================GET ALL TICKETS RELATED TO USER
{
    let ticketAr = await employeeDAO.queryTickets(username);

    return ticketAr;
}


module.exports =
{
    submitTicket,
    viewTickets
};