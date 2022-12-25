const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const async = require("async");
const http = require("http");
const nodemailer = require("nodemailer");

// const patientSchema = require("./Schema/patient");

const app = express();

// const customMiddelware = () => {
//   console.log("custom middleware");
// };

// app.use(customMiddelware);

// Implement Body Parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
var dbName = "ParlorSystem"; //Healtcare -> test database.

app.get("/user", (req, res) => {
  async function getData() {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("userData");

    var findResult = await collection.find({}).toArray();
    // console.log(findResult);
    res.send(findResult);
  }

  getData();
});

app.get(`/user/:id`, (req, res) => {
  async function getUserData() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("userData");

    var findResult = await collection
      .find({ CustomerID: req.params.id })
      .toArray();
    // console.log(findResult);

    res.send(findResult[0]);
  }

  getUserData();
});

app.get("/doc", (req, res) => {
  async function getDocData() {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection.find({}).toArray();
    // console.log(findResult);
    res.send(findResult);
  }

  getDocData();
});

app.get("/doc/BookedSlots/:id", (req, res) => {
  var id = req.params.id;

  async function getDocData() {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("BookedSlots");

    var findResult = await collection.find({ BeauticianID: id }).toArray();
    // console.log(findResult);
    res.send(findResult[0]);
  }

  getDocData();
});

app.post("/doc", (req, res) => {
  const dataa = req.body;
  console.log(dataa);

  var CustomerID =
    dataa.firstName[0].toUpperCase() +
    dataa.lastName[0].toUpperCase() +
    dataa.id1.replace(/\s+/g, "").slice(0, 6);

  var BeauticianID =
    dataa.firstName[0].toUpperCase() +
    dataa.lastName[0].toUpperCase() +
    dataa.id2.replace(/\s+/g, "").slice(0, 6);

  var dataToUpload = {
    CustomerID: CustomerID,
    BeauticianID: BeauticianID,
    address: dataa.address,
    age: dataa.age,
    gender: dataa.gender,
    parlorHistory: [],
    password: dataa.password,
    email: dataa.email,
    firstName: dataa.firstName,
    lastName: dataa.lastName,
    reviews: [],
    ParlorAdd: dataa.ParlorAddress,
    ParlorName: dataa.ParlorName,
    city: dataa.city,
    ParlorCity: dataa.ParlorCity,
    ParlorPincode: dataa.ParlorPincode,
    ParlorState: dataa.ParlorState,
    pincode: dataa.pincode,
    state: dataa.sstate,
    speciality: dataa.speciality,
    phoneNo: dataa.phone,
    DOB: dataa.dob,
  };

  var userDataUpload = {
    CustomerID: CustomerID,
    address: dataa.address,
    age: dataa.age,
    gender: dataa.gender,
    parlorHistory: [],
    password: dataa.password,
    email: dataa.email,
    firstName: dataa.firstName,
    lastName: dataa.lastName,
    city: dataa.city,
    state: dataa.sstate,
    pincode: dataa.pincode,
    DOB: dataa.dob,
    phoneNo: dataa.phone,
  };

  var uploadSlotData = {
    BeauticianID: BeauticianID,
    slots: [],
  };

  // console.log(CustomerID);

  async function registerBeautician() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");
    const collection2 = db.collection("userData");
    const collection1 = db.collection("BookedSlots");

    if (await collection.findOne({ CustomerID: CustomerID })) {
      console.log("ID already exist;s!");
    } else {
      await collection.insertOne(dataToUpload);
      await collection1.insertOne(uploadSlotData);
      await collection2.insertOne(userDataUpload);
    }
  }

  registerBeautician();
});

app.get("/doc/:id", (req, res) => {
  async function getbeauticianData() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection
      .find({ BeauticianID: req.params.id })
      .toArray();
    // console.log(findResult);

    res.send(findResult[0]);
  }

  getbeauticianData();
});

app.get("/admin", (req, res) => {
  async function getAdminData() {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("adminData");

    var findResult = await collection.find({}).toArray();
    // console.log(findResult);
    res.send(findResult);
  }

  getAdminData();
});

