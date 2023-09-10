const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://gozoomtechnologies:SSo5soLQtxL5g0Eq@cluster0.fg54dni.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const vehicleSchema = {
    name: String,
    vehicleNumber: String,
    phoneNumber: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
    sequence: {
        type: Number,
        default: 1
    },
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

app.get('/', (req, res) => {
    res.render('index', { successMessage: '' });
});

app.post('/insert', async (req, res) => {
    const name = req.body.name;
    const vehicleNumber = req.body.vehicleNumber;
    const phoneNumber = req.body.phoneNumber;

    try {
        // Find the latest sequence number for the same vehicle number
        const latestRecord = await Vehicle.findOne({ vehicleNumber: vehicleNumber })
            .sort({ sequence: -1 })
            .exec();

        // Calculate the new sequence number
        const newSequence = latestRecord ? latestRecord.sequence + 1 : 1;

        // Create a new instance of your Mongoose model with the sequence field
        const newRecord = new Vehicle({
            name: name,
            vehicleNumber: vehicleNumber,
            phoneNumber: phoneNumber,
            sequence: newSequence, // Set the sequence number
        });

        await newRecord.save();
        console.log("Record saved successfully");
        res.render('index', { successMessage: 'Your data has been saved successfully' });
    } catch (err) {
        console.error("Error saving record:", err);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/search', async (req, res) => {
    const searchVehicleNumber = req.body.searchVehicleNumber;

    try {
        const foundVehicle = await Vehicle.findOne({ vehicleNumber: searchVehicleNumber })
            .sort({ sequence: -1 }) // Sort by sequence number in descending order
            .exec();

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



