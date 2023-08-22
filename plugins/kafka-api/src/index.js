const express = require('express');
const app = express();
const port = 3000; // Port numarasını ihtiyaca göre ayarlayın

app.use(express.json());

app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});

// app.get('/tshirt', (req, res) => {
//     res.status(200).send({
//         tshirt: 'hey',
//         size: 'L'
//     })
// });


app.get('/api/resource', (req, res) => {
  res.status(200).send({
      tshirt: 'hey',
      size: 'L'
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

// app.post('/tshirt/:id', (req, res) => {

//     const {id} = req.params;
//     const {logo} = req.body;

//     if (!logo){
//         res.status(418).send({message: 'logo lazim!'})
//     }else{
//     res.send({
//         tshirt: `tshirt with your ${logo}, with an ID of ${id}`
//     })}
// } )
