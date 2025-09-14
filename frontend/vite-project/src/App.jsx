import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { Upload, Send, Mail } from "lucide-react";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map((item) => item.A);
      setEmailList(totalemail);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true);
    axios
      .post("http://localhost:5000/sendemail", {
        msg: msg,
        emailList: emailList,
      })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully");
          setstatus(false);
        } else {
          alert("Failed");
          setstatus(false);
        }
      });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white relative px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/013/928/081/original/abstract-gradient-wallpaper-design-backdrop-for-presentation-concept-app-screen-cover-template-sidebar-for-creative-graphic-design-illustration-vector.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 80 }}
        className="z-10 w-full py-6 text-center"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold flex flex-wrap items-center justify-center gap-2 drop-shadow-lg leading-tight">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300" />
          </motion.div>
          BulkMail Sender
        </h1>
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-sm sm:text-md mt-2 text-pink-100"
        >
          Send thousands of emails with style ✨
        </motion.p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="z-10 mt-6 w-full max-w-md sm:max-w-2xl"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="rounded-2xl shadow-2xl bg-white/30 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center border border-white/40"
        >
          {/* Message Box */}
          <motion.textarea
            whileFocus={{ scale: 1.03, boxShadow: "0 0 15px rgba(255,192,203,0.7)" }}
            value={msg}
            onChange={handlemsg}
            placeholder="✍️ Type your email message here..."
            className="w-full h-28 sm:h-36 p-3 rounded-xl outline-none border border-pink-200 bg-white/50 text-black placeholder-gray-700 font-medium shadow-inner text-sm sm:text-base"
          />

          {/* File Upload */}
          <motion.label
            htmlFor="fileInput"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 flex flex-col items-center justify-center w-full border-2 border-dashed border-yellow-300 rounded-xl py-8 sm:py-10 cursor-pointer hover:bg-yellow-200/20 transition"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 mb-3 text-yellow-300" />
            </motion.div>
            <span className="text-base sm:text-lg font-semibold text-white drop-shadow text-center">
              Drag & Drop or Click to Upload File
            </span>
            <input
              id="fileInput"
              type="file"
              onChange={handlefile}
              className="hidden"
            />
          </motion.label>

          {/* Email Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 text-yellow-100 font-bold text-base sm:text-lg"
          >
            📧 Total Emails Found: {emailList.length}
          </motion.p>

          {/* Send Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full flex justify-center"
          >
            <motion.button
              onClick={send}
              disabled={status}
              whileHover={{ boxShadow: "0px 0px 20px rgba(255, 105, 180, 0.7)" }}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 text-black font-bold py-3 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              {status ? "Sending..." : "Send Emails"}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="z-10 mt-10 text-center text-xs sm:text-sm text-pink-100"
      >
        © 2025 BulkMail. All rights reserved.
      </motion.div>
    </div>
  );
}

export default App;
