const button = document.querySelector(".menu-button");
const noteMenu = document.querySelector(".note-menu");
const content = document.querySelector(".content");

// Create a circle indicator element
const circleIndicator = document.createElement("div");
circleIndicator.classList.add("circle-indicator");
content.appendChild(circleIndicator); // Append it to the content div

// Function to set up event listeners for delete buttons
function setupDeleteButtons() {
  document.querySelectorAll(".delete-note").forEach(function (deleteLink) {
    deleteLink.addEventListener("click", function (event) {
      event.preventDefault();

      // Find the closest .header element and remove it
      const noteHeader = this.closest(".header");
      if (noteHeader) {
        noteHeader.remove();
      }
    });
  });
}

// Function to adjust textarea size dynamically
function adjustTextareaSize(textarea) {
  textarea.style.height = "auto"; // Reset height
  textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
}

// Function to add a new note
function addNewNote() {
  // Create the new header div
  const newHeader = document.createElement("div");
  newHeader.classList.add("header");

  // Add the HTML content for the new header
  newHeader.innerHTML = `
    <nav class="note-bar">
      <a href="#" class="note-branding">Notes ${
        document.querySelectorAll(".header").length + 1
      }</a>
      <button class="menu-button">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </button>
    </nav>
  
    <ul class="note-menu">
      <li class="note-item">
        <a href="#" class="note-link">Add to Favorites</a>
      </li>
      <li class="note-item">
        <a href="#" class="note-link">Remove from Favorites</a>
      </li>
      <li class="note-item">
        <a href="#" class="note-link delete-note">Delete Note</a>
      </li>
    </ul>
  
    <div class="content">
      <textarea class="note-textarea" placeholder="Write your note here..."></textarea>
    </div>
  `;

  // Insert the new header at the beginning of the body
  const body = document.querySelector(".body");
  body.insertBefore(newHeader, body.firstChild);

  // Adjust textarea size when a new note is created
  const newTextarea = newHeader.querySelector(".note-textarea");
  newTextarea.addEventListener("input", function () {
    adjustTextareaSize(newTextarea);
  });

  // Adjust initial size of textarea
  adjustTextareaSize(newTextarea);

  // Add event listeners for the new menu button and note links
  const newMenuButton = newHeader.querySelector(".menu-button");
  const newNoteMenu = newHeader.querySelector(".note-menu");
  const newNoteLinks = newHeader.querySelectorAll(".note-link");

  newMenuButton.addEventListener("click", () => {
    newMenuButton.classList.toggle("active");
    newNoteMenu.classList.toggle("active");
  });

  newNoteLinks.forEach((n) => {
    n.addEventListener("click", (e) => {
      const linkText = e.target.textContent;
      newMenuButton.classList.remove("active");
      newNoteMenu.classList.remove("active");

      if (linkText === "Add to Favorites") {
        // Create or show the circle indicator
        let circleIndicator = newHeader.querySelector(".circle-indicator");
        if (!circleIndicator) {
          circleIndicator = document.createElement("div");
          circleIndicator.classList.add("circle-indicator");
          newHeader.querySelector(".content").appendChild(circleIndicator);
        }
        circleIndicator.style.display = "block"; // Show the orange circle
      } else if (linkText === "Remove from Favorites") {
        // Hide the circle indicator if present
        const circleIndicator = newHeader.querySelector(".circle-indicator");
        if (circleIndicator) {
          circleIndicator.style.display = "none"; // Hide the orange circle
        }
      }
    });
  });

  // Add the editable functionality to new note branding
  const newNoteBranding = newHeader.querySelector(".note-branding");
  newNoteBranding.addEventListener("dblclick", function () {
    const currentText = this.textContent;

    // Create a new input element
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.classList.add("editable-input");

    // Replace the existing text with the input element
    this.innerHTML = "";
    this.appendChild(input);

    // Focus and select the input text
    input.focus();
    input.select();

    // Handle blur event to save the changes
    input.addEventListener("blur", function () {
      const newText = this.value;

      // Replace the input with the new text
      this.parentElement.textContent = newText;
    });

    // Handle enter key to save changes
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        this.blur();
      }
    });
  });

  // Set up delete buttons for the new notes
  setupDeleteButtons();
}

// Attach event listener to plus-button to add new note
document.querySelector(".plus-button").addEventListener("click", addNewNote);

// Initial setup for existing delete buttons
setupDeleteButtons();

button.addEventListener("click", () => {
  button.classList.toggle("active");
  noteMenu.classList.toggle("active");
});

document.querySelectorAll(".note-link").forEach((n) => {
  n.addEventListener("click", (e) => {
    const linkText = e.target.textContent;
    button.classList.remove("active");
    noteMenu.classList.remove("active");

    if (linkText === "Add to Favorites") {
      circleIndicator.style.display = "block"; // Show the orange circle
    } else if (linkText === "Remove from Favorites") {
      circleIndicator.style.display = "none"; // Hide the orange circle
    }
  });
});

// Adjust content size
function adjustContentSize() {
  const content = document.querySelector(".content");
  const borderWidth = parseInt(window.getComputedStyle(content).borderWidth);
  content.style.width = `calc(100% - ${borderWidth * 2}px)`;
  content.style.height = `calc(100% - ${borderWidth * 2}px)`;
}

// Adjust size on initial load and if necessary, on window resize
window.addEventListener("load", adjustContentSize);
window.addEventListener("resize", adjustContentSize);

// Initial adjustment for all textareas
document.querySelectorAll(".note-textarea").forEach((textarea) => {
  adjustTextareaSize(textarea);
  textarea.addEventListener("input", function () {
    adjustTextareaSize(textarea);
  });
});

const searchInput = document.querySelector("#note-search");

