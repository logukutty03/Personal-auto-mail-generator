import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [designation, setDesignation] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("designation", designation);
    formData.append("hrEmail", hrEmail);
    formData.append("resume", resume);

    try {
      const response = await fetch("/api/sendMail", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: result.message });
        setDesignation("");
        setHrEmail("");
        setResume(null);
      } else {
        setStatus({ type: "error", message: result.error });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg p-4 rounded-4">
            <h1 className="text-center mb-4 text-primary">Job Application</h1>

            <form onSubmit={handleSubmit}>
              {/* Job Title */}
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="designation"
                  placeholder="Job Title / Designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
                <label htmlFor="designation">Job Title / Designation</label>
              </div>

              {/* HR Email */}
              <div className="mb-3 form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="hrEmail"
                  placeholder="HR Email Address"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  required
                />
                <label htmlFor="hrEmail">HR Email Address</label>
              </div>

              {/* Resume Upload */}
              <div className="mb-4">
                <label htmlFor="resume" className="form-label">
                  Upload Resume (PDF)
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="resume"
                  accept=".pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Application"}
              </button>
            </form>

            {/* Status Message */}
            {status && (
              <div
                className={`mt-3 text-center p-3 rounded ${
                  status.type === "success"
                    ? "bg-success bg-opacity-10 text-success border border-success"
                    : "bg-danger bg-opacity-10 text-danger border border-danger"
                }`}
              >
                {status.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional simple fade-in animation */}
      <style jsx>{`
        .card {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
