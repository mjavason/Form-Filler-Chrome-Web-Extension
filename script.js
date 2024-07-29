let zenModeActive = false;

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

// Function to remove all images, videos, audio, iframes, embed, object elements, and set background and text color
function removeMediaAndDisableLinks() {
  // Array of selectors for elements to be removed
  const selectors = ['img', 'video', 'audio', 'iframe', 'embed', 'object'];

  // Loop over each selector and remove the corresponding elements
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => element.remove());
  });

  // Set background color and text color based on theme
  if (darkTheme()) {
    // Set all text color to white
    document.querySelectorAll('*').forEach((element) => {
      element.style.color = 'white'; // Set text color to white
      element.style.backgroundColor = '#323434'; // Set background color to black
    });
  } else {
    // Set all text color to black
    document.querySelectorAll('*').forEach((element) => {
      element.style.color = 'black'; // Set text color to black
      element.style.backgroundColor = '#f5f5f5'; // Set background color to white
    });
  }

  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver((mutationsList) => {
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

// Function to hide all media elements
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
}

// Function to restore all media elements
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
}

// Function to handle keyboard shortcuts
function handleKeyboardShortcut(event) {
  // Check if Ctrl and Z are pressed simultaneously
  if (event.ctrlKey && event.key === 'z') {
    // Prevent the default action if necessary (e.g., undo in some applications)
    event.preventDefault();

    // Call the function to remove media elements or restore them
    zenModeActive ? restoreMediaAndEnableLinks() : hideMediaAndDisableLinks();
  }

  // Check if Ctrl + Alt and Z are pressed simultaneously
  if (event.ctrlKey && event.key === 'z' && event.altKey) {
    // Prevent the default action if necessary (e.g., undo in some applications)
    event.preventDefault();

    removeMediaAndDisableLinks();
  }
}

console.log('Zen mode extension active!');
// Add an event listener to the document for keydown events
document.addEventListener('keydown', handleKeyboardShortcut);
