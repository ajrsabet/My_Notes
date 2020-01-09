let express = require("express");
let path = require("path");

let app = express();

//In order to make sure your server works on local & heroku you have to make sure the commandline looks like this
//process.env.PORT=heroku's port or local port
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "Develop/public/index.html"))
})


//customer DATA
let notesIds = [0];
let notesData = [
    // {
    //   title: "note1",
    //   text: "stuff1",
    //   id: 1,
    // },
    // {
    //   title: "note2",
    //   text: "stuff2",
    //   id: 2,
    // },
    // {
    //   title: "note3",
    //   text: "stuff3",
    //   id: 3,
    // },
    // {
    //   title: "note3",
    //   text: "stuff3",
    //   id: 4,
    // },
];


//Routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
})

// Displays all notes data
app.get("/api/notes", function (req, res) {
    return res.json(notesData);
});


// Create New Characters - takes in JSON input
app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newNote = req.body;
    
    newNote.id = notesIds[notesIds.length()];

        notesData.push(newNote);

        res.json(true);
});



app.listen(PORT, function () {
    console.log("listenin on port" + PORT);
})