const db = require('../config-database/sqlite-config');

function getEtapasTarefa(tarefaId, fillCallback) {
    db.all(`select Id, NumeroOrdem, Status, DescricaoEtapa from EtapaTarefa WHERE TarefaId = ? ORDER BY NumeroOrdem`,[tarefaId], fillCallback);
}

function getEtapasByTarefasIds(tarefasIds, fillCallback) {
    db.all(`select Id, TarefaId, NumeroOrdem, Status, DescricaoEtapa from EtapaTarefa WHERE TarefaId IN(${tarefasIds.join(', ')}) ORDER BY NumeroOrdem`,
        fillCallback
    );    
}

function saveEtapasTarefa(etapas, tarefaId, saveCallback) {
    
    const insertStatement = [
        'insert into EtapaTarefa (NumeroOrdem, Status, DescricaoEtapa, TarefaId) values'];
    
    etapas.forEach(etapa => {
        if(etapa.numeroEtapa != etapas[etapas.length - 1].numeroEtapa)
            insertStatement.push(`(${etapa.numeroEtapa}, ${etapa.status.enum}, '${etapa.descricaoEtapa}', ${tarefaId}),`);
        else
            insertStatement.push(`(${etapa.numeroEtapa}, ${etapa.status.enum}, '${etapa.descricaoEtapa}', ${tarefaId})`);
    });

    db.run(insertStatement.join(''),
        function(err) {
            saveCallback(this, err);
        }        
    );
}

function updateEtapaTarefa(tarefaId, numeroEtapa, status, callBackUpdate) {
    db.run(`UPDATE EtapaTarefa SET Status = ? WHERE TarefaId = ? AND NumeroOrdem = ?`,
            [status, tarefaId, numeroEtapa],
        function(err) {
            callBackUpdate(this, err);
        }        
    );
}

function deleteAllByTarefaId(tarefaId, callBack) {
    db.run(`DELETE FROM EtapaTarefa WHERE TarefaId = ?`,
        [tarefaId], function (err) {
            callBack(this, err); 
        });
}

module.exports = {
    getEtapasTarefa: getEtapasTarefa,
    saveEtapasTarefa: saveEtapasTarefa,
    getEtapasByTarefasIds: getEtapasByTarefasIds,
    updateEtapaTarefa: updateEtapaTarefa,
    deleteAllByTarefaId: deleteAllByTarefaId
}