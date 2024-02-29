const employeeFuncs = require("../employee/employeeFuncs");

//verifyTicketToSubmit (ticket)
describe("employeeFuncs.verifyTicketToSubmit (ticket) testing", () => {
    //======================================================================VALID
    test("", async () => 
    {
        expect(true).toBe(true);
    });
});

//cleanTicketToAdd(ticket) 
//does no input verif. its all done in verifyTicketToSubmit
describe("employeeFuncs.cleanTicketToSubmit(ticket) testing", () => {
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