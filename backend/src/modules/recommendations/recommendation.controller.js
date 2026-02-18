const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const recommendationService = require('./recommendation.service');

const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming req.user is populated by authMiddleware
  const { page, limit } = req.query; // Optional limit and page for recommendations

  const recommendations = await recommendationService.getRecommendations(userId, {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });
  successResponse(res, recommendations, 'Recommendations fetched successfully');
});

module.exports = {
  getRecommendations,
};
