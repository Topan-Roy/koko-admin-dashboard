// export default function Pagination() {
//   return (
//     <>
//         <div className='p-6 border-t-[1px] border-[#E5E7EB] flex items-center justify-between'>
//            <p className='font-[400] text-[11.9px] leading-[20px] text-[#9458E8] inter-font'>Showing 7 of 200  users</p>
//             <div className='flex items-center justify-center gap-2'>
//                 <button className='border-[1px] border-[#A43EE7] cursor-pointer rounded-[6px] px-4 py-1 text-[#727273]'>Previous</button>
//                 <button className='font-[400] text-[11.9px] leading-[20px] inter-font rounded-[6px] w-[34px] h-[33px] text-white' style={{background: "linear-gradient(to right, #9458E8, #CA00E5)"}} >1</button>
//                 <button className='border-[1px] border-[#A43EE7] cursor-pointer rounded-[6px] px-4 py-1 text-[#727273]'>Next</button>
//             </div>
//         </div>
    
//     </>
//   )
// }
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  return (
    <div className='p-6 border-t-[1px] border-[#E5E7EB] flex items-center justify-between'>
      <p className='font-[400] text-[11.9px] leading-[20px] text-[#9458E8] inter-font'>
        Showing {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </p>
      <div className='flex items-center justify-center gap-2'>
        <button
          className='border-[1px] border-[#A43EE7] cursor-pointer rounded-[6px] px-4 py-1 text-[#727273]'
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`font-[400] text-[11.9px] leading-[20px] inter-font rounded-[6px] w-[34px] h-[33px] ${
              currentPage === page
                ? "text-white"
                : "text-[#727273] border-[1px] border-[#A43EE7]"
            }`}
            style={currentPage === page ? { background: "linear-gradient(to right, #9458E8, #CA00E5)" } : {}}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className='border-[1px] border-[#A43EE7] cursor-pointer rounded-[6px] px-4 py-1 text-[#727273]'
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
