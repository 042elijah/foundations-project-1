const http = require('http'); //boilerplate for server stuff
const { logger } = require("./util/logger");
const PORT = 3000;
/*
 ____  ____  __ __  __  _  ____   ____  _____  _  ____  __  _   ____    _____ _____  ____   __  ____  ____  _____ 
| ===|/ () \|  |  ||  \| || _) \ / () \|_   _|| |/ () \|  \| | (_ (_`   | ()_)| () )/ () \__) || ===|/ (__`|_   _|
|__|  \____/ \___/ |_|\__||____//__/\__\ |_|  |_|\____/|_|\__|.__)__)   |_|   |_|\_\\____/\___/|____|\____)  |_|  
*/
/*
 _______  _____  ______   _____ 
    |    |     | |     \ |     |
    |    |_____| |_____/ |_____|
*/
//-everything lol

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/account/login") //==================LOGIN TO AN ACCOUNT
    {
        return;
    }
    else if (req.method === "POST" && req.url === "/account/register") //==================REGISTER AN ACCOUNT
    {
        console.log("POST: account/register");

        let body = "";
        req.on("data", (chunk) => 
        { 
            body += chunk; 
        });

        req.on("end", () => 
        {
            if (body.length == 0)
                logger.warn(`REGISTER AN ACCOUNT failed: Empty body!`); //move this check to the func, when it's built

            let item = JSON.parse(body);

            res.writeHead(201, { "Content-Type": "application/json" });
            res.write(JSON.stringify(item));
            res.end(JSON.stringify({ message: "Register successfully called" }));
        });
    }
    else   //=================Not matching any endpoints
    {
        res.writeHead(404, { "Content-Type": "application/json" });
        let data = { error: "Not Found" };
        res.end(JSON.stringify(data));
    }
});

server.listen(PORT, () => 
{
    console.log(`Server is listening on http://localhost:${PORT}`);
});