const name = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('pass');

const fs = require('fs')

const addNotes = function(name,email) {
    const notes = loadNotes();
   

    const duplicateNotes = notes.filter(function (n)
    {
        return n.name === name;
    })

    if (duplicateNotes.length === 0)
    {
        notes.push(
            {
                name: name,
                email:email
            }
        )

        console.log("note added successfuly")
        saveNote(notes);
    }
    else
    {
        console.log('title taken down');
        }
    

}

const saveNote=function(notes)

{
    notesData = JSON.stringify(notes); 
    fs.writeFileSync('notes.json', notesData);

}

const loadNotes = function ()
{
    try {
        const notes = fs.readFileSync('notes.json');
        const dataBuffer = notes.toString();
        return JSON.parse(dataBuffer);
    } catch (error) {
        return [];
    }
    const notes = fs.readFileSync('notes.json');

}

module.exports = {
    addNotes: addNotes
};