import {Schema, model} from 'mongoose';

const tweetSchema = new Schema({

   content: {
      type: String,
      required: true
   },
   
   video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true
   },
   
   owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
   },
   
}, {timestamps: true});


tweetSchema.plugin(mongooseAggregatePaginate);

export const Tweet = model("Tweet", tweetSchema);