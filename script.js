// Initialize QuillJS Editor
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // Basic formatting buttons
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
            [{ 'align': [] }], // Text alignment
            ['clean'] // Clear formatting
        ]
    }
});

// Template Toggle Logic
const container = document.querySelector('.container');
const templates = ['gradient', 'solid', 'pattern'];
let currentTemplate = 0;

document.getElementById('toggleTemplate').addEventListener('click', () => {
    // Remove current template class
    container.classList.remove(...templates);

    // Apply the next template
    currentTemplate = (currentTemplate + 1) % templates.length;
    container.classList.add(templates[currentTemplate]);
});
