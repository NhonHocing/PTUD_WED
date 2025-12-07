const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management API',
      version: '1.0.0',
      description: 'API documentation cho hệ thống quản lý mượn sách thư viện',
      contact: {
        name: 'API Support',
        email: 'support@library.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server',
      },
      {
        url: 'https://api.library.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT token được cấp sau khi đăng nhập',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID của người dùng',
            },
            username: {
              type: 'string',
              description: 'Tên đăng nhập',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email',
            },
            fullName: {
              type: 'string',
              description: 'Họ và tên',
            },
            phone: {
              type: 'string',
              description: 'Số điện thoại',
            },
            address: {
              type: 'string',
              description: 'Địa chỉ',
            },
            role: {
              type: 'string',
              enum: ['reader', 'staff'],
              description: 'Vai trò: reader (độc giả) hoặc staff (nhân viên)',
            },
            isActive: {
              type: 'boolean',
              description: 'Trạng thái tài khoản',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Book: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            title: {
              type: 'string',
              description: 'Tên sách',
            },
            author: {
              type: 'string',
              description: 'Tác giả',
            },
            isbn: {
              type: 'string',
              description: 'Mã ISBN',
            },
            publisher: {
              type: 'string',
              description: 'ID nhà xuất bản',
            },
            publishYear: {
              type: 'number',
              description: 'Năm xuất bản',
            },
            category: {
              type: 'string',
              description: 'Thể loại',
            },
            description: {
              type: 'string',
              description: 'Mô tả',
            },
            totalCopies: {
              type: 'number',
              description: 'Tổng số bản',
            },
            availableCopies: {
              type: 'number',
              description: 'Số bản có sẵn',
            },
            coverImage: {
              type: 'string',
              description: 'URL ảnh bìa',
            },
            status: {
              type: 'string',
              enum: ['available', 'unavailable'],
              description: 'Trạng thái',
            },
          },
        },
        Publisher: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
              description: 'Tên nhà xuất bản',
            },
            address: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            description: {
              type: 'string',
            },
          },
        },
        BorrowRequest: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            reader: {
              type: 'string',
              description: 'ID độc giả',
            },
            book: {
              type: 'string',
              description: 'ID sách',
            },
            requestDate: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected', 'cancelled'],
            },
            expectedBorrowDate: {
              type: 'string',
              format: 'date',
            },
            expectedReturnDate: {
              type: 'string',
              format: 'date',
            },
            note: {
              type: 'string',
            },
          },
        },
        BorrowSlip: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            slipNumber: {
              type: 'string',
              description: 'Số phiếu mượn',
            },
            reader: {
              type: 'string',
              description: 'ID độc giả',
            },
            book: {
              type: 'string',
              description: 'ID sách',
            },
            borrowDate: {
              type: 'string',
              format: 'date-time',
            },
            expectedReturnDate: {
              type: 'string',
              format: 'date',
            },
            actualReturnDate: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
              enum: ['borrowed', 'returned', 'overdue'],
            },
            fine: {
              type: 'number',
              description: 'Tiền phạt',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Thông báo lỗi',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'API xác thực người dùng',
      },
      {
        name: 'Books',
        description: 'API quản lý sách',
      },
      {
        name: 'Publishers',
        description: 'API quản lý nhà xuất bản',
      },
      {
        name: 'Borrow Requests',
        description: 'API quản lý yêu cầu mượn sách',
      },
      {
        name: 'Borrow Slips',
        description: 'API quản lý phiếu mượn-trả sách',
      },
      {
        name: 'Users',
        description: 'API quản lý người dùng',
      },
      {
        name: 'Health',
        description: 'API kiểm tra trạng thái server',
      },
    ],
  },
  apis: ['./routes/*.js', './server.js'], // Đường dẫn đến các file chứa JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

