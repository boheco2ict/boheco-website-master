import React, { useEffect, useRef } from "react";
import "./inquiry.css";
import axios from "axios";

const image = "assets/logo.png";

const Inquiry = () => {
  let isActive = true;
  let isDisable = false;

  const humanMessage = useRef();
  const botmessage = useRef();
  const input = useRef();

  useEffect(() => {
    async function initSession() {
      try {
        await axios({
          method: "GET",
          url: process.env.REACT_APP_API_SESSION_INIT,
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error initializing session:", error);
      }
    }
    // Initialize session and set an interval to refresh it
    initSession();
    const interval = setInterval(initSession, 90 * 1000); // Refresh session every 90 seconds;
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const checkStatus = (e) => {
    const status = document.querySelector(".status");
    // selecting the status class
    if (isActive === true) {
      //if the bot is active
      status.innerHTML = "Online";
      status.style.color = "green";
    } else {
      status.innerHTML = "Offline";
      status.style.color = "red";
    }
  };
  const handleInput = () => {
    const inputRef = input.current;
    const getHumanMessage = humanMessage.current;
    const getBotMessage = botmessage.current;

    let words = document.querySelector("#input").value;
    if (words.split(" ")[0] !== "BILL" || words === undefined) {
      // if the input contains some question
      getBotMessage.innerText = "Typing...";
      setTimeout(() => {
        getBotMessage.innerText = `Maayong Adlaw!\nMga Membro, Konsumedor, Tag-iya sa BOHECO DOS!\n\nType "BILL HELP" for more information!`;
        inputRef.value = ""; // clear the input
      }, 2000);
    }
    if (words === "BILL HELP") {
      // if the input contains some question
      getBotMessage.innerText = "Typing...";
      setTimeout(() => {
        getBotMessage.innerText = `To inquire your bill type this following format.\n\nBILL{space}<consumername>{space}<10-digit acctnum>{space}<bill-month>\nEx:\n BILL DOE, JOHN 010101xxxx 01-2023`;
        inputRef.value = ""; // clear the input
      }, 2000);
    }
    if (words === "BILL") {
      getBotMessage.innerText = "Typing...";
      setTimeout(() => {
        getBotMessage.innerText = `To inquire your bill type this following format.\n\nBILL{space}<consumername>{space}<10-digit acctnum>{space}<bill-month>\nEx:\n BILL DOE, JOHN 010101xxxx 01-2023`;
        inputRef.value = ""; // clear the input
      }, 2000);
    }

    // *** UPDATED ADDED CONSUMER_NAME INTO THE QUERY ***
    try {
      const getAccountNumber = words.split(" ")[words.split(" ").length - 2];
      const getBillMonth = words.split(" ")[words.split(" ").length - 1];
      const maxLen = words.split(" ").length - 2;

      let getConsumerName = "";
      for (let i = 1; i < maxLen; i++) {
        getConsumerName += words.split(" ")[i] + " ";
      }

      if (getAccountNumber === undefined) {
      } else if (getAccountNumber.length === 10) {
        if (getBillMonth === undefined || getBillMonth.length < 7) {
          getBotMessage.innerText = "Typing...";
          setTimeout(() => {
            getBotMessage.innerText = `To inquire your bill type this following format.\n\nBILL{space}<consumername>{space}<10-digit acctnum>{space}<bill-month>\nEx:\n BILL DOE, JOHN 010101xxxx 01-2023`;
            inputRef.value = ""; // clear the input
          }, 2000);
        } else {
          const acctNumber = getAccountNumber;
          const servicePeriodEnd = getBillMonth;
          const month = servicePeriodEnd.split("-")[0];
          const year = servicePeriodEnd.split("-")[1];
          const billPeriod = month + "/01/" + year;

          const json = JSON.stringify({
            ConsumerName: getConsumerName,
            AccountNumber: acctNumber,
            ServicePeriodEnd: billPeriod,
          });

          axios({
            method: "POST",
            url: process.env.REACT_APP_API_URL,
            withCredentials: true,
            data: json,
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
              getBotMessage.innerText = "Typing...";
              setTimeout(() => {
                getBotMessage.innerText = `${res.data.msg}`;
              }, 2000);
              inputRef.value = ""; // clean the input
            })
            .catch((err) => {
              getBotMessage.innerText = "Typing...";
              setTimeout(() => {
                getBotMessage.innerText = `To inquire your bill type this following format.\n\nBILL{space}<consumername>{space}<10-digit acctnum>{space}<bill-month>\nEx:\n BILL DOE, JOHN 010101xxxx 01-2023`;
                inputRef.value = ""; // clear the input
              }, 2000);
            });
        }
      } else {
        getBotMessage.innerText = "Typing...";
        setTimeout(() => {
          getBotMessage.innerText = `To inquire your bill type this following format.\n\nBILL{space}<consumername>{space}<10-digit acctnum>{space}<bill-month>\nEx:\n BILL DOE, JOHN 010101xxxx 01-2023`;
          inputRef.value = ""; // clear the input
        }, 2000);
      }
      getHumanMessage.innerText = inputRef.value; // display the message
    } catch (err) {
      getBotMessage.innerText = "Typing...";
      setTimeout(() => {
        getBotMessage.innerText = `To inquire your bill type this following format.\n\nBILL{space}<consumername>{space}<10-digit acctnum>{space}<bill-month>\nEx:\n BILL DOE, JOHN 010101xxxx 01-2023`;
        inputRef.value = ""; // clear the input
      }, 2000);
    }
  };
  return (
    <div className="bg-image2 App" onLoad={checkStatus}>
      <div className="wrapper">
        <div className="content">
          <div className="header">
            <div className="img">
              <img src={image} alt="" />
            </div>
            <div className="right">
              <div className="name">BOHECO II - Bill Inquiries</div>
              <div className="status">Online</div>
            </div>
          </div>
          <div className="main">
            <div className="main_content">
              <div className="messages">
                <div className="bot-message" id="message1" ref={botmessage}>
                  <p>
                    Maayong Adlaw!<br></br>
                    Mga Membro, Konsumedor, Tag-iya sa BOHECO DOS!<br></br>
                    <br></br>
                    Type "BILL HELP" for more information!
                  </p>
                </div>
                <div
                  className="human-message"
                  id="message2"
                  ref={humanMessage}
                ></div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="btm">
              <div className="input">
                <input
                  disabled={isDisable}
                  type="text"
                  id="input"
                  placeholder="Enter your message"
                  ref={input}
                />
              </div>
              <div className="btn">
                <button disabled={isDisable} onClick={handleInput}>
                  <i className="fas fa-paper-plane"></i>Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
