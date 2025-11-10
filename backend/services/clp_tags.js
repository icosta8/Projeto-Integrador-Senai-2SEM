const tagsCLP = {
  "DB_status": {
    "status.geral": {"ns": 3, "type": "Int"},
    "status.falhaAtiva": {"ns": 3, "type": "Boolean"},
    "status.falhaAtivaCod": {"ns": 3, "type": "Int"},
    "status.accSinc": {"ns": 3, "type": "UInt"},
    "status.opAtual": {"ns": 3, "type": "DoubleInteger"},
    "status.estoqueProd": {"ns": 3, "type": "Array[Int]"},
    "status.mesProd": {"ns": 3, "type": "Int"},
    "status.mesFalt": {"ns": 3, "type": "Int"},
    "status.mesUltimoCiclo": {"ns": 3, "type": "Real"},
    "status.mesTempInicio": {"ns": 3, "type": "DateTime"},
    "status.mesTempFim": {"ns": 3, "type": "DateTime"},
    "status.mesPCsBoas": {"ns": 3, "type": "Int"},
    "status.mesPCsRuins": {"ns": 3, "type": "Int"}
  },
  "DB_ack": {
    "ack.pedidoACK": {"ns": 3, "type": "Boolean"},
    "ack.aplicaACK": {"ns": 3, "type": "Boolean"},
    "ack.inicioACK": {"ns": 3, "type": "Boolean"},
    "ack.execACK": {"ns": 3, "type": "Boolean"},
    "ack.fimACK": {"ns": 3, "type": "Boolean"},
    "ack.falhaACK": {"ns": 3, "type": "Boolean"}
  },
  "DB_pedido": {
    "pedido.op": {"ns": 3, "type": "DoubleInteger"},
    "pedido.produto": {"ns": 3, "type": "Int"},
    "pedido.quant": {"ns": 3, "type": "Int"}
  },
  "DB_cmd": {
    "cmd.novoPed": {"ns": 3, "type": "Boolean"},
    "cmd.inicio": {"ns": 3, "type": "Boolean"},
    "cmd.abortar": {"ns": 3, "type": "Boolean"},
    "cmd.reset": {"ns": 3, "type": "Boolean"}
  }
}
module.exports = tagsCLP;