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

// let notesData = util.promisify(fs.readFile);
//customer DATA
// let notesIds = 4;
// let notesData = [
//     {notesIds:1},
//     {
//         title: "title1",
//         text: "text1",
//         id: 1
//     },
//     {
//         title: "title2",
//         text: "text2",
//         id: 2
//     },
//     {
//         title: "title3",
//         text: "text3",
//         id: 3
//     },
// ]


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
        // console.log(notesData);

        return res.json(notesData);
    })
});


// Create New Note - takes in JSON input
app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newNote = req.body;
    
    readFileAsync("./db/db.json", "utf8")
    .then((data) => {
        // console.log(notesData);
        // console.log(newNote);
        let notesData = JSON.parse(data);

        // newNote.id = notesData[-1].id + 1;
        newNote.id = 1;
        notesData.push(newNote);
        
        writeFileAsync('./db/db.json', JSON.stringify(notesData), 'utf8');
        res.json(true);
     })
});

app.delete("/api/notes/:id", function (req, res) {
        
    let deleteNoteId = parseInt(req.params.id);
    console.log(deleteNoteId);
    
    readFileAsync("./db/db.json", "utf8")
    .then((data) => {
        let notesData = JSON.parse(data)

        console.log(notesData);
        

        const removeIndex = notesData.findIndex(x => x.id === deleteNoteId);

        notesData.splice(removeIndex, 1);
        console.log(notesData);
        writeFileAsync('./db/db.json', JSON.stringify(notesData), 'utf8');

        res.json(notesData);
     })
});
 


app.listen(PORT, function () {
    console.log("listenin on port" + PORT);
})