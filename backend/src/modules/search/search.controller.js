const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const searchService = require('./search.service');

const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  let { limit } = req.query;

  // Parse and validate limit
  limit = parseInt(limit, 10);
  if (isNaN(limit) || limit <= 0) {
    limit = 10; // Default limit
  } else if (limit > 50) {
    limit = 50; // Maximum limit to prevent abuse
  }

  if (!q || q.trim() === '') {
    return successResponse(res, { artists: [], albums: [], tracks: [] }, 'Search query is empty');
  }

  const results = await searchService.globalSearch(q, { limit });
  successResponse(res, results, 'Search results fetched successfully');
});

module.exports = {
  search,
};
