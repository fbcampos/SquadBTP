function showSubAssunto() {
  var subassuntoinfo = document.getElementById("infoSubAssunto");
  var subassuntoinfoValue = document.getElementById("SubAssuntoInfo").value;
  var subassuntoreclamacao = document.getElementById("reclamacaoSubAssunto");
  var subassuntoreclamacaoValue = document.getElementById("SubAssuntoReclamacao").value;
  var assunto = document.getElementById("Assunto").value;
  if(assunto == "CS_02"){    
    subassuntoinfo.style.display = "block";
    subassuntoreclamacao.style.display = "none";
    document.getElementById("formNumPedido").hidden=false;                       
  } else {
    if(assunto == "CS_03") {
      subassuntoreclamacao.style.display = "block";
      subassuntoinfo.style.display = "none";
      document.getElementById("formNumPedido").hidden=false;                                
    } else {
      subassuntoinfo.style.display = "none";
      subassuntoreclamacao.style.display = "none";
      document.getElementById("formNumPedido").hidden=true;                  
    }
  }
}

function numPedidoRequired(){
  var subassuntoinfoValue = document.getElementById("SubAssuntoInfo").value;
  var subassuntoreclamacaoValue = document.getElementById("SubAssuntoReclamacao").value;
  if(subassuntoinfoValue == 'CS_02_05'){
    document.getElementById("NumeroPedido").required=true;
    document.getElementById("NumeroPedidoLabel").innerHTML = 'Número do Pedido*';

  }else if(subassuntoreclamacaoValue == 'CS_03_02_03'){
    document.getElementById("NumeroPedido").required=true;
    document.getElementById("NumeroPedidoLabel").innerHTML = 'Número do Pedido*';

  }else{
    document.getElementById("NumeroPedido").required=false;
    document.getElementById("NumeroPedidoLabel").innerHTML = 'Número do Pedido';

  }
}        

const myForm = document.getElementById('myForm');

