const Car = require('../models/car');

// Create car (seller auth required)
exports.createCar = async (req, res) => {
    try {
        const images = (req.files || []).map(f => f.path.replace('\\\\', '/'));
        const car = await Car.create({ ...req.body, images, seller: req.user._id });
        res.status(201).json(car);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Get cars with search & filters & pagination
exports.getCars = async (req, res) => {
    try {
        const { page = 1, limit = 10, q, minPrice, maxPrice, brand, year } = req.query;
        const filter = { isPublished: true };
        if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }, { brand: new RegExp(q, 'i') }];
        if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
        if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
        if (brand) filter.brand = brand;
        if (year) filter.year = Number(year);

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Car.countDocuments(filter);
        const cars = await Car.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

        res.json({ total, page: Number(page), pages: Math.ceil(total / limit), cars });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('seller', 'name email phone');
        if (!car) return res.status(404).json({ message: 'Annonce introuvable' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Annonce introuvable' });
        // only seller or admin
        if (String(car.seller) !== String(req.user._id) && !req.user.isAdmin) return res.status(403).json({ message: 'Non autorisé' });
        const images = (req.files || []).map(f => f.path.replace('\\\\', '/'));
        Object.assign(car, req.body);
        if (images.length) car.images = car.images.concat(images);
        await car.save();
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Annonce introuvable' });
        if (String(car.seller) !== String(req.user._id) && !req.user.isAdmin) return res.status(403).json({ message: 'Non autorisé' });
        await car.remove();
        res.json({ message: 'Annonce supprimée' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};