import express from 'express';
import User from '../models/User.js';
import Link from '../models/Link.js';

const router = express.Router();

const linkController = {
  // הפניה לקישור המקורי ומעקב אחרי קליק
  redirect: async (req, res) => {
    const { id } = req.params;
    const ipAddress = req.ip;
    
    try {
      const link = await Link.findById(id);
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }
      const targetParamValue = req.query[link.targetParamName] || "";
      link.clicks.push({ ipAddress, targetParamValue });
      await link.save();

      res.redirect(link.originalUrl);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  // קבלת סטטיסטיקות קליקים
  getClickStats: async (req, res) => {
    const { id } = req.params;

    try {
      const link = await Link.findById(id);
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }

      const clickStats = link.clicks.reduce((acc, click) => {
        const target = click.targetParamValue;
        if (!acc[target]) {
          acc[target] = 0;
        }
        acc[target]++;
        return acc;
      }, {});

      res.json({ clickStats });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  // קבלת מידע על הקליקים של קישור עם פילוח לפי מקור הפרסום
  getLinkClicksBySource: async (req, res) => {
    const linkId = req.params.id;

    try {
      const link = await Link.findById(linkId);
      if (!link) throw new Error('Link not found');

      const uniqueTargetValues = [...new Set(link.clicks.map(click => click.targetParamValue))];

      const clicksBySource = uniqueTargetValues.map(value => {
        const clicksWithSameSource = link.clicks.filter(click => click.targetParamValue === value);
        return {
          source: value,
          clicks: clicksWithSameSource.length
        };
      });

      res.json(clicksBySource);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // קבלת כל הלינקים
  getAllLinks: async (req, res) => {
    try {
      const links = await Link.find();
      res.json(links);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // קבלת לינק לפי ID
  getLinkById: async (req, res) => {
    try {
      const link = await Link.findById(req.params.id);
      if (!link) return res.status(404).json({ message: 'Link not found' });
      res.json(link);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // יצירת לינק חדש
  addLink: async (req, res) => {
    try {
      const { userId, originalUrl, clicks, targetParamName, targetValues } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newLink = new Link({
        originalUrl,
        clicks,
        targetParamName,
        targetValues,
        userId
      });

      await newLink.save();

      user.links.push(newLink);
      await user.save();

      res.status(201).json(newLink);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // עדכון לינק קיים
  updateLink: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedLink = await Link.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedLink);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // מחיקת לינק
  deleteLink: async (req, res) => {
    try {
      const link = await Link.findById(req.params.id);
      if (!link) return res.status(404).json({ message: 'Link not found' });

      await link.remove();
      res.json({ message: 'Link deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // קבלת כל הלינקים של משתמש לפי userId
  getUserLinks: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).populate('links');
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json(user.links);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// ניתוב המסלולים ל- Link Controller
router.post('/', linkController.addLink);
router.get('/', linkController.getAllLinks);
router.get('/:id', linkController.getLinkById);
router.put('/:id', linkController.updateLink);
router.delete('/:id', linkController.deleteLink);
router.get('/r/:id', linkController.redirect);
router.get('/:id/stats', linkController.getClickStats);
router.get('/:id/clicks-by-source', linkController.getLinkClicksBySource);
router.get('/user/:userId', linkController.getUserLinks);

export default router;