myForm.addEventListener('submit', function(e) {         
  e.preventDefault();

  document.getElementById("form").hidden=true;
  document.getElementById("loading").hidden=false;

  var nome = document.getElementById("Nome").value;
  var sobrenome = document.getElementById("Sobrenome").value;
  var cpf = document.getElementById("CPF").value;
  var email = document.getElementById("Email").value;
  var celular = "+55"+ document.getElementById("Celular").value;
  var assunto = document.getElementById("Assunto").value;
  var subassuntoinfo = document.getElementById("SubAssuntoInfo").value;
  var subassuntoreclamacao = document.getElementById("SubAssuntoReclamacao").value;
  var subassunto = assunto == "CS_02" ? subassuntoinfo : (assunto == "CS_03" ? subassuntoreclamacao : "");
  var numeropedido = document.getElementById("NumeroPedido").value;
  var mensagem = document.getElementById("Mensagem").value;
  var politicaprivacidade = document.getElementById("PoliticaPrivacidade").checked;

  const ticket = {
    nome,
    sobrenome,
    cpf,
    email,
    celular,
    assunto,
    subassunto,
    numeropedido,
    mensagem,
    politicaprivacidade
  };

  const jsonString = JSON.stringify(ticket)

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic UzAwMjEyMTczNDM6Q3JtQDIwMjE=");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "*/*");

// Com o Header ja montado, setamos o params obj e passamos nosso Header obj dentro desse new obj e mostramos que tipo de request queremos fazer
// no nosso caso um GET request.         
var requestOptions = {
  method: 'POST',        
  body: jsonString,        
  headers: myHeaders        
};

// Com o param obj montado, precisamos apenas passar como parametro para o method fetch o endpoint onde faremos o request e o nosso params obj         
fetch("https://cors-vertra.herokuapp.com/https://l400314-iflmap.hcisbp.br1.hana.ondemand.com/http/C4C/serviceticket", requestOptions)
  .then(response => response.text())
  .then(result => { 

//console.log(JSON.parse(result).ServiceRequestCollection);                    

if (JSON.parse(result).ServiceRequestCollection.ServiceRequest.ID != null) {

  document.getElementById("loading").hidden=true;
  document.getElementById("success").hidden=false;

  var id = JSON.parse(result).ServiceRequestCollection.ServiceRequest.ID 

} else {

  document.getElementById("failed").hidden=false;
  document.getElementById("form").hidden=true;
}
}).catch(function(error){         
//console.error(error);
document.getElementById("failed").hidden=false;
document.getElementById("form").hidden=true;                   
})         
});

function validaCpfCnpj(cpfcnpj){
  var optin = document.getElementById("PoliticaPrivacidade").checked;
  var recap = grecaptcha.getResponse();
    if(analisaCpfCnpj(cpfcnpj)){
        document.getElementById("errorCPF").hidden = true;
    if(optin == true && recap !=''){
        document.getElementById("Enviar").disabled=false;
    }
        //alert("é vdd");
    }else{
        document.getElementById('CPF').focus();
    document.getElementById("errorCPF").hidden = false;
    document.getElementById("Enviar").disabled=true;
        //alert("erroooou");
    }
}

function analisaCpfCnpj(val) {
    val = val.replace(/\D/g,""); 
    if (val.length == 11) {
        var cpf = val.trim();               

        var v1 = 0;
        var v2 = 0;
        var aux = false;

        for (var i = 1; cpf.length > i; i++) {
            if (cpf[i - 1] != cpf[i]) {
                aux = true;   
            }
        } 

        if (aux == false) {
            return false; 
        } 

        for (var i = 0, p = 10; (cpf.length - 2) > i; i++, p--) {
            v1 += cpf[i] * p; 
        } 

        v1 = ((v1 * 10) % 11);

        if (v1 == 10) {
            v1 = 0; 
        }

        if (v1 != cpf[9]) {
            return false; 
        } 

        for (var i = 0, p = 11; (cpf.length - 1) > i; i++, p--) {
            v2 += cpf[i] * p; 
        } 

        v2 = ((v2 * 10) % 11);

        if (v2 == 10) {
            v2 = 0; 
        }

        if (v2 != cpf[10]) {
            return false; 
        } else {   
            return true; 
        }
    } else {
        return false;
    }
}

function validacaoEmail(field) {
//alert("ahahaha");
usuario = field.value.substring(0, field.value.indexOf("@"));
dominio = field.value.substring(field.value.indexOf("@")+ 1, field.value.length);
var optin = document.getElementById("PoliticaPrivacidade").checked;
var recap = grecaptcha.getResponse();

if ((usuario.length >=1) &&
  (dominio.length >=3) &&
  (usuario.search("@")==-1) &&
  (dominio.search("@")==-1) &&
  (usuario.search(" ")==-1) &&
  (dominio.search(" ")==-1) &&
  (dominio.search(".")!=-1) &&
  (dominio.indexOf(".") >=1)&&
  (dominio.lastIndexOf(".") < dominio.length - 1)) {
  document.getElementById("errorEmail").hidden = true;
  if(optin == true && recap !=''){
      document.getElementById("Enviar").disabled=false;
  }
}
else{
  document.getElementById('Email').focus();
  document.getElementById("errorEmail").hidden = false;
  document.getElementById("Enviar").disabled=true;
//document.getElementById("msgemail").innerHTML="<font color='red'>E-mail inválido </font>";
//alert("E-mail invalido");
}
}
function validacaoCelular(Objcel) {
  var cel = document.getElementById('Celular').value;
  var optin = document.getElementById("PoliticaPrivacidade").checked;
  var recap = grecaptcha.getResponse();
  var phoneRe = /^(()?\d{2}())?(|\s)?\d{5}(|\s)?\d{4}$/;
//var validade = phoneRe.test(cel);

if(phoneRe.test(cel)){
  document.getElementById("errorCelular").hidden = true;
  if(optin == true && recap !=''){
      document.getElementById("Enviar").disabled=false;
  }
}
else{
  document.getElementById('Celular').focus();
  document.getElementById("errorCelular").hidden = false;
  document.getElementById("Enviar").disabled=true;
}  
}
function validaPoliticaPrivacRecaptcha(){
    var optin = document.getElementById("PoliticaPrivacidade").checked;
    var recap = grecaptcha.getResponse();
    if(optin == true && recap != ''){
        document.getElementById('Enviar').disabled = false;
    }else{
        document.getElementById('Enviar').disabled = true;
    }
}
function verificaPoliticaPrivacRecaptcha(o,f){
  setTimeout(function() {
    var v = validaPoliticaPrivacRecaptcha();   
    }, 1)
}