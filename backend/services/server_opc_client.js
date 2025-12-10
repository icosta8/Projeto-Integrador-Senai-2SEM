const opcua = require("node-opcua");
const tagsCLP = require("./clp_tags");
const { conectarOPCUA, desconectarOPCUA } = require("./server_opc_conexao");

function mapearNodeId(db, tag) {
    const tagInfo = tagsCLP[db][tag];
    return `ns=${tagInfo.ns};s="${db}"."${tag}"`;
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function lerTags() {
    const { client, session } = await conectarOPCUA();

    delay(500);

    try {
        const nodesToRead = [];

        // Mapeia todas as tags do arquivo
        for (const db in tagsCLP) {
            for (const tag in tagsCLP[db]) {
                nodesToRead.push({
                    nodeId: mapearNodeId(db, tag),
                    attributeId: opcua.AttributeIds.Value
                });
            }
        }

        const dataValues = await session.read(nodesToRead);
        const resultados = {};
        let i = 0;

        for (const db in tagsCLP) {
            resultados[db] = {};
            for (const tag in tagsCLP[db]) {
                resultados[db][tag] = dataValues[i].value.value;
                i++;
            }
        }

        return resultados;

    } finally {
        await desconectarOPCUA(client, session);
    }
}

async function escreverTag(db, tag, valor) {
    const { client, session } = await conectarOPCUA();
    const tagInfo = tagsCLP[db][tag];
    const nodeId = mapearNodeId(db, tag);

    try {
        const variant = {
            value: {
                dataType: opcua.DataType[tagInfo.type] || opcua.DataType.Double,
                value: valor
            }
        };

        const statusCode = await session.write({
            nodeId,
            attributeId: opcua.AttributeIds.Value,
            value: variant
        });

        console.log(`Escrito ${tag} = ${valor} (${statusCode.name})`);
    } finally {
        await desconectarOPCUA(client, session);
    }
}

module.exports = { lerTags, escreverTag };
