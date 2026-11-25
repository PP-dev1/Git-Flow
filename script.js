const CHAVE_ARMAZENAMENTO = "taskflow.tarefas";
const TEMPO_CARREGAMENTO = 600;

const ROTULOS_PRIORIDADE = { alta: "Alta", media: "Média", baixa: "Baixa" };

const formulario = document.getElementById("formulario-tarefa");
const cartaoFormulario = document.getElementById("cartao-formulario");
const secaoFormulario = document.getElementById("secao-formulario");
const rotuloFormulario = document.getElementById("formulario-rotulo");
const tituloFormulario = document.getElementById("titulo-formulario");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");

const campoNome = document.getElementById("campo-nome");
const campoDescricao = document.getElementById("campo-descricao");
const campoCategoria = document.getElementById("campo-categoria");
const campoPrioridade = document.getElementById("campo-prioridade");
const campoPrazo = document.getElementById("campo-prazo");

const camposValidados = {
  nome: campoNome,
  categoria: campoCategoria,
  prioridade: campoPrioridade,
  prazo: campoPrazo,
};

const filtroBusca = document.getElementById("filtro-busca");
const filtroPrioridade = document.getElementById("filtro-prioridade");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroStatus = document.getElementById("filtro-status");
const botaoLimpar = document.getElementById("botao-limpar");

const listaTarefas = document.getElementById("lista-tarefas");
const modeloTarefa = document.getElementById("modelo-tarefa");
const contagemTarefas = document.getElementById("contagem-tarefas");
const estadoVazio = document.getElementById("estado-vazio");
const estadoVazioTitulo = document.getElementById("estado-vazio-titulo");
const estadoVazioTexto = document.getElementById("estado-vazio-texto");

const resumoContagem = document.getElementById("resumo-contagem");
const resumoRotulo = document.getElementById("resumo-rotulo");
const resumoPorcentagem = document.getElementById("resumo-porcentagem");
const barraProgresso = document.getElementById("barra-progresso");

const mensagem = document.getElementById("mensagem");

let tarefas = carregarTarefas();
let idEmEdicao = null;
let idNovaTarefa = null;
let cadastrando = false;
let temporizadorMensagem;

function carregarTarefas() {
  try {
    const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (salvo !== null) {
      const lista = JSON.parse(salvo);
      if (Array.isArray(lista)) return lista;
    }
  } catch (erro) {
  }
  return [];
}

function salvarTarefas() {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(tarefas));
  } catch (erro) {
    mostrarMensagem("Não foi possível salvar as tarefas neste navegador.", "erro");
  }
}

function hojeISO() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function textoTarefas(quantidade) {
  return quantidade === 1 ? "1 tarefa" : `${quantidade} tarefas`;
}

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className = `toast toast--${tipo} toast--visivel`;
  clearTimeout(temporizadorMensagem);
  temporizadorMensagem = setTimeout(() => {
    mensagem.classList.remove("toast--visivel");
  }, 3500);
}

function lerFormulario() {
  return {
    nome: campoNome.value.trim(),
    descricao: campoDescricao.value.trim(),
    categoria: campoCategoria.value,
    prioridade: campoPrioridade.value,
    prazo: campoPrazo.value,
  };
}

function validarDados(dados) {
  const erros = {};

  if (dados.nome === "") {
    erros.nome = "Digite uma tarefa antes de adicionar.";
  } else if (dados.nome.length < 3) {
    erros.nome = "O nome deve ter pelo menos 3 caracteres.";
  }

  if (dados.categoria === "") erros.categoria = "Selecione uma categoria.";
  if (dados.prioridade === "") erros.prioridade = "Selecione a prioridade.";

  if (dados.prazo === "") {
    erros.prazo = "Informe o prazo de entrega.";
  } else if (idEmEdicao === null && dados.prazo < hojeISO()) {
    erros.prazo = "O prazo não pode ser uma data passada.";
  }

  return erros;
}

function mostrarErro(nomeCampo, texto) {
  const erro = document.getElementById(`erro-${nomeCampo}`);
  erro.textContent = texto;
  erro.hidden = false;
  camposValidados[nomeCampo].setAttribute("aria-invalid", "true");
}

function limparErro(nomeCampo) {
  const erro = document.getElementById(`erro-${nomeCampo}`);
  erro.textContent = "";
  erro.hidden = true;
  camposValidados[nomeCampo].removeAttribute("aria-invalid");
}

function limparErros() {
  Object.keys(camposValidados).forEach(limparErro);
}

function iniciarCarregamento() {
  cadastrando = true;
  botaoSalvar.disabled = true;
  botaoSalvar.classList.add("btn--loading");
  botaoSalvar.textContent = "Adicionando...";
}

