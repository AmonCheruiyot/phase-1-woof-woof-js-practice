document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');

    let showGoodDogsOnly = false;
    let allPups = [];

    // Step 1: Fetch Pup Data
    function fetchPups() {
        fetch('http://localhost:3000/pups')
            .then(response => response.json())
            .then(pups => {
                allPups = pups;
                // Step 2: Display Pups in Dog Bar
                displayPups();
            });
    }

    // Step 2: Display Pups in Dog Bar
    function displayPups() {
        dogBar.innerHTML = '';
        const pupsToDisplay = showGoodDogsOnly ? allPups.filter(pup => pup.isGoodDog) : allPups;
        pupsToDisplay.forEach(pup => {
            const pupSpan = document.createElement('span');
            pupSpan.textContent = pup.name;
            pupSpan.addEventListener('click', () => displayPupInfo(pup));
            dogBar.appendChild(pupSpan);
        });
    }

    // Step 3: Show More Info About Each Pup
    function displayPupInfo(pup) {
        dogInfo.innerHTML = `
            <img src="${pup.image}" alt="${pup.name}">
            <h2>${pup.name}</h2>
            <button id="toggle-good-dog">${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
        `;

        const toggleButton = document.getElementById('toggle-good-dog');
        toggleButton.addEventListener('click', () => toggleGoodDogStatus(pup.id));
    }

    // Step 4: Toggle Good Dog Status
    function toggleGoodDogStatus(pupId) {
        const pup = allPups.find(pup => pup.id === pupId);
        pup.isGoodDog = !pup.isGoodDog;

        fetch(`http://localhost:3000/pups/${pupId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ isGoodDog: pup.isGoodDog })
        })
        .then(response => response.json())
        .then(updatedPup => {
            const index = allPups.findIndex(pup => pup.id === pupId);
            allPups[index] = updatedPup;
            displayPups(); // Refresh the dog bar
        });
    }

    // Step 5: Filter Good Dogs
    filterButton.addEventListener('click', () => {
        showGoodDogsOnly = !showGoodDogsOnly;
        filterButton.textContent = showGoodDogsOnly ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
        displayPups(); // Refresh the dog bar
    });

    // Initial fetch to load all pups
    fetchPups();
});
