function DOMCreateProjeto(){
	mudando_fase_projeto(pegaGET('stage'));
	validaCriacao();

	var nomeProjeto = Id('projects_name');
	var tipoProjeto = Id('projects_project_type');


	Id('submeter').addEventListener('click',function(){
		if(validaCriacao()){
			document.forms[1].submit();
		}else{
			alert("Preencha os campos obrigatórios");
			console.log(nomeProjeto);
			if(nomeProjeto.value == ""){
				nomeProjeto.classList.add('input-invalido');	
			}
			else{
				nomeProjeto.classList.remove('input-invalido');
			}

			if(tipoProjeto.selectedIndex == 0){
				Id("tiposProjetos").classList.add('input-invalido')
			}
			else{
				Id("tiposProjetos").classList.remove('input-invalido')	
			}
		}
	})

	var textArea  = document.getElementsByTagName('textarea')
	var iTextArea = 0;
	
	for (; iTextArea < textArea.length; iTextArea++) {
		textArea[iTextArea].addEventListener("keyup",function(){
			var idCampoLimite 			= this.getAttribute('data-limite-id')
			var limite 					= this.getAttribute('data-limite')
			Id(idCampoLimite).innerHTML = validaQtdCaracter(this,limite);
		});	
	};

}

function DOMEditProjeto(){
	mudando_fase_projeto(pegaGET('stage'));
	var btnPerfil  = SelectAll("data-irParaFase");
	var iBtnPerfil = 0;
	var img_fase   = SelectAll("data-img-fase");
	var iImg	   = 0;

	// Chama a função para ir para o próximo estágio do editar perfil
	for (; iBtnPerfil < btnPerfil.length; iBtnPerfil++) {
		btnPerfil[iBtnPerfil].addEventListener("click",function(){
			mudando_fase_projeto(this.getAttribute("data-irParaFase"));
		});
	};

	// Chama a função para ir para o próximo estágio do editar perfil
	for (; iImg < img_fase.length; iImg++) {
		img_fase[iImg].addEventListener("click",function(){
			mudando_fase_projeto(this.getAttribute("data-img-fase"));
		});
	};

	SetandoAjaxProjeto();
	MultiAjaxAutoComplete() 
	// $("#profissoes").on("click",function(){	gravaAjaxEditProfile(this);	});

};







function validaCriacao(){

	nomeProjeto = Id('projects_name').value;
	tipoProjeto = Id('projects_project_type').selectedIndex;

	if(nomeProjeto != "" && tipoProjeto != 0){
		return true;
	}
	else{
		return false;
	}
	
}


// Passa uma booleana (status) 
// 
function MostraBloco(status,bloco){
 	
 	if(status){
 		Id(bloco).style.display = 'block';
 	}else{
 		Id(bloco).style.display = 'none';
 	}


}

