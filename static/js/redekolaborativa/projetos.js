function DOMEditCreateProjeto(){
	mudando_fase_projeto(pegaGET('stage'));
	
};


function SetandoAjaxProjeto(){
	var inputs    = document.getElementsByTagName('input');
	var iInput    = 0;
	var textArea  = document.getElementsByTagName('textarea')
	var iTextArea = 0;
	var selects   = document.getElementsByTagName('select')
	var iSelect   = 0

	for (; iInput < inputs.length; iInput++) {
		if(inputs[iInput].name != "avatar"){ //Pula o input avatar !
			inputs[iInput].addEventListener("change",function(){gravaAjaxEditProfile(this);})
		}
	};

	for (; iTextArea < textArea.length; iTextArea++) {
		textArea[iTextArea].addEventListener('change',function(){
			gravaAjaxEditCreateProjeto(this);
		})
	};
	for (; iSelect < selects.length; iSelect++) {
		selects[iSelect].addEventListener('change',function(){
			gravaAjaxEditCreateProjeto(this);
		})
	};
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
			 img_fase[0].src = image.editProjetofase1_completa;
			 img_fase[1].src = image.editProjetofase2;
			 img_fase[2].src = image.editProjetofase3;
		break;
		// case "2":
		// 	 img_fase[0].src = image.editProjetofase1_completa
		// 	 img_fase[1].src = image.editProjetofase2_completa
		// 	 img_fase[2].src = image.editProjetofase3_cinza
		// break;
		// case "3":
		// 	 img_fase[0].src = image.editProjetofase1_completa
		// 	 img_fase[1].src = image.editProjetofase2_completa
		// 	 img_fase[2].src = image.editProjetofase3
		// break;
	};
}

function gravaAjaxEditCreateProjeto(e){

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