import { Exhibit } from '../models/Exhibit.model.js';

// @desc        Create Exhibit
// @route       POST /api/exhibits
// @access      Private/Admin
export const createExhibit = async (req, res) => {
  const {
    title,
    startDate,
    endDate,
    description,
    artist,
    thumbnail,
    paintings,
    category,
  } = req.body;

  try {
    if (
      !title ||
      !startDate ||
      !endDate ||
      !artist ||
      !thumbnail ||
      !category
    ) {
      throw new Error('All fields are required');
    }

    const newExhibit = new Exhibit({
      title,
      startDate,
      endDate,
      description,
      artist,
      thumbnail,
      paintings,
      category,
    });
    await newExhibit.save();

    res.status(201).json({
      success: true,
      message: 'Exhibit created successfully',
      exhibit: newExhibit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get Active Exhibits (end date has not passed)
// @route       GET /api/exhibits
// @access      Public
export const getActiveExhibits = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit || 10);
    const sortDirection = req.query.order === 'desc' ? -1 : 1;

    const exhibits = await Exhibit.find({
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { description: { $regex: req.query.searchTerm, $options: 'i' } },
          { artist: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
      endDate: { $gte: new Date() },
    })
      .sort({ startDate: sortDirection, endDate: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate('category')
      .exec();

    const totalExhibits = await Exhibit.countDocuments();

    const totalFilteredExhibits = await Exhibit.countDocuments({
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { destination: { $regex: req.query.searchTerm, $options: 'i' } },
          { artist: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
      endDate: { $gte: new Date() },
    });

    res.status(200).json({
      success: true,
      exhibits,
      total: totalExhibits,
      filtred: totalFilteredExhibits,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get Archived Exhibits (end date has passed)
// @route       GET /api/exhibits/archive
// @access      Public
export const getArchivedExhibits = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit || 10);
    const sortDirection = req.query.order === 'desc' ? -1 : 1;

    const exhibits = await Exhibit.find({
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { description: { $regex: req.query.searchTerm, $options: 'i' } },
          { artist: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
      endDate: { $lte: new Date() },
    })
      .sort({ startDate: sortDirection, endDate: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate('category')
      .exec();

    res.status(200).json({
      success: true,
      exhibits,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get Single Exhibit
// @route       GET /api/exhibits/:id
// @access      Public
export const getExhibit = async (req, res) => {
  const { id } = req.params;

  try {
    const exhibit = await Exhibit.findById(id).populate('category').exec();
    if (!exhibit) {
      res.status(404).json({
        success: false,
        message: 'Exhibit not found',
      });
    }

    return res.status(200).json({
      success: true,
      exhibit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Update Exhibit
// @route       PUT /api/exhibits/:id
// @access      Private/Admin
export const updateExhibit = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedExhibit = await Exhibit.findByIdAndUpdate(id, req.body);
    if (!updatedExhibit) {
      res.status(404).json({
        success: false,
        message: 'Exhibit not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Exhibit updated',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Delete Exhibit
// @route       DELETE /api/exhibits/:id
// @access      Private/Admin
export const deleteExhibit = async (req, res) => {
  const { id } = req.params;

  try {
    await Exhibit.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Exhibit deleted',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
