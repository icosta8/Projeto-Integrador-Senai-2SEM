const { lerTags } = require("./server_opc_client");

async function leituraCLP(leitura){
    switch(leitura){
        case "status":
            await lerTags("status", "geral");
            await lerTags("status", "estoqueProd");
            await lerTags("status", "falhaAtiva");
            await lerTags("status", "falhaAtivaCod");
            delay(500);
            break;
        case "mes":
            await lerTags("status", "mesFalt");
            await lerTags("status", "mesProd");
            await lerTags("status", "mesPCsBoas");
            await lerTags("status","mesPCsRuins");
            delay(500);
            break;
    }
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

module.exports = { leituraCLP };