document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let filterOn = false;
    let data;
  
    // Fetch the pup data from the server
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(pupsData => {
        data = pupsData;
        // Render the dog bar initially
        renderDogBar(data);
      })
      .catch(error => {
        console.error('Error fetching pup data:', error);
      });
  
    // Function to render the dog bar based on filter state
    function renderDogBar(pups) {
      dogBar.innerHTML = '';
      const filteredPups = filterOn ? pups.filter(pup => pup.isGoodDog) : pups;
      filteredPups.forEach(pup => {
        const pupSpan = document.createElement('span');
        pupSpan.textContent = pup.name;
        pupSpan.addEventListener('click', () => {
          displayPupInfo(pup);
        });
        dogBar.appendChild(pupSpan);
      });
    }
  
    // Event listener for the filter button
    filterButton.addEventListener('click', () => {
      filterOn = !filterOn;
      filterButton.textContent = filterOn ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
      renderDogBar(data);
    });
  
    // Function to display pup information
    function displayPupInfo(pup) {

      dogInfo.innerHTML = `
        <img src="${pup.image}">
        <h2>${pup.name}</h2>
        <button class="toggle-good-dog">${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
      `;
    }
  
    // Event delegation for toggle button
    dogInfo.addEventListener('click', event => {
      if (event.target.classList.contains('toggle-good-dog')) {
        const button = event.target;
        const pupName = button.previousElementSibling.textContent;
  
        const pup = data.find(pup => pup.name === pupName);
        if (pup) {
          button.textContent = pup.isGoodDog ? 'Bad Dog!' : 'Good Dog!';
          const updatedIsGoodDog = !pup.isGoodDog;
          updatePupIsGoodDog(pup.id, updatedIsGoodDog)
            .then(() => {
              pup.isGoodDog = updatedIsGoodDog;
              if (filterOn) {
                renderDogBar(data); // Re-render the dog bar to apply filter
              }
            })
            .catch(error => {
              console.error('Error updating pup isGoodDog status:', error);
              button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
            });
        }
      }
    });
  
    // Function to update pup's isGoodDog status in the database
    function updatePupIsGoodDog(pupId, isGoodDog) {
      return fetch(`http://localhost:3000/pups/${pupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isGoodDog: isGoodDog
        })
      });
    }
  });
  