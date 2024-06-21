const db = require('../config-database/sqlite-config');
const Status = require('../models/StatusEnum');

function getTarefas(status, fillCallback) {
    db.all(`select Id, 
                   Titulo,
                   Status,
                   DataInicio,
                   PercentualConcluido,
                   DescricaoDetalhada,
                   TipoTarefa,
                   QtdPaginasOuVideos,
                   NumeroPaginaOuVideoAtual,
                   LinkReferencia
            from Tarefa 
            WHERE Status = ?
            ORDER BY DataInicio DESC`, [status] , fillCallback);
}

function saveTarefa(novaTarefa, saveCallback) {
    db.run('insert into Tarefa (Titulo, Status, TipoTarefa, DescricaoDetalhada, QtdPaginasOuVideos, LinkReferencia) values (?, ?, ?, ?, ?, ?)',
            [novaTarefa.titulo, novaTarefa.status, novaTarefa.tipoTarefa, novaTarefa.descricao, novaTarefa.qtdPaginasOuVideos, novaTarefa.linkReferencia],
        function(err) {
            saveCallback(this, err);
        }        
    );
}

function saveTarefaEditada(tarefa, saveCallback) {
    db.run(`UPDATE Tarefa SET Titulo = ?, DescricaoDetalhada = ?, QtdPaginasOuVideos = ?, LinkReferencia = ?
            WHERE Id = ?`,
            [tarefa.titulo, tarefa.descricaoDetalhada, tarefa.qtdPaginasOuVideos, tarefa.linkReferencia, tarefa.id],
        function(err) {
            saveCallback(this, err);
        }        
    );
}

function iniciarTarefa(tarefaId, dataInicio, status, numeroPaginaOuVideoAtual, startTarefaCallBack) {
    db.run(`UPDATE Tarefa SET DataInicio = ?, Status = ?, NumeroPaginaOuVideoAtual = ? WHERE Id = ?`,
            [dataInicio, status, numeroPaginaOuVideoAtual, tarefaId],
        function(err) {
            startTarefaCallBack(this, err);
        }        
    );
}

function getTarefaPorId(id, fillCallback) {
    db.get('select Id, Titulo, Status, DataInicio, PercentualConcluido, DescricaoDetalhada, TipoTarefa, QtdPaginasOuVideos, NumeroPaginaOuVideoAtual, LinkReferencia FROM Tarefa WHERE Id = ?',
     [id], fillCallback);    
}

function atualizarProgressoTarefa(tarefaId, statusTarefa, statusEtapa, numeroOrdem, isAvancar, numeroPaginaOuVideoAtual, callback) {
    
    if (numeroOrdem > 0) {

        if (isAvancar) {
            db.run(`UPDATE EtapaTarefa SET Status = ? WHERE NumeroOrdem = ? AND TarefaId = ?`, [Status.Done.enum, numeroOrdem, tarefaId]);
            db.run(`UPDATE EtapaTarefa SET Status = ? WHERE NumeroOrdem = ? AND TarefaId = ?`, [Status.Doing.enum, numeroOrdem + 1, tarefaId], callback);
        }
        else {
            db.run(`UPDATE EtapaTarefa SET Status = ? WHERE NumeroOrdem = ? AND TarefaId = ?`, [Status.Todo.enum, numeroOrdem, tarefaId]);
            db.run(`UPDATE EtapaTarefa SET Status = ? WHERE NumeroOrdem = ? AND TarefaId = ?`, [Status.Doing.enum, numeroOrdem - 1, tarefaId], callback);
        }
    }
    else {
        db.run(`UPDATE Tarefa SET Status = Status + ?, NumeroPaginaOuVideoAtual = NumeroPaginaOuVideoAtual + ? WHERE Id = ?`, [statusTarefa, numeroPaginaOuVideoAtual, tarefaId], callback);   
    }
}

function atualizarPercentualProgressoTarefa(tarefaId, percentuaConcluido, callBack) {
    db.run(`UPDATE Tarefa SET PercentualConcluido = ? WHERE Id = ?`,
            [percentuaConcluido, tarefaId],
        function(err) {
            callBack(this, err);
        }        
    );
}

function pausarTarefa(tarefaId, callBack) {
    db.run(`UPDATE Tarefa SET Status = ? WHERE Id = ?`, [Status.Paused.enum, tarefaId],
        function (err) {
            callBack(err);
        });
}

function retomarTarefa(tarefaId, callBack) {
    db.run(`UPDATE Tarefa SET Status = ? WHERE Id = ?`, [Status.Doing.enum, tarefaId],
        function (err) {
            callBack(err);
        });
}

function finalizarTarefa(tarefaId, callBack) {
    db.run(`UPDATE EtapaTarefa SET Status = ? WHERE TarefaId = ?`, [Status.Done.enum, tarefaId]);
    db.run(`UPDATE Tarefa SET Status = ?, PercentualConcluido = 100 WHERE Id = ?`, [Status.Done.enum, tarefaId],
        function (err) {
            callBack(err);
        });
}

function deletarTarefa(tarefaId, callBack) {
    db.run(`DELETE FROM EtapaTarefa WHERE TarefaId = ?`, [tarefaId]);
    db.run(`DELETE FROM Tarefa WHERE Id = ?`, [tarefaId], callBack);    
}

module.exports = {
    getTarefas: getTarefas,
    saveTarefa: saveTarefa,
    getTarefaPorId: getTarefaPorId,
    saveTarefaEditada: saveTarefaEditada,
    iniciarTarefa: iniciarTarefa,
    atualizarProgressoTarefa: atualizarProgressoTarefa,
    atualizarPercentualProgressoTarefa: atualizarPercentualProgressoTarefa,
    pausarTarefa: pausarTarefa,
    retomarTarefa: retomarTarefa,
    finalizarTarefa: finalizarTarefa,
    deletarTarefa: deletarTarefa
}