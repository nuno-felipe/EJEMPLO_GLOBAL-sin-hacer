/////////////////////////////////////////////////////////
// Función cross-browser para añadir Eventos
/////////////////////////////////////////////////////////
var crearEvento = function(){
	function w3c_crearEvento(elemento, evento, mifuncion){
		elemento.addEventListener(evento, mifuncion, false);
	}
	
	function ie_crearEvento(elemento, evento, mifuncion){
		var fx = function(){mifuncion.call(elemento);};
		
		// Enlazamos el evento con attachEvent.
		// Cuando usamos attachEvent dejamos de tener acceso al objeto this en mifuncion. 
		// Para solucionar eso usaremos el método call() del objeto Function, 
		// que nos permitirá asignar el puntero this para su uso dentro de la función. 
		// El primer parámetro que pongamos en call será la referencia que se usará como 
		// objeto this dentro de nuestra función. 
		// De esta manera solucionamos el problema de acceder a this usando attachEvent en IE.
		elemento.attachEvent('on' + evento, fx);
	}

	function tradicional_crearEvento( elemento, evento, mifuncion) {
		evento='on'+evento;
		elemento.evento=mifuncion;
	}
	if (typeof window.addEventListener !== 'undefined') {
		return w3c_crearEvento;
	} else if (typeof window.attachEvent !== 'undefined') {
		return ie_crearEvento;
	} else {
		return tradicional_crearEvento;
	}
}();	// <= Esta es la parte más crítica - tiene que terminar en () y ;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Función cross-browser para quitar Eventos
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var eliminarEvento = function(){
	function w3c_eliminarEvento(elemento, evento, mifuncion){
		elemento.removeEventListener(evento, mifuncion, false);
	}
	
	function ie_eliminarEvento(elemento, evento, mifuncion){
		var fx = function(){mifuncion.call(elemento);};
		
		// Enlazamos el evento con attachEvent.
		// Cuando usamos attachEvent dejamos de tener acceso al objeto this en mifuncion. 
		// Para solucionar eso usaremos el método call() del objeto Function, 
		// que nos permitirá asignar el puntero this para su uso dentro de la función. 
		// El primer parámetro que pongamos en call será la referencia que se usará como 
		// objeto this dentro de nuestra función. 
		// De esta manera solucionamos el problema de acceder a this usando attachEvent en IE.
		elemento.detachEvent('on' + evento, fx);
	}
	function tradicional_eliminarEvento(elemento, evento, mifuncion) {
		evento='on'+evento;
		elemento.evento=null;
	}
	if (typeof window.removeEventListener !== 'undefined')	{
		return w3c_eliminarEvento;
	} else if (typeof window.detachEvent !== 'undefined')	{
		return ie_eliminarEvento;
	} else return tradicional_eliminarEvento;
}();

/////////////////////////////////////////////////////////
//// mis métodos superrecudidos de obtener elementos
/////////////////////////////////////////////////////////
function gI(id){
	return document.getElementById(id);
}
function gC(clase,nodo){
	if (nodo) return nodo.getElementsByClassName(clase);
	return document.getElementsByClassName(clase);
}
function gN(nombre,nodo){
	if (nodo) return nodo.getElementsByName(nombre);
	return document.getElementsByName(nombre);
}
function gT(tag,nodo){
	if (nodo) return nodo.getElementsByTagName(tag);
	return document.getElementsByTagName(tag);
}
////////////////////////////////////////////////////////
//// mis métodos superrecudidos de trabajar con nodos
/////////////////////////////////////////////////////////
function cE(etiqueta){
	return document.createElement(etiqueta);
}
function sA(nodo,atrib,valor) {
	return nodo.setAttribute(atrib,valor);
}
function rA(nodo, atrib){
	return nodo.removeAttribute(atrib);
}
function aC(nodo,nodoHijo) {
	return nodo.appendChild(nodoHijo);
}
function rC(nodo,nodoHijo) {
	return nodo.removeChild(nodoHijo);
}
function cT(texto){
	return document.createTextNode(texto);
}

