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
  LastNameIntent: async function() {
    const slot = this.event.request.intent.slots;
    const session = this.event.session.attributes["args"];
    const firstName = session.firstName;
    const lastName = slot.lastName.value;
    const slotBeverage = session.beverage;
    let speechOutput = "error";
    let user;
    let team = "team1";
    const all = getOrder.makeArray(
      await firebase
        .database()
        .ref(`teams/${team}`)
        .once("value")
    );

    if (getOrder.duplicateFirstName(all, firstName) && lastName) {
      user = all.find(
        x =>
          x.name.split(" ")[0].toLowerCase() == firstName.toLowerCase() &&
          x.name.split(" ")[1].toLowerCase() == lastName.toLowerCase()
      );
    }

    if (user) {
      speechOutput = `${user.name} has their ${slotBeverage} ${
        user[slotBeverage]
      }`;
    } else {
      speechOutput = "I cannot find a user by that name";
    }

    this.response.cardRenderer(SKILL_NAME, speechOutput);
    this.response.speak(speechOutput);
    this.emit(":responseReady");
  },
  GetOrderIntent: async function() {
    const slot = this.event.request.intent.slots;
    const firstName = slot.firstName.value;
    const lastName = slot.lastName.value;
    const slotBeverage = slot.beverage.value;
    let speechOutput = "error";
    let user;
    let team = "team1";
    const all = getOrder.makeArray(
      await firebase
        .database()
        .ref(`teams/${team}`)
        .once("value")
    );

    if (getOrder.userExist(all, firstName)) {
      if (getOrder.duplicateFirstName(all, firstName) && !lastName) {
        this.event.session.attributes["args"] = {
          firstName,
          beverage: slotBeverage
        };

        this.response
          .speak("I need a last name to find your answer? What is it?")
          .listen("What is their last name?");
        this.emit(":responseReady");
        return;
      } else if (getOrder.duplicateFirstName(all, firstName) && lastName) {
        user = all.find(
          x =>
            x.name.split(" ")[0].toLowerCase() == firstName.toLowerCase() &&
            x.name.split(" ")[1].toLowerCase() == lastName.toLowerCase()
        );
      } else {
        user = all.find(
          x => x.name.split(" ")[0].toLowerCase() == firstName.toLowerCase()
        );
      }
      if (user) {
        speechOutput = `${user.name} has their ${slotBeverage} ${
          user[slotBeverage]
        }`;
      } else {
        speechOutput = "I cannot find a user by that name";
      }
    } else {
      speechOutput = "I cannot find a user by that name";
    }
    this.response.cardRenderer(SKILL_NAME, speechOutput);
    this.response.speak(speechOutput);
    this.emit(":responseReady");
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
