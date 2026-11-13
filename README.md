<h1 align="center">MERN Student Management System (DevOps Edition)</h1>
<h5 align="center">Hệ thống Quản lý Sinh viên Fullstack MERN tích hợp CI/CD, Docker & Kiểm thử tự động</h5>

<br/>

## 📖 Giới thiệu (Overview)
Đây là dự án Quản lý Sinh viên được xây dựng trên nền tảng **MERN Stack** (MongoDB, Express, React, Node.js). Dự án không chỉ cung cấp các tính năng quản lý học vụ mà còn được tích hợp sâu các quy trình **DevOps** hiện đại bao gồm CI/CD Pipeline, Kiểm thử tự động, Quản lý chất lượng mã nguồn và Triển khai tự động.

## ✨ Chức năng chính (Key Features)
Hệ thống được thiết kế với 3 phân quyền người dùng chuyên biệt:
- **👨‍💼 Admin:** Quản lý toàn bộ hệ thống, quản lý tài khoản, sinh viên/giảng viên, phân công thời khóa biểu.
- **👩‍🏫 Giảng viên (Teacher):** Xem thời khóa biểu giảng dạy, quản lý điểm số, điểm danh lớp học.
- **👨‍🎓 Sinh viên (Student):** Xem thời khóa biểu cá nhân, theo dõi bảng điểm, kết quả học tập.

## 🚀 Kiến trúc DevOps (DevOps Architecture)
Dự án được xây dựng với quy trình tự động hóa hoàn chỉnh:
- **CI/CD Pipeline:** Vận hành thông qua GitHub Actions.
- **Tự động kiểm thử:** Unit Test & Integration Test cho Backend với Jest & Supertest.
- **Kiểm soát chất lượng:** Quét và phân tích mã nguồn với SonarQube (SonarCloud).
- **Containerization:** Đóng gói ứng dụng tối ưu bằng Docker (Multi-stage build).
- **Triển khai tự động:** GitHub Actions đẩy image public lên GitHub Container Registry (GHCR) và dùng Azure OIDC cập nhật Azure Container Apps (ACA); `develop` là staging, `main` là production.

## 🛠️ Công nghệ sử dụng (Technologies)
### Frontend
- **React.js & Vite** - Xây dựng giao diện UI tốc độ cao
- **React Router** - Quản lý điều hướng
- **TailwindCSS / Bootstrap** - Thiết kế giao diện
- **Axios** - Tương tác API

### Backend & Database
- **Node.js & Express.js** - Xây dựng RESTful API
- **MongoDB & Mongoose** - Cơ sở dữ liệu NoSQL
- **Jest & Supertest** - Framework kiểm thử

### DevOps Tools
- **Git & GitHub Actions**
- **Docker & Docker Compose**
- **SonarQube**
- **GitHub Container Registry & Azure Container Apps**
- **GitHub Actions OIDC**

## ⚙️ Cài đặt & Khởi chạy cục bộ (Setup & Run Locally)

**1. Clone dự án:**
```bash
git clone https://github.com/TinsHuynh/DevOps.git
cd DevOps
```

**2. Khởi chạy Backend:**
Mở terminal 1:
```bash
cd Backend
npm install
#Tạo file .env và cấu hình: PORT=8071, MONGO_URL=<your_mongodb_uri>, DNS_SERVERS=1.1.1.1,8.8.8.8.
npm run dev
```

**3. Khởi chạy Frontend:**
Mở terminal 2:
```bash
cd Frontend
npm install
npm start
```

## 🐳 Khởi chạy bằng Docker Compose
Nếu máy bạn đã cài sẵn Docker, chỉ cần chạy một lệnh duy nhất ở thư mục gốc:
```bash
docker-compose up -d --build
```
Hệ thống sẽ tự động build image và chạy cả Frontend lẫn Backend trong các container.

## ☁️ Triển khai lên Azure Container Apps bằng GitHub Actions

Workflow `.github/workflows/devops-pipeline.yml` được tách thành các giai đoạn: **Test backend + build frontend** → **Build Docker images và push lên GHCR** → **Deploy lên Azure Container Apps + kiểm tra endpoint**. Chỉ các lần **push** lên `develop` hoặc `main` mới build/push Docker image và triển khai; Pull Request chỉ chạy kiểm tra mã nguồn. `develop` dùng GitHub Environment `staging`, còn `main` dùng `production`. Mỗi lần triển khai gắn image bằng commit SHA, không dùng tag `latest`.

Lưu ý: workflow hiện chạy khi có bất kỳ thay đổi nào được push lên `main` hoặc `develop`, kể cả chỉ sửa tài liệu; các push đó cũng kích hoạt deploy môi trường tương ứng.

Workflow **không tạo Azure resources**. Trước khi bật CI/CD, hãy tạo sẵn trong mỗi môi trường:

