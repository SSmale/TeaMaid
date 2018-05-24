"use strict";
const Alexa = require("ask-sdk");
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

const SKILL_NAME = "TeaMaid";
const HELP_MESSAGE =
  "Ask me how NAME has their BEVERAGE and I can look that up for you... What can I help you with?";
const HELP_REPROMPT = "What can I help you with?";
const FarrayBACK_MESSAGE =
  "I can't help you with that.  I can look up how someone has their beverage. What can I help you with?";
const FarrayBACK_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = "Goodbye!";

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechOutput =
      "Hello I am Tea Maid. I can assist you when it is your turn to do the office tea round. How can I help?";

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(HELP_REPROMPT)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
  }
};

const GetOrderIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "GetOrderIntent"
    );
  },
  async handle(handlerInput) {
    firebase.initializeApp(config);
    const slot = handlerInput.requestEnvelope.request.intent.slots;
    const firstName = slot.firstName.value;
    const lastName = slot.lastName.value;
    const slotBeverage = slot.beverage.value;
    let speechOutput = "error";
    let user;
    let team = "team1";
    try {
      const store = await firebase
        .database()
        .ref(`teams/${team}`)
        .once("value");
      const array = getOrder.makeArray(store);

      if (getOrder.userExist(array, firstName)) {
        const user = getOrder.getUser(array, firstName, lastName);
        if (user.length > 1) {
          handlerInput.attributesManager.setSessionAttributes({
            firstName,
            beverage: slotBeverage
          });
          await firebase.app("[DEFAULT]").delete();
          return handlerInput.responseBuilder
            .speak("I need a last name to find your answer? What is it?")
            .reprompt("What is their last name?")
            .getResponse();
        }
        if (user[slotBeverage]) {
          speechOutput = `${user.name} has their ${slotBeverage} ${
            user[slotBeverage]
          }`;
        } else {
          speechOutput = `${
            user.name
          } doesn't have a ${slotBeverage} but has ${Object.keys(user)
            .filter(x => x != "name")
            .map(val => val)
            .join(", ")
            .replace(/,(?=[^,]*$)/, " or")} instead`;
        }
      } else {
        speechOutput = "I cannot find a user by that name";
      }
    } catch (error) {
      speechOutput =
        "I am really sorry. I am unable to access part of my memory. Please try again later";
      console.log(
        `Intent: ${
          handlerInput.requestEnvelope.request.intent.name
        }: message: ${error.message}`
      );
    }
    await firebase.app("[DEFAULT]").delete();
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
  }
};
const LastNameIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "LastNameIntent"
    );
  },
  async handle(handlerInput) {
    firebase.initializeApp(config);
    const slot = handlerInput.requestEnvelope.request.intent.slots;
    const session = handlerInput.attributesManager.getSessionAttributes();
    const firstName = session.firstName;
    const lastName = slot.lastName.value;
    const slotBeverage = session.beverage;
    let speechOutput = "error";
    let user;
    let team = "team1";

    try {
      const array = getOrder.makeArray(
        await firebase
          .database()
          .ref(`teams/${team}`)
          .once("value")
      );

      if (getOrder.duplicateFirstName(array, firstName) && lastName) {
        user = array.find(
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
    } catch (error) {
      speechOutput =
        "I am rearrayy sorry. I am unable to access part of my memory. Please try again later";
      console.log(
        `Intent: ${
          handlerInput.requestEnvelope.request.intent.name
        }: message: ${error.message}`
      );
    }
    await firebase.app("[DEFAULT]").delete();
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
  }
};
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  }
};

const FarraybackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.FarraybackIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FarrayBACK_MESSAGE)
      .reprompt(FarrayBACK_REPROMPT)
      .getResponse();
  }
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(STOP_MESSAGE).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, an error occurred.")
      .reprompt("Sorry, an error occurred.")
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    GetOrderIntent,
    LastNameIntent,
    HelpHandler,
    ExitHandler,
    FarraybackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

