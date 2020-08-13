const mongoose = require("mongoose");
const event = require("./models/oc_event");

const _ = require("lodash");

mongoose.set("useFindAndModify", false);

module.exports = {
  connect: function () {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("[Database] Connecting");
        var db = await mongoose.connect(
          "mongodb+srv://new-user34234:qD025C8n9Gh9fB58@cluster0.cy2r8.mongodb.net/smarterodds?retryWrites=true&w=majority",
          { useNewUrlParser: true, useUnifiedTopology: true }
        );
        console.log("[Database] Connected");
        return resolve(db);
      } catch (error) {
        console.log(error);
        return reject();
      }
    });
  },

  disconnect: function (db) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("[Database] Disconnecting");
        await db.disconnect();
        console.log("[Database] Disonnected");
        return resolve();
      } catch (error) {
        console.log(error);
        return reject();
      }
    });
  },

  saveEvent: function (evententry) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("[Database] Saving");
        evententry.save(function (err, evententry) {
          if (err) {
            console.log(err);
            return reject();
          }
          console.log("[Database] Saved");
          return resolve();
        });
      } catch (error) {
        console.log(error);
        return reject();
      }
    });
  },

  findEvent: function (event) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("[Database] Finding");

        event.find({}, function (err, data) {
          if (err) {
            console.log(err);
            return reject();
          }
          console.log("[Database] Found");
          console.log(data);
          return resolve();
        });
      } catch (error) {
        console.log(error);
        return reject();
      }
    });
  },

  //update db
  updateEvent: async function (evententry) {
    try {
      const {
        eventName,
        eventStartTime,
        competition,
        markets,
        sport,
        country,
        __v,
      } = evententry;
      const data = await event.findOne({ eventName, eventStartTime });
      if (data !== null) {
        console.log("update", evententry);
        await event
          .findOneAndUpdate(
            { eventName, eventStartTime },
            {
              competition,
              markets,
              sport,
              country,
              __v,
            },
            { new: true, useFindAndModify: false, upsert: true }
          )
          .catch((err) => console.log(err));
      } else {
        await event.create(evententry);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
