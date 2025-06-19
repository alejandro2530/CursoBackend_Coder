let listaPacientes = []
let isActive = true

function CrearNuevoPaciente(datoNombre,datoApellido,datoEdad,datoDiagnostico,datoSegmentoDelCuerpoRehabilitar,datoTerapias) 
{
  const paciente = {
    nombre: datoNombre,
    apellido: datoApellido,
    edad: datoEdad,
    diagnostico: datoDiagnostico,
    segmentoDelCuerpoRehabilitar: datoSegmentoDelCuerpoRehabilitar,
    terapias: datoTerapias,
  };

  listaPacientes.push(paciente);
}
function VerListaPacientes() {
  if (listaPacientes.length == 0) {
    alert("No hay pacientes cargados en el sistema")
    return
  }
  let listaPacientesString = "";
  for (let i = 0; i < listaPacientes.length; i++) {
    listaPacientesString += `${i + 1} - ${listaPacientes[i].nombre} ${listaPacientes[i].apellido}\n`
  }
  alert(listaPacientesString);
}
function AltaPaciente(nombreAltaPaciente) {
  const nombreBuscado = nombreAltaPaciente;

  const nombresPacientes = listaPacientes.map(p => p.nombre);
  const apellidosPacientes = listaPacientes.map(p => p.apellido);

  let index = nombresPacientes.indexOf(nombreBuscado);

  if (index === -1) {
    index = apellidosPacientes.indexOf(nombreBuscado);
  }

  if (index === -1) {
    alert(`No se encontró ningún paciente con el nombre o apellido "${nombreAltaPaciente}"`);
  } else {
    listaPacientes.splice(index, 1);
    alert(`El paciente ${nombreAltaPaciente} fue dado de alta EXITOSAMENTE`);
  }
}
let actividadesExtremidadesSuperiores = ["Actividades de la vida diaria\n","Actividades de alcance por arriba de hombro\n","Actividades de alcance por debajo de hombro\n"];
let actividadesExtremidadesInferiores = ["Actividades de equilibrio monopodal\n","Actividades de coordinación cadera-rodilla\n","Actividades para aumentar el rango articular en cadera-rodilla-tobillo\n"];

function AsignActividad(sermentoArehabilitar) {
  // se asigna la actividad segun el segmento corporal que se quiera rehabilitar
  switch (sermentoArehabilitar) {
    case 1: //extremidades superiores
      return actividadesExtremidadesSuperiores;
      break;
    case 2: //extremidades inferiores
      return actividadesExtremidadesInferiores;
      break;
    default:
      break;
  }
}

function VerTerapiasPorPacientes() 
{
  terapiasPAcientesString = ""
  for (let i = 0; i < listaPacientes.length; i++) {
    let auxNombre = listaPacientes[i].nombre
    let auxActividades = listaPacientes[i].terapias
    
    terapiasPAcientesString += `${auxNombre}:\n ${auxActividades}\n`
  }
  alert(terapiasPAcientesString)
}

const menu =
  "Asignación automática de terapias para el paciente segun el segmento corporal a rehabilitar\n 1 - Cargar nuevo paciente\n 2 - Ver lista de pacientes\n 3 - Ver Actividades de los pacientes\n 4 - Dar el alta a un paciente\n 5 - Salir\n";

while (isActive) {
  let opcion = Number(prompt(menu));

  switch (opcion) {
    case 1:
      const nombreAux = prompt("Nombre")
      const apellidoAux = prompt("Apellido")
      const edadAux = prompt("Edad")
      const diagnosticoAux = prompt("Diagnóstico")
      const segmentoRehabilitar = Number(prompt("Segmento corporal a rehabilitar\n    1-Extremidades superiores\n    2-Extremidades inferiores\n"))
      CrearNuevoPaciente(nombreAux, apellidoAux, edadAux, diagnosticoAux,segmentoRehabilitar, AsignActividad(segmentoRehabilitar));
      break;
    case 2:
      VerListaPacientes()
      break;
    case 3:
      VerTerapiasPorPacientes()
      break;
    case 4:
      const nombreAltaPaciente = prompt("Ingrese el nombre o el apellido del paciente para generar el alta")
      AltaPaciente(nombreAltaPaciente)
      break;
    case 5:
      isActive = false;
      break;
    default:
      break;
  }
}    
    