const Status = {
    Todo: { enum: 0, description : "A FAZER"},
    Doing: { enum: 1, description: "FAZENDO" },
    Done: { enum: 2, description: "FEITO" },
    Paused: {enum: 3, description: "PAUSADA"}
};
  
const TipoTarefa = {
    CodarGamesAntigo: { enum: 1, description : "Codar Games Antigos"},
    CodarMeuGame: {enum : 2, description : "Codar Meu Game"},
    EstudarLivro: { enum: 3, description: "Estudar Livro" },
    EstudarVideoAula: {enum : 4, description : "Estudar Vídeo Aula" }
};

let dataEtapasCadastro = {
    idTarefa: 0,
    tipoTarefa : 0,
    numeroEtapa: 1,
    etapas:[]
}

let etapasEdicao = {
    etapaAtivaAtual: {},
    etapas: []
};