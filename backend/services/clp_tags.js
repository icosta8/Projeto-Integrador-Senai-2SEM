const tagsCLP = {
  "status": {
    "geral": {"ns": 3, "type": "Int16"},
    "falhaAtiva": {"ns": 3, "type": "Boolean"},
    "falhaAtivaCod": {"ns": 3, "type": "Int16"},
    "accSinc": {"ns": 3, "type": "Int32"},
    "opAtual": {"ns": 3, "type": "DoubleInteger"},
    "estoqueProd": {"ns": 3, "type": "Array[Int16]"},
    "mesProd": {"ns": 3, "type": "Int16"},
    "mesFalt": {"ns": 3, "type": "Int16"},
    "mesUltimoCiclo": {"ns": 3, "type": "Real"},
    "mesTempInicio": {"ns": 3, "type": "DateTime"},
    "mesTempFim": {"ns": 3, "type": "DateTime"},
    "mesPcsBoas": {"ns": 3, "type": "Int32"},
    "mesPcsRuins": {"ns": 3, "type": "Int32"}
  },
  "ack": {
    "pedidoACK": {"ns": 3, "type": "Boolean"},
    "aplicaACK": {"ns": 3, "type": "Boolean"},
    "inicioACK": {"ns": 3, "type": "Boolean"},
    "execACK": {"ns": 3, "type": "Boolean"},
    "fimACK": {"ns": 3, "type": "Boolean"},
    "falhaACK": {"ns": 3, "type": "Boolean"}
  },
  "pedido": {
    "op": {"ns": 3, "type": "Int32"},
    "produto": {"ns": 3, "type": "Int16"},
    "quant": {"ns": 3, "type": "Int16"}
  },
  "cmd": {
    "novoPed": {"ns": 3, "type": "Boolean"},
    "inicio": {"ns": 3, "type": "Boolean"},
    "abortar": {"ns": 3, "type": "Boolean"},
    "reset": {"ns": 3, "type": "Boolean"}
  }
}
module.exports = tagsCLP;