import { useEffect, useState } from "react";
import axios from "axios";
import ContactForm from "./ContactForm";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    const res = await axios.get(`${API}/api/contacts`);
    setContacts(res.data.data || []);
  };

  const addContact = async (data) => {
    await axios.post(`${API}/api/contacts`, data);
    fetchContacts();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">

        <header className="text-center">
          <h1 className="text-4xl font-semibold">Contact Manager</h1>
          <p className="text-gray-500 mt-2">Connected to live API</p>
        </header>

        <ContactForm onAdd={addContact} />

        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="font-semibold mb-4">
            Contacts ({contacts.length})
          </h2>

          {contacts.map((c) => (
            <div key={c._id} className="py-3 border-b last:border-none">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">
                {c.email} · {c.phone}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
