export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFDEE9] text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Multi-Vendor Store</h1>
        <p className="text-lg text-gray-700 mt-4">Find the best products from top-rated vendors at unbeatable prices.</p>
        <button className="mt-6 px-6 py-3 bg-[#FF4500] text-white rounded-lg text-lg hover:bg-[#E63900] transition">Start Shopping</button>
      </div>

      {/* Categories Section */}
<div className="py-10 px-6 cursor-pointer">
  <h2 className="text-2xl font-semibold text-gray-800 text-center">Shop by Categories</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
    
    {/* Home Category */}
    <div className="bg-[#D2E8E3] rounded-lg overflow-hidden shadow hover:shadow-lg">
      <img src="/images/home-category.jpg" alt="Home" className="w-full h-40 object-cover" />
      <h3 className="text-lg font-medium text-[#4f5755] text-center py-3">Home</h3>
    </div>

    {/* Kitchen Category */}
    <div className="bg-[#FFDAB9] rounded-lg overflow-hidden shadow hover:shadow-lg">
      <img src="/images/kitchen-category.jpg" alt="Kitchen" className="w-full h-40 object-cover" />
      <h3 className="text-lg font-medium text-[#4f5755] text-center py-3">Kitchen</h3>
    </div>

    {/* Fashion Category */}
    <div className="bg-[#E6E6FA] rounded-lg overflow-hidden shadow hover:shadow-lg">
      <img src="/images/fashion-category.jpg" alt="Fashion" className="w-full h-40 object-cover" />
      <h3 className="text-lg font-medium text-[#4f5755] text-center py-3">Fashion</h3>
    </div>

    {/* Sports Category */}
    <div className="bg-[#FFDEAD] rounded-lg overflow-hidden shadow hover:shadow-lg">
      <img src="/images/sports-category.jpg" alt="Sports" className="w-full h-40 object-cover" />
      <h3 className="text-lg font-medium text-[#4f5755] text-center py-3">Sports</h3>
    </div>

  </div>
</div>


      {/* Call-to-Action Section */}
      <div className="bg-[#FAF3DD] py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Ready to Discover Amazing Deals?</h2>
        <p className="text-lg text-gray-700 mt-4">Join now and start exploring the best products from top vendors.</p>
        <button className="mt-6 px-6 py-3 bg-[#32CD32] text-white rounded-lg text-lg hover:bg-[#2E8B57] transition">Join Now</button>
      </div>
    </div>
  );
}