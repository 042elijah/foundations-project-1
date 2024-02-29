const accountFuncs = require("../account/accountFuncs");

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
        expect(result.isValid).toBe(true);
    });
    test("Valid account should return true", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(validAccounts[1]);
        expect(result.isValid).toBe(true);
    });
    test("Valid account should return true", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(validAccounts[2]);
        expect(result.isValid).toBe(true);
    });
    test("Valid account should return true", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(validAccounts[3]);
        expect(result.isValid).toBe(true);
    });

    //======================================================================INVALID
    test("Invalid account should return false + message", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(invalidAccounts[0]);
        expect(result.message).toBeTruthy();
    });
    test("Invalid account should return false + message", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(invalidAccounts[1]);
        expect(result.message).toBeTruthy();
    });
    test("Invalid account should return false + message", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(invalidAccounts[2]);
        expect(result.message).toBeTruthy();
    });
    test("Invalid account should return false + message", async () => 
    {
        let result = await accountFuncs.verifyAccountToRegister(invalidAccounts[3]);
        expect(result.message).toBeTruthy();
    });
});


//========================================================================cleanAccountToRegister(account) 
describe("accountFuncs.cleanAccountToRegister(account)  testing", () => 
{
    test("Account w/ uname,pword should return id and role added", async () => 
    {
        let result = await accountFuncs.cleanAccountToRegister(validAccounts[0]);
        expect(result).toEqual({
             username: "a", password: expect.anything(),
             id: expect.anything(), role: "employee"
        });
    });

    test("Account w/ uname,pword,adrs,name,role should return id added", async () => 
    {
        let result = await accountFuncs.cleanAccountToRegister(validAccounts[1]);
        expect(result).toEqual({
             username: "a", password: expect.anything(), address: "c", name: "d",
             id: expect.anything(), role: "employee"
        });
    });

    test("Account w/ role set to manager should return with it still as manager", async () => 
    {
        let result = await accountFuncs.cleanAccountToRegister(validAccounts[2]);
        expect(result).toEqual({
             username: "a", password: expect.anything(), address: "c", name: "d",
             id: expect.anything(), role: "manager"
        });
    });

    test("Account w/ extraneous properties should return with them removed", async () => 
    {
        let result = await accountFuncs.cleanAccountToRegister(validAccounts[3]);
        expect(result).toEqual({
             username: "a", password: expect.anything(),
             id: expect.anything(), role: "employee"
        });
    });
});

let loginAccounts = [
    {username: "john_doe", password: "password123"}, //valid
    { username: "frank18", password: "TH3FR4NKS7ER!"}, //invalid
    { username: "", password: "b" }, //invalid
    { username: "a", password: "" } //invalid
]

//========================================================================ASYNC verifyAccountToLogIn(account)
describe("accountFuncs.verifyAccountToLogIn(account) testing", () => 
{
    //======================================================================VALID
    test("Valid account should return true", async () => 
    {
        let result = await accountFuncs.verifyAccountToLogIn(loginAccounts[0]);
        expect(result.isValid).toBe(true);
    });

    //======================================================================INVALID
    test("Invalid account should return false", async () => 
    {
        let result = await accountFuncs.verifyAccountToLogIn( loginAccounts[1] );
        expect(result.isValid).toBe(false);
        expect(result.message).toEqual("No such username registered.");
    });
    test("Invalid account should return false", async () => 
    {
        let result = await accountFuncs.verifyAccountToLogIn( loginAccounts[2] );
        expect(result.isValid).toBe(false);
        expect(result.message).toEqual("Missing username or password.");
    });
    test("Invalid account should return false", async () => 
    {
        let result = await accountFuncs.verifyAccountToLogIn( loginAccounts[3] );
        expect(result.isValid).toBe(false);
        expect(result.message).toEqual("Missing username or password.");
    });
});