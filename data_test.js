module.exports = {

    //data test for create event test
    Create_event_data: {
        sport: "horse racing",
        country: "NA",
        competition: "Pontefract",
        eventName: "Devergroup1",
        eventStartTime: "2020-08-14T05:15:00.000+00:00",
        markets: [
            {
                marketId: 3498218202,
                marketName: 'market1',
                eventName: 'Devergroup',
                marketStartTime: "2020-08-14T05:15:00.000Z",
                runners: [
                    {
                        selectionId: 232132311,
                        runnerName: "runner1",
                        isNonRunner: true,
                        odds: [
                            {
                                bookmaker: "bookemaker1",
                                backPriceDec: 5,
                                backPriceFrac: "3",
                                places: 3,
                                placeTerm: "1/5",
                                timeStamp: "2020-08-14T15:11:54.389+00:00"
                            },
                        ]
                    },  
                ]
            },
        ],
    },
    

    Update_event_data: {
        sport: "horse racing",
        country: "NA",
        competition: "Pontefract",
        eventName: "Devergroup1",
        eventStartTime: "2020-08-14T05:15:00.000+00:00",
        markets: [ 
            {
                marketId: 3498218202,
                marketName: 'market1', //changing marketName
                eventName: 'Devergroup',
                marketStartTime: "2020-08-14T05:15:00.000Z",
                runners: [
                    {
                        selectionId: 232132311,
                        runnerName: "runner1", 
                        isNonRunner: false, // update true -> false
                        odds: [
                            {
                                bookmaker: "bookmaker1",
                                backPriceDec: 5,
                                backPriceFrac: "5", //change odds price frac 3 -> 5
                                places: 4, //change odds price frac 3 -> 4
                                placeTerm: "1/5",
                                timeStamp: "2020-08-14T15:11:54.389+00:00"
                            },
                            //adding more odds not included in event name devegroup
                            {
                                bookmaker: "bookmaker2",
                                backPriceDec: 5,
                                backPriceFrac: "3",
                                places: 3,
                                placeTerm: "1/5",
                                timeStamp: "2020-08-14T15:11:54.389+00:00"
                            },
                        ]
                    },
                    {
                        selectionId: 232132311,
                        runnerName: "runner2", //runner not included db
                        isNonRunner: true,
                        odds: [
                            {
                                bookmaker: "bookmaker1",
                                backPriceDec: 5,
                                backPriceFrac: "5", //change odds price frac 3 -> 5
                                places: 3,
                                placeTerm: "1/5",
                                timeStamp: "2020-08-14T15:11:54.389+00:00"
                            },
                            //adding more odds not included in event name devegroup
                            {
                                bookmaker: "bookmaker2",
                                backPriceDec: 5,
                                backPriceFrac: "3",
                                places: 3,
                                placeTerm: "1/5",
                                timeStamp: "2020-08-14T15:11:54.389+00:00"
                            },
                            {
                                bookmaker: "bookmaker3",
                                backPriceDec: 5,
                                backPriceFrac: "3",
                                places: 3,
                                placeTerm: "1/5",
                                timeStamp: "2020-08-14T15:11:54.389+00:00"
                            }
                        ]
                    }
                ]
            },
        ],
    },
}