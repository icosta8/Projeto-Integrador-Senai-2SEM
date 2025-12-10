const conexao = require('./services/server_opc_conexao');
const opc_cliente = require('./services/server_opc_client');
const clp_comando = require('./services/clp_comando');
const opc_mes = require('./services/server_opc_mes');
const update_opc = require('./services/server_opc_update_valores');

async function servidores() {
  try {
    console.log('Iniciando servidores OPC/MES...\n');

    if (typeof conexao.conectarOPCUA === 'function') {
      await conexao.conectarOPCUA();
      console.log('Conexão OPC estabelecida');
    }

    if (typeof opc_cliente.lerTags === 'function') {
      await opc_cliente.lerTags();
      console.log('Cliente OPC lendo tags');
    }

    if (typeof clp_comando.enviarComando === 'function') {
      await clp_comando.enviarComando();
      console.log('CLP Comando ativo');
    }
    /*
    if (typeof opc_mes.monitorarFimCiclo === 'function') {
      await opc_mes.monitorarFimCiclo();
      console.log('MES monitorando fim de ciclo');
    }
    */
   
    if (typeof update_opc.iniciarOPCService === 'function') {
      await update_opc.iniciarOPCService();
      console.log('Atualização OPC em execução');
    }
    
    console.log('Todos os servidores estão ativos e em execução.');
  } catch (erro) {
    console.error('Falha ao iniciar servidores:', erro.message || erro);
  }
}
servidores();