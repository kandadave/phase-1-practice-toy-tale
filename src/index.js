let addToy = false;



document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollectionDiv = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  }); 
  
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => renderToyCard(toy, toyCollectionDiv))
    })
    .catch(error => console.error("Error fetching toys:", error));
  

  //Add new toy
  addToyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;

    const newToyData = {
      name: toyName,
      image: toyImage,
      likes: 0
    };
  
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToyData)
    })
      .then(res => res.json())
      .then(newToy => {
        renderToyCard(newToy, toyCollectionDiv)
        addToyForm.reset();
        toyFormContainer.style.display = 'none';
        addToy = false;
      })
      .catch(error => console.error("Error adding new toy:", error))
  })

   toyCollectionDiv.addEventListener("click", (event) => {
       
    if (event.target.classList.contains("like-btn")) {
      const likeButton = event.target;
      const toyId = likeButton.id;
      // Get the current likes paragraph from the parent card
      const toyCard = likeButton.closest(".card");
      const likesParagraph = toyCard.querySelector("p");
      let currentLikes = parseInt(likesParagraph.textContent.split(" ")[0]);
      const newLikes = currentLikes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
      .then(response => response.json())
      .then(updatedToy => {
        // Update the likes in the DOM
        likesParagraph.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error updating likes:", error));
    }
  });

  return false;

});

function renderToyCard(toy, container){
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card")

  const h2 = document.createElement('h2');
  h2.textContent = toy.name;

  const img = document.createElement('img');
  img.src = toy.image;
  img.classList.add('toy-avatar');

  const p = document.createElement('p')
  p.textContent = `${toy.likes} Likes`;

  const button = document.createElement("button");
  button.classList.add("like-btn")
  button.id = toy.id
  button.textContent = 'Like ❤️'
  button.type = 'button'

   cardDiv.append(h2, img, p, button); // Append all elements to the card
  container.append(cardDiv);
};
