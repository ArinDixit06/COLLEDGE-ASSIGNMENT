import { useEffect, useState } from "react";
import axios from "axios";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

const API = "http://localhost:5000";

export default function App() {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
  try {
    const res = await axios.get(`${API}/api/contacts`);

    // ✅ CORRECT: read the array inside `data`
    setContacts(res.data.data || []);
  } catch (err) {
    console.error("Failed to fetch contacts:", err);
    setContacts([]); // prevent crash
  }
};



  useEffect(() => {
    fetchContacts();
  }, []);

  const addContact = async (data) => {
    await axios.post(`${API}/api/contacts`, data);
    fetchContacts();
  };

  const deleteContact = async (id) => {
    await axios.delete(`${API}/api/contacts/${id}`);
    fetchContacts();
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-semibold tracking-tight">
            Contact Manager
          </h1>
          <p className="text-[#6e6e73]">
            All your connections in one beautiful place.
          </p>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Form */}
          <ContactForm onAdd={addContact} />

          {/* Right: Contacts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <ContactList
                contacts={contacts}
                onDelete={deleteContact}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
