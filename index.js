const Alexa = require("ask-sdk");
const request = require("request-promise");
const config = require("./config");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText =
      "こんにちは、チャットボットです。なにか話しかけてください。";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "HelloWorldIntent"
    );
  },
  async handle(handlerInput) {
    const spokenWords =
      handlerInput.requestEnvelope.request.intent.slots.message.value;
    let speechText = "";
    const repromptText = "どうかしましたか？";

    const options = {
      method: "POST",
      uri: "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk",
      timeout: 3000,
      json: true,
      form: {
        apikey: config.TALK_API_KEY,
        query: spokenWords
      }
    };

    await request(options)
      .then(body => {
        speechText = body.results[0].reply;
      })
      .catch(err => {
        speechText = "すみません。わかりませんでした。";
        console.log(err);
      });

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speechText =
      "私はチャットボットです。あなたの話し相手になりますよ。なにか話しかけてみてください。";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speechText = "またお話ししましょう。";

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    let speechText =
      "ごめんなさい。エラーが発生しました。もう一度話しかけてください。";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
