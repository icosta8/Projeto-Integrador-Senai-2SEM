const { escreverTag } = require("./server_opc_client");

async function enviarComando(comando) {
  switch (comando) {
    case "inicio":
      await escreverTag("DB_cmd", "cmd.inicio", true);
      await delay(500);
      await escreverTag("DB_cmd", "cmd.inicio", false);
      console.log("Comando INICIO enviado!");
      break;

    case "reset":
      await escreverTag("DB_cmd", "cmd.reset", true);
      await delay(500);
      await escreverTag("DB_cmd", "cmd.reset", false);
      console.log("Comando RESET enviado!");
      break;

    case "abortar":
      await escreverTag("DB_cmd", "cmd.abortar", true);
      await delay(500);
      await escreverTag("DB_cmd", "cmd.abortar", false);
      console.log("Comando ABORTAR enviado!");
      break;

    default:
      console.log("Comando desconhecido:", comando);
  }
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

module.exports = { enviarComando };