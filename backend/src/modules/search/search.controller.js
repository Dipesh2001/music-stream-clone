const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const searchService = require('./search.service');

const search = asyncHandler(async (req, res) => {
  const { q, limit } = req.query;

  if (!q || q.trim() === '') {
    return successResponse(res, { artists: [], albums: [], tracks: [] }, 'Search query is empty');
  }

  const results = await searchService.globalSearch(q, { limit });
  successResponse(res, results, 'Search results fetched successfully');
});

module.exports = {
  search,
};
