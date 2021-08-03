// Use this we can extract everything from inside the form 
// No need for handleChange and submit and all that 
const form = e.target
const formData = new FormData(e.target)

const data = {};
for (let i=0; i < form.elements.length; i++) {
    const elem = form.elements[i];
    data[elem.name] = elem.value
}

