import { categories } from "../constants/categories";

const Footer = () => {
  const popularSearches = Object.values(categories)
    .flat()
    .slice(0, 15);

  return (
    <>
      <footer className="bg-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Online Shopping */}
            <div>
              <h3 className="font-bold mb-4">
                ONLINE SHOPPING
              </h3>

              <ul className="space-y-2 text-gray-600">
                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/products?category=Men");
                  }}
                >
                  Men
                </li>

                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/products?category=Women");
                  }}
                >
                  Women
                </li>

                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/products?category=Kids");
                  }}
                >
                  Kids
                </li>

                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/products?category=Home");
                  }}
                >
                  Home
                </li>

                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/products?category=Beauty");
                  }}
                >
                  Beauty
                </li>
              </ul>
            </div>

            {/* Customer Policies */}
            <div>
              <h3 className="font-bold mb-4">
                CUSTOMER POLICIES
              </h3>

              <ul className="space-y-2 text-gray-600">
                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/contact");
                  }}
                >
                  Contact Us
                </li>

                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/faq");
                  }}
                >
                  FAQ
                </li>

                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/terms");
                  }}
                >
                  Terms of Use
                </li>

                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate("/privacy-policy");
                  }}
                >
                  Privacy Policy
                </li>
              </ul>
            </div>

            {/* Experience App */}
            <div>
              <h3 className="font-bold mb-4">
                EXPERIENCE MYNTRA APP
              </h3>

              <ul className="space-y-2 text-gray-600">
                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // Redirect to Play Store
                  }}
                >
                  Android App
                </li>

                <li
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // Redirect to App Store
                  }}
                >
                  iOS App
                </li>
              </ul>
            </div>

            {/* Guarantees */}
            <div>
              <h3 className="font-bold mb-4">
                SHOPPING GUARANTEE
              </h3>

              <p className="text-gray-600 mb-2">
                100% Original Products
              </p>

              <p className="text-gray-600">
                Easy Returns & Refunds
              </p>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-12 border-t pt-8">
            <h3 className="font-bold mb-4">
              POPULAR SEARCHES
            </h3>

            <div className="flex flex-wrap gap-y-2 text-gray-600">
              {popularSearches.map((item, index) => (
                <span
                  key={item}
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    // TODO:
                    // navigate to matching category/subcategory
                  }}
                >
                  {item}

                  {index !==
                    popularSearches.length - 1 && (
                    <span className="mx-2 text-gray-400">
                      |
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 border-t pt-6 text-center text-gray-500">
            © 2026 Myntra Clone. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;