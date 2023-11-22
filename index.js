const { App } = require("@slack/bolt");
require("dotenv").config();
const mongoose = require("mongoose");
const slackMessage = require("./textModel");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

mongoose
  .connect(
    "mongodb+srv://sachit:Mongo2023%2A@goingmerrycluster.dw6273x.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(async () => {
    console.log("Connected to the Mongo Database");
    //starts the app
    await app.start(process.env.PORT || 3000);

    console.log("Hello Grand Line.. Going Merry is going strong!");
  })
  .catch((error) => {
    console.log(error);
  });

// Listen to the app_home_opened event, and when received, respond with a message including the user being messaged
app.event("app_home_opened", async ({ event, say, client, view }) => {
  console.log("<someone opened the app>");
  say(`Welcome aboard the Going Merry, <@${event.user} !>! `);

  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    await client.views.publish({
      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: "home",
        callback_id: "home_view",

        /* body of the view */
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "HYO! Kore ga kaizoku-ō no norikumiindesu!",
            },
            accessory: {
              type: "image",
              image_url:
                "https://pbs.twimg.com/media/FEaHVlJVkA49U3u?format=jpg&name=large",
              alt_text: "Mugiwara no ichimi",
            },
          },
          {
            type: "image",
            title: {
              type: "plain_text",
              text: "The Going Merry, In all her beauty!",
              emoji: true,
            },
            image_url:
              "https://static.wikia.nocookie.net/onepiece/images/4/41/Going_Merry_Infobox.png/revision/latest?cb=20121214234157",
            alt_text: "going_merry",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Click on this button to meet the captain!",
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Say Hi!",
                emoji: true,
              },
              value: "click_me_123",
              action_id: "button-action",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }

  app.action("button-action", async ({ body, ack, client }) => {
    // Acknowledge the action
    await ack();
    console.log(body);
    try {
      // Call views.update with the built-in client
      await client.views.update({
        // Pass the view_id
        view_id: body.view.id,
        // Pass the current hash to avoid race conditions
        hash: body.view.hash,
        // View payload with updated blocks

        /* body of the view */
        view: {
          type: "home",
          callback_id: "home_view",

          /* body of the view */
          blocks: [
            {
              type: "section",
              text: {
                type: "plain_text",
                text: "MOSHI MOSH! OREWA MONKEY D LUFFY! KAIZOKU OU NI NARU OTOKO DA!!",
                emoji: true,
              },
            },
            {
              type: "image",
              title: {
                type: "plain_text",
                text: "Nika",
                emoji: true,
              },
              image_url:
                "https://www.hindustantimes.com/ht-img/img/2023/08/06/550x309/one_piece_gear_5_1691322181077_1691326098371.jpg",
              alt_text: "luffy",
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
});

// Listen for a slash command invocation
app.command("/ticket", async ({ ack, body, client, logger }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "What do you want?",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Tell us about yourself!",
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click me!",
              },
              action_id: "button_abc",
            },
          },
          {
            type: "input",
            block_id: "input_c",
            label: {
              type: "plain_text",
              text: "What are your hopes and dreams?",
            },
            element: {
              type: "plain_text_input",
              action_id: "dreamy_input",
              multiline: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

// Listen for a button invocation with action_id `button_abc` (assume it's inside of a modal)
app.action("button_abc", async ({ ack, body, client, logger }) => {
  // Acknowledge the button request
  await ack();

  try {
    // Call views.update with the built-in client
    const result = await client.views.update({
      // Pass the view_id
      view_id: body.view.id,
      // Pass the current hash to avoid race conditions
      hash: body.view.hash,
      // View payload with updated blocks
      view: {
        type: "modal",
        // View identifier
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "BOO!",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "BOO!",
            },
          },
          {
            type: "image",
            image_url:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5y9Qprueix2YJaZbkqL6kPhgVn_1Tbf6vsw&usqp=CAU",
            alt_text: "Yay! The modal was updated",
          },
        ],
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

// Find conversation ID using the conversations.list method
async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
    });

    let conversationId;

    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        return conversationId;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Find conversation with a specified channel `name`
const channelId = findConversation("slack-app");
console.log(channelId);

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text,
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

publishMessage(
  "C065B3FLL9G",
  "Welcome aboard the ship of the king of the pirates :tada: !!"
);

app.event("app_mention", async ({ event, say, client, view }) => {
  console.log("app mentioned! yaay");
  try {
    app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: "C065B3FLL9G",
      text: "Hi! How may I help you?",
    });
  } catch (error) {
    console.log(error);
  }
});

const crewMembers = [
  "sanji",
  "zoro",
  "luffy",
  "robin",
  "brook",
  "nami",
  "chopper",
  "franky",
  "jinbei",
];
let crewMemberGreeted = null;

app.message(async ({ message, say }) => {
  // Check if the message is from a user (not a bot)
  if (!message.subtype && message.user) {
    // Log the user's message
    //console.log(`User ${message.user} wrote: ${message.text}`);

    // Reply to the user
    //await say(`You wrote: ${message.text}`);

    // if(message.text.toLowerCase().includes("sanji"))
    // {
    //   await say('Sanji says Hi!!')
    // }
    const ifSaidHi = crewMembers.some((name) => {
      if (message.text.toLowerCase().includes(name)) {
        crewMemberGreeted = name;
        return true; // Stop iterating once a match is found
      }
      return false;
    });

    if (ifSaidHi) {
      await say(`${crewMemberGreeted.toUpperCase()} says Hi!`);
    }
  }
});

//test
// let tesxtMessage = message({
//   message:
//     "this is a test to see if data is stored i am typing so much because i like typing",
// });
// tesxtMessage.save();

app.message(async ({ message, say }) => {
  if (!message.subtype && message.user) {
    if (message.text.toLowerCase().includes("save:")) {
      const savedString = message.text
        .substring(message.text.indexOf("save:") + "save:".length)
        .trim();
      let textMessage = slackMessage({
        message: savedString,
      });
      textMessage.save();
    }
  }
});

app.message(async ({ message, say }) => {
  if (message.text.toLowerCase().includes("show messages")) {
    const messages = await slackMessage.find();
    for (const prevMessage of messages) {
      await say(`${prevMessage.message}`);
    }
  }
});
