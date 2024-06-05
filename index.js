// Module imports
import express from "express"; // Express framework
import bodyParser from "body-parser"; // Middleware for parsing request bodies
import methodOverride from "method-override"; // Middleware for supporting PUT and DELETE methods
import fs, { write } from "fs"; // File system module for reading and writing files

// Create an express application
const app = express();
// Define the port the server will listen on
const port = 3000;

// Middlewares
app.use(express.static("public")); // For static files
app.use(bodyParser.urlencoded({ extended: true })); // To parse URL-encoded request bodies
app.use(methodOverride('_method')); // To support PUT and DELETE methods via query parameters
app.set('view engine', 'ejs'); // Set EJS as templating engine

// Function to read posts from 'data.json' and parse them into a JavaScript object
const readPosts = () => JSON.parse(fs.readFileSync('data.json', 'utf8'));
// Function to write posts to 'data.json' after converting them to a JSON string
const writePosts = (data) => fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

// Route for displaying the home page with a list of posts
app.get("/", (req, res) => {
    const posts = readPosts();
    res.render("index.ejs", { posts: posts }); // Render the create view
});

// Route for displaying the form to create a new post
app.get("/posts/new", (req, res) => {
    res.render("create.ejs"); // Render the 'create' view
})

// Route for handling form submissions to create a new post
app.post("/posts", (req, res) => {
    const posts = readPosts(); // Read the current posts
    const newPost = {
        id: Date.now().toString(), // Generate a unique ID for the new post
        title: req.body.title, // Get the post title from the request body
        content: req.body.content // Get the post content from the request body
    }
    posts.push(newPost); // Add the new post to the current posts array
    writePosts(posts); // Write the updated posts array back to 'data.json'
    res.redirect("/"); // Redirect to the home page to display all posts
})

// Route for displaying the form to edit an existing post
app.get("/posts/:id/edit", (req, res) => {
    const posts = readPosts(); // Read the current posts
    const post = posts.find(p => p.id === req.params.id); // Find the post to edit by its ID
    res.render("edit.ejs", { post }); // Render the 'edit' view with the post data
})

// Route for handling form submissions to update an existing post
app.put("/posts/:id", (req, res) => {
    let posts = readPosts(); // Read the current posts
    posts = posts.map(post => {
        if (post.id === req.params.id) {
            return {
                id: post.id,
                title: req.body.title,
                content: req.body.content
            }
        }
        return post; // Return the original post if IDs don't match
    });
    writePosts(posts); // Write the updated posts array back to 'data.json'
    res.redirect("/"); // Redirect to the home page to display all posts
});

// Route for handling post deletions
app.delete("/posts/:id", (req, res) => {
    let posts = readPosts(); // Read the current posts
    posts = posts.filter(p => p.id !== req.params.id); // Remove the post with the given ID
    writePosts(posts); // Write the updated posts array back to 'data.json'
    res.redirect("/");  // Redirect to the home page to display all posts
})

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});