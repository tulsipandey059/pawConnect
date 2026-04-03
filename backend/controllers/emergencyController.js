const Emergency = require("../models/Emergency");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all emergency posts
// @route   GET /api/emergencies
// @access  Public
exports.getAllEmergencies = asyncHandler(async (req, res) => {
  const { status, urgency, type, city, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (urgency) filter.urgency = urgency;
  if (type) filter.type = type;
  if (city) filter["location.city"] = new RegExp(city, "i");

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [emergencies, total] = await Promise.all([
    Emergency.find(filter)
      .populate("postedBy", "name phone")
      .populate("helpers", "name")
      .sort({ urgency: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Emergency.countDocuments(filter),
  ]);

  res.json({
    success: true,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: emergencies,
  });
});

// @desc    Get single emergency
// @route   GET /api/emergencies/:id
// @access  Public
exports.getEmergency = asyncHandler(async (req, res) => {
  const emergency = await Emergency.findById(req.params.id)
    .populate("postedBy", "name phone email")
    .populate("helpers", "name phone");

  if (!emergency) {
    return res.status(404).json({ success: false, message: "Emergency post not found" });
  }

  res.json({ success: true, data: emergency });
});

// @desc    Create emergency post
// @route   POST /api/emergencies
// @access  Private
exports.createEmergency = asyncHandler(async (req, res) => {
  req.body.postedBy = req.user._id;
  const emergency = await Emergency.create(req.body);

  res.status(201).json({ success: true, message: "Emergency post created", data: emergency });
});

// @desc    Update emergency post
// @route   PUT /api/emergencies/:id
// @access  Private (owner or admin)
exports.updateEmergency = asyncHandler(async (req, res) => {
  let emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return res.status(404).json({ success: false, message: "Emergency post not found" });
  }

  if (emergency.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  emergency = await Emergency.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: "Emergency post updated", data: emergency });
});

// @desc    Delete emergency post
// @route   DELETE /api/emergencies/:id
// @access  Private (owner or admin)
exports.deleteEmergency = asyncHandler(async (req, res) => {
  const emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return res.status(404).json({ success: false, message: "Emergency post not found" });
  }

  if (emergency.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  await emergency.deleteOne();
  res.json({ success: true, message: "Emergency post deleted" });
});

// @desc    Offer help (add current user as helper)
// @route   PATCH /api/emergencies/:id/help
// @access  Private
exports.offerHelp = asyncHandler(async (req, res) => {
  const emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return res.status(404).json({ success: false, message: "Emergency post not found" });
  }

  const alreadyHelping = emergency.helpers.includes(req.user._id);

  if (alreadyHelping) {
    // Toggle off
    emergency.helpers = emergency.helpers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  } else {
    emergency.helpers.push(req.user._id);
  }

  await emergency.save();

  res.json({
    success: true,
    message: alreadyHelping ? "Removed from helpers" : "Added as helper",
    helpersCount: emergency.helpers.length,
  });
});

// @desc    Update emergency status
// @route   PATCH /api/emergencies/:id/status
// @access  Private (owner or admin)
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return res.status(404).json({ success: false, message: "Emergency post not found" });
  }

  if (emergency.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  emergency.status = status;
  await emergency.save();

  res.json({ success: true, message: `Status updated to ${status}`, data: emergency });
});