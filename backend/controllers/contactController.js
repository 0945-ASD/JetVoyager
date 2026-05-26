import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit a support contact form message
// @route   POST /api/contact
// @access  Public
export const submitMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
  }

  try {
    const contact = new ContactMessage({
      name,
      email,
      phone,
      message,
    });

    const savedMessage = await contact.save();
    res.status(201).json({ success: true, message: 'Message sent successfully', data: savedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact message status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
export const updateMessageStatus = async (req, res) => {
  const { status } = req.body; // 'reviewed' or 'resolved'

  if (!['pending', 'reviewed', 'resolved'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status update option' });
  }

  try {
    const message = await ContactMessage.findById(req.params.id);

    if (message) {
      message.status = status;
      const updatedMessage = await message.save();
      res.json({ success: true, message: 'Status updated successfully', data: updatedMessage });
    } else {
      res.status(404).json({ success: false, message: 'Support message not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