function finalizarCarregamento() {
  cadastrando = false;
  botaoSalvar.disabled = false;
  botaoSalvar.classList.remove("btn--loading");
  atualizarModoFormulario();
}

function concluirEnvio() {
  salvarTarefas();
  sairDoModoEdicao();
  renderizar();
}

function aoEnviarFormulario(evento) {
  evento.preventDefault();
  if (cadastrando) return;

  const dados = lerFormulario();
  const erros = validarDados(dados);
  limparErros();

  const camposComErro = Object.keys(erros);
  if (camposComErro.length > 0) {
    camposComErro.forEach((nomeCampo) => mostrarErro(nomeCampo, erros[nomeCampo]));
    camposValidados[camposComErro[0]].focus();
    mostrarMensagem("Corrija os campos destacados.", "erro");
    return;
  }

  if (idEmEdicao !== null) {
    atualizarTarefa(idEmEdicao, dados);
    concluirEnvio();
    return;
  }

  iniciarCarregamento();
  setTimeout(() => {
    cadastrarTarefa(dados);
    concluirEnvio();
    finalizarCarregamento();
  }, TEMPO_CARREGAMENTO);
}

function cadastrarTarefa(dados) {
  const novaTarefa = { id: Date.now(), ...dados, concluida: false };
  tarefas.push(novaTarefa);
  idNovaTarefa = novaTarefa.id;
  mostrarMensagem("Tarefa cadastrada com sucesso.");
}

function atualizarTarefa(id, dados) {
  const tarefa = tarefas.find((item) => item.id === id);
  Object.assign(tarefa, dados);
  mostrarMensagem("Tarefa atualizada com sucesso.");
}

function iniciarEdicao(id) {
  const tarefa = tarefas.find((item) => item.id === id);

  campoNome.value = tarefa.nome;
  campoDescricao.value = tarefa.descricao;
  campoCategoria.value = tarefa.categoria;
  campoPrioridade.value = tarefa.prioridade;
  campoPrazo.value = tarefa.prazo;

  idEmEdicao = id;
  limparErros();
  atualizarModoFormulario();
  renderizar();

  secaoFormulario.scrollIntoView();
  campoNome.focus({ preventScroll: true });
}

function sairDoModoEdicao() {
  idEmEdicao = null;
  formulario.reset();
  limparErros();
  atualizarModoFormulario();
}

function atualizarModoFormulario() {
  const editando = idEmEdicao !== null;
  rotuloFormulario.textContent = editando ? "EDIÇÃO" : "CADASTRO";
  tituloFormulario.textContent = editando ? "Editar tarefa" : "Nova tarefa";
  botaoSalvar.textContent = editando ? "Salvar alterações" : "Cadastrar tarefa";
  botaoCancelar.hidden = !editando;
  cartaoFormulario.classList.toggle("form-card--editando", editando);
}

function alternarStatus(id) {
  const tarefa = tarefas.find((item) => item.id === id);
  tarefa.concluida = !tarefa.concluida;
  salvarTarefas();
  renderizar();
  mostrarMensagem(tarefa.concluida ? "Tarefa marcada como concluída." : "Tarefa marcada como pendente.");
}

function excluirTarefa(id) {
  const tarefa = tarefas.find((item) => item.id === id);
  if (!confirm(`Excluir a tarefa "${tarefa.nome}"?`)) return;

  tarefas = tarefas.filter((item) => item.id !== id);
  if (id === idEmEdicao) sairDoModoEdicao();
  salvarTarefas();
  renderizar();
  mostrarMensagem("Tarefa excluída.");
}

function existeFiltroAtivo() {
  return (
    filtroBusca.value.trim() !== "" ||
    filtroPrioridade.value !== "" ||
    filtroCategoria.value !== "" ||
    filtroStatus.value !== ""
  );
}

function filtrarTarefas() {
  const busca = normalizarTexto(filtroBusca.value.trim());

  return tarefas.filter((tarefa) => {
    const statusDaTarefa = tarefa.concluida ? "concluida" : "pendente";

    const passaBusca = normalizarTexto(tarefa.nome).includes(busca);
    const passaPrioridade = filtroPrioridade.value === "" || tarefa.prioridade === filtroPrioridade.value;
    const passaCategoria = filtroCategoria.value === "" || tarefa.categoria === filtroCategoria.value;
    const passaStatus = filtroStatus.value === "" || statusDaTarefa === filtroStatus.value;

    return passaBusca && passaPrioridade && passaCategoria && passaStatus;
  });
}

function limparFiltros() {
  filtroBusca.value = "";
  filtroPrioridade.value = "";
  filtroCategoria.value = "";
  filtroStatus.value = "";
  renderizar();
}

