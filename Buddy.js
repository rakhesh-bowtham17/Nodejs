const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const filePath = './cdw_ace23_buddies.json';

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

app.get('/buddies', (req, res) => {
  const buddies = JSON.parse(fs.readFileSync(filePath));
  res.json(buddies);
});

app.get('/buddies/:id', (req, res) => {
  const buddies = JSON.parse(fs.readFileSync(filePath));
  const buddy = buddies.find(b => b.employeeId === req.params.id || b.realName === req.params.id);
  if (buddy) {
    res.json(buddy);
  } else {
    res.status(404).send('Buddy not found');
  }
});

app.post('/buddies', (req, res) => {
  const buddies = JSON.parse(fs.readFileSync(filePath));
  const newBuddy = req.body;
  buddies.push(newBuddy);
  fs.writeFileSync(filePath, JSON.stringify(buddies));
  res.status(404).send('Buddy added');
});

app.put('/buddies/:id', (req, res) => {
  const buddies = JSON.parse(fs.readFileSync(filePath));
  const index = buddies.findIndex(b => b.employeeId === req.params.id || b.realName === req.params.id);
  if (index !== -1) {
    buddies[index] = {...buddies[index], ...req.body};
    fs.writeFileSync(filePath, JSON.stringify(buddies));
    res.send('Buddy updated');
  } else {
    res.status(404).send('Buddy not found');
  }
});

app.delete('/buddies/:id', (req, res) => {
  const buddies = JSON.parse(fs.readFileSync(filePath));
  const index = buddies.findIndex(b => b.employeeId === req.params.id || b.realName === req.params.id);
  if (index !== -1) {
    buddies.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(buddies));
    res.send('Buddy deleted');
  } else {
    res.status(404).send('Buddy not found');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});