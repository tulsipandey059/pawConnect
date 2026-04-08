import React, { useState } from "react";
import { checkPetHealth } from "../../services/petHealthService";

const symptomOptions = [
  "itching",
  "skin rash",
  "hair loss",
  "redness",
  "ear scratching",
  "ear discharge",
  "bad smell",
  "head shaking",
  "coughing",
  "fever",
  "nasal discharge",
  "sneezing",
  "wound",
  "swelling",
  "bleeding",
  "limping",
  "eye discharge",
];

export default function AIPetHealthPage() {
  const [petType, setPetType] = useState("dog");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSymptomChange = (symptom) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("petType", petType);
      formData.append("age", age);
      formData.append("symptoms", JSON.stringify(symptoms));
      formData.append("notes", notes);

      if (image) {
        formData.append("image", image);
      }

      const data = await checkPetHealth(formData);
      setResult(data.data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h1 className="mb-2 text-3xl font-bold text-orange-600">
            AI Pet Health Checker
          </h1>
          <p className="mb-6 text-gray-600">
            Upload a pet image and select symptoms to get possible health
            guidance.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold">Pet Type</label>
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">Age</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 2 years"
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Select Symptoms
              </label>
              <div className="grid grid-cols-2 gap-2">
                {symptomOptions.map((symptom) => (
                  <label
                    key={symptom}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-100 px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                    />
                    {symptom}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Upload Pet Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="h-52 w-full rounded-2xl border object-cover"
              />
            )}

            <div>
              <label className="mb-2 block font-semibold">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                placeholder="Write extra details about the pet condition..."
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Analyzing..." : "Check Pet Health"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-orange-600">Result</h2>

          {!result && (
            <p className="text-gray-500">
              Submit the form to see the pet health analysis result.
            </p>
          )}

          {result && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-orange-100 p-4">
                <p className="font-semibold text-gray-700">
                  Possible Condition
                </p>
                <p className="text-lg font-bold text-orange-700">
                  {result.finalSuggestion?.possibleCondition}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Explanation</p>
                <p className="text-gray-600">
                  {result.finalSuggestion?.explanation}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Urgency</p>
                <p
                  className={`font-semibold ${
                    result.finalSuggestion?.urgency === "High"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {result.finalSuggestion?.urgency}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Precautions</p>
                <ul className="ml-5 list-disc text-gray-600">
                  {result.finalSuggestion?.precautions?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Basic Care</p>
                <ul className="ml-5 list-disc text-gray-600">
                  {result.finalSuggestion?.basicCare?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Vet Advice</p>
                <p className="text-gray-600">
                  {result.finalSuggestion?.vetAdvice}
                </p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {result.finalSuggestion?.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
