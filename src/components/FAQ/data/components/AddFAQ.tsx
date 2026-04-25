import React, { useState } from "react";
import api from "@/Context/api";
import { toast } from "react-toastify";

export default function AddFAQ({
  setShowAddFAQ,
  onSuccess,
}: {
  setShowAddFAQ: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => Promise<void>; 
}) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/faqs", formData);
      toast.success("FAQ created successfully");
      await onSuccess(); // এই line যোগ করুন - list refresh করবে
      setShowAddFAQ(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 px-6">
      <div className="bg-white rounded-[8px] p-6">
        <hr className="h-[1px] bg-[#E5E7EB] text-[#E5E7EB]" />
        <p className="font-[500] text-[13.6px] leading-6 text-[#374151] inter-font my-[17px]">
          Add FAQ
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-start gap-4 flex-col">
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font text-[#6B7280]">
                FAQ Title
              </label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none"
                placeholder="Write the title of the FAQ"
              />
            </div>
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font text-[#6B7280]">
                Description
              </label>
              <textarea
                required
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none"
                placeholder="Write the description"
              />
            </div>
          </div>
          <br />
          <hr className="h-[1px] bg-[#E5E7EB] text-[#E5E7EB]" />
          <div className="flex items-center justify-end gap-4 my-[17px]">
            <button
              type="button"
              onClick={() => setShowAddFAQ(false)}
              disabled={loading}
              className="cursor-pointer px-[17px] py-[9px] rounded-[6px] border-[1px] border-[#A43EE7] inter-font font-[400] text-[11.9px] leading-5 text-[#000000]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-[17px] py-[9px] rounded-[6px] inter-font font-[400] text-[11.9px] leading-5 text-[#FFFFFF]"
              style={{
                background: "linear-gradient(to right, #9458E8, #CA00E5)",
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}