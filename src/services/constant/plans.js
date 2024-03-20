export const plan = [
  {
    departAt: "2024-03-27 15:55:46.056501+00",
    departure: "0101000020E61000003BBD7BD3D5B35A40F97F6B84C2AE2540",
    destinationId: 1,
    gcoinBudgetPerCapita: 700000,
    memberLimit: 1,
    name: "test-plan-1",
    note: "",
    periodCount: 4,
    savedContacts: [
      {
        Name: "Cứu hộ Phường Nhà Bàng",
        Type: 0,
        Phone: "+842963875087",
        Address:
          "Đường Hải Thượng Lãn Ông, khóm Sơn Đông, P.Nhà Bàng. Tx.Tịnh Biên, T.An Giang",
        ImageUrl: null,
      },
      {
        Name: "Trạm xá Phường Nhà Bàng",
        Type: 1,
        Phone: "+842963875087",
        Address:
          "Đường Hải Thượng Lãn Ông, khóm Sơn Đông, P.Nhà Bàng. Tx.Tịnh Biên, T.An Giang",
        ImageUrl: null,
      },
      {
        Name: "Tổng đài cứu hộ khẩn cấp khóm Sơn Đông",
        Type: 0,
        Phone: "+842963875087",
        Address:
          "Đường Hải Thượng Lãn Ông, khóm Sơn Đông, P.Nhà Bàng. Tx.Tịnh Biên, T.An Giang",
        ImageUrl: null,
      },
    ],
    schedule: [
      {
        Events: [
          {
            Type: 3,
            Duration: "00:30:00",
            IsStarred: false,
            Description: "Check-in và nhận phòng",
            ShortDescription:
              "Mọi người cùng đến nơi check-in và nhận phòng tại Nhà nghỉ Thiên Định.",
          },
          {
            Type: 2,
            Duration: "01:00:00",
            IsStarred: true,
            Description: "Dùng bữa tại nhà hàng",
            ShortDescription: "Cùng nhau dùng bữa tại nhà hàng 3*.",
          },
          {
            Type: 5,
            Duration: "01:00:00",
            IsStarred: false,
            Description: "Tham quan, giải trí",
            ShortDescription:
              "Đến bìa rừng Trà Sư và di chuyển bằng 'tắc rang' xuyên rừng.",
          },
          {
            Type: 5,
            Duration: "00:30:00",
            IsStarred: false,
            Description: "Ngắm cảnh",
            ShortDescription: "Đến vọng Lâm Đài, ngắm toàn cảnh rừng.",
          },
          {
            Type: 2,
            Duration: "00:30:00",
            IsStarred: true,
            Description: "Dùng bữa tại nhà hàng",
            ShortDescription: "Cùng nhau dùng bữa tại nhà hàng 3*",
          },
          {
            Type: 0,
            Duration: "00:15:00",
            IsStarred: false,
            Description: "Nghỉ ngơi",
            ShortDescription:
              "Quay về nhà nghỉ và nghỉ ngơi với buổi tối tự túc.",
          },
        ],
      },
      {
        Events: [
          {
            Type: 0,
            Duration: "01:00:00",
            IsStarred: true,
            Description: "Tập trung và dùng bữa tại nhà hàng",
            ShortDescription: "Tập trung và dùng bữa sáng tại nhà hàng.",
          },
          {
            Type: 5,
            Duration: "02:00:00",
            IsStarred: false,
            Description: "Tham quan và giải trí",
            ShortDescription:
              "Cùng tham quan và vui chơi tại cầu tre dài nhất Việt Nam.",
          },
          {
            Type: 5,
            Duration: "00:30:00",
            IsStarred: false,
            Description: "Tham quan, giải trí",
            ShortDescription:
              "Chụp hình và check-in tại Thành phố Bố Câu - nơi có 400 con chim được nuôi thả tạo nên khung cảnh sân lãng man.",
          },
          {
            Type: 2,
            Duration: "01:00:00",
            IsStarred: true,
            Description: "Dùng bữa tại nhà hàng",
            ShortDescription: "Dùng bữa trưa tại nhà hàng 3*",
          },
          {
            Type: 4,
            Duration: "00:30:00",
            IsStarred: false,
            Description: "Check-out và đi về",
            ShortDescription: "Mọi người cùng trả phòng và kết thúc chuyến đi.",
          },
        ],
      },
    ],
    surcharges: [{ Note: "Phụ phí­ test", GcoinAmount: 10000 }],
    tempOrders: [
      {
        Cart: '{"4":5}',
        Note: null,
        Type: 1,
        Period: 1,
        ServeDates: ["4047-06-23", "4047-06-24"],
        SupplierId: 2,
      },
      {
        Cart: '{"1":1,"2":1,"5":1}',
        Note: null,
        Type: 0,
        Period: 3,
        ServeDates: ["4047-06-23", "4047-06-24"],
        SupplierId: 3,
      },
      {
        Cart: '{"3":1,"7":1,"8":1}',
        Note: null,
        Type: 0,
        Period: 1,
        ServeDates: ["4047-06-23", "4047-06-24"],
        SupplierId: 4,
      },
    ],
    travelDuration: "5:00:00 AM",
  },
];
