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

  // Dữ liệu cho biểu đồ chính
  const chartData = {
    labels: ["11/07", "21/07", "31/07", "10/08"],
    datasets: [
      {
        label: "Danh mục A",
        data: [335, 345, 365, 400],
        borderColor: "#ff7f0e",
        fill: false,
      },
      {
        label: "Danh mục B",
        data: [120, 140, 210, 230.88],
        borderColor: "#1f77b4",
        fill: false,
      },
      {
        label: "Danh mục C",
        data: [110.23, 112.0, 115.0, 119.0],
        borderColor: "#2ca02c",
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
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Thanh Navigation */}
        <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-6">
          <div className="flex space-x-4 items-center">
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
              <BsBarChart  size={24} />
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
        <div className="w-full bg-white p-6 shadow rounded mb-6">
          <Chart chartData={chartData} options={options} />
        </div>

        {/* Bảng */}
        <div className="w-full bg-white p-6 shadow rounded mb-6 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-green-200">
                <th className="py-3 px-6 border-b text-left">Tên danh mục</th>
                <th className="py-3 px-6 border-b text-left">Ngày bắt đầu</th>
                <th className="py-3 px-6 border-b text-left">Ngày kết thúc</th>
                <th className="py-3 px-6 border-b text-left">Tăng/Giảm (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-3 px-6 border-b">{item.name}</td>
                  <td className="py-3 px-6 border-b">{item.start}</td>
                  <td className="py-3 px-6 border-b">{item.end}</td>
                  <td
                    className={`py-3 px-6 border-b ${
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
          <h2 className="font-bold text-lg mb-4 bg-green-200 p-4 rounded-t-lg text-center">
            Thay đổi của giá trị danh mục
          </h2>
          <div className="flex">
            {/* Phần từ lúc bắt đầu danh mục */}
            <div className="w-1/2 p-4">
              <h3 className="font-semibold mb-2">Từ lúc bắt đầu danh mục</h3>
              <Chart
                chartData={chartDataCategoryChange}
                options={optionsCategoryChange}
              />
            </div>

            {/* Phần thời gian */}
            <div className="w-1/2 p-4 border-l border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold mb-2">Thời gian</h3>
                <select className="bg-gray-100 p-1 rounded w-1/3">
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
                  <span className="text-red-500">-2.3%</span>
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
