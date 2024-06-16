document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-link');
    const tabContents = {
        'game-link': document.getElementById('lights-out'),
        'how-to-play-link': document.getElementById('info'),
        'math-link': document.getElementById('math'),
        'contact-link': document.getElementById('contact')
    };

    // Initially set all tab contents to hidden except for the game tab
    Object.keys(tabContents).forEach(id => {
        if (id === 'game-link') {
            tabContents[id].style.opacity = '1';
            tabContents[id].style.display = 'block';
        } else {
            tabContents[id].style.opacity = '0';
            tabContents[id].style.display = 'none';
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const targetId = tab.id; // Get the target content ID

            console.log('Trying to display:', targetId); // Print the target ID to be displayed

            // Hide all tab contents
            Object.keys(tabContents).forEach(id => {
                if (tabContents[id].style.display === 'block') {
                    tabContents[id].style.opacity = '0';
                    setTimeout(() => {
                        tabContents[id].style.display = 'none';
                    }, 500); // Match this to the CSS transition duration
                }
            });

            // Show the target tab content
            setTimeout(() => {
                if (tabContents[targetId]) {
                    tabContents[targetId].style.display = 'block';
                    console.log('Displayed:', targetId); // Print the target ID displayed
                    setTimeout(() => {
                        tabContents[targetId].style.opacity = '1';
                    }, 50); // Small delay to trigger the transition
                } else {
                    console.log('No content found for:', targetId); // Print if no content found
                }
            }, 500); // Delay to match hiding animation

            // Close the history panel
            document.getElementById("history").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
        });
    });
});
