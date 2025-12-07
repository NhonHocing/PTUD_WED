const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Publisher = require('../models/Publisher');
const Book = require('../models/Book');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const getBookCoverImage = (isbn) => {
  const cleanIsbn = isbn.replace(/-/g, '');
  return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
};

const addSelfHelpBooks = async () => {
  try {
    await connectDB();

    // Lấy hoặc tạo nhà xuất bản phù hợp
    let publisher = await Publisher.findOne({ name: 'Nhà xuất bản Tổng hợp TP.HCM' });
    if (!publisher) {
      publisher = await Publisher.findOne({ name: 'Nhà xuất bản Trẻ' });
    }
    if (!publisher) {
      // Tạo nhà xuất bản mới nếu không có
      publisher = await Publisher.create({
        name: 'Nhà xuất bản Tổng hợp TP.HCM',
        address: '62 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
        phone: '02839316289',
        email: 'nxbtonghop@hcm.vnn.vn',
      });
    }

    const selfHelpBooks = [
      {
        title: 'Atomic Habits - Thói Quen Nguyên Tử',
        author: 'James Clear',
        isbn: '9786043075001',
        publisher: publisher._id,
        publishYear: 2022,
        category: 'Self-help',
        description: 'Cuốn sách về cách xây dựng thói quen tốt và loại bỏ thói quen xấu thông qua những thay đổi nhỏ nhưng có tác động lớn. Tác giả giải thích cách các thói quen nhỏ có thể tạo ra những kết quả đáng kinh ngạc theo thời gian.',
        totalCopies: 15,
        availableCopies: 15,
        coverImage: getBookCoverImage('9786043075001'),
        status: 'available',
      },
      {
        title: 'The Power of Now - Sức Mạnh Của Hiện Tại',
        author: 'Eckhart Tolle',
        isbn: '9786043075002',
        publisher: publisher._id,
        publishYear: 2021,
        category: 'Self-help',
        description: 'Hướng dẫn về cách sống trong hiện tại và giải phóng bản thân khỏi những lo lắng về quá khứ và tương lai. Cuốn sách giúp bạn tìm thấy sự bình yên và hạnh phúc thực sự.',
        totalCopies: 12,
        availableCopies: 12,
        coverImage: getBookCoverImage('9786043075002'),
        status: 'available',
      },
      {
        title: 'Think and Grow Rich - Nghĩ Giàu Làm Giàu',
        author: 'Napoleon Hill',
        isbn: '9786043075003',
        publisher: publisher._id,
        publishYear: 2020,
        category: 'Self-help',
        description: 'Cuốn sách kinh điển về thành công và làm giàu. Tác giả tiết lộ 13 nguyên tắc thành công được rút ra từ nghiên cứu về những người giàu có và thành công nhất.',
        totalCopies: 18,
        availableCopies: 18,
        coverImage: getBookCoverImage('9786043075003'),
        status: 'available',
      },
      {
        title: 'The 7 Habits of Highly Effective People - 7 Thói Quen Của Người Thành Đạt',
        author: 'Stephen R. Covey',
        isbn: '9786043075004',
        publisher: publisher._id,
        publishYear: 2021,
        category: 'Self-help',
        description: 'Bảy thói quen quan trọng giúp bạn trở nên hiệu quả và thành công trong công việc và cuộc sống. Từ tính chủ động đến tư duy cùng thắng, cuốn sách cung cấp một framework toàn diện.',
        totalCopies: 14,
        availableCopies: 14,
        coverImage: getBookCoverImage('9786043075004'),
        status: 'available',
      },
      {
        title: 'The Subtle Art of Not Giving a F*ck - Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm',
        author: 'Mark Manson',
        isbn: '9786043075005',
        publisher: publisher._id,
        publishYear: 2022,
        category: 'Self-help',
        description: 'Một cách tiếp cận mới mẻ và thẳng thắn về việc sống một cuộc đời tốt đẹp. Tác giả khuyến khích bạn tập trung vào những gì thực sự quan trọng và bỏ qua những điều không cần thiết.',
        totalCopies: 16,
        availableCopies: 16,
        coverImage: getBookCoverImage('9786043075005'),
        status: 'available',
      },
      {
        title: 'How to Win Friends and Influence People - Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        isbn: '9786043075006',
        publisher: publisher._id,
        publishYear: 2020,
        category: 'Self-help',
        description: 'Cuốn sách nổi tiếng về nghệ thuật giao tiếp và xây dựng mối quan hệ. Cung cấp những nguyên tắc vàng để thu hút người khác và tạo ảnh hưởng tích cực.',
        totalCopies: 20,
        availableCopies: 20,
        coverImage: getBookCoverImage('9786043075006'),
        status: 'available',
      },
      {
        title: 'The 4-Hour Workweek - Tuần Làm Việc 4 Giờ',
        author: 'Tim Ferriss',
        isbn: '9786043075007',
        publisher: publisher._id,
        publishYear: 2021,
        category: 'Self-help',
        description: 'Hướng dẫn cách thoát khỏi công việc 9-5 truyền thống và xây dựng một lối sống tự do, làm việc ít hơn nhưng kiếm được nhiều hơn thông qua tự động hóa và ủy quyền.',
        totalCopies: 13,
        availableCopies: 13,
        coverImage: getBookCoverImage('9786043075007'),
        status: 'available',
      },
      {
        title: 'Mindset: The New Psychology of Success - Tư Duy Phát Triển',
        author: 'Carol S. Dweck',
        isbn: '9786043075008',
        publisher: publisher._id,
        publishYear: 2022,
        category: 'Self-help',
        description: 'Khám phá sự khác biệt giữa tư duy cố định và tư duy phát triển. Cuốn sách giải thích cách thay đổi tư duy có thể thay đổi cuộc đời bạn và giúp bạn đạt được thành công lớn hơn.',
        totalCopies: 11,
        availableCopies: 11,
        coverImage: getBookCoverImage('9786043075008'),
        status: 'available',
      },
      {
        title: 'The Miracle Morning - Buổi Sáng Kỳ Diệu',
        author: 'Hal Elrod',
        isbn: '9786043075009',
        publisher: publisher._id,
        publishYear: 2021,
        category: 'Self-help',
        description: 'Phương pháp SAVERS (Silence, Affirmations, Visualization, Exercise, Reading, Scribing) để biến đổi cuộc sống của bạn chỉ bằng cách thay đổi thói quen buổi sáng. Một giờ mỗi sáng có thể thay đổi mọi thứ.',
        totalCopies: 17,
        availableCopies: 17,
        coverImage: getBookCoverImage('9786043075009'),
        status: 'available',
      },
      {
        title: 'You Are a Badass - Bạn Là Một Kẻ Tuyệt Vời',
        author: 'Jen Sincero',
        isbn: '9786043075010',
        publisher: publisher._id,
        publishYear: 2022,
        category: 'Self-help',
        description: 'Một cuốn sách đầy năng lượng và hài hước về cách vượt qua những nghi ngờ và sợ hãi của bản thân để sống cuộc đời mà bạn thực sự muốn. Tác giả khuyến khích bạn tin vào chính mình và hành động.',
        totalCopies: 15,
        availableCopies: 15,
        coverImage: getBookCoverImage('9786043075010'),
        status: 'available',
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const bookData of selfHelpBooks) {
      // Kiểm tra xem sách đã tồn tại chưa (theo ISBN)
      const existingBook = await Book.findOne({ isbn: bookData.isbn });
      if (existingBook) {
        console.log(`Đã tồn tại: ${bookData.title} (ISBN: ${bookData.isbn})`);
        skippedCount++;
        continue;
      }

      try {
        const book = await Book.create(bookData);
        console.log(`✓ Đã tạo: ${book.title}`);
        createdCount++;
      } catch (error) {
        console.error(`✗ Lỗi khi tạo "${bookData.title}":`, error.message);
      }
    }

    console.log('\n=== Kết quả ===');
    console.log(`Đã tạo mới: ${createdCount} cuốn sách`);
    console.log(`Đã bỏ qua (đã tồn tại): ${skippedCount} cuốn sách`);
    console.log(`Tổng cộng: ${selfHelpBooks.length} cuốn sách self-help`);

    await mongoose.connection.close();
    console.log('\nĐã đóng kết nối database');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

addSelfHelpBooks();

