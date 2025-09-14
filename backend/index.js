const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const app = express();
app.use(cors());

app.use(express.json());

mongoose
  .connect("mongodb+srv://mpraveen1432004:Prahithra14@cluster0.wwncra9.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(function () {
    console.log("connected to DB");
  })
  .catch(function (error) {
    console.log("Failed to connect", error);
  });

const credential = mongoose.model("credential", {}, "bulkmail");

// Create a test account or replace with real credentials.

app.post("/sendemail", function (req, res) {
  var msg = req.body.msg;
  var emailList = req.body.emailList;

  credential
    .find()
    .then(async function (data) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: data[0].toJSON().user,
          pass: data[0].toJSON().pass,
        },
      });

      try {
        for (let i = 0; i < emailList.length; i++) {
          await transporter.sendMail({
            from: data[0].toJSON().user,
            to: emailList[i],
            subject: "A message from Bulk Mail App",
            text: msg,
          });
          console.log("Email sent to", emailList[i]);
        }
        res.send(true);
      } catch (error) {
        console.error(error);
        res.send(false);
      }
    })
    .catch(function (error) {
      console.log("Error:", error);
      res.send(false);
    });
});

app.listen(5000, function () {
  console.log("Server Started......");
});
