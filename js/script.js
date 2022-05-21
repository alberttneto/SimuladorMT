
var texto;

function readSingleFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
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
  var palavra = input.value;

  console.log(palavra);

  var ul = document.getElementById("fita");

  for (elemento of palavra){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(elemento));
    li.setAttribute("id", "element4"); // added line
    ul.appendChild(li);
  }

}


function exibirTexto(){
  console.log(texto);
}