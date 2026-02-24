import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createHearing, fetchCases, fetchJudges } from "../../services/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ScheduleHearing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [judges, setJudges] = useState([]);

  const [formData, setFormData] = useState({
    caseId: "",
    judgeId: "",
    hearingDate: "",
    hearingTime: "",
    courtroom: "",
    status: "Scheduled",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cRes, jRes] = await Promise.all([
        fetchCases(),
        fetchJudges(),
      ]);
      setCases(cRes.data);
      setJudges(jRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cases and judges");
    } finally {
      setDataLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate Date & Time
  const validateDateTime = () => {
    const { hearingDate, hearingTime } = formData;

    if (!hearingDate || !hearingTime) {
      toast.error("Please select date and time");
      return false;
    }

    const selectedDateTime = new Date(
      `${hearingDate}T${hearingTime}:00`
    );

    const now = new Date();

    if (selectedDateTime.getTime() <= now.getTime()) {
      toast.error("Please select a future date and time");
      return false;
    }

    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.caseId) return toast.error("Select a case");
    if (!formData.judgeId) return toast.error("Select a judge");
    if (!formData.courtroom.trim())
      return toast.error("Enter courtroom");

    if (!validateDateTime()) return;

    const hearingDateTime = new Date(
      `${formData.hearingDate}T${formData.hearingTime}:00`
    );

    setLoading(true);

    try {
      await createHearing({
        caseId: formData.caseId,
        judgeId: formData.judgeId,
        hearingDate: hearingDateTime,
        courtroom: formData.courtroom,
        status: formData.status,
      });

      toast.success("Hearing scheduled successfully");
      navigate("/admin/hearings");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to schedule hearing"
      );
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <LoadingSpinner />;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#C5A059] p-8">
      
      {/* Header */}
      <div className="bg-[#2C3E50] text-white py-8 rounded-xl shadow mb-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-[#C5A059] hover:text-white transition-colors mb-4 font-semibold"
          >
            <ArrowLeft size={24} />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-light tracking-tight">
            SCHEDULE HEARING
          </h1>
          <p className="text-[#C5A059] mt-2">
            Schedule a new court hearing
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-[#F8F5F0] border border-[#E8E0D5] p-10 rounded-xl shadow-2xl">

          <form onSubmit={handleSubmit} className="space-y-6">

            <select
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-black"
              required
            >
              <option value="">Select Case</option>
              {cases.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.caseNumber} - {c.title}
                </option>
              ))}
            </select>

            <select
              name="judgeId"
              value={formData.judgeId}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-black"
              required
            >
              <option value="">Select Judge</option>
              {judges.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="hearingDate"
              value={formData.hearingDate}
              onChange={handleChange}
              min={today}
              className="w-full px-4 py-3 border rounded-lg text-black"
              required
            />

            <input
              type="time"
              name="hearingTime"
              value={formData.hearingTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-black"
              required
            />

            <input
              type="text"
              name="courtroom"
              value={formData.courtroom}
              onChange={handleChange}
              placeholder="Courtroom"
              className="w-full px-4 py-3 border rounded-lg text-black"
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-black"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Postponed">Postponed</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#2C3E50]  text-[#C5A059] px-6 py-3 rounded-lg w-full font-semibold hover:bg-[#C5A059] hover:text-[#2C3E50] transition-colors"
            >
              {loading ? "Scheduling..." : "Schedule Hearing"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}