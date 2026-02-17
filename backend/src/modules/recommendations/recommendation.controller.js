const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const recommendationService = require('./recommendation.service');

const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming req.user is populated by authMiddleware
  const { limit } = req.query; // Optional limit for recommendations

  const recommendations = await recommendationService.getRecommendations(userId, limit);
  successResponse(res, recommendations, 'Recommendations fetched successfully');
});

module.exports = {
  getRecommendations,
};
