// Required for drag and drop file access
jQuery.event.props.push('dataTransfer');

// IIFE to prevent globals
(function() {

  var s;
  var Avatar = {

    settings: {
      bod: $("body"),
      img: $("#profile-avatar"),
      fileInput: $("#uploader")
      
    },

    init: function() {
      s = Avatar.settings;
      Avatar.bindUIActions();
    },

    bindUIActions: function() {

      var timer;

      s.bod.on("dragover", function(event) {
        console.log("dragover")
        clearTimeout(timer);
        if (event.currentTarget == s.bod[0]) {
          Avatar.showDroppableArea();
        }

        // Required for drop to work
        return false;
      });

      s.bod.on('dragleave', function(event) {
        console.log("dragleave")
        if (event.currentTarget == s.bod[0]) {
          // Flicker protection
          timer = setTimeout(function() {
            Avatar.hideDroppableArea();
          }, 200);
        }
      });

      s.bod.on('drop', function(event) {
        console.log("drop")
        // Or else the browser will open the file
        event.preventDefault();

        Avatar.handleDrop(event.dataTransfer.files);
      });

      s.fileInput.on('change', function(event) {
        Avatar.handleDrop(event.target.files);
      });
    },

    showDroppableArea: function() {
      s.bod.addClass("droppable");
    },

    hideDroppableArea: function() {
      s.bod.removeClass("droppable");
    },

    handleDrop: function(files) {

      Avatar.hideDroppableArea();

      // Multiple files can be dropped. Lets only deal with the "first" one.
      var file = files[0];

      if (typeof file !== 'undefined' && file.type.match('image.*')) {
        // Passa o arquivo, depois a dimensao Width e depois Height
        Avatar.resizeImage(file, 154,142, function(data) {
          Avatar.placeImage(data);
        });

      } else {

        alert("That file wasn't an image.");

      }

    },

    resizeImage: function(file, sizeW,sizeH, callback) {

      var fileTracker = new FileReader;
      fileTracker.onload = function() {
        Resample(
         this.result,
         sizeW,
         sizeH,
         callback
       );
      }
      fileTracker.readAsDataURL(file);

      fileTracker.onabort = function() {
        alert("The upload was aborted.");
      }
      fileTracker.onerror = function() {
        alert("An error occured while reading the file.");
      }

    },

    placeImage: function(data) {
      s.img.attr("src", data);
      document.getElementById("hidden-avatar").value = data; // coloca o base64 da imagem em um input hidden

      // Esse trecho diz respeito ao site da RedeKolaborativa
      // Trecho não faz parte do Plugin
      if(Id("formulario_edicao_perfil") != null) {
        gravaAjaxEditProfile(document.getElementById("uploader")); 
      }
      // else if(Id("formulario_EditCreate_projeto") != null) {
      //   gravaAjaxEditCreateProjeto(document.getElementById("uploader"))
      // }
      // Pega na hora da mudança da imagem e envia por ajax para o backend a imagem em base 64
      // Esse trecho só é usado na rede Kolaborativa, podendo ser tirado para uso perfeito do plugin
      

    }

  }

  Avatar.init();

})();
