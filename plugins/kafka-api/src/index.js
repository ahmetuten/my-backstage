const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});

app.get('/api/resource', (req, res) => {
  res.status(200).send({
      message: 'lorem ipsum dolor sit amet',
  })
});

app.post('/api/resource', (req, res) => {
  try {
    const requestData = req.body;
    res.send({ 
        message: 'İstek başarıyla işlendi'
  });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error: error.message });
  }
});
