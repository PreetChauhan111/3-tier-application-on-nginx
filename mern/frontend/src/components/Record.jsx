import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;

      setIsNew(false);

      try {
        const response = await fetch(`/api/record/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const record = await response.json();
        if (!record) {
          console.warn(`Record with id ${id} not found`);
          navigate("/");
          return;
        }

        setForm(record);
      } catch (error) {
        console.error("Failed to fetch record:", error);
      }
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };

    try {
      const response = await fetch(
        isNew ? "/api/record" : `/api/record/${params.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/");
    } catch (error) {
      console.error("A problem occurred adding or updating a record:", error);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        Create/Update Employee Record
      </h3>

      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-slate-900">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                className="mt-2 block w-full rounded-md border px-2 py-1"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-slate-900">
                Position
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => updateForm({ position: e.target.value })}
                className="mt-2 block w-full rounded-md border px-2 py-1"
              />
            </div>

            <fieldset className="mt-4">
              <legend className="sr-only">Level</legend>
              <div className="flex space-x-6">
                {["Intern", "Junior", "Senior"].map((level) => (
                  <label key={level} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={level}
                      checked={form.level === level}
                      onChange={(e) =>
                        updateForm({ level: e.target.value })
                      }
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 rounded-md border px-4 py-2 hover:bg-slate-100"
        >
          Save Employee Record
        </button>
      </form>
    </>
  );
}