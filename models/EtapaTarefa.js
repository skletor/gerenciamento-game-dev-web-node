const Status = require("./StatusEnum");

class EtapaTarefa {
    constructor(id, numeroEtapa, status, descricaoEtapa) {
        this.id = id;
        this.numeroEtapa = numeroEtapa;
        this.status = this.getStatus(status);
        this.descricaoEtapa = descricaoEtapa;
    }
    getStatus(status) {
        switch (status) {
          case Status.Todo.enum:
            return Status.Todo;
          case Status.Doing.enum:
            return Status.Doing;       
          case Status.Done.enum:
            return Status.Done;        
        } 
      }
}

module.exports = EtapaTarefa;