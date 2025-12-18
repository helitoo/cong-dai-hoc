import { ReactNode } from "react";

export type HldType = "r" | "i" | "a" | "s" | "e" | "c";

export type FreqNode = {
  hldType: HldType;
  label: ReactNode;
  score: -1 | 0 | 1;
};

export type OpnNode = {
  topic: ReactNode;
  freqNodes: FreqNode[];
};

export type HldQuestions = {
  hldQuestions: OpnNode[];
};

export const hldQuestions: OpnNode[] = [
  {
    topic: (
      <>
        <p>
          Trong phòng thực hành, nhóm bạn phát hiện một thiết bị điện tử nhỏ bị
          lỗi.
        </p>
        <p>Bạn có xu hướng làm gì đầu tiên?</p>
      </>
    ),
    freqNodes: [
      {
        hldType: "r",
        label: (
          <>Kiểm tra lại dây nối, nguồn điện hoặc thử chỉnh lại thiết bị.</>
        ),
        score: 0,
      },
      {
        hldType: "i",
        label: <>Suy nghĩ nguyên nhân gây lỗi.</>,
        score: 0,
      },
      {
        hldType: "a",
        label: <>Tạm thay thế bằng một thiết bị khác để kịp deadline nhóm.</>,
        score: 0,
      },
      {
        hldType: "s",
        label: <>Gọi người có kinh nghiệm đến để xin hỗ trợ.</>,
        score: 0,
      },
      {
        hldType: "e",
        label: <>Đề xuất nhóm phân công người kiểm tra và người ghi lại lỗi.</>,
        score: 0,
      },
      {
        hldType: "c",
        label: <>Xem lại tài liệu hướng dẫn sử dụng để khắc phục.</>,
        score: 0,
      },
    ],
  },
  {
    topic: (
      <>
        <p>
          Nhóm bạn đang làm thí nghiệm thực hành môn Hóa học. Dù đã rất bám sát
          SGK nhưng kết quả thí nghiệm khác hẳn so với lý thuyết.
        </p>
        <p>Bạn sẽ phản ứng như thế nào?</p>
      </>
    ),
    freqNodes: [
      {
        hldType: "i",
        label: <>Xem lại quá trình thực hành để tìm ra nguyên nhân.</>,
        score: 0,
      },
      {
        hldType: "a",
        label: (
          <>
            Tìm cách khác để thực hành lại thí nghiệm, không tuân theo SGK nữa.
          </>
        ),
        score: 0,
      },
      {
        hldType: "s",
        label: (
          <>Hỏi giáo viên hoặc bạn bè xem họ có gặp vấn đề tương tự không.</>
        ),
        score: 0,
      },
      {
        hldType: "e",
        label: <>Hỏi thăm ý kiến các thành viên khác trước tiên.</>,
        score: 0,
      },
      {
        hldType: "c",
        label: <>Đọc kỹ lại SGK để tìm ra sai sót.</>,
        score: 0,
      },
      {
        hldType: "r",
        label: <>Bắt tay làm lại thí nghiệm ngay.</>,
        score: 0,
      },
    ],
  },
  {
    topic: (
      <>
        <p>GVCN giao cho nhm bạn thiết kế báo tường mừng ngày 20/11.</p>
        <p>Bạn sẽ đóng góp như thế nào?</p>
      </>
    ),
    freqNodes: [
      {
        hldType: "a",
        label: <>Ưu tiên sự sáng tạo, phá cách.</>,
        score: 0,
      },
      {
        hldType: "s",
        label: <>Hỏi ý kiến các thành viên khác xem họ có ý tưởng gì không.</>,
        score: 0,
      },
      {
        hldType: "e",
        label: (
          <>
            Nhận trách nhiệm nhóm trưởng điều phối nhóm, không tham gia vẽ trực
            tiếp.
          </>
        ),
        score: 0,
      },
      {
        hldType: "c",
        label: <>Tìm kiếm thông tin, thông điệp để đưa lên báo tường.</>,
        score: 0,
      },
      {
        hldType: "i",
        label: <>Kiểm chứng, xác minh tài liệu mọi người giao là chính.</>,
        score: 0,
      },
      {
        hldType: "r",
        label: <>Chuẩn bị khâu in ấn, trưng bày.</>,
        score: 0,
      },
    ],
  },
  {
    topic: (
      <>
        <p>
          Nhóm được trường Đại học đang theo học quay về trường cũ để hướng
          nghiệp cho học sinh THPT.
        </p>
        <p>Bạn muốn làm gì nhất?</p>
      </>
    ),
    freqNodes: [
      {
        hldType: "s",
        label: <>Giới thiệu, hướng dẫn và giúp học sinh giải đáp thắc mắc.</>,
        score: 0,
      },
      {
        hldType: "e",
        label: <>Điều phối hoạt động.</>,
        score: 0,
      },
      {
        hldType: "c",
        label: <>Quản lý danh sách, tài liệu và điểm danh.</>,
        score: 0,
      },
      {
        hldType: "a",
        label: (
          <>Nghĩ ra trò chơi hoặc hoạt động tương tác giúp không khí vui vẻ.</>
        ),
        score: 0,
      },
      {
        hldType: "i",
        label: <>Giải thích các vấn đề chuyên ngành cho học sinh.</>,
        score: 0,
      },
      {
        hldType: "r",
        label: <>Sắp xếp bàn ghế, chuẩn bị khu vực sự kiện.</>,
        score: 0,
      },
    ],
  },
  {
    topic: (
      <>
        <p>
          Khi sắp đến mùa thi và bạn có khá nhiều thứ cần phải ôn, bạn thường
          bắt đầu như thế nào?
        </p>
      </>
    ),
    freqNodes: [
      {
        hldType: "c",
        label: <>Lập kế hoạch học theo từng môn.</>,
        score: 0,
      },
      {
        hldType: "i",
        label: <>Ưu tiên học sâu, hiểu bản chất.</>,
        score: 0,
      },
      {
        hldType: "e",
        label: <>Rủ thêm bạn bè học theo nhóm.</>,
        score: 0,
      },
      {
        hldType: "s",
        label: <>Hỏi thăm đàn anh, đàn chị.</>,
        score: 0,
      },
      {
        hldType: "r",
        label: <>Tìm và in tài liệu ra trước tiên.</>,
        score: 0,
      },
      {
        hldType: "a",
        label: <>Tự soạn tài liệu để học.</>,
        score: 0,
      },
    ],
  },
  {
    topic: (
      <>
        <p>Nhóm bạn chuẩn bị tham gia một cuộc thi khởi nghiệp kinh doanh.</p>
        <p>Bạn muốn đảm nhận khâu nào nhất?</p>
      </>
    ),
    freqNodes: [
      {
        hldType: "e",
        label: (
          <>Trình bày ý tưởng, thuyết phục ban giám khảo và dẫn dắt nhóm.</>
        ),
        score: 0,
      },
      {
        hldType: "a",
        label: <>Xây dựng video, poster cho ý tưởng.</>,
        score: 0,
      },
      {
        hldType: "i",
        label: <>Phân tích thị trường, khảo sát số liệu.</>,
        score: 0,
      },
      {
        hldType: "c",
        label: <>Soạn kế hoạch tài chính, bảng chi phí, timeline dự án.</>,
        score: 0,
      },
      {
        hldType: "s",
        label: <>Lắng nghe, kết nối thành viên, thuyết trình.</>,
        score: 0,
      },
      {
        hldType: "r",
        label: <>Chuẩn bị tài nguyên, đạo cụ, thiết bị.</>,
        score: 0,
      },
    ],
  },
];