////////////////////////////////////////
//otros métodos Cross-Browser usados para insertar y borrar nombres de clase
//////////////////////////////////////
function bC(nodo,nombreClase){  //borra un nombre de clase de la list
	//si no recibe nombre de clase es que hay que borrarlos todos
	if (nombreClase) {
		var patron=new RegExp("/\b"+nombreClase+"\b/");
		if (navigator.appName.indexOf("Explorer") != -1) nodo.className = nodo.className.replace(patron,'') ;
		else if (nodo.classList)
			if (nodo.classList.length>0) nodo.classList.remove(nombreClase);
	}
	else if (navigator.appName.indexOf("Explorer") != -1) nodo.className =""
	     else nodo.classList="";
}

function iC(nodo,nombreClase){  //añade un nombre de clase a la lista
	if (navigator.appName.indexOf("Explorer") != -1) nodo.className+=" "+nombreClase;
	else if (nodo.classList)
		if (nodo.classList.length==0) sA(nodo,"class",nombreClase)
		else nodo.classList.add(nombreClase);
}
function pC(nodo,pos) { //indica el nombre de clase que ocupa la posición pos de un nodo
	if (navigator.appName.indexOf("Explorer") != -1) {
		var nombreClase=nodo.className;
		return nombreClase.split(" ")[pos];
	} else return nodo.classList[pos];
}	

//////////////////////////////////////////////////
/////////////////////metodos para el select
//////////////////////////////////////////////////
function cO(desde,hasta,id){
	//esta función crea opciones en un select de opciones con valores numéricos desde el valor desde hasta el valor hasta
	//el select al que se le añaden las opciones tiene que tener el indetinficador = argumento id
	var elemento=gI(id);	
	for (var i=desde;i<=hasta;i++){
		var opcion=new Option(i);
		elemento.add(opcion);
	}
}

function cOl(lista,valores){ //ambas listas tienen que tener la misma longitud)
	//función que crea las opciones en un select
	//los contenidos que tendrán los elementos option están almacenados en la lista
	//los value los obtiene de la posición que tiene cada valor en la lista o de la lista de valores (de existir)
	for (var i=0;i<lista.length;i++){
		if (valores) {  //new Option(contenido_opción,valor_atributo_value)
			var opcion=new Option(lista[i],valores[i]);
		} else {
			var opcion=new Option(lista[i],i);
		}
		elemento.add(opcion);
	}
}

//////////////////////////////////////////
///////////////// métodos para crear celdas con contenido
///////////////////////////////////////////
function cC(contenido,tipoCelda){   //tipoCelda puede ser th o td
	var celda=cE(tipoCelda);
	var nodoTexto=cT(contenido);
	aC(celda,nodoTexto);
	return celda;
}	

/////////////////////////////////////////////////////////
// Función cross-browser para modificar el contenido
// de un DIV
/////////////////////////////////////////////////////////
function textoDIV(nodo, texto){
	//var nodo = document.getElementById(idObjeto); 
	while (nodo.firstChild)
		nodo.removeChild(nodo.firstChild); // Eliminamos todos los hijos de ese objeto.
	// Cuando ya no tenga hijos, agregamos un hijo con el texto que recibe la función.
	nodo.appendChild(document.createTextNode(texto)); 
}	

	
//función que añade el título de una columna como cabecera de la tabla
//recibe
//	cabecera- El título que figura como cabecera de la columna en la tabla Título, Artista, Año
//	fila- fila de cabecera donde se añade cada título
function addCabecera(cabecera,fila){
	var celda=document.createElement("th");
	var titulo=document.createTextNode(cabecera);
	celda.appendChild(titulo);
	fila.appendChild(celda);
}
//función que añade un dato de un CD a una columna de una fila de la tabla
//recibe
//	campo- qtiqueta correspondivente al campo recibido TITLE, ARTIST, YEAR
//	fila- tr donde hay que añadir la celda
//	i-índice del CD en el catálogo
function addCampo(campo,fila,i){
	try	{// Intentamos imprimir el contenido de ese elemento
		var dato=CDs[i].getElementsByTagName(campo)[0].firstChild.nodeValue;
		var campo=document.createTextNode(dato);
	}
	catch (er){	// En el caso de que no tenga contenido ese elemento, imprimimos un espacio en blanco
		var campo=document.createTextNode("");
	}
	var celda=document.createElement("td");	
	celda.appendChild(campo);
	fila.appendChild(celda);
}
