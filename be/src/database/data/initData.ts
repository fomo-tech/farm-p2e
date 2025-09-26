import { NFTTicketModel } from "../model/Tickets";
import "../index"; // Đảm bảo rằng bạn đã kết nối MongoDB như hướng dẫn trên


const initData = async () => {
  try {
    // Kết nối đến MongoDB

    // Dữ liệu mẫu để chèn vào database
    const tickets = [
      {
        price: 5,
        earningDay: 3,
        sale_price: 0,
        vip: 1,
        order: 4635,
        urlImage: "/uploads/vip0.png",
        name: "Normal Duck",
        description: "A special VIP ticket",
        inventory: 1000,
        incomePerDay: 0.5,
        soldOutAt: new Date("2026-04-04T00:00:00"),
        status: true,
      },
      {
        price: 100,
        earningDay: 7,
        sale_price: 0,
        vip: 2,
        order: 105,
        urlImage: "/uploads/vip1.png",
        name: "Sir Quacks-a-Lot",
        description: "Another special VIP ticket",
        inventory: 1000,
        incomePerDay: 2,
        soldOutAt: new Date("2026-04-02T00:00:00"),
        status: true,
      },
      {
        price: 200,
        earningDay: 10,
        sale_price: 0,
        vip: 3,
        order: 3,
        urlImage: "/uploads/vip2.png",
        name: "Ducky McProfit II",
        description: "A regular VIP ticket",
        inventory: 500,
        incomePerDay: 3,
        soldOutAt: new Date("2026-04-03T00:00:00"),
        status: true,
      },
      {
        price: 500,
        earningDay: 15,
        sale_price: 0,
        vip: 3,
        order: 3,
        urlImage: "/uploads/vip3.png",
        name: "Featherstein the Wise",
        description: "A regular VIP ticket",
        inventory: 500,
        incomePerDay: 5,
        soldOutAt: new Date("2026-04-03T00:00:00"),
        status: true,
      },
      {
        price: 1000,
        earningDay: 20,
        sale_price: 0,
        vip: 4,
        order: 3,
        urlImage: "/uploads/vip4.png",
        name: "Emperor Quackrich IV",
        description: "A regular VIP ticket",
        inventory: 500,
        incomePerDay: 15,
        soldOutAt: new Date("2026-04-03T00:00:00"),
        status: true,
      },
    ];

    // Chèn dữ liệu vào MongoDB
    await NFTTicketModel.insertMany(tickets);

    console.log("Data initialized successfully!");
  } catch (error) {
    console.error("Error initializing data:", error);
  } finally {
    // Đảm bảo đóng kết nối sau khi hoàn thành
    process.exit();
  }
};

// Chạy hàm initData để chèn dữ liệu
initData();
