// alert(screen.width)/Tamanho da Tela (do dispositivo)
// window.innerWidth // Tamanho da Janela do navegador 

// Função para pegar elemento pela ID
// Retorna o Elemento
function $(elemento){
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

	editando_perfil();

}

function editando_perfil(){
	var fases_edicao = querySelectAll("data-fase")
	var status_fase = querySelectAll("data-fase-atual")
	
	for (var i = 0; i < fases_edicao.length; i++) {
		var status = fases_edicao[i].getAttribute("data-fase-atual");
		if (status == "false"){
			fases_edicao[i].style.display = "none";
		};
	};
}