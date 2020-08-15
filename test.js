const database = require("./database");
const mongoose = require('mongoose')
const event = require("./models/oc_event");
const data_test = require("./data_test")

describe('Check:UpdateEvent', () => {
    let connection;
  
    beforeAll(async () => {
      connection = await mongoose.connect( "mongodb+srv://new-user34234:qD025C8n9Gh9fB58@cluster0.cy2r8.mongodb.net/smarterodds?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true });
      db = await mongoose.connection;
    });
  
    afterAll(async () => {
      await connection.close();
    });
    
    // it('should update one event name Devergroup1', async () => {

    //   await database.CheckAndUpdateEvent(data_test.Create_event_data)
      
    //   const events = await event.findOne({eventName: "Devergroup1"});
     
    //   expect(events.eventName).toBe("Devergroup1")

    //   expect(events.markets.length).toBe(1) // there is 1 market in markets array

    //   expect(events.markets[0].marketName).toBe("market1")

    //   expect(events.markets[0].runners.length).toBe(1) //there is 1 runner
    
    //   expect(events.markets[0].runners[0].odds.length).toBe(1)
    // })

    it(`should adding new runner2, 
        update runner1 isNonRunner into false
        update runner1.bookmaker1.places 3->4
        adding more bookmaker2 `, async () => {

      await database.CheckAndUpdateEvent(data_test.Update_event_data)
      
      const events = await event.findOne({eventName: "Devergroup1"});
     
      expect(events.markets.length).toBe(2)

      expect(events.markets[0].runners.length).toBe(2) //there is 1 runner
    
      //update runner.isNonRunner true -> false
      expect(events.markets[0].runners[0].isNonRunner).toBe(false)

      //create more runner
      expect(events.markets[0].runners[0].odds.length).toBe(2)

      //create more odds
      expect(events.markets[0].runners[0].odds.length).toBe(2)

      //update 3 -> 5
      expect(events.markets[0].runners[0].odds[0].backPriceFrac).toBe("5")
    
      //update 3 -> 4
      expect(events.markets[0].runners[0].odds[0].places).toBe(4)
  
    })
});

