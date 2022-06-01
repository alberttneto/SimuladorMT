
var texto; // Texto do arquivo
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


function exibirMt(){
  // Transforma texto em objeto
  const obj = JSON.parse(texto);
  var input = document.querySelector("#palavra");
  var cont = 0;
  palavra = input.value + obj["SimboloBranco"]; 

  // Pega div que representa a fita do MT
  var fita = document.getElementById("fita");

  // Se ja existe lista, remove Lista
  if (fita.children){
    fita.removeChild(fita.children[0]);
  }

  // Cria uma nova lista
  var ul = document.createElement("ul");
  
  for (elemento of palavra){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(elemento));
    li.setAttribute("id", cont);
    ul.appendChild(li);
    fita.appendChild(ul);
    cont++;
  } 

  executaMT();
}

function transicaoSaida(obj, estado, proxElemento){
  for (var [key,value] of Object.entries(obj["Transicao"])){
      var entrada = key.split("-")
      var saida = value.split(",")
      //console.log(saida)
      if (entrada[0] == estado && entrada[1] == proxElemento){
          //estado = saida[0];
          //palavra[pos] = saida[1];
          return saida;
      }
  }
  return "erro"
}

function executaMT(){
  fita = palavra.split("");
  const obj = JSON.parse(texto);
  var estado = obj["EstadoInicial"], pos = 0;
  var proxElemento = "";
  console.log(estado);
  console.log(fita);

  // Andar pelo vetor
  while(1){
    proxElemento = fita[pos];
    
    console.log(celula);
    
    console.log(estado);
    console.log(proxElemento);
    var saida = transicaoSaida(obj, estado, proxElemento);
    if (saida == "erro"){
        console.log("Palavra não aceita")
        break;
    }
    console.log(saida)
    estado = saida[0];
    fita[pos] = saida[1];
    console.log(fita)
    
    var celula = document.getElementById(pos);
    celula.classList.toggle("destacaCelula");
    if (saida[2] == 'R'){
        pos++;
    } else{
        pos--;
    }
    celula = document.getElementById(pos);
    //celula.classList.toggle("destacaCelula");

    if (obj["EstadosFinais"].indexOf(estado) > -1){
        console.log("Palavra aceita");
        break;
    }
  }
}

