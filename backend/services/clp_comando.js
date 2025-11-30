const { escreverTag } = require("./server_opc_client");

async function enviarComando(comando) {
  switch (comando) {
    case "inicio":
      await escreverTag("cmd", "inicio", true);
      await delay(1000);
      await escreverTag("cmd", "inicio", false);
      console.log("Comando INICIO enviado!");
      break;

    case "reset":
      await escreverTag("cmd", "reset", true);
      await delay(1000);
      await escreverTag("cmd", "reset", false);
      console.log("Comando RESET enviado!");
      break;

    case "abortar":
      await escreverTag("cmd", "abortar", true);
      await delay(1000);
      await escreverTag("cmd", "abortar", false);
      console.log("Comando ABORTAR enviado!");
      break;

    case "novoPed":
      await escreverTag("cmd", "novoPed", true);
      await delay(1000);
      await escreverTag("cmd", "novoPed", false);
      console.log("Comando NOVOPED enviado!")
      break;

    default:
      console.log("Comando desconhecido:", comando);
  }
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

module.exports = { enviarComando };