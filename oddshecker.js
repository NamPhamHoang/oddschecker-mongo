var puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const validate = require("./validate");
const event = require("./models/oc_event");
const database = require("./database");


oc_getdata('https://www.oddschecker.com/horse-racing/newbury/13:50/winner');

async function oc_getdata(url) {
    const defaultViewport = {
        width: 1440,
        height: 1080,
    };

    var browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1200 });
    await page.setUserAgent(getUserAgent());
    await page.goto(url);

    const markets = await page.evaluate(() => {
        try {
        var markets = [];
        var market = {};
        market.meta = {};
        const eventTable =
            "div#main-content #table #betting-odds div#table-tabs div#oddsTableContainer table.eventTable";

        //race info will be returned if its a horse race
        $(
            "div#main-content #table #betting-odds div.page-description ul.race-headline-info li"
        ).each(function () {
            switch ($(this).find(".title").text()) {
            case "Starters:":
                market.meta.runners = $(this).find(".info").text().trim();
                break;
            case "Distance:":
                market.meta.distance = $(this).find(".info").text().trim();
                break;
            case "Class:":
                market.meta.raceclass = $(this).find(".info").text().trim();
                break;
            case "Age:":
                market.meta.age = $(this).find(".info").text().trim();
                break;
            case "Prize:":
                market.meta.prize = $(this).find(".info").text().trim();
                break;
            case "Going:":
                market.meta.going = $(this).find(".info").text().trim();
                break;
            default:
                //this logs to browser console not the server console.
                console.log(
                "Unrecognised race info: " +
                    $(this).find(".title").text() +
                    " | " +
                    $(this).find(".info").text()
                );
            }
        });

        market.marketId = $(eventTable).attr("data-mid");
        market.marketName = $(eventTable).attr("data-mname");
        market.eventName = $(eventTable).attr("data-sname");
        market.marketStartTime = $(eventTable).attr("data-time");
        market.competition = $(eventTable).attr("data-ename");
        market.emap = $(eventTable).attr("data-emap");
        market.isInPlay = $(eventTable).attr("data-in-play");
        market.sport = $(eventTable).attr("data-cgname");

        market.marketOddsData = [];
        $(eventTable + " tbody tr").each(function () {
            var bet = {};
            bet.selectionId = $(this).attr("data-bid");
            bet.runnerName = $(this).attr("data-bname");
            bet.isNonRunner = $(this).hasClass("nonRunner");
            bet.bestOddsDec = $(this).attr("data-best-dig");
            bet.bestOddsBookmakers = $(this).attr("data-best-bks");
            bet.oddsData = [];

            $(this)
            .find("td[data-bk]")
            .each(function () {
                var bkoddsdata = {};
                bkoddsdata.bookmaker = $(this).attr("data-bk");
                bkoddsdata.oddsDec = $(this).attr("data-odig");
                bkoddsdata.oddsFrac = $(this).attr("data-o");
                bkoddsdata.oddsDec2 = $(this).attr("data-fodds");
                bkoddsdata.places = $(
                eventTable + ` #etfEW td[data-bk="${$(this).attr("data-bk")}"]`
                ).attr("data-ew-places");
                bkoddsdata.placeTerms = $(
                eventTable + ` #etfEW td[data-bk="${$(this).attr("data-bk")}"]`
                ).attr("data-ew-div");
                bet.oddsData.push(bkoddsdata);
            });
            market.marketOddsData.push(bet);
        });
        markets.push(market);
        return markets;
        } catch (err) {
        return err.toString();
        }
    });

    await browser.close();

    
    var sanatizedMarkets = validateAndSanatizeMarkets(markets);

    console.log(sanatizedMarkets);

    if (sanatizedMarkets.length == 0) return [];

    const db = await database.connect();

    var parsedMarket = parseMarket(sanatizedMarkets[0]);
    await database.CheckAndUpdateEvent(new event(parsedMarket));
    // sanatizedMarkets.forEach(sanatizedMarket => {
    //   sanatizedMarket = parseMarket(sanatizedMarket);
    //   await saveEvent(new event(sanatizedMarket));
    // });

    await database.disconnect(db);

    //console.log(parsedMarket);
    return parsedMarket;
}

function getUserAgent() {
  return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";
}

//
function parseMarket(market) {
  var event = {
    sport: market.sport,
    country: "NA",
    competition: market.competition,
    eventName: market.eventName,
    eventStartTime: market.marketStartTime,
    markets: [
      {
        marketName: market.marketName,
        marketStartTime: market.marketStartTime,
        runners: market.marketOddsData.map(function (runner) {
          return {
            selectionId: runner.selectionId,
            runnerName: runner.runnerName,
            isNonRunner: runner.isNonRunner,
            odds: runner.oddsData.map(function (odds) {
              return {
                bookmaker: odds.bookmaker,
                backPriceDec: odds.oddsDec,
                backPriceFrac: odds.oddsFrac,
                places: odds.places,
                placeTerms: odds.placeTerms,
                timeStamp: Date.now(),
              };
            }),
          };
        }),
      },
    ],
  };
  return event;
}