// Function to filter notes based on search query
function filterNotes() {
  const query = searchInput.value.toLowerCase();
  const notes = document.querySelectorAll(".header");

  notes.forEach((note) => {
    const noteTitle = note
      .querySelector(".note-branding")
      .textContent.toLowerCase();
    if (noteTitle.includes(query)) {
      note.classList.add("expanded"); // Add class to expand width
      note.style.display = "flex"; // Show matching note
    } else {
      note.classList.remove("expanded"); // Remove class to revert width
      note.style.display = "none"; // Hide non-matching note
    }
  });
}

// Attach event listener for "Enter" key on search input
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    filterNotes();
  }
});

function addNewNote() {
  // Create the new header div
  const newHeader = document.createElement("div");
  newHeader.classList.add("header");

  // Get today's date with the desired format
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const now = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Add the HTML content for the new header
  newHeader.innerHTML = `
    <nav class="note-bar">
      <a href="#" class="note-branding">Notes ${
        document.querySelectorAll(".header").length + 1
      }</a>
      <button class="menu-button">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </button>
    </nav>
  
    <ul class="note-menu">
      <li class="note-item">
        <a href="#" class="note-link">Add to Favorites</a>
      </li>
      <li class="note-item">
        <a href="#" class="note-link">Remove from Favorites</a>
      </li>
      <li class="note-item">
        <a href="#" class="note-link delete-note">Delete Note</a>
      </li>
    </ul>
  
    <div class="content">
      <textarea class="note-textarea" placeholder="Write your note here..."></textarea>
      <div class="circle-indicator"></div>
      <div class="date-label">${today}</div>
      <div class="time-label">${now}</div>
    </div>
  `;

  // Insert the new header at the beginning of the body
  const body = document.querySelector(".body");
  body.insertBefore(newHeader, body.firstChild);

  // Adjust textarea size when a new note is created
  const newTextarea = newHeader.querySelector(".note-textarea");
  newTextarea.addEventListener("input", function () {
    adjustTextareaSize(newTextarea);
  });

  // Adjust initial size of textarea
  adjustTextareaSize(newTextarea);

  // Add event listeners for the new menu button and note links
  const newMenuButton = newHeader.querySelector(".menu-button");
  const newNoteMenu = newHeader.querySelector(".note-menu");
  const newNoteLinks = newHeader.querySelectorAll(".note-link");

  newMenuButton.addEventListener("click", () => {
    newMenuButton.classList.toggle("active");
    newNoteMenu.classList.toggle("active");
  });

  newNoteLinks.forEach((n) => {
    n.addEventListener("click", (e) => {
      const linkText = e.target.textContent;
      newMenuButton.classList.remove("active");
      newNoteMenu.classList.remove("active");

      if (linkText === "Add to Favorites") {
        // Create or show the circle indicator
        let circleIndicator = newHeader.querySelector(".circle-indicator");
        if (!circleIndicator) {
          circleIndicator = document.createElement("div");
          circleIndicator.classList.add("circle-indicator");
          newHeader.querySelector(".content").appendChild(circleIndicator);
        }
        circleIndicator.style.display = "block"; // Show the orange circle
      } else if (linkText === "Remove from Favorites") {
        // Hide the circle indicator if present
        const circleIndicator = newHeader.querySelector(".circle-indicator");
        if (circleIndicator) {
          circleIndicator.style.display = "none"; // Hide the orange circle
        }
      }
    });
  });

  // Add the editable functionality to new note branding
  const newNoteBranding = newHeader.querySelector(".note-branding");
  newNoteBranding.addEventListener("dblclick", function () {
    const currentText = this.textContent;

    // Create a new input element
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.classList.add("editable-input");

    // Replace the existing text with the input element
    this.innerHTML = "";
    this.appendChild(input);

    // Focus and select the input text
    input.focus();
    input.select();

    // Handle blur event to save the changes
    input.addEventListener("blur", function () {
      const newText = this.value;

      // Replace the input with the new text
      this.parentElement.textContent = newText;
    });

    // Handle enter key to save changes
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        this.blur();
      }
    });
  });

  // Set up delete buttons for the new notes
  setupDeleteButtons();
}

document.addEventListener("DOMContentLoaded", () => {
  // Function to handle adding the note to favorites
  function addToFavorites() {
    const bodyContent = document.querySelector(".body").innerHTML;
    // Store the body content in local storage
    localStorage.setItem("favoriteNote", bodyContent);
    alert("Note added to favorites!");
  }

  // Add event listener for "Add to Favorites" link
  document.querySelectorAll(".note-link").forEach((link) => {
    if (link.textContent === "Add to Favorites") {
      link.addEventListener("click", addToFavorites);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Function to handle removing the note from favorites
  function removeFromFavorites() {
    const bodyContent = document.querySelector(".body");
    if (bodyContent) {
      bodyContent.remove();
      // Clear the favorite note from local storage
      localStorage.removeItem("favoriteNote");
      alert("Note removed from favorites!");
    }
  }

  // Add event listener for "Remove from Favorites" link
  document.querySelectorAll(".note-link").forEach((link) => {
    if (link.textContent === "Remove from Favorites") {
      link.addEventListener("click", removeFromFavorites);
    }
  });

  // Function to load the favorite note from local storage
  function loadFavoriteNote() {
    const storedNote = localStorage.getItem("favoriteNote");
    if (storedNote) {
      document.querySelector(".body").innerHTML = storedNote;
    }
  }

  // Load the favorite note when the page is loaded
  loadFavoriteNote();
});

function validateForm() {
  // Check if the form is valid
  const form = document.querySelector(".hm");
  if (form.checkValidity()) {
    window.location.href = "signin.html";
    return true; // Allow the form to submit
  } else {
    return false; // Prevent the form from submitting
  }
}
