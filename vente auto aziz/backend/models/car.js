const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: 'FCFA' },
    year: { type: Number },
    brand: { type: String },
    model: { type: String },
    mileage: { type: Number },
    location: { type: String },
    images: [String],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);