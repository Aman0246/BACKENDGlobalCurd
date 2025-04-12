const { SERVER_ERROR, DATA_NULL, SUCCESS } = require("../../utils/constants");
const { resultDb } = require("../../utils/globalFunction");

const createDocument = async (Model, data) => {
    try {
        const doc = new Model(data);
        const saved = await doc.save();
        if (!saved) return resultDb(SERVER_ERROR, DATA_NULL);
        return resultDb(SUCCESS, saved);
    } catch (err) {
        console.log(err)
        return resultDb(SERVER_ERROR, err.message);
    }
};

const getDocumentById = async (Model, id) => {
    try {
        const doc = await Model.findById(id);
        if (!doc) return resultDb(NOT_FOUND, DATA_NULL);
        return resultDb(SUCCESS, doc);
    } catch (err) {
        console.log(err)
        return resultDb(SERVER_ERROR, err.message);
    }
};

const updateDocument = async (Model, _id, data) => {
    try {
        const updated = await Model.findByIdAndUpdate(
            _id,
            { $set: data }, // Explicitly use $set
            { new: true }
        );
        return resultDb(SUCCESS, updated);
    } catch (err) {
        console.log(err)
        console.error("Error in updateDocument:", err);
        return resultDb(SERVER_ERROR, err.message);
    }
};


const deleteDocument = async (Model, id) => {
    try {
        const deleted = await Model.findByIdAndDelete(id);
        return resultDb(SUCCESS, deleted);
    } catch (err) {
        console.log(err)
        return resultDb(SERVER_ERROR, err.message);
    }
};

const softDeleteDocument = async (Model, id) => {
    try {
        const updated = await Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        return resultDb(SUCCESS, updated);
    } catch (err) {
        console.log(err)
        return resultDb(SERVER_ERROR, err.message);
    }
};

const updateFieldById = async (Model, id, fieldName, value) => {
    try {
        const update = {};
        update[fieldName] = value;
        const updated = await Model.findByIdAndUpdate(id, update, { new: true });
        return resultDb(SUCCESS, updated);
    } catch (err) {
        console.log(err)
        return resultDb(SERVER_ERROR, err.message);
    }
};



// Global utility for keyword search
const buildSearchQuery = (keyWord = '', searchFields = []) => {
    if (!keyWord || !Array.isArray(searchFields) || searchFields.length === 0) return null;

    const regex = new RegExp(keyWord, 'i');
    const orConditions = searchFields.map(field => ({
        [field]: { $regex: regex }
    }));

    return { $or: orConditions };
};

const getAllDocuments = async (
    Model,
    options = {
        pageNo: 1,
        size: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        keyWord: '',
        searchFields: [],
        query: {},
        populate: [],
        select: '',
        fromDate: "",
        toDate: ""
    }
) => {
    try {
        const {
            pageNo,
            size,
            sortBy,
            sortOrder,
            keyWord,
            searchFields,
            query,
            populate,
            select,
            fromDate,
            toDate
        } = options;

        const page = parseInt(pageNo) || 1;
        const limit = parseInt(size) || 10;
        const skip = (page - 1) * limit;

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Build query
        let andConditions = [];

        if (query && Object.keys(query).length > 0) {
            andConditions.push(query);
        }

        const keywordQuery = buildSearchQuery(keyWord, searchFields);
        if (keywordQuery) {
            andConditions.push(keywordQuery);
        }

        if (fromDate && fromDate !== "" || toDate && toDate !== "") {
            const dateFilter = {};
            if (fromDate) dateFilter.$gte = new Date(fromDate);
            if (toDate) dateFilter.$lte = new Date(toDate);
            andConditions.push({ createdAt: dateFilter });
        }

        let finalQuery = {};
        if (andConditions.length === 1) {
            finalQuery = andConditions[0];
        } else if (andConditions.length > 1) {
            finalQuery = { $and: andConditions };
        }

        // Query builder
        let queryBuilder = Model.find(finalQuery)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select(select);

        if (Array.isArray(populate)) {
            populate.forEach(pop => {
                if (pop.path) {
                    queryBuilder = queryBuilder.populate(pop);
                }
            });
        }

        const total = await Model.countDocuments(finalQuery);
        const docs = await queryBuilder;

        return resultDb(SUCCESS, {
            total,
            page,
            size: limit,
            data: docs
        });

    } catch (err) {
        console.error("Error in getAllDocuments:", err);
        return resultDb(SERVER_ERROR, err.message);
    }
};






module.exports = {
    createDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    softDeleteDocument,
    updateFieldById,
    getAllDocuments
};
