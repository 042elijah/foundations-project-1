const managerFuncs = require("../manager/managerFuncs");
const employeeFuncs = require("../employee/employeeFuncs");

let ticketAr = [];

async function initializeTestTicket ()
{
    const ticket0 = await employeeFuncs.submitTicket ({ 
        username: "a",
        description: "b",
        amount: "1"
    });
    
    ticketAr.push(ticket0);

    await new Promise(r => setTimeout(r, 2000)); //we need to give Dynamodb a sec to process the new ticket
}
async function deinitializeTestTicket ()
{
    let { username, id } = ticketAr[0];
    await managerFuncs.deleteTicket({ username, id });
}



//verifyTicketForTicketApproval (ticket)
//a ticket needs: username, id , isApproved, and username and id need to match a ticket in the database that isPending
describe("managerFuncs.verifyTicketForTicketApproval(ticket) testing", () => 
{
    beforeAll(async () => 
    {
        await initializeTestTicket();
    });

    afterAll(async () => 
    {
        await deinitializeTestTicket();
    });

    //======================================================================VALID
    test("A valid ticket that is currently pending should return true", async () => 
    {
        let { username, id } = ticketAr[0];
        let result = await managerFuncs.verifyTicketForTicketApproval({ username, id, isApproved: true });
        expect(result.isValid).toBe(true);
    });

    //======================================================================INVALID
    test("An otherwise valid ticket that has no isApproved value should be rejected", async () => //FAIL
    {
        let { username, id } = ticketAr[0];
        let result = await managerFuncs.verifyTicketForTicketApproval({ username, id });
        expect(result.isValid).toBe(false);
    });
    test("An otherwise valid ticket that has a non-bool isApproved value should be rejected", async () =>  //FAIL
    {
        let { username, id } = ticketAr[0];
        let result = await managerFuncs.verifyTicketForTicketApproval({ username, id, isApproved: "yup" });
        expect(result.isValid).toBe(false);
    });
    test("A blank ticket should be rejected", async () => 
    {
        let result = await managerFuncs.verifyTicketForTicketApproval( {} );
        expect(result.isValid).toBe(false);
    });
    test("A valid ticket that has been already approved or denied should be rejected", async () => 
    {
        let result = await managerFuncs.verifyTicketForTicketApproval({ username: "john_doe" , id:"0e8e6c2f-68be-47b7-9ead-cf8a52cd2ff3", isApproved: true });
        expect(result.isValid).toBe(false);
    });
    test("An otherwise valid ticket that has no name or id value should be rejected", async () => 
    {
        let result = await managerFuncs.verifyTicketForTicketApproval({ isApproved: true });
        expect(result.isValid).toBe(false);
    });
});

//cleanTicketForApproval (ticket)
describe("managerFuncs.cleanTicketForApproval(ticket) testing", () => {
    //======================================================================VALID
    test("", async () => 
    {
        expect(true).toBe(true);
    });
});