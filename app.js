const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://suhailnagore4:wBZJWpeIJ1zNVtho@cluster0.6po2xot.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const vehicleSchema = {
    name: String,
    vehicleNumber: String,
    phoneNumber: String
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

app.get('/', (req, res) => {
    res.render('index');
});

app.post("/insert", function (req, res) {
  const name = req.body.name;
  const vehicleNumber = req.body.vehicleNumber;
  const phoneNumber = req.body.phoneNumber;

  // Create a new instance of your Mongoose model
  const newRecord = new Vehicle ({
    name: name,
    vehicleNumber: vehicleNumber,
    phoneNumber: phoneNumber,
  });

  // Save the new record and handle success or error using Promises
  newRecord
    .save()
    .then(() => {
      console.log("Record saved successfully");
      // Render the thank you page
      res.render("thankyou");
    })
    .catch((err) => {
      console.error("Error saving record:", err);
      res.status(500).send("Internal Server Error");
    });
});


app.post('/search', async (req, res) => {
    const searchVehicleNumber = req.body.searchVehicleNumber;

    try {
        const foundVehicle = await Vehicle.findOne({ vehicleNumber: searchVehicleNumber }).exec();
        if (foundVehicle) {
            res.render('search', {
                found: true,
                name: foundVehicle.name,
                phoneNumber: foundVehicle.phoneNumber
            });
        } else {
            res.render('search', { found: false });
        }
    } catch (err) {
        console.error(err);
        res.render('search', { found: false });
    }
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
