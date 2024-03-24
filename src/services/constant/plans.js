export const planData = [
  {
    departAt: "2024-04-01 08:43:00+00",
    departure: [106.80992590984253, 10.841327798960252],
    destinationId: 1,
    gcoinBudgetPerCapita: 1000000,
    maxMember: 10,
    maxMemberWeight: 1,
    departureAddress: "Đ. D1, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh",
    name: "test-plan-",
    note: "",
    periodCount: 4,
    savedContacts: [
      {
        name: "Cứu hộ Phường Nhà Bàng",
        type: "RESCUE",
        phone: "+842963875087",
        address:
          "Đường Hải Thượng Lãn Ông, khóm Sơn Đông, P.Nhà Bàng. Tx.Tịnh Biên, T.An Giang",
        imageUrl: null,
      },
      {
        name: "Trạm xá Phường Nhà Bàng",
        type: "MEDICAL",
        phone: "+842963875087",
        address:
          "Đường Hải Thượng Lãn Ông, khóm Sơn Đông, P.Nhà Bàng. Tx.Tịnh Biên, T.An Giang",
        imageUrl: null,
      },
      {
        name: "Tổng đài cứu hộ khẩn cấp khóm Sơn Đông",
        type: "RESCUE",
        phone: "+842963875087",
        address:
          "Đường Hải Thượng Lãn Ông, khóm Sơn Đông, P.Nhà Bàng. Tx.Tịnh Biên, T.An Giang",
        imageUrl: null,
      },
    ],
    schedule: [
      {
        events: [
          {
            type: "CHECKIN",
            duration: "00:30:00",
            isStarred: false,
            description: "Check-in và nhận phòng",
            shortDescription:
              "Check-in Nhà nghỉ Thiên Định.",
          },
          {
            type: "EAT",
            duration: "01:00:00",
            isStarred: true,
            description: "Dùng bữa tại nhà hàng",
            shortDescription: "Dùng bữa tại nhà hàng 3*.",
          },
          {
            type: "VISIT",
            duration: "01:00:00",
            isStarred: false,
            description: "Tham quan, giải trí",
            shortDescription:
              "Đến bìa rừng Trà Sư và di chuyển.",
          },
          {
            type: "VISIT",
            duration: "00:30:00",
            isStarred: false,
            description: "Ngắm cảnh",
            shortDescription: "Đến vọng Lâm Đài, ngắm toàn cảnh rừng.",
          },
          {
            type: "EAT",
            duration: "00:30:00",
            isStarred: true,
            description: "Dùng bữa tại nhà hàng",
            shortDescription: "Dùng bữa tại nhà hàng 3*",
          },
          {
            type: "FREE",
            duration: "00:15:00",
            isStarred: false,
            description: "Nghỉ ngơi",
            shortDescription:
              "Nghỉ ngơi với buổi tối tự túc.",
          },
        ],
      },
      {
        events: [
          {
            type: "EAT",
            duration: "01:00:00",
            isStarred: true,
            description: "Tập trung và dùng bữa tại nhà hàng",
            shortDescription: "Dùng bữa sáng tại nhà hàng.",
          },
          {
            type: "VISIT",
            duration: "02:00:00",
            isStarred: false,
            description: "Tham quan và giải trí",
            shortDescription:
              "Vui chơi tại cầu tre dài nhất Việt Nam.",
          },
          {
            type: "VISIT",
            duration: "00:30:00",
            isStarred: false,
            description: "Tham quan, giải trí",
            shortDescription:
              "Chụp hình tại Thành phố Bố Câu.",
          },
          {
            type: "EAT",
            duration: "01:00:00",
            isStarred: true,
            description: "Dùng bữa tại nhà hàng",
            shortDescription: "Dùng bữa trưa tại nhà hàng 3*",
          },
          {
            type: "CHECKOUT",
            duration: "00:30:00",
            isStarred: false,
            description: "Check-out và đi về",
            shortDescription: "Trả phòng và kết thúc chuyến đi.",
          },
        ],
      },
    ],
    surcharges: [{ note: "Phụ phí­ test", gcoinAmount: 10000 }],
    tempOrders: [
      {
        cart: [
          {
            "key": 4,
            "value": 5
          }
        ],
        note: null,
        type: "LODGING",
        period: "NOON",
        serveDates: ["2024-03-28", "2024-03-29"],
        supplierId: 2,
      },
      {
        cart: [{
          "key": 1,
          "value": 1
        }, {
          "key": 2,
          "value": 1
        }, {
          "key": 5,
          "value": 1
        }],
        note: null,
        type: "MEAL",
        period: "AFTERNOON",
        serveDates: ["2024-03-28", "2024-03-29"],
        supplierId: 3,
      },
      {
        cart: [{
          "key": 3,
          "value": 1
        }, {
          "key": 7,
          "value": 1
        }, {
          "key": 8,
          "value": 1
        }],
        note: null,
        type: "MEAL",
        period: "NOON",
        serveDates: ["2024-03-28", "2024-03-29"],
        supplierId: 4,
      },
    ],
    travelDuration: "05:42:10",
  },
];
