const express = require("express");
const cors = require("cors");

//const { v4: uuid, isUuid } = require('uuid');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request
  const logLabel = `[${method.toUpperCase()}] ${url}`
  console.log(logLabel)
  next()
}

function validateRepositorieID(request, response, next) {
  const { id } = request.params
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repositorie ID' })
  }

  return next()
}


app.use(logRequests)
app.use('/repositories/:id', validateRepositorieID);



app.get("/repositories", (request, response) => {

  return response.json(repositories)

});



app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repositorie)

  return response.json(repositorie)
});

app.put("/repositories/:id", validateRepositorieID, (request, response) => {
  const { id } = request.params
  const { url, title, techs } = request.body

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)

  const likes = repositories[repositorieIndex].likes

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' })
  }

  const repositorie = {
    id,
    url,
    title,
    techs,
    likes
  }

  repositories[repositorieIndex] = repositorie

  return response.json(repositorie)
});

/*
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { url, title, techs } = request.body

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' })
  }

  repositories[repositorieIndex].url = url
  repositories[repositorieIndex].title = title
  repositories[repositorieIndex].techs = techs

  return response.json(repositorie)
});
*/


app.delete("/repositories/:id", validateRepositorieID, (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' })
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' })
  }

  const likes = repositories[repositorieIndex].likes + 1

  repositories[repositorieIndex].likes = likes

  return response.json(repositories[repositorieIndex])
});

module.exports = app;
