const mongoose = require("mongoose");
const Client = require("../models/Client");
const Service = require("../models/Service");

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePagination = (page, limit) => {
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;
    return { pageNum, limitNum, skip };
};

const fail = (message) => {
    const error = new Error(message);
    error.status = 400;
    throw error;
};

const readPhone = (value, label, required) => {
    const phone = String(value || "").trim();
    if (!phone) {
        if (required) fail(`${label} is required`);
        return "";
    }
    if (!/^[0-9]{10}$/.test(phone)) fail(`${label} must be 10 digits`);
    return phone;
};

const readEmail = (value) => {
    const email = String(value || "").trim().toLowerCase();
    if (!email) return undefined;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Enter a valid email");
    return email;
};

const readText = (value, max, label) => {
    const text = String(value || "").trim();
    if (text.length > max) fail(`${label} cannot be longer than ${max} characters`);
    return text;
};

const readAddress = (value) => {
    const source = value && typeof value === "object" ? value : {};
    const pincode = String(source.pincode || "").trim();
    if (pincode && !/^[0-9]{6}$/.test(pincode)) fail("Pincode must be 6 digits");
    return {
        street: readText(source.street, 200, "Street"),
        city: readText(source.city, 80, "City"),
        state: readText(source.state, 80, "State"),
        pincode,
        landmark: readText(source.landmark, 120, "Landmark"),
    };
};

const readServices = async (value) => {
    if (!Array.isArray(value) || value.length === 0) fail("Select at least one service");
    const ids = [...new Set(value.map((id) => String(id || "").trim()).filter(Boolean))];
    if (!ids.length) fail("Select at least one service");
    if (ids.some((id) => !mongoose.Types.ObjectId.isValid(id))) fail("Invalid service selected");
    const found = await Service.countDocuments({ _id: { $in: ids } });
    if (found !== ids.length) fail("One or more services were not found");
    return ids;
};

const readClient = async (body) => {
    const name = readText(body.name, 120, "Client name");
    if (name.length < 2) fail("Client name must be at least 2 characters");
    return {
        name,
        email: readEmail(body.email),
        phone: readPhone(body.phone, "Phone number", true),
        whatsapp: readPhone(body.whatsapp, "WhatsApp number", false),
        address: readAddress(body.address),
        remark: readText(body.remark, 2000, "Remark"),
        services: await readServices(body.services),
    };
};

const createClient = async (req, res, next) => {
    try {
        const fields = await readClient(req.body);
        const client = await Client.create({ ...fields, createdBy: req.user._id });
        const data = await Client.findById(client._id).populate("services", "name description").lean();
        res.status(201).json({ success: true, data });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A client with this email already exists" });
        }
        if (error.status) {
            return res.status(error.status).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const getClients = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const { pageNum, limitNum, skip } = parsePagination(page, limit);
        const filter = {};

        if (search) {
            const regex = { $regex: escapeRegex(search), $options: "i" };
            filter.$or = [{ name: regex }, { email: regex }, { phone: regex }, { whatsapp: regex }];
        }

        const [total, clients] = await Promise.all([
            Client.countDocuments(filter),
            Client.find(filter)
                .populate("services", "name description")
                .skip(skip)
                .limit(limitNum)
                .sort({ createdAt: -1 })
                .lean(),
        ]);

        res.status(200).json({
            success: true,
            data: clients,
            pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1, limit: limitNum },
        });
    } catch (error) {
        next(error);
    }
};

const getClientById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid client ID format" });
        }
        const client = await Client.findById(req.params.id).populate("services", "name description").lean();
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }
        res.status(200).json({ success: true, data: client });
    } catch (error) {
        next(error);
    }
};

const updateClient = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid client ID format" });
        }
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        const fields = await readClient(req.body);
        client.name = fields.name;
        client.email = fields.email;
        client.phone = fields.phone;
        client.whatsapp = fields.whatsapp;
        client.address = fields.address;
        client.remark = fields.remark;
        client.services = fields.services;
        if (!fields.email) client.email = undefined;
        await client.save();

        const data = await Client.findById(client._id).populate("services", "name description").lean();
        res.status(200).json({ success: true, data });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A client with this email already exists" });
        }
        if (error.status) {
            return res.status(error.status).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const deleteClient = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid client ID format" });
        }
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }
        await client.deleteOne();
        res.status(200).json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
};
