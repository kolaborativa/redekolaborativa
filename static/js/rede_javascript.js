// alert(screen.width)/Tamanho da Tela (do dispositivo)
// window.innerWidth // Tamanho da Janela do navegador 

function ID(elemento){
	var elemento = document.getElementById(ID)
	return elemento;
}
function querySelectAll(parametro){
	var elementos = document.querySelectorAll(parametro);
	return elementos;
}

document.addEventListener("DOMContentLoaded",main)

window.addEventListener("resize",function(){
	ajustaElementos(this.innerWidth);
})

function main(){
	ajustaElementos(window.innerWidth);
	console.log(document.querySelectorAll("data-conteudo"));
}


function ajustaElementos(larguraTela){

	if(larguraTela >= 1200)
	{
		re_organiza("desktop");
	}
	else if(larguraTela >= 760 && larguraTela <1200)
	{
		re_organiza("tablet");
	}
	else if(larguraTela < 760){
		elementosSmartphone();
	}

}
function elementosDesktop(){};
function elementosTablet(){};
function elementosSmartphone(){};

function re_organiza(tela){

	var secoes = document.getElementsByTagName("section");
	for (var i = 0; i < secoes.length; i++) {
		var data = secoes[i].getAttribute("data-conteudo");
		if (data != null){
			
			if (tela == "desktop"){
				if (data == "descricao"){
					secoes[i].className = secoes[i].className.replace("span_12","span_6")
				};
				if (data == "login"){
					secoes[i].className = secoes[i].className.replace("span_12","span_6")
				};
				if (data == "registro"){
					secoes[i].className = secoes[i].className.replace("span_6","span_5")
				};
				if (data == "login-desktop"){
					secoes[i].style.display = "block"
				};
				console.log(data);
			};


			if (tela == "tablet"){
				if (data == "descricao"){
					secoes[i].className = secoes[i].className.replace("span_6","span_12")
				};
				if (data == "login"){
					secoes[i].className = secoes[i].className.replace("span_6","span_12")
				};
				if (data == "registro"){
					secoes[i].className = secoes[i].className.replace("span_5","span_6")
				};
				if (data == "login-desktop"){
					secoes[i].style.display = "none"
				};
				console.log(data);
			};

			
		}
	};
}