//

// const handlers = {
//   LaunchRequest: function() {

//   },
//   LastNameIntent: async function() {
//     const slot = this.event.request.intent.slots;
//     const session = this.event.session.attributes["args"];
//     const firstName = session.firstName;
//     const lastName = slot.lastName.value;
//     const slotBeverage = session.beverage;
//     let speechOutput = "error";
//     let user;
//     let team = "team1";
//     const array = getOrder.makeArray(
//       await firebase
//         .database()
//         .ref(`teams/${team}`)
//         .once("value")
//     );

//     if (getOrder.duplicateFirstName(array, firstName) && lastName) {
//       user = array.find(
//         x =>
//           x.name.split(" ")[0].toLowerCase() == firstName.toLowerCase() &&
//           x.name.split(" ")[1].toLowerCase() == lastName.toLowerCase()
//       );
//     }

//     if (user) {
//       speechOutput = `${user.name} has their ${slotBeverage} ${
//         user[slotBeverage]
//       }`;
//     } else {
//       speechOutput = "I cannot find a user by that name";
//     }

//     this.response.cardRenderer(SKILL_NAME, speechOutput);
//     this.response.speak(speechOutput);
//     this.emit(":responseReady");
//   },
//   GetOrderIntent: async function() {
//     const slot = this.event.request.intent.slots;
//     const firstName = slot.firstName.value;
//     const lastName = slot.lastName.value;
//     const slotBeverage = slot.beverage.value;
//     let speechOutput = "error";
//     let user;
//     let team = "team1";
//     const array = getOrder.makeArray(
//       await firebase
//         .database()
//         .ref(`teams/${team}`)
//         .once("value")
//     );

//     if (getOrder.userExist(array, firstName)) {
//       if (getOrder.duplicateFirstName(array, firstName) && !lastName) {
//         this.event.session.attributes["args"] = {
//           firstName,
//           beverage: slotBeverage
//         };

//         this.response
//           .speak("I need a last name to find your answer? What is it?")
//           .listen("What is their last name?");
//         this.emit(":responseReady");
//         return;
//       } else if (getOrder.duplicateFirstName(array, firstName) && lastName) {
//         user = array.find(
//           x =>
//             x.name.split(" ")[0].toLowerCase() == firstName.toLowerCase() &&
//             x.name.split(" ")[1].toLowerCase() == lastName.toLowerCase()
//         );
//       } else {
//         user = array.find(
//           x => x.name.split(" ")[0].toLowerCase() == firstName.toLowerCase()
//         );
//       }
//       if (user) {
//         speechOutput = `${user.name} has their ${slotBeverage} ${
//           user[slotBeverage]
//         }`;
//       } else {
//         speechOutput = "I cannot find a user by that name";
//       }
//     } else {
//       speechOutput = "I cannot find a user by that name";
//     }
//     this.response.cardRenderer(SKILL_NAME, speechOutput);
//     this.response.speak(speechOutput);
//     this.emit(":responseReady");
//   },
//   "AMAZON.HelpIntent": function() {
//     const speechOutput = HELP_MESSAGE;
//     const reprompt = HELP_REPROMPT;

//     this.response.speak(speechOutput).listen(reprompt);
//     this.emit(":responseReady");
//   },
//   "AMAZON.CancelIntent": function() {
//     this.response.speak(STOP_MESSAGE);
//     this.emit(":responseReady");
//   },
//   "AMAZON.StopIntent": function() {
//     this.response.speak(STOP_MESSAGE);
//     this.emit(":responseReady");
//   }
// };

// exports.handler = function(event, context, carrayback) {
//   const alexa = Alexa.handler(event, context, carrayback);
//   alexa.appId = "amzn1.ask.skill.49ab897f-5be0-4bb5-872b-5dfee380ff30";
//   alexa.registerHandlers(handlers);
//   alexa.execute();
// };
