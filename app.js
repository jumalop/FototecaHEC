
let casos = JSON.parse(localStorage.getItem("casos") || "[]");
const divCasos = document.getElementById("casos");

function render() {
  divCasos.innerHTML = "";
  casos.forEach((caso, i) => {
    const div = document.createElement("div");
    div.innerHTML = "<b>Edad:</b> " + caso.edad + "<br><b>Género:</b> " + caso.genero +
                    "<br><b>Diagnóstico:</b> " + caso.diagnostico +
                    "<br><b>Hallazgos:</b> " + caso.hallazgos + "<br>" +
                    caso.imagenes.map(img => "<img src='" + img + "' width='100'>").join(" ");
    divCasos.appendChild(div);
  });
}
function guardarCaso() {
  const edad = document.getElementById("edad").value;
  const genero = document.getElementById("genero").value;
  const diagnostico = document.getElementById("diagnostico").value;
  const hallazgos = document.getElementById("hallazgos").value;
  const imagenInput = document.getElementById("imagen");
  const readerPromises = [];
  for (let i = 0; i < imagenInput.files.length; i++) {
    const reader = new FileReader();
    readerPromises.push(new Promise(resolve => {
      reader.onload = () => resolve(reader.result);
    }));
    reader.readAsDataURL(imagenInput.files[i]);
  }
  Promise.all(readerPromises).then(imagenes => {
    casos.push({ edad, genero, diagnostico, hallazgos, imagenes });
    localStorage.setItem("casos", JSON.stringify(casos));
    render();
  });
}
render();
