const Status = require("./StatusEnum");
const TipoTarefa = require('./TipoTarefaEnum');

class Tarefa {
  constructor(id, titulo, status, dataInicio, percentConcluido, descricaoDetalhada, tipoTarefa, qtdPaginasOuVideos, numeroPaginaOuVideoAtual, linkReferencia) {
    this.id = id;
    this.titulo = titulo;
    this.status = this.getStatus(status);
    this.dataInicio = dataInicio;
    this.percentualConcluido = percentConcluido;
    this.descricaoDetalhada = descricaoDetalhada; 
    this.tipoTarefa = this.getTipoTarefa(tipoTarefa);
    this.etapas = [];
    this.qtdPaginasOuVideos = qtdPaginasOuVideos;
    this.numeroPaginaOuVideoAtual = numeroPaginaOuVideoAtual;
    this.linkReferencia = linkReferencia;
  }
  getStatus(status) {
    switch (status) {
      case Status.Todo.enum:
        return Status.Todo;
      case Status.Doing.enum:
        return Status.Doing;       
      case Status.Done.enum:
        return Status.Done;  
      case Status.Paused.enum:
        return Status.Paused;
    } 
  }
  getTipoTarefa(tipoTarefa) {
    switch (tipoTarefa) {
      case TipoTarefa.CodarGamesAntigo.enum:
        return TipoTarefa.CodarGamesAntigo;
      case TipoTarefa.CodarMeuGame.enum:
        return TipoTarefa.CodarMeuGame;       
      case TipoTarefa.EstudarLivro.enum:
        return TipoTarefa.EstudarLivro;
        case TipoTarefa.EstudarVideoAula.enum:
          return TipoTarefa.EstudarVideoAula;
    } 
  }
};

module.exports = Tarefa;