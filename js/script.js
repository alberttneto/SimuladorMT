
var texto, palavra;

function readSingleFile(evt) {

  var f = evt.target.files[0]; 
  console.log(evt);
  console.log("teste")

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

document.getElementById('fileinput').addEventListener('change', readSingleFile, false);

function exibirMt(){
  var input = document.querySelector("#palavra");
  var cont = 0;
  palavra = input.value;

  console.log(palavra);

  var ul = document.getElementById("fita");

  for (child of ul.children){
    child.remove();
  }

  for (elemento of palavra){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(elemento));
    li.setAttribute("id", cont);
    ul.appendChild(li);
    cont++;
  } 

  executaMT();
}

function exibirTexto(){
  const obj = JSON.parse(texto);
  console.log(obj);
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
  console.log(fita)
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

