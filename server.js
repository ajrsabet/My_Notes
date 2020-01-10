let express = require("express");
let path = require("path");
let app = express();

const util = require("util");
const fs = require("fs");
const readFileAsync = util.promisify(fs.readFile);

const writeFileAsync = util.promisify(fs.writeFile);

//In order to make sure your server works on local & heroku you have to make sure the commandline looks like this
//process.env.PORT=heroku's port or local port
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

//Routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

// Displays all notes data
app.get("/api/notes", function (req, res) {
    readFileAsync("./db/db.json", "utf8")
    .then((data) => {
        let notesData = JSON.parse(data);

        return res.json(notesData);
    })
});


// Create New Note
app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    
    readFileAsync("./db/db.json", "utf8")
    .then((data) => {
        let notesData = JSON.parse(data);

        if (notesData.length >= 1){
            newNote.id = notesData[notesData.length-1].id+1}
            else {newNote.id = 1}

        notesData.push(newNote);
        
        writeFileAsync('./db/db.json', JSON.stringify(notesData), 'utf8');
        res.json(true);
     })
});


// Delete note
app.delete("/api/notes/:id", function (req, res) {     
    let deleteNoteId = parseInt(req.params.id);

    readFileAsync("./db/db.json", "utf8")
    .then((data) => {
        let notesData = JSON.parse(data)

        const removeIndex = notesData.findIndex(x => x.id === deleteNoteId);

        notesData.splice(removeIndex, 1);

        writeFileAsync('./db/db.json', JSON.stringify(notesData), 'utf8');

        res.json(notesData);
     })
});
 
// Listening on port
app.listen(PORT, function () {
    console.log("listenin on port" + PORT);
})