// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Contact from "./models/Contact.js";
import { createObjectCsvStringifier } from "csv-writer";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// GET: list with search/sort/pagination
// Query: ?search=&sort=createdAt_desc&page=1&limit=10
app.get("/api/contacts", async (req, res, next) => {
  try {
    const { search = "", sort = "createdAt_desc", page = 1, limit = 10 } = req.query;
    const q = search.trim();
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
            { message: { $regex: q, $options: "i" } },
            { tags: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [field, dir] = sort.split("_");
    const sortObj = { [field || "createdAt"]: dir === "asc" ? 1 : -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limNum = Math.max(1, parseInt(limit));

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort(sortObj)
      .skip((pageNum - 1) * limNum)
      .limit(limNum)
      .lean();

    res.json({ data: contacts, meta: { total, page: pageNum, limit: limNum } });
  } catch (err) {
    next(err);
  }
});

// GET: single contact
app.get("/api/contacts/:id", async (req, res, next) => {
  try {
    const c = await Contact.findById(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    res.json(c);
  } catch (err) {
    next(err);
  }
});

// POST: create
app.post("/api/contacts", async (req, res, next) => {
  try {
    const { name, email, phone, message = "", tags = [] } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "Name, email and phone are required" });

    const newContact = await Contact.create({ name, email, phone, message, tags });
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
});

// PUT: update
app.put("/api/contacts/:id", async (req, res, next) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE: single
app.delete("/api/contacts/:id", async (req, res, next) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

// POST: bulk delete
app.post("/api/contacts/bulk-delete", async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "No ids provided" });
    const result = await Contact.deleteMany({ _id: { $in: ids } });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
});

// PATCH: toggle favorite
app.patch("/api/contacts/:id/favorite", async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: "Not found" });
    contact.favorite = !contact.favorite;
    await contact.save();
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

// GET: export CSV
app.get("/api/contacts-export", async (req, res, next) => {
  try {
    const contacts = await Contact.find().lean();
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "phone", title: "Phone" },
        { id: "message", title: "Message" },
        { id: "tags", title: "Tags" },
        { id: "favorite", title: "Favorite" },
        { id: "createdAt", title: "CreatedAt" },
      ],
    });

    const records = contacts.map((c) => ({
      ...c,
      tags: Array.isArray(c.tags) ? c.tags.join("|") : c.tags,
      favorite: c.favorite ? "yes" : "no",
      createdAt: c.createdAt ? c.createdAt.toISOString() : "",
    }));

    res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records));
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ error: err.message || "Server error" });
});

// DB + start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
