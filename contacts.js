const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require('crypto');

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

const writeContacts = async (contacts) => {
  return await fs.writeFile(
    contactsPath,
    JSON.stringify(contacts, undefined, 2)
  );
};

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((book) => book.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return undefined;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function addContact(data) {
  const contacts = await listContacts();

  const newContact = {
    id: randomUUID(),
   ...data
  };

  contacts.push(newContact);

  await writeContacts(contacts);
  return newContact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
}