function validateAndSanatizeMarkets(markets) {
  var sanatizedMarkets = [];

  markets.forEach(function (market, marketIndex) {
    var marketObj = {};
    var isValidMarket = true;

    var marketId = validate.validateAndSanatizeMarketId(market.marketId);
    if (marketId === false) {
      isValidMarket = false;
    } else {
      marketObj.marketId = marketId;
    }

    var marketName = validate.validateAndSanatizeMarketName(market.marketName);
    if (marketName === false) {
      isValidMarket = false;
    } else {
      marketObj.marketName = marketName;
    }

    var eventName = validate.validateAndSanatizeEventName(market.eventName);
    if (eventName === false) {
      isValidMarket = false;
    } else {
      marketObj.eventName = eventName;
    }

    var marketStartTime = validate.validateAndSanatizeMarketStartTime(
      market.marketStartTime
    );
    if (marketStartTime === false) {
      isValidMarket = false;
    } else {
      marketObj.marketStartTime = marketStartTime;
    }

    var competition = validate.validateAndSanatizeCompetition(
      market.competition
    );
    if (competition === false) {
      isValidMarket = false;
    } else {
      marketObj.competition = competition;
    }

    var emap = validate.validateAndSanatizeEMap(market.emap);
    if (emap === false) {
      isValidMarket = false;
    } else {
      marketObj.emap = emap;
    }

    var isInPlay = validate.validateAndSanatizeIsInPlay(market.isInPlay);
    if (isInPlay === false) {
      isValidMarket = false;
    } else {
      marketObj.isInPlay = isInPlay;
    }

    var sport = validate.validateAndSanatizeSport(market.sport);
    if (sport === false) {
      isValidMarket = false;
    } else {
      marketObj.sport = sport;
    }

    marketObj.meta = {};

    if (Object.keys(market.meta).length !== 0) {
      var runners = validate.validateAndSanatizeMetaRunners(
        market.meta.runners
      );
      if (runners === false) {
        isValidMarket = false;
      } else {
        marketObj.meta.runners = runners;
      }

      var distance = validate.validateAndSanatizeMetaDistance(
        market.meta.distance
      );
      if (distance === false) {
        isValidMarket = false;
      } else {
        marketObj.meta.distance = distance;
      }

      var raceclass = validate.validateAndSanatizeMetaRaceClass(
        market.meta.raceclass
      );
      if (raceclass === false) {
        isValidMarket = false;
      } else {
        marketObj.meta.raceclass = raceclass;
      }

      var age = validate.validateAndSanatizeMetaAge(market.meta.age);
      if (age === false) {
        isValidMarket = false;
      } else {
        marketObj.meta.age = age;
      }

      var prize = validate.validateAndSanatizeMetaPrize(market.meta.prize);
      if (prize === false) {
        isValidMarket = false;
      } else {
        marketObj.meta.prize = prize;
      }

      var going = validate.validateAndSanatizeMetaGoing(market.meta.going);
      if (going === false) {
        isValidMarket = false;
      } else {
        marketObj.meta.going = going;
      }
    }

    marketObj.marketOddsData = [];

    market.marketOddsData.forEach((runner) => {
      var selectionObj = {};

      var selectionId = validate.validateAndSanatizeSelectionId(
        runner.selectionId
      );
      if (selectionId === false) {
        isValidMarket = false;
      } else {
        selectionObj.selectionId = selectionId;
      }

      var runnerName = validate.validateAndSanatizeRunnerName(
        runner.runnerName
      );
      if (runnerName === false) {
        isValidMarket = false;
      } else {
        selectionObj.runnerName = runnerName;
      }

      selectionObj.isNonRunner = runner.isNonRunner;

      var bestOddsDec = validate.validateAndSanatizeOddsDec(runner.bestOddsDec);
      if (bestOddsDec === false) {
        isValidMarket = false;
      } else {
        selectionObj.bestOddsDec = bestOddsDec;
      }

      selectionObj.oddsData = [];

      runner.oddsData.forEach(function (odds, index) {
        var oddsObj = {};
        var isValidOdds = true;

        var bookmaker = validate.validateAndSanatizeBookmaker(odds.bookmaker);
        if (bookmaker === false) {
          isValidOdds = false;
        } else {
          oddsObj.bookmaker = bookmaker;
        }

        var oddsDec = validate.validateAndSanatizeOddsDec(odds.oddsDec);
        if (oddsDec === false) {
          isValidOdds = false;
        } else {
          oddsObj.oddsDec = oddsDec;
        }

        var oddsFrac = validate.validateAndSanatizeOddsFrac(odds.oddsFrac);
        if (oddsFrac === false) {
          isValidOdds = false;
        } else {
          oddsObj.oddsFrac = oddsFrac;
        }

        var places = validate.validateAndSanatizePlaces(odds.places);
        if (places === false) {
          isValidOdds = false;
        } else {
          oddsObj.places = places;
        }

        var placeTerms = validate.validateAndSanatizePlaceTerms(
          odds.placeTerms
        );
        if (placeTerms === false) {
          isValidOdds = false;
        } else {
          oddsObj.placeTerms = placeTerms;
        }

        if (isValidOdds) selectionObj.oddsData.push(oddsObj);
      });

      marketObj.marketOddsData.push(selectionObj);
    });

    if (isValidMarket) sanatizedMarkets.push(marketObj);
  });

  return sanatizedMarkets;
}
