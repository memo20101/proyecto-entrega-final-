let lData    = {};


window.addEventListener('load',CargaHtml,false);

// Carga Todos los Datos del Catalogo 
async function CargaHtml()
{   let wRta = await fetch("app.php?Acc=Leer");
    lData    = await wRta.json();

    document.getElementsByClassName("mOpcion")[1].onclick=function(){document.getElementById("vSolicitudes").style.display="none";document.getElementById("Contacto").style.display="none"; document.getElementById("cSolicitudes").style.display="inline";document.getElementById("bVer").style.visibility="hidden";document.getElementById("bCrear").style.visibility="visible";}
    document.getElementsByClassName("mOpcion")[0].onclick=function(){document.getElementById("vSolicitudes").style.display="inline"; document.getElementById("cSolicitudes").style.display="none"; document.getElementById("Contacto").style.display="none"; document.getElementById("bVer").style.visibility="visible";document.getElementById("bCrear").style.visibility="hidden";}
    document.getElementById("oMsg").onclick=function(){document.getElementById("vSolicitudes").style.display="none"; document.getElementById("cSolicitudes").style.display="none"; document.getElementById("Contacto").style.display="inline"; document.getElementsByClassName("mOpcion").style.display="none"; document.getElementById("Mail").style.display="inline"; document.getElementById("bMensaje").style.visibility="visible";document.getElementById("bHome").style.visibility="hidden"; }
    document.getElementById("oHome").onclick=function(){document.getElementById("vSolicitudes").style.display="inline"; document.getElementById("cSolicitudes").style.display="none"; document.getElementById("Contacto").style.display="none";document.getElementById("bMensaje").style.visibility="hidden";document.getElementById("bHome").style.visibility="visible"; }
    document.querySelector(".cSolicitudes button").onclick=function() { CrearSolicitud();}
    document.querySelector(".Contacto button").onclick=function() { EnviarCorreo();}
    VerSolicitud();
}

// Mostrar solicitudes
function VerSolicitud()
{   let xReporte = document.querySelector(".vSolicitudes");
    xReporte.innerHTML="";
    for(i=0; i<lData.length;i++)
    {   let xDiv = document.createElement("div");
        xDiv.className="Solicitud";
        xDiv.id=lData[i]['NumSol'];
       
            let xImg = document.createElement("img");
            xImg.id="sDelete";
            xImg.src="Delete.png";
            xImg.onclick= function(){ Eliminar(this);}
            xDiv.appendChild(xImg);

            xImg = document.createElement("img");
            xImg.id="sEdit";
            xImg.src="Lapiz.png";
            xImg.onclick= function(){ Editar(this);}
            xDiv.appendChild(xImg);

            let xSpn = document.createElement("span");
            xSpn.id="sNumero";
            xSpn.innerText="No. "+ lData[i]['NumSol'];
            xDiv.appendChild(xSpn);

            xSpn = document.createElement("span");
            xSpn.id="sDoc";
            xSpn.innerText = lData[i]['TipDoc']+ " " + lData[i]['Doc'];
            xDiv.appendChild(xSpn);

            xSpn = document.createElement("span");
            xSpn.id="sNombre";
            xSpn.innerText= lData[i]['Nombre'];
            xDiv.appendChild(xSpn);

            xSpn = document.createElement("span");
            xSpn.id="sFecha";
            xSpn.innerText=lData[i]['Fecha'];
            xDiv.appendChild(xSpn);
        xReporte.appendChild(xDiv);
    }       
}

//Crear una nueva Solicitud
async function CrearSolicitud()
{   let xFecha   = document.querySelector("#iFecha").value;
    let xiNo     = document.querySelector("#iNo").value;
    let xiDoc    = document.querySelector("#iDoc").value;
    let xinDoc   = document.querySelector("#inDoc").value;
    let xiNombre = document.querySelector("#iNombre").value;
    let xiDesc   = document.querySelector("#iDesc").value;

    let wJson=[];
    wJson.push(xFecha);
    wJson.push(xiNo);
    wJson.push(xiDoc);
    wJson.push(xinDoc);
    wJson.push(xiNombre);
    wJson.push(xiDesc);

    let wRta = await fetch ("app.php?Acc=Agregar",{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(wJson)});
    let xRta = await wRta.text();
    if(xRta!="") alert(xRta);
    else location.reload();

}

//Editar una solicitud
async function Editar(xDiv)
{   document.querySelectorAll(".mOpcion")[1].click();
    let xId = xDiv.parentNode.id;
    let wRta = await fetch("app.php?Acc=Editar&Solicitud="+xId);
    let xRta = await wRta.json();
    if(xRta.length==0){ alert("No se encontro la solicitud"); location.reload(); return;}
    document.querySelector("#iFecha").value  = xRta['Fecha'];
    document.querySelector("#iNo").value     = xRta['NumSol'];
    document.querySelector("#iDoc").value    = xRta['TipDoc'];
    document.querySelector("#inDoc").value   = xRta['Doc'];
    document.querySelector("#iNombre").value = xRta['Nombre'];
    document.querySelector("#iDesc").value   = xRta['DescSol'];
    document.querySelector("#iNo").readOnly=true;

    document.querySelector(".cSolicitudes button").onclick= function() {Modificar();}
}

//Modifica en BD
async function Modificar()
{   let xFecha   = document.querySelector("#iFecha").value;
    let xiNo     = document.querySelector("#iNo").value;
    let xiDoc    = document.querySelector("#iDoc").value;
    let xinDoc   = document.querySelector("#inDoc").value;
    let xiNombre = document.querySelector("#iNombre").value;
    let xiDesc   = document.querySelector("#iDesc").value;

    let wJson=[];
    wJson.push(xFecha);
    wJson.push(xiNo);
    wJson.push(xiDoc);
    wJson.push(xinDoc);
    wJson.push(xiNombre);
    wJson.push(xiDesc);

    let wRta = await fetch ("app.php?Acc=Modificar",{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(wJson)});
    let xRta = await wRta.text();
    if(xRta!="") alert(xRta);
    else location.reload();

}

//Eliminar una Solicitud
async function Eliminar(xDiv)
{  if(confirm("¿Esta seguro de borrar esta solicitud?"))
    {   let xId = xDiv.parentNode.id;  
        let wRta = await fetch("app.php?Acc=Eliminar&Solicitud="+xId);
        let xRta = await wRta.text();
        if(xRta!="") alert(xRta);
        else xDiv.parentNode.remove();
    } 
}

//Enviar Correo
async function EnviarCorreo()
{   let xCorreo   = document.querySelector("#mCorreo").value;
    let xAsunto   = document.querySelector("#mAsunto").value;
    let xMensaje  = document.querySelector("#mMensaje").value;

    let wJson=[];
    wJson.push(xCorreo);
    wJson.push(xAsunto);
    wJson.push(xMensaje);
    
    let wRta = await fetch ("app.php?Acc=EnvCorreo",{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(wJson)});
    let xRta = await wRta.text();
    if(xRta!="") alert(xRta);
    else location.reload();
}