app.get("/doc/:id/Appointmentdata", (req, res) => {
  async function getbeauticianData() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Appointmentdata");

    var findResult = await collection
      .find({ BeauticianID: req.params.id })
      .toArray();
    console.log(findResult);

    res.send(findResult[0]);
  }

  getbeauticianData();
});

app.get("/doc/:id/BookAppointment", (req, res) => {
  async function getbeauticianData() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Appointmentdata");

    var findResult = await collection
      .find({ BeauticianID: req.params.id })
      .toArray();
    // console.log(findResult);

    res.send(findResult[0]);
  }

  getbeauticianData();
});

app.get("/doc/:id/sendemailll", (req, res) => {
  async function getbeauticianData() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Appointmentdata");

    var findResult = await collection
      .find({ BeauticianID: req.params.id })
      .toArray();
    // console.log(findResult);

    res.send(findResult[0]);
  }

  getbeauticianData();
});

app.post("/user", (req, res) => {
  const dataa = req.body;
  console.log(dataa);

  var CustomerID =
    dataa.firstName[0].toUpperCase() +
    dataa.lastName[0].toUpperCase() +
    dataa.id1.replace(/\s+/g, "").slice(0, 6);

  var dataToUpload = {
    CustomerID: CustomerID,
    address: dataa.address,
    age: dataa.age,
    gender: dataa.gender,
    parlorHistory: [],
    password: dataa.password,
    email: dataa.email,
    firstName: dataa.firstName,
    lastName: dataa.lastName,
    city: dataa.city,
    state: dataa.sstate,
    pincode: dataa.pincode,
    DOB: dataa.dob,
    phoneNo: dataa.phone,
  };

  // console.log(CustomerID);

  async function registerUser() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("userData");

    if (await collection.findOne({ CustomerID: CustomerID })) {
      console.log("ID already exists!");
    } else {
      await collection.insertOne(dataToUpload);
    }
  }

  registerUser();
});

app.post("/user2", (req, res) => {
  const dataa = req.body;
  console.log(dataa);

  // var CustomerID =
  //   dataa.firstName[0].toUpperCase() +
  //   dataa.lastName[0].toUpperCase() +
  //   dataa.id1.replace(/\s+/g, "").slice(0, 6);

  var dataToUpload = {
    StartTime: dataa.StartTime,
    EndTime: dataa.EndTime,
    Date: dataa.Date,
    id: dataa.id,
  };

  // console.log(CustomerID);

  async function registerUser2() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Appointmentdata");

    if (await collection.findOne({ BeauticianID: dataa.id })) {
      // console.log("ID alread exists!");
      collection.updateOne(
        { BeauticianID: dataa.id },
        {
          $push: { slots: dataa },
        }
      );
    } else {
      await collection.insertOne(dataToUpload);
    }
  }

  registerUser2();
});

app.post("/admin/editProfile", (req, res) => {
  const dataa = req.body;
  console.log(dataa);

  async function checkForIds() {
    // Use connect method to connect to the server
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("editProfile");

    if (await collection.findOne({ id: dataa.id })) {
      console.log("ID alread exists!");
    } else {
      await collection.insertOne(dataa);
    }

    // console.log(findResult);
  }

  checkForIds();
});

app.patch("/user/:id", (req, res) => {
  const dataa = req.body;
  console.log(dataa);

  async function updateData() {
    // Use connect method to connect to the server
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("userData");

    await collection.updateOne(
      { CustomerID: req.params.id },
      { $push: { parlorHistory: dataa } }
    );
  }

  updateData();
});

