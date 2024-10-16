import { Ticket } from '../models/Ticket.model.js';
import { sendTicketWithQRCode } from '../utils/mail/emails.js';

// @desc        Create new Ticket
// @route       POST /api/tickets
// @access      Private
export const createTicket = async (req, res) => {
  const { user, exhibit, qrCode } = req.body;

  try {
    if (user._id !== req.userId) {
      throw new Error('You are not allowed to get ticket');
    }

    if (!user || !exhibit || !qrCode) {
      throw new Error('All fields are required');
    }

    const newTicket = new Ticket({
      user: user._id,
      exhibit: exhibit._id,
      qrCode,
    });
    await newTicket.save();
    await sendTicketWithQRCode(
      user.name,
      user.email,
      `${process.env.CLIENT_URL}/exhibits/${exhibit._id}`,
      exhibit.title,
      qrCode
    );

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket: newTicket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get All Tickets
// @route       GET /api/tickets
// @access      Private/Admin
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .sort({
        purchaseDate: -1,
      })
      .populate('user')
      .populate('exhibit')
      .exec();

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get Logged In Users Tickets
// @route       GET /api/tickets/mine
// @access      Private
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.userId })
      .sort({
        purchaseDate: -1,
      })
      .populate('user')
      .populate('exhibit')
      .exec();

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get Single Ticket
// @route       GET /api/tickets/:id
// @access      Private
export const getTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id)
      .populate('user')
      .populate('exhibit')
      .exec();
    if (!ticket) {
      res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Update Ticket
// @route       PUT /api/tickets/:id
// @access      Private/Admin
export const updateTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body);
    if (!updatedTicket) {
      res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ticket updated',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Delete Ticket
// @route       DELETE /api/tickets/:id
// @access      Private
export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    await Ticket.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Ticket deleted',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
