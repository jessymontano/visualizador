var turno = true; //true: blancas, false: negras
var i = 0;
var tokens = "";
var posicion = "";
var enroque = "";
var columna = 0;
var renglon = 0;

//colocar piezas en el tablero
function iniciar() {
  i = 0;
  var celdas = document.getElementById("js-tablero");
  /*Piezas negras*/
  for (let i = 1; i < 9; i++) {
    celdas.rows[2].cells[i].classList.add("peon-n");
  }
  celdas.rows[1].cells[1].classList.add("torre-n");
  celdas.rows[1].cells[2].classList.add("caballo-n");
  celdas.rows[1].cells[3].classList.add("alfil-n");
  celdas.rows[1].cells[4].classList.add("reina-n");
  celdas.rows[1].cells[5].classList.add("rey-n");
  celdas.rows[1].cells[6].classList.add("alfil-n");
  celdas.rows[1].cells[7].classList.add("caballo-n");
  celdas.rows[1].cells[8].classList.add("torre-n");

  //nada
  for (let i = 1; i < 9; i++) {
    for (let j = 3; j < 7; j++) {
        celdas.rows[j].cells[i].classList.remove(celdas.rows[j].cells[i].classList.item(1))
    }
  }

  /*Piezas blancas*/
  for (let i = 1; i < 9; i++) {
    celdas.rows[7].cells[i].classList.add("peon-b");
  }

  celdas.rows[8].cells[1].classList.add("torre-b");
  celdas.rows[8].cells[2].classList.add("caballo-b");
  celdas.rows[8].cells[3].classList.add("alfil-b");
  celdas.rows[8].cells[4].classList.add("reina-b");
  celdas.rows[8].cells[5].classList.add("rey-b");
  celdas.rows[8].cells[6].classList.add("alfil-b");
  celdas.rows[8].cells[7].classList.add("caballo-b");
  celdas.rows[8].cells[8].classList.add("torre-b");
}

//elegir una partida precargada
function partidas() {
  var textarea = document.getElementById("texto");
  var valor = document.getElementById("Combo").value;

  switch (valor) {
    case "0":
      textarea.value = "";
    case "1":
      textarea.value = "Partida 1";
      break;
    case "2":
      textarea.value = "Partida 2";
      break;
    case "3":
      textarea.value = "Partida 3";
      break;
    default:
      break;
  }
}

//leer un archivo con una partida y escribirlo en el text area
function cargarPartida() {
  var archivo = document.getElementById("cargar").files[0];
  var lector = new FileReader();
  lector.onload = function (e) {
    document.getElementById("texto").value = e.target.result;
  };
  lector.readAsText(archivo);
}

//visualizar el juego paso por paso
function pasos() {
  var tablero = document.getElementById("js-tablero");
  var tokens = document.getElementById("texto").value.replace(/\d+\.\s*/g, "").split(/\s+/);
  var pieza = "";
  if (i == tokens.length) {
    return; //terminar el juego cuando se alcanza el final de los movimientos
  }

  pieza = checarPieza(tokens[i]);
  posicion = limpiarTokens(tokens[i]);

  if (pieza == "enroque") {
    switch (tokens[i]) {
      case "O-O": { //enroqe corto 
        renglon = (turno) ? 8 : 1;
        tablero.rows[renglon].cells[5].classList.remove('rey' + ((turno) ? '-b' : '-n'));
        tablero.rows[renglon].cells[7].classList.add('rey' + ((turno) ? '-b' : '-n'));
        tablero.rows[renglon].cells[8].classList.remove('torre' + ((turno) ? '-b' : '-n'));
        tablero.rows[renglon].cells[6].classList.add('torre' + ((turno) ? '-b' : '-n'));
      }; break;
      case "O-O-O": { // enroqe largo
        renglon = (turno) ? 8 : 1;
        tablero.rows[renglon].cells[5].classList.remove('rey' + ((turno) ? '-b' : '-n'));
        tablero.rows[renglon].cells[3].classList.add('rey' + ((turno) ? '-b' : '-n'));
        tablero.rows[renglon].cells[1].classList.remove('torre' + ((turno) ? '-b' : '-n'));
        tablero.rows[renglon].cells[4].classList.add('torre' + ((turno) ? '-b' : '-n'));
      }; break;
    }
  }
  else {
    var columna = parseInt(convertirLetraANumero(posicion[0])) + 1;
    var renglon = 9 - parseInt(posicion[1]);
    var celda = tablero.rows[renglon].cells[columna];

    if (checarJaque(tokens[i]) || checarJaqueMate(tokens[i])) {
      var rey = document.querySelector(".rey" + ((turno) ? "-n" : "-b"));
      rey.classList.remove("rey" + ((turno) ? "-n" : "-b"));
      rey.classList.add("jaque" + ((turno) ? "-n" : "-b"));
    }
    else if (document.querySelector(".jaque" + ((turno) ? "-b" : "-n"))) {
      var rey = document.querySelector(".jaque" + ((turno) ? "-b" : "-n"));
      rey.classList.remove("jaque"+ ((turno) ? "-b" : "-n"));
      rey.classList.add("rey" + ((turno) ? "-b" : "-n"));
    }
  
    moverPieza(tablero, turno, pieza, posicion, checarSiCome(tokens[i]));
    
  }
  if (checarSiCome(tokens[i])) {
    celda.classList.remove(celda.classList.item(1));
  }

  //cambiar de turno
  turno = !turno;

  //pasar al siguiente token
  if (i < tokens.length - 1) {
    i++;
  }
}

