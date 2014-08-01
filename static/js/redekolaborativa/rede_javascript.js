// alert(screen.width)/Tamanho da Tela (do dispositivo)
// window.innerWidth // Tamanho da Janela do navegador

// Função para pegar elemento pela ID
// Retorna o Elemento
function Id(elemento) {

	var elemento = document.getElementById(elemento);
	return elemento;
}

// Função para pegar vetor de data-* (atributos)
function SelectAll(parametro) {

	parametro 	  = "["+parametro+"]";
	var elementos = document.querySelectorAll(parametro);
	return elementos;
}

document.addEventListener("DOMContentLoaded",main)
function main(){
	if(Id("submit") != null ){ 
		DOMHome();
	} // ativa o JS da home !	
	
	if(Id("formulario_edicao_perfil") != null) {
		mudaStatusCheckbox();
		DOMEditarPerfil();
	}
	if(Id("create-project") != null) {
		DOMCreateProjeto();
	}
	if(Id("edit-project") != null) {
		DOMEditProjeto();
	}
	
}

function DOMHome(){

	var  verificado = false
	 	,nome       = document.getElementsByName("first_name")[0]
	 	,email      = document.getElementsByName("email")[0]
	 	,user       = document.getElementsByName("username")[1]
	 	,senha      = document.getElementsByName("password")[1]
	 	,termos     = Id("termosConfirm")
	 	
	
	// Id("submit")
	

	nome.addEventListener  ("change",function(){validaForm()});
	email.addEventListener ("change",function(){validaForm()});
	user.addEventListener  ("change",function(){validaForm()});
	senha.addEventListener ("change",function(){validaForm()});
	termos.addEventListener("click",function(){validaForm()});

	Id("submit").addEventListener("click",function(){
		if(termos.checked == true && verificado == true){
			document.forms[2].submit();
		}
	});
	
	
	function validaForm(){
		var campos = [nome,user,senha,email];
		
		if(nome.value != "" &&  user.value != "" && senha.value != "" && email.value != "")
			verificado = true;		
		else verificado = false;
	}

	


}



// Ver o que essas funções fazem
function editarUsuario(usuario){
	var campos  = SelectAll("[data-field]");
	var field;
	var icampos = 0;
	for (; icampos < campos.length ; icampos++) {
		 field = campos[icampos].getAttribute("data-field");
	};

}

// Ver o que essas funções fazem
function inputEditarUser(){
	 var input 	   = document.createElement("input");
	 	 att   	   = document.createAttribute("class");
		 att.value = "input-editar";
		 input.setAttributeNode(att);
		return input
 }



function regexLink(e){
	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var regex      = new RegExp(expression);
	var link       = e.value;

	 if (link.match(regex)){
	   return true
	 }else{
	   return false;
	 }
}


function pegaGET(name)
{
	var url   = window.location.search.replace("?", "");
	var itens = url.split("&");

	for(n in itens)
	{
		if( itens[n].match(name) )
		{
			return decodeURIComponent(itens[n].replace(name+"=", ""));
		}
	}
	return null;
}