app.post("/doc/:id/sendMail", (req, res) => {
  // var dataa = req.body;
  // console.log("hello");
  // console.log(dataa);

  var listofemails = req.body.emails;
  // Will store email sent successfully.
  var success_email = [];
  // Will store email whose sending is failed.
  var failure_email = [];

  var transporter;

  /* Loading modules done. */
  function massMailer() {
    var self = this;
    transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "darkshadow00100100@gmail.com",
        pass: "wjpbfvmioudrtbhd",
      },
    });
    // Fetch all the emails from database and push it in listofemails
    // Will do it later.
    self.invokeOperation();
  }

  /* Invoking email sending operation at once */
  massMailer.prototype.invokeOperation = function () {
    var self = this;
    async.each(listofemails, self.SendEmail, function () {
      console.log(success_email);
      console.log(failure_email);
    });
  };

  /*
   * This function will be called by multiple instance.
   * Each instance will contain one email ID
   * After successfull email operation, it will be pushed in failed or success array.
   */

  massMailer.prototype.SendEmail = function (Email, callback) {
    console.log("Sending email to " + Email);
    var self = this;
    self.status = false;
    // waterfall will go one after another
    // So first email will be sent
    // Callback will jump us to next function
    // in that we will update DB
    // Once done that instance is done.
    // Once every instance is done final callback will be called.
    async.waterfall(
      [
        function (callback) {
          var mailOptions = {
            from: req.body.beauticianName,
            to: Email,
            subject: "Offer Mail",
            text: req.body.offermsg,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              failure_email.push(Email);
            } else {
              self.status = true;
              success_email.push(Email);
            }
            callback(null, self.status, Email);
          });
        },
        function (statusCode, Email, callback) {
          console.log(
            "Will update DB here for " + Email + "With " + statusCode
          );
          callback();
        },
      ],
      function () {
        //When everything is done return back to caller.
        callback();
      }
    );
  };

  new massMailer(); //lets begin
});

/**                        Slots Booking                         */
app.patch("/doc/deleteSlots/:id", (req, res) => {
  var row = req.body.row;
  var id = req.params.id;
  console.log(typeof row);

  async function deleteSlot() {
    // Use connect method to connect to the server
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Appointmentdata");

    await collection.updateOne(
      { BeauticianID: id },
      {
        $pull: {
          slots: {
            StartTime: row.StartTime,
            EndTime: row.EndTime,
            Date: row.Date,
          },
        },
      }
    );
  }

  deleteSlot();
});

app.patch("/doc/bookedSlot/:id", (req, res) => {
  var row = req.body.objj;
  var id = req.params.id;
  // console.log(row);

  async function bookSlot() {
    // Use connect method to connect to the server
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("BookedSlots");

    var result = await collection.updateOne(
      { BeauticianID: id },
      {
        $push: { slots: row },
      }
    );

    console.log(result);
  }

  bookSlot();
});

app.patch("/doc/bookedSlot/delete/:id", (req, res) => {
  var row = req.body.objj;
  var id = req.params.id;
  // console.log(typeof row);

  async function deleteSlot() {
    // Use connect method to connect to the server
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Appointmentdata");

    await collection.updateOne(
      { BeauticianID: id },
      {
        $pull: {
          slots: {
            StartTime: row.StartTime,
            EndTime: row.EndTime,
            Date: row.Date,
          },
        },
      }
    );
  }

  deleteSlot();
});

/****************************DOCTOR SEARCH WITH ONE PARAMETER********************************* */
app.get("/doc/search1/:speciality", (req, res) => {
  var spec = req.params.speciality;
  // var city = req.params.city;
  // var pin = req.params.pin;

  // console.log(spec, city, pin);

  async function searchBeautician() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection
      .find({
        speciality: spec,
      })
      .toArray();

    // console.log(findResult);
    res.send(findResult);
  }

  searchBeautician();
});

app.get("/doc/search2/:pin", (req, res) => {
  // var spec = req.params.speciality;
  // var city = req.params.city;
  var pin = req.params.pin;
  pin.toString();

  // console.log(spec, city, pin);

  async function searchBeautician() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection
      .find({
        ParlorPincode: pin,
      })
      .toArray();

    // console.log(findResult);
    res.send(findResult);
  }

  searchBeautician();
});

app.get("/doc/search3/:city", (req, res) => {
  // var spec = req.params.speciality;
  var city = req.params.city;
  // var pin = req.params.pin;

  // pin.toString();

  // console.log(spec, city, pin);

  async function searchBeautician() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection
      .find({
        ParlorCity: city,
      })
      .toArray();

    // console.log(findResult);
    res.send(findResult);
  }

  searchBeautician();
});

