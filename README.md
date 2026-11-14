# Hệ thống Quản lý Sinh viên

Ứng dụng quản lý sinh viên full-stack gồm giao diện React, REST API Express và MongoDB. Repo cũng có Docker Compose để chạy toàn bộ stack cục bộ và GitHub Actions để kiểm thử, build image, triển khai lên Azure Container Apps.

## Lấy mã nguồn

```bash
git clone https://github.com/NguyenVanTam16092005/DevOps-main1.git
cd DevOps-main1
```

## Chức năng hiện có

- Đăng nhập và giao diện theo vai trò quản trị viên, giảng viên, sinh viên.
- Quản lý tài khoản, sinh viên, giảng viên và danh mục.
- Xem thông báo và nhật ký hoạt động.
- API backend cung cấp các nhóm endpoint `/api/auth`, `/api/users`, `/api/students`, `/api/teachers`, `/api/categories`, `/api/notifications` và `/api/logs`.
- Backend xuất Prometheus metrics tại `/metrics`.

> Một số nội dung trên dashboard giảng viên/sinh viên đang dùng dữ liệu mẫu phía frontend.

## Công nghệ

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Axios.
- **Backend:** Node.js 20, Express, Mongoose, MongoDB.
- **Kiểm thử:** Jest và Supertest cho backend; Vitest cho frontend.
- **DevOps:** Docker, Docker Compose, GitHub Actions, SonarCloud, GHCR, Azure Container Apps, Prometheus và Grafana.

## Chạy cục bộ

### Yêu cầu

- Node.js 20 trở lên và npm.
- MongoDB chạy cục bộ hoặc một MongoDB connection URI.

### Backend

Từ thư mục gốc, tạo `Backend/.env`:

```env
PORT=8070
MONGO_URL=mongodb://127.0.0.1:27017/quanlysinhvien
```

Sau đó chạy:

```bash
cd Backend
npm ci
npm run dev
```

API mặc định chạy tại `http://localhost:8070`. Có thể cấu hình `MONGODB_URL` thay cho `MONGO_URL`; `DNS_SERVERS` là tùy chọn.

### Frontend

Mở terminal khác:

```bash
cd Frontend
npm ci
npm start
```

Vite chạy tại `http://localhost:3000`. Mặc định frontend gọi API ở `http://localhost:8070/api`. Nếu backend chạy ở địa chỉ khác, tạo `Frontend/.env.local` và đặt:

```env
VITE_API_URL=http://localhost:8070/api
```

## Chạy bằng Docker Compose

Từ thư mục gốc:

```bash
docker compose up --build
```

Compose khởi chạy MongoDB, backend, frontend, Prometheus và Grafana. Các địa chỉ mặc định:

| Dịch vụ | Địa chỉ |
| --- | --- |
| Frontend | `http://localhost` |
| Backend API | `http://localhost:8070` |
| Prometheus | `http://localhost:9090` |
| Grafana | `http://localhost:3001` |
| MongoDB | `localhost:27017` |

Compose thiết lập MongoDB và `MONGO_URL` cho backend, không cần tạo file `.env` để dùng cấu hình mặc định này. Grafana trong cấu hình Compose hiện dùng mật khẩu mẫu `admin`; chỉ dùng trong môi trường local và đổi mật khẩu trước khi mở dịch vụ ra bên ngoài. Để dừng các container, chạy `docker compose down`; dữ liệu MongoDB được giữ trong Docker volume.

## Kiểm thử và build

```bash
# Backend tests
cd Backend
npm test

# Frontend tests chạy một lượt
cd ../Frontend
npm test -- --run
npm run build
```

## CI/CD và triển khai Azure

Workflow [`.github/workflows/devops-pipeline.yml`](.github/workflows/devops-pipeline.yml) chạy kiểm thử backend và build frontend trên pull request hoặc push lên `main`/`develop`. Chỉ push lên hai nhánh đó mới build/push Docker images lên GHCR và triển khai Azure Container Apps:

- `develop` dùng GitHub Environment `staging`.
- `main` dùng GitHub Environment `production`.
- Image được gắn tag commit SHA; workflow kiểm tra endpoint sau khi triển khai.
- SonarCloud được gọi trong job kiểm thử backend, nhưng lỗi bước phân tích không làm job thất bại.

Workflow cập nhật **các Azure Container Apps đã được tạo sẵn**, không tự tạo tài nguyên Azure. Trước khi triển khai, tạo hai Container Apps có ingress external trong mỗi môi trường:

- Backend: target port `8070`.
- Frontend: target port `8080`.

Thiết lập các GitHub Environments `staging` và `production` với giá trị phù hợp cho từng môi trường:

| Tên | Loại | Mục đích |
| --- | --- | --- |
| `AZURE_CLIENT_ID` | Secret | Microsoft Entra application client ID dùng với OIDC |
| `AZURE_TENANT_ID` | Secret | Entra tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Secret | Azure subscription chứa Container Apps |
| `MONGO_URL` | Secret | MongoDB connection URI |
| `AZURE_RESOURCE_GROUP` | Variable | Resource group |
| `BACKEND_CONTAINER_APP` | Variable | Tên Container App backend |
| `FRONTEND_CONTAINER_APP` | Variable | Tên Container App frontend |

Cấu hình federated credential của Entra cho GitHub OIDC, issuer `https://token.actions.githubusercontent.com`, audience `api://AzureADTokenExchange`, và subject theo repo/environment, ví dụ:

```text
repo:<OWNER>/<REPO>:environment:staging
repo:<OWNER>/<REPO>:environment:production
```

Danh tính này cần quyền cập nhật Container Apps trong resource group. Workflow không cấu hình registry credentials cho Azure Container Apps; các package GHCR cần public để Azure pull image theo cấu hình hiện tại. Chỉ đặt public nếu chấp nhận image có thể được tải công khai.

Frontend image được build với `VITE_API_URL=https://<backend-app-fqdn>/api`. Nếu thay backend Container App hoặc hostname, workflow sẽ dùng hostname mới khi build frontend. Không commit connection URI, token hoặc secret vào repository.

### Khắc phục lỗi HTTP 503 sau khi deploy

Nếu job `Verify deployed endpoints` liên tục nhận HTTP 503, Azure Container Apps chưa có replica sẵn sàng phục vụ request. Workflow kiểm tra backend trước frontend, nên xem log của Container App backend trước:

1. Trong Azure Portal, mở backend Container App và kiểm tra revision mới nhất có trạng thái **Healthy** và có replica đang chạy.
2. Xem **Log stream** hoặc **Logs** để tìm lỗi khởi động, lỗi pull image hoặc không kết nối được MongoDB.
3. Xác nhận ingress đang bật external, target port là `8070`, và `MONGO_URL` đang tham chiếu đúng secret `mongo-url`.
4. Sau khi xử lý nguyên nhân, chạy lại workflow trên nhánh deploy tương ứng.

Không nên bỏ bước kiểm tra endpoint để che lỗi: job chỉ thành công khi ứng dụng thực sự trả phản hồi thành công.