//convertir la coordenada de la columna a un numero
function convertirLetraANumero(letra) {
  switch (letra) {
    case 'a': return 0;
    case 'b': return 1;
    case 'c': return 2;
    case 'd': return 3;
    case 'e': return 4;
    case 'f': return 5;
    case 'g': return 6;
    case 'h': return 7;
    default: return -1;
  }
}

//checar si el token tiene mayusculas
function tieneMayusculas(token) {
  return /[A-Z]/.test(token);
}

//checar que tipo de pieza se esta moviendo
function checarPieza(token) {
  var inicial = token[0];
  if (!tieneMayusculas(token)) {
    return "peon";
  }
  else {
    switch (inicial) {
      case 'N': return "caballo";
      case 'K': return "rey";
      case 'B': return "alfil";
      case 'R': return "torre";
      case 'Q': return "reina";
      case 'O': return "enroque";
    }
  }
  return "";
}

//checar si una pieza come a otra
function checarSiCome(token) {
  return token.includes("x");
}

//pues checar si hay jaque
function checarJaque(token) {
  return token.endsWith("+");
}

//checar si hay jaquemate
function checarJaqueMate(token) {
  return token.endsWith("#");
}

//regresar nomas las coordenadas sin todo el cochinero
function limpiarTokens(token) {
  return token.replace(/.*x|[A-Z]|[\+#]+/g, '');
}

//checar si las coordenadas se salen del tablero
function fueraDelTablero(coordenadas) {
  return (coordenadas[0] < 0 || coordenadas[0] > 9 || coordenadas[1] < 0 || coordenadas[1] > 9);
}

//mover cada pieza esta bien complicado y si lloro
function moverPieza(tablero, turno, pieza, posicion, come) {
  var columna = parseInt(convertirLetraANumero(posicion[0])) + 1;
  var renglon = 9 - parseInt(posicion[1]);
  var celda = tablero.rows[renglon].cells[columna];
  const origenes = obtenerOrigenes(tablero, pieza, turno, renglon, columna, come)
  var color = (turno) ? '-b' : '-n'; //si es turno de las blancas -b, si es turno de las negras -n

  var eliminada = false; //checar si una pieza ya fue eliminada
  var origen = null;

  origenes.forEach(coordenadasOrigen => {
    if (!fueraDelTablero(coordenadasOrigen)) {
      origen = tablero.rows[coordenadasOrigen[1]].cells[coordenadasOrigen[0]];
      //eliminar una pieza si es del mismo tipo
      if (origen.classList.contains(pieza + color) && !eliminada) {
        origen.classList.remove(pieza + color); 
        eliminada = true;
      }
    }
  });

  //agregar la pieza qe se movio uwu
  celda.classList.add(pieza + color);
}

//funcion qe regresa posibles origenes de la pieza que se movio esta bien dificil
function obtenerOrigenes(tablero, pieza, turno, renglon, columna, come) {

  //objeto que contiene los posibles origenes de cada tipo de pieza
  const origenes = {
    caballo: [
      [columna - 2, renglon + 1],
      [columna - 1, renglon + 2],
      [columna + 2, renglon + 1],
      [columna + 1, renglon + 2],
      [columna - 1, renglon - 2],
      [columna + 1, renglon - 2],
      [columna + 2, renglon - 1],
      [columna - 2, renglon - 1]
    ], peon_blanco: [],
    peon_negro: [],
    reina: [],
    torre: [],
    rey: [
      [columna, renglon - 1],
      [columna, renglon + 1],
      [columna - 1, renglon],
      [columna - 1, renglon + 1],
      [columna - 1, renglon - 1],
      [columna + 1, renglon],
      [columna + 1, renglon + 1],
      [columna + 1, renglon - 1]
    ],
    alfil: []
  };

  //posibles origenes de un peon blanco que comio una pieza
  const peonBlancoCome = [
    [columna - 1, renglon + 1],
    [columna + 1, renglon + 1]
  ];

  //posibles origenes de un peon negro que comio una pieza
  const peonNegroCome = [
    [columna - 1, renglon - 1],
    [columna + 1, renglon - 1]
  ];

  //posibles origenes de un peon blanco que se mueve normal
  const peonBlancoAvanza = [
    [columna, renglon + 2],
    [columna, renglon + 1]
  ];

  //posibles origenes de un peon negro que se mueve normal
  const peonNegroAvanza = [
    [columna, renglon - 2],
    [columna, renglon - 1]
  ]

  //agregar los origenes a la lista del peon
  if (pieza == "peon" && come) {
    (turno) ? origenes["peon_blanco"].push(...peonBlancoCome) : origenes["peon_negro"].push(...peonNegroCome);
  } else if (pieza == "peon" && !come){
    (turno) ? origenes["peon_blanco"].push(...peonBlancoAvanza) : origenes["peon_negro"].push(...peonNegroAvanza);
    console.log(origenes);
  }

  //agregar origenes a las listas de la torre y la reina (renglon y columna)
  for (let j = 1; j < 9; j++) {
    if (columna != j && tablero.rows[renglon].cells[j].classList.contains("celda")) {
      origenes["torre"].push([j, renglon]);
      origenes["reina"].push([j, renglon]);
    }
    if (renglon != j && tablero.rows[j].cells[columna].classList.contains("celda")) {
      origenes["torre"].push([columna, j]);
      origenes["reina"].push([columna, j]);
    }
  };

  //agregar origenes a las listas del alfil y la reina (diagonales)
  for (let i = -7; i < 9; i++) {
    if (renglon + i >= 1 && renglon + i < 9 && columna + i >= 1 && columna + i < 9 && i != 0 && tablero.rows[renglon + i].cells[columna + i].classList.contains("celda")) {
      origenes["alfil"].push([columna + i, renglon + i]);
      origenes["reina"].push([columna + i, renglon + i]);
    }
    if (renglon - i >= 1 && renglon - i < 9 && columna + i >= 1 && columna + i < 9 && i != 0 && tablero.rows[renglon - i].cells[columna + i].classList.contains("celda")) {
      origenes["alfil"].push([columna + i, renglon - i]);
      origenes["reina"].push([columna + i, renglon - i]);
    }
  }

  if (pieza == "peon") {
    return origenes["peon_" + (turno ? "blanco" : "negro")];
  }
  return origenes[pieza];
}

function cambiarPiezas(){
  var set = document.getElementById("tipo-pieza").value;
  const piezas = ["torre", "caballo", "alfil", "rey", "reina", "peon", "jaque"];
  const colores = ['-b', '-n']
  var css = document.styleSheets[0];

  for (var i = 0; i < css.cssRules.length; i++) {
    var regla = css.cssRules[i];

    if (regla.selectorText) {
      // Verifica si la regla corresponde a una clase de pieza
      var esPieza = piezas.some(pieza => regla.selectorText.includes(pieza));

      if (esPieza) {
        if(regla.selectorText.includes("jaque")){
          regla.style.backgroundImage = 'url(../img/'+set+'/rey' + regla.selectorText.substring(8) + '.png), radial-gradient(red, rgba(0, 0, 0, 0))';
        } else{
        regla.style.backgroundImage = 'url(../img/'+set+'/' + regla.selectorText.substring(3) + '.png)';
        }
      }
  }
}
iniciar();
}

function reiniciar(){
  window.location.reload();
  var select = document.getElementById("tipo-pieza");
  for (var i = 0, l = select.length; i < l; i++) {
    select[i].selected = select[i].defaultSelected;
}
}