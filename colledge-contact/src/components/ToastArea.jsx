// components/ToastArea.jsx
export default function ToastArea({ toasts }) {
  return (
    <div className="flex flex-col gap-3">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-3 rounded-lg shadow ${t.type === "error" ? "bg-red-600 text-white" : "bg-white border"}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
