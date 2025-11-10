const opcua = require("node-opcua");

async function conectarOPCUA(endpoint = "opc.tcp://192.168.0.1:4840") {
    const client = opcua.OPCUAClient.create({
        endpointMustExist: false,
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 3
        }
    });

    await client.connect(endpoint);
    const session = await client.createSession();
    console.log("Sessão OPC UA criada:", endpoint);

    return { client, session };
}

async function desconectarOPCUA(client, session) {
    if (session) await session.close();
    if (client) await client.disconnect();
    console.log("Desconectado do servidor OPC UA.");
}

module.exports = { conectarOPCUA, desconectarOPCUA };