/****************************DOCTOR SEARCH WITH TWO PARAMETER********************************* */
app.get("/doc/search1/:speciality/:pin", (req, res) => {
  var spec = req.params.speciality;
  // var city = req.params.city;
  var pin = req.params.pin;

  if (spec === undefined) spec = "";
  // if (city === undefined) city = "";
  if (pin === undefined) pin = "";

  pin.toString();

  // console.log(spec, city, pin);

  async function searchBeautician() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection
      .find({
        speciality: spec,
        ParlorPincode: pin,
      })
      .toArray();

    // console.log(findResult);
    res.send(findResult);
  }

  searchBeautician();
});

app.get("/doc/search2/:pin/:city", (req, res) => {
  // var spec = req.params.speciality;
  var city = req.params.city;
  var pin = req.params.pin;

  pin.toString();

  // console.log(spec, city, pin);

  async function PinCityBeautician() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection
      .find({
        // speciality: spec,
        ParlorCity: city,
        ParlorPincode: pin,
      })
      .toArray();

    // console.log(findResult);
    res.send(findResult);
  }

  PinCityBeautician();
});

app.get("/doc/search3/:speciality/:city", (req, res) => {
  var spec = req.params.speciality;
  var city = req.params.city;
  // var pin = req.params.pin;

  if (spec === undefined) spec = "";
  if (city === undefined) city = "";
  // if (pin === undefined) pin = "";

  // pin.toString();

  // console.log(spec, city, pin);

  async function searchBeautician() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection
      .find({
        speciality: spec,
        // hospitalPincode: pin,
        ParlorCity: city,
      })
      .toArray();

    // console.log(findResult);
    res.send(findResult);
  }

  searchBeautician();
});

/****************************DOCTOR SEARCH WITH THREE PARAMETER********************************* */
app.get("/doc/search1/:speciality/:city/:pin", (req, res) => {
  var spec = req.params.speciality;
  var city = req.params.city;
  var pin = req.params.pin;

  if (spec === undefined) spec = "";
  if (city === undefined) city = "";
  if (pin === undefined) pin = "";

  pin.toString();

  // console.log(spec, city, pin);

  async function searchBeautician() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var findResult = await collection
      .find({
        speciality: spec,
        ParlorPincode: pin,
        ParlorCity: city,
      })
      .toArray();

    // console.log(findResult);
    res.send(findResult);
  }

  searchBeautician();
});

app.patch("/doc/:id/rating", (req, res) => {
  async function addRating() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("beauticianData");

    var obj = {
      CustomerID: req.body.CustomerID,
      starReview: req.body.starReview,
      note: req.body.note,
    };

    await collection.updateOne(
      { BeauticianID: req.params.id },
      { $push: { reviews: obj } }
    );
  }

  addRating();
});

app.patch("/user/:id/rating", (req, res) => {
  const datee = new Date(req.body.dateVisited);

  async function addRating() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("userData");

    // console.log(req.body);

    var medNm = await collection.findOne({ CustomerID: req.params.id });
    // console.log(medNm);

    var medHis = medNm.parlorHistory;
    console.log(medHis);
    medHis.map((item) => {
      var date = new Date(item.dateVisited);
      if (
        item.CustomerID === req.body.CustomerID &&
        date.toLocaleDateString() === datee.toLocaleDateString()
      ) {
        item.starReview = req.body.starReview;
      }
    });

    await collection.updateOne(
      { CustomerID: req.params.id },
      { $set: { parlorHistory: medHis } }
    );
  }

  addRating();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

// const express = require("express");
// const nodemailer=require("nodemailer");

// const app=express();

// let PORT=process.env.PORT ||3001;
// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "darkshadow00100100@gmail.com",
//     pass: "wjpbfvmioudrtbhd",
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// let mailOptions = {
//   from: "darkshadow00100100@gmail.com",
//   to: "abhinavdeshmukh77@gmail.com",
//   subject: "Texting",
//   text: "HEllo chutiya",
// };

// transporter.sendMail(mailOptions,function (err,success) {
//   if(err){
//     console.log(err);
//   }else{
//     console.log("email sent successfully!");
//   }
// });