function SetandoAjaxProjeto(){
	var inputs    = document.getElementsByTagName('input');
	var iInput    = 0;
	var buttons   = document.getElementsByTagName('button');
	var iButtons  = 0
	var textArea  = document.getElementsByTagName('textarea')
	var iTextArea = 0;
	var selects   = document.getElementsByTagName('select')
	var iSelect   = 0
	
	for (; iInput < inputs.length; iInput++) {
		if(inputs[iInput].name == "CheckboxOnOff"){
			 // Inputs de checkbox primeira verificação
			MostraBloco(checkboxOnOff(inputs[iInput],"On","Off"),inputs[iInput].getAttribute('data-bloco'))

			inputs[iInput].addEventListener("change",function(){
					MostraBloco(checkboxOnOff(this,"On","Off"),this.getAttribute('data-bloco'))
			});
		}else if(inputs[iInput].name != "avatar"){ //Pula o input avatar !
			inputs[iInput].addEventListener("change",function(){enviaAjax(this)});
		}
	};

	for (; iTextArea < textArea.length; iTextArea++) {
		textArea[iTextArea].addEventListener("change",function(){enviaAjax(this)});	
		textArea[iTextArea].addEventListener("keyup",function(){
			var idCampoLimite 			= this.getAttribute('data-limite-id')
			var limite 					= this.getAttribute('data-limite')
			Id(idCampoLimite).innerHTML = validaQtdCaracter(this,limite);
		});	
	};
	for (; iSelect < selects.length; iSelect++) {
		
		if(selects[iSelect].name != "buscaOutros" && selects[iSelect].name != "buscaKolaborador"){
			selects[iSelect].addEventListener("change",function(){
				enviaAjax(this)
				console.log("Mudou")
			});
		}
	};

	for (; iButtons < buttons.length; iButtons++) {
		if(buttons[iButtons].name == "buscaKolaborador"){ // Adiciona evento de buscando kolaborador
			buttons[iButtons].addEventListener("click",function(){
				adicionandoBloco( 
					 'profissionalList' //IdBloco
					,Id('buscaKolaborador').selectedOptions[0].innerHTML //Texto
					,'data-id' //Data Attribute
					,Id('buscaKolaborador').id //Id do Elemento
				)
			});
		}else if(buttons[iButtons].name == "BuscandoOutros"){ // Adiciona event ode buscando por outras coisas
			buttons[iButtons].addEventListener("click",function(){
				adicionandoBloco(
					 'profissionalList' //IdBloco
					,Id('buscaOutros').selectedOptions[0].innerHTML //Texto
					,'data-id' //Data Attribute
					,Id('buscaOutros').id //Id do Elemento
				)
			});
		}
	};


		







}
		

function enviaAjax(e){
		if(e.value != "")
			 gravaAjaxEditProjeto(e);
		else console.log("Preencha Algo")
}

// Função de validação de quantidade de caracteres em um campo
// passa o campo por parametro, e qual é o limite de caracteres que esse campo pode ter
// Exemplo : validaQtdCaracter(elemento,50)
// Retorna quantos caracteres falta para alcançar o limite
function validaQtdCaracter(campo,limite){
		if(campo.value.length >= limite){
			campo.value = campo.value.substr(0,limite);
		}
		return (limite - campo.value.length)
}


function mudando_fase_projeto(fase){
	
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
			 img_fase[0].src = image.editProjetofase1;
			 img_fase[1].src = image.editProjetofase2_cinza;
			 img_fase[2].src = image.editProjetofase3_cinza;
		break;
		case "2":
			 img_fase[0].src = image.editProjetofase1_completa;
			 img_fase[1].src = image.editProjetofase2;
			 img_fase[2].src = image.editProjetofase3_cinza;
		break;
		case "3":
			 img_fase[0].src = image.editProjetofase1_completa;
			 img_fase[1].src = image.editProjetofase2_completa;
			 img_fase[2].src = image.editProjetofase3;
		break;
	};
}

function gravaAjaxEditProjeto(e){

	var field;
	var value;
	var vars;
	
	if(e.name == "avatar"){
		var img 	= Id("hidden-avatar").value;
			vars    = {image64: img, field : e.name}; // Cria um objeto com a img em base64 e o nome do campo
			caminho = url.testaAjax;
	}
	else {
			field = e.name;
			value = e.value;
			vars = "field="+field+"&value="+value;
			caminho = url.testaAjax;
	}

	$.ajax({
		type: 'POST',
		url: caminho,
		data: vars,
		success: function(data){
			if(e.name == "avatar"){
				document.querySelector('[data-section-avatar]').classList.remove('branco');
			}
			return true; // caso queira fazer uma condicional 
		},
		error: function(data){
			console.log(data);
		}
	});
}






// Checkbox que vai ir para a função
// TextoOn do botão - a mensagem que vai aparecer quando tiver checkado
// TextoOff do botão - a mensagem que vai aparecer quando tiver não checkado
// Retorna uma booleana caso queira usar como condicional
function checkboxOnOff(checkbox,textoOn,textoOff){
	
    var label            = document.querySelector("[data-checkbox-label='"+checkbox.id+"']");
    var div              = document.querySelector("[data-div-label='"+checkbox.id+"']");
    var checked          = checkbox.checked;
    label.innerHTML = checkbox.checked == null ? textoOn : textoOff

    if (checked) {
        div.classList.remove("vermelho1");
        div.classList.add("verdeAgua2");
        label.classList.remove("vermelho2");
        label.classList.add("verdeAgua")
        label.innerHTML = textoOn
    }
    else{
    	label.innerHTML = textoOff
        div.classList.add("vermelho1");
        label.classList.add("vermelho2");
        div.classList.remove("verdeAgua2");
        label.classList.remove("verdeAgua");
    }
    return checked
}

