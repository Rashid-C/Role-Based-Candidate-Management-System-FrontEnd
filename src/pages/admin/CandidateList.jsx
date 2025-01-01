import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await adminAPI.getAllCandidates();
      setCandidates(response.data.data);
    } catch (error) {
      toast.error("Error fetching candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }

    try {
      await adminAPI.deleteCandidate(id);
      toast.success("Candidate deleted successfully");
      fetchCandidates();
    } catch (error) {
      toast.error("Error deleting candidate");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all candidates in the system
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Profile
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Contact
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Skills
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Documents
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {candidates.map((candidate) => (
              <tr key={candidate._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {candidate.profilePicture ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={candidate.profilePicture}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-500">
                            {candidate.fullName?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {candidate.fullName}
                      </div>
                      <div className="text-gray-500">{candidate.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div>{candidate.mobile}</div>
                  <div className="text-gray-400">{candidate.address}</div>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {candidate.resume && (
                    <a
                      href={candidate.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Resume
                    </a>
                  )}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => handleDelete(candidate._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateList;
