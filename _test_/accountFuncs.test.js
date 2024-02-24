const accountFuncs = require("../accountFuncs");

let validAccounts = [
    { username: "a", password: "b" },
    { username: "a", password: "b", address: "c", name: "d", role: "employee" },
    { username: "a", password: "b", address: "c", name: "d", role: "manager" },
    { username: "a", password: "b", role: "employee", favoriteFood: "pizza"}
];

let invalidAccounts = [
    { username: "", password: "b" },
    { username: "a", password: "" },
    { username: "bigdude1000", password: "b" },
    { username: "john_doe", password: "b" }
];

//========================================================================ASYNC verifyAccountToRegister(account)
describe("accountFuncs.verifyAccountToRegister(account) testing", () => 
{
    //======================================================================VALID
    test("Valid account should return true", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(validAccounts[0]);
        expect(result.integrity).toBe(true);
    });
    test("Valid account should return true", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(validAccounts[1]);
        expect(result.integrity).toBe(true);
    });
    test("Valid account should return true", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(validAccounts[2]);
        expect(result.integrity).toBe(true);
    });
    test("Valid account should return true", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(validAccounts[3]);
        expect(result.integrity).toBe(true);
    });

    //======================================================================INVALID
    test("Invalid account should return false + message", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(invalidAccounts[0]);
        expect(result.integrityMessage).toBeTruthy();
    });
    test("Invalid account should return false + message", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(invalidAccounts[1]);
        expect(result.integrityMessage).toBeTruthy();
    });
    test("Invalid account should return false + message", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(invalidAccounts[2]);
        expect(result.integrityMessage).toBeTruthy();
    });
    test("Invalid account should return false + message", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(invalidAccounts[3]);
        expect(result.integrityMessage).toBeTruthy();
    });
});


//========================================================================cleanAccountToRegister(account) 
describe("accountFuncs.cleanAccountToRegister(account)  testing", () => 
{
    test("Account w/ uname and pword should return id and role added", () => 
    {
        let result = accountFuncs.cleanAccountToRegister(validAccounts[0]);
        expect(result).toEqual({
             username: "a", password: "b",
             id: expect.anything(), role: "employee"
        });
    });

    test("Account w/ uname, pword, adrs, name, and role should return id added", () => 
    {
        let result = accountFuncs.cleanAccountToRegister(validAccounts[1]);
        expect(result).toEqual({
             username: "a", password: "b", address: "c", name: "d",
             id: expect.anything(), role: "employee"
        });
    });

    test("Account w/ role set to manager should return with it still as manager", () => 
    {
        let result = accountFuncs.cleanAccountToRegister(validAccounts[2]);
        expect(result).toEqual({
             username: "a", password: "b", address: "c", name: "d",
             id: expect.anything(), role: "manager"
        });
    });

    test("Account w/ extraneous properties should return with them removed", () => 
    {
        let result = accountFuncs.cleanAccountToRegister(validAccounts[3]);
        expect(result).toEqual({
             username: "a", password: "b",
             id: expect.anything(), role: "employee"
        });
    });
});