addEventListener("click", function (e) {
  // Delete feature
  if (e.target.classList.contains("delete-me")) { 
    if(confirm("Do you want to permanently delete this item?")) {
      axios
      .post("/delete-item", {
        id: e.target.getAttribute("data-id")
      })
      .then(function () {
        e.target.parentElement.parentElement.remove()
      })
      .catch(function () {
        console.log("Pls try again later.")
      })
    }
    
  }


  // Update feature
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt(
      "enter your new text",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    )
    if (userInput) {
      // this axios.post() method is going to return a PROMISE
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id")
        })
        .then(function () {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput
        })
        .catch(function () {
          console.log("Pls try again later.")
        })
    }
  }
})
