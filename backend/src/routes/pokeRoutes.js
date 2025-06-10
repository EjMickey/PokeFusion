const express = require('express');
const pokeController = require('../controllers/pokeController');
const router = express.Router();
const auth = require('../middleware/auth');

router.get("/last-fusion", auth, pokeController.getLastUserFusion);
router.get("/my-fusions", auth, pokeController.getMyFusions);
router.delete("/my-fusions/:id", auth, pokeController.deleteFusion);
router.post("/fuse", auth, pokeController.saveFusion);

module.exports = router;

