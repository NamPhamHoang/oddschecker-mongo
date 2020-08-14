const mongoose = require("mongoose");
const event = require("./models/oc_event");

const _ = require("lodash");

mongoose.set("useFindAndModify", false);
const test = {
  sport: "horse racing",
  country: "NA",
  competition: "Pontefract",
  eventName: "Pontefract 12:15",
  eventStartTime: "2020-08-14T05:15:00.000+00:00",
  markets: [
    {
      marketId: 3498218202,
      marketName: 'Winner',
      eventName: 'Pontefract 12:15',
      marketStartTime: "2020-08-14T05:15:00.000Z",
      runners: [
        {
        selectionId: 232132311,
          runnerName: "abc",
          isNonRunner: true,
          odds: [{
            bookmaker: "Bet365",
            backPriceDec: 5,
            backPriceFrac : "3",
            places: 3,
            placeTerm: "1/5",
            timeStamp: "2020-08-14T15:11:54.389+00:00"
          }]
        }
      ]
    },
  ],
}





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
      
      //check have event in db
      const data = await event.findOne({ eventName, eventStartTime })

      //if it not have event in db
      if(data !== null) {
        if(data.markets.length <= 0) {
          console.log("Cannot find this markets. Create new markets")
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
          return
        }

        //handle duplicated data
        markets.forEach(api => {
          //markets
          data.markets.forEach(async data => {
            var dataCompare = {
              marketName: data.marketName,
              marketStartTime: data.marketStartTime
            }

            var apiCompare = {
              marketName: api.marketName,
              marketStartTime: api.marketStartTime
            }
            //check markets match or not
            if(_.isEqual(dataCompare, apiCompare)) {
              const aRunners = api.runners;
              const dRunners = data.runners;
              //check runner match or not
              for(var i = 0; i< aRunners.length;i++) {
                for(var j = 0;j< dRunners.length;j++) {
                  if(aRunners[i].runnerName === dRunners[j].runnerName) {
                    const apiOdd = aRunners[i].odds
                    const dataOdd = dRunners[j].odds
                    //check odds match or not
                    for(var x = 0;x<apiOdd.length;x++) {
                      for(var y = 0;y<dataOdd.length;y++) {
                        if(apiOdd[x].bookmaker === dataOdd[y].bookmaker) {
                          dataOdd.splice(y,1)
                        }
                      }
                    }
                    //update odds arrays 
                    if(dataOdd.length > 0){
                      dataOdd.forEach(ele => {
                        apiOdd.push(ele)
                      })
                    }
                    dRunners.splice(j,1)
                  }
                }
              }
              // update runner arrays
              if(dRunners.length > 0)
                dRunners.forEach(data => {
                    aRunners.push(data)
                })
              }
              //update markets
            else {
              markets.push(data)
            }
          }) 
        })

        // update event event
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
       //creat new event
        console.log("create new even")
        await event.create(evententry);
     }
    } catch (err) {
      console.log(err);
    }
  },
};


