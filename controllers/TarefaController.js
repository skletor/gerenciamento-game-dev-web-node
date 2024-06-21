const express = require('express');
const router = express.Router();
const Tarefa = require('../models/Tarefa');
const tarefaRepository = require('../repository/TarefaRepository');
const etapaTarefaRepository = require('../repository/EtapaTarefaRepository');
const EtapaTarefa = require('../models/EtapaTarefa');
const Status = require('../models/StatusEnum');
const TipoTarefa = require('../models/TipoTarefaEnum');

// Listar todas as tarefas
router.get('/api/tarefas', async (req, res) => {
  try {
    
    let tarefas = [];
    tarefaRepository.getTarefas(req.query.status, (err, rows) => {

      if (err) throw err;

      rows.forEach(row => {
        tarefas.push(new Tarefa(row.Id, row.Titulo, row?.Status, row?.DataInicio, row?.PercentualConcluido, row?.DescricaoDetalhada, row?.TipoTarefa, row?.QtdPaginasOuVideos, row?.NumeroPaginaOuVideoAtual, row?.LinkReferencia));
      });

      etapaTarefaRepository.getEtapasByTarefasIds(tarefas.map((t) => t.id) ,(err, rows) => {

        tarefas.forEach(tarefa => {
          const etapasTarefa = rows.filter((etapa) => etapa.TarefaId == tarefa.id);
          etapasTarefa.forEach(row => { 
            tarefa.etapas.push(new EtapaTarefa(row.Id, row.NumeroOrdem, row.Status, row.DescricaoEtapa));
          });
        });

        res.status(200).json(tarefas);
      });      
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Obter uma tarefa por ID
router.get('/api/tarefas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    tarefaRepository.getTarefaPorId(id, (err, data) => {
      
      if (err) {
        console.log('erro ao buscar por Id, ', err);
        throw err;
      }

      var tarefa = new Tarefa(data.Id, data.Titulo, data.Status, data.DataInicio, data.PercentualConcluido, data.DescricaoDetalhada, data.TipoTarefa, data.QtdPaginasOuVideos, data.NumeroPaginaOuVideoAtual, data?.LinkReferencia);

      etapaTarefaRepository.getEtapasTarefa(id, (err, rows) => {

        rows.forEach(row => { 
          tarefa.etapas.push(new EtapaTarefa(row.Id, row.NumeroOrdem, row.Status, row.DescricaoEtapa));
        }); 

        res.status(200).json(tarefa); 
      });
    });    
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
  }
});

// Criar uma nova tarefa
router.post('/api/tarefas', async (req, res) => {
  try {
    
    tarefaRepository.saveTarefa(req.body, (dbReturnCommandResult, err) => {
      
      if (err) console.log('ERRO', err);
      else {

        if (req.body.etapas.length > 0) {
          etapaTarefaRepository.saveEtapasTarefa(req.body.etapas, dbReturnCommandResult.lastID, (dbReturnCommandResult, err) => {
            if (err) {
              throw err;
            }
            res.status(201).json({ message: "nova tarefa criada com sucesso" });
          });
        }
        else
          res.status(201).json({message: "nova tarefa criada com sucesso"});
      }
    });   

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/api/tarefas/:id', async (req, res) => {
  try {

    tarefaRepository.getTarefaPorId(req.params.id, (err, data) => {

      if (err) {
        throw err;
      }

      if (!data) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      var tarefa = new Tarefa(data.Id, data.Titulo, data.Status, data.DataInicio, data.PercentualConcluido, data.DescricaoDetalhada, data.TipoTarefa, data.QtdPaginasOuVideos, data.NumeroPaginaOuVideoAtual);
      
      tarefa.titulo = req.body.titulo;
      tarefa.descricaoDetalhada = req.body.descricaoDetalhada;
      tarefa.qtdPaginasOuVideos = req.body.qtdPaginasOuVideos;
      tarefa.linkReferencia = req.body.linkReferencia;
      
      tarefaRepository.saveTarefaEditada(tarefa, (returnSave, err) => {
        if (err) throw err;

        //delete tarefas and save all again
        if (req.body.etapas.length > 0) {
          etapaTarefaRepository.deleteAllByTarefaId(tarefa.id, (returnDelete, err) => {

            if (err) throw err;

            etapaTarefaRepository.saveEtapasTarefa(req.body.etapas, tarefa.id, (dbReturnCommandResult, err) => {
              if (err) {
                throw err;
              }
              res.status(200).json({ message: 'Tarefa editada com sucesso' });
            });
          });
        }
        else
          res.status(200).json({ message: 'Tarefa editada com sucesso' });
      });
    });

  } catch (err) {
      console.log('err', err);
      console.error(err.message);
      res.status(500).send('Erro no servidor');
  }
});

router.put('/api/tarefas/iniciar/:id', async (req, res) => {

  try {
    var data = new Date();
    var status = Status.Doing.enum;
    
    let numeroPaginaOuVideoAtual = req.body.tipoTarefaId > 2 ? 1 : 0;

    tarefaRepository
      .iniciarTarefa(
        parseInt(req.params.id),
        `${data.getFullYear()}${data.getMonth().toString().padStart(2, '0')}${data.getDate().toString().padStart(2, '0')}`,
        status,
        numeroPaginaOuVideoAtual,
        (result, err) => {
          if (err) throw err;

          if (req.body.tipoTarefaId < 3) {
            etapaTarefaRepository.updateEtapaTarefa(parseInt(req.params.id), 1, Status.Doing.enum, (result, err) => {
              res.status(200).json({ message: 'tarefa iniciada com sucesso' });
            });
          }
          else
            res.status(200).json({ message: 'tarefa iniciada com sucesso' });
        }
      );
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/api/tarefas/avancar-retroceder/:id', async (req, res) => {

  try {
    
    let numeroPaginaOuVideoAtual = 0;

    if (req.body.tipoTarefaId > 2) {
      numeroPaginaOuVideoAtual = req.body.isAvancar ? +1 : -1;
    }

    tarefaRepository
      .atualizarProgressoTarefa(
        parseInt(req.params.id),
        0,
        req.body.isAvancar ? +1 : -1,
        req.body.numeroOrdem,
        req.body.isAvancar,
        numeroPaginaOuVideoAtual,
        (result, err) => {
          if (err) throw err;

          res.status(200).json({ message: 'tarefa atualizada com sucesso' });
      });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/api/tarefas/atualizar-progresso/:id', async (req, res) => {

  try {
    
    tarefaRepository.getTarefaPorId(req.params.id, (err, data) => {
      
      const tarefa = data;

      if (data.TipoTarefa < TipoTarefa.EstudarLivro.enum) {
        //get etapas
        etapaTarefaRepository.getEtapasTarefa(req.params.id, (err, rows) => {

          const qtdEtapasFeitas = rows.filter((x) => x.Status == Status.Done.enum);
          const percentuaConcluido = (qtdEtapasFeitas.length / rows.length) * 100;

          tarefaRepository.atualizarPercentualProgressoTarefa(req.params.id, percentuaConcluido,
            function (resultSave, err) {
              if (err) throw err;

              res.status(200).json({ message: 'Progresso atualizado com sucesso' });
          });
        });
      }
      else {
        //atualiza tarefa apenas

        const percentuaConcluido = (parseInt(tarefa.NumeroPaginaOuVideoAtual) / tarefa.QtdPaginasOuVideos) * 100;

        tarefaRepository.atualizarPercentualProgressoTarefa(req.params.id, percentuaConcluido,
          function (resultSave, err) {
            if (err) throw err;

            res.status(200).json({ message: 'Progresso atualizado com sucesso' });
        });
      }
    });    
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/api/tarefas/update/:id', async (req, res) => {

  try {    

    switch (req.body.status) {
      case Status.Paused.enum:
        tarefaRepository.pausarTarefa(req.params.id,
          (err) => {
            if (err) throw err;
            else
              res.status(200).json({ message: 'tarefa pausada com sucesso' });
          });
        break;
      case Status.Doing.enum:
        tarefaRepository.retomarTarefa(req.params.id,
          (err) => {
            if (err) throw err;
            else
              res.status(200).json({ message: 'tarefa retomada com sucesso' });
          });
        break;
      case Status.Done.enum:
        tarefaRepository.finalizarTarefa(req.params.id,
          (err) => {
            if (err) throw err;
            else
              res.status(200).json({ message: 'tarefa finalizada com sucesso' });
          });
        break;
      default:
        tarefaRepository.deletarTarefa(req.params.id,
          (err) => {
            if (err) throw err;
            else
              res.status(200).json({ message: 'tarefa excluída com sucesso' });
          });
        break;
    }
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
