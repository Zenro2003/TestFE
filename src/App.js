import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Chart from "./components/Chart";
import { FaTable } from "react-icons/fa";
import { BsBarChart } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";

const queryClient = new QueryClient();

function App() {
  const [selectedCategory, setSelectedCategory] = useState({
    label: "Tất cả các danh mục",
    value: "Tất cả các danh mục",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [view, setView] = useState("chart"); // chuyển đổi giữa biểu đồ và bảng
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const rowsPerPage = 2; // Số hàng trên mỗi trang

  const categories = [
    { label: "Danh mục A", value: "Danh mục A" },
    { label: "Danh mục B", value: "Danh mục B" },
    { label: "Danh mục C", value: "Danh mục C" },
  ];

  // Mock data cho bảng và biểu đồ
  const data = [
    { name: "Danh mục A", start: 335.0, end: 400.0, change: "+30%" },
    { name: "Danh mục B", start: 120.0, end: 230.88, change: "+10%" },
    { name: "Danh mục C", start: 110.23, end: 119.0, change: "+2%" },
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Dữ liệu được hiển thị trên trang hiện tại
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Dữ liệu cho biểu đồ chính
  const chartData = {
    labels: ["11/07", "21/07", "31/07", "10/08"],
    datasets: [
      {
        label: "Danh mục A",
        data: [335, 345, 365, 400],
        borderColor: "rgb(249 115 22)",
        backgroundColor: "rgb(249 115 22)",
        fill: false,
      },
      {
        label: "Danh mục B",
        data: [120, 140, 210, 230.88],
        borderColor: "rgb(163 230 53)",
        backgroundColor: "rgb(163 230 53)",
        fill: false,
      },
      {
        label: "Danh mục C",
        data: [110.23, 112.0, 115.0, 119.0],
        borderColor: "rgb(250 204 21)",
        backgroundColor: "rgb(250 204 21)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Dữ liệu riêng cho phần "Thay đổi của giá trị danh mục"
  const chartDataCategoryChange = {
    labels: ["Danh mục A", "Danh mục B", "Danh mục C"],
    datasets: [
      {
        label: "Thay đổi (%)",
        data: [5.87, 10.3, -2.3],
        backgroundColor: [
          "rgb(249 115 22)",
          "rgb(163 230 53)",
          "rgb(250 204 21)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsCategoryChange = {
    indexAxis: "y", // Xác định trục y sẽ là trục ngang
    responsive: true,
    plugins: {
      legend: {
        position: "right", // Vị trí của chú thích (legend)
      },
      title: {
        display: true,
        text: "Thay đổi của giá trị danh mục (%)",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + "%"; // Thêm ký hiệu phần trăm cho các nhãn x
          },
        },
      },
    },
  };

  // Hàm để chuyển trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Thanh Navigation */}
        <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-6">
          <div className="flex space-x-4 items-center text-orange-500">
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={categories}
              className="w-60"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.25rem",
                  borderColor: "#f97316",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#f97316" },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#f97316",
                }),
              }}
            />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border rounded px-4 py-2 w-64 text-orange-600 border-orange-500"
              dateFormat="dd/MM/yyyy"
            />
            <button className="ml-2 bg-orange-500 text-white px-6 py-2 rounded shadow hover:bg-orange-600">
              TRA CỨU
            </button>
          </div>
          <div className="flex space-x-4">
            {/* Icons to switch between chart and table view */}
            <button
              className={`p-2 rounded ${
                view === "chart" ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setView("chart")}
            >
              <BsBarChart size={24} />
            </button>
            <button
              className={`p-2 rounded ${
                view === "table" ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setView("table")}
            >
              <FaTable size={24} />
            </button>
          </div>
        </div>

        {/* Biểu đồ */}
        {view === "chart" && (
          <div className="w-full bg-white p-6 shadow rounded mb-6">
            <Chart chartData={chartData} options={options} />
          </div>
        )}

        {/* Bảng thay thế cho biểu đồ - bảng này có phân trang */}
        {view === "table" && (
          <div className="w-full bg-white p-6 shadow rounded mb-6 overflow-x-auto box-border">
            <table className="w-full border-collapse table-fixed border border-green-300">
              <thead>
                <tr className="bg-green-400">
                  <th className="py-3 px-6 border border-green-300  text-center text-white">
                    Ngày
                  </th>
                  <th className="py-3 px-6 border border-green-300 text-center text-white">
                    Danh mục A
                  </th>
                  <th className="py-3 px-6 border border-green-300 text-center text-white">
                    Danh mục B
                  </th>
                  <th className="py-3 px-6 border border-green-300  text-center text-white">
                    Danh mục C
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.labels
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage
                  )
                  .map((label, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-3 px-6 border border-green-300  text-center">
                        {label}
                      </td>
                      <td className="py-3 px-6 border border-green-300 text-center">
                        {chartData.datasets[0].data[index]}
                      </td>
                      <td className="py-3 px-6 border border-green-300 text-center">
                        {chartData.datasets[1].data[index]}
                      </td>
                      <td className="py-3 px-6 border border-green-300 text-center">
                        {chartData.datasets[2].data[index]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-orange-500 text-white rounded mr-2 disabled:bg-gray-300"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Bảng */}
        <div className="w-full bg-white p-6 shadow rounded mb-6 overflow-x-auto box-border">
          <table className="w-full border-collapse table-fixed border border-gray-300">
            <thead>
              <tr className="bg-green-400">
                <th className="py-3 px-6 border border-green-300 text-center text-white">
                  Tên danh mục
                </th>
                <th className="py-3 px-6 border border-green-300 text-center text-white">
                  Ngày bắt đầu
                </th>
                <th className="py-3 px-6 border border-green-300 text-center text-white">
                  Ngày kết thúc
                </th>
                <th className="py-3 px-6 border border-green-300 text-center text-white">
                  Tăng/Giảm (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-3 px-6 border border-green-300 text-center text-orange-500 bg-lime-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-6 border border-green-300 text-center text-orange-500">
                    {item.start}
                  </td>
                  <td className="py-3 px-6 border border-green-300 text-center text-orange-500">
                    {item.end}
                  </td>
                  <td
                    className={`py-3 px-6 border border-green-300 text-center ${
                      item.change.includes("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tóm tắt */}
        <div className="w-full bg-white p-6 shadow rounded">
          <h2 className="font-bold text-lg mb-4 bg-green-400 p-4 rounded-t-lg text-center text-white">
            Thay đổi của giá trị danh mục
          </h2>
          <div className="flex">
            {/* Phần từ lúc bắt đầu danh mục */}
            <div className="w-1/2 p-4">
              <h3 className="font-semibold mb-2 text-2xl">
                Từ lúc bắt đầu danh mục
              </h3>
              <Chart
                chartData={chartDataCategoryChange}
                options={optionsCategoryChange}
              />
            </div>

            {/* Phần thời gian */}
            <div className="w-1/2 p-4 border-l border-green-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold mb-2 text-2xl">Thời gian</h3>
                <select className="bg-gray-100 p-1 rounded w-1/3 text-orange-500">
                  <option>6 Tháng qua</option>
                  <option>1 Năm qua</option>
                  <option>3 Năm qua</option>
                </select>
              </div>
              <ul>
                <li className="flex justify-between mb-6">
                  <span>Danh mục A</span>
                  <span className="text-green-500">+5.87%</span>
                </li>
                <li className="flex justify-between mb-6">
                  <span>Danh mục B</span>
                  <span className="text-green-500">+10.3%</span>
                </li>
                <li className="flex justify-between">
                  <span>Danh mục C</span>
                  <span className="text-green-500">-2.3%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
