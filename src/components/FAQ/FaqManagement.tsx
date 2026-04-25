import { useState, useEffect } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";

import Search from "../svgs/Search";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Pagination from "../ui/Pagination";
import AddFAQ from "./data/components/AddFAQ";
import EditIcon from "../svgs/EditIcon";
import DeleteIcon from "../svgs/DeleteIcon";
import UpdateFAQ from "./data/components/UpdateFAQ";
import api from "@/Context/api";
import { toast } from "react-toastify";
interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export default function FaqManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  useEffect(() => {
    fetchFAQs();
  }, []);
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqs(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, faqs]);
  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/faqs/admin/all");
      const sortedFaqs = res.data.data.faqs.sort(
        (a: FAQ, b: FAQ) => a.order - b.order
      );
      setFaqs(sortedFaqs);
      setFilteredFaqs(sortedFaqs);
    } catch (err) {
      console.error("Failed to fetch FAQs", err);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/faqs/${id}`);
      setFaqs((prev) => prev.filter((faq) => faq._id !== id));
      toast.success("FAQ deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete FAQ");
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <section className="flex items-start justify-center bg-[#F9F9F9] relative min-h-screen">
      <SideBar />
      <div className="w-full pb-[24px] relative">
        <AdminHeader />
        <div className="px-[24px] my-[24px]">
          <h2 className="font-[700] text-[20.4px] leading-[32px] inter-font">
            FAQ Management
          </h2>
        </div>
        {/* <div className="px-6">
          <DemoDataBanner />
        </div> */}
        <div className="mt-6 px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[#1F2937] text-[17px] leading-[28px] font-[600]">
              Frequently Asked Questions
            </h1>
            <div
              onClick={() => setShowAddFAQ(true)}
              className="flex items-center justify-center py-[8px] px-[16px] gap-2 cursor-pointer rounded-[6px] hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(to right, #9458E8, #CA00E5)",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.677 8.5H13.0103"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.34375 3.83331V13.1666"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <button className="text-[11.9px] leading-[20px] font-[400] text-[#FFFFFF] cursor-pointer">
                Add FAQ
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 px-6 py-6">
          <div className="flex items-center justify-center gap-[8px] bg-white border-[1px] border-[#E5E7EB] rounded-[6px] shadow py-[9px] pl-[41px] w-full">
            <Search />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              name="search"
              id="search"
              className="w-full font-[400] text-[16px] leading-[24px] border-none outline-none"
              placeholder="Search FAQs"
            />
          </div>
        </div>

        {showAddFAQ && (
          <AddFAQ setShowAddFAQ={setShowAddFAQ} onSuccess={fetchFAQs} />
        )}
        <div className="mt-6 px-6">
          <div className="bg-white p-6 rounded-[8px] border-[1px] border-[#E5E7EB]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? "No FAQs found matching your search"
                    : "No FAQs found"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowAddFAQ(true)}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Add your first FAQ
                  </button>
                )}
              </div>
            ) : (
              <>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full no-underline"
                >
                  {currentFaqs.map((faq) => (
                    <AccordionItem
                      key={faq._id}
                      value={faq._id}
                      className="outline-none border-b-[1px] border-[#E5E7EB] no-underline py-4"
                    >
                      <AccordionTrigger className="no-underline font-[500] text-[13.6px] leading-5 inter-font text-[#111827] cursor-pointer hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="no-underline">
                        <p className="text-gray-600 text-sm leading-relaxed mt-2 mb-4">
                          {faq.answer}
                        </p>
                        <div className="flex items-center justify-end gap-4 pr-8">
                          <div
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                              e.preventDefault();
                              setShowUpdate(true);
                              setSelectedFAQ(faq);
                            }}
                            className="cursor-pointer hover:opacity-70"
                          >
                            <EditIcon />
                          </div>
                          <div
                            onClick={() => handleDelete(faq._id)}
                            className="cursor-pointer hover:opacity-70"
                          >
                            <DeleteIcon />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-4">
                  <Pagination
                    totalItems={filteredFaqs.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {showUpdate && selectedFAQ && (
          <UpdateFAQ
            faqData={selectedFAQ}
            setShowUpdate={setShowUpdate}
            onSuccess={fetchFAQs}
          />
        )}
      </div>
    </section>
  );
}
