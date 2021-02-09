let express = require("express")
let mongodb = require("mongodb")

let app = express()
let db

app.use(express.static("public"))

let connectionString =
  "mongodb+srv://mainUser:50cent@cluster0.psqep.mongodb.net/TodoApp?retryWrites=true&w=majority"
mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    db = client.db()
    app.listen(3000)
  }
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


function passwordProtected(req, res, next) { 
  res.set('WWW-Authenticate', 'Basic realm = "Simple Todo App"')
  console.log(req.headers.authorization)
  if(req.headers.authorization == "Basic bGVhcm46amF2YXNjcmlwdA==") { 
    next()
  } else { 
    res.status(401).send("Authentication required")
  }
}

// tell our app to begin listening for incoming requests
// 2nd argument should be a function that runs when this request happens
// annonymus function
app.get("/", function (req, res) {
  db.collection("items")
    .find()
    .toArray(function (err, items) {
      res.send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h1 class="display-4 text-center py-1">To-Do App</h1>
      
      <div class="jumbotron p-3 shadow-sm">
        <form id="create-form" action="/create-item" method="POST">
          <div class="d-flex align-items-center">
            <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>
      
      <ul id="item-list" class="list-group pb-5">
        
        
      </ul>
    </div>

  <script>
          // JSON -popular way of sending data back and forth
          let items= ${JSON.stringify(items)}
  </script>  
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
  </body>
  </html>`)
    })
})

// a. when the web browser sends a POST request to this url /create-item, b. what do we want it to do
// a.       , b.
// this section of code where we respond to incoming POST http request to this URL '/create-item'
app.post("/create-item", function (req, res) {
  db.collection("items").insertOne({ text: req.body.text }, function (
    err,
    info
  ) {
    // json-javascript object notation - a very popular way to send data back and forward. And our goal here is to: send back a JS Obj that represents the new mongo DB document that was just created
    res.json(info.ops[0])
  })
})

app.post("/update-item", function (req, res) {
  db.collection("items").findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: req.body.text } },
    function () {
      res.send("Success")
    }
  )
})

app.post("/delete-item", function (req, res) {
  db.collection("items").deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    function () {
      res.send("Success")
    }
  )
})
