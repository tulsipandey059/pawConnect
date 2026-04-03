const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Submit adoption request
// @route   POST /api/adoption-requests
// @access  Private
exports.createRequest = asyncHandler(async (req, res) => {
  const { petId, message, livingSituation, hasOtherPets, hasChildren, experience } = req.body;

  const pet = await Pet.findById(petId);
  if (!pet) {
    return res.status(404).json({ success: false, message: "Pet not found" });
  }

  if (pet.status !== "adoption") {
    return res.status(400).json({ success: false, message: "This pet is not listed for adoption" });
  }

  if (pet.postedBy.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: "You cannot request to adopt your own pet" });
  }

  const request = await AdoptionRequest.create({
    pet: petId,
    requester: req.user._id,
    petOwner: pet.postedBy,
    message,
    livingSituation,
    hasOtherPets,
    hasChildren,
    experience,
  });

  await request.populate([
    { path: "pet", select: "name type breed images" },
    { path: "requester", select: "name email phone" },
  ]);

  res.status(201).json({ success: true, message: "Adoption request submitted", data: request });
});

// @desc    Get requests received (as pet owner)
// @route   GET /api/adoption-requests/received
// @access  Private
exports.getReceivedRequests = asyncHandler(async (req, res) => {
  const requests = await AdoptionRequest.find({ petOwner: req.user._id })
    .populate("pet", "name type breed images")
    .populate("requester", "name email phone city")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: requests.length, data: requests });
});

// @desc    Get requests sent (as requester)
// @route   GET /api/adoption-requests/sent
// @access  Private
exports.getSentRequests = asyncHandler(async (req, res) => {
  const requests = await AdoptionRequest.find({ requester: req.user._id })
    .populate("pet", "name type breed images status")
    .populate("petOwner", "name email phone")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: requests.length, data: requests });
});

// @desc    Get single request
// @route   GET /api/adoption-requests/:id
// @access  Private (owner or requester)
exports.getRequest = asyncHandler(async (req, res) => {
  const request = await AdoptionRequest.findById(req.params.id)
    .populate("pet", "name type breed images description")
    .populate("requester", "name email phone city")
    .populate("petOwner", "name email phone");

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  const isOwner = request.petOwner._id.toString() === req.user._id.toString();
  const isRequester = request.requester._id.toString() === req.user._id.toString();

  if (!isOwner && !isRequester && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  res.json({ success: true, data: request });
});

// @desc    Approve or reject a request (pet owner)
// @route   PATCH /api/adoption-requests/:id/respond
// @access  Private (pet owner only)
exports.respondToRequest = asyncHandler(async (req, res) => {
  const { status, ownerNote } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });
  }

  const request = await AdoptionRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  if (request.petOwner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Only the pet owner can respond to requests" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ success: false, message: "This request has already been responded to" });
  }

  request.status = status;
  if (ownerNote) request.ownerNote = ownerNote;
  await request.save();

  // If approved, mark pet as resolved
  if (status === "approved") {
    await Pet.findByIdAndUpdate(request.pet, { isResolved: true });
  }

  res.json({ success: true, message: `Request ${status}`, data: request });
});

// @desc    Withdraw a request (requester)
// @route   PATCH /api/adoption-requests/:id/withdraw
// @access  Private (requester only)
exports.withdrawRequest = asyncHandler(async (req, res) => {
  const request = await AdoptionRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  if (request.requester.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ success: false, message: "Cannot withdraw a non-pending request" });
  }

  request.status = "withdrawn";
  await request.save();

  res.json({ success: true, message: "Request withdrawn" });
});