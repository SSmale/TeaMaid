"use strict";
const Alexa = require("alexa-sdk");
const firebase = require("firebase");
const getOrder = require("./controllers/getOrder.js");

var config = {
  apiKey: "AIzaSyCl1z0z-NiAkQLH9bbOszSfqn0ZI1zrjlY",
  authDomain: "teamaidskill.firebaseapp.com",
  databaseURL: "https://teamaidskill.firebaseio.com",
  projectId: "teamaidskill",
  storageBucket: "",
  messagingSenderId: "107884088739"
};
firebase.initializeApp(config);

const SKILL_NAME = "TeaMaid";
const HELP_MESSAGE =
  "You can say tell me a space fact, or, you can say exit... What can I help you with?";
const HELP_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = "Goodbye!";

const handlers = {
  LaunchRequest: function() {
    this.response
      .speak(
        "Hello I am Tea Maid. I can assist you when it is your turn to do the office tea round. How can I help?"
      )
      .listen(HELP_REPROMPT);
    this.emit(":responseReady");
  },
  GetOrderIntent: function() {
    const slot = this.event.request.intent.slots;
    const userName = slot.name.value.toLowerCase();
    const slotBeverage = slot.beverage.value;
    let speechOutput = "error";

    let team = "team1";
    firebase
      .database()
      .ref(`teams/${team}`)
      .once("value")
      .then(payload => {
        const all = getOrder.makeArray(payload);

        const user = all.find(x => x.name == userName);
        if (user) {
          speechOutput = `${userName} has their ${slotBeverage} ${
            all.find(x => x.name == userName)[slotBeverage]
          }`;
        } else {
          speechOutput = "I cannot find a user by that name";
        }
        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput);
        this.emit(":responseReady");
      });
  },
  "AMAZON.HelpIntent": function() {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(":responseReady");
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(":responseReady");
  },
  "AMAZON.StopIntent": function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(":responseReady");
  }
};

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
