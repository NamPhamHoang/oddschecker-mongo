
const moment = require("moment");
const validBookmakers = require('./config/bookmakers').bookmakers;

module.exports = {
  isWithinRange: function (value, min, max) {
    if (!(value >= min && value <= max)) {
      console.log(`[Validator] ${parseFloat(value).toFixed(2)} is not within ${min} and ${max}`);
      return false;
    } else {
      return true;
    }
  },
  //MarketId must be an integer
  validateAndSanatizeMarketId: function (marketId) {
    var result = (marketId !== undefined
      && marketId !== null
      && marketId !== false
      && Number(marketId) !== NaN
      && Number.isInteger(Number(marketId)) === true);
    if (!result) {
      console.log(`[Validator] Invalid marketId: ${marketId}`);
      return false;
    }
    return Number(marketId);
  },
  validateAndSanatizeMarketName: function (marketName) {
    var result = isString(marketName);
    if (!result) {
      console.log(`[Validator] Invalid marketName: ${marketName}`);
      return false;
    }
    return marketName;
  },
  validateAndSanatizeEventName: function (eventName) {
    var result = isString(eventName);
    if (!result) {
      console.log(`[Validator] Invalid eventName: ${eventName}`);
      return false;
    }
    return eventName;
  },
  validateAndSanatizeMarketStartTime: function (marketStartTime) {
    var result = moment(marketStartTime).valueOf();
    if (result === null || result === NaN) {
      console.log(`[Validator] Invalid marketStartTime: ${marketStartTime}`);
      return false;
    }
    return new Date(moment(marketStartTime).valueOf());
  },
  validateAndSanatizeCompetition: function (competition) {
    var result = isString(competition);
    if (!result) {
      console.log(`[Validator] Invalid competition: ${competition}`);
      return false;
    }
    return competition;
  },
  validateAndSanatizeEMap: function (eMap) {
    var result = isString(eMap);
    if (!result) {
      console.log(`[Validator] Invalid eMap: ${eMap}`);
      return false;
    }
    return eMap;
  },
  validateAndSanatizeIsInPlay: function (isInPlay) {
    var result = isString(isInPlay);
    if (!result) {
      console.log(`[Validator] Invalid isInPlay: ${isInPlay}`);
      return false;
    }
    return isInPlay;
  },
  validateAndSanatizeSport: function (sport) {
    var result = isString(sport);
    if (!result) {
      console.log(`[Validator] Invalid sport: ${sport}`);
      return false;
    }
    return sport;
  },

  validateAndSanatizeMetaRunners: function (runners) {
    var result = (runners !== undefined
      && runners !== null
      && runners !== false
      && Number(runners) !== NaN
      && Number.isInteger(Number(runners)) === true
      && Number(runners) >= 2
      && Number(runners) <= 1000);
    if (!result) {
      console.log(`[Validator] Invalid runners: ${runners}`);
      return false;
    }
    return Number(runners);
  },
  validateAndSanatizeMetaDistance: function (distance) {
    var result = isString(distance);
    if (!result) {
      console.log(`[Validator] Invalid distance: ${distance}`);
      return false;
    }
    return distance;
  },
  validateAndSanatizeMetaRaceClass: function (raceclass) {
    var result = isString(raceclass);
    if (!result) {
      console.log(`[Validator] Invalid raceclass: ${raceclass}`);
      return false;
    }
    return raceclass;
  },
  validateAndSanatizeMetaAge: function (age) {
    //this could be undefined
    if (age === undefined) return null;
    var result = isString(age);
    if (!result) {
      console.log(`[Validator] Invalid age: ${age}`);
      return false;
    }
    return age;
  },
  validateAndSanatizeMetaPrize: function (prize) {
    var result = isString(prize);
    if (!result) {
      console.log(`[Validator] Invalid prize: ${prize}`);
      return false;
    }
    return prize;
  },
  validateAndSanatizeMetaGoing: function (going) {
    //this could be undefined
    if (going === undefined) return null;
    var result = isString(going);
    if (!result) {
      console.log(`[Validator] Invalid going: ${going}`);
      return false;
    }
    return going;
  },

  validateAndSanatizeSelectionId: function (selectionId) {
    var result = (selectionId !== undefined
      && selectionId !== null
      && selectionId !== false
      && Number(selectionId) !== NaN
      && Number.isInteger(Number(selectionId)) === true);
    if (!result) {
      console.log(`[Validator] Invalid selectionId: ${selectionId}`);
      return false;
    }
    return Number(selectionId);
  },
  validateAndSanatizeRunnerName: function (runnerName) {
    var result = isString(runnerName);
    if (!result) {
      console.log(`[Validator] Invalid runnerName: ${runnerName}`);
      return false;
    }
    return runnerName;
  },
  validateAndSanatizeOddsDec: function (oddsDec) {
    var result = (oddsDec !== undefined
      && oddsDec !== null
      && oddsDec >= 1
      && oddsDec < 10000);
    if (!result) {
      console.log(`[Validator] Invalid oddsDec: ${oddsDec}`);
      return false;
    }
    return oddsDec;
  },
  validateAndSanatizeOddsFrac: function (oddsFrac) {
    var result = isString(oddsFrac);
    if (!result) {
      console.log(`[Validator] Invalid oddsFrac: ${oddsFrac}`);
      return false;
    }
    return oddsFrac;
  },
  validateAndSanatizeBookmaker: function (bookmaker) {
    var result = (bookmaker !== undefined
      && bookmaker !== null
      && Object.values(validBookmakers).indexOf(bookmaker) >= 0);
    if (!result) {
      console.log(`[Validator] Unsupported bookmaker: ${bookmaker}`);
      return false;
    }
    return Object.keys(validBookmakers).find(key => validBookmakers[key] === bookmaker);
  },
  validateAndSanatizePlaces: function (places) {
    var result = (places !== undefined
      && places !== null
      && places !== false
      && Number(places) !== NaN
      && Number.isInteger(Number(places)) === true);
    if (!result) {
      console.log(`[Validator] Invalid places: ${places}`);
      return false;
    }
    return Number(places);
  },
  validateAndSanatizePlaceTerms: function (placeTerms) {
    var result = isString(placeTerms);
    if (!result) {
      console.log(`[Validator] Invalid placeTerms: ${placeTerms}`);
      return false;
    }
    return placeTerms;
  },




  isValidBetDateTime: function (dateTime) {
    if (dateTime === undefined || dateTime === null) {
      console.log('[Validator] Invalid date: ' + dateTime);
      return false;
    } else {
      if ((dateTime * 1000) < Date.now()) {
        console.log('[Validator] Invalid date - in the past: ' + dateTime);
        return false; // Not valid.
      } else if ((dateTime * 1000) < Date.now() + (10 * 60 * 1000)) {
        console.log('[Validator] Invalid date - starts in the next 10 mins: ' + dateTime);
        return false;
      } else {
        return true;
      }
    }
  },
}

function isString(str) {
  return (str !== undefined
    && str !== null
    && str !== ""
    && typeof str === "string");
}