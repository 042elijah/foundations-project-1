const employeeFuncs = require("../employee/employeeFuncs");

//verifyTicketToSubmit (ticket)
describe("employeeFuncs.verifyTicketToSubmit (ticket) testing", () => 
{
    //======================================================================VALID
    test("Valid ticket should return true", () => 
    {
        let result = employeeFuncs.verifyTicketToSubmit({ 
            username: "a", amount: 1,
            description: "b", type: "c"
         });
        
        expect(result.isValid).toBe(true);
    });

    test("Ticket should still be valid w/out type param and with undefined type param ", async () => 
    {
        let result = employeeFuncs.verifyTicketToSubmit({ 
            username: "a", amount: 1,
            description: "b"
        });
        
        expect(result.isValid).toBe(true);

        result = employeeFuncs.verifyTicketToSubmit({ 
            username: "a", amount: 1,
            description: "b", type: undefined
        });
         
        expect(result.isValid).toBe(true);
    });
    test("Valid ticket with extra junk data should still return true", () => 
    {
        let result = employeeFuncs.verifyTicketToSubmit({ 
            username: "a", amount: 1,
            description: "b", type: "c",
            big: true, street: "main"
         });
        
        expect(result.isValid).toBe(true);
    });

    //======================================================================INVALID
    test("Empty ticket should return false", () => 
    {
        let result = employeeFuncs.verifyTicketToSubmit({ });
        
        expect(result.isValid).toBe(false);
    });

    test("Ticket with missing username or description should return false", () => 
    {
        let result = employeeFuncs.verifyTicketToSubmit({ 
            amount: 1,
            description: "b", type: "c"
        });
        
        expect(result.isValid).toBe(false);

        result = employeeFuncs.verifyTicketToSubmit({ 
            username: "a", amount: 1,
            type: "c"
        });
        
        expect(result.isValid).toBe(false);
    });
    
    test("Ticket with non-number amount or no amount should return false", () => 
    {
        let result = employeeFuncs.verifyTicketToSubmit({ 
            username: "a", amount: "1",
            description: "b", type: "c"
         });

         expect(result.isValid).toBe(false);

         result = employeeFuncs.verifyTicketToSubmit({ 
            username: "a",
            description: "b", type: "c"
         });

         expect(result.isValid).toBe(false);
    });
});

//cleanTicketToAdd(ticket) 
//does no input verif. its all done in verifyTicketToSubmit
describe("employeeFuncs.cleanTicketToSubmit(ticket) testing", () => 
{
    //======================================================================VALID
    test("Already clean ticket should return with more data appended", async () => 
    {
        let result = employeeFuncs.cleanTicketToSubmit({ 
            username: "a", amount: 1, 
            description: "b", type: "c"
        });
        expect(result).toEqual({
            username: "a", amount: 1,
            description: "b", type: "c",
            id: expect.anything(),  date: expect.anything(),
            isApproved: false, isPending: true,
            role: "ticket", manager_username: ""
       });
    });

    test("Ticket with extra data should return with extra data removed", async () => 
    {
        let result = employeeFuncs.cleanTicketToSubmit({ 
            username: "a", num: 2, amount: 1, 
            description: "b", type: "c",
            glajga: "adda", ada: true
        });
        expect(result).toEqual({
            username: "a", amount: 1,
            description: "b", type: "c",
            id: expect.anything(),  date: expect.anything(),
            isApproved: false, isPending: true,
            role: "ticket", manager_username: ""
       });
    });
});

describe("employeeFuncs.viewTickets(username) testing", () => 
{
    //======================================================================VALID
    test("Valid username should return content", async () => 
    {
        const view = jest.fn(async () => await employeeFuncs.viewTickets("bigdude1000"));
        
        let result = await view();

        expect(view).toHaveReturned();
        expect(result).toBeTruthy();
    });
    
    //======================================================================INVALID
    test("Invalid username should run but return no content", async () => 
    {
        const view = jest.fn(async () => await employeeFuncs.viewTickets("A_BAD_USERNAME"));
        
        let result = await view();

        expect(view).toHaveReturned();
        expect(result).toHaveLength(0);
    });
    test("Empty username should run but return no content", async () => 
    {
        const view = jest.fn(async () => await employeeFuncs.viewTickets(""));
        
        let result = await view();

        expect(view).toHaveReturned();
        expect(result).toHaveLength(0);
    });
});