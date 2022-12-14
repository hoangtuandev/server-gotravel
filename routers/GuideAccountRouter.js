import express from 'express';
import {
    createAccountGuide,
    getActiveGuideAccount,
    getAllGuideAccount,
    handleLogin,
    lockProfile,
    updateProfileGuideOfAccount,
    getLockedGuideAccount,
    activeProfile,
    searchingGuide,
    countAmountGuide,
    sortAccountGuideByAverageStar,
} from '../controllers/GuideAccountCtrl.js';

const router = express.Router();

router.get('/', getAllGuideAccount);

router.post('/login', handleLogin);

router.post('/', createAccountGuide);

router.get('/getActiveGuideAccount', getActiveGuideAccount);

router.get('/getLockedGuideAccount', getLockedGuideAccount);

router.post('/lockProfile', lockProfile);

router.post('/activeProfile', activeProfile);

router.post('/updateProfileGuideOfAccount', updateProfileGuideOfAccount);

router.post('/searchingGuide', searchingGuide);

router.get('/countAmountGuide', countAmountGuide);

router.post('/sortAccountGuideByAverageStar', sortAccountGuideByAverageStar);

export default router;
