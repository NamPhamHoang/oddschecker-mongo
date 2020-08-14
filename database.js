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

  // saveEvent: function (evententry) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       console.log("[Database] Saving");
  //       evententry.save(function (err, evententry) {
  //         if (err) {
  //           console.log(err);
  //           return reject();
  //         }
  //         console.log("[Database] Saved");
  //         return resolve();
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       return reject();
  //     }
  //   });
  // },

  // findEvent: function (event) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       console.log("[Database] Finding");

  //       event.find({}, function (err, data) {
  //         if (err) {
  //           console.log(err);
  //           return reject();
  //         }
  //         console.log("[Database] Found");
  //         console.log(data);
  //         return resolve();
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       return reject();
  //     }
  //   });
  // },

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
      } = evententry
      
      const data = await event.findOne({ eventName, eventStartTime })
      if(data !== null) {
        markets.forEach(api => {
          //markets
          data.markets.forEach(data => {
            var dataCompare = {
              marketName: data.marketName,
              marketStartTime: data.marketStartTime
            }
            var apiCompare = {
              marketName: api.marketName,
              marketStartTime: api.marketStartTime
            }
            if(_.isEqual(dataCompare, apiCompare)) {
              //runners
              const aRunners = api.runners;
              const dRunners = data.runners;
            
              for(var i = 0; i< aRunners.length;i++) {
                for(var j = 0;j< dRunners.length;j++) {
                  if(aRunners[i].runnerName = dRunners[j].runnerName) {
                    dRunners.slice(j,1)
                    const apiOdd = aRunners[i].odds
                    const dataOdd = dRunners[j].odds
                  
                    //odds
                    for(var x = 0;x<apiOdd.length;x++) {
                      for(var y = 0;y<dataOdd.length;y++) {
                        if(apiOdd[x].bookmaker === dataOdd[y].bookmaker) {
                          dataOdd.slice(y,1)
                        }
                      }
                    }
                    //update odds arrays
                    if(dataOdd.length > 0){
                      dataOdd.forEach(ele => {
                        apiOdd.push(ele)
                      })
                    }
                  }
                }
              }

              //update runner arrays
              if(aRunners.length > 0)
                aRunners.forEach(data => {
                  aRunners.push(data)
                })
              }
            else {
              //them market vao array
              // console.log("wrong", element)
              // data.markets.push(market)
            }
          }) 
        })
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
      }
     else {
       //tao them 1 data moi
        console.log("create")
        await event.create(evententry);
     }
    } catch (err) {
      console.log(err);
    }
  },

  checkExist: async function (array, param) {
    array.forEach(element => {
      if(element === param)
        return true
    });
    return false
  },
};


