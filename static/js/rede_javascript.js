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
	DOMEditarPerfil();
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
	
	
	var campos =document.querySelectorAll("[data-field]");
	for (var i = 0; i < campos.length ; i++) {
		var field = campos[i].getAttribute("data-field");
	};

}

function inputEditarUser(){
	var input = document.createElement("input")
	att=document.createAttribute("class");
	att.value="input-editar";
	input.setAttributeNode(att);
	return input
}


// Códigos da parte de Editar Perfil 
function DOMEditarPerfil(){
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


		var formulario = document.getElementById("formulario_edicao_perfil")
		var inputs = formulario.getElementsByTagName("input");
		var selects = formulario.getElementsByTagName("select");
		var textareas = formulario.getElementsByTagName("textarea")[0];

		textareas.addEventListener("keyup",function(){
			document.querySelector("[data-caracteres]").innerHTML = (350 - this.value.length);
			if(this.value.length >= 350){
				this.value = this.value.substr(0,350);
			}
		})
		textareas.addEventListener("change",function(){
			gravaAjaxEditProfile(this)
		})
		

		for (var i = 0; i < inputs.length; i++) {

			if(inputs[i].name == "network"){
				document.getElementById("network").addEventListener("click",function(){
					gravaAjaxEditProfile(this);
				})
			}
			else
			{
				inputs[i].addEventListener("change",function(){
					gravaAjaxEditProfile(this)
				})
			}
		};

		for (var i = 0; i < selects.length; i++) {

			if(selects[i].name != "profession"){
				selects[i].addEventListener("change",function(){
					if(this.name == "network_type"){
				document.querySelector("[data-redesocial]").innerHTML = document.getElementsByName('network_type')[0].value

					}
					else{
						gravaAjaxEditProfile(this)	
					}
					
				})
			}
		};

		$("#profissoes").select2({ 
			maximumSelectionSize: 1
		});
		$("#profissoes").on("click",function(){
			gravaAjaxEditProfile(this);
		});
}


function criarCompentecias(profissao,competencias){

	var select = document.createElement('select');
	select.setAttribute('data-placeholder','adicione competencias');
	select.name="competence";
	select.setAttribute('data-select',profissao)
	select.setAttribute('class','w-full competencias');
	select.setAttribute('multiple','')

// Cria um for de opções
for( i in competencias ){ 
	var opcao = document.createElement('option');
	opcao.innerHTML = competencias[i];
	opcao.value = i;
	select.appendChild(opcao);	
}

var linha = document.createElement('li')
linha.setAttribute('class','profissao t-left');

var span = document.createElement('span');
span.setAttribute('class','h1');
span.innerHTML = profissao;

var deletar = document.createElement('img');
deletar.setAttribute('class','delete_profissao f-right');
deletar.src="{{=URL('static','images/Edit_perfil/delete.png')}}"


var listasProfissoes = document.querySelector('.list-profissao')

span.appendChild(deletar);
linha.appendChild(span);
linha.appendChild(select);
listasProfissoes.appendChild(linha);

// Eventos ================


$("[data-select="+profissao+"]").select2({ 
	maximumSelectionSize: 5
});

$("[data-select="+profissao+"]").on("click",function(){

	if(this.value == "4"){
		var teste = prompt("Digite uma sugestão de Competencia");
		console.log(teste);
	}
	else{
		console.log(this.value);
	}
});

$(".delete_profissao").on("click",function(){
	console.log("delete isso");
});

};

function gravaAjaxEditProfile(e){

	var field;
	var value;
	var vars;

	if(e.name == "profession"){

		field = e.name;
		value = e.value;
		vars = "field="+field+"&value="+value;

		var profession = e.selectedOptions[0].innerHTML;
		$("#profissoes").select2("val", "")
		caminho = url.ajax_add_profission+".json";

	}else if(e.name == "network"){

		var rede = document.getElementsByName('network_type')[0].value;
		var perfil = document.getElementsByName('network')[0].value;
		vars = "";
		caminho = "";
	}
	else if(e.name == "user_available"){
		
			field = e.name;
			value = e.checked == true ? value = true : value=false;;
			vars = "field="+field+"&value="+value;
			caminho = url.edit_profile;
	}
	else{
		field = e.name;
		value = e.value;
		vars = "field="+field+"&value="+value;
		caminho = url.edit_profile;
	}

	$.ajax({
		type: 'POST',
		url: caminho,
		data: vars,
		success: function(data) {
			if(e.name == "profession"){
				criarCompentecias(profession,data.competencies);
			}
		},
		error: function(data){
			console.log(data);
		}
	});
}
