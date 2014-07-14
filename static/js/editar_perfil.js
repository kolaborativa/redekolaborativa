
// Códigos da parte de Editar Perfil

function DOMEditarPerfil(){
		mudando_fase_perfil();

		validacaoLocalizacao();
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
	var pais  	   = Id('auth_user_country_id')
	var estado 	   = Id('auth_user_states_id')
	var cidade 	   = Id('auth_user_city_id')

	pais.addEventListener("change",validacaoLocalizacao);
	estado.addEventListener("change",validacaoLocalizacao);
	cidade.addEventListener("change",validacaoLocalizacao);

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
	document.querySelector("[data-caracteres]").innerHTML = (400 - textareas.value.length);
	textareas.addEventListener("keyup",function(){
		document.querySelector("[data-caracteres]").innerHTML = (400 - this.value.length);
		if(this.value.length >= 400){
			this.value = this.value.substr(0,400);
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
		else if(inputs[iInputs].name == "site"){
			inputs[iInputs].addEventListener("change",function(){
				if(regexLink(this)){
					gravaAjaxEditProfile(this);
				}else{
					alert('Digite um link válido');
				}
			});
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
			if(confirm("Deseja realmente deletar?")){
				gravaAjaxEditProfile(this);
			}
		})
	};

	//
	$("#profissoes").select2({ 	maximumSelectionSize: 1	});
	$("#profissoes").on("click",function(){	gravaAjaxEditProfile(this);	});
	// Identifica os data-select e busca no banco as competencias que já existem
	$("select[data-select]").select2({ 	maximumSelectionSize: 5 });
	$("select[data-select]").on("click",function(){gravaAjaxEditProfile(this)});
	$(".delete_profissao").on("click",function(){if(confirm("Deseja realmente deletar?")){gravaAjaxEditProfile(this);}});


}


function validacaoLocalizacao(){

	var pais   = Id('auth_user_country_id')
	var cidade = Id('auth_user_city_id')
	var estado = Id('auth_user_states_id')
	console.log(pais.selectedIndex);
	
	if(pais.selectedOptions[0].value != ""){
	  	estado.disabled = false;
	}else{
		estado.disabled = true;
	}

	if(estado.selectedOptions[0].value != ""){
		cidade.disabled = false;
	}
	else{ 
		cidade.disabled = true;
	}
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
		linha.setAttribute("data-profissao",idProfissao);

	var span = document.createElement('span');
		span.setAttribute('class','h2');
		span.innerHTML = profissao;

	var deletar = document.createElement('img');
		deletar.setAttribute('class','delete_profissao f-right');
		deletar.src= image.delete;
		deletar.setAttribute("data-idProfissao",idProfissao)
		deletar.name="delete_profission";
		deletar.addEventListener("click",function(){
			if(confirm("Deseja realmente deletar?")){
				gravaAjaxEditProfile(this);
			}
		});

	var listasProfissoes = document.querySelector('.list-profissao')

		span.appendChild(deletar);
		linha.appendChild(span);
		linha.appendChild(select);
		listasProfissoes.appendChild(linha);

	// Eventos ================
	$("[data-select='"+profissao+"']").select2({maximumSelectionSize: 5});
	$("[data-select='"+profissao+"']").on("change",function(){gravaAjaxEditProfile(this);});
	

};

function adicionandoLinks(linkName,linkId,url){

	var div  = document.createElement("div");
	var thumbnail = document.createElement("img");
	var img = document.createElement("img");
	var a = document.createElement("a");
	var span = document.createElement("span");

	// thumbnail do link
	switch(linkName){
		case "Facebook":
			 thumbnail.src = social_ico.facebook
			 thumbnail.alt = "Facebook"
			 break;

	}
	


	// Link 
	a.src 		= url;
	a.innerHTML = url;
	a.target    = "_blank";

	// btn Delete
	img.src     = image.delete;
	img.id      = linkId;
	img.name    ="delete_link";
	img.addEventListener("click",function(){
			if(confirm("Deseja realmente deletar?")){
				gravaAjaxEditProfile(this);
			}
	});

	span.appendChild(a);
	div.setAttribute("class","social-field");	
	div.setAttribute("data-link",linkId);
	div.appendChild(thumbnail);
	div.appendChild(span);
	div.appendChild(img);
	document.getElementById("field-links").appendChild(div);
	
}



function deletandoProfissao(id){
	 var campo  = Id("list-profissao").querySelectorAll("[data-profissao]");
	 var iCampo = 0;
	 var bloco;

	 for (; iCampo < campo.length; iCampo++) {

	 	bloco = campo[iCampo].getAttribute("data-profissao");

	 	if(bloco == id){
	 		Id("list-profissao").removeChild(campo[iCampo]);
	 		for (var i = 0; i < Id("profissoes").options.length; i++) {
	 			if(Id("profissoes").options[i].value == id){
	 				Id("profissoes").options[i].disabled = false;
	 			}
	 		};
	 	}

	 };
}
function deletandoLinks(id){

	 var campo  = Id("field-links").querySelectorAll("[data-link]");
	 var iCampo = 0;
	 var bloco;

	 for (; iCampo < campo.length; iCampo++) {

	 	bloco = campo[iCampo].getAttribute("data-link");

	 	if(bloco == id){
	 		Id("field-links").removeChild(campo[iCampo]);
	 		for (var i = 0; i < Id("no_table_link_type_id").options.length; i++) {
	 			if(Id("no_table_link_type_id").options[i].value == id ){
	 				Id("no_table_link_type_id").options[i].disabled = false;
	 			}
	 		};
	 	}

	 };
	 
	 
	 

}

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
			var linkName 	 = Id("no_table_link_type_id").selectedOptions.item().innerHTML;
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
		caminho = url.ajax_remove_link;
	}
	else if(e.name == "delete_profission"){
		field = e.name;
		value = e.getAttribute("data-idProfissao");
		vars = "field="+field+"&id="+value;
		caminho = url.ajax_remove_profission;
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
				Id("no_table_link_type_id").selectedOptions[0].disabled = true;
				Id("no_table_link_type_id").selectedIndex = 0
				e.value = "";
				adicionandoLinks(linkName,link_type_id,link);
			}
			else if(e.name == "delete_link"){
				deletandoLinks(value);
			}
			else if(e.name == "delete_profission"){
				deletandoProfissao(value);
			}
			else if(e.name =="avatar"){
				document.querySelector('[data-section-avatar]').classList.remove('branco');
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
function mudaStatusCheckbox(checkbox){

	checkbox = checkbox == null ? document.querySelector("[data-checkbox-label]") : checkbox

	// pega o Label que ta com o texto
	// Verifica se o campo veio nulo, se veio define o campo Default, se não usa o parametro mesmo

	var disponibilidades = Id("disponibilidades");
	var label 			 = document.querySelector("[data-checkbox-label]");
	var div 			 = document.querySelector("[data-div-label]");
	var checked 		 = document.getElementsByName("user_available")[0].checked;

	
	
	if (checked) {

		checkbox.innerHTML = "Disponivel"
		disponibilidades.style.display = "block";
		div.classList.remove("vermelho1");
		div.classList.add("verdeAgua2");
		label.classList.remove("vermelho2");
		label.classList.add("verdeAgua")
	}
	else{
		div.classList.add("vermelho1");
		label.classList.add("vermelho2");
		div.classList.remove("verdeAgua2");
		label.classList.remove("verdeAgua");

		checkbox.innerHTML = "Indisponivel"
		disponibilidades.style.display = "none";
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