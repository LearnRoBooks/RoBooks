
//INITIALIZE BUTTON EVENTS
document.getElementById("AddReceipt").addEventListener("click", async => {
    let Element = document.getElementById("AddReceiptMenu")

    Element.style.display = "block";
})

document.getElementById("CloseReceiptAdd").addEventListener("click", async => {
    let Element = document.getElementById("AddReceiptMenu")

    Element.style.display = "none";
})

document.getElementById("SortBy").addEventListener("click", async => {
    let Element = document.getElementById("SortMenu")

    Element.style.display = "block";
})

document.getElementById("CloseSortMenu").addEventListener("click", async => {
    let Element = document.getElementById("SortMenu")

    Element.style.display = "none";
})

//ADD SORT BUTTON EVENT LISTENER THAT SORTS WITH GIVEN CRITERIA, SORTINGTYPE & INCREASING/DECREASING
document.getElementById("SortingButton").addEventListener("click", async => {
  if (document.getElementById("SortingType").value == "Increasing") {
    SortBy(true, document.getElementById("SortByTypes").value)
  } else {
    SortBy(false, document.getElementById("SortByTypes").value)
  }

  document.getElementById("SortMenu").style.display = "none"
})

//ADD NEW RECEIPT TO DB AND REFRESH RECEIPTS
document.getElementById("DoneReceipt").addEventListener("click", async => {
  AddReceiptToDB()
})



async function AddReceiptToDB() {
  const response = await fetch('/getData', {
      method: 'get',
  });

  var ToIndex = 0;

  response.json()
  .then(newdata => {
    console.log(newdata.holdata.length, "LENGTH HERE")
    ToIndex = newdata.holdata.length + 1;

    let data = {
    date: document.getElementById("dateData").value,
    place: document.getElementById("placeData").value,
    amount: document.getElementById("amountData").value,
    payment: document.getElementById("paymentData").value,
    index: ToIndex
  }

  try {     
    document.getElementById("AddReceiptMenu").style.display = "none";
    const response = fetch('/myreceipts', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    SortBy(false, "Date")
    console.log('Completed!', response);
  } catch(err) {
    console.error(`Error: ${err}`);
  }
  })


}


//CONVERTS DATA DATE TO WRITTEN DATE
function DateToString(date) {
  let year = 0;

  let f_index = 0

  while (date[f_index] != '-') {
    ++f_index;
  }

  year = date.substring(0,f_index)

  let month = date.substring(f_index + 1, f_index + 3)

  let day = date.substring(f_index + 4, f_index + 6)


  return month + '/' + day + '/' + year;
}

//FIND FUNCTION FOR ARRAYS
function arrayfind(array, toFind) {
  console.log(array,toFind);

  for (let q = 0; q < array.length; q++) {
    if (array[q] == toFind) {
      return true
    }
  }

  return false;
}

//CONVERTS DATE TYPE TO NUMBER FOR COMPARISON
function dateToNum(date) {
  let year = 0;

  let f_index = 0

  while (date[f_index] != '-') {
    ++f_index;
  }

  year = Number(date.substring(0,f_index))

  let month = Number(date.substring(f_index + 1, f_index + 3))
  month = month*40

  let day = Number(date.substring(f_index + 4, f_index + 6))


  return day + month + year;
}

//SORTS ALL DATA BY GIVEN CRITERIA, INCREASING/DECREASING & SORTINGTYPE
async function SortBy(increasing, SortingType) {
  try {     
      const response = await fetch('/getData', {
        method: 'get',
      });


      response.json()
      .then(data => {
        console.log("NEWDATA", data)
        let oldReceiptElements = document.getElementsByClassName("ReceiptItem")


        while (oldReceiptElements[0]) {
          console.log('Removing')
          oldReceiptElements[0].remove()
        }

        document.getElementById('ReceiptsHolder').style.height = (10.5*data.holdata.length) + "vh"





        let SmallestTab = []
        
        for (let i = 0; i < data.holdata.length; ++i) {
          let smallest = 999999

          if (increasing == false) {
            smallest = 0
          }
         
          let smallestIndex = 0

          for (let g = 0; g < data.holdata.length; ++g) {    
            if (SortingType == "Date") {
              if (arrayfind(SmallestTab, g) == true) {
                console.log('Found Similiar')
              } else if (increasing == true && dateToNum(data.holdata[g].date) < smallest) {
                smallest = dateToNum(data.holdata[g].date)
                smallestIndex = g
              } else if (increasing == false && dateToNum(data.holdata[g].date) > smallest) {
                smallest = dateToNum(data.holdata[g].date)
                smallestIndex = g
              }
            } else {
              if (arrayfind(SmallestTab, g) == true) {
                console.log('Found Similiar')
              } else if (increasing == true && Number(data.holdata[g].amount) < smallest) {
                smallest = Number(data.holdata[g].amount)
                smallestIndex = g
              } else if (increasing == false && Number(data.holdata[g].amount) > smallest) {
                smallest = Number(data.holdata[g].amount)
                smallestIndex = g
              }
            }
          }

          const StoredSmallest = smallestIndex

          console.log(smallestIndex, "SMALLESTINDEX") 

          SmallestTab.push(smallestIndex)

          let newItem = document.createElement("div")
          newItem.classList.add("ReceiptItem")

          document.getElementById('ReceiptsHolder').append(newItem)

          let dateItem = document.createElement("div")
          dateItem.classList.add("ReceiptChildItem")
          dateItem.innerHTML = "<b>" + DateToString(data.holdata[smallestIndex].date) + "</b>"
          newItem.append(dateItem)

          let placeItem = document.createElement("div")
          placeItem.classList.add("ReceiptChildItem")
          placeItem.innerHTML = "<b>" + data.holdata[smallestIndex].place + "</b>"
          newItem.append(placeItem)
          console.log(data.holdata[smallestIndex].place)

          let amountItem = document.createElement("div")
          amountItem.classList.add("ReceiptChildItem")
          amountItem.innerHTML = "<b>" + "$" + data.holdata[smallestIndex].amount + "</b>"
          newItem.append(amountItem)

          let paymentItem = document.createElement("div")
          paymentItem.classList.add("ReceiptChildItem")
          paymentItem.innerHTML = "<b>" + data.holdata[smallestIndex].payment + "</b>"
          newItem.append(paymentItem)

          let ReceiptHover = document.createElement("div")
          ReceiptHover.classList.add("ReceiptHover")
          newItem.append(ReceiptHover)

          let DeleteReceipt = document.createElement("img")
          DeleteReceipt.classList.add("DeleteReceipt")
          DeleteReceipt.src = "Garbage.png"
          newItem.append(DeleteReceipt)

          DeleteReceipt.addEventListener("click", async => {
            newItem.remove()
            try {
              const response = fetch('/remove', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data.holdata[smallestIndex])
              });
            } catch (err) {
              console.log(err);
            }
          })

          

    
        }

      })

    
    
    } catch(err) {
      console.error(`Error: ${err}`);

    }
}


//INITIALLY GET ALL DATES AND GOOGLE DATA

SortBy(false, "Date")
