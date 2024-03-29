
const radio = document.getElementsByName("opcaoradio");
var radioMT = "";

for (const op of radio) {
  op.addEventListener("change", function(){

    fetchData();
    const sectionIMP = document.getElementById("arquivo");
    const sectionSEL = document.getElementById("selectArq");
    radioMT = this.value;

    if(this.checked && this.value == "selectMT"){
      sectionSEL.classList.remove("ocultar");
      sectionIMP.classList.add("ocultar");
    } else if (this.checked && this.value == "impMT"){
      sectionIMP.classList.remove("ocultar");
      sectionSEL.classList.add("ocultar");
    }
  });
}


// Revisar código
const select = document.getElementById("opcoesMT");
var data;

async function fetchData() {
  try {
    const response = await fetch("mts/"+select.value);
    const responseData = await response.json();
    data = responseData; // atribui os dados à variável data
  } catch (error) {
    console.error('Erro:', error);
  }
}

// fetchData();


var texto; // maquina de turing
var palavra; // Palavra a ser aceita pela MT


// Lendo arquivo
function readSingleFile(evt) {

  var f = evt.target.files[0]; 

  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      texto = e.target.result;
    }
    r.readAsText(f);
  } else { 
    alert("Failed to load file");
  }
}

// Chama a função para ler arquivo apos inserir o mesmo
document.getElementById('fileinput').addEventListener('change', readSingleFile, false);

// Abre menu para inserir palavra
function abrirOp(){
  const section = document.getElementsByTagName("section");
  section[3].classList.remove("ocultar");
  fetchData();
}

// Inicializa MT
function exibirMt(){

  // Mostra fita
  const section = document.getElementsByTagName("section");
  section[4].classList.remove("ocultar");
  section[5].classList.remove("ocultar");

  var obj = data;

  if (radioMT == "impMT"){
    obj = JSON.parse(texto);
  }

  // Transforma texto em objeto

  var input = document.querySelector("#palavra");
  palavra = obj["SimboloBranco"] + input.value + obj["SimboloBranco"]; // Simbolo branco final da palavra
  var cont = 0; // Identificador das celulas da fita

  // Pega section que representa a fita do MT
  var fita = document.getElementById("fita");

  // Se ja existe lista, remove Lista
  if (fita.querySelector("ul")){
    fita.removeChild(fita.children[1]);
  }

  // Cria uma nova lista
  var ul = document.createElement("ul");
  
  // Inserindo palavra na fita
  for (elemento of palavra){
    var li = document.createElement("li");
    var div = document.createElement("div");
    
    li.appendChild(document.createTextNode(elemento));
    li.setAttribute("id", cont);

    div.classList.add("marcador-fita");
    div.appendChild(li);

    ul.appendChild(div);
    fita.appendChild(ul);
    cont++;
  } 

  // Inicia MT
  executaMT();
}

// Identifica a proxima transição da MT
function transicaoSaida(obj, estado, proxElemento){

  var result = [];

  for (var [key,value] of Object.entries(obj["Transicao"])){
    var entrada = key.split("-");
    var saida = value.split(",");
    
    if (entrada[0] == estado && entrada[1] == proxElemento){
      result.push(entrada);
      result.push(saida);

      return result;
    }
  }
  return "erro";
}

const range = document.getElementById("slider");
const rangeValue = document.getElementById("rangeValue");

range.addEventListener("input", function() {
    rangeValue.textContent = range.value;
});

// Marca as celulas de acordo com que vai andando na fita
function marcaCelula(pos, direcao, trEntrada, trSaida, i){
  setTimeout(function () {

    // Remove marcador da celula anterior e remove icone de marcação
    var celulaAnterior = document.getElementById(pos-direcao);
    var iconeAnterior = celulaAnterior.nextElementSibling;

    if(iconeAnterior != null){
      iconeAnterior.remove();
    }

    celulaAnterior.classList.remove("destacaCelula");
    
    // Cria icone de marcação
    const icone = document.createElement("i");
    icone.classList.add("fa-solid", "fa-angle-up", "fa-beat");

    var celula = document.getElementById(pos);
    celula.classList.add("destacaCelula");
    celula.insertAdjacentElement("afterend", icone);
    celula.innerHTML = trSaida[1];

    const transEntrada = document.getElementById("transicao-entrada");
    const transSaida = document.getElementById("transicao-saida");

    transEntrada.innerHTML = 
    "Estado Origem: " + trEntrada[0] + "\n" +
    " Ler Fita: " + trEntrada[1];

    transSaida.innerHTML =
    "Estado Destino: "+ trSaida[0] +
    " Escreve Fita: " + trSaida[1] +
    " Direção Fita: " + trSaida[2];

  }, range.value * 1000 * i);
}

const inptPalavra = document.getElementById("palavra");
const inptRanger = document.getElementById("slider");
const buttonPlay = document.getElementById("playMt");

// Função para iniciar execução da Maquina de Turing
function executaMT(){

  // Desce até o final da página
  window.scrollTo(0, document.body.scrollHeight);

  //Desabilita inputs e botão de execução
  inptPalavra.disabled = true;
  inptRanger.disabled = true;
  buttonPlay.disabled = true;

  var obj = data;

  if (radioMT == "impMT"){
    obj = JSON.parse(texto);
  }


  var fita = palavra.split("");
  var estado = obj["EstadoInicial"];
  var pos = 1; // identifica posicao na fita
  var proxElemento = "";
  var direcao = 0; // Qual direcao vai a fita
  var msgFinal;
  var i = 0; // Contabilizador de tempo na execução das transições na tela

  // Andar pelo vetor
  while(1){

    proxElemento = fita[pos];

    // Retorna resultado da transicao
    var transicao = transicaoSaida(obj, estado, proxElemento);
    var entrada = transicao[0];
    var saida = transicao[1];
    estado = saida[0];
    fita[pos] = saida[1];
    
    if (transicao == "erro"){
        msgFinal = "Palavra não aceita";
        break;
    }

    marcaCelula(pos, direcao, entrada, saida, i);


    if (saida[2] == 'R'){
      direcao = 1;
      pos++;
    } else{
      direcao = -1;
      pos--;
    }

    if (obj["EstadosFinais"].indexOf(estado) > -1){
      msgFinal = "Palavra aceita";
      break;
    }

    i++;
  }

  // Espera execução na fita e exibi na tela se a palvra é aceita ou rejeitada.
  setTimeout(function () {
    finalizacaoMt(msgFinal, pos-direcao);
  }, range.value * 1000 * i);
}


// Exibi mensagem no final da execução
var modal = document.getElementById("modalFim");
var span = document.getElementsByClassName("close")[0];

function finalizacaoMt(msg, pos){
  var p = document.getElementById("msg");
  p.innerHTML = msg;
  modal.style.display = "block";

  // Remover o destaque da ultima celula mostrada
  var celula = document.getElementById(pos);
  var iconeAnterior = celula.nextElementSibling;
  iconeAnterior.remove();
}

span.onclick = function() {
  modal.style.display = "none";

  const section = document.getElementsByTagName("section");

  section[5].classList.add("ocultar");

  //Habilita inputs de execução
  inptPalavra.disabled = false;
  inptRanger.disabled = false;
  buttonPlay.disabled = false;
}


// Exibir modal Help
var modalHelp = document.getElementById("modalHelp");
const help = document.getElementById("help");
const fecharHelp = document.getElementById("fecharHelp");

help.onclick = function(){
  modalHelp.style.display = "block";
}


fecharHelp.onclick = function(){
  modalHelp.style.display = "none";
}