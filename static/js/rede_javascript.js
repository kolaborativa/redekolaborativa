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

	mudaStatusCheckbox();
	DOMEditarPerfil();
}

function mudaStatusCheckbox(checkbox){

	checkbox = checkbox == null ? document.querySelector("[data-checkbox-label]") : checkbox

	// pega o Label que ta com o texto
	// Verifica se o campo veio nulo, se veio define o campo Default, se não usa o parametro mesmo

	var disponibilidades = Id("disponibilidades");


	var checked 		 = document.getElementsByName("user_available")[0].checked;

	if (checked) {

		checkbox.innerHTML = "Disponivel"
		disponibilidades.style.display = "block";
		alert('sim');
	}
	else{

		checkbox.innerHTML = "Indisponivel"
		disponibilidades.style.display = "none";
		alert("nao");
	}
	console.log("checado",checked);
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
		// Muda o bloco
		if (status == "false") {
			fases_edicao[iFases].style.display = "none";
		}
		else{
			fases_edicao[iFases].style.display = "block";
		};
	};

	// Identifica quais as imagens da fase atual de edição do perfil e adiciona dinamicamente
	switch(fase){
		case "1":
			 img_fase[0].src = image.editProfilefase1
			 img_fase[1].src = image.editProfilefase2_cinza
			 img_fase[2].src = image.editProfilefase3_cinza
			 img_fase[3].src = image.editProfilefase4_cinza
		break;
		case "2":
			 img_fase[0].src = image.editProfilefase1_completa
			 img_fase[1].src = image.editProfilefase2
			 img_fase[2].src = image.editProfilefase3_cinza
			 img_fase[3].src = image.editProfilefase4_cinza
		break;
		case "3":
			 img_fase[0].src = image.editProfilefase1_completa
			 img_fase[1].src = image.editProfilefase2_completa
			 img_fase[2].src = image.editProfilefase3
			 img_fase[3].src = image.editProfilefase4_cinza
		break;
		case "4":
			 img_fase[0].src = image.editProfilefase1_completa
			 img_fase[1].src = image.editProfilefase2_completa
			 img_fase[2].src = image.editProfilefase3_completa
			 img_fase[3].src = image.editProfilefase4
		break;

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
	var iBtnPerfil = 0;
	var img_fase   = SelectAll("data-img-fase");
	var iImg	   = 0;
	var label      = SelectAll("data-checkbox-label");
	var iLabel 	   = 0;
	var editar     = SelectAll("data-edit-user");
	var iEditar    = 0;
	var formulario = Id("formulario_edicao_perfil")
	var inputs     = formulario.getElementsByTagName("input");
	var iInputs    = 0;
	var selects    = formulario.getElementsByTagName("select");
	var iSelects   = 0
	var textareas  = formulario.getElementsByTagName("textarea")[0];
	var links      = document.getElementsByName("delete_link");
	var iLinks     = 0;

	// Chama a função para ir para o próximo estágio do editar perfil
	for (; iBtnPerfil < btnPerfil.length; iBtnPerfil++) {
		btnPerfil[iBtnPerfil].addEventListener("click",function(){
			mudando_fase_perfil(this.getAttribute("data-irParaFase"));
		});
	};

	// Chama a função para ir para o próximo estágio do editar perfil
	for (; iImg < img_fase.length; iImg++) {
		img_fase[iImg].addEventListener("click",function(){
			mudando_fase_perfil(this.getAttribute("data-img-fase"));
		});
	};

	for (; iLabel < label.length; iLabel++) {
		label[iLabel].addEventListener("click",function(){
			// mudaStatusCheckbox(this)
		})
	}


	for (; iEditar < editar.length; iEditar++) {
		editar[iEditar].addEventListener("click",function(){
			editarUsuario(this.getAttribute("data-edit-user"));
		});
	};

	MascaraDeData();

	//Parte da Bio pra ver quantos caracteres tem ainda a ser digitados
	document.querySelector("[data-caracteres]").innerHTML = (350 - textareas.value.length);
	textareas.addEventListener("keyup",function(){
		document.querySelector("[data-caracteres]").innerHTML = (350 - this.value.length);
		if(this.value.length >= 350){
			this.value = this.value.substr(0,350);
		}
	})

	//
	textareas.addEventListener("change",function(){	gravaAjaxEditProfile(this) });


	for (; iInputs < inputs.length; iInputs++) {
		if(inputs[iInputs].id == "network"){
			Id("network").addEventListener("change",function(){
				gravaAjaxEditProfile(this);
			})
		}
		else if(inputs[iInputs].name == "user_available"){
			inputs[iInputs].addEventListener("change",function(){
				mudaStatusCheckbox();
				gravaAjaxEditProfile(this)
			})
		}
		else if(inputs[iInputs].name != "avatar"){ //Pula o input avatar !
			inputs[iInputs].addEventListener("change",function(){gravaAjaxEditProfile(this);})
		}

	};


	for (; iSelects < selects.length; iSelects++) {
		if(selects[iSelects].name == "profession"){

		}
		else if(selects[iSelects].name == "link_type_id"){
			selects[iSelects].addEventListener("change",function(){
				Id("network").disabled = false;
			});
		}
		else{
			selects[iSelects].addEventListener("change",function(){
					gravaAjaxEditProfile(this)
			});
		}
	};


	for (; iLinks < links.length; iLinks++) {
		links[iLinks].addEventListener("click",function(){
				gravaAjaxEditProfile(this);
				// console.log(this);
		})
	};

	$("#profissoes").select2({ 	maximumSelectionSize: 1	});
	$("#profissoes").on("click",function(){	gravaAjaxEditProfile(this);	});

	// Identifica os data-select e busca no banco as competencias que já existem
	$("select[data-select]").select2({ 	maximumSelectionSize: 5 });
	$("select[data-select]").on("click",function(){gravaAjaxEditProfile(this)});
	$(".delete_profissao").on("click",function(){
		gravaAjaxEditProfile(this);
	});


}




