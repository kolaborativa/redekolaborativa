function DOMCreateProjeto(){
	mudando_fase_projeto(pegaGET('stage'));
	validaCriacao();
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
	ajaxAdicionandoProjeto()
	// $("#profissoes").on("click",function(){	gravaAjaxEditProfile(this);	});
	

};


function ajaxAdicionandoProjeto(){
        // Ativa o pluguin select2
        $('#adicionaMembro').select2({
        	minimumInputLength: 1,
        	 ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
        		url: url.testaAjax+".json",
		        results: function (data) { 
		            // console.log(data.usuarios[0]);
		            return {results: data.usuarios[0]};
		        },
		        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
    			escapeMarkup: function (m) { return m; }
		    }
        });

        // document.getElementById('adicionaMembro').addEventListener('keyup',function(){
        // 	if(true){
        // 		$.ajax({
		      //       type: "POST",
		      //       cache:false,
		      //       response:vars,
		      //       url: url.testaAjax+".json",
		      //       success: function(response)
		      //       {	
		      //       	console.log(response);
		      //       	var opcoes;
		      //       	for(i in response.usuarios){
		      //       		// console.log("id >> ",response.usuarios[i].id)
		      //       		// console.log("Nome >> ",response.usuarios[i].nome)
		      //       		// console.log("Email >> ",response.usuarios[i].email)
		      //       		var opcao = document.createElement('option');
		      //       		opcao.value = response.usuarios[i].id;
		      //       		opcao.innerHTML = response.usuarios[i].nome;
		      //       		$('#adicionaMembro').append(opcao);
		      //       		$('#adicionaMembro').select2();
		      //       	}
		      //       	// $('#adicionaMembro').html(opcoes);
		      //       }
		      //   });
        // 	}
        // })

        
		
        
};




function validaCriacao(){
	var inputs    = document.getElementsByTagName('input');
	var textArea  = document.getElementsByTagName('textarea')
	var iTextArea = 0;
	var selects   = document.getElementsByTagName('select')

	
	for (; iTextArea < textArea.length; iTextArea++) {
		textArea[iTextArea].addEventListener("keyup",function(){
			var idCampoLimite 			= this.getAttribute('data-limite-id')
			var limite 					= this.getAttribute('data-limite')
			Id(idCampoLimite).innerHTML = validaQtdCaracter(this,limite);
		});	
	};
	
}


function SetandoAjaxProjeto(){
	var inputs    = document.getElementsByTagName('input');
	var iInput    = 0;
	var textArea  = document.getElementsByTagName('textarea')
	var iTextArea = 0;
	var selects   = document.getElementsByTagName('select')
	var iSelect   = 0
	
	for (; iInput < inputs.length; iInput++) {
		if(inputs[iInput].name == "CheckboxOnOff"){
			// Inputs de checkbox primeira verificação
			checkboxOnOff(inputs[iInput],"On","Off");
			inputs[iInput].addEventListener("change",function(){
				checkboxOnOff(this,"On","Off");
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
		selects[iSelect].addEventListener("change",function(){enviaAjax(this)});};
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
			console.log(data);
			if(e.name == "avatar"){
				document.querySelector('[data-section-avatar]').classList.remove('branco');
			}
		},
		error: function(data){
			console.log(data);
		}
	});
}

// Checkbox que vai ir para a função
// TextoOn do botão - a mensagem que vai aparecer quando tiver checkado
// TextoOff do botão - a mensagem que vai aparecer quando tiver não checkado

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
    
}
