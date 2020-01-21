var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3000);

// body-parser: use for upload files
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4201');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" ||
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/gif"
        ) {
            cb(null, true);
        } else {
            return cb(new Error('Only image are allowed!'));
        }
    }
}).single("BookImage");


// mongoose
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://nathanhuynh:QfEWb5P4zTE9cST3@nathanbookstore-f2uhj.mongodb.net/NathanBookStore?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    function (error) {
        if (error)
            console.log("MongoDB connect error!");
        else
            console.log("MongoDB connect successfully!");
    });

const Category = require("./Models/Category");
const Book = require("./Models/Book");

app.post("/api/cate", function(req, res){
    Category.find(function (err, items){
        if(err){
            res.json({result : 0, "err": err});
        } else {
            res.json({ result: 1, "items": items });
            return items;
        }
    });
});


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/cate", function (req, res) {
    res.render("cate");
});

app.post("/cate", function (req, res) {
    //res.send(req.body.txtCate);
    var newCate = new Category({
        name: req.body.txtCate,
        Books_id: []
    });

    //res.json(newCate);
    newCate.save(function (err) {
        if (err) {
            console.log("Save category error" + err);
            res.json({ result: 0 });
        }
        else {
            console.log("Save successfully!");
            res.json({ result: 1 });
        }
    });
});

app.get("/book", function (req, res) {
    Category.find(function (error, items) {
        if (error)
            console.log("Error: " + error);
        else {
            //console.log(items);
            res.render("book", { Cates: items });
        }
    });
});

app.post("/book", function (req, res) {
    //Upload image
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading!");
            res.json({ result: 0, "err": err });
        } else if (err) {
            console.log("An unknown error occurred when uploading!" + err);
            res.json({ result: 0, "err": err });
        } else {
            console.log("Upload is okay!");
            console.log(req.file); // Thông tin file đã upload
            //res.json({ "result": 1, "file": req.file });

            //Save book
            var newBook = new Book({
                name: req.body.txtName,
                image: req.file.filename,
                file: req.body.txtFile
            });

            //res.json(newBook);
            newBook.save(function (err) {
                if (err) {
                    res.json({ result: 0, "err": "Error save book to MongoDB!" });
                } else {
                    //res.json({ result: 1});
                    //Update category Books_id
                    Category.findOneAndUpdate(
                        { _id: req.body.selectCate },
                        { $push: { Books_id: newBook._id } },
                        function (err) {
                            if (err) {
                                res.json({ result: 0, "err": err });
                            } else {
                                //res.json({ result: 1 });
                                res.json(newBook);
                            }
                        }
                    );
                }
            });
            //res.json(newBook);

        }
    });
});