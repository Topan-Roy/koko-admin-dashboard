import { useState } from "react";
import api from "@/Context/api";
import { toast } from "react-toastify";
interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}
interface UpdateFAQProps {
  faqData: FAQ;
  setShowUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}
export default function UpdateFAQ({
  faqData,
  setShowUpdate,
  onSuccess,
}: UpdateFAQProps) {
  const [formData, setFormData] = useState({
    question: faqData.question,
    answer: faqData.answer,
    category: faqData.category,
    order: faqData.order,
    isActive: faqData.isActive,
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/api/faqs/${faqData._id}`, formData);
      toast.success("FAQ updated successfully!");
      setShowUpdate(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Failed to update FAQ", err);
      toast.error(err.response?.data?.message || "Failed to update FAQ");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="z-40 p-6 w-full fixed left-0 top-0 h-[100vh] flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded-[8px] max-w-7xl w-full mx-4 max-h-[100vh] overflow-y-auto">
        <h2 className="font-[600] text-[18px] leading-6 text-[#374151] inter-font mb-4">
          Update FAQ
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-4">
            <div className="w-full">
              <label
                className="font-[500] text-[11.9px] leading-5 inter-font text-[#6B7280]"
                htmlFor="question"
              >
               FAQ Title
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="question"
                placeholder="Enter FAQ question"
                required
              />
            </div>
            <div className="w-full">
              <label
                className="font-[500] text-[11.9px] leading-5 inter-font text-[#6B7280]"
                htmlFor="answer"
              >
               Description
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500 min-h-[120px]"
                id="answer"
                placeholder="Enter FAQ answer"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 my-[17px]">
            <button
              type="button"
              onClick={() => setShowUpdate(false)}
              disabled={loading}
              className="cursor-pointer px-[17px] py-[9px] rounded-[6px] border-[1px] border-[#A43EE7] inter-font font-[400] text-[11.9px] leading-5 text-[#000000] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-[17px] py-[9px] rounded-[6px] inter-font font-[400] text-[11.9px] leading-5 text-[#FFFFFF] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                background: "linear-gradient(to right, #9458E8, #CA00E5)",
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
