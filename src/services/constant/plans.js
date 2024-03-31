const date = new Date();
const eightDaysLater = new Date(date.getTime() + 8 * 24 * 60 * 60 * 1000); // Add 3 days in milliseconds
const nineDaysLater = new Date(date.getTime() + 9 * 24 * 60 * 60 * 1000); // Add 3 days in milliseconds
const tenDaysLater = new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000); // Add 3 days in milliseconds

export const planData = [
  {
    departAt: eightDaysLater, //done
    departure: [106.80992590984253, 10.841327798960252], //done
    destinationId: 1, //done
    maxMember: 10, //done
    maxMemberWeight: 3, //done
    departureAddress: "Đ. D1, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh", //done
    name: "test-plan-", //done
    note: "", //done
    periodCount: 6, //done
    savedProviderIds: [6, 7],
    schedule: [
      //done
      {
        events: [
          {
            type: "CHECKIN",
            duration: "00:30:00",
            isStarred: false,
            description: "Check-in và nhận phòng",
            shortDescription: "Check-in Nhà nghỉ Thiên Định.",
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
            shortDescription: "Đến bìa rừng Trà Sư và di chuyển.",
          },
        ],
      },
      {
        events: [
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
            shortDescription: "Nghỉ ngơi với buổi tối tự túc.",
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
            shortDescription: "Vui chơi tại cầu tre dài nhất Việt Nam.",
          },
          {
            type: "VISIT",
            duration: "00:30:00",
            isStarred: false,
            description: "Tham quan, giải trí",
            shortDescription: "Chụp hình tại Thành phố Bố Câu.",
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
    surcharges: [
      { alreadyDivided: false, gcoinAmount: 10000, note: "Mua bia" },
    ], //done
    tempOrders: [
      //done
      {
        cart: [
          {
            key: 6,
            value: 4,
          },
        ],
        note: null,
        type: "LODGING",
        period: "NOON",
        serveDates: [
          nineDaysLater.toLocaleDateString(),
          tenDaysLater.toLocaleDateString(),
        ],
        providerId: 5,
      },
      // {
      //   cart: [
      //     {
      //       key: 9,
      //       value: 4,
      //     },
      //     {
      //       key: 10,
      //       value: 4,
      //     },
      //     {
      //       key: 11,
      //       value: 2,
      //     },
      //   ],
      //   note: null,
      //   type: "MEAL",
      //   period: "AFTERNOON",
      //   serveDates: [
      //     nineDaysLater.toLocaleDateString(),
      //     tenDaysLater.toLocaleDateString(),
      //   ],
      //   providerId: 9,
      // },
      {
        cart: [
          {
            key: 7,
            value: 5,
          },
        ],
        note: null,
        type: "MEAL",
        period: "NOON",
        serveDates: [
          nineDaysLater.toLocaleDateString(),
          tenDaysLater.toLocaleDateString(),
        ],
        providerId: 8,
      },
      // {
      //   cart: [
      //     {
      //       key: 1,
      //       value: 4,
      //     },
      //   ],
      //   note: null,
      //   type: "MEAL",
      //   period: "NOON",
      //   serveDates: [
      //     nineDaysLater.toLocaleDateString(),
      //     tenDaysLater.toLocaleDateString(),
      //   ],
      //   providerId: 3,
      // },
    ],
    travelDuration: "05:42:10", //done
    sourceId: null, //done
  },
];
