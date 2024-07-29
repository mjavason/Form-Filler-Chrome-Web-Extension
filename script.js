let zenModeActive = false;
let observer;

// Function to check the user's preferred color scheme
function darkTheme() {
  // Use matchMedia to check if the user prefers a dark color scheme
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  if (prefersDarkScheme.matches) {
    // User prefers a dark theme
    return true;
  } else {
    // User prefers a light theme
    return false;
  }
}

// Function to remove all images, videos, audio, iframes, embed, object elements, disable links, and set background and text color
function removeMediaAndDisableLinks() {
  // Array of selectors for elements to be removed
  const selectors = ['img', 'video', 'audio', 'iframe', 'embed', 'object'];

  // Loop over each selector and remove the corresponding elements
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => element.remove());
  });

  // Disable all links
  document.querySelectorAll('a').forEach((link) => {
    link.style.pointerEvents = 'none'; // Disable clicking
    link.style.color = 'blue'; // Keep them looking like links
    link.style.textDecoration = 'underline'; // Add underline for link appearance
  });

  // Set background color to white
  //   document.body.style.backgroundColor = 'white';

  if (darkTheme()) {
    // Set all text color to white
    document.querySelectorAll('*').forEach((element) => {
      element.style.color = 'white'; // Set text color to black
      element.style.backgroundColor = 'black';
    });
  } else {
    // Set all text color to black
    document.querySelectorAll('*').forEach((element) => {
      element.style.color = 'black'; // Set text color to black
      element.style.backgroundColor = 'white';
    });
  }

  // Create a MutationObserver to watch for changes in the DOM
  let observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check added nodes for any media elements
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (
              ['IMG', 'VIDEO', 'AUDIO', 'IFRAME', 'EMBED', 'OBJECT'].includes(
                element.tagName
              )
            ) {
              element.remove();
            } else {
              // Check for media elements within the added node
              element
                .querySelectorAll('img, video, audio, iframe, embed, object')
                .forEach((mediaElement) => mediaElement.remove());
            }
          }
        });
      }
    }
  });

  // Configure the observer to watch for added nodes in the document
  observer.observe(document.body, {
    childList: true, // Watch for additions or removals of child nodes
    subtree: true, // Watch the entire subtree (i.e., all descendant nodes)
  });
}

// Function to hide all media elements and disable links
function hideMediaAndDisableLinks() {
  zenModeActive = true;

  // Array of selectors for elements to be hidden
  const selectors = ['img', 'video', 'audio', 'iframe', 'embed', 'object'];

  // Loop over each selector and hide the corresponding elements
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.dataset.originalDisplay = element.style.display; // Save original display style
      element.style.display = 'none'; // Hide element
    });
  });

  // Disable all links
  document.querySelectorAll('a').forEach((link) => {
    link.dataset.originalPointerEvents = link.style.pointerEvents; // Save original pointer events
    link.dataset.originalColor = link.style.color; // Save original color
    link.dataset.originalTextDecoration = link.style.textDecoration; // Save original text decoration

    link.style.pointerEvents = 'none'; // Disable clicking
    link.style.color = 'blue'; // Keep them looking like links
    link.style.textDecoration = 'underline'; // Add underline for link appearance
  });

}

// Function to restore all media elements and re-enable links
function restoreMediaAndEnableLinks() {
  zenModeActive = false;

  // Array of selectors for elements to be restored
  const selectors = ['img', 'video', 'audio', 'iframe', 'embed', 'object'];

  // Loop over each selector and restore the corresponding elements
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.dataset.originalDisplay !== undefined) {
        element.style.display = element.dataset.originalDisplay; // Restore original display style
        delete element.dataset.originalDisplay; // Clean up data attribute
      }
    });
  });

  // Re-enable all links
  document.querySelectorAll('a').forEach((link) => {
    if (link.dataset.originalPointerEvents !== undefined) {
      link.style.pointerEvents = link.dataset.originalPointerEvents; // Restore original pointer events
      delete link.dataset.originalPointerEvents; // Clean up data attribute
    }
    if (link.dataset.originalColor !== undefined) {
      link.style.color = link.dataset.originalColor; // Restore original color
      delete link.dataset.originalColor; // Clean up data attribute
    }
    if (link.dataset.originalTextDecoration !== undefined) {
      link.style.textDecoration = link.dataset.originalTextDecoration; // Restore original text decoration
      delete link.dataset.originalTextDecoration; // Clean up data attribute
    }
  });
}

// Function to handle keyboard shortcuts
function handleKeyboardShortcut(event) {
  // Check if Ctrl and Z are pressed simultaneously
  if (event.ctrlKey && event.key === 'z') {
    // Prevent the default action if necessary (e.g., undo in some applications)
    event.preventDefault();

    // console.log('Ctrl + Z was pressed!');

    // Call the function to remove media elements or restore them
    zenModeActive ? restoreMediaAndEnableLinks() : hideMediaAndDisableLinks();
  }

  // Check if Ctrl + Alt and Z are pressed simultaneously
  if (event.ctrlKey && event.key === 'z' && event.altKey) {
    // Prevent the default action if necessary (e.g., undo in some applications)
    event.preventDefault();

    // console.log('Ctrl + Alt + Z was pressed!');

    removeMediaAndDisableLinks();
  }
}

console.log('Zen mode extension active!');
// Add an event listener to the document for keydown events
document.addEventListener('keydown', handleKeyboardShortcut);
