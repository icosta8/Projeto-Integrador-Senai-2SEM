const { monitorarFimCiclo } = require("./server_opc_mes");
const axios = require("axios");
const RETRY_INTERVAL = 5000;

async function enviarParaMES(dados) {
    try { 
        await axios.post("http://localhost:3000/api/mes/status-clp", dados);
        console.log("Dados enviados para MES com sucesso!");
    } catch (err) {
        console.error("Erro ao enviar para MES, retry em 5s...", err.message);
        setTimeout(() => enviarParaMES(dados), RETRY_INTERVAL);
    }
}

async function fimCiclo(dados) {
    console.log("Fim de ciclo detectado. Preparando envio ao MES...");
    await enviarParaMES(dados);
}

(async () => {
    try {
        const monitor = await fimCiclo(fimCicloCallback);
        console.log("Serviço OPC-MES rodando. Monitorando ack.fimACK...", monitor);
    } catch (err) {
        console.error("Erro ao iniciar serviço OPC-MES:", err.message);
    }
})();