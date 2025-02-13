const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

//Middleware
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/users", (req, res) => {
  const html = `
  <ul>
   ${users
     .map(
       (user) => `
    <li>${user.first_name}</li>
    `
     )
     .join("")}
  </ul>
  `;
  return res.send(html);
});

//REST API Points
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.sendStatus(400);
  }
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  //TODO: Create new user
  //accept new data from URL
  const body = req.body;
  //Push new users data in Users or ./MOCK_DATA.json
  users.push({ ...body, id: users.length + 1 });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});



app.patch("/api/users/:id", (req, res) => {
  // TODO: Edit user with Specific ID
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.sendStatus(400);
  }
  const updates = req.body;

  //Find user by ID
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Update only provided fields
  Object.assign(user,updates);

  //Write the updated data back to MOCK_DATA.json
  fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data) => {
    if (err) {
      return res.json({ message: "Failed to update user" });
    }
    return res.json({ status: "success", user });
  })



  return res.json({ status: "success", user });
});

app.delete("/api/users/:id", (req, res) => {
  // TODO: Delete user with Specific ID
  const id = Number(req.params.id);
  if(isNaN(id)){
    return res.sendStatus(400);
  }

  const userIdx = users.findIndex((user) => user.id === id);
  if(userIdx === -1){
    return res.json({message: "User not found"})
  }

  //Remove the user from the database or ./MOCK_DATA.json
  users.splice(userIdx,1);

  //Save the updated users list to ./MOCK_DATA.json
  fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data) =>{
    if (err) {
      return res.status(500).json({ message: "Failed to delete user" });
    }
    return res.json({ status: "success", message: "User deleted" });
  })
  
});

/*We can also use route() function for similar types of route
app.route('/api/user/:id').get((req,res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
}).patch((req,res) => {
  //TODO: Edit user with id
  return res.json({status: "Pending"});
}).delete((req,res) => {
  //TODO: Delete user with ID 
  return res.json({status: "Pending"});
})

*/

app.listen(PORT, () => {
  console.log(`Server started at PORT :${PORT}`);
});
