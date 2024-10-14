import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getMatches, getUserProfile, swipeLeft, swipeRight } from '../controller/match.controller.js';

const router = express.Router()

router.post('/swipe-right/:likedUserId',protectRoute,swipeRight)
router.post('/swipe-left/:dislikeUserId',protectRoute,swipeLeft)

router.get('/',protectRoute,getMatches)
router.get('/user-profiles',protectRoute,getUserProfile)

export default router