// alert(screen.width)/Tamanho da Tela (do dispositivo)
// window.innerWidth // Tamanho da Janela do navegador 

// Função para pegar elemento pela ID
// Retorna o Elemento
function Id(elemento){
	var elemento = document.getElementById(elemento);
	return elemento;
}

// Função para pegar vetor de data-* (atributos)
function SelectAll(parametro){
	parametro 	  = "["+parametro+"]";
	var elementos = document.querySelectorAll(parametro);
	return elementos;
}

document.addEventListener("DOMContentLoaded",main)

function main(){
	DOMEditarPerfil();
}

function mudaStatusCheckbox(checkbox){

	var checked 		 = document.getElementsByName("user_available")[0].checked;
	var disponibilidades = Id("disponibilidades");
	
	if (!checked) {
		checkbox.innerHTML = "Disponivel"
		disponibilidades.style.display = "block";

	}
	else{
		checkbox.innerHTML = "Indisponivel"
		disponibilidades.style.display = "none";
	}
}

function mudando_fase_perfil(fase){

	fase = fase == null? "1": fase; // se o valor vier null ele atribui a fase numero 1 do formulário

	var fases_edicao = SelectAll("data-fase")
	var status_fase  = SelectAll("data-fase-atual")
	var img_fase     = SelectAll("data-img-fase");
	var status;
	var iImg         = 0;
	var iFases       = 0;

	for (; iFases < fases_edicao.length; iFases++) {
		status = fases_edicao[iFases].getAttribute("data-fase-atual");

		// Identifica qual o bloco que vai
		if (fases_edicao[iFases].getAttribute("data-fase") == fase){
			status = "true";
		}
		else{
			status = "false";
		}

		// Identifica quais as imagens da fase
		for (; iImg < img_fase.length; iImg++) {
			if( img_fase[iImg].getAttribute("data-img-fase") == fase ) {
				img_fase[iImg].style.display = "inline";
			}
			else {
				img_fase[iImg].style.display = "none";
			}
		};

		// Muda o bloco
		if (status == "false") {
			fases_edicao[iFases].style.display = "none";
		}
		else{
			fases_edicao[iFases].style.display = "block";	
		};
	};
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


// Códigos da parte de Editar Perfil 
function DOMEditarPerfil(){
			mudando_fase_perfil();

			var btnPerfil  = SelectAll("data-irParaFase");	
			var iBtnPerfil = 0
			var label      = SelectAll("data-checkbox-label");
			var iLabel 	   = 0
			var editar     = SelectAll("data-edit-user");
			var iEditar    = 0
			var formulario = Id("formulario_edicao_perfil")
			var inputs     = formulario.getElementsByTagName("input");
			var selects    = formulario.getElementsByTagName("select");
			var textareas  = formulario.getElementsByTagName("textarea")[0];



			for (; iBtnPerfil < btnPerfil.length; iBtnPerfil++) {
				btnPerfil[iBtnPerfil].addEventListener("click",function(){
					mudando_fase_perfil(this.getAttribute("data-irParaFase"));
				});
			};

			
			for (; iLabel < label.length; iLabel++) {
				label[iLabel].addEventListener("click",function(){
					mudaStatusCheckbox(this)
				})
			}

			
			for (; iEditar < editar.length; iEditar++) {
				editar[iEditar].addEventListener("click",function(){
					editarUsuario(this.getAttribute("data-edit-user"));
				});
			};
			

			textareas.addEventListener("keyup",function(){
				document.querySelector("[data-caracteres]").innerHTML = (350 - this.value.length);
				if(this.value.length >= 350){
					this.value = this.value.substr(0,350);
				}
			})

			textareas.addEventListener("change",function(){	gravaAjaxEditProfile(this) });


			for (var i = 0; i < inputs.length; i++) {

				if(inputs[i].name == "network"){
					Id("network").addEventListener("click",function(){gravaAjaxEditProfile(this);})
				}				
				else
				{
					inputs[i].addEventListener("change",function(){gravaAjaxEditProfile(this);})
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
					});
				}				
			};

			$("#profissoes").select2({ 	maximumSelectionSize: 1	});
			$("#profissoes").on("click",function(){	gravaAjaxEditProfile(this);	});
			// Identifica os data-select e busca no banco as competencias que já existem			
			$("select[data-select]").select2({ 	maximumSelectionSize: 5 });
			$("select[data-select]").on("click",function(){
				gravaAjaxEditProfile(this);
			})
		
}


function adicionandoProfissao(idProfissao, profissao,competencias){
	console.log(idProfissao);
	var select = document.createElement('select');
	select.setAttribute('data-placeholder','adicione competencias');
	select.name="competence";
	select.setAttribute('data-select',profissao)
	select.setAttribute('data-idProfissao',idProfissao);
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
	deletar.src= image.delete;


	var listasProfissoes = document.querySelector('.list-profissao')

	span.appendChild(deletar);
	linha.appendChild(span);
	linha.appendChild(select);
	listasProfissoes.appendChild(linha);

	// Eventos ================


	$("[data-select="+profissao+"]").select2({ 
		maximumSelectionSize: 5
	});


	$("[data-select="+profissao+"]").on("change",function(){
		gravaAjaxEditProfile(this);
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
	else if(e.name == "competence"){
		
		var idProfession = e.getAttribute("data-idProfissao");
		var vetCompetence = new Array();
		vetCompetence.length = 0;
		console.log(vetCompetence);
		for (var i = 0; i < e.options.length; i++) {
			if(e.options[i].selected)
			{
			 	vetCompetence.push(e.options.item(i).value);
			 	console.log(vetCompetence);

			}
		};
		vetCompetence = "["+vetCompetence+"]";
		vars = "profession="+idProfession+"&competence="+vetCompetence;
		caminho = url.ajax_add_competence;
		// 
	}
	else if(e.name == "avatar"){

		var img = Id("hidden-avatar").value;
		// Cria um objeto com a img em base64 e o nome do campo
		vars = {image64: img, field : e.name};
		caminho = url.getCompetence;
		// caminho = url.edit_profile;
	}
	else if(e.name == "country" || e.name == "states" || e.name == "city"){
		field = e.name;
		value = e.value;
		vars = "field="+field+"&value="+value;
		caminho = url.ajax_add_location+".json";
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
		success: function(data){
			console.log(e.name);
			if(e.name == "profession"){
				adicionandoProfissao(value, profession, data.competencies);
			}
			else if(e.name == "country") {
				var states = document.getElementsByName("states")[0];
				states.disabled = false;
				// console.log(data[1]);
				opcoes = data;
				for( i in opcoes ){ 
					var opcao = document.createElement('option');
					opcao.innerHTML = opcoes[i];
					opcao.value = i;
					states.appendChild(opcao);	
				}
			}
			else if(e.name == "states")  {
				var city = document.getElementsByName("city")[0];
				city.disabled = false;
				opcoes = data;
				for( i in opcoes ){ 
					var opcao = document.createElement('option');
					opcao.innerHTML = opcoes[i];
					opcao.value = i;
					city.appendChild(opcao);	
				}
			}
			else if(e.name == "username"){
				location.href= url.index;
			}
			else{
				console.log(data);
			}
		},
		error: function(data){
			console.log(data);
		}
	});
}

