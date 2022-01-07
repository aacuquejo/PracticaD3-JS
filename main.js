const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

// ----------------------------------------------------------
// Autora: Andrea Araujo Cuquejo

var colorChicas = new Map()

const alto = 600
const ancho = 800

const margen = {
    izquierdo: 40,
    derecho: 10,
    superior: 10,
    inferior: 40
}


const svg  = d3.select("#chart").append("svg").attr("id", "svg").attr("width", ancho).attr("height", alto)

const grupoElementos = svg.append("g").attr("id", "grupoElementos").attr("transform", `translate(${margen.izquierdo}, ${margen.superior})`)
var x = d3.scaleBand().range([0, ancho - margen.izquierdo - margen.derecho]).padding(0.1)
var y = d3.scaleLinear().range([alto - margen.superior - margen.inferior, 0])


const grupoEjes = svg.append("g").attr("id", "grupoEjes")

const grupoX = grupoEjes.append("g").attr("id","grupoX")
.attr("transform", `translate(${margen.izquierdo}, ${alto - margen.inferior})`)
const grupoY = grupoEjes.append("g").attr("id","grupoY")
.attr("transform", `translate(${margen.izquierdo}, ${margen.superior})`)

const ejeX = d3.axisBottom().scale(x)
const ejeY = d3.axisLeft().scale(y)
const formateDate = d3.timeParse("%Y")



d3.csv("data.csv").then(misDatos =>{

    misDatos.map(d=>{
      
        d.age = +d.age
        d.year = d.year

        var color = '#' + (Math.random().toString(16) + '0000000').slice(2, 8)
        if (!colorChicas.has(d.name)){
         

          var valores = Object.values(colorChicas)

          while (valores.includes(color)){ //evitar colores repetidos
  
            color = '#' + (Math.random().toString(16) + '0000000').slice(2, 8)
            
          }
          colorChicas.set(d.name,color)
        }
        
    })
    
    x.domain(misDatos.map(d=>d.year))
    y.domain([0,ageToday])
   

    
      grupoX.call(ejeX)
      grupoY.call(ejeY)
  
     
    
    var elementos = grupoElementos.selectAll("rect").data(misDatos)
    elementos.enter().append("rect")
        .attr('fill',(d,i,datos)=>{
          return colorChicas.get(d.name)
        }) 
        .attr("height", d=> alto - margen.inferior - margen.superior- y(d.age))
        .attr("y",d => y(d.age))
        .attr("x",d=> x(d.year))
        .attr("width",x.bandwidth())
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)
    

        
        var elementos = grupoElementos.datum(misDatos).append('path')
        .attr("id","linea")
        .attr("d",d3.line()
            .x(d=>x(d.year) + x.bandwidth()/2)
            .y(d=>y(d.year -diCaprioBirthYear))
        )

        grupoElementos.selectAll("circle")
        .data(misDatos) 
        .enter()
        .append("circle")
        .attr("cx", d=>x(d.year) + x.bandwidth()/2)
        .attr("cy",d=>y(d.year -diCaprioBirthYear))
        .attr("r", "2"). attr ("fill", "black") 
        .on("mouseover", onMouseOverCircle)
        .on("mouseout", onMouseOutCircle)


})



function onMouseOver(d, i) {
 
  var xPos = parseFloat(d3.select(this).attr('x')) + x.bandwidth() / 2;
  var yPos = parseFloat(d3.select(this).attr('y')) / 2 + alto / 2

  d3.select('#tooltip')
    .style('left', xPos + 'px')
    .style('top', yPos + 'px')
    .select('#nombre').text(function() { 
      return d.name})

  d3.select('#tooltip')
    .select('#edad').text(function() { 
      return"Edad:" + d.age  + " años"})

  d3.select('#tooltip')
    .select('#difEdad').text(function() { 
      return "Dif. edad:" + (edadDiCaprio(d.year) - d.age) + " años"})
      
  d3.select('#tooltip').classed('hidden', false);

}


function onMouseOut(d, i){
  d3.select('#tooltip').classed('hidden', true);
}




//Eventos circulos
function onMouseOverCircle(d, i) {
 
  var xPos = parseFloat(d3.select(this).attr('x')) + x.bandwidth() / 2;
  var yPos = parseFloat(d3.select(this).attr('y')) / 2 + alto / 2

  d3.select('#tooltipCircle')
    .style('left', xPos + 'px')
    .style('top', yPos + 'px')
    .select('#edadDiCaprio').text(function() { 
      return " " + edadDiCaprio(d.year)  + " años"})
      
  d3.select('#tooltipCircle').classed('hidden', false);

}


function onMouseOutCircle(d, i){
  d3.select('#tooltipCircle').classed('hidden', true);
}



  function edadDiCaprio(year){
    var edad =  year - diCaprioBirthYear
    return  edad
    }
