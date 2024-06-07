const Status = {
  Todo: { enum: 0, description : "A FAZER"},
  Doing: { enum: 1, description: "FAZENDO" },
  Done: {enum : 2, description : "FEITO" },  
  Paused: {enum: 3, description: "PAUSADA"}
};

module.exports = Status;