function AddCardsTemplate(cardItens, elementoContainerId) {
    
    // Obter o template e o container onde inserir o conteúdo
    const template = document.getElementById('card-template');
    const container = document.getElementById(elementoContainerId);
    
    // Preencher o template com os dados e inserir no container
    cardItens.forEach(item => {
        let novoElemento = null;
        
        item.iniciarTarefaHabilitado = item.status.enum == Status.Todo.enum ? "block" : "none";
        item.pauseTarefaHabilitado = item.status.enum > Status.Todo.enum ? "block" : "none";
        item.tipoTarefaId = item?.tipoTarefa?.enum;

        if (item.percentualConcluido >= 50)
            item.corPercentual = "#fff";
        else
            item.corPercentual = "#000";

        item.percentualConcluido = item.percentualConcluido.toFixed(2);
            
        if (item?.tipoTarefa?.enum < 3) {

            item.linkReferencia = "javascript:void(0)";
            item.targetLink = "_self";
            //achar a etapa ativa
            item.etapaAtiva = item.etapas.find(x => x?.status?.enum == Status.Doing.enum);

            item.tipoCard = 'card-code-game';
            item.srcTipoCardImage = 'images/card-code-game.gif';
            item.buttonClass = 'card-code-game-btn';
            novoElemento = preencherTemplate(template, item);
            let iconDiv = novoElemento.firstElementChild;
            iconDiv.classList.add('icon-code');

            let controleTaskDiv = novoElemento.getElementsByClassName('containerEtapaOuPaginaAtual')[0];
            let controleEtapaData = {
                tarefaId: item.id,
                tipoTarefaId: item.tipoTarefaId,
                etapaAtualDescricao: "",
                displayControleEtapas: 'block',
                desabilitavoltar: item?.etapaAtiva?.numeroEtapa > 1 ? "" : "disabled",
                disabledClassBtnAcaoVoltar: item?.etapaAtiva?.numeroEtapa > 1 ? "" : "disabledBtnAcao",
                desabilitaavancar: item?.etapaAtiva?.numeroEtapa >= item.etapas?.length ? 'disabled' : "",
                disabledClassBtnAcaoAvancar: item?.etapaAtiva?.numeroEtapa >= item.etapas?.length ? "disabledBtnAcao" : ""
            };

            if (item.etapaAtiva === undefined) {
                controleEtapaData.etapaAtualDescricao = "Tarefa não iniciada, aperte o Play abaixo";
                controleEtapaData.displayControle = "none";
                controleEtapaData.colorDescricaoTarefa = "red";
                controleEtapaData.numeroEtapa = 0;
            }else {
                controleEtapaData.etapaAtualDescricao = `${item.etapaAtiva.numeroEtapa} - ${item.etapaAtiva.descricaoEtapa}`;
                controleEtapaData.displayControle = "flex";
                controleEtapaData.colorDescricaoTarefa = "#20a017";
                controleEtapaData.numeroEtapa = item.etapaAtiva.numeroEtapa;
            }

            controleTaskDiv.appendChild(
                preencherTemplateAll(getTemplateById('controle-etapa-template'),
                controleEtapaData
                )
            );
        }
        else {
            item.targetLink = "_blank";
            item.tipoCard = 'card-book-or-video';
            item.srcTipoCardImage = 'images/book-tasks-gerenciamento.gif';
            item.buttonClass = 'card-book-or-video-btn';
            novoElemento = preencherTemplate(template, item);
            let iconDiv = novoElemento.firstElementChild;
            iconDiv.classList.add('icon-book');

            let controleTaskDiv = novoElemento.getElementsByClassName('containerEtapaOuPaginaAtual')[0];
            let controleEtapaData = {
                tarefaId: item.id,
                tipoTarefaId: item.tipoTarefaId,
                etapaAtualDescricao: "",
                displayControleEtapas: 'none',
                paginaOuVideoAtualDescricao: item.numeroPaginaOuVideoAtual,
                desabilitavoltar: item.numeroPaginaOuVideoAtual > 1 ? "" : 'disabled',
                disabledClassBtnAcaoVoltar: item.numeroPaginaOuVideoAtual > 1 ? "" : "disabledBtnAcao",
                desabilitaravancar: item.numeroPaginaOuVideoAtual >= item.qtdPaginasOuVideos ? 'disabled' : "",
                disabledClassBtnAcaoAvancar: item.numeroPaginaOuVideoAtual >= item.qtdPaginasOuVideos ? "disabledBtnAcao" : ""
            }; 

            if (item.numeroPaginaOuVideoAtual === 0) {
                controleEtapaData.paginaOuVideoAtualDescricao = "livro ou vídeos não iniciados, aperte o Play abaixo";
                controleEtapaData.displayControle = "none";
                controleEtapaData.colorDescricaoTarefa = "red";                
            }else {
                controleEtapaData.paginaOuVideoAtualDescricao = `Página/Vídeo: ${item.numeroPaginaOuVideoAtual} de ${item.qtdPaginasOuVideos}`;
                controleEtapaData.displayControle = "flex";
                controleEtapaData.colorDescricaoTarefa = "#20a017";
            }
            
            controleTaskDiv.appendChild(
                preencherTemplateAll(getTemplateById('controle-pagina-videoaula'),
                controleEtapaData
                )
            );            
        }
        
        container.appendChild(novoElemento);
    }); 
}

