//Set Graph Height relative to width
const AvailableGraphs = document.getElementsByClassName("BarGraphContainer")

for (var i = 0; i < AvailableGraphs.length; i++) {
    console.log(AvailableGraphs[i].offsetWidth)
    AvailableGraphs[i].style.height = parseInt(AvailableGraphs[i].offsetWidth, 10) + "px";
}

window.addEventListener("resize", function(event) {
    for (var i = 0; i < AvailableGraphs.length; i++) {
        console.log(AvailableGraphs[i].offsetWidth)
        AvailableGraphs[i].style.height = parseInt(AvailableGraphs[i].offsetWidth, 10) + "px";
    }
})

async function CreateGraph() {  
        try {     
            const response = await fetch('/getData', {
                method: 'get',
            });
        
        
            response.json()
            .then(data => {
                let Places = {};

                let maxTally = 0;

                for (var q = 0; q < data.holdata.length; ++q) {
                    if (Places[data.holdata[q].place] == undefined) {
                        Places[data.holdata[q].place] = 1
                    } else {
                        Places[data.holdata[q].place] = Places[data.holdata[q].place] + 1;
                    }

                    if ( Places[data.holdata[q].place] > maxTally) {
                        maxTally = Places[data.holdata[q].place]
                    }
                }

                console.log(maxTally)

                for (var g = 0; g < Object.keys(Places).length; ++g) {
                    let Tally = 0;
                    for (var n = 0; n < data.holdata.length; ++n) {
                        if (data.holdata[n].place == Object.keys(Places)[g]) {
                            ++Tally;
                        }
                    }

                    console.log(Tally)

                    let newBar = document.createElement('div');
                    newBar.classList.add("Bar")
                    newBar.style.marginRight = (50 / Object.keys(Places).length) + "%"
                    newBar.style.width = (50 / Object.keys(Places).length) + "%"
                    newBar.style.height = ((Tally/maxTally) * parseInt(AvailableGraphs[0].style.height)) + "px"

                    let BarLabel = document.createElement('div');
                    BarLabel.classList.add("BarLabel")
                    BarLabel.innerHTML = "<b>" + Object.keys(Places)[g] + "</b>"

                    document.getElementById("firstpoint").innerHTML = "<b>" + "0"  + " -" + "</b>"
                    document.getElementById("midpoint").innerHTML = "<b>" + (maxTally / 2).toString()  + " -" + "</b>"
                    document.getElementById("finalpoint").innerHTML = "<b>" + maxTally.toString() + " -" + "</b>"


                    window.addEventListener("resize", function(event) {
                        newBar.style.height = ((Tally/maxTally) * parseInt(AvailableGraphs[0].style.height)) + "px"
                    })

                    document.getElementById("BarGraph1").append(newBar);
                    newBar.append(BarLabel);


                }


                
            })
            
            console.log('Completed!', response);
        } catch(err) {
            console.error(`Error: ${err}`);
        }

}

CreateGraph();
