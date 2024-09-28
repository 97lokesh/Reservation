import mongoose from "mongoose"
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
    {
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
      
        type: String,
      },
      category: {
        type: String,
        enum: ["Asian", "Chinese", "Japanese", "Western"],
        required: true,
      },
      location: {
        type: String,
        enum: ["North", "South", "East", "West", "Central"],
        required: true,
      },
      timeOpen: {
        type: Number,
        
      },
      timeClose: {
        type: Number,
      },
      daysClose: {
        type: [String], 
        enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        
      },
      address: {
        type: String,
      },
      phone: {
        type: String,
      },
      websiteUrl: {
        type: String,
      },
      maxPax: {
        type: Number,
        required: true,
        min: 1,
      },
      description: {
        type: String,
      },
      
    },
    {
      
      timestamps: true,
    }
  );
  
   export default restaurantSchema