function getTemplateById(id) {
    return document.getElementById(id);
}

function AddEtapaParaSalvarPreviewTemplate(etapaItem, elementoContainerId) {
    // Obter o template e o container onde inserir o conteúdo
    const template = document.getElementById('etapas-para-salvar-preview-template');
    const container = document.getElementById(elementoContainerId);    
    // Preencher o template com os dados e inserir no container
    container.appendChild(preencherTemplate(template, etapaItem));    
}

function preencherTemplate(template, dado) {
    const regex = /\${(.*?)}/g;
    const html = template.innerHTML.replace(regex, (match, token) => dado[token.trim()]);    
    const div = document.createElement('div');         
    div.innerHTML = html;
    return div.firstElementChild;
}

function preencherTemplateAll(template, dado) {
    const regex = /\${(.*?)}/g;
    const html = template.innerHTML.replace(regex, (match, token) => dado[token.trim()]);    
    const div = document.createElement('div');         
    div.innerHTML = html;
    return div;
}

function ready(callback) {
    // in case the document is already rendered
    if (document.readyState!='loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

ready(() => {

    menuElement = document.querySelector(".menu"); 
    menuHeight = menuElement.offsetHeight;
 
    const nav = document.querySelector('.menu');
    
    //Eventos
    window.onscroll = function () { 
        if (document.body.scrollTop >= menuHeight - 100 || document.documentElement.scrollTop >= menuHeight) {
            nav.classList.add("menu-background");
        } 
        else {
            nav.classList.remove("menu-background");
        }
    };

    document.getElementById('tiposDeTarefa').addEventListener('change', function (e) {
        
        dataEtapasCadastro.tipoTarefa = e.target.value;
        switch (parseInt(dataEtapasCadastro.tipoTarefa)) {
            case TipoTarefa.CodarGamesAntigo.enum:
            case TipoTarefa.CodarMeuGame.enum:
                document.getElementById('etapasCadastroType').style.display = 'block';
                document.getElementById('qtdAulasPaginasCadastroType').style.display = 'none';
                break;  
            case TipoTarefa.EstudarLivro.enum:
            case TipoTarefa.EstudarVideoAula.enum:
                document.getElementById('qtdAulasPaginasCadastroType').style.display = 'block';
                document.getElementById('etapasCadastroType').style.display = 'none';
                break;
          }
    });
    // Fim Eventos

    loadTarefas(Status.Doing.enum);
});

async function loadTarefas(status) {

    console.log('status chegado do filtro ', status);

    if (status == undefined || status == null)
        status = Status.Doing.enum;

    showLoading();

    const response = await fetch(`/api/tarefas?status=${status}`);
    const itens = await response.json();

    const containerTarefas = document.getElementById('cards');
    containerTarefas.innerHTML = '';

    AddCardsTemplate(itens, 'cards');

    document
        .querySelectorAll('.btn-open-edit-popup').forEach((el) => {
            let id = el.getAttribute('data-id');            
            el.addEventListener("click", () => openEditPopup(id));
        });    
    
    hideLoading();

    const divsParaDestacar = document.querySelectorAll('.containerEtapaOuPaginaAtual');

    let destaqueDivEtapaOn = false;
    setInterval(
        () => {
            
            if (!destaqueDivEtapaOn) {
                divsParaDestacar.forEach((el) => {
                    el.classList.add('containerEtapaOuPaginaAtualDestaqueTime');    
                });
                destaqueDivEtapaOn = true;
            }
            else {
                divsParaDestacar.forEach((el) => {
                    el.classList.remove('containerEtapaOuPaginaAtualDestaqueTime');    
                });
                destaqueDivEtapaOn = false;
            }               
            
        }, 1000
    )

    document.getElementById('link-tarefas-em-andamento').classList.add('clicado');
}

async function avancarRetrocederTarefa(id, numeroEtapa, tipoTarefaId, isAvancar) {
    
    showLoading();
    
    const response = await fetch(`api/tarefas/avancar-retroceder/${id}`, {
        method: 'PUT',
        body: JSON.stringify(
            { 
                tipoTarefaId: tipoTarefaId,
                numeroOrdem: numeroEtapa,
                isAvancar: isAvancar
            }
        ),
        headers: {"Content-type": "application/json"}
    });

    await fetch(`/api/tarefas/atualizar-progresso/${id}`, {
        method: 'PUT',
        body: null 
    });

    const jsonResponse = await response.json();
    mostrarToast(jsonResponse.message);

    // Atualizar lista de tarefas
    loadTarefas();
    
    hideLoading();
}

async function iniciarTarefa(id, tipoTarefaId) {
    
    showLoading();
    
    const response = await fetch(`/api/tarefas/iniciar/${id}`, {
        method: 'PUT',
        body: JSON.stringify(
            { 
                tipoTarefaId: tipoTarefaId
            }
        ),
        headers: {"Content-type": "application/json"}
    });

    const jsonResponse = await response.json();
    mostrarToast(jsonResponse.message);

    // Atualizar lista de tarefas
    loadTarefas();
    
    hideLoading();
}

// Função para mostrar o loading
function showLoading() {
  document.getElementById('loading-overlay').style.display = 'block';
}

// Função para ocultar o loading
function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}

function openCadastroPopup() {    
    document.querySelector('.popup').style.display = 'block';
}

function openCadastroEtapaPopup() {
    document.getElementById('numeroEtapaDisplay').textContent = dataEtapasCadastro.numeroEtapa;
    // Abrir popup para adicionar etapas
    document.getElementById('etapasPopup').style.display = 'block';
}

// Função para adicionar campos de uma nova etapa
function addEtapa() {

    let descricaoEtapa = document.getElementById('descricaoEtapa').value; 
    dataEtapasCadastro.etapas.push({
        numeroEtapa: dataEtapasCadastro.numeroEtapa,
        descricaoEtapa: descricaoEtapa,
        status: Status.Todo
    });
    
    if (dataEtapasCadastro.idTarefa > 0) {
        var tabela = document.getElementById('edicaoTarefasTabela').getElementsByTagName('tbody')[0];
            
        // Criação de uma nova linha
        var novaLinha = tabela.insertRow();
        novaLinha.classList.add('etapaPendente');

        // Criação de novas células
        var celulaNumeroEtapa = novaLinha.insertCell(0);
        var celulaStatuEtapa = novaLinha.insertCell(1);
        var celulaDescricao = novaLinha.insertCell(2);
        var celulaAcao = novaLinha.insertCell(3);

        // Adição de dados nas células
        celulaNumeroEtapa.innerHTML = dataEtapasCadastro.numeroEtapa;
        celulaStatuEtapa.innerHTML = Status.Todo.description;
        celulaDescricao.innerHTML = descricaoEtapa;
        celulaAcao.innerHTML = `
            <button class="btnMoverOrdem" type="button" onclick="moverOrdemEtapa('anterior', ${dataEtapasCadastro.numeroEtapa})"><i class="fa fa-arrow-up" style="margin-left: 0px;padding:0px;vertical-align: middle;"></i></button>
            <button class="btnMoverOrdem" type="button" onclick="moverOrdemEtapa('proxima', ${dataEtapasCadastro.numeroEtapa})"><i class="fa fa-arrow-down" style="margin-left: 0px; padding:0px;vertical-align: middle;"></i></button>
        `;
    }
    else {
    
        AddEtapaParaSalvarPreviewTemplate(dataEtapasCadastro.etapas[dataEtapasCadastro.etapas.length-1], 'etapasParaSalvarPreview');
  
        dataEtapasCadastro.numeroEtapa++;
        document.getElementById('numeroEtapaDisplay').textContent = dataEtapasCadastro.numeroEtapa;
        document.getElementById('descricaoEtapa').value = '';
        document.getElementById('etapasParaSalvarPreview').style.display = 'block';
        document.getElementById('descricaoEtapa').focus();
    }    
}

function moverOrdemEtapa(target, numeroEtapa) {

    let ultimasTarefasFeitas = dataEtapasCadastro.etapas.filter((item) => item.status.enum == Status.Done.enum);
    ultimasTarefasFeitas = ultimasTarefasFeitas.sort((a, b) => a.numeroEtapa - b.numeroEtapa);
    const ultimaTarefaFeita = ultimasTarefasFeitas[ultimasTarefasFeitas.length - 1]?.numeroEtapa;
    
    const tarefaFazendo = dataEtapasCadastro.etapas.find((item) => item.status.enum == Status.Doing.enum)?.numeroEtapa;
    
    switch (target) {
        case "anterior":
            var etapaEdit = dataEtapasCadastro.etapas.find((item) => item.numeroEtapa == numeroEtapa);
            var etapaAnteriorEdit = dataEtapasCadastro.etapas.find((item) => item.numeroEtapa == numeroEtapa  -1);
            
            if (!etapaEdit || !etapaAnteriorEdit) return;
            
            etapaEdit.numeroEtapa -= 1;
            etapaAnteriorEdit.numeroEtapa += 1;

            break;
        case "proxima":
            var etapaEdit = dataEtapasCadastro.etapas.find((item) => item.numeroEtapa == numeroEtapa);
            var etapaPosteriorEdit = dataEtapasCadastro.etapas.find((item) => item.numeroEtapa == numeroEtapa + 1);
            
            if (!etapaEdit || !etapaPosteriorEdit) return;
            
            etapaEdit.numeroEtapa += 1;
            etapaPosteriorEdit.numeroEtapa -= 1;

            break;
    }

    dataEtapasCadastro.etapas = dataEtapasCadastro.etapas.sort((a, b) => a.numeroEtapa - b.numeroEtapa);

    dataEtapasCadastro.etapas.forEach((e) => {
               
        if (e.numeroEtapa <= ultimaTarefaFeita)
            e.status = Status.Done;
        else if (e.numeroEtapa == tarefaFazendo)
            e.status = Status.Doing;        
        else
            e.status = Status.Todo;
    });

    updateEditEtapasTarefas();
}

// Função para fechar popup de adicionar etapas
function fecharEtapasPopup() {
    // Transferir etapas para o formulário principal
    // Fechar popup de adicionar etapas
    document.getElementById('etapasPopup').style.display = 'none';
}

function fecharEditFormTarefa() {
    document.getElementById('editPopup').style.display = 'none';
}

function fecharFormNovaTarefa() {
    document.getElementById('novaTarefaPopup').style.display = 'none';
}

//novaTarefaPopup

// Função para salvar nova tarefa
async function saveNovaTarefa() {

    showLoading();
    
    if (!novaTarefaDadosValidos()) {
        hideLoading();
        return;
    } 

    var qtdPaginasOuVideos = document.getElementById('qtdPaginasOuVideos').value;

    const response = await fetch('/api/tarefas', {
        method: 'POST',
        body: JSON.stringify({
            status: Status.Todo.enum,
            titulo: document.getElementById('titulo').value,
            qtdPaginasOuVideos: qtdPaginasOuVideos,
            descricao: document.getElementById('descricaoDetalhada').value,
            etapas: dataEtapasCadastro.etapas,
            tipoTarefa: dataEtapasCadastro.tipoTarefa,
            linkReferencia: document.getElementById('linkReferencia').value
        }),
        headers: {"Content-type": "application/json"}
    });
    // Fechar popup após salvar
    document.querySelector('.popup').style.display = 'none';

    const jsonResponse = await response.json();
    mostrarToast(jsonResponse.message);

    // Atualizar lista de tarefas
    await loadTarefas();
    
    hideLoading();
}

async function saveTarefa() {
    
    const tarefaId = dataEtapasCadastro.idTarefa;

    const response = await fetch(`/api/tarefas/${tarefaId}`, {
        method: 'PUT',
        body: JSON.stringify({
            status: Status.Todo.enum,
            titulo: document.getElementById('editTitulo').value,
            qtdPaginasOuVideos: document.getElementById('qtdPaginasOuVideosEdit').value,
            descricaoDetalhada: document.getElementById('editDescricaoDetalhada').value,
            etapas: dataEtapasCadastro.etapas,
            linkReferencia: document.getElementById('linkReferenciaEdit').value
        }),
        headers: {"Content-type": "application/json"}
    });

    await fetch(`/api/tarefas/atualizar-progresso/${tarefaId}`, {
        method: 'PUT',
        body: null 
    });

    const jsonResponse = await response.json();
    mostrarToast(jsonResponse.message);

    // Fechar popup após salvar
    document.getElementById('editPopup').style.display = 'none';

    // Atualizar lista de tarefas
    await loadTarefas();
}

function novaTarefaDadosValidos() {
    
    if (document.getElementById('titulo').value == '' ||
        document.getElementById('titulo').value == null
    || document.getElementById('titulo').value == undefined) {
        alert('Título da tarefa obrigatório');
        return false;
    }
    
    if (dataEtapasCadastro.tipoTarefa == 0) {
        alert('Obrigatório o tipo da tarefa');
        return false;
    }

    if (document.getElementById('descricaoDetalhada').value === ''
        || document.getElementById('descricaoDetalhada').value === null
        || document.getElementById('descricaoDetalhada').value === undefined) {
        alert('Descrição detalhada é obrigatório');
        return false;
        }

    var qtdPaginasOuVideos = document.getElementById('qtdPaginasOuVideos').value;

    if (qtdPaginasOuVideos <= 0
        && (dataEtapasCadastro.tipoTarefa == TipoTarefa.EstudarLivro.enum
            || dataEtapasCadastro.tipoTarefa == TipoTarefa.EstudarVideoAula.enum))
    {
        alert('Quantidade de páginas ou vídeos é obrigatório para o tipo da tarefa');
        return false;
    }    

    if (
        (dataEtapasCadastro.tipoTarefa == TipoTarefa.CodarGamesAntigo.enum
            || dataEtapasCadastro.tipoTarefa == TipoTarefa.CodarMeuGame.enum)
        && dataEtapasCadastro.etapas.length <= 0
    ) {
        alert('Obrigatório cadastro das etapas para o tipo de tarefa');
        return false;
    }

    return true;
}

// Função para abrir popup de edição com as etapas da tarefa
async function openEditPopup(tarefaId) {

    const response = await fetch(`/api/tarefas/${tarefaId}`);
    const tarefa = await response.json();
    dataEtapasCadastro.etapas = tarefa.etapas;
    dataEtapasCadastro.idTarefa = tarefa.id;
    dataEtapasCadastro.tipoTarefa = tarefa?.tipoTarefa;
    dataEtapasCadastro.numeroEtapa = tarefa?.etapas[tarefa?.etapas?.length - 1]?.numeroEtapa + 1;
    
    console.log('qtdPaginasOuVideos', tarefa?.qtdPaginasOuVideos);
    // Preencher os inputs com os valores atuais da tarefa
    document.getElementById('tarefaId').value = tarefa?.id;
    document.getElementById('editTitulo').value = tarefa?.titulo;
    document.getElementById('editDataInicio').textContent = formatDate(tarefa?.dataInicio);
    document.getElementById('editDescricaoDetalhada').textContent = tarefa?.descricaoDetalhada;
    document.getElementById('qtdPaginasOuVideosEdit').value = tarefa?.qtdPaginasOuVideos;
    document.getElementById('linkReferenciaEdit').value = tarefa?.linkReferencia;
    
    document.getElementById('editTipoTarefa').textContent = tarefa?.tipoTarefa?.description;

    // Limpar o container de etapas
    const etapasContainer = document.getElementById('editEtapasContainer');
    etapasContainer.innerHTML = '';

    // Adicionar as etapas da tarefa ao container
    tarefa.etapas.forEach(etapa => {
        const tr = document.createElement('tr');
        switch (etapa?.status?.enum) {
            case Status.Todo.enum:
                tr.classList.add('etapaPendente');                
                break;
            case Status.Doing.enum:
                tr.classList.add('etapaFazendo');
                break;
            case Status.Done.enum:
                tr.classList.add('etapaFeita');
                break;
        }
            
        tr.innerHTML = `
            <td>${etapa.numeroEtapa}</td>
            <td>${etapa?.status?.description}</td>
            <td>${etapa.descricaoEtapa}</td>
            <td>
                <button class="btnMoverOrdem" type="button" onclick="moverOrdemEtapa('anterior', ${etapa.numeroEtapa})"><i class="fa fa-arrow-up" style="margin-left: 0px;padding:0px;vertical-align: middle;"></i></button>
                <button class="btnMoverOrdem" type="button" onclick="moverOrdemEtapa('proxima', ${etapa.numeroEtapa})"><i class="fa fa-arrow-down" style="margin-left: 0px; padding:0px;vertical-align: middle;"></i></button>
            </td>            
        `;
        etapasContainer.appendChild(tr);
    });

    switch (tarefa?.tipoTarefa?.enum) {
        case TipoTarefa.CodarGamesAntigo.enum:
        case TipoTarefa.CodarMeuGame.enum:
            document.getElementById('editEtapasTarefa').style.display = 'block';
            document.getElementById('editQtdNumeroPaginasOuVideos').style.display = 'none';
            break;
        case TipoTarefa.EstudarLivro.enum:
        case TipoTarefa.EstudarVideoAula.enum:
            document.getElementById('editQtdNumeroPaginasOuVideos').style.display = 'block';
            document.getElementById('editEtapasTarefa').style.display = 'none';
            break;
    }
    
    document.getElementById('editPopup').style.display = 'block';    
}

function updateEditEtapasTarefas() {

    // Limpar o container de etapas
    const etapasContainer = document.getElementById('editEtapasContainer');
    etapasContainer.innerHTML = '';

    //dataEtapasCadastro.etapas = dataEtapasCadastro.etapas.sort((a, b) => a.numeroEtapa - b.numeroEtapa);
    // Adicionar as etapas da tarefa ao container
    dataEtapasCadastro.etapas.forEach(etapa => {
        const tr = document.createElement('tr');
        switch (etapa?.status?.enum) {
            case Status.Todo.enum:
                tr.classList.add('etapaPendente');                
                break;
            case Status.Doing.enum:
                tr.classList.add('etapaFazendo');
                break;
            case Status.Done.enum:
                tr.classList.add('etapaFeita');
                break;
        }
            
        tr.innerHTML = `
            <td>${etapa.numeroEtapa}</td>
            <td>${etapa?.status?.description}</td>
            <td>${etapa.descricaoEtapa}</td>
            <td>
                <button class="btnMoverOrdem" type="button" onclick="moverOrdemEtapa('anterior', ${etapa.numeroEtapa})"><i class="fa fa-arrow-up" style="margin-left: 0px;padding:0px;vertical-align: middle;"></i></button>
                <button class="btnMoverOrdem" type="button" onclick="moverOrdemEtapa('proxima', ${etapa.numeroEtapa})"><i class="fa fa-arrow-down" style="margin-left: 0px; padding:0px;vertical-align: middle;"></i></button>
            </td>            
        `;
        etapasContainer.appendChild(tr);
    });
}

document.addEventListener('keyup', event => {
    if (event.key == 'Escape') {
        document.getElementById('editPopup').style.display = 'none';
        document.getElementById('novaTarefaPopup').style.display = 'none';
        document.getElementById('etapasPopup').style.display = 'none';
    }    
});

document.addEventListener('click', event => {
    if (event.target === document.getElementById('editPopup')) 
        document.getElementById('editPopup').style.display = 'none';    
    if (event.target === document.getElementById('novaTarefaPopup'))
        document.getElementById('novaTarefaPopup').style.display = 'none';
});

function formatDate(date) {
    if (date === null || date === undefined || date === '')
        return '-';
    let dateString = date.toString(); 
    let ano = dateString.substr(0, 4);
    let mes = dateString.substr(4, 2);
    let dia = dateString.substr(6, 2);
    return new Date(ano, mes, dia).toLocaleDateString();
}

async function filtrar(status, linkElemento) {

    await loadTarefas(status.enum);

    var linksFiltro = document.querySelectorAll('.filtro');

    linksFiltro.forEach((el) => {
        el.classList.remove('clicado'); 
    });

    linkElemento.classList.add('clicado');
}

function mostrarToast(msg) {
    var toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}