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
		// Array que contiene todos los OBJETO del fichero XML
		objetos = datos.documentElement.getElementsByTagName("OBJETO");
		//construimos el formulario y lo cuelgo del div 'objetos'.
		var formulario=document.createElement("form");
		var contenedorObjetos=document.getElementById("objetos");
		contenedorObjetos.appendChild(formulario);
		
		// Hacemos un bucle para recorrer todos los elementos de Objetos.
		for (var i=0;i<objetos.length;i++)	{
			//creo las etiquetas labels y le asigno su texto y tambien creo los inputs
			let label = document.createElement('label');
			label.textContent=objetos[i].children[3].innerHTML;
			let input = document.createElement('input');
			switch (objetos[i].children[0].innerHTML) {//etiquete TIPO en el xml
				case 'text':
					input.setAttribute("type",objetos[i].children[0].innerHTML);
					input.setAttribute("id",objetos[i].children[1].innerHTML);
					input.setAttribute("class",objetos[i].children[2].innerHTML);
					label.setAttribute("for",objetos[i].children[1].innerHTML);
					formulario.appendChild(label);
					formulario.appendChild(input);
					break;

				case 'date':
					//creo un objeto date y le asigno el min y max
					let data=new Date();
					let dataActual=data.getFullYear()+"-"+"0"+(data.getMonth()+1)+"-"+data.getDate();
					input.setAttribute("type",objetos[i].children[0].innerHTML);
					input.setAttribute("id",objetos[i].children[1].innerHTML);
					input.setAttribute("class",objetos[i].children[2].innerHTML);
					input.setAttribute("min","1965-01-01");
					input.setAttribute("max",dataActual);
					label.setAttribute("for",objetos[i].children[1].innerHTML);
					formulario.appendChild(label);
					formulario.appendChild(input);
					break;
				case 'select':
					let select = document.createElement('select');
					select.setAttribute("type",objetos[i].children[0].innerHTML);
					select.setAttribute("id",objetos[i].children[1].innerHTML);
					select.setAttribute("class",objetos[i].children[2].innerHTML);

					//aqui le asigno las ciudades de la provincia de Coruña porque es la provincia inicial que aparece al cargar la página
					if(select.id=="ciudades"){
						for(var x=0;x<objetos[5].children[4].children[0].children[1].childElementCount;x++){
							var option = document.createElement("option");
							option.text = objetos[5].children[4].children[0].children[1].children[x].innerHTML;
							select.add(option);
						}
					}else{//este es el select de provincias
						for(var x=0;x<objetos[i].children[4].childElementCount;x++){
							select.addEventListener('change',cambiarCiudad);
							var option = document.createElement("option");
							option.text = objetos[i].children[4].children[x].innerHTML;
							select.add(option);
						}
					}
					label.setAttribute("for",objetos[i].children[1].innerHTML);//asigno atributo for a las labels
					formulario.appendChild(label);
					formulario.appendChild(select);
					break;
				case 'textarea':
					let textarea = document.createElement('textarea');
					textarea.setAttribute("type",objetos[i].children[0].innerHTML);
					textarea.setAttribute("id",objetos[i].children[1].innerHTML);
					textarea.setAttribute("class",objetos[i].children[2].innerHTML);
					label.setAttribute("for",objetos[i].children[1].innerHTML);
					formulario.appendChild(label);
					formulario.appendChild(textarea);
					break;
				case 'button':
					let button = document.createElement('button');
					button.setAttribute("type",objetos[i].children[0].innerHTML);
					button.setAttribute("id",objetos[i].children[1].innerHTML);
					button.setAttribute("class",objetos[i].children[2].innerHTML);
					button.setAttribute("event",objetos[i].children[4].innerHTML);
					button.innerText=objetos[i].children[3].innerHTML;
					formulario.appendChild(button);
					break;
			}
		}

		//AddEventListeners
		crearEvento(document.getElementById('nombre'),'change',cambiarInicial);
		crearEvento(document.getElementById('apellido1'),'change',cambiarInicial);
		crearEvento(document.getElementById('apellido2'),'change',cambiarInicial);
		crearEvento(document.getElementById('nombre'),'focus',seleccionarText);
		crearEvento(document.getElementById('apellido1'),'focus',seleccionarText);
		crearEvento(document.getElementById('apellido2'),'focus',seleccionarText);
		crearEvento(document.getElementById('anadirHabitante'),'click',anadirHabitante);

		//funciones
		function cambiarCiudad(){
			let selectCiudades = document.getElementById('ciudades');
			let selectProvincias = document.getElementById('provincias');
			switch (selectProvincias.selectedOptions[0].innerText) {
				
				case 'La Coruña':
					selectCiudades.length=0;//resetear el select a 0 options
					for(var x=0;x<objetos[5].children[4].children[0].children[1].childElementCount;x++){
						var option = document.createElement("option");
						option.text = objetos[5].children[4].children[0].children[1].children[x].innerHTML;
						selectCiudades.add(option);
					}
					break;
				case 'Lugo':
					selectCiudades.length=0;
					for(var x=0;x<objetos[5].children[4].children[1].children[1].childElementCount;x++){
						var option = document.createElement("option");
						option.text = objetos[5].children[4].children[1].children[1].children[x].innerHTML;
						selectCiudades.add(option);
					}
					break;	

				case 'Ourense':
					selectCiudades.length=0;
					for(var x=0;x<objetos[5].children[4].children[2].children[1].childElementCount;x++){
						var option = document.createElement("option");
						option.text = objetos[5].children[4].children[2].children[1].children[x].innerHTML;
						selectCiudades.add(option);
					}
					break;

				case 'Pontevedra':
					selectCiudades.length=0;
					for(var x=0;x<objetos[5].children[4].children[3].children[1].childElementCount;x++){
						var option = document.createElement("option");
						option.text = objetos[5].children[4].children[3].children[1].children[x].innerHTML;
						selectCiudades.add(option);
					}
					break;	
			}
		}
		function cambiarInicial(){
			//quito espacios en blanco,cambio la primera letra y tambie le paso un regex
			let regex = new RegExp('^\\D+$');
			if(!regex.test(this.value)){
				this.value="";
				alert ("formato no valido");
				this.focus();
				
			}else{
				this.value=this.value.trim();
				this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
			}
		}
		function seleccionarText(){
			if(!this.value==""){
				this.select();
			}
		}
		function anadirHabitante(){
			let habitante="";
			if(!gI('nombre').value){
				alert("campo nombre vacio");
				gI("nombre").focus();
			}else if(!gI('apellido1').value){
				alert("campo apellido1 vacio");
				gI("apellido1").focus();

			}else if(!gI('apellido2').value){
				alert("campo apellido2 vacio");
				gI("apellido2").focus();

			}else if(!gI('fechaNac').value){
				alert("campo fecha vacio");
				gI("fechaNac").focus();
				
			}else{
				habitante=gI('nombre').value+" "+gI('apellido1').value+" "+gI('apellido2').value+" "+calcularEdad(gI('fechaNac').value)+" "+gI('provincias').value+" "+gI('ciudades').value;
				gI("lista").value+=habitante+'\r\n';
				let objHabitante=new Habitante(gI('nombre').value,gI('apellido1').value,gI('apellido2').value,calcularEdad(gI('fechaNac').value),gI('provincias').value,gI('ciudades').value);
				habitantes.push(objHabitante);
			}
		}
		function calcularEdad(fecha) {
			var hoy = new Date();
			var cumpleanos = new Date(fecha);
			var edad = hoy.getFullYear() - cumpleanos.getFullYear();
			var m = hoy.getMonth() - cumpleanos.getMonth();
		
			if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
				edad--;
			}
			return edad;
		}
	}
	document.getElementById("indicador").innerHTML="";
}
	


