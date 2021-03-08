crearEvento(window,"load",iniciar);
var miXHR;
var objetos; 
function iniciar() {
	// Creamos un objeto XHR.
	miXHR = new objetoXHR();
	
	// Cargamos los datos XML de forma asíncrona.
	// En este caso ponemos una página PHP que nos devuelve datos en formato XML
	// pero podríamos poner también el nombre de un fichero XML directamente: catalogos.xml
	// Se adjunta ejemplo de fichero XML.
	cargarAsync("objetos.xml");
}

/////////////////////////////////////////////////////////
// Función cargarAsync: carga el contenido de la url
// usando una petición AJAX de forma ASINCRONA.
/////////////////////////////////////////////////////////
function cargarAsync(url) { 
	if (miXHR) 	{	
		// Activamos el indicador Ajax antes de realizar la petición.
		document.getElementById("indicador").innerHTML="<img src='ajax-loader.gif'/>";
		
		//Si existe el objeto  miXHR
		miXHR.open('GET', url, true); //Abrimos la url, true=ASINCRONA 
		
		// En cada cambio de estado(readyState) se llamará a la función estadoPeticion
		miXHR.onreadystatechange = estadoPeticion;
	
		// Hacemos la petición al servidor. Como parámetro: null ya que los datos van por GET
		miXHR.send(null);
	}
}

/////////////////////////////////////////////////////////
// Función estadoPeticion: será llamada a cada cambio de estado de la petición AJAX
// cuando la respuesta del servidor es 200(fichero encontrado) y el estado de
// la solicitud es 4, accedemos a la propiedad responseText
/////////////////////////////////////////////////////////
function estadoPeticion() {
	if (this.readyState==4 && this.status == 200)	{
		// Almacenamos el fichero XML en la variable datos.
		var datos=this.responseXML;		
		// Tenemos que recorrer el fichero XML empleando los métodos del DOM
		// Array que contiene todos los CD's del fichero XML
		objetos = datos.documentElement.getElementsByTagName("objetos");
		
		//construimos la tabla
		var formularop=document.createElement("form");
		var fila=document.createElement("tr");
		addCabecera("Título",fila);
		addCabecera("Artista",fila);
		addCabecera("Año",fila);
		tabla.appendChild(fila);
		
		// Hacemos un bucle para recorrer todos los elementos CD.
		for (var i=0;i<objetos.length;i++)	{
			var label=document.createElement("label");
            var dato=objetos[i].getElementsByTagName("ETIQUETA")[0].firstChild.nodeValue;



			// Para cada CD leemos:
			addCampo("TITLE",fila,i);		//el título	
			addCampo("ARTIST",fila,i);	//el Artista
			addCampo("YEAR",fila,i);		//el Año
			// Podríamos seguir sacando más campos del fichero XML..		
			tabla.appendChild(fila);
		}
		
		// Desactivamos el indicador AJAX cuando termina la petición
		document.getElementById("indicador").innerHTML="";		
		// Imprimimos la tabla dentro del contenedor resultados.
		document.getElementById("resultados").appendChild(tabla);
	}
}
//función que añade el título de una columna como cabecera de la tablaç
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