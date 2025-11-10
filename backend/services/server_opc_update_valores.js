const mongoose = require("mongoose");
const { lerTags } = require("./server_opc_client");
const ClpData = require("../models/CLP");

const MONGO_URL = "mongodb://localhost:27017/projetoIntegrador";
const INTERVALO_MS = 5000; // tempo entre leituras (5 segundos)

async function iniciarOPCService() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado ao MongoDB");

    console.log("Iniciando serviço de leitura OPC UA...");

    setInterval(async () => {
      try {
        const dados = await lerTags();
        const registros = [];

        for (const db in dados) {
          for (const tag in dados[db]) {
            registros.push({
              db,
              tag,
              value: dados[db][tag]
            });
          }
        }

        await ClpData.insertMany(registros);
        console.log("Tags registradas:", new Date().toLocaleTimeString());

      } catch (err) {
        console.error("Erro na leitura OPC:", err.message);
      }
    }, INTERVALO_MS);

  } catch (erro) {
    console.error("Erro ao iniciar serviço OPC:", erro);
  }
}

module.exports = { iniciarOPCService };
