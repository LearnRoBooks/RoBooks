document.getElementById("DropDownIcon").addEventListener("click", async => {
    let Element = document.getElementById("DropDown")
  
    console.log(Element.style.display)
  
    if (Element.style.display == "block") {
      Element.style.display = "none"
    } else {
      Element.style.display = "block"
    }
  })

//SEND GET REQUEST TO RECEIEVE GOOGLE DATA, SUCH AS ICON
async function GetOAuthData() {
    const response = await fetch('/oauth', {
            method: 'get',
    });

    response.json()
    .then( data => {
        document.getElementById("UserIconImage").src = data.picture;
    })
}
 
GetOAuthData()