1. Hai Azure Container Apps hiện hữu trong Container Apps Environment: một cho backend, một cho frontend. Bật ingress external; backend target port `8070`, frontend target port `8080`. Backend `/` trả trạng thái JSON và được workflow dùng để kiểm tra sau triển khai.
2. Workflow publish các image lên GHCR. GitHub thường tạo package mới ở chế độ private, nên lần chạy đầu có thể build/push thành công nhưng deploy Azure thất bại khi Container Apps pull image. Sau khi hai package xuất hiện trong GitHub **Profile → Packages**, mở từng package → **Package settings → Change visibility → Public**, rồi chạy lại workflow. Azure Container Apps cần package public để pull mà không cần registry credentials. Chỉ dùng cách này nếu chấp nhận image ứng dụng được tải công khai.
3. Cấp danh tính triển khai GitHub quyền cập nhật Container Apps trong resource group. Dùng quyền tối thiểu phù hợp chính sách Azure của bạn; ví dụ `Azure Container Apps Contributor` ở resource group, cộng quyền đọc resource nếu cấu hình subscription yêu cầu. Workflow không còn cần quyền `AcrPush` hoặc cấu hình ACR.
4. Cấu hình MongoDB Atlas để chấp nhận kết nối mạng outbound của Container Apps hoặc thiết lập private networking phù hợp. Workflow cài connection URI vào Container App như secret `mongo-url`, rồi tham chiếu nó bằng biến runtime `MONGO_URL`; không lưu URI trong repository.

> Backend chỉ ghi thông báo kết nối MongoDB thành công và đã redact URI khỏi thông báo lỗi. URI được truyền vào Container App qua secret runtime `MONGO_URL`, không được ghi vào repository hoặc log.
>
> Các file `.env` được ignore cho các thay đổi sau này. Nếu `Backend/.env` từng được commit, cần bỏ nó khỏi Git tracking/history và rotate các credential bên trong; việc thêm ignore không xóa dữ liệu đã commit.

### Thiết lập GitHub OIDC và Environments

Trong Azure, tạo/cấu hình ứng dụng Microsoft Entra (service principal) cho federated credentials của GitHub Actions. Dùng issuer `https://token.actions.githubusercontent.com`, audience `api://AzureADTokenExchange`, và subject theo repo/Environment, ví dụ:

```text
repo:<OWNER>/<REPO>:environment:staging
repo:<OWNER>/<REPO>:environment:production
```

Thay `<OWNER>/<REPO>` bằng tên repo thực tế. Không cần client secret/password Azure trong GitHub; workflow dùng `azure/login@v2` với OIDC.

Tạo GitHub Environments tên chính xác `staging` và `production`. Thêm các mục dưới đây vào **cả hai** Environments (giá trị resource có thể khác nhau giữa staging và production):

| Tên | Loại | Giá trị |
| --- | --- | --- |
| `AZURE_CLIENT_ID` | Secret | Client ID của ứng dụng Entra đã cấu hình federated OIDC |
| `AZURE_TENANT_ID` | Secret | Tenant ID của Entra |
| `AZURE_SUBSCRIPTION_ID` | Secret | Subscription ID chứa resources |
| `MONGO_URL` | Secret | MongoDB Atlas connection URI đầy đủ; chỉ lưu trong GitHub/Azure secret stores |
| `AZURE_RESOURCE_GROUP` | Variable | Resource group chứa Container Apps |
| `BACKEND_CONTAINER_APP` | Variable | Tên Container App backend |
| `FRONTEND_CONTAINER_APP` | Variable | Tên Container App frontend |

Đảm bảo tên/giá trị đúng cho từng environment và OIDC federated credential cho đúng `staging`/`production`. Thiếu biến, secret, resource, ingress hay quyền Azure sẽ làm job thất bại; workflow không báo deploy thành công khi thiếu cấu hình.

### Ports, API URL và kiểm tra

- Backend chạy trên `PORT=8070`, kết nối Atlas qua secret runtime `MONGO_URL`.
- Frontend được build trong Docker với `VITE_API_URL=https://<backend-app-fqdn>/api`. Đây là URL public của API, không phải secret. Cập nhật app backend hiện có sẽ giữ hostname; nếu thay app hoặc hostname thì frontend image lấy hostname hiện tại ở mỗi lần chạy workflow.
- GitHub Actions hiển thị riêng job `test-and-analyze-backend`, `build-frontend`, `build-docker-images` và `deploy-azure-container-apps`. Job Docker chỉ chạy sau khi test và frontend build thành công; job deploy chỉ chạy sau khi hai image được push thành công. Có thể kiểm tra run summary và log từng job trong GitHub Actions.
- Workflow cập nhật secret MongoDB trước khi đổi image backend; việc đổi image tạo revision mới, revision này nhận secret mới mà không cần thao tác restart riêng.
- Nếu Azure chưa được chuẩn bị, hãy tạo/cấu hình resources và GitHub Environments trước khi push lên nhánh deploy. Không commit URI Atlas, token, hay client secrets vào `.env`, workflow hoặc README.