//Função para adicionar Kolaborador
//Passa por parametro a ID do bloco que contem todos os blocos
//Passa por parametro o Data Atribute que todos os blocos possuem
//Passa por parametro o ID do Elemento que você quer deletar
//Passa uma booleana para falar se o texto é um link ou não
//Passa uma URL para o Link
function adicionandoBloco(idBloco,texto,idElemento,dataAttribute,link,url){

	// Cria todos os elementos dinamicos
	var div  	  = document.createElement("div");
	var img  	  = document.createElement("img");
	var span 	  = document.createElement("span");

	// Se True cria o elemento com URL
	if(link){
		var a = document.createElement("a");
		a.src = url;
	}

	// Cria botão delete
	// Seta a Id do elemento
	// Adiciona o evento de remoção

	img.src     = image.delete; //  é colocado o Icone de deletar
	img.id      = idElemento; 
	img.name    ="delete_block"; 
	img.addEventListener("click",function(){
		if(confirm("Deseja realmente deletar?")){
			deletandoBloco(idBloco,dataAttribute,idElemento);
		}
	});

	// Coloca o texto dentro de um span
	// Seta as classes na div
	// Adiciona o Data Attribute com o valor da ID do elemento
	// 
	span.innerHTML = texto;
	div.setAttribute("class","social-field");	
	div.setAttribute(dataAttribute,idElemento);
	div.appendChild(span);
	div.appendChild(img);
	document.getElementById(idBloco).appendChild(div);
	
}


//Passa por parametro a ID do bloco que contem todos os blocos
//Passa por parametro o Data Atribute que todos os blocos possuem
//Passa por parametro o ID do Elemento que você quer deletar
function deletandoBloco(idBloco,dataAttribute,idElemento){
	 var campo  = Id(idBloco).querySelectorAll("["+dataAttribute+"]");
	 var iCampo = 0;
	 var bloco;
	 for (; iCampo < campo.length; iCampo++) {
	 	bloco = campo[iCampo].getAttribute(dataAttribute);
	 	if(bloco == idElemento){
	 		Id(idBloco).removeChild(campo[iCampo]);
	 	}
	 };
}



// Trabalhar nessa função ainda ! 
//  Não está pronta, ela tem que fazer uma ajax para buscar pessoas no banco de dados 	
function MultiAjaxAutoComplete() {
	var caminho = "{{=URL(r=request,f='call',args=['json','get_users'])}}";

	function formatResult(user) {
	    return '<div>' + user.title + '</div>';
	};

	function formatSelection(data) {
	    return data.title;
	};

    $('#projects_team').select2({
       placeholder: "{{=T('Search for a user')}}",
        minimumInputLength: 1,
        multiple: true,
        formatNoMatches: function(){return "{{=T('No results')}}"},
        formatSearching: function(){return "{{=T('Searching...')}}"},
        formatInputTooShort: function(){return "{{=T('Too short')}}"},

        id: function(e) { return e.id+":"+e.title; },
        ajax: {
            url: caminho,
            dataType: 'json',
            data: function(term, page) {

                return {
                    q: term,
                    page_limit: 10,
                };
            },
            results: function(data, page) {
                return {
                    results: data.users
                };
            }
        },
        formatResult: formatResult,
        formatSelection: formatSelection,
        initSelection: function(element, callback) {
            var data = [];
            $(element.val().split(",")).each(function(i) {
                var item = this.split(':');
                data.push({
                    id: item[0],
                    title: item[1]
                });
            });
            callback(data);
        }


    });
		
};