function atualizarResumo() {
  const total = tarefas.length;
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;
  const porcentagem = total === 0 ? 0 : Math.round((concluidas / total) * 100);

  resumoContagem.textContent = `${concluidas} de ${total}`;
  resumoRotulo.textContent = total === 1 ? "tarefa concluída" : "tarefas concluídas";
  resumoPorcentagem.textContent = `${porcentagem}%`;
  barraProgresso.value = porcentagem;
  barraProgresso.textContent = `${porcentagem}%`;
  barraProgresso.setAttribute("aria-label", `Progresso das tarefas: ${concluidas} de ${total} concluídas`);
}

function criarCartao(tarefa) {
  const cartao = modeloTarefa.content.firstElementChild.cloneNode(true);
  const atrasada = !tarefa.concluida && tarefa.prazo < hojeISO();

  cartao.dataset.id = tarefa.id;
  cartao.dataset.prioridade = tarefa.prioridade;
  cartao.classList.toggle("task-card--done", tarefa.concluida);
  cartao.classList.toggle("task-card--new", tarefa.id === idNovaTarefa);
  cartao.classList.toggle("task-card--editing", tarefa.id === idEmEdicao);

  const marcador = cartao.querySelector(".task-marker");
  marcador.textContent = tarefa.concluida ? "✓" : "";
  marcador.setAttribute("aria-pressed", String(tarefa.concluida));
  marcador.setAttribute(
    "aria-label",
    `${tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída"}: ${tarefa.nome}`
  );

  cartao.querySelector(".task-name").textContent = tarefa.nome;

  const descricao = cartao.querySelector(".task-description");
  if (tarefa.descricao) {
    descricao.textContent = tarefa.descricao;
  } else {
    descricao.remove();
  }

  cartao.querySelector(".badge").textContent = `Prioridade ${ROTULOS_PRIORIDADE[tarefa.prioridade].toLowerCase()}`;
  cartao.querySelector(".meta-category").textContent = tarefa.categoria;

  const prazo = cartao.querySelector(".meta-deadline");
  prazo.textContent = `Prazo: ${formatarData(tarefa.prazo)}${atrasada ? " · atrasada" : ""}`;
  prazo.classList.toggle("meta-item--late", atrasada);

  const status = cartao.querySelector(".status");
  status.textContent = tarefa.concluida ? "Concluída" : "Pendente";
  status.classList.add(tarefa.concluida ? "status--done" : "status--pending");

  cartao.querySelector('[data-acao="editar"]').setAttribute("aria-label", `Editar tarefa: ${tarefa.nome}`);
  cartao.querySelector('[data-acao="excluir"]').setAttribute("aria-label", `Excluir tarefa: ${tarefa.nome}`);

  return cartao;
}

function renderizarLista(tarefasVisiveis) {
  listaTarefas.innerHTML = "";
  tarefasVisiveis.forEach((tarefa) => listaTarefas.appendChild(criarCartao(tarefa)));
  idNovaTarefa = null;

  const semResultados = tarefasVisiveis.length === 0;
  estadoVazio.hidden = !semResultados;
  if (tarefas.length === 0) {
    estadoVazioTitulo.textContent = "Nenhuma tarefa cadastrada";
    estadoVazioTexto.textContent = "Use o formulário acima para cadastrar sua primeira tarefa.";
  } else {
    estadoVazioTitulo.textContent = "Nenhuma tarefa encontrada";
    estadoVazioTexto.textContent = "Ajuste a pesquisa ou os filtros para ver outras tarefas.";
  }
}

function atualizarContagem(quantidadeVisivel) {
  const filtrando = existeFiltroAtivo();
  contagemTarefas.textContent = filtrando
    ? `${quantidadeVisivel} de ${textoTarefas(tarefas.length)}`
    : textoTarefas(tarefas.length);
  botaoLimpar.hidden = !filtrando;
}

function renderizar() {
  const tarefasVisiveis = filtrarTarefas();
  atualizarResumo();
  renderizarLista(tarefasVisiveis);
  atualizarContagem(tarefasVisiveis.length);
}

formulario.addEventListener("submit", aoEnviarFormulario);
botaoCancelar.addEventListener("click", () => {
  sairDoModoEdicao();
  renderizar();
});

formulario.addEventListener("input", (evento) => {
  if (camposValidados[evento.target.name]) limparErro(evento.target.name);
});

listaTarefas.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-acao]");
  if (!botao || cadastrando) return;

  const id = Number(botao.closest(".task-card").dataset.id);
  const acao = botao.dataset.acao;

  if (acao === "alternar") alternarStatus(id);
  if (acao === "editar") iniciarEdicao(id);
  if (acao === "excluir") excluirTarefa(id);
});

[filtroBusca, filtroPrioridade, filtroCategoria, filtroStatus].forEach((filtro) => {
  filtro.addEventListener("input", renderizar);
});
botaoLimpar.addEventListener("click", limparFiltros);

renderizar();
