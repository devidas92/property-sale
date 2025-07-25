export const serializeMongoDoc = (docs) => {
  if (Array.isArray(docs)) {
    return docs.map(serializeSingleDoc);
  }

  if (docs && typeof docs === "object") {
    return serializeSingleDoc(docs);
  }

  return null;
};

// Serialize a single MongoDB document
const serializeSingleDoc = (doc) => {
  const serialized = { ...doc };

  if (doc._id) {
    serialized._id = doc._id.toString();
  }

    if (doc.recipient) {
      serialized.recipient = doc.recipient.toString();
    }

  if (doc.owner) {
    serialized.owner = doc.owner.toString();
  }

  if (isValidDate(doc.createdAt)) {
    serialized.createdAt = doc.createdAt.toISOString();
  }

  if (isValidDate(doc.updatedAt)) {
    serialized.updatedAt = doc.updatedAt.toISOString();
  }

  return serialized;
};

// Helper to check for valid Date object
const isValidDate = (d) => d instanceof Date && !isNaN(d);
