const Fusion = require('../models/Fusion');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../models/User');

exports.getLastUserFusion = async (req, res) => {
  try {
    const lastFusion = await Fusion.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const user = await User.findById(req.user._id);
    if (!lastFusion) return res.status(404).send({ message: 'Brak fuzji dla tego użytkownika.' });
    if (user.premium_account) {
      return res.send({ message: 'premium account', premium: true, date: new Date().toISOString() });
    }
    else
      res.send({ date: lastFusion.createdAt });
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Błąd serwera.' });
  }
};

exports.saveFusion = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.premium_account) {
      const lastFusion = await Fusion.findOne({ user: req.user._id }).sort({ createdAt: -1 });

      if (lastFusion) {
        const cooldownSeconds = 60;
        const now = new Date();
        const diff = (now - new Date(lastFusion.createdAt)) / 1000;

        if (diff < cooldownSeconds) {
          return res.status(429).send({ message: `Musisz poczekać ${Math.ceil(cooldownSeconds - diff)} sekund.` });
        }
      }
    }

    const fusion = new Fusion({
      pokemon1: req.body.pokemon1,
      pokemon2: req.body.pokemon2,
      user: req.user._id
    });

    await fusion.save();
    res.send({ message: 'Fuzja zapisana.', date: fusion.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Błąd zapisu fuzji.' });
  }
};

exports.getMyFusions = async (req, res) => {
  try {
    const fusions = await Fusion.find({ user: req.user._id });

    if (fusions.length > 0) {
      res.status(200).send({fusions});
    } else {
      res.status(404).send({ message: 'You have no fusions!' });
    }
  } catch (err) {
    console.error('Failed to fetch your fusions:', err);
    res.status(500).send({ message: 'Failed to fetch your fusions' });
  }
};

exports.deleteFusion = async (req, res) => {
  try {
    const fusion = await Fusion.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!fusion) {
      return res.status(404).send({ message: 'Fuzja nie znaleziona lub brak dostępu.' });
    }
    res.status(200).send({ message: 'Usunięto fuzję.' });
  } catch (err) {
    console.error('Failed to delete fusion:', err);
    res.status(500).send({ message: 'Błąd serwera podczas usuwania fuzji.' });
  }
};

