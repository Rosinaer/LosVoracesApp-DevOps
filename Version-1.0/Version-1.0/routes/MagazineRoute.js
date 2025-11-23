const express = require('express');
const router = express.Router();

const MagazineController = require('../controller/MagazineController');


router.get('/catalog', MagazineController.renderCatalog);

router.get('/', MagazineController.getMagazines);
router.post('/', MagazineController.createMagazine);
router.put('/:id', MagazineController.updateMagazine);
router.delete('/:id', MagazineController.deleteMagazine);

module.exports = router;