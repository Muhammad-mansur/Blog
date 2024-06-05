// Module imports
import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import fs, { write } from "fs";
import { title } from "process";

// Initialising server
const app = express();
// Initialising port
const port = 3000;

// Middlewares
app.use(express.static("public")); // For static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

const readPosts = () => JSON.parse(fs.readFileSync('data.json', 'utf8'));
const writePosts = (data) => fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

app.get("/", (req, res) => {
    const posts = readPosts();
    res.render("index.ejs", { posts: posts });
});

app.get("/posts/new", (req, res) => {
    res.render("create.ejs");
})

app.post("/posts", (req, res) => {
    const posts = readPosts();
    const newPost = {
        id: Date.now().toString(),
        title: req.body.title,
        content: req.body.content
    }
    posts.push(newPost);
    writePosts(posts);
    res.redirect("/");
})

app.get("/posts/:id/edit", (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === req.params.id);
    res.render("edit.ejs", { post });
})

app.put("/posts/:id", (req, res) => {
    let posts = readPosts();
    posts = posts.map(post => {
        if (post.id === req.params.id) {
            return {
                id: post.id,
                title: req.body.title,
                content: req.body.content
            }
        }
        return post;
    });
    writePosts(posts);
    res.redirect("/");
});

app.delete("/posts/:id", (req, res) => {
    let posts = readPosts();
    posts = posts.filter(p => p.id !== req.params.id);
    writePosts(posts);
    res.redirect("/");
})

//Starting server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});