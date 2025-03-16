import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl: { 
        type: String, 
        required: true 
    },
    shortUrl: { 
        type: String, 
        unique: true, 
        required: true 
    },
    clicks: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Ensure unique index on shortUrl
urlSchema.index({ shortUrl: 1 }, { unique: true });

const Url = mongoose.model("Url", urlSchema);
export default Url;