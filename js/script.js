
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
  const div = document.getElementsByTagName("div");
  div[1].classList.remove("ocultar");
}

// Inicializa MT
function exibirMt(){

  // Mostra fita
  const div = document.getElementsByTagName("div");
  div[2].classList.remove("ocultar");
  div[3].classList.remove("ocultar");

  // Transforma texto em objeto
  const obj = JSON.parse(texto);
  var input = document.querySelector("#palavra");
  palavra = obj["SimboloBranco"] + input.value + obj["SimboloBranco"]; // Simbolo branco final da palavra
  var cont = 0; // Identificador das celulas da fita

  // Pega div que representa a fita do MT
  var fita = document.getElementById("fita");

  // Se ja existe lista, remove Lista
  if (fita.children){
    fita.removeChild(fita.children[1]);
  }

  // Cria uma nova lista
  var ul = document.createElement("ul");
  
  // Inserindo palavra na fita
  for (elemento of palavra){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(elemento));
    li.setAttribute("id", cont);
    ul.appendChild(li);
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

// Marca as celulas de acordo com que vai andando na fita
function marcaCelula(pos, direcao, trEntrada, trSaida, i){
  setTimeout(function () {

    var celulaAnterior = document.getElementById(pos-direcao);
    celulaAnterior.classList.remove("destacaCelula");

    var celula = document.getElementById(pos);
    celula.classList.add("destacaCelula");
    celula.innerHTML = trSaida[1];

    const p = document.getElementById("transicao");
    p.innerHTML = trEntrada + " -> " + trSaida;
  }, 1000 * i);
}

// Função para iniciar execução da Maquina de Turing
function executaMT(){

  const obj = JSON.parse(texto);
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
    console.log(entrada);
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

  // Espera execução na fina e exibi na tela se a palvra é aceita ou rejeitada.
  setTimeout(function () {
    finalizacaoMt(msgFinal);
  }, 1000 * i);
}

// Exibi mensagem no final da execução
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function finalizacaoMt(msg){
  var p = document.getElementById("msg");
  p.innerHTML = msg;
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}