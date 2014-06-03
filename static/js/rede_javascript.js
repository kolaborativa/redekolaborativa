// alert(screen.width)/Tamanho da Tela (do dispositivo)
// window.innerWidth // Tamanho da Janela do navegador 

// Função para pegar elemento pela ID
// Retorna o Elemento
function Id(elemento){
	var elemento = document.getElementById(elemento)
	return elemento;
}

// Função para pegar basicamente elementos data-*
function querySelectAll(parametro){
	parametro = "["+parametro+"]";
	var elementos = document.querySelectorAll(parametro);
	return elementos;
}

document.addEventListener("DOMContentLoaded",main)

function main(){

	mudando_fase_perfil("1");

	var btnPerfil = querySelectAll("data-irParaFase");
	for (var i = 0; i < btnPerfil.length; i++) {
		btnPerfil[i].addEventListener("click",function(){
			mudando_fase_perfil(this.getAttribute("data-irParaFase"));
		})
	};

	var label = querySelectAll("data-checkbox-label")
	for (var i = 0; i < label.length; i++) {
		label[i].addEventListener("click",function(){
			mudaStatusCheckbox(this)
		})
	}

	var editar = document.querySelectorAll("[data-edit-user]");
	for (var i = 0; i < editar.length; i++) {

		editar[i].addEventListener("click",function(){
			editarUsuario(this.getAttribute("data-edit-user"));
		});

	};

}

function mudaStatusCheckbox(checkbox){
	status = checkbox.innerHTML;
	if (status=="Off") {
		checkbox.innerHTML = "On"
	}
	else{
		checkbox.innerHTML = "Off"
	}
}

function mudando_fase_perfil(fase){

	var fases_edicao = querySelectAll("data-fase")
	var status_fase = querySelectAll("data-fase-atual")
	var img_fase = querySelectAll("data-img-fase");

	for (var i = 0; i < fases_edicao.length; i++) {
		var status = fases_edicao[i].getAttribute("data-fase-atual");
		// Identifica qual o bloco que vai
		if (fases_edicao[i].getAttribute("data-fase") == fase){
			status = "true";
		}
		else{
			status = "false";
		}

		// Identifica quais as imagens da fase
		for (var img = 0; img < img_fase.length; img++) {
			if (img_fase[img].getAttribute("data-img-fase") == fase){
				img_fase[img].style.display = "inline";
			}
			else
			{
				img_fase[img].style.display = "none";
			}
		};

		// Muda o bloco
		if (status == "false"){
			fases_edicao[i].style.display = "none";
		}
		else
		{
			fases_edicao[i].style.display = "block";	
		}
		;
	};
}

// data-edit-user
function editarUsuario(usuario){
	
	console.log(usuario);
	var campos =document.querySelectorAll("[data-field]");
	for (var i = 0; i < campos.length ; i++) {
		var field = campos[i].getAttribute("data-field");
		console.log(campos[i]);
		console.log(field);
		// if(field == usuario){
		// 	console.log(campos[i].getElementsByTagName);
		// 	campos[i].removeChild(campos[i]);
		// 	campos[i].appendChild(inputEditarUser());
		// 	console.log(field +" --" + i);
		// 	console.log("achou");
		// }
	};

}

function inputEditarUser(){
	var input = document.createElement("input")
	att=document.createAttribute("class");
	att.value="input-editar";
	input.setAttributeNode(att);
	return input
}