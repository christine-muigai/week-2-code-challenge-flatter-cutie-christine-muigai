document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const nameDisplay = document.getElementById("character-name"); // Fixed here
    const imageDisplay = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const votesInput = document.getElementById("votes");
    const resetButton = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");

    let currentCharacter = null;

    function fetchCharacters() {
        fetch(baseUrl)
            .then(res => res.json())
            .then(data => {
                data.forEach(character => {
                    addCharacterToBar(character);
                });
            });
    }

    function addCharacterToBar(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacter(character));
        characterBar.appendChild(span);
    }

    function displayCharacter(character) {
        currentCharacter = character;
        nameDisplay.textContent = character.name;
        imageDisplay.src = character.image;
        imageDisplay.alt = character.name;
        voteCount.textContent = character.votes;
    }

    votesForm.addEventListener("submit", event => {
        event.preventDefault();
        if (currentCharacter) {
            let newVotes = parseInt(votesInput.value) || 0;
            currentCharacter.votes += newVotes;
            voteCount.textContent = currentCharacter.votes;
            updateVotesOnServer(currentCharacter.id, currentCharacter.votes);
        }
        votesInput.value = "";
    });

    resetButton.addEventListener("click", () => {
        if (currentCharacter) {
            currentCharacter.votes = 0;
            voteCount.textContent = 0;
            updateVotesOnServer(currentCharacter.id, 0);
        }
    });

    characterForm.addEventListener("submit", event => {
        event.preventDefault();
        const newCharacter = {
            name: document.getElementById("new-name").value,
            image: document.getElementById("image-url").value,
            votes: 0
        };
        createNewCharacter(newCharacter);
        event.target.reset();
    });

    function createNewCharacter(character) {
        fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(character)
        })
        .then(res => res.json())
        .then(newChar => {
            addCharacterToBar(newChar);
            displayCharacter(newChar);
        });
    }

    function updateVotesOnServer(id, votes) {
        fetch(`${baseUrl}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ votes })
        });
    }

    fetchCharacters();
});

fetch(baseUrl)
  .then(res => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  })
  .then(data => {
    // handle data
  })
  .catch(error => {
    console.error("Error fetching characters:", error);
  });