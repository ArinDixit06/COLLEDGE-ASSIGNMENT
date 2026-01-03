export default function ContactCard({ contact, onDelete }) {
  return (
    <li className="group px-4 py-4 flex items-start justify-between hover:bg-[#f5f5f7] rounded-xl transition">
      <div>
        <p className="font-medium">{contact.name}</p>
        <p className="text-sm text-[#6e6e73]">
          {contact.email} · {contact.phone}
        </p>
        {contact.message && (
          <p className="text-sm text-[#6e6e73] italic mt-1">
            “{contact.message}”
          </p>
        )}
      </div>

      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-sm text-red-600 hover:underline transition"
      >
        Delete
      </button>
    </li>
  );
}
