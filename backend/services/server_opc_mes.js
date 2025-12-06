const opcua = require("node-opcua");
const tagsCLP = require("./clp_tags");
const { conectarOPCUA, desconectarOPCUA } = require("./server_opc_conexao");
const { lerTags } = require("./server_opc_client");
function mapearNodeId(db, tag) {
    const tagInfo = tagsCLP[db][tag];
    return `ns=${tagInfo.ns};s="${db}"."${tag}"`;
}

// Função principal de subscribe
async function monitorarFimCiclo(fimCiclo) {
    const { client, session } = await conectarOPCUA();

    try {
        const subscription = opcua.ClientSubscription.create(session, {
            requestedPublishingInterval: 500,
            requestedMaxKeepAliveCount: 10,
            requestedLifetimeCount: 100,
            publishingEnabled: true
        });

        const nodeId = mapearNodeId("ack", "fimACK");

        const monitoredItem = await subscription.monitor(
            { nodeId, attributeId: opcua.AttributeIds.Value },
            { samplingInterval: 250, discardOldest: true, queueSize: 10 },
            opcua.TimestampsToReturn.Both
        );

        monitoredItem.on("changed", async (dataValue) => {
            const valor = dataValue.value.value;
            console.log("ack.fimACK mudou:", valor);

            if (valor === true) {
                // fim de ciclo detectado
                const dados = await lerTags(); 
                fimCiclo(dados); 
            }
        });

        console.log("Monitorando ack.fimACK...");

        // Retorna objetos para encerrar depois se necessário
        return { client, session, subscription, monitoredItem };

    } catch (err) {
        await desconectarOPCUA(client, session);
        throw err;
    }
}

function fimCiclo(dados) {
    console.log("Dados do fim de ciclo:", dados.status, dados.pedido);
}

module.exports = { monitorarFimCiclo, fimCiclo };