function adicionandoProfissao(idProfissao, profissao,competencias){

	var select      = document.createElement('select');
		select.name = "competence";
		select.setAttribute('data-placeholder','adicione competencias');
		select.setAttribute('data-select',profissao)
		select.setAttribute('data-idProfissao',idProfissao);
		select.setAttribute('class','w-full competencias');
		select.setAttribute('multiple','')

	// Cria um for de opções
	for( i in competencias ){
		var opcao           = document.createElement('option');
			opcao.innerHTML = competencias[i];
			opcao.value     = i;

		select.appendChild(opcao);
	}

	var linha = document.createElement('li')
		linha.setAttribute('class','profissao t-left');

	var span = document.createElement('span');
		span.setAttribute('class','h2');
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
	$("[data-select='"+profissao+"']").select2({maximumSelectionSize: 5});
	$("[data-select='"+profissao+"']").on("change",function(){gravaAjaxEditProfile(this);});
	$(".delete_profissao").on("click",function(){console.log("delete isso");});

};


function gravaAjaxEditProfile(e){

	var field;
	var value;
	var vars;

	if(e.name == "profession"){

		field = e.name;
		value = e.value;
		vars  = "field="+field+"&value="+value;

		console.log(url.ajax_add_profission);

		var profession = e.selectedOptions[0].innerHTML;
			caminho    = url.ajax_add_profission+".json";
		e.selectedOptions[0].disabled = true;
		$("#profissoes").select2("val", "")


	}else if(e.id == "network"){

			var link_type_id = Id("no_table_link_type_id").value;
			var link 	 	 = e.value;
				vars    	 = "link_type_id="+link_type_id+"&url="+link;
				caminho 	 = url.ajax_add_link;

	}
	else if(e.name == "user_available"){

			field   = e.name;
			value   = e.checked == true ? value = true : value=false;;
			vars    = "field="+field+"&value="+value;
			caminho = url.edit_profile;
	}
	else if(e.name == "competence"){

		var idProfession         = e.getAttribute("data-idProfissao");
		var vetCompetence        = new Array();
			vetCompetence.length = 0;

		for (var i = 0; i < e.options.length; i++) {
			if(e.options[i].selected) {
				vetCompetence.push(e.options.item(i).value);
			}
		};

		vetCompetence = "["+vetCompetence+"]";
		vars	   	  = "profession="+idProfession+"&competence="+vetCompetence;
		caminho 	  = url.ajax_add_competence;

	}
	else if(e.name == "avatar"){

		var img 	= Id("hidden-avatar").value;
			vars    = {image64: img, field : e.name}; // Cria um objeto com a img em base64 e o nome do campo
			caminho = url.edit_profile;
	}
	else if(e.name == "country_id" || e.name == "states_id" || e.name == "city_id"){
			field   = e.name;
			value   = e.value;
			vars    = "field="+field+"&value="+value;
			caminho = url.ajax_add_location+".json";
	}
	else if(e.name == "delete_link"){
		field = e.name;
		value = e.id;
		vars = "field="+field+"&id="+value;
		caminho = url.testaAjax;
	}
	else if(e.name == "delete_profission"){
		field = e.name;
		value = e.getAttribute("data-idProfissao");
		vars = "field="+field+"&id="+value;
		caminho = url.testaAjax;
	}
	else {
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
			if(e.name == "profession"){
				adicionandoProfissao(value, profession, data.competencies);
			}
			else if(e.name == "country_id"){
				var states  	    = document.getElementsByName("states_id")[0];
					states.disabled = false;
					opcoes  	    = data;
				for( i in opcoes ) {
					var opcao       = document.createElement('option');
					opcao.innerHTML = opcoes[i];
					opcao.value     = i;
					states.appendChild(opcao);
				}
			}
			else if(e.name == "states_id"){
				var city 	   	   = document.getElementsByName("city_id")[0];
					city.disabled  = false;
					opcoes	       = data;
	                city.innerHTML = ""

				for( i in opcoes ) {
					var opcao     	    = document.createElement('option');
						opcao.innerHTML = opcoes[i];
						opcao.value     = i;
						city.appendChild(opcao);
				};
			}
			else if(e.name == "username") {
				location.href = url.index;
			}
			else if(e.id == "network"){
				console.log("foi");
				Id("no_table_link_type_id").selectedOptions[0].disabled = true;
				console.log(data);
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

function MascaraDeData(){
	var nascimentoDta = Id("auth_user_born_on"); // Pega o campo que recebe a data
		nascimentoDta.addEventListener("keyup",function(){
			  var data = this.value;

              if (data.length == 2) {
                  data 		 = data + '/';
                  this.value = data;
      			  return true;
              }
              if (data.length == 5) {
                  data 		 = data + '/';
                  this.value = data;
                  return true;
              }

			if(this.value.length >= 10) {
				this.value = this.value.substr(0,10);
			}
		});

		nascimentoDta.value = nascimentoDta.value.replace("-","/");
		nascimentoDta.value = nascimentoDta.value.replace("-","/");

}
