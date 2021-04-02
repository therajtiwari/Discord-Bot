const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const command = require("./command");

client.on("ready", () => {
  console.log("The client is ready!");

  command(client, ["ping", "test"], (message) => {
    console.log("hello");
    message.channel.send("Pong!");
  });

  command(client, "iserver", (message) => {
    console.log(client.guilds.channels);
    client.guilds.cache.forEach((guild) => {
      message.channel.send(
        `${guild.name} has a total of ${guild.memberCount} members`
      );
    });
  });

  command(client, ["cc", "clearchannel"], (message) => {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results);
      });
    }
  });

  command(client, ["cR", "createRole"], async (message) => {
    // let all = message.split("-");
    // console.log(message);
    // console.log("hello");
    for (let i = 61; i <= 100; i++) {
      let rName = "Team " + i;
      let rNew = await message.guild.roles.create({
        data: {
          name: rName,
          color: "DEFAULT",
        },
      });
      console.log("created role: " + rName);
    }
  });

  command(client, "makechannels", (message) => {
    for (let i = 61; i <= 100; i++) {
      message.guild.channels
        .create("chat", {
          type: "text",
        })
        .then((channel) => {
          let category = message.guild.channels.cache.find(
            (c) => c.name == `Team ${i}` && c.type == "category"
          );

          if (!category) throw new Error("Category channel does not exist");
          channel.setParent(category.id);
        })
        .catch(console.error);

      message.guild.channels
        .create("voice", {
          type: "voice",
        })
        .then((channel) => {
          let category = message.guild.channels.cache.find(
            (c) => c.name == `Team ${i}` && c.type == "category"
          );

          if (!category) throw new Error("Category channel does not exist");
          channel.setParent(category.id);
        })
        .catch(console.error);
    }
  });

  command(client, ["mc", "makecategory"], (message) => {
    const name = message.content.replace("!makecategory ", "");
    for (let i = 61; i <= 100; i++) {
      // console.log(message.guild.roles.cache);

      let participant;
      let bots;
      let everyone;
      let mentor;
      let sponsor;
      let currentTeam;

      message.guild.roles.cache.forEach(
        (role) => {
          if (role.name === "Participant") {
            participant = role.id;
          } else if (role.name === "Bots") {
            bots = role.id;
          } else if (role.name === "Sponsor") {
            sponsor = role.id;
          } else if (role.name === "Mentor") {
            mentor = role.id;
          } else if (role.name === "@everyone") {
            everyone = role.id;
          } else if (role.name === "Team " + i) {
            currentTeam = role.id;
          }
        }
        // console.log(role.name, role.id)
      );
      message.guild.channels.create("Team " + i, {
        type: "category",
        permissionOverwrites: [
          {
            id: currentTeam,
            allow: ["VIEW_CHANNEL"],
          },
          {
            id: everyone,
            // deny: ["VIEW_CHANNEL"],
          },
          {
            id: participant,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: bots,
            // deny: ["VIEW_CHANNEL"],
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: sponsor,
            // deny: ["VIEW_CHANNEL"],
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: mentor,
            deny: ["VIEW_CHANNEL"],
            // deny: ["VIEW_CHANNEL"],
          },
        ],
      });
    }
  });
});

client.login(config.token);
