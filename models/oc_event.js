const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  sport: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  competition: String,
  eventName: {
    type: String,
    required: true,
    createIndexes: true,
  },
  eventStartTime: {
    type: Date,
    required: true,
    createIndexes: true,
  },
  markets: [
    {
      marketName: {
        type: String,
        required: true,
      },
      marketStartTime: {
        type: Date,
        required: true,
      },
      runners: [
        {
          selectionId: {
            type: Number,
            required: true,
          },
          runnerName: {
            type: String,
            required: true,
          },
          isNonRunner: {
            type: Boolean,
            required: true,
          },
          odds: [
            {
              bookmaker: {
                type: String,
                required: true,
              },
              backPriceDec: {
                type: Number,
                required: true,
                min: 1,
                max: 10000,
              },
              backPriceFrac: {
                type: String,
                required: true,
              },
              places: {
                type: Number,
              },
              placeTerms: {
                type: String,
              },
              timeStamp: {
                type: Date,
                required: true,
                default: Date.now,
              },
            },
          ],
        },
      ],
    },
  ],
});
module.exports = mongoose.model("event", eventSchema);
